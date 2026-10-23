import { WHATSAPP_PLACEHOLDER } from "@/config/site";
import { pesos } from "./dinero";
import { formatoHora } from "./horario";
import type { DetalleLinea, TipoPedido } from "./pedido";
import type { ResultadoTaquiza } from "./taquiza";

export function soloDigitos(numero: string | undefined | null): string {
  return (numero ?? "").replace(/\D/g, "");
}

/**
 * Modo demo: no se abre wa.me si el número es el placeholder, si está vacío, si todos sus dígitos
 * después de la lada son cero o si no tiene una longitud plausible (10–15 dígitos).
 */
export function esModoDemo(numero: string | undefined | null): boolean {
  const d = soloDigitos(numero);
  if (!d || d === WHATSAPP_PLACEHOLDER) return true;
  if (d.length < 10 || d.length > 15) return true;
  if (/^0+$/.test(d.slice(2))) return true;
  return false;
}

export function urlWhatsApp(numero: string, mensaje: string): string {
  return `https://wa.me/${soloDigitos(numero)}?text=${encodeURIComponent(mensaje)}`;
}

export type DatosPedido = {
  nombre: string;
  tipo: TipoPedido;
  /** "HH:MM" o "" para "lo antes posible". */
  hora: string;
  notas?: string;
};

export function mensajePedido(negocio: string, datos: DatosPedido, detalle: DetalleLinea[], total: number): string {
  const renglones = detalle.map((d) => `${d.cantidad} x ${d.nombre} — ${pesos(d.subtotal)}`);
  const partes = [
    `Hola, ${negocio}. Va mi pedido:`,
    "",
    ...renglones,
    "",
    `Total: ${pesos(total)} MXN`,
    `Tipo: ${datos.tipo === "llevar" ? "Para llevar" : "Para comer aquí"}`,
    `${datos.tipo === "llevar" ? "Paso por él" : "Llego"}: ${datos.hora ? formatoHora(datos.hora) : "lo antes posible"}`,
    `Nombre: ${datos.nombre.trim()}`,
  ];
  const notas = datos.notas?.trim();
  if (notas) partes.push(`Notas: ${notas}`);
  return partes.join("\n");
}

export type DatosTaquiza = { nombre: string; fecha?: string; apetito: string };

export function mensajeTaquiza(negocio: string, datos: DatosTaquiza, r: ResultadoTaquiza): string {
  const partes = [
    `Hola, ${negocio}. Quiero cotizar una taquiza:`,
    "",
    `Personas: ${r.personas} (apetito: ${datos.apetito})`,
    `Tacos estimados: ${r.tacos}`,
    ...r.porGuisado.map((g) => `- ${g.nombre}: ${g.tacos} tacos (${g.kg} kg)`),
    "",
    ...r.desglose.map((d) => `${d.concepto}: ${pesos(d.importe)}`),
    `Total estimado: ${pesos(r.total)} MXN`,
    `Anticipo (50 %): ${pesos(r.anticipo)}`,
    "",
    `Nombre: ${datos.nombre.trim()}`,
  ];
  if (datos.fecha) partes.push(`Fecha del evento: ${datos.fecha}`);
  partes.push("(Es una estimación; confírmenme disponibilidad.)");
  return partes.join("\n");
}
