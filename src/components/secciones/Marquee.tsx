import { Icono } from "@/components/ilustraciones/Sprite";
import { BordeTinta } from "@/components/ui/Piezas";
import { Sobreimpreso } from "@/components/ui/Sobreimpreso";
import { marquee } from "@/data/contenido";

function Tira({ oculta = false }: { oculta?: boolean }) {
  return (
    <ul aria-hidden={oculta || undefined} className={`flex shrink-0 items-center motion-reduce:shrink motion-reduce:flex-wrap motion-reduce:justify-center ${oculta ? "motion-reduce:hidden" : ""}`}>
      {marquee.map((corte) => (
        <li key={corte} className="flex items-center">
          <Sobreimpreso capa="text-habanero" modo="debajo" x={6} y={5} className="whitespace-nowrap px-5 font-cartel text-lona uppercase text-tortilla sm:px-8">
            {corte}
          </Sobreimpreso>
          <Icono id="i-estrella" className="h-10 w-10 shrink-0 rotate-12 text-limon sm:h-14 sm:w-14" />
        </li>
      ))}
    </ul>
  );
}

/** C — Banda de lona inclinada, más ancha que la pantalla. Único marquee del sitio. */
export function Marquee() {
  return (
    <section aria-label="Cortes y guisados del trompo" className="grano grano-claro relative overflow-x-clip bg-verde py-12 sm:py-16">
      <BordeTinta semilla={7} className="text-verde" />
      <div className="relative -mx-[6vw] -rotate-[2.5deg] overflow-hidden border-y-[5px] border-tortilla bg-verde py-4 sm:py-6">
        <div className="flex w-max animate-marquee motion-reduce:w-auto">
          <Tira />
          <Tira oculta />
        </div>
      </div>
      <p className="relative mx-auto mt-8 max-w-[96rem] px-4 text-right text-sm font-bold text-tortilla sm:px-6">
        Se corta a la orden. Cuando se acaba, se acaba.
      </p>
    </section>
  );
}
