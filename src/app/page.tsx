import { BarraTurno } from "@/components/secciones/BarraTurno";
import { Hero } from "@/components/secciones/Hero";
import { Historia } from "@/components/secciones/Historia";
import { Horarios } from "@/components/secciones/Horarios";
import { Marquee } from "@/components/secciones/Marquee";
import { Pie } from "@/components/secciones/Pie";
import { Pizarron } from "@/components/secciones/Pizarron";
import { Salsero } from "@/components/secciones/Salsero";
import { Taquiza } from "@/components/secciones/Taquiza";
import { Voces } from "@/components/secciones/Voces";
import { site } from "@/config/site";
import { jsonLdRestaurante } from "@/lib/seo";

export default function Inicio() {
  return (
    <>
      {site.indexable && (
        <script
          type="application/ld+json"
          // JSON-LD generado en el build a partir de site.ts y el menú.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdRestaurante()).replace(/</g, "\\u003c") }}
        />
      )}
      <header>
        <BarraTurno />
      </header>
      <main id="contenido" tabIndex={-1} className="outline-none">
        <Hero />
        <Marquee />
        <Pizarron />
        <Salsero />
        <Taquiza />
        <Historia />
        <Voces />
        <Horarios />
      </main>
      <Pie />
    </>
  );
}
