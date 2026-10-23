/**
 * Sprite de ilustraciones: cada pieza se define una vez como <symbol> y se reutiliza con <Icono />.
 * Tintas: `currentColor` = tinta principal; `--relleno` y `--trazo` permiten re-entintar con CSS.
 */

function estrella(puntas: number, rExt: number, rInt: number, c = 50): string {
  const pts: string[] = [];
  for (let i = 0; i < puntas * 2; i++) {
    const r = i % 2 === 0 ? rExt : rInt;
    const a = (Math.PI * i) / puntas - Math.PI / 2;
    pts.push(`${(c + r * Math.cos(a)).toFixed(1)},${(c + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(" ");
}

const TRAZO = "var(--trazo, #16110f)";
const RELLENO = "var(--relleno, currentColor)";

export function SpriteIlustraciones() {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
      <defs>
        {/* Borde de tinta: desplaza el contorno para que parezca impreso con rasero. Solo en piezas chicas. */}
        <filter id="tinta" x="-6%" y="-6%" width="112%" height="112%">
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="11" result="ruido" />
          <feDisplacementMap in="SourceGraphic" in2="ruido" scale="3.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <pattern id="pt-trama" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.25" fill="#16110f" />
        </pattern>
        <pattern id="pt-trama-clara" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.15" fill="#f3e6c6" />
        </pattern>

        <symbol id="i-chile" viewBox="0 0 32 32">
          <path
            d="M7.6 11.4c-2.6 4.4-1.4 10.6 3.6 14.6 4.4 3.5 10.4 4.6 15.6 3.4 1.6-.4 1.4-1.8-.2-2.2-5.4-1.2-9-4.6-10.6-9.6-.8-2.6-1-4.8-1.6-6.4-1.4-2.6-5-2.4-6.8.2Z"
            fill={RELLENO}
            stroke={TRAZO}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M6.4 10.6c.6-3 3.6-4.4 6.6-3.4 1.8.6 2.6 2.4 2 4.2-2.6-1.6-5.8-1.8-8.6-.8Z" fill="#1f6b3a" stroke={TRAZO} strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M10.4 7.4c-.4-2.6.6-4.8 3-6" fill="none" stroke={TRAZO} strokeWidth="2.4" strokeLinecap="round" />
          <path d="M9.4 15.4c.4 3.4 2.4 6.4 5.4 8.4" fill="none" stroke="#f3e6c6" strokeOpacity=".6" strokeWidth="1.8" strokeLinecap="round" />
        </symbol>

        <symbol id="i-estrella" viewBox="0 0 100 100">
          <polygon points={estrella(14, 49, 39)} fill={RELLENO} stroke={TRAZO} strokeWidth="3" strokeLinejoin="round" />
        </symbol>

        <symbol id="i-flecha" viewBox="0 0 120 60">
          <path d="M4 44C26 52 62 50 86 30c6-5 10-11 13-18" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
          <path d="M86 12l14-2 3 15" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>

        <symbol id="i-trompo-mini" viewBox="0 0 24 32">
          <rect x="11.2" y="1" width="1.6" height="30" fill="currentColor" />
          <path d="M9 3.2c0-1.4 1.4-2.2 3-2.2s3 .8 3 2.2-1.3 2.4-3 2.4-3-1-3-2.4Z" fill="#d8e24a" stroke="currentColor" strokeWidth=".9" />
          <path d="M4 8.4c3-1.3 13-1.3 16 0l-2.3 14.4c-.6 2.4-2.6 3.6-5.7 3.6s-5.1-1.2-5.7-3.6Z" fill="#f28c1b" stroke="currentColor" strokeWidth="1.2" />
          <path d="M5 12.5h14M5.7 16.6h12.6M6.5 20.7h11" stroke="#b3261e" strokeWidth="1.5" />
          <path d="M6.5 28.6h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </symbol>

        <symbol id="i-tortilla" viewBox="0 0 64 64">
          <path
            d="M32 4c9 .4 16 3.6 21.6 9.6 5.6 6 8 13 7.2 21-1 8.4-5 15-12 19.6-6.8 4.4-14.4 5.8-22.6 3.8C17.8 56 11.4 51.4 7.4 44 3.6 37 3 29.6 5.6 22 8.2 14.6 13.2 9.2 20.6 6 24.4 4.6 28.2 3.8 32 4Z"
            fill="#f3e6c6"
            stroke={TRAZO}
            strokeWidth="2.6"
          />
          <g fill="#5a3220" opacity=".55">
            <ellipse cx="22" cy="20" rx="4" ry="2.6" />
            <ellipse cx="40" cy="16" rx="2.6" ry="1.8" />
            <ellipse cx="44" cy="36" rx="4.6" ry="3" />
            <ellipse cx="26" cy="42" rx="3" ry="2" />
            <ellipse cx="17" cy="32" rx="1.8" ry="1.3" />
            <ellipse cx="34" cy="30" rx="2" ry="1.4" />
          </g>
        </symbol>

        <symbol id="i-cebolla" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="27" fill="#f3e6c6" stroke={TRAZO} strokeWidth="2.6" />
          <g fill="none" stroke="#8b3a7c" strokeWidth="2.4">
            <circle cx="32" cy="32" r="21" />
            <circle cx="32" cy="32" r="15" />
            <circle cx="32" cy="32" r="9" />
          </g>
          <circle cx="32" cy="32" r="3.4" fill="#8b3a7c" />
        </symbol>

        <symbol id="i-cilantro" viewBox="0 0 64 64">
          <path d="M32 62V30M32 40 18 24M32 36l14-16M32 48l-10-6" stroke="#1f6b3a" strokeWidth="2.6" strokeLinecap="round" fill="none" />
          <g fill="#1f6b3a" stroke={TRAZO} strokeWidth="1.6">
            <path d="M18 24c-6-1-10-6-8-11 5-1 9 1 11 5 3-4 8-3 9 1-2 4-7 6-12 5Z" />
            <path d="M46 20c6-1 10-6 8-11-5-1-9 1-11 5-3-4-8-3-9 1 2 4 7 6 12 5Z" />
            <path d="M32 30c-5-2-7-8-4-12 4 0 6 3 6 6 2-3 6-3 7 0-1 4-5 6-9 6Z" />
          </g>
        </symbol>

        <symbol id="i-limon" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="27" fill="#1f6b3a" stroke={TRAZO} strokeWidth="2.6" />
          <circle cx="32" cy="32" r="21.5" fill="#d8e24a" />
          <g stroke="#f3e6c6" strokeWidth="2.6" strokeLinecap="round">
            <path d="M32 13v38M13 32h38M18.6 18.6l26.8 26.8M45.4 18.6 18.6 45.4" />
          </g>
          <circle cx="32" cy="32" r="3" fill="#f3e6c6" />
        </symbol>

        <symbol id="i-comal" viewBox="0 0 120 40">
          <ellipse cx="60" cy="22" rx="52" ry="13" fill="#16110f" />
          <ellipse cx="60" cy="19" rx="46" ry="9" fill="#5a3220" />
          <path d="M8 22H1M112 22h7" stroke="#16110f" strokeWidth="5" strokeLinecap="round" />
          <g fill="#f3e6c6" stroke="#16110f" strokeWidth="1.4">
            <ellipse cx="42" cy="18" rx="13" ry="5" />
            <ellipse cx="74" cy="17" rx="13" ry="5" />
          </g>
        </symbol>

        <symbol id="i-reloj" viewBox="0 0 40 40">
          <circle cx="20" cy="21" r="16" fill="#f3e6c6" stroke={TRAZO} strokeWidth="3" />
          <path d="M20 11v10l7 5" fill="none" stroke={TRAZO} strokeWidth="3" strokeLinecap="round" />
          <path d="M15 2h10" stroke={TRAZO} strokeWidth="3" strokeLinecap="round" />
        </symbol>

        <symbol id="i-gota" viewBox="0 0 40 40">
          <path d="M20 2c6 9 13 15 13 23a13 13 0 0 1-26 0c0-8 7-14 13-23Z" fill={RELLENO} stroke={TRAZO} strokeWidth="2.4" />
        </symbol>
      </defs>
    </svg>
  );
}

/** Usa un símbolo del sprite. Decorativo por defecto (aria-hidden). */
export function Icono({ id, className, titulo }: { id: string; className?: string; titulo?: string }) {
  return (
    <svg className={className} aria-hidden={titulo ? undefined : true} role={titulo ? "img" : undefined} focusable="false">
      {titulo ? <title>{titulo}</title> : null}
      <use href={`#${id}`} />
    </svg>
  );
}
