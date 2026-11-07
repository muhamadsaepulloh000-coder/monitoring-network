import { Module } from '@nestjs/common'
import { DiscoveryModule } from '../discovery/discovery.module'
import { DevicesController } from './devices.controller'
import { DevicesService } from './devices.service'

@Module({
  imports: [DiscoveryModule],
  controllers: [DevicesController],
  providers: [DevicesService],
  exports: [DevicesService],
})
export class DevicesModule {}
