// Después de `next build`: si el sitemap salió sin URLs (demo en noindex), se elimina de out/.
import { existsSync, readFileSync, rmSync } from "node:fs";

const ruta = "out/sitemap.xml";
if (existsSync(ruta) && !readFileSync(ruta, "utf8").includes("<url>")) {
  rmSync(ruta);
  console.log("postbuild: sitemap vacío eliminado (sitio en noindex).");
}
