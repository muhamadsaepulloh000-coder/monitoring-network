import { LocalNetworkDiscoveryService } from './local-network-discovery.service'
import { SystemDiscoveryPlatform } from './system-discovery.platform'

async function main(): Promise<void> {
  const discovery = new LocalNetworkDiscoveryService(new SystemDiscoveryPlatform())
  const devices = await discovery.discover()
  console.log(JSON.stringify({ count: devices.length, devices }, null, 2))
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Local network discovery failed.')
  process.exitCode = 1
})
