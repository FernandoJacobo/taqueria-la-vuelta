"use client";

import { catalogo, cantidadDe, claveLinea } from "@/lib/pedido";
import { usePedido } from "./PedidoProvider";

type Props = {
  id: string;
  conQueso?: boolean;
  /** `cuadro`: botón "+" de 44 px; `texto`: botón con leyenda (p. ej. "con queso +$8"). */
  variante?: "cuadro" | "texto";
  children?: React.ReactNode;
  className?: string;
};

/** Agrega un artículo a la comanda y lo anuncia a lectores de pantalla. */
export function BotonAgregar({ id, conQueso = false, variante = "cuadro", children, className = "" }: Props) {
  const { estado, despachar, anunciar } = usePedido();
  const articulo = catalogo.get(id);
  if (!articulo) return null;

  const nombre = conQueso ? `${articulo.nombre} con queso` : articulo.nombre;
  const enComanda =
    variante === "cuadro" ? cantidadDe(estado.lineas, id) : (estado.lineas.find((l) => l.clave === claveLinea(id, true))?.cantidad ?? 0);

  const agregar = () => {
    despachar({ tipo: "agregar", id, conQueso });
    anunciar(`${nombre} a la comanda. Llevas ${enComanda + 1}.`);
  };

  if (variante === "texto") {
    return (
      <button
        type="button"
        onClick={agregar}
        className={`inline-flex min-h-11 items-center gap-1.5 border-2 border-dashed border-current px-2.5 text-sm font-bold active:translate-y-0.5 ${className}`}
      >
        <span className="texto-pantalla">Agregar {articulo.nombre} </span>
        {children}
        {enComanda > 0 && (
          <span className="bg-limon px-1.5 text-humo">
            ×{enComanda}
            <span className="texto-pantalla"> en la comanda</span>
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={agregar}
      aria-label={`Agregar ${nombre}${enComanda ? ` (llevas ${enComanda})` : ""}`}
      className={`relative grid size-11 shrink-0 place-items-center border-[3px] border-humo bg-limon font-cartel text-2xl leading-none text-humo shadow-[3px_3px_0_var(--color-tortilla)] transition-transform active:translate-x-[3px] active:translate-y-[3px] active:shadow-none ${className}`}
    >
      <span aria-hidden="true">+</span>
      {enComanda > 0 && (
        <span aria-hidden="true" className="absolute -right-2.5 -top-2.5 grid min-w-6 place-items-center rounded-full border-2 border-humo bg-tortilla px-1 font-cuerpo text-xs font-bold">
          {enComanda}
        </span>
      )}
    </button>
  );
}
