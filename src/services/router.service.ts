import { router } from '../data/mockData'
import type { Router } from '../types/network'

export const getRouterDetails = async (): Promise<Router> => {
  await new Promise((resolve) => setTimeout(resolve, 160))
  return router
}
