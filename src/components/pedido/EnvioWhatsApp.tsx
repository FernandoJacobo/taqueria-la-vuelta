"use client";

import { useCallback, useId, useState } from "react";
import { Dialogo } from "@/components/ui/Dialogo";
import { site } from "@/config/site";
import { esModoDemo, urlWhatsApp } from "@/lib/whatsapp";

/**
 * Envía un mensaje por WhatsApp. En modo demo (número placeholder) NO abre wa.me:
 * muestra una vista previa del mensaje formateado.
 */
export function useEnvioWhatsApp(titulo = "Vista previa del pedido") {
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);
  const tituloId = useId();

  const enviar = useCallback((texto: string) => {
    if (esModoDemo(site.whatsapp)) {
      setCopiado(false);
      setMensaje(texto);
      return;
    }
    window.open(urlWhatsApp(site.whatsapp, texto), "_blank", "noopener,noreferrer");
  }, []);

  const cerrar = () => setMensaje(null);

  const copiar = async () => {
    if (!mensaje) return;
    try {
      await navigator.clipboard.writeText(mensaje);
      setCopiado(true);
    } catch {
      setCopiado(false);
    }
  };

  const vistaPrevia = (
    <Dialogo
      abierto={mensaje !== null}
      alCerrar={cerrar}
      tituloId={tituloId}
      className="inset-0 m-auto w-[min(30rem,calc(100vw-2rem))]"
    >
      <div className="border-[3px] border-humo bg-tortilla text-humo shadow-tinta-lg">
        <div className="flex items-start justify-between gap-4 bg-humo px-5 py-4 text-tortilla">
          <h2 id={tituloId} className="font-cartel text-letrero uppercase">
            {titulo}
          </h2>
          <span className="etiqueta-muesca bg-limon py-1 text-xs font-bold uppercase text-humo [--ojal:var(--color-humo)]">
            modo demo
          </span>
        </div>
        <div className="px-5 py-5">
          <p className="text-sm">
            En un sitio real, esto se envía por WhatsApp al número de la taquería. Aquí solo te enseñamos cómo llegaría:
          </p>
          <pre className="renglones mt-4 max-h-[45dvh] overflow-auto whitespace-pre-wrap border-2 border-dashed border-humo bg-papel p-4 font-cuerpo text-sm leading-8">
            {mensaje}
          </pre>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={copiar}
              className="min-h-11 border-[3px] border-humo bg-limon px-4 font-bold shadow-tinta-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              {copiado ? "Copiado" : "Copiar mensaje"}
            </button>
            <button type="button" onClick={cerrar} className="min-h-11 border-[3px] border-humo px-4 font-bold">
              Cerrar
            </button>
          </div>
          <p className="mt-4 text-xs">
            Para probar con un WhatsApp de verdad, pon tu número en <code className="font-bold">NEXT_PUBLIC_WHATSAPP</code> dentro de{" "}
            <code className="font-bold">.env.local</code>.
          </p>
        </div>
      </div>
    </Dialogo>
  );

  return { enviar, vistaPrevia };
}
