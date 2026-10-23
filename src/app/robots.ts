import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export const dynamic = "force-static";

/** Con `site.indexable = false` bloquea todo y no anuncia sitemap. */
export default function robots(): MetadataRoute.Robots {
  if (!site.indexable) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${site.url}/sitemap.xml` };
}
