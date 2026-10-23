import type { Metadata } from "next";
import Link from "next/link";
import { Pie } from "@/components/secciones/Pie";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description: `Aviso de privacidad genérico de ${site.nombre} (sitio de demostración).`,
};

const APARTADOS = [
  {
    titulo: "Quién es responsable",
    texto: `${site.nombreCompleto}, con domicilio en ${site.direccion.calle}, ${site.direccion.colonia}, ${site.direccion.ciudad}, es responsable del uso de tus datos. Contacto: ${site.correo}. Todos estos datos son ficticios: este es un sitio de demostración.`,
  },
  {
    titulo: "Qué datos usamos",
    texto:
      "Solo los que escribes al armar una comanda o cotizar una taquiza: nombre, hora de recogida, notas, número de personas y fecha del evento. El sitio no tiene base de datos: la comanda se guarda en tu propio navegador (localStorage) y el mensaje lo envías tú por WhatsApp.",
  },
  {
    titulo: "Para qué",
    texto: "Para preparar tu pedido o cotización y avisarte cuando esté listo. No se usan para publicidad ni se venden.",
  },
  {
    titulo: "Con quién se comparten",
    texto:
      "Con nadie más. Si envías tu pedido por WhatsApp, ese servicio trata el mensaje con sus propias políticas. Este sitio no usa cookies de rastreo ni analítica.",
  },
  {
    titulo: "Tus derechos (ARCO)",
    texto: `Puedes pedir acceso, rectificación, cancelación u oposición escribiendo a ${site.correo}. Para borrar la comanda guardada, usa “Vaciar comanda” o limpia los datos del sitio en tu navegador.`,
  },
  {
    titulo: "Cambios",
    texto: "Si este aviso cambia, lo publicamos en esta misma página.",
  },
];

/** K — Documento de una columna con numerales grandes al margen. */
export default function AvisoPrivacidad() {
  return (
    <>
      <main id="contenido" tabIndex={-1} className="grano relative bg-tortilla text-humo outline-none">
        <div className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6">
          <Link href="/" className="inline-flex min-h-11 items-center font-bold underline decoration-roja decoration-[3px] underline-offset-[6px]">
            ← Volver a {site.nombre}
          </Link>
          <h1 className="mt-8 font-cartel text-rotulo uppercase">Aviso de privacidad</h1>
          <p className="mt-3 border-l-[6px] border-roja pl-4 text-sm font-bold">
            Texto genérico de demostración. Una taquería real debe revisarlo con su asesor legal antes de publicarlo.
          </p>
          <ol className="mt-12 space-y-10">
            {APARTADOS.map((a, i) => (
              <li key={a.titulo} className="grid grid-cols-[3.5rem_1fr] gap-4 sm:grid-cols-[5rem_1fr]">
                <span aria-hidden="true" className="font-cartel text-5xl leading-none text-roja sm:text-6xl">
                  {i + 1}
                </span>
                <div>
                  <h2 className="font-cartel text-letrero uppercase">{a.titulo}</h2>
                  <p className="mt-2">{a.texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </main>
      <Pie />
    </>
  );
}
