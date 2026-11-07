export interface LocalNetwork {
  address: string
  prefixLength: number
  interfaceIndex?: number
  macAddress: string | null
}

export interface DeviceObservation {
  ip: string
  mac: string | null
  hostname: string | null
}

export interface DiscoveryPlatform {
  getDefaultNetwork(): Promise<LocalNetwork>
  isReachable(ip: string): Promise<boolean>
  getNeighbors(network: LocalNetwork): Promise<Array<{ ip: string; mac: string }>>
  resolveHostname(ip: string): Promise<string | null>
}

export const DISCOVERY_PLATFORM = Symbol('DISCOVERY_PLATFORM')
