import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common'
import type { Device } from '@prisma/client'
import { LocalNetworkDiscoveryService } from '../discovery/local-network-discovery.service'
import type { DeviceObservation } from '../discovery/discovery.types'
import { PrismaService } from '../prisma/prisma.service'

const MISSED_SCANS_BEFORE_OFFLINE = 2

@Injectable()
export class DevicesService {
  private readonly logger = new Logger(DevicesService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly discovery: LocalNetworkDiscoveryService,
  ) {}

  async list(): Promise<Device[]> {
    try {
      return await this.prisma.device.findMany({ orderBy: { lastSeen: 'desc' } })
    } catch {
      this.logger.error('Device registry query failed. Verify DATABASE_URL and apply Prisma migrations.')
      throw new ServiceUnavailableException('The device registry is unavailable until its database is configured.')
    }
  }

  async findById(id: string): Promise<Device | null> {
    try {
      return await this.prisma.device.findUnique({ where: { id } })
    } catch {
      this.logger.error('Device registry lookup failed. Verify DATABASE_URL and apply Prisma migrations.')
      throw new ServiceUnavailableException('The device registry is unavailable until its database is configured.')
    }
  }

  async discoverAndSync(): Promise<Device[]> {
    const observations = await this.discovery.discover()
    const observedIds: string[] = []

    try {
      for (const observation of observations) {
        const device = await this.upsertObservation(observation)
        observedIds.push(device.id)
      }

      await this.prisma.device.updateMany({
        where: observedIds.length > 0 ? { id: { notIn: observedIds } } : {},
        data: { missedScans: { increment: 1 } },
      })
      await this.prisma.device.updateMany({
        where: { missedScans: { gte: MISSED_SCANS_BEFORE_OFFLINE }, isOnline: true },
        data: { isOnline: false },
      })

      this.logger.log(`Device registry synchronized with ${observations.length} local-network observations.`)
      return this.list()
    } catch {
      this.logger.error('Device registry synchronization failed. Verify DATABASE_URL and apply Prisma migrations.')
      throw new ServiceUnavailableException('Discovery completed, but the device registry could not be updated.')
    }
  }

  private async upsertObservation(observation: DeviceObservation): Promise<Device> {
    const normalizedMac = observation.mac?.replace(/-/g, ':').toUpperCase() ?? null
    const identityKey = normalizedMac ? `mac:${normalizedMac}` : `ip:${observation.ip}`
    const now = new Date()

    if (normalizedMac) {
      const existingByIp = await this.prisma.device.findFirst({
        where: { ip: observation.ip, mac: null },
      })
      if (existingByIp) {
        return this.prisma.device.update({
          where: { id: existingByIp.id },
          data: {
            identityKey,
            mac: normalizedMac,
            hostname: observation.hostname,
            isOnline: true,
            missedScans: 0,
            lastSeen: now,
          },
        })
      }
    }

    return this.prisma.device.upsert({
      where: { identityKey },
      create: {
        identityKey,
        ip: observation.ip,
        mac: normalizedMac,
        hostname: observation.hostname,
        isOnline: true,
        missedScans: 0,
        firstSeen: now,
        lastSeen: now,
      },
      update: {
        ip: observation.ip,
        mac: normalizedMac,
        hostname: observation.hostname,
        isOnline: true,
        missedScans: 0,
        lastSeen: now,
      },
    })
  }
}
