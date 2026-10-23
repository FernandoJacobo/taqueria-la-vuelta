# La Vuelta — Taquería de trompo (demo)

Landing page de portafolio para vender sitios a taquerías, fondas y loncherías de barrio.
**Todos los datos son ficticios** (ver [`DATOS-FICTICIOS.md`](DATOS-FICTICIOS.md)) y el sitio sale en `noindex`.

## Concepto: "El salsero y la serigrafía"

- **El salsero.** La paleta son las salsas (tomatillo, guajillo, habanero, morita, cebolla curtida). Cada sección es
  un tazón de un color, a sangre completa. En el salsero, elegir una salsa repinta la sección entera.
- **La lona serigrafiada.** Colores planos, titulares con **registro desfasado** (dos tintas con `multiply`), trama de
  medio tono, grano, bordes de tinta irregulares y sombras planas. Ilustraciones SVG propias: trompo con piña,
  tazones de peltre, chiles, comal y mapa del barrio.
- **Turno de noche, con humor de fila.** Nada de folclor de postal ni de frases de agencia.

La dirección de arte completa está en [`DISENO.md`](DISENO.md) y la verificación sección por sección en
[`AUDITORIA-DISENO.md`](AUDITORIA-DISENO.md).

## Qué tiene

| Sección | Qué hace |
|---|---|
| Barra de turno | Estado en vivo con la hora de Guadalajara: "Abierto · trompo girando" / "Abrimos en 2 h 14 min". |
| Hero | Cartel de lona con el **trompo girando** (se detiene con `prefers-reduced-motion`) y sticker "Pedir para llevar". |
| Marquee | Único marquee del sitio: cortes y guisados sobreimpresos. |
| El pizarrón | Menú con puntos guía, picor en chiles, etiquetas y botón "+". **Comanda** fija abajo con resumen, tipo, nombre, hora de recogida, notas y envío por WhatsApp. Se guarda en `localStorage`. |
| El salsero | Cinco tazones; la sección cambia al color de la salsa, con picómetro, "va con…" y "Pedirla extra". |
| La taquiza | Calculadora de eventos: tacos, kilos de carne y tortilla, cebolla, cilantro, limones, salsa, taqueros, horas, precio y anticipo del 50 %. |
| Historia, voces, horarios | Numerales en escalera, reseñas ficticias como citas gigantes, mapa SVG y reglas de la casa. |
| Extras | Barra fija en móvil (Llamar / Pedir), `/aviso-de-privacidad/` y 404 ("se acabó, como el suadero a las 2 a. m."). |

## Stack

- **Next.js 16** (App Router, TypeScript estricto, React Compiler) con **exportación estática** (`output: "export"`).
- **Tailwind CSS 4** con el tema redefinido desde cero en `src/app/globals.css` (`@theme`).
- `next/font`: Bowlby One (titulares), Karla 400/700 (cuerpo) y Rock Salt (notas de marcador, 8 apariciones).
- `react-hook-form` + `zod` en la comanda y la taquiza. Estado del pedido con `useReducer` + `localStorage`.
- **Vitest** para la lógica pura y **Playwright** para el QA visual y de flujos. Sin librerías de componentes ni de iconos.

## Cómo correrlo (Windows / PowerShell)

Requiere Node 20.9 o superior (probado con Node 22).

```powershell
npm install
npm run dev          # http://localhost:3000
npm test             # pruebas Vitest (taquiza, pedido, mensajes, horario, modo demo)
npm run build        # genera out/
npm run servir       # sirve out/ en http://localhost:4173, como lo haría Cloudflare Pages
```

QA con Playwright (la primera vez: `npx playwright install chromium`), con `npm run servir` corriendo:

```powershell
npm run qa                                                   # capturas 360–1536 px + detección de scroll horizontal
node scripts/qa-secciones.mjs http://localhost:4173/ qa/secciones 390
node scripts/qa-flujo.mjs http://localhost:4173/             # pedido, persistencia, salsero, taquiza, teclado, reduced motion
```

## Probar con un WhatsApp real

Mientras `NEXT_PUBLIC_WHATSAPP` sea el placeholder (`520000000000`), el sitio está en **modo demo**: al enviar un
pedido o una cotización **no** se abre `wa.me`. Aparece un modal "Vista previa" con el mensaje ya formateado.

Para probar el envío real, crea `.env.local` en la raíz:

```env
NEXT_PUBLIC_WHATSAPP=5213312345678
```

(lada de país + número, solo dígitos). Reinicia `npm run dev` o vuelve a hacer el build: la variable se incrusta al
compilar, así que en Cloudflare Pages también hay que definirla en *Settings → Environment variables*.

## Despliegue en Cloudflare Pages

1. Conecta el repositorio en Cloudflare Pages.
2. **Build command:** `npm run build`
3. **Build output directory:** `out`
4. Variable de entorno `NODE_VERSION=22` (y `NEXT_PUBLIC_WHATSAPP` si se quiere el envío real).

`trailingSlash: true` genera `ruta/index.html`, que Pages sirve sin configuración extra, y `404.html` se usa para las
rutas inexistentes.

## Adaptarlo a una taquería real

Sin tocar componentes:

1. `src/config/site.ts`: nombre, teléfono, correo, dirección, horario (los turnos pueden cruzar la medianoche), espera,
   estacionamiento, pagos, redes y **`indexable: true`** para publicar.
2. `src/data/menu.ts`: categorías, platillos, precios, picor, etiquetas y variante "con queso".
3. `src/data/salsas.ts`: las salsas de la casa (cada una con su color de la paleta).
4. `src/data/contenido.ts`: historia, "lo que nunca cambiamos", reseñas reales (con permiso) y reglas de la casa.
5. `src/lib/taquiza.ts` → `SUPUESTOS` y `GUISADOS_TAQUIZA`: rendimientos y precios de eventos.
6. `src/components/ilustraciones/MapaBarrio.tsx`: dibujar las calles reales (el mapa es SVG a mano, no un embed).
7. Fotos: ver [`FOTOS-REALES.md`](FOTOS-REALES.md).

Con `indexable: true` el build publica `robots.txt` con `Allow`, `sitemap.xml`, la etiqueta canónica y el JSON-LD
`Restaurant` con horarios y menú (`src/lib/seo.ts`).

## Decisiones técnicas

- **Exportación estática.** No hay API routes, Server Actions ni middleware: el pedido se arma en el navegador y se
  envía por WhatsApp. La consecuencia es que no hay registro de pedidos del lado del servidor, ni confirmación, ni
  pagos en línea. Para eso haría falta un backend (por ejemplo, una Cloudflare Function) y saldría del alcance del demo.
- **Hora del turno.** El estado abierto/cerrado se calcula en el cliente con la zona `America/Mexico_City`, así se ve
  bien desde cualquier país. En el HTML estático aparece un texto neutro y se actualiza al hidratar (evita choques de
  hidratación con la hora del build).
- **`robots` y sitemap** se generan desde `site.indexable`. Como Next siempre emite `sitemap.xml`,
  `scripts/postbuild.mjs` lo borra cuando sale vacío.
- **Sobreimpresión** con dos capas de texto (`<Sobreimpreso>`): la segunda es `aria-hidden` y multiplica contra la
  primera (fondos claros) o contra el fondo (fondos oscuros), para que la primera tinta siempre cumpla contraste AA.
- **El trompo** gira desplazando en X las manchas de dorado dentro de un `clipPath`, mientras el brillo y la sombra
  quedan fijos. Es CSS puro y se detiene con `prefers-reduced-motion`.
- **Diálogos nativos** (`<dialog>` + `showModal`): foco atrapado, `Esc` y capa superior sin librerías.
- **El salsero** usa radios nativos: flechas del teclado incluidas.

## Resultados medidos

- Vitest: 37 pruebas en verde.
- Lighthouse móvil (build de producción): rendimiento 92, accesibilidad 100, buenas prácticas 100.
  SEO **100 con `indexable: true`**; en modo demo marca 63 a propósito, porque Lighthouse penaliza el `noindex`.
- Sin scroll horizontal de 360 a 1536 px.
