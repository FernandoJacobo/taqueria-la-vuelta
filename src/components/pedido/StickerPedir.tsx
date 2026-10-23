"use client";

import { usePedido } from "./PedidoProvider";

function festones(puntas: number, rExt: number, rInt: number): string {
  const pts: string[] = [];
  for (let i = 0; i < puntas * 2; i++) {
    const r = i % 2 === 0 ? rExt : rInt;
    const a = (Math.PI * i) / puntas;
    pts.push(`${(100 + r * Math.cos(a)).toFixed(1)},${(100 + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(" ");
}

/** Sticker circular de "Pedir para llevar": abre la comanda con "para llevar" ya elegido. */
export function StickerPedir({ className = "" }: { className?: string }) {
  const { despachar, abrirComanda } = usePedido();
  return (
    <button
      type="button"
      onClick={() => {
        despachar({ tipo: "tipo", valor: "llevar" });
        abrirComanda();
      }}
      className={`sticker-hover group ${className.includes("absolute") ? "" : "relative"} grid aspect-square place-items-center rounded-full ${className}`}
    >
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden="true" style={{ filter: "url(#tinta)" }}>
        <defs>
          <path id="sticker-circulo" d="M100 100m-74 0a74 74 0 1 1 148 0a74 74 0 1 1-148 0" />
        </defs>
        <polygon points={festones(30, 98, 90)} transform="translate(6 6)" fill="#16110f" />
        <polygon points={festones(30, 98, 90)} fill="#d8e24a" stroke="#16110f" strokeWidth="3" />
        <circle cx="100" cy="100" r="62" fill="none" stroke="#16110f" strokeWidth="2.5" strokeDasharray="4 5" />
        <text className="font-cuerpo" fontSize="13.5" fontWeight="700" letterSpacing="2.6" fill="#16110f">
          <textPath href="#sticker-circulo">SIN FILA · SE CORTA A LA ORDEN · SIN FILA · SE CORTA A LA ORDEN ·</textPath>
        </text>
      </svg>
      <span className="relative text-center font-cartel uppercase leading-[0.86] text-humo">
        <span className="block text-[clamp(1.35rem,3.6vw,2.1rem)]">Pedir</span>
        <span className="block text-[clamp(0.85rem,1.9vw,1.1rem)]">para</span>
        <span className="block text-[clamp(1.35rem,3.6vw,2.1rem)]">llevar</span>
      </span>
    </button>
  );
}
