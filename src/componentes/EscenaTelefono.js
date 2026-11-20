"use client";

import { useEffect, useRef, useState } from "react";
import Compu from "@/componentes/Compu";
import PantallaAdministracion from "@/componentes/PantallaAdministracion";
import PantallaVecino from "@/componentes/PantallaVecino";
import { useAparecerEnPantalla } from "@/lib/aparecer";

const OPCIONES = [
  { estado: "hoy", texto: "Hoy" },
  { estado: "con", texto: "Con habitando" },
];

// Tiempos del cambio automático, en milisegundos
const LLEGA_EL_MENSAJE = 750;
const ENTRA_HABITANDO = 2900;

// El teléfono con "Hoy" y "Con habitando" (para la administración, "Con habitando" es la compu).
// Con "automatica", la escena arranca en "Hoy", llega un mensaje más y a los 3 segundos pasa sola a
// "Con habitando"; mientras tanto, una barrita avanza en el botón. Todo eso empieza recién cuando el teléfono
// se ve (en el celular está más abajo), así nadie se pierde el "Hoy". Para que vuelva a empezar
// (por ejemplo, al cambiar de perfil), el héroe la vuelve a montar con otra "key".
export default function EscenaTelefono({ automatica, movimientoReducido }) {
  const [estado, setEstado] = useState("hoy");
  const [llegando, setLlegando] = useState(automatica);
  const [avanzando, setAvanzando] = useState(automatica);

  const [refEscena, vista] = useAparecerEnPantalla(0.6);
  const refEsperas = useRef([]);
  const corriendo = automatica && vista === "activa";

  function cancelarEsperas() {
    refEsperas.current.forEach(clearTimeout);
    refEsperas.current = [];
  }

  useEffect(() => {
    if (!corriendo) return;
    refEsperas.current = [
      setTimeout(() => setLlegando(false), LLEGA_EL_MENSAJE),
      setTimeout(() => {
        setAvanzando(false);
        setEstado("con");
      }, ENTRA_HABITANDO),
    ];
    return cancelarEsperas;
  }, [corriendo]);

  // La pantalla de habitando entra barriendo en diagonal, con el mismo corte de 30° del logo.
  useEffect(() => {
    const capas = refEscena.current.querySelectorAll(".capa-con");
    capas.forEach((capa) => capa.getAnimations().forEach((animacion) => animacion.cancel()));
    if (estado !== "con" || movimientoReducido) return;

    capas.forEach((capa) => {
      const largo = capa.offsetWidth + capa.offsetHeight / 0.577 + 40;
      capa.animate(
        [
          { clipPath: "polygon(0px 0px, 0px 0px, 0px 0px)" },
          { clipPath: `polygon(0px 0px, ${largo}px 0px, 0px ${largo * 0.577}px)` },
        ],
        { duration: 950, delay: 240, easing: "cubic-bezier(.65,0,.25,1)", fill: "backwards" }
      );
    });
  }, [estado, movimientoReducido, refEscena]);

  function elegir(nuevo) {
    cancelarEsperas();
    setLlegando(false);
    setAvanzando(false);
    setEstado(nuevo);
  }

  return (
    <figure
      ref={refEscena}
      data-estado={estado}
      className="escena m-0 grid min-w-0 justify-items-center gap-4 justify-self-center escritorio:grid-cols-[auto_auto] escritorio:items-end escritorio:gap-x-4.5"
    >
      {/* El teléfono se diseña a 288 x 590 y se escala entero (--escala, lo calcula el héroe).
          Para la administración el lugar es más ancho: ahí entra la compu cuando pasa a "Con habitando". */}
      <div className="dispositivo">
        <div className="telefono">
          <PantallaVecino llegando={llegando} />
          <PantallaAdministracion llegando={llegando} />
        </div>
        <Compu />
      </div>

      {/* En escritorio va al costado izquierdo del teléfono, en vertical: así el alto queda entero para el teléfono */}
      <div
        role="group"
        aria-label="Comparar cómo es hoy y cómo es con habitando"
        className={`selector-escena inline-flex gap-0.75 bg-superficie-zona p-0.75 corte-12 escritorio:-order-1 escritorio:mb-6 escritorio:flex-col escritorio:corte-14 ${
          avanzando && corriendo ? "avanzando" : ""
        }`}
      >
        {OPCIONES.map((opcion) => (
          <button
            key={opcion.estado}
            type="button"
            data-estado-boton={opcion.estado}
            aria-pressed={estado === opcion.estado}
            onClick={() => elegir(opcion.estado)}
            className="relative cursor-pointer px-4 py-2.5 text-sm leading-none font-semibold text-texto-secundario corte-9 transition-colors duration-200 focus-visible:shadow-[inset_0_0_0_2px_var(--foco)] focus-visible:outline-none aria-pressed:bg-accion-principal aria-pressed:text-accion-principal-texto aria-[pressed=false]:hover:text-texto-principal escritorio:py-3 escritorio:pr-4.5 escritorio:pl-4.5 escritorio:text-left"
          >
            {opcion.texto}
          </button>
        ))}
      </div>
    </figure>
  );
}
