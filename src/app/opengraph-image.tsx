import { ImageResponse } from "next/og"

// OG image for / — dual-product positioning.
// Kept English-only to avoid shipping a CJK font (Satori has no system
// CJK fallback). Social card metadata title/description are still
// rendered in Chinese by the OS share UI.

export const alt =
  "AegisCode — Code + Surface dual-product security governance"
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
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: "#5EEAD4",
            }}
          >
            AegisCode
          </div>
          <div
            style={{
              fontSize: 16,
              color: "#94A3B8",
              borderLeft: "1px solid #334155",
              paddingLeft: 12,
            }}
          >
            Yilutek Security Suite
          </div>
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
            Code + Surface
          </div>
          <div
            style={{
              fontSize: 36,
              color: "#CBD5E1",
              fontWeight: 500,
              maxWidth: 900,
            }}
          >
            Dual-product security governance for Taiwan finance &amp; high-compliance.
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
              Code · SAST + CBOM/PQC
            </span>
            <span
              style={{
                fontSize: 18,
                color: "#7DD3FC",
                border: "1px solid rgba(56,189,248,0.4)",
                padding: "6px 16px",
                borderRadius: 999,
                background: "rgba(56,189,248,0.08)",
              }}
            >
              Surface · External Attack Surface
            </span>
          </div>
          <div style={{ fontSize: 18, color: "#64748B" }}>
            aegiscode.yilutek.com
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
