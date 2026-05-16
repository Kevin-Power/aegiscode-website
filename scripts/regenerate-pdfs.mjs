#!/usr/bin/env node
/**
 * Regenerate the three marketing PDFs by rendering the internal
 * asset-print pages with puppeteer.
 *
 * Usage:
 *   npm run regenerate-pdfs            # auto-spawn `next dev`
 *   npm run regenerate-pdfs -- --no-spawn   # assume next dev is already running
 *
 * Env:
 *   NEXT_DEV_PORT (default 3000)
 *   NEXT_DEV_HOST (default localhost)
 *
 * Output:
 *   private/downloads/surface-proposal.pdf       (lead-gated)
 *   private/downloads/ciso-monthly-sample.pdf    (lead-gated)
 *   public/downloads/tw-compliance-matrix.pdf    (public)
 *
 * The puppeteer requests go to /internal/asset-print/<id>, which is gated
 * by src/proxy.ts. Since we run on localhost, the gate lets the requests
 * through automatically.
 *
 * See docs/PDF_REGENERATION.md for the full operator runbook.
 */

import { spawn } from "node:child_process"
import { mkdir, stat } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const HOST = process.env.NEXT_DEV_HOST || "localhost"
const PORT = Number.parseInt(process.env.NEXT_DEV_PORT || "3000", 10)
const BASE = `http://${HOST}:${PORT}`

const NO_SPAWN = process.argv.includes("--no-spawn")
const READINESS_TIMEOUT_MS = 60_000
const PAGE_NAV_TIMEOUT_MS = 60_000

const ASSETS = [
  {
    id: "surface-proposal",
    output: resolve(REPO_ROOT, "private", "downloads", "surface-proposal.pdf"),
    minBytes: 10_000,
  },
  {
    id: "ciso-monthly-sample",
    output: resolve(
      REPO_ROOT,
      "private",
      "downloads",
      "ciso-monthly-sample.pdf",
    ),
    minBytes: 10_000,
  },
  {
    id: "tw-compliance-matrix",
    output: resolve(
      REPO_ROOT,
      "public",
      "downloads",
      "tw-compliance-matrix.pdf",
    ),
    minBytes: 5_000,
  },
]

function log(msg) {
  process.stdout.write(`[regenerate-pdfs] ${msg}\n`)
}

function warn(msg) {
  process.stderr.write(`[regenerate-pdfs] WARN: ${msg}\n`)
}

async function waitForHealth() {
  const deadline = Date.now() + READINESS_TIMEOUT_MS
  let lastErr = null
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${BASE}/api/health`)
      if (res.ok) {
        const body = await res.json().catch(() => ({}))
        log(
          `health endpoint ok (status=${body.status ?? "?"}, backend=${body?.storage?.backend ?? "?"})`,
        )
        return
      }
      lastErr = `HTTP ${res.status}`
    } catch (err) {
      lastErr = err && err.message ? err.message : String(err)
    }
    await new Promise((r) => setTimeout(r, 750))
  }
  throw new Error(
    `next dev did not become ready within ${READINESS_TIMEOUT_MS / 1000}s ` +
      `(last error: ${lastErr ?? "unknown"})`,
  )
}

function spawnNextDev() {
  log(`spawning next dev on ${BASE} ...`)
  // Use the platform-appropriate `npm` shim. On Windows that's `npm.cmd`,
  // and we need shell:true because Node 20+ no longer auto-spawns .cmd
  // shims (see https://nodejs.org/en/blog/vulnerability/april-2024-security-releases-2 —
  // CVE-2024-27980 hardening).
  const isWin = process.platform === "win32"
  const npmCmd = isWin ? "npm.cmd" : "npm"
  const child = spawn(npmCmd, ["run", "dev", "--", "-p", String(PORT)], {
    cwd: REPO_ROOT,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
    shell: isWin,
  })
  // Stream output prefixed so the user can see startup progress.
  child.stdout.on("data", (chunk) => {
    process.stdout.write(`[next dev] ${chunk}`)
  })
  child.stderr.on("data", (chunk) => {
    process.stderr.write(`[next dev] ${chunk}`)
  })
  child.on("exit", (code, signal) => {
    log(`next dev exited (code=${code} signal=${signal ?? "none"})`)
  })
  return child
}

async function ensureDir(filePath) {
  await mkdir(dirname(filePath), { recursive: true })
}

async function killChild(child) {
  if (!child || child.exitCode != null) return
  try {
    if (process.platform === "win32") {
      // SIGTERM isn't fully respected by Windows; use taskkill /T to bring
      // down the whole tree (npm + node + next).
      const { spawn: spawnSync } = await import("node:child_process")
      spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], {
        stdio: "ignore",
      })
    } else {
      child.kill("SIGTERM")
      // Escalate if it doesn't exit quickly.
      setTimeout(() => {
        if (child.exitCode == null) child.kill("SIGKILL")
      }, 4000).unref?.()
    }
  } catch (err) {
    warn(`failed to kill next dev: ${err}`)
  }
}

async function loadPuppeteer() {
  try {
    const mod = await import("puppeteer")
    return mod.default ?? mod
  } catch (err) {
    throw new Error(
      "Could not import 'puppeteer'. Run `npm install` first so puppeteer " +
        "downloads its Chromium build (~300MB on first install). " +
        `Underlying error: ${err && err.message ? err.message : err}`,
    )
  }
}

async function renderOne(browser, asset) {
  const url = `${BASE}/internal/asset-print/${asset.id}`
  log(`rendering ${asset.id} from ${url}`)
  const page = await browser.newPage()
  try {
    page.setDefaultNavigationTimeout(PAGE_NAV_TIMEOUT_MS)
    const res = await page.goto(url, { waitUntil: "networkidle0" })
    if (!res || !res.ok()) {
      throw new Error(
        `navigation to ${url} returned HTTP ${res ? res.status() : "no response"}`,
      )
    }
    await page.emulateMediaType("print")
    await ensureDir(asset.output)
    await page.pdf({
      path: asset.output,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "18mm",
        right: "16mm",
        bottom: "18mm",
        left: "16mm",
      },
    })
    const info = await stat(asset.output)
    log(
      `wrote ${asset.output} (${info.size} bytes` +
        (info.size < asset.minBytes
          ? `; WARNING: below expected minimum of ${asset.minBytes}`
          : "") +
        ")",
    )
    return info.size
  } finally {
    await page.close().catch(() => {})
  }
}

async function main() {
  let nextChild = null
  if (!NO_SPAWN) {
    nextChild = spawnNextDev()
  } else {
    log(
      `--no-spawn set: assuming next dev is already listening on ${BASE}`,
    )
  }

  try {
    await waitForHealth()
    const puppeteer = await loadPuppeteer()
    log("launching headless Chromium ...")
    const browser = await puppeteer.launch({ headless: "new" })
    try {
      const sizes = []
      for (const asset of ASSETS) {
        const size = await renderOne(browser, asset)
        sizes.push({ id: asset.id, size })
      }
      log("done. Output PDFs:")
      for (const { id, size } of sizes) {
        log(`  - ${id}.pdf: ${size} bytes`)
      }
    } finally {
      await browser.close()
    }
  } finally {
    await killChild(nextChild)
  }
}

await main().catch((err) => {
  process.stderr.write(
    `[regenerate-pdfs] ERROR: ${err && err.message ? err.message : err}\n`,
  )
  if (err && err.stack) process.stderr.write(`${err.stack}\n`)
  process.exit(1)
})
