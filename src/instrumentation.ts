// Next.js instrumentation hook. Initializes Sentry server / edge SDKs by
// re-exporting from the standard sentry.{server,edge}.config files at repo
// root. Sentry recommends this approach in Next.js 13+ so breadcrumbs are
// captured before any other module initializes.

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config")
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config")
  }
}
