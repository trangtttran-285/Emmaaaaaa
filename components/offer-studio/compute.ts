import type { OfferInputs, OfferComputed } from './types'
import { calculatePoints, calculatePayCom } from '@/lib/commission'

function pit(income: number): number {
  if (income <= 0) return 0
  const brackets: [number, number][] = [
    [10000, 0.05], [30000, 0.10], [60000, 0.20],
    [100000, 0.30], [Infinity, 0.35],
  ]
  let tax = 0, lo = 0
  for (const [hi, rate] of brackets) {
    if (income > lo) { tax += (Math.min(income, hi) - lo) * rate; lo = hi } else break
  }
  return tax
}

export function compute(I: OfferInputs): OfferComputed {
  const ibt = I.vnGross * (1 - I.insurance / 100)
  const taxable = ibt - I.personal - I.dep * I.dependent
  const vnNet = ibt - pit(taxable)
  const usaNet = I.grossNew - I.vnGross
  const offerNetMonthly = vnNet + usaNet

  const totalSalaryAnnual = (offerNetMonthly + I.monthlyBonus + I.allowance) * I.service
  const annualBonus = I.grossNew
  const perfBonus = I.grossNew * ((I.service / 12) * I.bonus2026)
  const offerTotalComp = totalSalaryAnnual + annualBonus + perfBonus
  const offerTotalCompUsd = (offerTotalComp / I.fx) * 1000

  const curTotalSalary = I.curNet * I.service
  const curTotalComp = curTotalSalary + I.curGross * I.curBonusMonths + I.curGross * I.curPerfMonths

  return {
    offerNetMonthly,
    offerTotalComp,
    offerTotalCompUsd,
    curTotalComp,
    dNetMonthly: I.curNet ? offerNetMonthly / I.curNet - 1 : 0,
    dComp: curTotalComp ? offerTotalComp / curTotalComp - 1 : 0,
    keepRate: I.grossNew ? offerNetMonthly / I.grossNew : 0,
    estimatedPoints: calculatePoints(I.level, I.source, I.coe),
    payCom: calculatePayCom(I.level, I.source),
  }
}
