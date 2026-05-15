import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/external-risk",
        destination: "/surface",
        permanent: true,
      },
    ]
  },
};

export default withSentryConfig(nextConfig, {
  silent: true,
  org: "aegiscode",
  project: "aegiscode-website",
  // Skip uploading source maps when no auth token is available (i.e. local dev).
  // The modern Sentry SDK uses `sourcemaps.disable` (the old `dryRun` option
  // was removed in v8+).
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },
});
