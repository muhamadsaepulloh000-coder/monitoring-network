import { Inject, Injectable, Logger, ServiceUnavailableException } from '@nestjs/common'
import { DISCOVERY_PLATFORM } from './discovery.types'
import type { DeviceObservation, DiscoveryPlatform, LocalNetwork } from './discovery.types'

const MAX_DISCOVERY_HOSTS = 254
const MAX_CONCURRENT_PROBES = 16

export function getLocalHostAddresses(network: LocalNetwork): string[] {
  const [first, second] = network.address.split('.').map(Number)
  const isPrivateIPv4 = first === 10 ||
    (first === 172 && second !== undefined && second >= 16 && second <= 31) ||
    (first === 192 && second === 168)
  if (!isPrivateIPv4) {
    throw new ServiceUnavailableException('Discovery is restricted to RFC1918 private local networks.')
  }

  if (!Number.isInteger(network.prefixLength) || network.prefixLength < 24 || network.prefixLength > 30) {
    throw new ServiceUnavailableException('Discovery is limited to connected IPv4 networks containing at most 254 hosts.')
  }

  const octets = network.address.split('.').map(Number)
  if (octets.length !== 4 || octets.some((octet) => !Number.isInteger(octet) || octet < 0 || octet > 255)) {
    throw new ServiceUnavailableException('The active network interface did not provide a valid IPv4 address.')
  }

  const hostBits = 32 - network.prefixLength
  const mask = (0xffffffff << hostBits) >>> 0
  const ipNumber = octets.reduce((value, octet) => ((value << 8) | octet) >>> 0, 0)
  const networkAddress = (ipNumber & mask) >>> 0
  const broadcastAddress = (networkAddress | (~mask >>> 0)) >>> 0
  const count = broadcastAddress - networkAddress - 1

  if (count < 1 || count > MAX_DISCOVERY_HOSTS) {
    throw new ServiceUnavailableException('The connected IPv4 network is outside the supported discovery range.')
  }

  const addresses: string[] = []
  for (let host = networkAddress + 1; host < broadcastAddress; host += 1) {
    const address = [(host >>> 24) & 255, (host >>> 16) & 255, (host >>> 8) & 255, host & 255].join('.')
    if (address !== network.address) addresses.push(address)
  }
  return addresses
}

@Injectable()
export class LocalNetworkDiscoveryService {
  private readonly logger = new Logger(LocalNetworkDiscoveryService.name)

  constructor(@Inject(DISCOVERY_PLATFORM) private readonly platform: DiscoveryPlatform) {}

  async discover(): Promise<DeviceObservation[]> {
    const startedAt = Date.now()
    try {
      const network = await this.platform.getDefaultNetwork()
      const addresses = getLocalHostAddresses(network)
      this.logger.log(`Starting scoped discovery on ${network.address}/${network.prefixLength} (${addresses.length} candidate hosts).`)

      const reachable = await this.mapWithConcurrency(addresses, MAX_CONCURRENT_PROBES, async (ip) =>
        (await this.platform.isReachable(ip)) ? ip : null,
      )
      const neighborEntries = await this.platform.getNeighbors(network)
      const neighborMap = new Map(neighborEntries.map(({ ip, mac }) => [ip, this.normalizeMac(mac)]))

      if (network.macAddress) neighborMap.set(network.address, this.normalizeMac(network.macAddress))
      const candidates = new Set(network.macAddress ? [network.address] : [])
      for (const ip of reachable) {
        if (ip !== null) candidates.add(ip)
      }

      const observations = await this.mapWithConcurrency([...candidates], MAX_CONCURRENT_PROBES, async (ip) => ({
        ip,
        mac: neighborMap.get(ip) ?? null,
        hostname: await this.platform.resolveHostname(ip),
      }))

      const result = observations.filter((item): item is DeviceObservation => item !== null)
      this.logger.log(`Discovery completed: ${result.length} devices observed in ${Date.now() - startedAt}ms.`)
      return result
    } catch (error) {
      this.logger.warn('Local network discovery failed. Confirm the active LAN interface and local probing permissions.')
      if (error instanceof ServiceUnavailableException) throw error
      throw new ServiceUnavailableException('Local network discovery is temporarily unavailable.')
    }
  }

  private normalizeMac(mac: string): string | null {
    const normalized = mac.replace(/-/g, ':').toUpperCase()
    return /^([0-9A-F]{2}:){5}[0-9A-F]{2}$/.test(normalized) && normalized !== '00:00:00:00:00:00'
      ? normalized
      : null
  }

  private async mapWithConcurrency<T, R>(items: T[], concurrency: number, mapper: (item: T) => Promise<R>): Promise<R[]> {
    const results = new Array<R>(items.length)
    let nextIndex = 0

    const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
      while (nextIndex < items.length) {
        const index = nextIndex
        nextIndex += 1
        const item = items[index]
        if (item !== undefined) results[index] = await mapper(item)
      }
    })

    await Promise.all(workers)
    return results
  }
}
