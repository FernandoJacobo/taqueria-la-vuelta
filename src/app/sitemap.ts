import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export const dynamic = "force-static";

/**
 * Solo tiene URLs cuando `site.indexable` es true. Con el demo en noindex sale vacío y
 * `scripts/postbuild.mjs` borra el archivo de `out/`, así que no se publica sitemap.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.indexable) return [];
  return [
    { url: `${site.url}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/aviso-de-privacidad/`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
