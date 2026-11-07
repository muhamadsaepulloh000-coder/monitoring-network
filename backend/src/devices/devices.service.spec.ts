import assert from 'node:assert/strict'
import { test } from 'node:test'
import { DevicesService } from './devices.service'
import type { DeviceObservation } from '../discovery/discovery.types'
import type { LocalNetworkDiscoveryService } from '../discovery/local-network-discovery.service'
import type { PrismaService } from '../prisma/prisma.service'

function createDevice(overrides: Record<string, unknown> = {}) {
  return {
    id: 'device-1',
    identityKey: 'mac:AA:BB:CC:DD:EE:FF',
    ip: '192.168.100.21',
    mac: 'AA:BB:CC:DD:EE:FF',
    hostname: 'workstation.local',
    isOnline: true,
    missedScans: 0,
    firstSeen: new Date('2026-11-07T10:00:00.000Z'),
    lastSeen: new Date('2026-11-07T10:05:00.000Z'),
    createdAt: new Date('2026-11-07T10:00:00.000Z'),
    updatedAt: new Date('2026-11-07T10:05:00.000Z'),
    ...overrides,
  }
}

test('upserts real discovery observations by normalized MAC and increments missed-scan state for unobserved devices', async () => {
  const observation: DeviceObservation = {
    ip: '192.168.100.21',
    mac: 'aa-bb-cc-dd-ee-ff',
    hostname: 'workstation.local',
  }
  const upsertCalls: Array<Record<string, unknown>> = []
  const updateManyCalls: Array<Record<string, unknown>> = []
  const expectedDevice = createDevice()
  const prisma = {
    device: {
      findFirst: async () => null,
      update: async () => expectedDevice,
      upsert: async (args: Record<string, unknown>) => {
        upsertCalls.push(args)
        return expectedDevice
      },
      updateMany: async (args: Record<string, unknown>) => {
        updateManyCalls.push(args)
        return { count: 0 }
      },
      findMany: async () => [expectedDevice],
    },
  } as unknown as PrismaService
  const discovery = {
    discover: async () => [observation],
  } as unknown as LocalNetworkDiscoveryService
  const service = new DevicesService(prisma, discovery)

  const devices = await service.discoverAndSync()

  assert.equal(devices.length, 1)
  assert.equal(upsertCalls.length, 1)
  assert.equal(upsertCalls[0]?.where && (upsertCalls[0].where as { identityKey: string }).identityKey, 'mac:AA:BB:CC:DD:EE:FF')
  assert.equal((upsertCalls[0]?.create as { hostname: string }).hostname, 'workstation.local')
  assert.deepEqual(updateManyCalls[0]?.where, { id: { notIn: ['device-1'] } })
  assert.deepEqual(updateManyCalls[1]?.where, { missedScans: { gte: 2 }, isOnline: true })
})

test('preserves previous last-seen records and marks devices offline only after repeated missed scans', async () => {
  const updateManyCalls: Array<Record<string, unknown>> = []
  const prisma = {
    device: {
      upsert: async () => { throw new Error('No observations should be upserted.') },
      updateMany: async (args: Record<string, unknown>) => {
        updateManyCalls.push(args)
        return { count: 1 }
      },
      findMany: async () => [createDevice({ isOnline: false, missedScans: 2 })],
    },
  } as unknown as PrismaService
  const discovery = { discover: async () => [] } as unknown as LocalNetworkDiscoveryService
  const service = new DevicesService(prisma, discovery)

  const devices = await service.discoverAndSync()

  assert.equal(devices[0]?.isOnline, false)
  assert.deepEqual(updateManyCalls[0]?.where, {})
  assert.deepEqual(updateManyCalls[1]?.data, { isOnline: false })
})
