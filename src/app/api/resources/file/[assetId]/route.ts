import { NextRequest } from "next/server"
import { readFile, stat } from "node:fs/promises"
import { resolve, sep } from "node:path"
import { verifyDownload, getDownloadSecret } from "@/lib/download-sign"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const ALLOWED_ASSETS = new Set([
  "surface-proposal.pdf",
  "ciso-monthly-sample.pdf",
])

const DOWNLOADS_DIR = resolve(process.cwd(), "private", "downloads")

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ assetId: string }> },
): Promise<Response> {
  const { assetId: rawAssetId } = await context.params
  const assetId = rawAssetId.trim()

  if (!ALLOWED_ASSETS.has(assetId)) {
    return Response.json({ error: "Unknown assetId" }, { status: 404 })
  }

  const url = new URL(req.url)
  const expStr = url.searchParams.get("exp")
  const token = url.searchParams.get("token")

  if (!expStr || !token) {
    return Response.json({ error: "Missing exp or token" }, { status: 400 })
  }
  const exp = Number.parseInt(expStr, 10)
  if (!Number.isFinite(exp)) {
    return Response.json({ error: "Bad exp" }, { status: 400 })
  }

  let secret: string
  try {
    secret = getDownloadSecret()
  } catch {
    return Response.json(
      { error: "Downloads not configured" },
      { status: 503 },
    )
  }

  if (!verifyDownload({ assetId, exp, token, secret })) {
    return Response.json(
      { error: "Invalid or expired token" },
      { status: 401 },
    )
  }

  // Defense in depth: never read outside the downloads dir even though
  // ALLOWED_ASSETS already constrains the input.
  const filePath = resolve(DOWNLOADS_DIR, assetId)
  if (!filePath.startsWith(DOWNLOADS_DIR + sep)) {
    return Response.json({ error: "Path traversal blocked" }, { status: 400 })
  }

  let info
  try {
    info = await stat(filePath)
  } catch {
    return Response.json(
      {
        error:
          "Asset file is not yet deployed. Please contact sales@aegiscode.com.",
      },
      { status: 404 },
    )
  }

  if (!info.isFile()) {
    return Response.json({ error: "Asset is not a file" }, { status: 404 })
  }

  const buf = await readFile(filePath)
  return new Response(buf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${assetId}"`,
      "Content-Length": String(buf.byteLength),
      "Cache-Control": "private, no-store",
    },
  })
}
