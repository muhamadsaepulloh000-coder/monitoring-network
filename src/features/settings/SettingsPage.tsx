import { BellRing, ShieldCheck, Wifi } from 'lucide-react'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { PageContainer } from '../../components/layout/PageContainer'

export function SettingsPage() {
  return (
    <PageContainer>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Configuration</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-100">Settings</h2>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-[#202933] bg-[#10161D] p-4">
          <h3 className="text-lg font-semibold text-slate-100">General settings</h3>
          <div className="mt-4 space-y-4">
            <Input label="Network name" defaultValue="NEXUS Home" />
            <Input label="Location label" defaultValue="HQ Residence" />
            <Select label="Time zone">
              <option>UTC+00:00</option>
              <option>UTC-05:00</option>
              <option>UTC+01:00</option>
            </Select>
          </div>
        </section>

        <section className="rounded-xl border border-[#202933] bg-[#10161D] p-4">
          <h3 className="text-lg font-semibold text-slate-100">Router integration</h3>
          <div className="mt-4 space-y-4">
            <Input label="Gateway IP" defaultValue="192.168.18.1" />
            <Input label="API endpoint" defaultValue="https://api.local.internal" />
            <Select label="Protocol">
              <option>Secure HTTPS</option>
              <option>Legacy HTTP</option>
            </Select>
          </div>
        </section>

        <section className="rounded-xl border border-[#202933] bg-[#10161D] p-4">
          <h3 className="text-lg font-semibold text-slate-100">Monitoring preferences</h3>
          <div className="mt-4 space-y-4 text-sm text-slate-300">
            <label className="flex items-center justify-between gap-4 rounded-lg border border-[#202933] bg-[#0D1218] p-3"><span className="flex items-center gap-2"><Wifi size={15} /> Auto-discovery</span><input type="checkbox" defaultChecked /></label>
            <label className="flex items-center justify-between gap-4 rounded-lg border border-[#202933] bg-[#0D1218] p-3"><span className="flex items-center gap-2"><BellRing size={15} /> Alert notifications</span><input type="checkbox" defaultChecked /></label>
            <label className="flex items-center justify-between gap-4 rounded-lg border border-[#202933] bg-[#0D1218] p-3"><span className="flex items-center gap-2"><ShieldCheck size={15} /> Threat detection</span><input type="checkbox" defaultChecked /></label>
          </div>
        </section>

        <section className="rounded-xl border border-[#202933] bg-[#10161D] p-4">
          <h3 className="text-lg font-semibold text-slate-100">Data retention</h3>
          <div className="mt-4 space-y-4">
            <Select label="Retention period">
              <option>30 days</option>
              <option>90 days</option>
              <option>180 days</option>
            </Select>
            <Input label="Archive destination" defaultValue="Local encrypted storage" />
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-[#202933] bg-[#10161D] p-4">
        <h3 className="text-lg font-semibold text-slate-100">Administrator profile</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input label="Admin name" defaultValue="System Operator" />
          <Input label="Email" defaultValue="ops@nexus.local" />
        </div>
      </section>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary">Discard</Button>
        <Button>Save changes</Button>
      </div>
    </PageContainer>
  )
}
