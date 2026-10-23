# DISENO.md — Dirección de arte de "La Vuelta"

> Contrato visual del demo. Si una decisión de UI contradice este archivo, gana este archivo
> (o se actualiza aquí primero, con el motivo).

## 1. Concepto: "El salsero y la serigrafía"

Una taquería de trompo en turno de noche contada con **dos objetos que ya están en el mostrador**:

1. **El salsero.** La paleta del sitio *son* las salsas. Cada sección es un tazón de un color
   distinto, a sangre completa, sin degradados. En la sección del salsero, elegir una salsa
   **repinta la sección entera** con el color de esa salsa.
2. **La lona serigrafiada.** Todo se imprime "a dos tintas": colores planos, **sobreimpresión
   con registro desfasado** (dos capas del mismo texto movidas 2–4 px con `multiply`),
   trama de puntos (*halftone*) en sombras, grano de papel, bordes de tinta irregulares.
   Nada de sombras difusas: si algo "flota", lo hace con una sombra plana desfasada en tinta.

Atmósfera: turno de noche, foco de 100 W, ruido de la plancha, humor de fila. **Cero postal.**

### Qué NO es (para no confundirlo con otros demos)
- No hay papel kraft, sellos de goma ni etiquetas de taller (demo taller).
- No hay marfil, coral ni dibujos médicos (demo dental).
- No hay hero centrado, ni filas de estadísticas, ni tarjetas con icono en círculo.

## 2. Tokens (un solo tema)

| Token | Valor | Rol |
|---|---|---|
| `--color-tortilla` | `#F3E6C6` | fondo claro, texto sobre oscuros |
| `--color-humo` | `#16110F` | tinta, bordes, texto sobre claros, pizarrón |
| `--color-verde` | `#1F6B3A` | tazón de tomatillo |
| `--color-roja` | `#B3261E` | tazón de guajillo |
| `--color-habanero` | `#F28C1B` | tazón naranja, precios sobre humo |
| `--color-morita` | `#5A3220` | tazón café |
| `--color-cebolla` | `#8B3A7C` | tazón morado |
| `--color-limon` | `#D8E24A` | stickers y resaltados puntuales (nunca un bloque grande) |

Radios: `0` por defecto; `--radius-full` solo para stickers circulares y tazones.
Sombras: **solo planas** — `--shadow-tinta: 4px 4px 0 var(--color-humo)` y
`--shadow-tinta-sm: 2px 2px 0 …`. Bordes: 3 px (`--border-grueso`) o 6 px en marcos.

### Contraste verificado (WCAG 2.x, script en `scripts/contraste.mjs`)

| Texto / fondo | Ratio | Uso permitido |
|---|---|---|
| tortilla / humo | 15.11 | todo |
| tortilla / morita | 8.86 | todo |
| tortilla / cebolla | 5.66 | todo |
| tortilla / roja | 5.27 | todo |
| tortilla / verde | 5.26 | todo |
| humo / tortilla | 15.11 | todo |
| humo / limón | 13.29 | todo |
| humo / habanero | 7.62 | todo |
| habanero / humo | 7.62 | precios del pizarrón |
| limón / morita, cebolla, roja, verde | 7.79 / 4.98 / 4.64 / 4.62 | resaltados sobre tazones oscuros |
| roja / tortilla | 5.27 | detalles rojos del hero |
| **Prohibido**: habanero/tortilla (1.98), humo/verde (2.87), humo/roja (2.87), habanero/morita (4.47) | | |

## 3. Tipografía

| Rol | Fuente | Pesos | Notas |
|---|---|---|---|
| Titulares | **Bowlby One** | 400 | mayúsculas, `leading-[0.82]`, `tracking-[-0.02em]`. Cubre Á É Í Ó Ú Ñ ¿ ¡ (subset latin). |
| Cuerpo | **Karla** | 400 / 700 | 16 px base, 14 px en "letra chica" práctica. |
| Pizarrón / marcador | **Rock Salt** | 400 | **máx. 8 apariciones** (inventario abajo). |

Escala (fluida con `clamp()`; mínimo para 360 px, máximo para 1536 px):

| Token | clamp | Uso |
|---|---|---|
| `text-cartel` | `clamp(3.4rem, 15vw, 13rem)` | titular del hero, nombre del footer |
| `text-lona` | `clamp(2.6rem, 10vw, 8rem)` | marquee, numerales de historia |
| `text-rotulo` | `clamp(2rem, 6.5vw, 4.75rem)` | títulos de sección |
| `text-cita` | `clamp(1.75rem, 5vw, 4rem)` | voces de la fila |
| `text-letrero` | `clamp(1.25rem, 2.6vw, 1.75rem)` | subtítulos, categorías del pizarrón |
| `text-base` / `text-sm` | 1rem / 0.875rem | cuerpo práctico |

### Inventario de Rock Salt (máx. 8)
1. Hero — "sí hay de suadero" (con flecha a mano).
2. Pizarrón — "ojo: pica" junto a la tripa dorada.
3. Pizarrón — "pregunta por el del turno".
4. Salsero — "si dudas entre dos, pide las dos".
5. Taquiza — "de cuñado = 11 tacos por cabeza".
6. Historia — "esto no se negocia".
7. Horarios — "a las 11 se llena".
8. 404 — "se acabó".

## 4. Composiciones por sección (9 distintas + 2 páginas)

| # | Sección | Fondo | Composición única |
|---|---|---|---|
| A | Barra de turno | humo | **Tira de boleto**: una línea, horario a la izquierda, estado en vivo en una etiqueta con muesca (limón) a la derecha; mini trompo dibujado como "foco". |
| B | Hero | tortilla + roja | **Cartel de lona descuadrado**: titular apilado palabra por palabra a tamaños distintos que se sale por la derecha y pasa *por encima* del trompo; trompo girando a la derecha con sombra halftone; sticker circular CTA montado sobre la base del trompo; nota de marcador con flecha. Rejilla asimétrica 7/5, nada centrado. |
| C | Marquee | verde | **Banda de lona inclinada** (-2.5°) a sangre, más ancha que la pantalla, con texto gigante sobreimpreso tortilla+habanero y estrellas recortadas como separador. Un solo marquee en todo el sitio. |
| D | El pizarrón | humo con marco morita | **Pizarrón a columnas desiguales** (CSS columns 1→2→3): categorías en Bowlby con subrayado de gis, filas con puntos guía, chiles dibujados, etiquetas con muesca, botón "+" cuadrado limón. Sin tarjetas. |
| E | El salsero | dinámico (roja por defecto) | **Mesa vista desde arriba**: cinco tazones circulares en arco irregular a la izquierda/arriba; a la derecha una **ficha de etiqueta** grande (nombre gigante, ingredientes, picómetro, "va con…", chiste). Toda la sección cambia de color. |
| F | La taquiza | habanero | **Libreta de comanda + ticket**: formulario a la izquierda como hoja de libreta con renglones; resultado a la derecha como **ticket largo con borde dentado** girado 1.5°. |
| G | Historia | morita | **Escalera de numerales**: 1987 / 2004 / 2019 enormes en diagonal descendente (cada uno desplazado a la derecha), texto pequeño anclado a cada numeral; abajo "lo que nunca cambiamos" como 4 renglones numerados con regla gruesa. |
| H | Voces de la fila | bandas cebolla / limón / roja | **Bandas de cita**: cada reseña es una franja a sangre de un color, comillas gigantes recortadas, alineación alternada (izq., der., desplazada) y tamaños distintos. Sin avatares ni estrellas. |
| I | Horarios y cómo llegar | tortilla | **Mapa protagonista**: mapa SVG ilustrado ocupando ~60 %, con la tabla de horarios como un **letrero pegado** que se monta sobre el mapa; reglas de la casa como lista numerada con humor y pagos en letra chica. |
| J | Footer | roja | **Nombre cortado**: "LA VUELTA" gigante recortado por el borde inferior, trompo asomándose, aviso de demo en franja humo y cintilla JacoboDev. |
| K | `/aviso-de-privacidad` | tortilla | Documento de una columna estrecha con numerales grandes al margen. |
| L | 404 | cebolla | Trompo **vacío** (solo la varilla y la piña) + titular sobreimpreso + nota de marcador. |

Ritmo vertical deliberadamente irregular: alturas, márgenes y alineaciones cambian por sección.

## 5. Catálogo de ilustraciones SVG

Todas planas, 2–4 tintas, trazo de humo de 3–4 px, definidas una vez como `<symbol>` en
`IlustracionesSprite` y reutilizadas con `<use>` cuando se repiten.

| Ilustración | Archivo / símbolo | Notas |
|---|---|---|
| Trompo de pastor con piña | `Trompo.tsx` | Cono clipeado; franjas de carne y marcas de dorado se desplazan en X (simula giro); brillo fijo encima. Piña con su penacho. Variante `vacio` para 404. |
| Mini trompo | `#i-trompo-mini` | Barra de turno y separadores. |
| Tazón de salsa (vista superior) | `Tazon.tsx` | Borde de barro, salsa del color, semillas/tropezones, cuchara. Parametrizado por salsa. |
| Chile | `#i-chile` | Picor 1–3 en el menú; picómetro 1–5 en el salsero. |
| Estrella de oferta | `#i-estrella` | Separador del marquee y sticker. |
| Tortilla | `#i-tortilla` | Ticket de la taquiza. |
| Cebolla, cilantro, limón | `#i-cebolla`, `#i-cilantro`, `#i-limon` | Insumos de la taquiza. |
| Comal | `#i-comal` | Historia. |
| Mapa del barrio | `MapaBarrio.tsx` | Calles inventadas, manzanas, "AQUÍ" con trompo. |
| Flecha a mano | `#i-flecha` | Notas de marcador. |

## 6. Reglas de textura de impresión

1. **Grano**: ruido `feTurbulence` como imagen de fondo (data URI) en un `::after` por sección, `opacity .14`, `mix-blend-mode: multiply` en fondos claros y `screen`/`soft-light` en oscuros. Nunca más de un grano por bloque.
2. **Sobreimpresión**: componente `<Sobreimpreso>`: capa base + capa `aria-hidden` desplazada (3 px, 2 px) en otra tinta con `mix-blend-mode: multiply` dentro de un grupo con `isolation: isolate` (así funciona igual sobre fondos oscuros). Solo en titulares ≥ `text-rotulo`.
3. **Halftone**: `radial-gradient` de puntos de 1.2 px cada 6 px, solo en sombras de ilustraciones, esquinas de bloques y el ticket.
4. **Bordes de tinta**: los cortes entre secciones son un `<path>` irregular pregenerado (no filtro) del color de la sección siguiente. El filtro `#tinta` (`feTurbulence` + `feDisplacementMap`, escala 2–3) se aplica solo a piezas pequeñas: stickers y etiquetas.
5. **Manchas de salsa**: 2–3 manchas SVG irregulares en todo el sitio, a baja opacidad, en el pizarrón y la taquiza.

## 7. Animación (poca y con sentido)

| Qué | Cómo | Reduced motion |
|---|---|---|
| Trompo girando | `translateX` infinito de franjas dentro del clip, 6 s lineal | detenido |
| Cambio de color del salsero | `transition: background-color, color 450ms` | instantáneo |
| Marquee | `translateX` infinito, 40 s | estático (texto envuelve) |
| Stickers al hover | `rotate(-6deg)` 150 ms | sin rotación |
| Barra de comanda | sube con `translateY` al tener platillos | aparece sin movimiento |

No hay *fade-up* al hacer scroll.

## 8. Voz

Tú, frases cortas, datos concretos. Ejemplos canon:
"Aquí el trompo no se apaga." · "Pica, pero con respeto." · "Si dudas entre dos salsas, pide las dos." ·
"El trompo gira desde las 4 p. m. y se corta a la orden."
Prohibido: "auténtico", "tradición y sazón", "experiencia gastronómica", "pasión por", "calidad y compromiso".
