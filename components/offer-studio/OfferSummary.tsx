import type { OfferComputed } from './types'

const fmt = (v: number) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.round(v))
const pct = (v: number) => `${v >= 0 ? '+' : ''}${(v * 100).toFixed(2)}%`

interface Props { computed: OfferComputed }

export default function OfferSummary({ computed: c }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <Card label="Total Comp (offer)" value={`${fmt(c.offerTotalComp)}k`} unit="₫" delta={c.dComp} />
      <Card label="Total Comp USD" value={`$${fmt(c.offerTotalCompUsd / 1000)}`} unit="" delta={c.dComp} />
      <Card label="Net / tháng" value={`${fmt(c.offerNetMonthly)}k`} unit="₫" delta={c.dNetMonthly} />
      <Card label="Est. Điểm TA" value={c.estimatedPoints.toFixed(4)} unit="pts" delta={null} />
      {c.payCom > 0 && (
        <Card
          label="Pay COM (sau thử việc)"
          value={new Intl.NumberFormat('vi-VN').format(c.payCom)}
          unit="₫"
          delta={null}
        />
      )}
    </div>
  )
}

function Card({ label, value, unit, delta }: {
  label: string; value: string; unit: string; delta: number | null
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">{label}</div>
      <div className="text-lg font-semibold">
        {value}<span className="text-xs font-normal text-gray-400 ml-1">{unit}</span>
      </div>
      {delta !== null && (
        <div className={`text-xs font-semibold mt-1 ${delta >= 0 ? 'text-green-600' : 'text-red-500'}`}>
          {delta >= 0 ? '▲' : '▼'} {pct(delta)} vs current
        </div>
      )}
    </div>
  )
}
