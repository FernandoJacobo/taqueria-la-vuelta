/**
 * Calculadora de taquiza. Lógica pura: sin React ni DOM. Todos los supuestos están en SUPUESTOS
 * para que una taquería real los ajuste sin tocar la fórmula. Precios FICTICIOS.
 */

export type Apetito = "ligero" | "normal" | "taquiza" | "cunado";

export const APETITOS: Record<Apetito, { etiqueta: string; tacos: number; nota: string }> = {
  ligero: { etiqueta: "Ligero", tacos: 4, nota: "cena de oficina" },
  normal: { etiqueta: "Normal", tacos: 6, nota: "cumpleaños con pastel" },
  taquiza: { etiqueta: "De taquiza", tacos: 8, nota: "la fiesta es el taco" },
  cunado: { etiqueta: "De cuñado", tacos: 11, nota: "nadie se va con hambre" },
};

export const GUISADOS_TAQUIZA = [
  { id: "pastor", nombre: "Pastor", precio: 19 },
  { id: "suadero", nombre: "Suadero", precio: 21 },
  { id: "longaniza", nombre: "Longaniza", precio: 19 },
  { id: "bistec", nombre: "Bistec", precio: 22 },
  { id: "tripa", nombre: "Tripa dorada", precio: 24 },
] as const;

export type GuisadoId = (typeof GUISADOS_TAQUIZA)[number]["id"];

export const SUPUESTOS = {
  /** Tacos que salen de 1 kg de carne cruda marinada (≈ 36 g por taco). */
  tacosPorKgCarne: 28,
  /** Tortillas de taquería por kilo. */
  tortillasPorKg: 30,
  /** Tortillas por taco (doble tortilla, como en el local). */
  tortillasPorTaco: 2,
  /** Merma de tortilla: se rompen, se enfrían, se regalan. */
  mermaTortilla: 0.1,
  /** Kilos de cebolla blanca picada por cada 100 tacos. */
  kgCebollaPor100Tacos: 1,
  /** Tacos que alcanza un manojo de cilantro. */
  tacosPorManojo: 40,
  /** Un limón por cada 3 tacos; ≈ 30 limones por kilo. */
  tacosPorLimon: 3,
  limonesPorKg: 30,
  /** Mililitros de salsa por taco (todas las salsas juntas). */
  mlSalsaPorTaco: 15,
  /** Un taquero con trompo sirve ≈ 220 tacos por hora sin que se haga fila. */
  tacosPorHoraTaquero: 220,
  /** Un taquero por cada 60 personas. */
  personasPorTaquero: 60,
  /** Servicio mínimo en sitio. */
  horasMinimas: 2,
  personasPorMesa: 10,
  precios: {
    aguasPorPersona: 30,
    cebollitasPorPersona: 12,
    mesaConSillas: 140,
    /** Taquero + trompo + traslado, por turno de hasta 4 h. */
    taqueroPorTurno: 950,
    horasPorTurno: 4,
  },
  minimoPersonas: 15,
  maximoPersonas: 400,
  anticipo: 0.5,
} as const;

export type ExtrasTaquiza = { aguas: boolean; cebollitas: boolean; mesas: boolean; taquero: boolean };

export type EntradaTaquiza = {
  personas: number;
  apetito: Apetito;
  guisados: GuisadoId[];
  extras: ExtrasTaquiza;
};

export type ResultadoTaquiza = {
  personas: number;
  tacos: number;
  porGuisado: { id: GuisadoId; nombre: string; tacos: number; kg: number; importe: number }[];
  kgCarne: number;
  tortillas: number;
  kgTortilla: number;
  kgCebolla: number;
  manojosCilantro: number;
  limones: number;
  kgLimon: number;
  litrosSalsa: number;
  taqueros: number;
  horasServicio: number;
  mesas: number;
  desglose: { concepto: string; importe: number }[];
  total: number;
  anticipo: number;
  resto: number;
};

/** Redondea hacia arriba al múltiplo de `paso` (0.5 → medio kilo). */
export function redondearArriba(valor: number, paso: number): number {
  return Math.ceil(valor / paso - 1e-9) * paso;
}

export function limitarPersonas(personas: number): number {
  if (!Number.isFinite(personas)) return SUPUESTOS.minimoPersonas;
  return Math.min(SUPUESTOS.maximoPersonas, Math.max(SUPUESTOS.minimoPersonas, Math.round(personas)));
}

export function calcularTaquiza(entrada: EntradaTaquiza): ResultadoTaquiza {
  const S = SUPUESTOS;
  const personas = limitarPersonas(entrada.personas);
  const elegidos = GUISADOS_TAQUIZA.filter((g) => entrada.guisados.includes(g.id));
  const guisados = elegidos.length > 0 ? elegidos : [GUISADOS_TAQUIZA[0]];

  const tacos = personas * APETITOS[entrada.apetito].tacos;

  // Reparto parejo; el sobrante va a los primeros guisados (los más pedidos).
  const base = Math.floor(tacos / guisados.length);
  const sobrante = tacos % guisados.length;
  const porGuisado = guisados.map((g, i) => {
    const t = base + (i < sobrante ? 1 : 0);
    return { id: g.id, nombre: g.nombre, tacos: t, kg: redondearArriba(t / S.tacosPorKgCarne, 0.5), importe: t * g.precio };
  });

  const kgCarne = porGuisado.reduce((s, g) => s + g.kg, 0);
  const tortillas = Math.ceil(tacos * S.tortillasPorTaco * (1 + S.mermaTortilla));
  const kgTortilla = redondearArriba(tortillas / S.tortillasPorKg, 0.5);
  const kgCebolla = redondearArriba((tacos / 100) * S.kgCebollaPor100Tacos, 0.5);
  const manojosCilantro = Math.ceil(tacos / S.tacosPorManojo);
  const limones = Math.ceil(tacos / S.tacosPorLimon);
  const kgLimon = redondearArriba(limones / S.limonesPorKg, 0.5);
  const litrosSalsa = redondearArriba((tacos * S.mlSalsaPorTaco) / 1000, 0.5);

  const taqueros = Math.ceil(personas / S.personasPorTaquero);
  const horasServicio = Math.max(S.horasMinimas, redondearArriba(tacos / (taqueros * S.tacosPorHoraTaquero), 0.5));
  const mesas = Math.ceil(personas / S.personasPorMesa);

  const desglose: { concepto: string; importe: number }[] = [
    { concepto: `${tacos} tacos`, importe: porGuisado.reduce((s, g) => s + g.importe, 0) },
  ];
  if (entrada.extras.aguas) desglose.push({ concepto: `Aguas frescas (${personas} personas)`, importe: personas * S.precios.aguasPorPersona });
  if (entrada.extras.cebollitas) desglose.push({ concepto: "Cebollitas y chiles toreados", importe: personas * S.precios.cebollitasPorPersona });
  if (entrada.extras.mesas) desglose.push({ concepto: `${mesas} mesas con sillas`, importe: mesas * S.precios.mesaConSillas });
  if (entrada.extras.taquero) {
    const turnos = Math.ceil(horasServicio / S.precios.horasPorTurno);
    desglose.push({
      concepto: `${taqueros} ${taqueros === 1 ? "taquero" : "taqueros"} con trompo en sitio`,
      importe: taqueros * turnos * S.precios.taqueroPorTurno,
    });
  }

  // Se cotiza en decenas cerradas.
  const total = Math.ceil(desglose.reduce((s, d) => s + d.importe, 0) / 10) * 10;
  const anticipo = Math.ceil((total * S.anticipo) / 10) * 10;

  return {
    personas,
    tacos,
    porGuisado,
    kgCarne,
    tortillas,
    kgTortilla,
    kgCebolla,
    manojosCilantro,
    limones,
    kgLimon,
    litrosSalsa,
    taqueros,
    horasServicio,
    mesas,
    desglose,
    total,
    anticipo,
    resto: total - anticipo,
  };
}
