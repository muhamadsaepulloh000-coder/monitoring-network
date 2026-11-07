import { accessControls } from '../data/mockData'
import type { AccessControl } from '../types/network'

export const getAccessControls = async (): Promise<AccessControl[]> => {
  await new Promise((resolve) => setTimeout(resolve, 160))
  return accessControls
}
