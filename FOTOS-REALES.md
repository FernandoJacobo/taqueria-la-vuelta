# FOTOS-REALES.md

El demo no usa fotos: todo es ilustración SVG. Con un cliente real, las fotos **suman** (no sustituyen) a la
identidad de salsero y serigrafía. Esta es la lista que hay que pedirle y cómo integrarlas sin perder el estilo.

## Lista de fotos a pedir

| # | Foto | Para qué sección | Indicaciones al cliente |
|---|---|---|---|
| 1 | **Fachada de noche**, con el letrero y el foco prendidos | Horarios (junto al mapa) | Desde la banqueta de enfrente, horizontal, sin coches tapando. |
| 2 | **El trompo** girando, de frente, con la piña | Hero (opcional, detrás del trompo ilustrado) | Vertical, fondo lo más limpio posible, sin flash. |
| 3 | **El trompo cortándose**: cuchillo y carne cayendo | Pizarrón o historia | Ráfaga; nos quedamos con una. |
| 4 | **El comal** con tortillas y gringas | Pizarrón (categoría Gringas) | Desde arriba (cenital). |
| 5 | **Manos sirviendo** un taco: piña, cebolla, cilantro | Taquiza | Solo manos, sin caras (o con permiso firmado). |
| 6 | **Las mesas con gente** en turno de noche | Voces de la fila | Gente de espaldas o desenfocada; nada de caras sin permiso. |
| 7 | **El salsero** completo, con sus tazones reales | Salsero | Cenital, sobre la mesa del local, a la misma altura que la ilustración. |
| 8 | **Una foto vieja** de la familia o del primer puesto | Historia (primera vuelta) | Escaneo del original, sin filtros. |

Formato: JPG o HEIC del celular a resolución completa. Nosotros recortamos y comprimimos.

## Tratamiento de serigrafía (para que no parezcan fotos de stock)

1. **Duotono en tintas de salsa.** Se pasa la foto a escala de grises y se mapea a dos tintas de la paleta
   (humo + el color de la sección). En CSS:
   ```css
   .foto-serigrafia { filter: grayscale(1) contrast(1.35); mix-blend-mode: multiply; }
   ```
   sobre un contenedor con fondo del color de la sección. En el build se puede hacer igual con `sharp`
   (`.grayscale().tint()`).
2. **Trama de medio tono.** Encima va un `div.trama` (ya existe en `globals.css`) en humo al 25–35 % de opacidad.
3. **Registro desfasado.** Se duplica la foto con 3–4 px de desfase y la segunda capa en otra tinta con
   `mix-blend-mode: multiply`, como `<Sobreimpreso>` hace con el texto.
4. **Recorte de papel.** Los bordes van rectos o con el `BordeTinta` irregular, nunca redondeados ni con sombra difusa.
5. **Sin bokeh ni "taco perfecto".** Se prefieren fotos con humo, grasa y luz de foco: la noche real.

## Dónde integrarlas
- Imágenes en `public/fotos/` y se usan con `<img loading="lazy" width height>` (la exportación estática usa
  `images.unoptimized`, así que conviene comprimirlas antes: WebP o AVIF de 1600 px como máximo).
- Las ilustraciones no se quitan: el trompo SVG sigue siendo el protagonista del hero y la animación.
