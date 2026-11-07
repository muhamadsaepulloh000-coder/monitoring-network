import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { TrafficSample } from '../../types/network'

interface TrafficChartProps {
  data: TrafficSample[]
}

export function TrafficChart({ data }: TrafficChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 20, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="downloadFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="uploadFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22C55E" stopOpacity={0.38} />
              <stop offset="95%" stopColor="#22C55E" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#2A3442" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#10161D',
              border: '1px solid #2A3442',
              borderRadius: '12px',
              color: '#E2E8F0',
            }}
          />
          <Area type="monotone" dataKey="download" stroke="#3B82F6" fill="url(#downloadFill)" strokeWidth={2.5} />
          <Area type="monotone" dataKey="upload" stroke="#22C55E" fill="url(#uploadFill)" strokeWidth={2.5} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
