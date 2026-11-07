import { Injectable } from '@nestjs/common'

export interface HealthResponse {
  status: 'ok'
  service: 'nexus-network-api'
  timestamp: string
}

@Injectable()
export class HealthService {
  getHealth(): HealthResponse {
    return {
      status: 'ok',
      service: 'nexus-network-api',
      timestamp: new Date().toISOString(),
    }
  }
}
