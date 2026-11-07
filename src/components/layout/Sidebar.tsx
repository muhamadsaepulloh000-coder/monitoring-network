import { Activity, Cable, Gauge, LayoutDashboard, Lock, Network, ShieldCheck, Settings, Wifi, Zap } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { useAppStore } from '../../stores/app-store'

const navItems = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Connected Devices', to: '/devices', icon: Network },
  { label: 'Traffic Analytics', to: '/traffic', icon: Gauge },
  { label: 'Network Map', to: '/network-map', icon: Wifi },
  { label: 'Access Control', to: '/access-control', icon: Lock },
  { label: 'Router Management', to: '/router', icon: Cable },
  { label: 'Activity Logs', to: '/logs', icon: Activity },
  { label: 'Settings', to: '/settings', icon: Settings },
]

export function Sidebar() {
  const sidebarCollapsed = useAppStore((state) => state.sidebarCollapsed)

  return (
    <aside className={cn('border-b border-[#202933] bg-[#101318] transition-all duration-200 lg:border-b-0 lg:border-r', sidebarCollapsed ? 'w-full lg:w-20' : 'w-full lg:w-72')}>
      <div className="flex h-full flex-col p-4">
        <div className="mb-6 flex items-center gap-3 border-b border-[#202933] pb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#132B4A] text-[#7CC3FF]">
            <Zap size={18} />
          </div>
          {!sidebarCollapsed ? (
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Network</p>
              <h1 className="text-lg font-semibold tracking-tight text-slate-100">NEXUS</h1>
            </div>
          ) : null}
        </div>

        <nav className="space-y-1.5">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                  isActive ? 'bg-[#1B222C] text-slate-100' : 'text-slate-400 hover:bg-[#171D27] hover:text-slate-100',
                  sidebarCollapsed && 'justify-center px-2',
                )
              }
            >
              <Icon size={16} />
              {!sidebarCollapsed ? <span>{label}</span> : null}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-xl border border-[#2A3442] bg-[#121921] p-3">
          <div className="flex items-center gap-2 text-sm text-slate-200">
            <ShieldCheck size={16} className="text-[#3B82F6]" />
            {!sidebarCollapsed ? <span>Security status</span> : null}
          </div>
          {!sidebarCollapsed ? (
            <div className="mt-3 space-y-2 text-xs text-slate-400">
              <div className="flex items-center justify-between">
                <span>Threats</span><span className="text-[#22C55E]">Low</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Access policy</span><span>Standard</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  )
}
