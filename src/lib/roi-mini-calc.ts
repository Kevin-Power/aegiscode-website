export type RoiSensitivity = "low" | "mid" | "high-fin"
export type RoiCurrent = "excel" | "partial-tool" | "platform"

export type RoiInput = {
  repos: 10 | 25 | 50 | 100
  sensitivity: RoiSensitivity
  current: RoiCurrent
}

export type RoiResult = {
  findings: number
  hoursSavedPerMonth: number
}

const SENSITIVITY_FACTOR: Record<RoiSensitivity, number> = {
  low: 0.4,
  mid: 0.8,
  "high-fin": 1.4,
}

const CURRENT_FACTOR: Record<RoiCurrent, number> = {
  excel: 1.0,
  "partial-tool": 0.6,
  platform: 0.3,
}

export function estimateRoi(input: RoiInput): RoiResult {
  const raw = input.repos * SENSITIVITY_FACTOR[input.sensitivity] * CURRENT_FACTOR[input.current]
  const findings = Math.round(raw)
  const hoursSavedPerMonth = Math.round(findings * 0.7)
  return { findings, hoursSavedPerMonth }
}
