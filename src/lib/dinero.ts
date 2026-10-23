const formato = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

/** 1234 → "$1,234". Sin centavos: en la taquería se cobra en pesos cerrados. */
export function pesos(cantidad: number): string {
  return formato.format(Math.round(cantidad));
}
