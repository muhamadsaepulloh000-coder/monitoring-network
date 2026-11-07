import { networkNodes } from '../../data/mockData'

export function NetworkTopology() {
  return (
    <div className="rounded-xl border border-[#202933] bg-[#10161D] p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100">Topology</h3>
        <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Live view</span>
      </div>

      <div className="relative h-[340px] overflow-hidden rounded-lg border border-[#202933] bg-[#0C1015]">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <line x1="45" y1="42" x2="52" y2="52" stroke="#3B82F6" strokeWidth="1.5" opacity="0.7" />
          <line x1="52" y1="52" x2="66" y2="50" stroke="#3B82F6" strokeWidth="1.5" opacity="0.7" />
          <line x1="52" y1="52" x2="64" y2="65" stroke="#22C55E" strokeWidth="1.5" opacity="0.7" />
          <line x1="66" y1="50" x2="84" y2="44" stroke="#3B82F6" strokeWidth="1.5" opacity="0.7" />
          <line x1="66" y1="50" x2="80" y2="60" stroke="#3B82F6" strokeWidth="1.5" opacity="0.7" />
          <line x1="80" y1="60" x2="91" y2="73" stroke="#EF4444" strokeWidth="1.5" opacity="0.7" />

          {networkNodes.map((node) => (
            <g key={node.id}>
              <circle cx={node.x} cy={node.y} r={node.type === 'router' ? 4 : node.type === 'internet' ? 3.5 : 2.8} fill={node.status === 'online' ? '#22C55E' : '#EF4444'} opacity={0.9} />
              <text x={node.x + 4} y={node.y + 0.2} fontSize="2.4" fill="#E2E8F0">{node.label}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}
