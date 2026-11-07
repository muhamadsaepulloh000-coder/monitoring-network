import assert from 'node:assert/strict'
import { test } from 'node:test'
import { ServiceUnavailableException } from '@nestjs/common'
import { getLocalHostAddresses, LocalNetworkDiscoveryService } from './local-network-discovery.service'
import type { DiscoveryPlatform, LocalNetwork } from './discovery.types'

const testNetwork: LocalNetwork = {
  address: '192.168.100.19',
  prefixLength: 24,
  macAddress: 'AA:BB:CC:DD:EE:FF',
}

test('enumerates only usable addresses in the connected /24 and excludes this host', () => {
  const addresses = getLocalHostAddresses(testNetwork)
  assert.equal(addresses.length, 253)
  assert.equal(addresses[0], '192.168.100.1')
  assert.equal(addresses.at(-1), '192.168.100.254')
  assert.equal(addresses.includes(testNetwork.address), false)
})

test('refuses to scan networks larger than 254 candidate hosts', () => {
  assert.throws(
    () => getLocalHostAddresses({ ...testNetwork, prefixLength: 23 }),
    ServiceUnavailableException,
  )
})

test('refuses to probe public address ranges', () => {
  assert.throws(
    () => getLocalHostAddresses({ ...testNetwork, address: '8.8.8.8' }),
    ServiceUnavailableException,
  )
})

test('returns only reachable hosts or valid ARP neighbors with real metadata lookups', async () => {
  const platform: DiscoveryPlatform = {
    getDefaultNetwork: async () => testNetwork,
    isReachable: async (ip) => ip === '192.168.100.21',
    getNeighbors: async () => [{ ip: '192.168.100.21', mac: 'a0-b1-c2-d3-e4-f5' }],
    resolveHostname: async (ip) => ip === '192.168.100.21' ? 'workstation.local' : null,
  }
  const service = new LocalNetworkDiscoveryService(platform)

  const devices = await service.discover()
  assert.deepEqual(devices, [
    { ip: '192.168.100.19', mac: 'AA:BB:CC:DD:EE:FF', hostname: null },
    { ip: '192.168.100.21', mac: 'A0:B1:C2:D3:E4:F5', hostname: 'workstation.local' },
  ])
})
