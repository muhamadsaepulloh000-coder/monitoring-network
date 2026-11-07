import { Controller, Get, NotFoundException, Param, Post } from '@nestjs/common'
import { DevicesService } from './devices.service'

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Get()
  listDevices() {
    return this.devicesService.list()
  }

  @Get(':id')
  async getDevice(@Param('id') id: string) {
    const device = await this.devicesService.findById(id)
    if (!device) throw new NotFoundException('Device not found.')
    return device
  }

  @Post('discover')
  discoverDevices() {
    return this.devicesService.discoverAndSync()
  }
}
