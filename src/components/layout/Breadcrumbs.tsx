import { ChevronRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const labels: Record<string, string> = {
  '/': 'Overview',
  '/devices': 'Connected Devices',
  '/traffic': 'Traffic Analytics',
  '/network-map': 'Network Map',
  '/access-control': 'Access Control',
  '/router': 'Router Management',
  '/logs': 'Activity Logs',
  '/settings': 'Settings',
}

export function Breadcrumbs() {
  const location = useLocation()
  const parts = location.pathname.split('/').filter(Boolean)

  return (
    <nav className="mb-5 flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-slate-400">
      <Link to="/" className="hover:text-slate-200">Home</Link>
      {parts.length > 0 ? <ChevronRight size={12} /> : null}
      {parts.map((part, index) => {
        const path = `/${parts.slice(0, index + 1).join('/')}`
        const label = labels[path] ?? part
        const isLast = index === parts.length - 1

        return (
          <span key={path} className="inline-flex items-center gap-2">
            {isLast ? (
              <span className="text-slate-200">{label}</span>
            ) : (
              <Link className="hover:text-slate-200" to={path}>{label}</Link>
            )}
            {!isLast ? <ChevronRight size={12} /> : null}
          </span>
        )
      })}
    </nav>
  )
}
