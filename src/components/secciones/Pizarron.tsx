import { BotonAgregar } from "@/components/pedido/BotonAgregar";
import { BordeTinta, Chiles, Etiqueta, NotaMarcador } from "@/components/ui/Piezas";
import { Sobreimpreso } from "@/components/ui/Sobreimpreso";
import { ETIQUETAS, menu, PRECIO_QUESO, type Platillo } from "@/data/menu";
import { pesos } from "@/lib/dinero";

/** Subrayado de gis: una línea temblorosa. */
function SubrayadoGis({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 10" preserveAspectRatio="none" className={`block h-2.5 w-full ${className}`} aria-hidden="true">
      <path d="M2 6c30-3 52 2 80-1s60-4 88 0 34 1 48-2" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity=".7" />
    </svg>
  );
}

function Fila({ p }: { p: Platillo }) {
  return (
    <li className="flex items-start gap-3 py-2.5">
      <div className="min-w-0 flex-1">
        <p className="flex items-baseline">
          <span className="text-lg font-bold leading-tight">{p.nombre}</span>
          <span aria-hidden="true" className="puntos-guia" />
          <span className="font-cartel text-lg leading-none text-habanero">
            <span className="texto-pantalla">: </span>
            {pesos(p.precio)}
          </span>
        </p>
        {(p.detalle || p.picor > 0 || p.etiqueta || p.admiteQueso) && (
          <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-sm text-tortilla/80">
            {p.detalle && <span>{p.detalle}</span>}
            <Chiles nivel={p.picor} vacios={false} tamano="h-6 w-6 [--trazo:var(--color-tortilla)] text-roja" />
            {p.etiqueta && (
              <Etiqueta className={p.etiqueta === "mas-pedido" ? "bg-limon text-humo" : "bg-habanero text-humo"}>{ETIQUETAS[p.etiqueta]}</Etiqueta>
            )}
            {p.admiteQueso && (
              <BotonAgregar id={p.id} conQueso variante="texto" className="text-tortilla">
                con queso +{pesos(PRECIO_QUESO)}
              </BotonAgregar>
            )}
          </div>
        )}
      </div>
      <BotonAgregar id={p.id} />
    </li>
  );
}

/** D — El pizarrón: menú a columnas desiguales, con puntos guía y botón "+" en cada platillo. */
export function Pizarron() {
  return (
    <section id="pizarron" aria-labelledby="titulo-pizarron" className="relative scroll-mt-4 bg-morita px-2 py-10 sm:px-5 sm:py-14 lg:px-8">
      <BordeTinta semilla={21} className="text-morita" />
      <div className="grano grano-claro relative mx-auto max-w-[96rem] border-[6px] border-humo bg-humo px-4 pb-10 pt-8 text-tortilla shadow-[10px_10px_0_rgb(22_17_15/0.55)] sm:px-8 lg:px-12 lg:pt-12">
        {/* Borrones de gis */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <svg viewBox="0 0 400 120" className="absolute left-[6%] top-[16%] w-[28rem] text-tortilla opacity-[0.06]">
            <path d="M10 70 60 30l30 50 40-56 34 62 44-60 30 58 46-54 32 50 50-44" fill="none" stroke="currentColor" strokeWidth="26" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
          <svg viewBox="0 0 400 120" className="absolute bottom-[8%] right-[6%] w-[34rem] rotate-[-4deg] text-tortilla opacity-[0.05]">
            <path d="M10 60 50 24l28 64 42-60 30 58 46-54 30 56 44-58 36 52 70-40" fill="none" stroke="currentColor" strokeWidth="22" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
        </div>

        <header className="relative flex flex-wrap items-end justify-between gap-x-10 gap-y-4 border-b-[3px] border-dashed border-tortilla/50 pb-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-limon">Menú · precios ilustrativos</p>
            <h2 id="titulo-pizarron" className="mt-2 font-cartel text-rotulo uppercase">
              <Sobreimpreso capa="text-roja" modo="debajo" x={4} y={4}>
                El pizarrón
              </Sobreimpreso>
            </h2>
            <p className="mt-3 max-w-xl">
              Toca <span className="inline-grid size-6 place-items-center border-2 border-humo bg-limon align-middle font-cartel text-humo">+</span> para
              apuntarlo en tu comanda. La armas aquí y la mandas por WhatsApp; pagas al recoger.
            </p>
          </div>
          <NotaMarcador className="rotate-[-4deg] text-limon sm:mr-6">pregunta por el del turno</NotaMarcador>
        </header>

        <div className="relative mt-8 gap-x-12 sm:columns-2 xl:columns-3">
          {menu.map((cat) => (
            <section key={cat.id} aria-labelledby={`cat-${cat.id}`} className="mb-9 break-inside-avoid">
              <h3 id={`cat-${cat.id}`} className="font-cartel text-letrero uppercase">
                {cat.titulo}
              </h3>
              <SubrayadoGis className="mt-1 text-habanero" />
              {cat.bajada && <p className="mt-2 text-sm text-tortilla/75">{cat.bajada}</p>}
              <ul className="mt-2 divide-y divide-dashed divide-tortilla/20">
                {cat.platillos.map((p) => (
                  <Fila key={p.id} p={p} />
                ))}
              </ul>
              {cat.id === "tortas" && (
                <NotaMarcador flecha="izquierda" className="ml-2 mt-1 -rotate-3 text-habanero">
                  ojo: la ahogada pica
                </NotaMarcador>
              )}
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
