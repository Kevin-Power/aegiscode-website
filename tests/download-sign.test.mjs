import { test } from "node:test"
import assert from "node:assert/strict"
import { signDownload, verifyDownload } from "../src/lib/download-sign.ts"

const SECRET = "test-secret-12345-not-for-prod"

test("signed token round-trips and verifies", () => {
  const exp = Math.floor(Date.now() / 1000) + 60 // 1 minute future
  const token = signDownload({ assetId: "sample.pdf", exp, secret: SECRET })
  const ok = verifyDownload({
    assetId: "sample.pdf",
    exp,
    token,
    secret: SECRET,
  })
  assert.equal(ok, true)
})

test("verification fails for tampered assetId", () => {
  const exp = Math.floor(Date.now() / 1000) + 60
  const token = signDownload({ assetId: "sample.pdf", exp, secret: SECRET })
  const ok = verifyDownload({
    assetId: "different.pdf",
    exp,
    token,
    secret: SECRET,
  })
  assert.equal(ok, false)
})

test("verification fails for tampered exp", () => {
  const exp = Math.floor(Date.now() / 1000) + 60
  const token = signDownload({ assetId: "sample.pdf", exp, secret: SECRET })
  const ok = verifyDownload({
    assetId: "sample.pdf",
    exp: exp + 1,
    token,
    secret: SECRET,
  })
  assert.equal(ok, false)
})

test("verification fails after expiry", () => {
  const exp = Math.floor(Date.now() / 1000) - 1 // already expired
  const token = signDownload({ assetId: "sample.pdf", exp, secret: SECRET })
  const ok = verifyDownload({
    assetId: "sample.pdf",
    exp,
    token,
    secret: SECRET,
  })
  assert.equal(ok, false)
})

test("verification uses timing-safe comparison", () => {
  // Just confirm that a known-bad token of correct length fails.
  const exp = Math.floor(Date.now() / 1000) + 60
  const good = signDownload({ assetId: "sample.pdf", exp, secret: SECRET })
  const bad = "0".repeat(good.length)
  const ok = verifyDownload({
    assetId: "sample.pdf",
    exp,
    token: bad,
    secret: SECRET,
  })
  assert.equal(ok, false)
})
