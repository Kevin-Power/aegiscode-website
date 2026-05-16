import { ImageResponse } from "next/og"

export const alt = "AegisCode Resources — Sales-ready PDFs for CISOs"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "linear-gradient(135deg, #0D1521 0%, #0F1923 50%, #0A0F18 100%)",
          color: "#F1F5F9",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 24,
            fontWeight: 700,
            color: "#5EEAD4",
            letterSpacing: "0.06em",
          }}
        >
          AegisCode
          <span style={{ color: "#94A3B8", fontWeight: 500 }}>/</span>
          <span style={{ color: "#94A3B8", fontWeight: 500 }}>Resources</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 88,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              color: "#FFFFFF",
            }}
          >
            Asset Library
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#CBD5E1",
              fontWeight: 500,
              maxWidth: 1040,
              lineHeight: 1.3,
            }}
          >
            Surface proposal · CISO monthly sample · TW compliance matrix.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 14 }}>
            <span
              style={{
                fontSize: 18,
                color: "#5EEAD4",
                border: "1px solid rgba(20,184,166,0.4)",
                padding: "6px 16px",
                borderRadius: 999,
                background: "rgba(20,184,166,0.08)",
              }}
            >
              Service proposal
            </span>
            <span
              style={{
                fontSize: 18,
                color: "#A7F3D0",
                border: "1px solid rgba(110,231,183,0.4)",
                padding: "6px 16px",
                borderRadius: 999,
                background: "rgba(110,231,183,0.08)",
              }}
            >
              CISO sample
            </span>
            <span
              style={{
                fontSize: 18,
                color: "#FBBF24",
                border: "1px solid rgba(245,158,11,0.4)",
                padding: "6px 16px",
                borderRadius: 999,
                background: "rgba(245,158,11,0.08)",
              }}
            >
              Compliance matrix
            </span>
          </div>
          <div style={{ fontSize: 18, color: "#64748B" }}>
            aegiscode.yilutek.com/resources
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
