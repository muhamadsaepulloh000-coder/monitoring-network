import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { networkInterfaces } from 'node:os'
import { reverse } from 'node:dns/promises'
import { Injectable, ServiceUnavailableException } from '@nestjs/common'
import type { DiscoveryPlatform, LocalNetwork } from './discovery.types'

const execFileAsync = promisify(execFile)
const POWERSHELL_NETWORK_QUERY = [
  "$route = Get-NetRoute -AddressFamily IPv4 -DestinationPrefix '0.0.0.0/0' | Sort-Object RouteMetric, InterfaceMetric | Select-Object -First 1",
  'if ($null -eq $route) { exit 2 }',
  '$config = Get-NetIPConfiguration -InterfaceIndex $route.InterfaceIndex',
  "$address = $config.IPv4Address | Where-Object { $_.IPAddress -notlike '169.254.*' } | Select-Object -First 1",
  'if ($null -eq $address) { exit 3 }',
  '[pscustomobject]@{ address=$address.IPAddress; prefixLength=$address.PrefixLength; interfaceIndex=$route.InterfaceIndex } | ConvertTo-Json -Compress',
].join('; ')
const POWERSHELL_NEIGHBOR_QUERY = [
  'param([int]$Index)',
  "@(Get-NetNeighbor -AddressFamily IPv4 -InterfaceIndex $Index -ErrorAction SilentlyContinue | Where-Object { $_.State -notin @('Unreachable','Incomplete') -and $_.LinkLayerAddress -match '^([0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}$' } | Select-Object IPAddress,LinkLayerAddress) | ConvertTo-Json -Compress",
].join('; ')

interface PowerShellNetworkResult {
  address: string
  prefixLength: number
  interfaceIndex: number
}

@Injectable()
export class SystemDiscoveryPlatform implements DiscoveryPlatform {
  async getDefaultNetwork(): Promise<LocalNetwork> {
    if (process.platform === 'win32') {
      try {
        const { stdout } = await execFileAsync(
          'powershell.exe',
          ['-NoProfile', '-NonInteractive', '-Command', POWERSHELL_NETWORK_QUERY],
          { timeout: 5000, windowsHide: true, maxBuffer: 64 * 1024 },
        )
        const result = JSON.parse(stdout.trim()) as PowerShellNetworkResult
        return {
          ...result,
          macAddress: this.findMacAddress(result.address),
        }
      } catch {
        throw new ServiceUnavailableException('Unable to determine the active local IPv4 network.')
      }
    }

    const candidates = Object.values(networkInterfaces()).flatMap((entries) => entries ?? [])
    const network = candidates.find((entry) =>
      !entry.internal && entry.family === 'IPv4' && this.isPrivateIPv4(entry.address) && this.prefixLength(entry.netmask) >= 24,
    )
    if (!network) {
      throw new ServiceUnavailableException('No supported private IPv4 network with a /24-or-smaller address range was found.')
    }

    const matchingInterface = Object.values(networkInterfaces()).find((entries) => entries?.some((entry) => entry.address === network.address))
    return {
      address: network.address,
      prefixLength: this.prefixLength(network.netmask),
      macAddress: matchingInterface?.find((entry) => entry.address === network.address)?.mac ?? null,
    }
  }

  async isReachable(ip: string): Promise<boolean> {
    const args = process.platform === 'win32'
      ? ['-n', '1', '-w', '700', ip]
      : process.platform === 'darwin'
        ? ['-c', '1', '-W', '1000', ip]
        : ['-c', '1', '-W', '1', ip]

    try {
      await execFileAsync('ping', args, { timeout: 1500, windowsHide: true, maxBuffer: 16 * 1024 })
      return true
    } catch {
      return false
    }
  }

  async getNeighbors(network: LocalNetwork): Promise<Array<{ ip: string; mac: string }>> {
    try {
      if (process.platform === 'win32') {
        if (network.interfaceIndex === undefined) return []
        const { stdout } = await execFileAsync(
          'powershell.exe',
          ['-NoProfile', '-NonInteractive', '-Command', `& { ${POWERSHELL_NEIGHBOR_QUERY} } -Index ${network.interfaceIndex}`],
          { timeout: 5000, windowsHide: true, maxBuffer: 256 * 1024 },
        )
        const parsed = JSON.parse(stdout.trim() || '[]') as Array<{ IPAddress: string; LinkLayerAddress: string }> | { IPAddress: string; LinkLayerAddress: string }
        const rows = Array.isArray(parsed) ? parsed : [parsed]
        return rows.map(({ IPAddress, LinkLayerAddress }) => ({ ip: IPAddress, mac: LinkLayerAddress }))
      }

      const { stdout } = await execFileAsync('arp', ['-an'], { timeout: 5000, maxBuffer: 256 * 1024 })
      const neighbors: Array<{ ip: string; mac: string }> = []
      for (const match of stdout.matchAll(/\((\d{1,3}(?:\.\d{1,3}){3})\) at ((?:[0-9a-f]{2}:){5}[0-9a-f]{2})/gi)) {
        if (match[1] && match[2]) neighbors.push({ ip: match[1], mac: match[2] })
      }
      return neighbors
    } catch {
      return []
    }
  }

  async resolveHostname(ip: string): Promise<string | null> {
    try {
      const result = await Promise.race([
        reverse(ip),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Reverse lookup timed out')), 1200)),
      ])
      return result[0]?.replace(/\.$/, '') || null
    } catch {
      return null
    }
  }

  private findMacAddress(address: string): string | null {
    for (const entries of Object.values(networkInterfaces())) {
      const match = entries?.find((entry) => entry.address === address && entry.mac !== '00:00:00:00:00:00')
      if (match) return match.mac.toUpperCase()
    }
    return null
  }

  private prefixLength(netmask: string): number {
    return netmask.split('.').reduce((sum, octet) => sum + Number(octet).toString(2).replace(/0/g, '').length, 0)
  }

  private isPrivateIPv4(address: string): boolean {
    const octets = address.split('.').map(Number)
    return octets.length === 4 && (
      octets[0] === 10 ||
      (octets[0] === 172 && octets[1] !== undefined && octets[1] >= 16 && octets[1] <= 31) ||
      (octets[0] === 192 && octets[1] === 168)
    )
  }
}
