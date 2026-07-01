export type Role = 'TA' | 'Admin' | 'Viewer'

export type Source =
  | 'TA Headhunt'
  | 'Sourced'
  | 'Employee Referral (Passive)'
  | 'Employee Referral (Active)'
  | 'Headhunt (Agency)'

export type Level =
  | 'Intern' | 'Junior' | 'Intermediate' | 'Senior'
  | 'Team Lead' | 'Functional Leader' | 'Manager'

export type CoE =
  | 'SCE' | 'CPM.PMKT' | 'CPM.CONT' | 'CPM.CREAT' | 'CPM.CDM'
  | 'POE' | 'RFS' | 'Tech.PMI' | 'BEVA.TP' | 'BEVA.3D'
  | 'BEVA.FD' | 'BEVA.PM' | 'BEVA.PC' | 'POE.Legal' | 'CEE'

export interface OfferRecord {
  id: string
  no: number
  ta: string                        // TA email
  candidateName: string
  position: string
  level: Level
  coe: CoE
  startDate: string                 // YYYY-MM-DD
  status: 'Pending' | 'Accepted' | 'Declined'
  source: Source
  referralName?: string
  remarks?: string
  cnbCheck?: string
  toPayCom: boolean
  personToPayCom?: string
  endProbationDate?: string
  eligibleCommissionMonth?: string
  firstPaymentStatus?: string
  sourceInhouse?: string
  type?: string
  commission?: number               // VNĐ
  co?: string
  eligibleReferral6M?: string
  secondPaymentStatus?: string
  point?: number
  sourceChannel?: string
  // Salary fields — hidden from Viewer role in API layer
  grossNew?: number
  vnGross?: number
  allowance?: number
  monthlyBonus?: number
}

export interface PolicyDoc {
  id: string
  name: string
  type: 'tuyen-dung' | 'hoa-hong' | 'tinh-diem'
  text: string
  driveFileId: string
}
