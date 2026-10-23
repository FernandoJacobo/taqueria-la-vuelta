"use client";

import { useEffect, useState } from "react";

/**
 * Hora actual que se actualiza cada `cadaMs`. Devuelve `null` en el HTML estático y en el primer
 * render del cliente, para que la hidratación no choque con la hora del build.
 */
export function useAhora(cadaMs = 30_000): Date | null {
  const [ahora, setAhora] = useState<Date | null>(null);
  useEffect(() => {
    const tic = () => setAhora(new Date());
    const primero = window.setTimeout(tic, 0);
    const id = window.setInterval(tic, cadaMs);
    return () => {
      window.clearTimeout(primero);
      window.clearInterval(id);
    };
  }, [cadaMs]);
  return ahora;
}
