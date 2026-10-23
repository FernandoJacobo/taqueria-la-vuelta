import { menu, PRECIO_QUESO } from "@/data/menu";
import { salsas } from "@/data/salsas";

/** Lo que se puede poner en la comanda: platillos del pizarrón y salsas extra del salsero. */
export type ArticuloCatalogo = { id: string; nombre: string; precio: number; admiteQueso: boolean };

export function crearCatalogo(): Map<string, ArticuloCatalogo> {
  const catalogo = new Map<string, ArticuloCatalogo>();
  for (const cat of menu) {
    for (const p of cat.platillos) {
      catalogo.set(p.id, { id: p.id, nombre: p.enComanda ?? p.nombre, precio: p.precio, admiteQueso: Boolean(p.admiteQueso) });
    }
  }
  for (const s of salsas) {
    catalogo.set(s.id, { id: s.id, nombre: `Salsa ${s.nombre.toLowerCase()} extra (120 ml)`, precio: s.precioExtra, admiteQueso: false });
  }
  return catalogo;
}

export const catalogo = crearCatalogo();

export type LineaPedido = { clave: string; id: string; conQueso: boolean; cantidad: number };
export type TipoPedido = "llevar" | "aqui";
export type EstadoPedido = { lineas: LineaPedido[]; tipo: TipoPedido };

export const PEDIDO_VACIO: EstadoPedido = { lineas: [], tipo: "llevar" };
export const MAX_POR_LINEA = 50;

export type AccionPedido =
  | { tipo: "agregar"; id: string; conQueso?: boolean }
  | { tipo: "quitar"; clave: string }
  | { tipo: "eliminar"; clave: string }
  | { tipo: "vaciar" }
  | { tipo: "tipo"; valor: TipoPedido }
  | { tipo: "hidratar"; estado: EstadoPedido };

export function claveLinea(id: string, conQueso = false): string {
  return conQueso ? `${id}|queso` : id;
}

export function reducirPedido(estado: EstadoPedido, accion: AccionPedido, cat = catalogo): EstadoPedido {
  switch (accion.tipo) {
    case "agregar": {
      const articulo = cat.get(accion.id);
      if (!articulo) return estado;
      const conQueso = Boolean(accion.conQueso && articulo.admiteQueso);
      const clave = claveLinea(accion.id, conQueso);
      const existe = estado.lineas.find((l) => l.clave === clave);
      if (existe) {
        if (existe.cantidad >= MAX_POR_LINEA) return estado;
        return { ...estado, lineas: estado.lineas.map((l) => (l.clave === clave ? { ...l, cantidad: l.cantidad + 1 } : l)) };
      }
      return { ...estado, lineas: [...estado.lineas, { clave, id: accion.id, conQueso, cantidad: 1 }] };
    }
    case "quitar":
      return {
        ...estado,
        lineas: estado.lineas
          .map((l) => (l.clave === accion.clave ? { ...l, cantidad: l.cantidad - 1 } : l))
          .filter((l) => l.cantidad > 0),
      };
    case "eliminar":
      return { ...estado, lineas: estado.lineas.filter((l) => l.clave !== accion.clave) };
    case "vaciar":
      return { ...estado, lineas: [] };
    case "tipo":
      return { ...estado, tipo: accion.valor };
    case "hidratar":
      return sanearPedido(accion.estado, cat);
  }
}

/** Limpia lo que venga de localStorage: ids desconocidos, cantidades raras o formas inválidas. */
export function sanearPedido(crudo: unknown, cat = catalogo): EstadoPedido {
  if (!crudo || typeof crudo !== "object") return PEDIDO_VACIO;
  const obj = crudo as { lineas?: unknown; tipo?: unknown };
  const tipo: TipoPedido = obj.tipo === "aqui" ? "aqui" : "llevar";
  const lineas: LineaPedido[] = [];
  if (Array.isArray(obj.lineas)) {
    for (const l of obj.lineas) {
      if (!l || typeof l !== "object") continue;
      const { id, conQueso, cantidad } = l as Record<string, unknown>;
      const articulo = typeof id === "string" ? cat.get(id) : undefined;
      if (!articulo || typeof cantidad !== "number" || !Number.isInteger(cantidad) || cantidad < 1) continue;
      const queso = conQueso === true && articulo.admiteQueso;
      const clave = claveLinea(articulo.id, queso);
      if (lineas.some((x) => x.clave === clave)) continue;
      lineas.push({ clave, id: articulo.id, conQueso: queso, cantidad: Math.min(cantidad, MAX_POR_LINEA) });
    }
  }
  return { lineas, tipo };
}

export type DetalleLinea = LineaPedido & { nombre: string; unitario: number; subtotal: number };

export function totalesPedido(lineas: LineaPedido[], cat = catalogo) {
  const detalle: DetalleLinea[] = [];
  for (const l of lineas) {
    const a = cat.get(l.id);
    if (!a) continue;
    const unitario = a.precio + (l.conQueso ? PRECIO_QUESO : 0);
    detalle.push({ ...l, nombre: l.conQueso ? `${a.nombre} con queso` : a.nombre, unitario, subtotal: unitario * l.cantidad });
  }
  return {
    detalle,
    piezas: detalle.reduce((s, d) => s + d.cantidad, 0),
    total: detalle.reduce((s, d) => s + d.subtotal, 0),
  };
}

/** Cuántas piezas de un artículo (cualquier variante) hay en la comanda. */
export function cantidadDe(lineas: LineaPedido[], id: string): number {
  return lineas.filter((l) => l.id === id).reduce((s, l) => s + l.cantidad, 0);
}
