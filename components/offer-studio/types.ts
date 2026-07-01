import type { Level, Source, CoE } from '@/types'

export interface OfferInputs {
  candidateName: string
  position: string
  level: Level
  coe: CoE
  source: Source
  startDate: string
  grossNew: number
  vnGross: number
  allowance: number
  monthlyBonus: number
  dep: number
  fx: number
  curGross: number
  curNet: number
  curBonusMonths: number
  curPerfMonths: number
  bonus2026: number
  insurance: number
  personal: number
  dependent: number
  service: number
}

export interface OfferComputed {
  offerNetMonthly: number
  offerTotalComp: number
  offerTotalCompUsd: number
  curTotalComp: number
  dNetMonthly: number
  dComp: number
  keepRate: number
  estimatedPoints: number
  payCom: number
}
