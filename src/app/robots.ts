import type { MetadataRoute } from "next"

const SITE_URL = "https://aegiscode.yilutek.com"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/code",
        "/surface",
        "/resources",
        "/pricing",
        "/trial",
        "/privacy",
        "/terms",
        "/dpa",
      ],
      disallow: [
        "/admin/",
        "/api/",
        "/internal/",
        "/checkout/",
        "/roi",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
