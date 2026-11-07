import { activityLogs } from '../data/mockData'
import type { ActivityLog } from '../types/network'

export const getActivityLogs = async (): Promise<ActivityLog[]> => {
  await new Promise((resolve) => setTimeout(resolve, 170))
  return activityLogs
}
