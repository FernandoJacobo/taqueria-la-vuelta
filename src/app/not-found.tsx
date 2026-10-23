import type { Metadata } from "next";
import Link from "next/link";
import { Trompo } from "@/components/ilustraciones/Trompo";
import { NotaMarcador } from "@/components/ui/Piezas";
import { Sobreimpreso } from "@/components/ui/Sobreimpreso";

export const metadata: Metadata = { title: "Se acabó" };

/** L — 404: el trompo vacío. */
export default function NoEncontrada() {
  return (
    <main id="contenido" tabIndex={-1} className="grano grano-claro relative min-h-dvh overflow-hidden bg-cebolla text-tortilla outline-none">
      <div className="relative mx-auto grid max-w-[96rem] items-center gap-8 px-4 py-16 sm:px-6 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="font-cartel text-[clamp(5rem,22vw,16rem)] leading-[0.8] text-limon">404</p>
          <h1 className="mt-6 font-cartel text-rotulo uppercase">
            <Sobreimpreso capa="text-humo" modo="debajo" x={4} y={4}>
              Esta página se acabó, como el suadero a las 2 a. m.
            </Sobreimpreso>
          </h1>
          <p className="mt-6 max-w-md text-lg">Lo que buscabas ya no está en el trompo. Lo demás sigue girando.</p>
          <Link
            href="/"
            className="mt-8 inline-flex min-h-12 items-center border-[3px] border-humo bg-limon px-5 font-cartel uppercase text-humo shadow-tinta"
          >
            Volver al pizarrón
          </Link>
        </div>
        <div className="relative md:col-span-5">
          <NotaMarcador className="absolute left-0 top-[30%] z-10 -rotate-6 text-lg text-limon">se acabó</NotaMarcador>
          <Trompo id="vacio" vacio className="mx-auto w-[min(100%,18rem)]" titulo="Trompo vacío: solo la varilla y la piña" />
        </div>
      </div>
    </main>
  );
}
