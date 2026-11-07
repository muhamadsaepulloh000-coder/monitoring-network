import { PageContainer } from '../../components/layout/PageContainer'
import { NetworkTopology } from '../../components/network/NetworkTopology'

export function NetworkMapPage() {
  return (
    <PageContainer>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Topology</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-100">Network map</h2>
      </div>
      <NetworkTopology />
    </PageContainer>
  )
}
