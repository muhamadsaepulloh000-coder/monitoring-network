import { Radar, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '../../components/layout/PageContainer'
import { DeviceTable } from '../../components/tables/DeviceTable'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorState } from '../../components/ui/ErrorState'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Skeleton } from '../../components/ui/Skeleton'
import { discoverDevices } from '../../services/device.service'
import type { Device } from '../../types/network'

export function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const navigate = useNavigate()

  useEffect(() => {
    let active = true

    discoverDevices()
      .then((deviceList) => {
        if (active) setDevices(deviceList)
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : 'Device inventory could not be loaded.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [])

  const handleScan = async () => {
    setScanning(true)
    setError(null)
    try {
      setDevices(await discoverDevices())
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Local network scan failed.')
    } finally {
      setScanning(false)
    }
  }

  const filteredDevices = useMemo(() => {
    const trimmed = search.trim().toLowerCase()

    return devices.filter((device) => {
      const matchesSearch = trimmed.length === 0 || [device.name, device.ip, device.mac, device.vendor].some((value) => value.toLowerCase().includes(trimmed))
      const matchesStatus = statusFilter === 'all' || device.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [devices, search, statusFilter])

  if (error) {
    return <ErrorState title="Devices unavailable" message={error} />
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Inventory</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-100">Connected devices</h2>
        </div>
        <Button variant="secondary" onClick={handleScan} disabled={scanning} leadingIcon={<Radar size={14} />}>
          {scanning ? 'Scanning network…' : 'Scan local network'}
        </Button>
      </div>

      <div className="rounded-xl border border-[#202933] bg-[#10161D] p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_180px]">
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, IP or MAC" className="!pl-10" />
          </div>
          <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">All statuses</option>
            <option value="online">Online</option>
            <option value="sleeping">Sleeping</option>
            <option value="offline">Offline</option>
            <option value="blocked">Blocked</option>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
      ) : filteredDevices.length === 0 ? (
        <EmptyState title="No devices match the current filters" description="Try widening the search or resetting the status filter." />
      ) : (
        <DeviceTable data={filteredDevices} onSelect={(device) => navigate(`/devices/${device.id}`)} />
      )}
    </PageContainer>
  )
}
