/**
 * Mapa ilustrado del barrio (INVENTADO). Calles, mercado, jardín y parada son ficticios.
 * Se dibuja en SVG: nada de mapas incrustados de terceros.
 */

const FUENTE = { fontFamily: "var(--font-karla), sans-serif" };
const CARTEL = { fontFamily: "var(--font-bowlby), sans-serif" };

// Manzanas: [x, y, ancho, alto]
const MANZANAS: [number, number, number, number][] = [
  [16, 16, 150, 112], [206, 16, 140, 112], [386, 16, 120, 112], [546, 16, 80, 112],
  [16, 176, 150, 110], [206, 176, 140, 110], [386, 176, 120, 110], [546, 176, 80, 110],
  [16, 334, 150, 90], [206, 334, 140, 90], [386, 334, 120, 90], [546, 334, 80, 90],
];

export function MapaBarrio({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 440" className={className} role="img" aria-labelledby="mapa-titulo mapa-desc">
      <title id="mapa-titulo">Mapa ilustrado del barrio (ficticio)</title>
      <desc id="mapa-desc">
        La taquería está en la esquina de Calle Ejemplo y Calle Muestra, frente al Jardín Demo. La parada del camión está a dos cuadras,
        sobre Avenida Inventada. Hay estacionamiento en batería sobre Calle Ejemplo.
      </desc>

      <rect width="640" height="440" fill="#f3e6c6" />

      {/* Manzanas */}
      {MANZANAS.map(([x, y, w, h], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} fill="#5a3220" opacity=".14" />
          <rect x={x} y={y} width={w} height={h} fill="url(#pt-trama)" opacity=".16" />
          <rect x={x} y={y} width={w} height={h} fill="none" stroke="#16110f" strokeWidth="2.5" />
        </g>
      ))}

      {/* Jardín Demo */}
      <rect x="386" y="176" width="120" height="110" fill="#1f6b3a" stroke="#16110f" strokeWidth="2.5" />
      {[[410, 200], [450, 214], [484, 196], [420, 252], [470, 262], [494, 236]].map(([cx, cy]) => (
        <circle key={`${cx}${cy}`} cx={cx} cy={cy} r="11" fill="#d8e24a" stroke="#16110f" strokeWidth="2" opacity=".9" />
      ))}
      <text x="446" y="236" textAnchor="middle" fontSize="13" fontWeight="700" fill="#f3e6c6" style={FUENTE}>
        JARDÍN DEMO
      </text>

      {/* Mercado Demo */}
      <rect x="16" y="16" width="150" height="112" fill="#8b3a7c" stroke="#16110f" strokeWidth="2.5" />
      <path d="M30 60h122M30 80h122M30 100h122" stroke="#f3e6c6" strokeWidth="2" opacity=".5" />
      <text x="91" y="48" textAnchor="middle" fontSize="13" fontWeight="700" fill="#f3e6c6" style={FUENTE}>
        MERCADO DEMO
      </text>

      {/* Avenida Inventada (entre la 1.ª y 2.ª fila) */}
      <rect x="0" y="134" width="640" height="36" fill="#b3261e" />
      <path d="M0 152h640" stroke="#f3e6c6" strokeWidth="2" strokeDasharray="14 12" />
      <rect x="452" y="140" width="156" height="24" fill="#b3261e" />
      <text x="600" y="159" textAnchor="end" fontSize="15" fill="#f3e6c6" style={CARTEL}>
        AV. INVENTADA
      </text>

      {/* Calle Ejemplo y Calle Muestra */}
      <text x="22" y="316" fontSize="12" fontWeight="700" fill="#16110f" style={FUENTE}>
        CALLE EJEMPLO
      </text>
      <text x="366" y="420" fontSize="12" fontWeight="700" fill="#16110f" transform="rotate(-90 366 420)" style={FUENTE}>
        CALLE MUESTRA
      </text>
      <text x="186" y="420" fontSize="12" fontWeight="700" fill="#16110f" transform="rotate(-90 186 420)" style={FUENTE}>
        CALLE FICTICIA
      </text>

      {/* Estacionamiento en batería */}
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={`M${214 + i * 15} 296l8 14`} stroke="#16110f" strokeWidth="2" />
      ))}
      <rect x="208" y="312" width="22" height="18" fill="#16110f" />
      <text x="219" y="326" textAnchor="middle" fontSize="13" fontWeight="700" fill="#f3e6c6" style={FUENTE}>
        E
      </text>

      {/* Parada del camión */}
      <g>
        <rect x="52" y="118" width="58" height="22" fill="#16110f" />
        <text x="81" y="133" textAnchor="middle" fontSize="11" fontWeight="700" fill="#d8e24a" style={FUENTE}>
          PARADA
        </text>
      </g>

      {/* Ruta caminando */}
      <path d="M110 160h132v62c0 20 20 30 50 30" fill="none" stroke="#16110f" strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" />

      {/* La Vuelta */}
      <g>
        <rect x="282" y="226" width="64" height="60" fill="#d8e24a" stroke="#16110f" strokeWidth="4" />
        <use href="#i-trompo-mini" x="300" y="234" width="28" height="40" color="#16110f" />
        <g transform="translate(250 176) rotate(-8)">
          <use href="#i-estrella" width="74" height="74" color="#f28c1b" />
          <text x="37" y="44" textAnchor="middle" fontSize="15" fill="#16110f" style={CARTEL}>
            AQUÍ
          </text>
        </g>
      </g>

      {/* Norte */}
      <g transform="translate(600 392)">
        <circle r="20" fill="#f3e6c6" stroke="#16110f" strokeWidth="2.5" />
        <path d="M0-14 7 6 0 2-7 6Z" fill="#16110f" />
        <text y="15" textAnchor="middle" fontSize="10" fontWeight="700" fill="#16110f" style={FUENTE}>
          N
        </text>
      </g>
    </svg>
  );
}
