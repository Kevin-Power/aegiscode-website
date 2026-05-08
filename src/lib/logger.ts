// Centralized structured logger for AegisCode website.
//
// Output format: one JSON object per log line on stdout in production. Pretty
// (colorless) human-readable lines in dev. Errors are mirrored to Sentry when
// SENTRY_DSN is configured.
//
// See aegiscode/src/lib/logger.ts for the canonical implementation — this is
// the matching copy living in the website repo. Keep them in sync.

export type LogLevel = "debug" | "info" | "warn" | "error"

/**
 * Recursive JSON-serializable value. We intentionally allow `unknown` at leaf
 * positions so callers can attach Error instances or custom objects — the
 * serializer will render them via their JSON representation, falling back to
 * String(...) for anything that can't be JSON-encoded.
 */
export type LogValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | LogValue[]
  | { [key: string]: LogValue }
  | Error
  | unknown

export type LogContext = Record<string, LogValue>

interface LogEntry {
  ts: string
  level: LogLevel
  msg: string
  stack?: string
  [key: string]: LogValue
}

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
}

function currentLevel(): LogLevel {
  const env = (process.env.LOG_LEVEL || "").toLowerCase()
  if (env === "debug" || env === "info" || env === "warn" || env === "error") {
    return env
  }
  return process.env.NODE_ENV === "production" ? "info" : "debug"
}

function isProduction(): boolean {
  return process.env.NODE_ENV === "production"
}

function safeStringify(value: unknown): string {
  const seen = new WeakSet<object>()
  return JSON.stringify(value, (_key, val: unknown) => {
    if (val instanceof Error) {
      return {
        name: val.name,
        message: val.message,
        stack: val.stack,
      }
    }
    if (typeof val === "bigint") {
      return val.toString()
    }
    if (typeof val === "object" && val !== null) {
      if (seen.has(val)) return "[Circular]"
      seen.add(val)
    }
    return val
  })
}

function emit(entry: LogEntry): void {
  const line = safeStringify(entry)
  if (isProduction()) {
    process.stdout.write(line + "\n")
    return
  }
  const { ts, level, msg, stack, ...rest } = entry
  const restKeys = Object.keys(rest)
  let suffix = ""
  if (restKeys.length > 0) {
    try {
      suffix = " " + JSON.stringify(rest)
    } catch {
      suffix = ""
    }
  }
  const head = `[${ts}] ${level.toUpperCase().padEnd(5)} ${msg}${suffix}`
  if (level === "error" || level === "warn") {
    process.stderr.write(head + "\n")
    if (stack) process.stderr.write(stack + "\n")
  } else {
    process.stdout.write(head + "\n")
  }
}

function forwardToSentry(
  level: LogLevel,
  msg: string,
  ctx: LogContext,
  errorCandidate: unknown
): void {
  if (level !== "error" && level !== "warn") return
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN && !process.env.SENTRY_DSN) return
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Sentry = require("@sentry/nextjs") as typeof import("@sentry/nextjs")
    const captureCtx = { level: level as "error" | "warning", extra: ctx }
    if (errorCandidate instanceof Error) {
      Sentry.captureException(errorCandidate, captureCtx)
    } else if (level === "error") {
      Sentry.captureMessage(msg, captureCtx)
    } else {
      Sentry.captureMessage(msg, { level: "warning", extra: ctx })
    }
  } catch {
    // Sentry not installed or DSN broken — ignore silently.
  }
}

function extractError(input: unknown): {
  ctx: LogContext
  err: Error | undefined
} {
  if (input instanceof Error) {
    return {
      ctx: {
        error: input.message,
        errorName: input.name,
      },
      err: input,
    }
  }
  if (input && typeof input === "object") {
    const ctx = input as LogContext
    let err: Error | undefined
    for (const v of Object.values(ctx)) {
      if (v instanceof Error) {
        err = v
        break
      }
    }
    return { ctx, err }
  }
  return { ctx: {}, err: undefined }
}

class Logger {
  private readonly base: LogContext

  constructor(base: LogContext = {}) {
    this.base = base
  }

  withContext(extra: LogContext): Logger {
    return new Logger({ ...this.base, ...extra })
  }

  debug(msg: string, ctx?: LogContext): void {
    this.write("debug", msg, ctx)
  }

  info(msg: string, ctx?: LogContext): void {
    this.write("info", msg, ctx)
  }

  warn(msg: string, ctxOrError?: LogContext | Error | unknown): void {
    const { ctx, err } = extractError(ctxOrError)
    this.write("warn", msg, ctx, err)
  }

  error(msg: string, ctxOrError?: LogContext | Error | unknown): void {
    const { ctx, err } = extractError(ctxOrError)
    this.write("error", msg, ctx, err)
  }

  private write(
    level: LogLevel,
    msg: string,
    ctx?: LogContext,
    err?: Error
  ): void {
    if (LEVEL_ORDER[level] < LEVEL_ORDER[currentLevel()]) return

    const merged: LogContext = { ...this.base, ...(ctx ?? {}) }
    const entry: LogEntry = {
      ts: new Date().toISOString(),
      level,
      msg,
      ...merged,
    }
    if (err && err.stack) entry.stack = err.stack
    emit(entry)
    forwardToSentry(level, msg, merged, err)
  }
}

export const logger = new Logger()
export type AppLogger = Logger
