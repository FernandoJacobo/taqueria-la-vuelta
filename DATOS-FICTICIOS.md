# DATOS-FICTICIOS.md

**Todo lo que aparece en este demo es inventado.** Ningún dato apunta a una persona, negocio o lugar real.
Esta tabla dice qué se inventó y en qué archivo se reemplaza para adaptarlo a una taquería real.

| Dato | Valor en el demo | Dónde se cambia |
|---|---|---|
| Nombre | "La Vuelta — Taquería de trompo" | `src/config/site.ts` → `nombre`, `giro`, `nombreCompleto` |
| Lema y descripción | "Aquí el trompo no se apaga." | `site.ts` → `lema`, `descripcion` |
| Año de apertura | 1987 (ficticio, marcado así en el hero y la historia) | `site.ts` → `desde` |
| Teléfono | `33 0000 0000` / `+52 33 0000 0000` (marcador) | `site.ts` → `telefono` |
| WhatsApp | `520000000000` (placeholder → **modo demo**: no abre `wa.me`) | `.env.local` → `NEXT_PUBLIC_WHATSAPP` |
| Correo | `hola@taqueria-demo.example` (dominio `.example` reservado) | `site.ts` → `correo` |
| Dirección | Calle Ejemplo 123, Col. Demo, Guadalajara | `site.ts` → `direccion` |
| Mapa | Barrio inventado en SVG: Av. Inventada, Calle Ejemplo, Calle Muestra, Calle Ficticia, Mercado Demo, Jardín Demo | `src/components/ilustraciones/MapaBarrio.tsx` |
| Horarios y espera | Lun 6 p. m.–1 a. m., Mar–Jue hasta 3 a. m., Vie–Sáb hasta 4 a. m., Dom 5 p. m.–2 a. m.; espera de 8 a 12 min | `site.ts` → `horario`, `trompoPrende`, `espera` |
| Estacionamiento y pagos | Genéricos ("tarjeta de débito y crédito", sin marcas) | `site.ts` → `estacionamiento`, `pagos` |
| Redes | Tres enlaces a `#`, sin usuarios | `site.ts` → `redes` |
| Menú y precios | Precios ilustrativos de taquería tapatía (aviso visible: "precios ilustrativos") | `src/data/menu.ts` |
| Salsas | Cinco salsas, ingredientes, picor y chistes | `src/data/salsas.ts` |
| Historia | Rosa y Beto (1987), Toño (2004), Lupita (2019): personajes inventados, marcados como "historia ficticia" | `src/data/contenido.ts` → `vueltas`, `nuncaCambia` |
| Reseñas | Mariana R., Jorge L., Carmen V., Luis A.: inventadas, con "(reseña ficticia)" visible | `src/data/contenido.ts` → `resenas` |
| Reglas de la casa | Inventadas | `src/data/contenido.ts` → `reglasCasa` |
| Precios de la taquiza | $19–24 por taco, aguas $30/persona, taquero $950/turno, etc. | `src/lib/taquiza.ts` → `GUISADOS_TAQUIZA`, `SUPUESTOS` |
| URL del demo | `https://la-vuelta-demo.pages.dev` (solo para metadatos) | `site.ts` → `url` |
| Aviso de privacidad | Texto genérico, marcado como demostración | `src/app/aviso-de-privacidad/page.tsx` |

## Marcas
No aparecen marcas reales de refrescos, cervezas, salsas, tarjetas ni plataformas de reparto. Se usan nombres genéricos:
"refresco de vidrio", "cerveza de barril", "agua fresca". WhatsApp solo se nombra como canal de envío del pedido.

## Sobre el nombre
Una búsqueda rápida (octubre de 2026) no encontró una taquería notable llamada "La Vuelta". El nombre es genérico,
así que podría coincidir con algún negocio pequeño; para un cliente real se sustituye siempre por el suyo.

## Avisos visibles en el sitio
- Footer, en todas las páginas: "Sitio de demostración. Todos los nombres, teléfonos, direcciones, precios y reseñas son ficticios."
- Hero: "desde 1987 (ficticio)". Historia: "Historia ficticia, para el demo". Reseñas: "(reseña ficticia)". Pizarrón: "precios ilustrativos".
- Comanda y taquiza en modo demo: modal "Vista previa", con la nota "En un sitio real, esto se envía por WhatsApp".

## Indexación
`site.indexable = false` → `<meta name="robots" content="noindex, nofollow">`, `robots.txt` con `Disallow: /`, sin sitemap
(el `postbuild` borra el sitemap vacío) y sin JSON-LD.
