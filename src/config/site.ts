/**
 * Configuración de la taquería. TODO lo que hay aquí es FICTICIO (ver DATOS-FICTICIOS.md).
 * Para adaptar el demo a una taquería real basta con cambiar este archivo y los de `src/data/`.
 */

/** Turno de un día. `null` = ese día no se abre. Horas en formato 24 h ("HH:MM"). */
export type Turno = { abre: string; cierra: string } | null;

export const WHATSAPP_PLACEHOLDER = "520000000000";

export const site = {
  nombre: "La Vuelta",
  giro: "Taquería de trompo",
  nombreCompleto: "La Vuelta — Taquería de trompo",
  lema: "Aquí el trompo no se apaga.",
  descripcion:
    "Tacos de trompo, suadero y longaniza en turno de noche. El trompo gira desde las 4 p. m. y se corta a la orden.",
  /** URL pública del demo (solo se usa para metadatos y JSON-LD). */
  url: "https://la-vuelta-demo.pages.dev",
  /** Mientras sea `false`, el sitio sale en noindex, robots.txt bloquea todo y no hay sitemap. */
  indexable: false,
  /** Año ficticio de apertura. */
  desde: 1987,
  ciudad: "Guadalajara",
  zonaHoraria: "America/Mexico_City",
  telefono: { mostrar: "33 0000 0000", internacional: "+52 33 0000 0000", href: "tel:+523300000000" },
  /** Número de WhatsApp con lada de país, solo dígitos. Con el placeholder, el sitio entra en modo demo. */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP?.trim() || WHATSAPP_PLACEHOLDER,
  correo: "hola@taqueria-demo.example",
  direccion: {
    calle: "Calle Ejemplo 123",
    colonia: "Col. Demo",
    ciudad: "Guadalajara",
    estado: "Jalisco",
    referencia: "Esquina con Calle Muestra, frente al Jardín Demo",
  },
  /** Índice 0 = domingo … 6 = sábado (igual que Date.getDay()). Un cierre menor a la apertura cruza la medianoche. */
  horario: [
    { abre: "17:00", cierra: "02:00" }, // domingo
    { abre: "18:00", cierra: "01:00" }, // lunes
    { abre: "18:00", cierra: "03:00" }, // martes
    { abre: "18:00", cierra: "03:00" }, // miércoles
    { abre: "18:00", cierra: "03:00" }, // jueves
    { abre: "18:00", cierra: "04:00" }, // viernes
    { abre: "18:00", cierra: "04:00" }, // sábado
  ] as Turno[],
  /** El trompo se prende antes de abrir. */
  trompoPrende: "16:00",
  espera: {
    normal: "8 a 12 min",
    pico: "20 min los viernes y sábados después de las 11 p. m.",
  },
  estacionamiento: "En batería sobre Calle Ejemplo (8 lugares) y en la calle. Hay cuidacoches de confianza.",
  pagos: ["Efectivo", "Tarjeta de débito y crédito", "Transferencia"],
  /** Enlaces de redes: siempre a "#" en el demo. */
  redes: [
    { etiqueta: "Fotos del turno", href: "#" },
    { etiqueta: "Videos del trompo", href: "#" },
    { etiqueta: "Avisos (se acabó el suadero)", href: "#" },
  ],
  credito: { texto: "Demo desarrollado por JacoboDev", sitio: "jacobodev.pages.dev", href: "https://jacobodev.pages.dev" },
  avisoDemo:
    "Sitio de demostración. Todos los nombres, teléfonos, direcciones, precios y reseñas son ficticios.",
} as const;

export type Site = typeof site;
