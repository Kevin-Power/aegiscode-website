import { NextRequest } from "next/server"
import { isAuthorized, unauthorized } from "@/lib/admin-auth"
import { findById, upsert } from "@/lib/license-store"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface RevokeBody {
  reason?: string
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  if (!isAuthorized(req)) return unauthorized()

  const { id } = await params
  if (!id) {
    return Response.json({ error: "license id is required" }, { status: 400 })
  }

  let body: RevokeBody = {}
  try {
    body = (await req.json()) as RevokeBody
  } catch {
    // body is optional — empty body means no reason supplied.
  }

  const record = await findById(id)
  if (!record) {
    return Response.json({ error: "license not found" }, { status: 404 })
  }

  await upsert({
    ...record,
    revoked: true,
    revokedAt: new Date().toISOString(),
    revokeReason: body.reason?.trim() || "no reason given",
  })

  return Response.json({ ok: true, licenseId: id })
}
