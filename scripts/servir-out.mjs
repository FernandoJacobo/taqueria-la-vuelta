// Servidor estático mínimo para probar `out/` como lo serviría Cloudflare Pages
// (rutas con barra final → index.html, 404.html para lo demás). Sin dependencias.
// Uso: npm run servir   (o: node scripts/servir-out.mjs 4173)
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { createGzip } from "node:zlib";

const raiz = join(process.cwd(), "out");
const puerto = Number(process.argv[2] ?? process.env.PORT ?? 4173);
const tipos = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json",
  ".xml": "application/xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

if (!existsSync(raiz)) {
  console.error("No existe out/. Corre primero: npm run build");
  process.exit(1);
}

createServer((req, res) => {
  const ruta = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname);
  let archivo = normalize(join(raiz, ruta));
  if (!archivo.startsWith(raiz)) {
    res.writeHead(403).end();
    return;
  }
  if (existsSync(archivo) && statSync(archivo).isDirectory()) archivo = join(archivo, "index.html");
  let estado = 200;
  if (!existsSync(archivo)) {
    archivo = join(raiz, "404.html");
    estado = 404;
  }
  const tipo = tipos[extname(archivo)] ?? "application/octet-stream";
  const cache = archivo.includes(`${join("_next", "static")}`) ? "public, max-age=31536000, immutable" : "no-cache";
  const comprimir = /gzip/.test(req.headers["accept-encoding"] ?? "") && /text|javascript|svg|json|xml/.test(tipo);
  res.writeHead(estado, { "Content-Type": tipo, "Cache-Control": cache, ...(comprimir ? { "Content-Encoding": "gzip" } : {}) });
  const flujo = createReadStream(archivo);
  (comprimir ? flujo.pipe(createGzip()) : flujo).pipe(res);
}).listen(puerto, () => console.log(`Sirviendo out/ en http://localhost:${puerto}`));
