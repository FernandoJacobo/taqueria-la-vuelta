import type { Metadata, Viewport } from "next";
import { Bowlby_One, Karla, Rock_Salt } from "next/font/google";
import { SpriteIlustraciones } from "@/components/ilustraciones/Sprite";
import { Comanda } from "@/components/pedido/Comanda";
import { PedidoProvider } from "@/components/pedido/PedidoProvider";
import { site } from "@/config/site";
import "./globals.css";

const bowlby = Bowlby_One({ weight: "400", subsets: ["latin"], display: "swap", variable: "--font-bowlby" });
const karla = Karla({ weight: ["400", "700"], subsets: ["latin"], display: "swap", variable: "--font-karla" });
const rockSalt = Rock_Salt({ weight: "400", subsets: ["latin"], display: "swap", variable: "--font-rocksalt", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.nombreCompleto} · ${site.ciudad}`, template: `%s · ${site.nombre}` },
  description: site.descripcion,
  robots: site.indexable
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  alternates: site.indexable ? { canonical: "/" } : undefined,
  openGraph: {
    type: "website",
    locale: "es_MX",
    title: site.nombreCompleto,
    description: site.descripcion,
    siteName: site.nombre,
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#16110f",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-MX" className={`${bowlby.variable} ${karla.variable} ${rockSalt.variable}`}>
      <body className="pb-[4.5rem] lg:pb-0">
        <a href="#contenido" className="salto-link bg-limon px-4 py-3 font-bold text-humo shadow-tinta">
          Saltar al contenido
        </a>
        <SpriteIlustraciones />
        <PedidoProvider>
          {children}
          <Comanda />
        </PedidoProvider>
      </body>
    </html>
  );
}
