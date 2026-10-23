import { site } from "@/config/site";
import { menu } from "@/data/menu";

const DIAS_SCHEMA = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** JSON-LD `Restaurant` con horarios y menú. Solo se publica cuando `site.indexable` es true. */
export function jsonLdRestaurante() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: site.nombreCompleto,
    description: site.descripcion,
    url: site.url,
    telephone: site.telefono.internacional,
    email: site.correo,
    servesCuisine: ["Mexicana", "Tacos"],
    priceRange: "$",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.direccion.calle,
      addressLocality: site.direccion.ciudad,
      addressRegion: site.direccion.estado,
      addressCountry: "MX",
    },
    openingHoursSpecification: site.horario.flatMap((t, d) =>
      t ? [{ "@type": "OpeningHoursSpecification", dayOfWeek: DIAS_SCHEMA[d], opens: t.abre, closes: t.cierra }] : [],
    ),
    hasMenu: {
      "@type": "Menu",
      hasMenuSection: menu.map((cat) => ({
        "@type": "MenuSection",
        name: cat.titulo,
        hasMenuItem: cat.platillos.map((p) => ({
          "@type": "MenuItem",
          name: p.enComanda ?? p.nombre,
          offers: { "@type": "Offer", price: p.precio, priceCurrency: "MXN" },
        })),
      })),
    },
  };
}
