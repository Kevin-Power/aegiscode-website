"use client"

// Global Next.js error boundary for the marketing/license-server site. Pipes
// uncaught errors into Sentry and renders a brand-consistent fallback page.

import * as Sentry from "@sentry/nextjs"
import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="zh-Hant">
      <body
        style={{
          fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
          background: "#0D1521",
          color: "#fff",
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: 480,
            padding: "32px",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: 28, marginBottom: 16 }}>系統暫時無法服務</h1>
          <p style={{ color: "#94A3B8", marginBottom: 24 }}>
            我們已收到錯誤通知，工程團隊將盡快處理。請稍後再試。
          </p>
          {error.digest && (
            <p style={{ color: "#64748B", fontSize: 12, marginBottom: 24 }}>
              Error ID: {error.digest}
            </p>
          )}
          <button
            onClick={() => reset()}
            style={{
              background: "#3B82F6",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "10px 24px",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            重試
          </button>
        </div>
      </body>
    </html>
  )
}
