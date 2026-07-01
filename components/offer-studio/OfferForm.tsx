'use client'
import type { OfferInputs } from './types'

export const DEFAULTS: OfferInputs = {
  candidateName: '', position: '', level: 'Senior', coe: 'SCE',
  source: 'Sourced', startDate: '',
  grossNew: 78000, vnGross: 45800, allowance: 1000, monthlyBonus: 0,
  dep: 0, fx: 26000, curGross: 75000, curNet: 62443,
  curBonusMonths: 1, curPerfMonths: 2, bonus2026: 2,
  insurance: 10.5, personal: 15500, dependent: 6200, service: 12,
}

const LEVELS = ['Intern','Junior','Intermediate','Senior','Team Lead','Functional Leader','Manager']
const COES = ['SCE','CPM.PMKT','CPM.CONT','CPM.CREAT','CPM.CDM','POE','RFS',
              'Tech.PMI','BEVA.TP','BEVA.3D','BEVA.FD','BEVA.PM','BEVA.PC','POE.Legal','CEE']
const SOURCES = ['TA Headhunt','Sourced','Employee Referral (Passive)',
                 'Employee Referral (Active)','Headhunt (Agency)']

interface Props { inputs: OfferInputs; onChange: (v: OfferInputs) => void }

export default function OfferForm({ inputs, onChange }: Props) {
  const set = (k: keyof OfferInputs, v: string | number) => onChange({ ...inputs, [k]: v })
  const num = (k: keyof OfferInputs) => ({
    type: 'number' as const,
    value: inputs[k] as number,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => set(k, parseFloat(e.target.value) || 0),
    className: 'w-full border border-gray-300 rounded-md px-3 py-2 text-right font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500',
  })

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="text-xs font-medium text-gray-500 mb-1 block">Tên ứng viên *</label>
          <input className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={inputs.candidateName} onChange={e => set('candidateName', e.target.value)} placeholder="Nguyen Van A" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Vị trí *</label>
          <input className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={inputs.position} onChange={e => set('position', e.target.value)} placeholder="Senior Engineer" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Start Date *</label>
          <input type="date" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={inputs.startDate} onChange={e => set('startDate', e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Level</label>
          <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none"
            value={inputs.level} onChange={e => set('level', e.target.value)}>
            {LEVELS.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">CoE</label>
          <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none"
            value={inputs.coe} onChange={e => set('coe', e.target.value)}>
            {COES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Source</label>
          <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none"
            value={inputs.source} onChange={e => set('source', e.target.value)}>
            {SOURCES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Gross mới (k₫)</label>
          <input {...num('grossNew')} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">VN Gross (k₫)</label>
          <input {...num('vnGross')} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Allowance (k₫)</label>
          <input {...num('allowance')} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Monthly Bonus (VNĐ)</label>
          <input {...num('monthlyBonus')} />
        </div>
        {(inputs.source === 'Employee Referral (Passive)' || inputs.source === 'Employee Referral (Active)') && (
          <div className="col-span-2">
            <label className="text-xs font-medium text-gray-500 mb-1 block">Referral Name</label>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={inputs.referralName ?? ''}
              onChange={e => set('referralName', e.target.value)}
              placeholder="Nguyen Van B"
            />
          </div>
        )}
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Current Gross (k₫)</label>
          <input {...num('curGross')} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Current Net (k₫)</label>
          <input {...num('curNet')} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">FX (VNĐ/USD)</label>
          <input {...num('fx')} />
        </div>
      </div>
    </div>
  )
}
