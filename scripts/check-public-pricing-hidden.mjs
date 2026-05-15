#!/usr/bin/env node

import { readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"

const roots = ["src/app", "src/components", "public"]
const extensions = new Set([".ts", ".tsx", ".js", ".jsx", ".json", ".md", ".svg"])

const forbidden = [
  /NT\$/i,
  /\b9,?900\b/,
  /\b45,?000\b/,
  /\b150,?000\b/,
  /\b118,?800\b/,
  /\b540,?000\b/,
  /\b1,?800,?000\b/,
  /\bAggregateOffer\b/,
  /\blowPrice\b/,
  /\bhighPrice\b/,
  /user\/month/i,
  /隱含/,
  /#pricing/i,
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

const matches = []
for (const root of roots) {
  for (const file of filesUnder(root)) {
    const text = readFileSync(file, "utf8")
    const lines = text.split(/\r?\n/)
    lines.forEach((line, index) => {
      const hit = forbidden.find((pattern) => pattern.test(line))
      if (hit) {
        matches.push({
          file,
          line: index + 1,
          pattern: String(hit),
          text: line.trim(),
        })
      }
    })
  }
}

if (matches.length > 0) {
  console.error("Public pricing guard failed. Remove public price anchors:")
  for (const match of matches) {
    console.error(`${match.file}:${match.line} ${match.pattern} ${match.text}`)
  }
  process.exit(1)
}

console.log("Public pricing guard passed.")
