/**
 * Trompo de pastor con piña. El giro se simula desplazando en X las manchas de dorado dentro del
 * contorno del cono, mientras el brillo y la sombra cilíndrica se quedan fijos. Con
 * `prefers-reduced-motion` la animación se detiene (regla global en globals.css).
 *
 * Las tintas de relleno van desfasadas unos px respecto al contorno (registro de serigrafía).
 */

type Props = {
  /** Prefijo único para los ids internos (clipPath) cuando hay más de un trompo en la página. */
  id: string;
  className?: string;
  /** Trompo sin carne: solo varilla y piña (página 404). */
  vacio?: boolean;
  /** Descripción accesible; si se omite, la ilustración es decorativa. */
  titulo?: string;
};

const CONO =
  "M56 120C92 100 228 100 264 120L248 236C242 318 224 404 204 462C188 478 132 478 116 462 96 404 78 318 72 236Z";

function aleatorio(semilla: number) {
  let s = semilla;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// La superficie que gira se dibuja en un periodo de 120 px y se repite: el ciclo no tiene salto.
const PERIODO = 120;
const r = aleatorio(1987);
const periodo = {
  dorado: Array.from({ length: 9 }, () => ({ x: r() * PERIODO, y: 130 + r() * 320, rx: 6 + r() * 12, ry: 12 + r() * 34 })),
  carbon: Array.from({ length: 8 }, () => ({ x: r() * PERIODO, y: 130 + r() * 320, r: 1.6 + r() * 2.6 })),
  grasa: Array.from({ length: 5 }, () => ({ x: r() * PERIODO, y: 140 + r() * 290, h: 10 + r() * 22 })),
};
const REPETICIONES = [0, 1, 2, 3].map((i) => i * PERIODO);

// Capas de carne apilada (fijas: son horizontales, el giro no las mueve).
const capas = Array.from({ length: 13 }, (_, i) => ({
  y: 132 + i * 26 + (r() - 0.5) * 10,
  grasa: i % 4 === 1,
  onda: 3 + r() * 5,
}));

export function Trompo({ id, className, vacio = false, titulo }: Props) {
  const clip = `${id}-cono`;
  const clipPina = `${id}-pina`;

  return (
    <svg viewBox="0 0 320 560" className={className} role={titulo ? "img" : undefined} aria-hidden={titulo ? undefined : true} focusable="false">
      {titulo ? <title>{titulo}</title> : null}
      <defs>
        <clipPath id={clip}>
          <path d={CONO} />
        </clipPath>
        <clipPath id={clipPina}>
          <ellipse cx="160" cy="74" rx="36" ry="30" />
        </clipPath>
      </defs>

      {/* Sombra de medio tono, impresa en otra pasada */}
      <ellipse cx="178" cy="534" rx="128" ry="17" fill="url(#pt-trama)" opacity=".75" />
      {!vacio && <path d={CONO} transform="translate(18 10)" fill="url(#pt-trama)" opacity=".5" />}

      {/* Quemador vertical */}
      <g>
        <rect x="284" y="132" width="26" height="320" fill="#16110f" />
        {[160, 200, 240, 280, 320, 360, 400].map((y) => (
          <g key={y}>
            <rect x="289" y={y} width="16" height="22" fill="#f28c1b" />
            <rect x="293" y={y + 6} width="8" height="12" fill="#d8e24a" />
          </g>
        ))}
        <rect x="280" y="124" width="34" height="10" fill="#16110f" />
      </g>

      {/* Varilla */}
      <rect x="156" y="6" width="8" height="526" fill="#16110f" />

      {/* Piña */}
      <g>
        <g fill="#1f6b3a" stroke="#16110f" strokeWidth="3" strokeLinejoin="round">
          <path d="M160 50 140 2l22 34Z" />
          <path d="M160 50 120 16l30 26Z" />
          <path d="M160 50 178 0l-6 40Z" />
          <path d="M160 50 200 18l-30 26Z" />
          <path d="M160 50 112 36l40 8Z" />
          <path d="M160 50 208 38l-40 8Z" />
        </g>
        <g transform="translate(4 3)">
          <ellipse cx="160" cy="74" rx="36" ry="30" fill="#f28c1b" />
          <g clipPath={`url(#${clipPina})`}>
            <g className="animate-giro" style={{ transformBox: "view-box" }}>
              {Array.from({ length: 14 }, (_, i) => (
                <path key={i} d={`M${100 + i * 20} 40l28 72M${128 + i * 20} 40l-28 72`} stroke="#b3261e" strokeWidth="2.4" />
              ))}
            </g>
            <rect x="96" y="40" width="34" height="80" fill="url(#pt-trama)" opacity=".6" />
            <rect x="176" y="40" width="9" height="80" fill="#f3e6c6" opacity=".4" />
          </g>
        </g>
        <ellipse cx="160" cy="74" rx="36" ry="30" fill="none" stroke="#16110f" strokeWidth="4" />
      </g>

      {!vacio && (
        <>
          {/* Tintas de la carne, desfasadas del contorno */}
          <g transform="translate(5 3)">
            <path d={CONO} fill="#b3261e" />
            <g clipPath={`url(#${clip})`}>
              {capas.map((c, i) => (
                <path
                  key={i}
                  d={`M40 ${c.y.toFixed(1)}q30 -${c.onda.toFixed(1)} 60 0t60 0t60 0t60 0t60 0`}
                  fill="none"
                  stroke={c.grasa ? "#f28c1b" : "#5a3220"}
                  strokeWidth={c.grasa ? 5 : 2.4}
                  opacity={c.grasa ? 0.75 : 0.45}
                />
              ))}
              {/* Superficie que gira: dorado, carbón y grasa */}
              <g className="animate-giro" style={{ transformBox: "view-box" }}>
                {REPETICIONES.map((dx) => (
                  <g key={dx} transform={`translate(${dx + 40} 0)`}>
                    {periodo.dorado.map((d, i) => (
                      <ellipse key={`d${i}`} cx={d.x} cy={d.y} rx={d.rx} ry={d.ry} fill="#5a3220" opacity=".62" />
                    ))}
                    {periodo.carbon.map((c, i) => (
                      <circle key={`c${i}`} cx={c.x} cy={c.y} r={c.r} fill="#16110f" opacity=".7" />
                    ))}
                    {periodo.grasa.map((g, i) => (
                      <rect key={`g${i}`} x={g.x} y={g.y} width="3.5" height={g.h} rx="1.75" fill="#f3e6c6" opacity=".7" />
                    ))}
                  </g>
                ))}
              </g>
              {/* Volumen fijo: sombra de trama a la izquierda, brillo a la derecha */}
              <rect x="40" y="90" width="62" height="400" fill="url(#pt-trama)" opacity=".75" />
              <rect x="198" y="90" width="14" height="400" fill="#f3e6c6" opacity=".34" />
              <rect x="218" y="90" width="5" height="400" fill="#f3e6c6" opacity=".26" />
            </g>
          </g>
          <path d={CONO} fill="none" stroke="#16110f" strokeWidth="5" strokeLinejoin="round" />
          {/* Tapa de grasa arriba */}
          <path d="M66 118c40-14 148-14 188 0" fill="none" stroke="#f3e6c6" strokeWidth="4" strokeLinecap="round" opacity=".8" />
        </>
      )}

      {vacio && (
        <g stroke="#16110f" strokeWidth="3" fill="#b3261e">
          <path d="M148 470c4-9 20-9 24 0Z" />
          <path d="M146 122c3-6 25-6 28 0l-2 8h-24Z" />
        </g>
      )}

      {/* Charola */}
      <path d="M78 486h164l-14 22H92Z" fill="#16110f" />
      <rect x="146" y="508" width="28" height="24" fill="#16110f" />
    </svg>
  );
}
