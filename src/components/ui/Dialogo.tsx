"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  abierto: boolean;
  alCerrar: () => void;
  /** id del encabezado que nombra al diálogo. */
  tituloId: string;
  className?: string;
  children: ReactNode;
};

/**
 * Diálogo modal nativo (<dialog> + showModal): trae gratis el foco atrapado, Esc para cerrar y
 * la capa superior. Un clic en el fondo también cierra.
 */
export function Dialogo({ abierto, alCerrar, tituloId, className = "", children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (abierto && !d.open) d.showModal();
    if (!abierto && d.open) d.close();
  }, [abierto]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={tituloId}
      onClose={alCerrar}
      onClick={(e) => {
        if (e.target === ref.current) alCerrar();
      }}
      className={`m-0 max-h-none max-w-none bg-transparent p-0 ${className}`}
    >
      {children}
    </dialog>
  );
}
