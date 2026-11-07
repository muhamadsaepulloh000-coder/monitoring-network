import { trafficSamples, topTrafficDevices } from '../data/mockData'
import type { TrafficSample } from '../types/network'

export const getTrafficSamples = async (): Promise<TrafficSample[]> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return trafficSamples
}

export const getTopTrafficDevices = async (): Promise<Array<{ name: string; value: number }>> => {
  await new Promise((resolve) => setTimeout(resolve, 180))
  return topTrafficDevices
}
