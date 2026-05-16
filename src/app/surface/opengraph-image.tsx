import { ImageResponse } from "next/og"

export const alt =
  "AegisCode Surface — External attack surface governance for CISOs"
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
            "linear-gradient(135deg, #0D1521 0%, #0F1923 55%, #0F2438 100%)",
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
            color: "#7DD3FC",
            letterSpacing: "0.06em",
          }}
        >
          AegisCode
          <span style={{ color: "#94A3B8", fontWeight: 500 }}>/</span>
          <span style={{ color: "#94A3B8", fontWeight: 500 }}>Surface</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 92,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              color: "#FFFFFF",
            }}
          >
            External Attack Surface
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#CBD5E1",
              fontWeight: 500,
              maxWidth: 1000,
              lineHeight: 1.3,
            }}
          >
            Annual CISO advisory · monthly reports the board can read.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 14 }}>
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
              Annual subscription
            </span>
            <span
              style={{
                fontSize: 18,
                color: "#BAE6FD",
                border: "1px solid rgba(125,211,252,0.4)",
                padding: "6px 16px",
                borderRadius: 999,
                background: "rgba(125,211,252,0.08)",
              }}
            >
              zh-TW first
            </span>
            <span
              style={{
                fontSize: 18,
                color: "#E0F2FE",
                border: "1px solid rgba(2,132,199,0.5)",
                padding: "6px 16px",
                borderRadius: 999,
                background: "rgba(2,132,199,0.15)",
              }}
            >
              TW compliance
            </span>
          </div>
          <div style={{ fontSize: 18, color: "#64748B" }}>
            aegiscode.yilutek.com/surface
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
