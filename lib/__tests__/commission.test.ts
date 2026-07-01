import { calculatePoints, calculatePayCom, isPayComEligible } from '../commission'

test('Senior + TA Headhunt + SCE = 3 × 1.25 × 1.25 = 4.6875', () => {
  expect(calculatePoints('Senior', 'TA Headhunt', 'SCE')).toBeCloseTo(4.6875)
})

test('Junior + Sourced + POE = 1 × 1.00 × 1.00 = 1', () => {
  expect(calculatePoints('Junior', 'Sourced', 'POE')).toBe(1)
})

test('Intern + TA Headhunt + SCE = 0.5 × 1.25 × 1.25 = 0.78125', () => {
  expect(calculatePoints('Intern', 'TA Headhunt', 'SCE')).toBeCloseTo(0.78125)
})

test('Manager + Agency + RFS = 6 × 0.25 × 1.00 = 1.5', () => {
  expect(calculatePoints('Manager', 'Headhunt (Agency)', 'RFS')).toBe(1.5)
})

test('Team Lead + Sourced + Tech.PMI = 4 × 1.00 × 1.25 = 5', () => {
  expect(calculatePoints('Team Lead', 'Sourced', 'Tech.PMI')).toBe(5)
})

test('Pay COM for Senior + Sourced = 5,000,000', () => {
  expect(calculatePayCom('Senior', 'Sourced')).toBe(5_000_000)
})

test('Pay COM for Functional Leader = 8,000,000 (same as Team Lead)', () => {
  expect(calculatePayCom('Functional Leader', 'Sourced')).toBe(8_000_000)
})

test('Pay COM for Intern = 0', () => {
  expect(calculatePayCom('Intern', 'TA Headhunt')).toBe(0)
})

test('Pay COM for Referral source = 0 regardless of level', () => {
  expect(calculatePayCom('Senior', 'Employee Referral (Passive)')).toBe(0)
  expect(calculatePayCom('Manager', 'Employee Referral (Active)')).toBe(0)
})

test('Pay COM for Agency = 0', () => {
  expect(calculatePayCom('Senior', 'Headhunt (Agency)')).toBe(0)
})

test('isPayComEligible: TA Headhunt = true', () => {
  expect(isPayComEligible('TA Headhunt')).toBe(true)
  expect(isPayComEligible('Sourced')).toBe(true)
})

test('isPayComEligible: Referral and Agency = false', () => {
  expect(isPayComEligible('Employee Referral (Passive)')).toBe(false)
  expect(isPayComEligible('Employee Referral (Active)')).toBe(false)
  expect(isPayComEligible('Headhunt (Agency)')).toBe(false)
})
