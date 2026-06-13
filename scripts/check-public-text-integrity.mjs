#!/usr/bin/env node

import { readdirSync, readFileSync, statSync } from "node:fs"
import { extname, join } from "node:path"

const roots = ["src/app", "src/components", "public"]
const extensions = new Set([".ts", ".tsx", ".js", ".jsx", ".json", ".md", ".svg"])

// These characters show up in Traditional Chinese mojibake when UTF-8 text is
// decoded through the wrong legacy code page. They are intentionally rare in
// customer-facing marketing copy, so a hit is a strong signal to inspect.
const mojibakeSentinels = [
  "撠",
  "蝔",
  "瘚",
  "銝",
  "餌",
  "憭",
  "鞈",
  "隡",
  "摰",
  "閮",
  "甈",
  "靘",
  "瘝",
  "貉",
  "蝣",
  "芋",
  "啜",
  "閬",
  "敺",
  "繚",
  "勗",
  "鈭",
  "摮",
]

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
      const sentinel = mojibakeSentinels.find((char) => line.includes(char))
      if (sentinel) {
        matches.push({
          file,
          line: index + 1,
          sentinel,
          text: line.trim(),
        })
      }
    })
  }
}

if (matches.length > 0) {
  console.error("Public text integrity guard failed. Inspect likely mojibake:")
  for (const match of matches) {
    console.error(
      `${match.file}:${match.line} ${match.sentinel} ${match.text}`,
    )
  }
  process.exit(1)
}

console.log("Public text integrity guard passed.")
