import { BordeTinta } from "@/components/ui/Piezas";
import { resenas } from "@/data/contenido";

/** Banda de color por reseña: fondo, tinta, comillas y alineación cambian en cada una. */
const BANDAS = [
  { fondo: "bg-cebolla", texto: "text-tortilla", comillas: "text-limon", borde: "text-cebolla", caja: "max-w-5xl", tam: "text-cita" },
  { fondo: "bg-limon", texto: "text-humo", comillas: "text-cebolla", borde: "text-limon", caja: "ml-auto max-w-4xl text-right", tam: "text-[clamp(1.6rem,4.2vw,3.25rem)] leading-[1.02]" },
  { fondo: "bg-roja", texto: "text-tortilla", comillas: "text-humo", borde: "text-roja", caja: "max-w-4xl md:ml-[12%]", tam: "text-cita" },
  { fondo: "bg-verde", texto: "text-tortilla", comillas: "text-limon", borde: "text-verde", caja: "ml-auto max-w-3xl md:mr-[8%]", tam: "text-[clamp(1.6rem,4.2vw,3.25rem)] leading-[1.02]" },
];

/** H — Bandas de cita: reseñas ficticias como citas gigantes, sin avatares ni estrellas. */
export function Voces() {
  return (
    <section id="voces" aria-labelledby="titulo-voces">
      {resenas.map((r, i) => {
        const b = BANDAS[i % BANDAS.length];
        return (
          <figure key={r.autor} className={`grano relative ${b.fondo} ${b.texto} ${b.fondo === "bg-limon" ? "" : "grano-claro"}`}>
            <BordeTinta semilla={70 + i} className={b.borde} />
            <div className="relative mx-auto max-w-[96rem] px-4 py-12 sm:px-6 lg:py-16">
              {i === 0 && (
                <h2 id="titulo-voces" className="etiqueta-muesca mb-10 ml-auto w-fit bg-limon py-1 text-sm font-bold uppercase tracking-[0.16em] text-humo">
                  Voces de la fila
                </h2>
              )}
              <div className={`relative ${b.caja}`}>
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute -top-10 font-cartel text-[9rem] leading-none sm:-top-16 sm:text-[13rem] ${b.comillas} ${b.caja.includes("text-right") ? "-right-2" : "-left-2 sm:-left-8"}`}
                >
                  “
                </span>
                <blockquote className={`relative font-cartel uppercase ${b.tam}`}>
                  <p>{r.cita}</p>
                </blockquote>
                <figcaption className="relative mt-5 text-sm">
                  <span className="font-bold">— {r.autor}</span>, {r.contexto} <span className="whitespace-nowrap">(reseña ficticia)</span>
                </figcaption>
              </div>
            </div>
          </figure>
        );
      })}
    </section>
  );
}
