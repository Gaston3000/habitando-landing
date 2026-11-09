"use client";

import { useRef, useState } from "react";
import CampoFormulario from "@/componentes/CampoFormulario";
import CampoTextoLargo from "@/componentes/CampoTextoLargo";
import { CLASES_BOTON, CLASES_ENLACE } from "@/lib/clases";

function armarMensaje(unidad) {
  const deDonde = unidad.trim() ? `de la unidad ${unidad.trim()}` : "de mi unidad";
  return (
    `Hola, ¿cómo están? Les escribo ${deDonde}. ` +
    "Quería sugerirles Habitando, una plataforma donde los vecinos podemos ver la expensa con el detalle de cada gasto y su factura, " +
    "los avisos del edificio y el estado de los reclamos. A ustedes les ordena las liquidaciones y los pagos, " +
    "y nos ahorraría muchas preguntas a todos. Para los vecinos es gratis. ¿Lo podrían ver?"
  );
}

// El vecino no contrata Habitando: se lo sugiere a su administración.
// Le dejamos el mensaje escrito para copiar o mandar por WhatsApp. Mientras no lo toque, se completa con su unidad.
export default function FormularioMensaje({ className }) {
  const [unidad, setUnidad] = useState("");
  const [mensajeEditado, setMensajeEditado] = useState(null);
  const [aviso, setAviso] = useState(null);

  const refMensaje = useRef(null);

  const mensaje = mensajeEditado ?? armarMensaje(unidad);

  // Si el navegador no deja copiar, el mensaje queda seleccionado para copiarlo a mano.
  function seleccionarMensaje() {
    refMensaje.current.focus();
    refMensaje.current.select();
    setAviso({ ok: false, texto: "Dejamos el mensaje seleccionado: copialo con Ctrl+C o manteniendo apretado." });
  }

  function copiar(evento) {
    evento.preventDefault();
    if (!navigator.clipboard?.writeText) {
      seleccionarMensaje();
      return;
    }
    navigator.clipboard.writeText(mensaje).then(
      () => setAviso({ ok: true, texto: "Mensaje copiado. Pegalo en el chat o el mail de tu administración." }),
      seleccionarMensaje
    );
  }

  return (
    <form onSubmit={copiar} noValidate className={className}>
      <CampoFormulario
        id="unidad"
        etiqueta="Tu unidad"
        placeholder="Ej.: 3º B"
        autoComplete="off"
        value={unidad}
        onChange={(evento) => setUnidad(evento.target.value)}
      />
      <CampoTextoLargo
        ref={refMensaje}
        id="mensaje"
        etiqueta="Mensaje"
        ayuda="Podés cambiarlo como quieras antes de mandarlo."
        filas={7}
        value={mensaje}
        onChange={(evento) => setMensajeEditado(evento.target.value)}
      />
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <button type="submit" className={CLASES_BOTON}>
          Copiar mensaje
        </button>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(mensaje)}`}
          target="_blank"
          rel="noopener"
          className={CLASES_ENLACE}
        >
          Abrir en WhatsApp
        </a>
      </div>
      <p aria-live="polite" className={`min-h-[1.4em] text-[0.92rem] font-medium ${aviso?.ok ? "text-exito-texto" : "text-texto-secundario"}`}>
        {aviso?.texto}
      </p>
    </form>
  );
}
