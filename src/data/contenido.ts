/** Textos FICTICIOS de historia, reseñas y reglas. Ver DATOS-FICTICIOS.md. */

export const marquee = ["Pastor", "Suadero", "Longaniza", "Campechano", "Tripa dorada", "Bistec", "Gringa", "Volcán"];

export const vueltas = [
  {
    anio: "1987",
    titulo: "Primera vuelta",
    texto:
      "Rosa y Beto ponen un trompo en la cochera, con un foco, dos mesas plegables y una lona pintada a mano. El primer sábado se van 40 kilos.",
  },
  {
    anio: "2004",
    titulo: "Segunda vuelta",
    texto:
      "Toño, el hijo, se queda con el turno de noche y agrega el suadero. La fila llega a la esquina y se compra el segundo trompo.",
  },
  {
    anio: "2019",
    titulo: "Tercera vuelta",
    texto:
      "Lupita, la nieta, cambia el foco por tres, apunta la comanda en libreta y se niega a quitar la gringa del menú. Bien hecho.",
  },
];

export const nuncaCambia = [
  { que: "Cómo se marina", como: "24 horas en guajillo, achiote y vinagre de piña. Ni una hora menos." },
  { que: "Cómo se corta", como: "A la orden, de arriba hacia abajo, con cuchillo de 12 pulgadas. Nunca se corta para tener listo." },
  { que: "Cuánto gira", como: "Desde las 4 p. m.: dos horas dando vueltas antes del primer corte." },
  { que: "Cómo se sirve", como: "Doble tortilla, piña que cae del trompo y la salsa la pones tú." },
];

export type Resena = { cita: string; autor: string; contexto: string };

export const resenas: Resena[] = [
  {
    cita: "Pedí uno “para probar”. Me fui con la orden de cinco y una gringa para el camino.",
    autor: "Mariana R.",
    contexto: "viene los jueves",
  },
  {
    cita: "La de habanero no es broma. Me avisaron. No hice caso.",
    autor: "Jorge L.",
    contexto: "ahora pide la verde",
  },
  {
    cita: "Salgo del turno del hospital a la 1. Aquí sigue habiendo suadero. Casi siempre.",
    autor: "Carmen V.",
    contexto: "turno nocturno",
  },
  {
    cita: "El taquero ya sabe que sin cebolla. Nunca se lo he vuelto a decir.",
    autor: "Luis A.",
    contexto: "cliente desde 2011",
  },
];

export const reglasCasa = [
  "Se pide en la barra y se paga al final. Nos acordamos de lo que comiste.",
  "La de habanero se sirve con aviso. No con reclamo.",
  "Si el trompo dice que se acabó el suadero, se acabó el suadero.",
  "Las tortillas de la taquiza no se apartan “para mañana”.",
  "Perros bienvenidos en la banqueta, con correa y sin pedir taco.",
];
