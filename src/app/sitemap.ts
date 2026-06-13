import type { MetadataRoute } from "next"

const SITE_URL = "https://aegiscode.yilutek.com"
const LAST_MODIFIED = new Date("2026-06-13T00:00:00+08:00")

const routes = [
  { path: "/", priority: 1.0 },
  { path: "/code", priority: 0.9 },
  { path: "/surface", priority: 0.9 },
  { path: "/resources", priority: 0.8 },
  { path: "/pricing", priority: 0.7 },
  { path: "/trial", priority: 0.7 },
  { path: "/privacy", priority: 0.3 },
  { path: "/terms", priority: 0.3 },
  { path: "/dpa", priority: 0.3 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: route.path === "/" ? "weekly" : "monthly",
    priority: route.priority,
  }))
}
