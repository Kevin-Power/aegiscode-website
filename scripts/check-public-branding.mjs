#!/usr/bin/env node

import { readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"

const roots = ["src/app", "src/components", "public"]
const standaloneFiles = ["README.md"]
const extensions = new Set([".ts", ".tsx", ".js", ".jsx", ".json", ".md", ".svg"])

const forbidden = [
  { pattern: /\bWT\b/i, reason: "legacy WT wording" },
  { pattern: /\bSonaqu\b/i, reason: "legacy Sonaqu wording" },
  { pattern: /Kevin Hsieh/i, reason: "individual founder footer/byline" },
  { pattern: /Crafted by/i, reason: "individual project positioning" },
  { pattern: /by Kevin/i, reason: "individual project positioning" },
  { pattern: /業界首創/, reason: "unverifiable market-first claim" },
  { pattern: /市面上唯一/, reason: "unverifiable uniqueness claim" },
  { pattern: /壓低門檻/, reason: "internal pricing strategy leak" },
  { pattern: /秒砍/, reason: "internal competitor strategy leak" },
  { pattern: /85%\s*資安事件/, reason: "unverifiable OWASP-style statistic" },
  { pattern: /46%\s*AI/, reason: "unverifiable AI code statistic" },
  { pattern: /\b30x\b/i, reason: "legacy unverifiable remediation-cost claim" },
]

function extname(path) {
  const idx = path.lastIndexOf(".")
  return idx >= 0 ? path.slice(idx) : ""
}

function filesUnder(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    const stat = statSync(path)
    if (stat.isDirectory()) {
      out.push(...filesUnder(path))
    } else if (extensions.has(extname(path))) {
      out.push(path)
    }
  }
  return out
}

function checkFile(file, matches) {
  const text = readFileSync(file, "utf8")
  const lines = text.split(/\r?\n/)
  lines.forEach((line, index) => {
    const hit = forbidden.find(({ pattern }) => pattern.test(line))
    if (hit) {
      matches.push({
        file,
        line: index + 1,
        pattern: String(hit.pattern),
        reason: hit.reason,
        text: line.trim(),
      })
    }
  })
}

const matches = []
for (const root of roots) {
  for (const file of filesUnder(root)) {
    checkFile(file, matches)
  }
}
for (const file of standaloneFiles) {
  checkFile(file, matches)
}

if (matches.length > 0) {
  console.error("Public branding guard failed. Remove customer-facing trust risks:")
  for (const match of matches) {
    console.error(
      `${match.file}:${match.line} ${match.pattern} ${match.reason} ${match.text}`,
    )
  }
  process.exit(1)
}

console.log("Public branding guard passed.")
