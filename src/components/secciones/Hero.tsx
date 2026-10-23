import { Trompo } from "@/components/ilustraciones/Trompo";
import { StickerPedir } from "@/components/pedido/StickerPedir";
import { NotaMarcador } from "@/components/ui/Piezas";
import { Sobreimpreso } from "@/components/ui/Sobreimpreso";
import { site } from "@/config/site";

/** Marca de registro de imprenta (la cruz con círculo de las esquinas de una lona). */
function MarcaRegistro({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`absolute h-6 w-6 text-roja ${className}`} aria-hidden="true">
      <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 0v24M0 12h24" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/** B — Cartel de lona descuadrado. */
export function Hero() {
  return (
    <section aria-labelledby="titulo-hero" className="grano relative overflow-hidden bg-tortilla text-humo">
      <MarcaRegistro className="left-1.5 top-2" />
      <MarcaRegistro className="right-1.5 top-2 hidden sm:block" />
      {/* Trama roja en la esquina, como sobrante de tinta */}
      <div
        aria-hidden="true"
        className="trama absolute -right-10 top-0 h-[70%] w-[60%] text-roja opacity-30 [mask-image:linear-gradient(215deg,#000_5%,transparent_60%)]"
      />

      <div className="relative mx-auto grid max-w-[96rem] grid-cols-12 px-4 pb-14 pt-7 sm:px-6 md:pb-20 lg:pt-10">
        {/* Rótulo del local */}
        <p className="col-span-12 flex flex-wrap items-baseline gap-x-3 border-b-[3px] border-humo pb-2 lg:col-span-7 lg:col-start-1 lg:row-start-1">
          <span className="font-cartel text-letrero uppercase">{site.nombre}</span>
          <span className="text-sm font-bold uppercase tracking-[0.12em] text-roja">
            {site.giro} · {site.ciudad}
          </span>
          <span className="ml-auto hidden text-sm sm:inline">desde {site.desde} (ficticio)</span>
        </p>

        {/* Titular: se sale de su caja y pasa por encima del trompo */}
        <h1
          id="titulo-hero"
          className="relative z-10 col-span-12 mt-5 font-cartel uppercase lg:col-span-9 lg:col-start-1 lg:row-start-2 lg:mt-12"
        >
          <span className="block text-rotulo">Aquí el </span>
          <Sobreimpreso capa="text-habanero" x={5} y={4} className="-ml-1 text-cartel text-roja">
            Trompo
          </Sobreimpreso>{" "}
          <span className="block text-lona">no se </span>
          <span className="relative -mr-24 mt-1 inline-block -rotate-2 bg-roja px-3 pb-1 pt-3 text-cartel text-tortilla shadow-tinta-lg sm:-mr-40 lg:-mr-96 lg:ml-[14%]">
            apaga.
          </span>
        </h1>

        {/* Trompo + sticker + nota */}
        <div className="relative col-span-9 col-start-4 -mt-4 sm:col-span-6 sm:col-start-7 sm:-mt-40 md:-mt-52 lg:col-span-5 lg:col-start-8 lg:row-span-3 lg:row-start-1 lg:mt-0">
          <NotaMarcador
            flecha="abajo"
            className="absolute -left-[38%] top-[26%] z-20 w-24 -rotate-6 text-roja sm:-left-[45%] sm:top-[20%] sm:w-32 lg:left-[4%] lg:top-[3%] lg:w-40"
          >
            sí hay de suadero
          </NotaMarcador>
          <Trompo
            id="hero"
            titulo="Ilustración de un trompo de pastor con piña, girando junto al quemador"
            className="relative ml-auto w-full max-w-[25rem] lg:max-w-[28rem]"
          />
          <StickerPedir className="absolute -bottom-4 -left-[38%] z-20 w-36 sm:-left-[30%] sm:w-44 lg:left-auto lg:-right-2 lg:bottom-[2%] lg:w-48" />
        </div>

        <div className="relative col-span-12 mt-12 max-w-md sm:mt-6 lg:col-span-5 lg:col-start-1 lg:row-start-3 lg:mt-14">
          <p className="text-lg">
            El trompo gira desde las 4 p. m. y se corta a la orden. Pastor, suadero y longaniza hasta que se apague la plancha.
          </p>
          <a
            href="#pizarron"
            className="mt-4 inline-flex min-h-11 items-center gap-2 font-bold underline decoration-roja decoration-[3px] underline-offset-[6px]"
          >
            Ver menú <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
