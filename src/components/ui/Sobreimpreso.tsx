import type { CSSProperties, ElementType, ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Clases de la segunda tinta (normalmente un `text-*`). */
  capa: string;
  /**
   * `encima`: la segunda tinta multiplica sobre la primera (fondos claros; la intersección da un tercer color).
   * `debajo`: la segunda tinta queda detrás y multiplica contra el fondo (fondos oscuros; la primera tinta se lee completa).
   */
  modo?: "encima" | "debajo";
  /** Desfase del registro en px. */
  x?: number;
  y?: number;
  className?: string;
  as?: ElementType;
};

/** Texto impreso a dos tintas con el registro desfasado (misregistration). */
export function Sobreimpreso({ children, capa, modo = "encima", x = 3, y = 2, className = "", as: Tag = "span" }: Props) {
  const estilo = { "--desfase-x": `${x}px`, "--desfase-y": `${y}px` } as CSSProperties;
  return (
    <Tag className={`sobreimpreso ${modo === "debajo" ? "sobreimpreso-debajo" : ""} ${className}`} style={estilo}>
      <span className="relative block">{children}</span>
      <span aria-hidden="true" className={`capa block ${capa}`}>
        {children}
      </span>
    </Tag>
  );
}
