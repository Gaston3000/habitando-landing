"use client";

import { useRef, useState } from "react";
import CampoFormulario from "@/componentes/CampoFormulario";
import CampoTextoLargo from "@/componentes/CampoTextoLargo";
import { CLASES_BOTON, CLASES_ENLACE } from "@/lib/clases";

// Escrito como lo mandaría un vecino por WhatsApp: corto, en primera persona y sin vender.
function armarMensaje(unidad) {
  const quienSoy = unidad.trim() ? ` Soy del ${unidad.trim()}.` : "";
  return (
    `Hola, buen día.${quienSoy} Les quería pasar una app que se llama Habitando: ` +
    "ahí los vecinos podemos ver la expensa con las facturas, los avisos y en qué quedó cada arreglo. " +
    "A ustedes les ordena la liquidación y los pagos, y para nosotros es gratis. ¿Le pueden echar un vistazo? ¡Gracias!"
  );
}

// El vecino no contrata Habitando: se lo sugiere a su administración.
// Le dejamos el mensaje escrito y corto, mostrado como le va a llegar (una burbuja de chat), para que lo copie y se lo mande.
// Mientras no lo toque, se completa con su unidad. "Editar el mensaje" lo pasa a un campo de texto.
export default function FormularioMensaje({ className }) {
  const [unidad, setUnidad] = useState("");
  const [mensajeEditado, setMensajeEditado] = useState(null);
  const [editando, setEditando] = useState(false);
  const [aviso, setAviso] = useState(null);

  const refMensaje = useRef(null);
  const refBurbuja = useRef(null);

  const mensaje = mensajeEditado ?? armarMensaje(unidad);

  // Si el navegador no deja copiar, el mensaje queda seleccionado para copiarlo a mano.
  function seleccionarMensaje() {
    if (editando) {
      refMensaje.current.focus();
      refMensaje.current.select();
    } else {
      window.getSelection().selectAllChildren(refBurbuja.current);
    }
    setAviso({ ok: false, texto: "Dejamos el mensaje seleccionado: copialo con Ctrl+C o manteniendo apretado." });
  }

  function copiar(evento) {
    evento.preventDefault();
    if (!navigator.clipboard?.writeText) {
      seleccionarMensaje();
      return;
    }
    navigator.clipboard.writeText(mensaje).then(
      () => setAviso({ ok: true, texto: "Listo, el mensaje está copiado." }),
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
      {editando ? (
        <CampoTextoLargo
          ref={refMensaje}
          id="mensaje"
          etiqueta="Mensaje"
          filas={5}
          autoFocus
          value={mensaje}
          onChange={(evento) => setMensajeEditado(evento.target.value)}
        />
      ) : (
        <div className="flex flex-col gap-1.5">
          <p id="mensaje-etiqueta" className="text-[0.95rem] font-semibold">
            Así le llega a tu administración
          </p>
          <p
            ref={refBurbuja}
            aria-labelledby="mensaje-etiqueta"
            className="rounded-[18px_4px_18px_18px] bg-superficie-hundida px-4 py-3 leading-[1.55]"
          >
            {mensaje}
          </p>
        </div>
      )}
      {/* Copiar es la única acción de envío: sirve para cualquier canal (WhatsApp, mail, el grupo del edificio) */}
      <div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <button type="submit" className={CLASES_BOTON}>
            Copiar mensaje
          </button>
          <button type="button" onClick={() => setEditando(!editando)} className={CLASES_ENLACE}>
            {editando ? "Ver cómo queda" : "Editar el mensaje"}
          </button>
        </div>
        <p className="mt-3 text-[0.92rem] text-texto-secundario">
          Después pegalo en el chat o en el mail de tu administración.
        </p>
      </div>
      <p aria-live="polite" className={`min-h-[1.4em] text-[0.92rem] font-medium ${aviso?.ok ? "text-exito-texto" : "text-texto-secundario"}`}>
        {aviso?.texto}
      </p>
    </form>
  );
}
