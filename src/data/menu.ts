/** Menú FICTICIO con precios ilustrativos (MXN). Se reemplaza aquí sin tocar componentes. */

export type Picor = 0 | 1 | 2 | 3;
export type EtiquetaPlatillo = "del-turno" | "mas-pedido";

export type Platillo = {
  id: string;
  nombre: string;
  detalle?: string;
  precio: number;
  picor: Picor;
  etiqueta?: EtiquetaPlatillo;
  /** Nombre en la comanda y en el mensaje, si difiere del que se ve en el pizarrón. */
  enComanda?: string;
  /** Permite la variante "con queso" (+ PRECIO_QUESO). */
  admiteQueso?: boolean;
};

export type Categoria = {
  id: string;
  titulo: string;
  /** Línea práctica debajo del título. */
  bajada?: string;
  platillos: Platillo[];
};

export const PRECIO_QUESO = 8;

export const ETIQUETAS: Record<EtiquetaPlatillo, string> = {
  "del-turno": "del turno",
  "mas-pedido": "el más pedido",
};

export const menu: Categoria[] = [
  {
    id: "tacos",
    titulo: "Tacos",
    bajada: "Doble tortilla, cebolla y cilantro. Piña del trompo, no de lata.",
    platillos: [
      { id: "taco-pastor", nombre: "Pastor", enComanda: "Taco de pastor", precio: 24, picor: 1, etiqueta: "mas-pedido", admiteQueso: true },
      { id: "taco-suadero", nombre: "Suadero", enComanda: "Taco de suadero", precio: 26, picor: 0, admiteQueso: true },
      { id: "taco-longaniza", nombre: "Longaniza", enComanda: "Taco de longaniza", precio: 24, picor: 2, admiteQueso: true },
      { id: "taco-bistec", nombre: "Bistec", enComanda: "Taco de bistec", precio: 28, picor: 0, admiteQueso: true },
      { id: "taco-campechano", nombre: "Campechano", enComanda: "Taco campechano", detalle: "suadero + longaniza", precio: 30, picor: 1, etiqueta: "del-turno", admiteQueso: true },
      { id: "taco-tripa", nombre: "Tripa dorada", enComanda: "Taco de tripa dorada", detalle: "bien dorada o no se sirve", precio: 32, picor: 0 },
      { id: "orden-pastor", nombre: "Orden de 5 de pastor", precio: 115, picor: 1, etiqueta: "mas-pedido" },
      { id: "orden-suadero", nombre: "Orden de 5 de suadero", precio: 125, picor: 0 },
      { id: "orden-campechana", nombre: "Orden de 5 campechana", precio: 140, picor: 1 },
    ],
  },
  {
    id: "gringas",
    titulo: "Gringas y volcanes",
    bajada: "Tortilla de harina o tostada, queso fundido en la plancha.",
    platillos: [
      { id: "gringa-pastor", nombre: "Gringa de pastor", precio: 62, picor: 1, etiqueta: "mas-pedido" },
      { id: "gringa-campechana", nombre: "Gringa campechana", precio: 68, picor: 1 },
      { id: "volcan-pastor", nombre: "Volcán de pastor", detalle: "tostada, queso y trompo", precio: 38, picor: 1 },
      { id: "volcan-longaniza", nombre: "Volcán de longaniza", precio: 38, picor: 2, etiqueta: "del-turno" },
    ],
  },
  {
    id: "quesadillas",
    titulo: "Quesadillas",
    bajada: "De maíz, en comal, con queso que se estira.",
    platillos: [
      { id: "quesadilla-flor", nombre: "Flor de calabaza", enComanda: "Quesadilla de flor de calabaza", precio: 45, picor: 0 },
      { id: "quesadilla-pastor", nombre: "De pastor", enComanda: "Quesadilla de pastor", precio: 52, picor: 1 },
      { id: "quesadilla-sola", nombre: "Sencilla", enComanda: "Quesadilla sencilla", detalle: "solo queso, para el que no se arriesga", precio: 40, picor: 0 },
    ],
  },
  {
    id: "tortas",
    titulo: "Tortas",
    bajada: "Bolillo dorado en la plancha, frijol, aguacate y jalapeño.",
    platillos: [
      { id: "torta-pierna", nombre: "De pierna", enComanda: "Torta de pierna", precio: 75, picor: 1 },
      { id: "torta-pastor", nombre: "De pastor", enComanda: "Torta de pastor", precio: 78, picor: 1, etiqueta: "del-turno" },
      { id: "torta-ahogada", nombre: "Ahogada", enComanda: "Torta ahogada", detalle: "en salsa de jitomate, chile de árbol aparte", precio: 85, picor: 3 },
    ],
  },
  {
    id: "acompanar",
    titulo: "Para acompañar",
    platillos: [
      { id: "cebollitas", nombre: "Cebollitas asadas", detalle: "con limón y sal", precio: 25, picor: 0 },
      { id: "nopales", nombre: "Nopal asado", precio: 28, picor: 0 },
      { id: "frijoles-charros", nombre: "Frijoles charros", detalle: "con chicharrón y longaniza", precio: 45, picor: 1 },
      { id: "chiles-toreados", nombre: "Chiles toreados", detalle: "tres por orden", precio: 20, picor: 3 },
    ],
  },
  {
    id: "bebidas",
    titulo: "Aguas frescas y bebidas",
    bajada: "Aguas de medio litro, hechas en la tarde.",
    platillos: [
      { id: "agua-horchata", nombre: "Agua de horchata", precio: 35, picor: 0 },
      { id: "agua-jamaica", nombre: "Agua de jamaica", precio: 35, picor: 0 },
      { id: "agua-dia", nombre: "Agua del día", detalle: "pregunta en la barra", precio: 35, picor: 0, etiqueta: "del-turno" },
      { id: "refresco-vidrio", nombre: "Refresco de vidrio", precio: 30, picor: 0 },
      { id: "cerveza-barril", nombre: "Cerveza de barril", detalle: "solo para comer aquí", precio: 55, picor: 0 },
      { id: "cafe-olla", nombre: "Café de olla", detalle: "después de la 1 a. m.", precio: 25, picor: 0 },
    ],
  },
];
