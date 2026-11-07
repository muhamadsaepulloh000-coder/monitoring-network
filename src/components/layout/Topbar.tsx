import { Bell, ChevronsLeft, Search, SunMedium } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Dropdown } from '../ui/Dropdown'
import { useAppStore } from '../../stores/app-store'

export function Topbar() {
  const { sidebarCollapsed, toggleSidebar, setTheme, theme, addNotification } = useAppStore()

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#202933] bg-[#0B0D10] px-4 py-3 md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Button variant="secondary" size="sm" onClick={toggleSidebar} className="!w-9 !px-0">
          <ChevronsLeft size={14} className={sidebarCollapsed ? 'rotate-180' : ''} />
        </Button>
        <div className="relative w-full max-w-sm">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <Input aria-label="Search" placeholder="Search devices, logs, traffic" className="bg-[#10161D] !h-9 pl-9 pr-10" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-[#2A3442] bg-[#10161D] px-3 py-1.5 md:flex">
          <div className="h-2 w-2 rounded-full bg-[#22C55E]" />
          <span className="text-xs font-medium text-slate-200">Router online</span>
        </div>

        <Button
          variant="secondary"
          size="sm"
          className="!w-9 !px-0"
          onClick={() => {
            setTheme(theme === 'dark' ? 'light' : 'dark')
            addNotification('Theme preference updated.', 'info')
          }}
        >
          <SunMedium size={14} />
        </Button>

        <Dropdown
          trigger={
            <Button variant="secondary" size="sm" className="!w-9 !px-0">
              <Bell size={14} />
            </Button>
          }
        >
          <button
            type="button"
            className="block w-full rounded-md px-2 py-2 text-left text-sm text-slate-300 hover:bg-[#1B222C]"
            onClick={() => addNotification('Router sync completed successfully.', 'success')}
          >
            Router sync complete
          </button>
        </Dropdown>
      </div>
    </header>
  )
}
