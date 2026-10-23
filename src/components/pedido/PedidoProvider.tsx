"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from "react";
import { PEDIDO_VACIO, reducirPedido, totalesPedido, type AccionPedido, type EstadoPedido } from "@/lib/pedido";

const CLAVE_STORAGE = "la-vuelta:comanda:v1";

type ContextoPedido = {
  estado: EstadoPedido;
  despachar: (accion: AccionPedido) => void;
  totales: ReturnType<typeof totalesPedido>;
  comandaAbierta: boolean;
  abrirComanda: () => void;
  cerrarComanda: () => void;
  /** Mensaje para lectores de pantalla (región aria-live). */
  anunciar: (texto: string) => void;
};

const Contexto = createContext<ContextoPedido | null>(null);

export function PedidoProvider({ children }: { children: ReactNode }) {
  // `listo` se vuelve true con la acción "hidratar": hasta entonces no se escribe en localStorage
  // (si no, el primer render guardaría la comanda vacía encima de la guardada).
  const [{ pedido: estado, listo }, despachar] = useReducer(
    (s: { pedido: EstadoPedido; listo: boolean }, a: AccionPedido) => ({
      pedido: reducirPedido(s.pedido, a),
      listo: s.listo || a.tipo === "hidratar",
    }),
    { pedido: PEDIDO_VACIO, listo: false },
  );
  const [comandaAbierta, setComandaAbierta] = useState(false);
  const [aviso, setAviso] = useState("");

  // Leer la comanda guardada (solo en el navegador, después de hidratar).
  useEffect(() => {
    let guardado: unknown = null;
    try {
      guardado = JSON.parse(window.localStorage.getItem(CLAVE_STORAGE) ?? "null");
    } catch {
      // localStorage bloqueado o JSON corrupto: se empieza con la comanda vacía.
    }
    despachar({ tipo: "hidratar", estado: guardado as EstadoPedido });
  }, []);

  useEffect(() => {
    if (!listo) return;
    try {
      window.localStorage.setItem(CLAVE_STORAGE, JSON.stringify(estado));
    } catch {
      // Sin almacenamiento disponible: la comanda vive solo en esta pestaña.
    }
  }, [estado, listo]);

  const anunciar = useCallback((texto: string) => {
    // Vaciar primero para que se vuelva a anunciar el mismo texto.
    setAviso("");
    window.setTimeout(() => setAviso(texto), 30);
  }, []);

  const valor = useMemo<ContextoPedido>(
    () => ({
      estado,
      despachar,
      totales: totalesPedido(estado.lineas),
      comandaAbierta,
      abrirComanda: () => setComandaAbierta(true),
      cerrarComanda: () => setComandaAbierta(false),
      anunciar,
    }),
    [estado, comandaAbierta, anunciar],
  );

  return (
    <Contexto.Provider value={valor}>
      {children}
      <p className="texto-pantalla" aria-live="polite" role="status">
        {aviso}
      </p>
    </Contexto.Provider>
  );
}

export function usePedido(): ContextoPedido {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error("usePedido debe usarse dentro de <PedidoProvider>");
  return ctx;
}
