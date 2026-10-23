import type { ColorSalsa } from "@/data/salsas";

/** Tintas de cada salsa: fondo de la salsa y dos tropezones. */
const TINTAS: Record<ColorSalsa, { salsa: string; a: string; b: string }> = {
  verde: { salsa: "#1f6b3a", a: "#d8e24a", b: "#f3e6c6" },
  roja: { salsa: "#b3261e", a: "#5a3220", b: "#f28c1b" },
  habanero: { salsa: "#f28c1b", a: "#b3261e", b: "#f3e6c6" },
  morita: { salsa: "#5a3220", a: "#f28c1b", b: "#f3e6c6" },
  cebolla: { salsa: "#8b3a7c", a: "#f3e6c6", b: "#d8e24a" },
};

// Tropezones fijos (semillas, chile, ajonjolí) en coordenadas del tazón.
const PUNTOS = [
  [78, 72, 5], [118, 64, 3.5], [132, 98, 5.5], [92, 120, 4], [70, 104, 3], [112, 134, 3.5],
  [140, 126, 3], [100, 88, 2.6], [60, 86, 2.4], [124, 80, 2.2], [86, 140, 2.6], [146, 104, 2],
] as const;

/** Tazón de peltre visto desde arriba, con la salsa adentro. */
export function Tazon({ color, className, desportillado = true }: { color: ColorSalsa; className?: string; desportillado?: boolean }) {
  const t = TINTAS[color];
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false">
      {/* Sombra plana desfasada */}
      <circle cx="108" cy="108" r="90" fill="#16110f" opacity=".9" />
      {/* Borde de peltre */}
      <circle cx="100" cy="100" r="90" fill="#16110f" />
      <circle cx="100" cy="100" r="84" fill="#f3e6c6" />
      <circle cx="100" cy="100" r="84" fill="url(#pt-trama)" opacity=".18" />
      {/* Salsa: contorno irregular, desfasada 3 px del pozo */}
      <path
        d="M100 34c20 0 36 8 47 21 10 12 15 28 12 44-2 17-11 31-24 40-13 9-30 12-46 9-16-4-30-14-38-28-8-15-9-32-3-47 6-14 18-26 32-32 7-4 13-7 20-7Z"
        transform="translate(3 2)"
        fill={t.salsa}
        stroke="#16110f"
        strokeWidth="2"
      />
      {color === "cebolla" ? (
        <g fill="none" stroke={t.a} strokeWidth="4" strokeLinecap="round" opacity=".9">
          <path d="M66 82c10-14 30-16 40-6" />
          <path d="M98 128c14 4 30-4 34-18" />
          <path d="M72 116c4 10 14 14 22 12" />
          <path d="M112 66c12 0 22 8 24 18" />
          <path d="M88 96c6-6 16-6 22 0" />
        </g>
      ) : (
        <g>
          {PUNTOS.map(([x, y, r], i) => (
            <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.66} fill={i % 3 === 0 ? t.b : t.a} opacity=".85" transform={`rotate(${i * 37} ${x} ${y})`} />
          ))}
        </g>
      )}
      {/* Brillo */}
      <path d="M64 70c6-12 18-20 30-22" fill="none" stroke="#f3e6c6" strokeWidth="5" strokeLinecap="round" opacity=".55" />
      {desportillado && <path d="M168 54c4 2 6 6 6 10-4 0-8-2-10-6Z" fill="#16110f" />}
    </svg>
  );
}
