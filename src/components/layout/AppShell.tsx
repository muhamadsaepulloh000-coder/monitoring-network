import { Outlet } from 'react-router-dom'
import { Breadcrumbs } from './Breadcrumbs'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

import { useAppStore } from '../../stores/app-store'

export function AppShell() {
  const notifications = useAppStore((state) => state.notifications)

  return (
    <div className="relative flex min-h-screen flex-col bg-[#0B0D10] text-slate-200 lg:flex-row">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-x-hidden p-4 md:p-6">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>

      {notifications.length > 0 ? (
        <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(320px,calc(100vw-2rem))] flex-col gap-2">
          {notifications.slice(-3).reverse().map((notification) => (
            <div
              key={notification.id}
              className="pointer-events-auto rounded-md border border-[#2A3442] bg-[#121A22] px-3 py-2 text-sm text-slate-200 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <span
                  className={notification.level === 'success' ? 'h-2.5 w-2.5 rounded-full bg-[#22C55E]' : notification.level === 'warning' ? 'h-2.5 w-2.5 rounded-full bg-[#F59E0B]' : 'h-2.5 w-2.5 rounded-full bg-[#3B82F6]'}
                />
                <span>{notification.message}</span>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
