# AUDITORIA-DISENO.md

Revisión de cada sección contra `DISENO.md` y la lista negra de la especificación (§3).
Capturas de referencia: `npm run build`, `npm run servir` y luego `npm run qa` (se guardan en `qa/`, que no se versiona).

## 1. Composición única por sección

| # | Sección | Fondo | Composición | ¿Se repite en otra sección? |
|---|---|---|---|---|
| A | Barra de turno | humo | Tira de boleto de una línea: horario a la izquierda, estado en vivo en etiqueta con muesca a la derecha, mini trompo como foco. | No |
| B | Hero | tortilla + roja | Cartel de lona descuadrado: titular apilado a 4 tamaños (rótulo / cartel sobreimpreso / lona / cartel invertido en caja roja girada), "APAGA." escalonado que se monta sobre la base del trompo; trompo girando en la columna derecha; sticker circular festoneado como CTA; nota de marcador; marcas de registro en las esquinas. Rejilla asimétrica 7/5. | No |
| C | Marquee | verde | Banda de lona inclinada −2.5°, más ancha que la pantalla, filetes tortilla arriba y abajo, cortes sobreimpresos con estrellas recortadas. | No (único marquee) |
| D | El pizarrón | humo con marco morita | Pizarrón a columnas CSS desiguales (1→2→3) con subrayado de gis, puntos guía, chiles dibujados, etiquetas con muesca, botón "+" cuadrado y variante "con queso" punteada. Borrones de gis en zigzag. | No |
| E | El salsero | dinámico (5 colores) | Mesa vista desde arriba: cinco tazones de peltre en línea ondulada con giros distintos; debajo, ficha de etiqueta en rejilla 7/5 (nombre gigante sobreimpreso + chiste / picómetro, ingredientes, "va con", botón). Toda la sección cambia de color. | No |
| F | La taquiza | habanero | Libreta con renglones (formulario por pasos numerados) + ticket con borde dentado girado 1.5° y fijo al hacer scroll en escritorio. | No |
| G | Historia | morita | Escalera de numerales 1987 / 2004 / 2019 desplazados en diagonal; "lo que nunca cambiamos" como renglones numerados con reglas gruesas y comal ilustrado. | No |
| H | Voces de la fila | cebolla / limón / roja / verde | Bandas de cita a sangre, cada una con color, alineación (izq., der., desplazada, der. con margen) y tamaño distintos; comillas gigantes recortadas. | No |
| I | Horarios y cómo llegar | tortilla | Mapa SVG protagonista (8/12) con el letrero de turnos pegado encima y girado; columna de datos prácticos y reglas de la casa. | No |
| J | Footer | roja + franja humo | Nombre gigante cortado por el borde inferior, trompo asomándose detrás de la última letra, franja de aviso de demo y cintilla JacoboDev. | No |
| K | `/aviso-de-privacidad` | tortilla | Columna estrecha con numerales grandes al margen. | No |
| L | 404 | cebolla | "404" limón gigante, titular sobreimpreso y trompo **vacío** (solo varilla y piña). | No |

**Total: 10 composiciones distintas en la portada + 2 en páginas extra** (el mínimo era 7).

## 2. Lista negra (§3) — verificación

| Regla | Estado | Evidencia |
|---|---|---|
| Fuentes prohibidas (Inter, Poppins, Geist, etc.) | Cumple | Solo Bowlby One, Karla y Rock Salt (`src/app/layout.tsx`). Se eliminó Geist del scaffolding. |
| Fuentes "estilo mexicano" | Cumple | Ninguna. |
| Gradientes morado/azul/cian, glow, blobs, glassmorphism | Cumple | Sin gradientes de color. El único `linear-gradient` es una máscara que desvanece la trama de puntos del hero. Las manchas redondeadas del pizarrón (ronda 0) parecían *blobs* y se cambiaron por borrones de gis en zigzag. |
| Cuadrícula de 3–4 tarjetas idénticas con icono | Cumple | No hay tarjetas. Los apetitos de la taquiza son 4 opciones de un formulario (radios), sin iconos. |
| Hero centrado + 2 botones + 3 estadísticas | Cumple | Hero asimétrico, un sticker y un enlace de texto, sin cifras. |
| Badges *pill* con puntito verde, radios de 12–24 px | Cumple | Radios en 0; `rounded-full` solo en stickers y tazones. El "puntito" de las etiquetas es el ojal de la etiqueta con muesca, y el estado en vivo va en una etiqueta recortada, no en una *pill*. |
| Sombras difusas, bordes grises de 1 px | Cumple | Solo sombras planas de tinta (`shadow-tinta*`), bordes de 2–6 px en humo/tortilla. |
| Iconos Lucide/Heroicons | Cumple | Sin librerías de iconos. Todo es SVG propio (`Sprite.tsx`). |
| Folclor de postal | Cumple | Sin papel picado, calaveras, sombreros, cactus, etc. Los elementos son del mostrador: trompo, piña, tazones de peltre, comal, tortillas. |
| Foto de stock con bokeh | Cumple | No hay fotos. |
| Carrusel de reseñas con estrellas | Cumple | Bandas estáticas sin estrellas ni avatares. |
| *Fade-up* idéntico, modo claro/oscuro | Cumple | No hay animaciones de entrada. Un solo tema (`colorScheme: light`). |
| Textos vacíos de agencia | Cumple | Búsqueda de "auténtico", "tradición", "experiencia", "pasión", "calidad": 0 coincidencias en `src/`. |
| Emojis, lorem ipsum, librerías de componentes | Cumple | Un "⏱" en el ticket de la taquiza se cambió por el símbolo `i-reloj` dibujado. Sin shadcn, DaisyUI ni MUI. |
| No parecerse a otros demos (kraft/sellos, marfil/coral) | Cumple | Paleta de salsas, peltre y serigrafía. |

## 3. Rondas de QA visual

**Ronda 0 (durante la construcción)**
- La carne del trompo, con franjas verticales y horizontales parejas, parecía tela escocesa. Se redibujó con capas onduladas irregulares, manchas de dorado, carbón y grasa que giran, más el volumen fijo.
- La rejilla del hero se colocaba implícitamente y el trompo quedaba a la izquierda del titular. Se hizo explícita la colocación.
- El sticker no se veía porque `relative` le ganaba a `absolute`.
- Los chiles de 20 px se leían como lunas o plátanos. Se redibujaron más regordetes y con cáliz grande; en el menú solo se muestran los activos.
- Faltaban tamaños de texto (`text-xl`, `text-5xl`…) al reiniciar la escala de Tailwind: los numerales salían pequeños. Se añadieron al tema.
- Footer: el nombre se cortaba por la derecha ("LA VUELT"). Ahora se corta por abajo.
- Voces: las comillas tapaban el título. El título pasó a una etiqueta a la derecha.
- Historia: la escalera desbordaba a 768 y 1024 px. Ahora se apila hasta `xl`.

**Ronda 1 (390 / 768 / 1440)**
- A 768 px, la nota "sí hay de suadero" caía encima de "APAGA.". Se movió al hueco a la izquierda del trompo.
- Footer en tablet y móvil: corte demasiado agresivo y el trompo chocaba con la "A". Se ajustaron el corte y la posición.
- Flujo e2e: la comanda no persistía al recargar (carrera entre hidratación y guardado). Se movió la bandera al reducer.
- Accesibilidad: nombres accesibles que no coincidían con el texto visible y un `<dl>` con un botón dentro. Ambos corregidos (Lighthouse a11y 97 → 100).

**Ronda 2 (build de producción, 7 anchos + estados)**
- Comanda en escritorio: el título empujaba "Cerrar" fuera del panel. Se redujo el título.
- Vista previa del mensaje: los renglones de libreta tachaban el texto. Se alinearon al padding.
- Sin desbordes horizontales de 360 a 1536 px. Con movimiento reducido, ni el trompo ni el marquee se animan.
