/** Salsero FICTICIO. Cada salsa define el color con el que se repinta su sección. */

export type ColorSalsa = "verde" | "roja" | "habanero" | "morita" | "cebolla";

export type Salsa = {
  id: string;
  nombre: string;
  /** Palabra corta para el tazón. */
  corto: string;
  color: ColorSalsa;
  ingredientes: string[];
  /** Picómetro 1–5. */
  picor: 1 | 2 | 3 | 4 | 5;
  vaCon: string[];
  chiste: string;
  /** Precio del extra de 120 ml. */
  precioExtra: number;
};

export const salsas: Salsa[] = [
  {
    id: "salsa-verde",
    nombre: "Verde de tomatillo",
    corto: "Verde",
    color: "verde",
    ingredientes: ["tomatillo asado", "chile serrano", "ajo", "cilantro", "sal de grano"],
    picor: 2,
    vaCon: ["Suadero", "Tripa dorada", "Quesadilla de flor"],
    chiste: "La que le pones a todo cuando no quieres pensar.",
    precioExtra: 12,
  },
  {
    id: "salsa-roja",
    nombre: "Roja de guajillo",
    corto: "Roja",
    color: "roja",
    ingredientes: ["chile guajillo", "chile de árbol", "jitomate asado", "comino", "vinagre de piña"],
    picor: 3,
    vaCon: ["Pastor", "Gringa de pastor", "Campechano"],
    chiste: "Pica, pero con respeto.",
    precioExtra: 12,
  },
  {
    id: "salsa-habanero",
    nombre: "Habanero tatemado",
    corto: "Habanero",
    color: "habanero",
    ingredientes: ["habanero tatemado", "zanahoria", "naranja agria", "cebolla blanca", "sal"],
    picor: 5,
    vaCon: ["Longaniza", "Volcán de longaniza", "Cebollitas"],
    chiste: "No la pruebes antes de la cita.",
    precioExtra: 12,
  },
  {
    id: "salsa-morita",
    nombre: "Morita con cacahuate",
    corto: "Morita",
    color: "morita",
    ingredientes: ["chile morita", "cacahuate tostado", "ajonjolí", "ajo frito", "aceite"],
    picor: 4,
    vaCon: ["Bistec", "Torta de pierna", "Frijoles charros"],
    chiste: "Ahumada como la plancha a las 3 a. m.",
    precioExtra: 12,
  },
  {
    id: "salsa-cebolla",
    nombre: "Cebolla morada curtida",
    corto: "Cebolla",
    color: "cebolla",
    ingredientes: ["cebolla morada", "limón", "orégano", "un poco de habanero", "sal"],
    picor: 1,
    vaCon: ["Pastor", "Suadero", "Torta ahogada"],
    chiste: "Para los que dicen que no les gusta el picante (pica tantito).",
    precioExtra: 12,
  },
];

export const SALSA_INICIAL = "salsa-roja";
