import Link from "next/link";
import { Trompo } from "@/components/ilustraciones/Trompo";
import { BordeTinta } from "@/components/ui/Piezas";
import { site } from "@/config/site";

/** J — Nombre gigante cortado por el borde, trompo asomándose y aviso de demo. */
export function Pie() {
  return (
    <footer className="relative bg-roja text-tortilla">
      <BordeTinta semilla={99} className="text-roja" />
      <div className="grano grano-claro relative overflow-hidden">
        <div className="relative mx-auto grid max-w-[96rem] gap-10 px-4 pt-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-12 lg:pt-20">
          <div className="lg:col-span-4">
            <p className="font-cartel text-letrero uppercase">¿Se te antojó?</p>
            <p className="mt-2">
              Llama al{" "}
              <a href={site.telefono.href} className="font-bold underline decoration-2 underline-offset-4">
                {site.telefono.mostrar}
              </a>{" "}
              o arma tu comanda en el{" "}
              <Link href="/#pizarron" className="font-bold underline decoration-2 underline-offset-4">
                pizarrón
              </Link>
              .
            </p>
          </div>
          <div className="text-sm lg:col-span-3">
            <p className="font-bold uppercase tracking-[0.12em]">Dónde</p>
            <address className="mt-2 not-italic">
              {site.direccion.calle}
              <br />
              {site.direccion.colonia}, {site.direccion.ciudad}
              <br />
              <a href={`mailto:${site.correo}`} className="underline underline-offset-4">
                {site.correo}
              </a>
            </address>
          </div>
          <div className="text-sm lg:col-span-3">
            <p className="font-bold uppercase tracking-[0.12em]">Redes (demo)</p>
            <ul className="mt-2 space-y-1">
              {site.redes.map((r) => (
                <li key={r.etiqueta}>
                  <a href={r.href} className="inline-block min-h-6 underline underline-offset-4">
                    {r.etiqueta}
                  </a>
                </li>
              ))}
              <li>
                <Link href="/aviso-de-privacidad/" className="inline-block min-h-6 underline underline-offset-4">
                  Aviso de privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* El nombre se sale por abajo */}
        <div className="relative mt-16 sm:mt-24">
          <Trompo id="pie" className="pointer-events-none absolute bottom-[38%] right-[7%] w-20 rotate-[8deg] sm:w-28 lg:w-36" />
          <p aria-hidden="true" className="relative -mb-[0.26em] whitespace-nowrap text-center font-cartel text-[clamp(3.4rem,13vw,16rem)] uppercase leading-[0.8] tracking-[-0.03em] text-tortilla">
            {site.nombre}
          </p>
        </div>
      </div>

      <div className="relative z-10 bg-humo px-4 py-5 text-sm text-tortilla sm:px-6">
        <div className="mx-auto flex max-w-[96rem] flex-wrap items-center justify-between gap-x-8 gap-y-3">
          <p className="max-w-2xl font-bold">{site.avisoDemo}</p>
          <p className="etiqueta-muesca bg-limon py-1 font-bold text-humo">
            {site.credito.texto} ·{" "}
            <a href={site.credito.href} className="underline underline-offset-2">
              {site.credito.sitio}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
