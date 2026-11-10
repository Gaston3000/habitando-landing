"use client";

import { useEffect, useState } from "react";
import Isologo from "@/componentes/Isologo";
import Sala from "@/componentes/Sala";
import { CLASES_ENLACE } from "@/lib/clases";
import { URL_INGRESAR } from "@/lib/enlaces";
import { ALTO_MODULO, ANCHO_MODULO, altoSala, SALAS } from "@/lib/trama";

// La trama de la banda final y la del pie van a la misma escala, así los ambientes coinciden en el corte
const ESCALA_TRAMA = 0.8;
const ALTO_TRAMA = ALTO_MODULO * ESCALA_TRAMA;

const SECCIONES = [
  { texto: "Para vecinos", perfil: "vecinos" },
  { texto: "Para administraciones", perfil: "administraciones" },
  { texto: "Preguntas frecuentes", ancla: "#preguntas" },
];

// Para que los ambientes sigan del otro lado del corte, la trama del pie se corre lo que mide la banda final
// (módulo el alto de una fila de la trama). Se mide cada vez que la banda cambia de tamaño.
function useDesfaseTrama() {
  const [desfase, setDesfase] = useState(0);

  useEffect(() => {
    const banda = document.getElementById("accion");
    const observador = new ResizeObserver(() => setDesfase(banda.offsetHeight % ALTO_TRAMA));
    observador.observe(banda);
    return () => observador.disconnect();
  }, []);

  return desfase;
}

// Arriba del pie sigue la trama de la banda final, en su versión oscura: es el mismo plano, solo cambia la luz.
// Se apaga hacia abajo, donde está el texto.
function TramaPie({ desfase }) {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 block h-28 w-full [mask-image:linear-gradient(to_bottom,#000,transparent)] md:h-44"
    >
      <defs>
        <pattern
          id="trama-pie"
          width={ANCHO_MODULO}
          height={ALTO_MODULO}
          patternUnits="userSpaceOnUse"
          patternTransform={`translate(0 ${-desfase}) scale(${ESCALA_TRAMA})`}
        >
          {SALAS.map((sala, indice) => (
            <Sala key={indice} sala={sala} className={`trama-oscura-${sala.tono}`} />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#trama-pie)" />
    </svg>
  );
}

// Cuánto entra la transición en la banda final (sin tocar el formulario) y cuánto baja en el pie (sin llegar al texto)
const ARRIBA = 56;
const ABAJO = 96;
const COLUMNAS = 10;

// Número entre 0 y 1 que siempre da lo mismo para la misma sala: así el apagado es igual en el servidor y en el navegador
function azarDeSala(columna, fila, indice) {
  const mezcla = Math.imul(columna + 7, 73856093) ^ Math.imul(fila + 11, 19349663) ^ Math.imul(indice + 13, 83492791);
  return ((mezcla >>> 0) % 1000) / 1000;
}

// El corte entre la banda final y el pie no es una línea recta: las salas se apagan de a una, como un edificio de noche.
// Cerca del corte, algunas salas de la banda ya están oscuras y algunas del pie siguen encendidas; cuanto más abajo,
// más salas apagadas. Cada sala es clara u oscura (sin tonos intermedios), así el dibujo sigue nítido.
function ApagadoSalas({ desfase }) {
  const salas = [];
  for (let fila = -1; fila <= 1; fila++) {
    for (let columna = 0; columna < COLUMNAS; columna++) {
      const x = columna * ANCHO_MODULO * ESCALA_TRAMA;
      const y = fila * ALTO_TRAMA - desfase;
      SALAS.forEach((sala, indice) => {
        const [arriba, abajo] = altoSala(sala).map((valor) => y + valor * ESCALA_TRAMA);
        // Solo las salas que entran enteras en la franja de la transición
        if (arriba < -ARRIBA || abajo > ABAJO) return;
        const avance = ((arriba + abajo) / 2 + ARRIBA) / (ARRIBA + ABAJO);
        const apagada = azarDeSala(columna, fila, indice) < avance;
        salas.push({ clave: `${columna}-${fila}-${indice}`, x, y, sala, clase: `sala-${apagada ? "apagada" : "encendida"}-${sala.tono}` });
      });
    }
  }

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 block w-full"
      style={{ top: -ARRIBA, height: ARRIBA + ABAJO }}
    >
      <g transform={`translate(0 ${ARRIBA})`}>
        {salas.map(({ clave, x, y, sala, clase }) => (
          <g key={clave} transform={`translate(${x} ${y}) scale(${ESCALA_TRAMA})`}>
            <Sala sala={sala} className={clase} />
          </g>
        ))}
      </g>
    </svg>
  );
}

// Pie de la página, siempre oscuro (fondo de marca de tema.css): la marca con su frase, atajos a cada versión
// y a las preguntas, "Ingresar" para quien ya usa la app y, abajo, la letra chica.
export default function Pie({ alVerPerfil, alRepetirBienvenida }) {
  const desfase = useDesfaseTrama();

  // Las preguntas se buscan sin cambiar la dirección: así el perfil elegido (#vecinos o #administraciones) se mantiene
  function irASeccion(evento, seccion) {
    evento.preventDefault();
    if (seccion.perfil) alVerPerfil(seccion.perfil);
    else document.querySelector(seccion.ancla).scrollIntoView();
  }

  return (
    <footer className="relative bg-superficie-marca text-texto-sobre-marca">
      <TramaPie desfase={desfase} />
      <ApagadoSalas desfase={desfase} />

      <div className="contenedor relative pt-24 pb-8 md:pt-36">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <Isologo etiqueta="habitando" className="h-7.5" />
            <p className="mt-4 font-titulo text-[1.15rem] leading-[1.35] font-semibold">
              <span className="block">La información ya existe.</span>
              <span className="block">Nosotros abrimos la puerta.</span>
            </p>
          </div>

          <nav aria-label="Secciones de la página">
            <ul className="grid gap-2">
              {SECCIONES.map((seccion) => (
                <li key={seccion.texto}>
                  <a
                    href={seccion.ancla ?? `#${seccion.perfil}`}
                    onClick={(evento) => irASeccion(evento, seccion)}
                    className="text-texto-sobre-marca-secundario hover:text-texto-sobre-marca"
                  >
                    {seccion.texto}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Para quien ya usa la app: va aparte, porque es para otra persona */}
          <div>
            <p className="text-texto-sobre-marca-secundario">¿Ya usás habitando?</p>
            <a href={URL_INGRESAR} className={`${CLASES_ENLACE} decoration-texto-sobre-marca-secundario`}>
              Ingresar
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-texto-sobre-marca-secundario/25 pt-5 text-[0.88rem] text-texto-sobre-marca-secundario">
          <p>Proyecto de tesis de Diseño y Programación Web, 2026.</p>
          <button
            type="button"
            onClick={alRepetirBienvenida}
            className="cursor-pointer underline decoration-texto-sobre-marca-secundario/50 underline-offset-[0.3em] hover:text-texto-sobre-marca"
          >
            Ver la bienvenida de nuevo
          </button>
        </div>
      </div>
    </footer>
  );
}
