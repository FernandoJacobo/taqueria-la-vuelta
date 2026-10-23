import type { ReactNode } from "react";
import { Icono } from "@/components/ilustraciones/Sprite";

/* ---------- Borde de tinta irregular entre secciones ---------- */

function aleatorio(semilla: number) {
  let s = semilla >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Path de borde rasgado/entintado, determinista por semilla (se calcula en el build). */
export function trazoBorde(semilla: number, ancho = 1440, alto = 28, pasos = 64): string {
  const r = aleatorio(semilla);
  const paso = ancho / pasos;
  let d = `M0 ${alto} L0 ${(alto * (0.35 + r() * 0.4)).toFixed(1)}`;
  for (let i = 1; i <= pasos; i++) {
    const y = alto * (0.15 + r() * 0.7);
    const x = i * paso + (r() - 0.5) * paso * 0.5;
    d += ` L${Math.min(ancho, x).toFixed(1)} ${y.toFixed(1)}`;
  }
  return `${d} L${ancho} ${alto} Z`;
}

/**
 * Borde de tinta que "muerde" la sección anterior. Va dentro de una sección `relative`
 * y toma su color de `className` (text-*).
 */
export function BordeTinta({ semilla, className = "", abajo = false }: { semilla: number; className?: string; abajo?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1440 28"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-x-0 z-10 block h-4 w-full sm:h-6 ${abajo ? "top-full -mt-px rotate-180" : "bottom-full -mb-px"} ${className}`}
    >
      <path d={trazoBorde(semilla)} fill="currentColor" />
    </svg>
  );
}

/* ---------- Nota de marcador / gis (Rock Salt). Máximo 8 en el sitio: ver DISENO.md ---------- */

export function NotaMarcador({ children, className = "", flecha }: { children: ReactNode; className?: string; flecha?: "izquierda" | "derecha" | "abajo" }) {
  return (
    <p className={`font-gis text-sm leading-snug ${className}`}>
      {flecha === "izquierda" && <Icono id="i-flecha" className="mr-1 inline-block h-6 w-12 -scale-x-100 align-middle" />}
      <span>{children}</span>
      {flecha === "derecha" && <Icono id="i-flecha" className="ml-1 inline-block h-6 w-12 align-middle" />}
      {flecha === "abajo" && <Icono id="i-flecha" className="mx-auto mt-1 block h-8 w-14 rotate-[70deg]" />}
    </p>
  );
}

/* ---------- Chiles de picor ---------- */

export function Chiles({
  nivel,
  de = 3,
  className = "",
  tamano = "h-5 w-5",
  vacios = true,
}: {
  nivel: number;
  de?: number;
  className?: string;
  tamano?: string;
  /** Dibuja también los chiles "apagados" (picómetro). */
  vacios?: boolean;
}) {
  if (nivel === 0 && !vacios) return null;
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`}>
      <span className="texto-pantalla">{`Picor ${nivel} de ${de}`}</span>
      {Array.from({ length: vacios ? de : nivel }, (_, i) => (
        <Icono
          key={i}
          id="i-chile"
          className={`${tamano} ${i < nivel ? "" : "opacity-45 [--relleno:transparent]"} ${i % 2 ? "rotate-6" : "-rotate-3"}`}
        />
      ))}
    </span>
  );
}

/* ---------- Etiqueta con muesca ---------- */

export function Etiqueta({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`etiqueta-muesca inline-block py-0.5 text-[0.6875rem] font-bold uppercase tracking-[0.08em] ${className}`}>
      {children}
    </span>
  );
}
