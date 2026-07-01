import type { Level, Source, CoE } from '@/types'

const LEVEL_POINTS: Record<Level, number> = {
  'Intern': 0.5,
  'Junior': 1,
  'Intermediate': 2,
  'Senior': 3,
  'Team Lead': 4,
  'Functional Leader': 4,
  'Manager': 6,
}

const SOURCING_MULTIPLIER: Record<Source, number> = {
  'TA Headhunt': 1.25,
  'Sourced': 1.00,
  'Employee Referral (Passive)': 0.75,
  'Employee Referral (Active)': 0.50,
  'Headhunt (Agency)': 0.25,
}

const COE_MULTIPLIER: Record<CoE, number> = {
  'SCE': 1.25,
  'CPM.PMKT': 1.25,
  'CPM.CONT': 1.25,
  'CPM.CREAT': 1.00,
  'CPM.CDM': 1.00,
  'POE': 1.00,
  'RFS': 1.00,
  'Tech.PMI': 1.25,
  'BEVA.TP': 1.25,
  'BEVA.3D': 1.00,
  'BEVA.FD': 1.25,
  'BEVA.PM': 1.25,
  'BEVA.PC': 1.00,
  'POE.Legal': 1.25,
  'CEE': 1.00,
}

const PAY_COM_AMOUNT: Record<Level, number> = {
  'Intern': 0,
  'Junior': 3_000_000,
  'Intermediate': 4_000_000,
  'Senior': 5_000_000,
  'Team Lead': 8_000_000,
  'Functional Leader': 8_000_000,
  'Manager': 12_000_000,
}

const PAY_COM_ELIGIBLE_SOURCES = new Set<Source>(['TA Headhunt', 'Sourced'])

export function calculatePoints(level: Level, source: Source, coe: CoE): number {
  return LEVEL_POINTS[level] * SOURCING_MULTIPLIER[source] * COE_MULTIPLIER[coe]
}

export function isPayComEligible(source: Source): boolean {
  return PAY_COM_ELIGIBLE_SOURCES.has(source)
}

export function calculatePayCom(level: Level, source: Source): number {
  if (!isPayComEligible(source)) return 0
  return PAY_COM_AMOUNT[level]
}
