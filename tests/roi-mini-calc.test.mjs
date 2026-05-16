import { test } from "node:test"
import assert from "node:assert/strict"
import { estimateRoi } from "../src/lib/roi-mini-calc.ts"

test("high-fin financial baseline: 50 repos × high-fin × excel → 70 findings, 49 hours", () => {
  const r = estimateRoi({ repos: 50, sensitivity: "high-fin", current: "excel" })
  assert.equal(r.findings, 70)
  assert.equal(r.hoursSavedPerMonth, 49)
})

test("modest baseline: 25 repos × mid × partial-tool → 12 findings, 8 hours", () => {
  const r = estimateRoi({ repos: 25, sensitivity: "mid", current: "partial-tool" })
  assert.equal(r.findings, 12)
  assert.equal(r.hoursSavedPerMonth, 8)
})

test("platform-already case dampens: 100 repos × low × platform → 12 findings, 8 hours", () => {
  const r = estimateRoi({ repos: 100, sensitivity: "low", current: "platform" })
  assert.equal(r.findings, 12)
  assert.equal(r.hoursSavedPerMonth, 8)
})

test("minimum: 10 repos × low × excel → 4 findings, 3 hours", () => {
  const r = estimateRoi({ repos: 10, sensitivity: "low", current: "excel" })
  assert.equal(r.findings, 4)
  assert.equal(r.hoursSavedPerMonth, 3)
})

test("results are always non-negative integers", () => {
  for (const repos of [10, 25, 50, 100]) {
    for (const sensitivity of ["low", "mid", "high-fin"]) {
      for (const current of ["excel", "partial-tool", "platform"]) {
        const r = estimateRoi({ repos, sensitivity, current })
        assert.equal(Number.isInteger(r.findings), true)
        assert.equal(Number.isInteger(r.hoursSavedPerMonth), true)
        assert.ok(r.findings >= 0)
        assert.ok(r.hoursSavedPerMonth >= 0)
      }
    }
  }
})
