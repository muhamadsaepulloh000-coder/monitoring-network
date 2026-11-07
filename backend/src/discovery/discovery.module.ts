import { Module } from '@nestjs/common'
import { DISCOVERY_PLATFORM } from './discovery.types'
import { LocalNetworkDiscoveryService } from './local-network-discovery.service'
import { SystemDiscoveryPlatform } from './system-discovery.platform'

@Module({
  providers: [
    LocalNetworkDiscoveryService,
    SystemDiscoveryPlatform,
    { provide: DISCOVERY_PLATFORM, useExisting: SystemDiscoveryPlatform },
  ],
  exports: [LocalNetworkDiscoveryService],
})
export class DiscoveryModule {}
