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
// Queda entera en la franja del corte (así empalma con las salas de ApagadoSalas) y después se apaga hacia el texto.
function TramaPie({ desfase }) {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 block h-36 w-full [mask-image:linear-gradient(to_bottom,#000_96px,transparent)] md:h-48"
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
// Detrás, en los espacios entre salas, el fondo pasa de blanco a marino por los azules de la marca, sin cortes rectos.
// Las salas que el borde de la franja corta se redibujan con el color de su lado, así empalman con las tramas de arriba y de abajo.
function ApagadoSalas({ desfase }) {
  const encendidas = [];
  const apagadas = [];
  for (let fila = -1; fila <= 1; fila++) {
    for (let columna = 0; columna < COLUMNAS; columna++) {
      const x = columna * ANCHO_MODULO * ESCALA_TRAMA;
      const y = fila * ALTO_TRAMA - desfase;
      SALAS.forEach((sala, indice) => {
        const [arriba, abajo] = altoSala(sala).map((valor) => y + valor * ESCALA_TRAMA);
        if (abajo <= -ARRIBA || arriba >= ABAJO) return;

        let apagada;
        if (arriba < -ARRIBA) apagada = false;
        else if (abajo > ABAJO) apagada = true;
        else apagada = azarDeSala(columna, fila, indice) < ((arriba + abajo) / 2 + ARRIBA) / (ARRIBA + ABAJO);

        (apagada ? apagadas : encendidas).push({ clave: `${columna}-${fila}-${indice}`, x, y, sala });
      });
    }
  }

  const dibujar = (lista, clase) =>
    lista.map(({ clave, x, y, sala }) => (
      <g key={clave} transform={`translate(${x} ${y}) scale(${ESCALA_TRAMA})`}>
        <Sala sala={sala} className={clase(sala)} />
      </g>
    ));

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 block w-full"
      style={{ top: -ARRIBA, height: ARRIBA + ABAJO }}
    >
      <defs>
        <linearGradient id="fondo-corte" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className="parada-blanco" />
          <stop offset=".3" className="parada-celeste" />
          <stop offset=".56" className="parada-azul" />
          {/* Llega al marino antes del final de la franja, así no se nota dónde termina */}
          <stop offset=".82" className="parada-marino" />
          <stop offset="1" className="parada-marino" />
        </linearGradient>
        {/* Las salas encendidas se apagan hacia la izquierda igual que la trama clara de la banda final */}
        <linearGradient id="desvanecer-corte" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity=".45" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".75" />
          <stop offset="1" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id="mascara-corte">
          <rect x="0" y={-ARRIBA} width="100%" height={ARRIBA + ABAJO} fill="url(#desvanecer-corte)" />
        </mask>
      </defs>

      <g transform={`translate(0 ${ARRIBA})`}>
        <rect x="0" y={-ARRIBA} width="100%" height={ARRIBA + ABAJO} fill="url(#fondo-corte)" />
        {dibujar(apagadas, (sala) => `sala-apagada-${sala.tono}`)}
        {/* Debajo de cada sala encendida va blanco, como el fondo de la banda final */}
        {dibujar(encendidas, () => "sala-base")}
        <g mask="url(#mascara-corte)">{dibujar(encendidas, (sala) => `sala-encendida-${sala.tono}`)}</g>
        {/* Las salas claras del corte también se encienden al pasar el mouse (ver TramaLuces.js) */}
        {dibujar(encendidas, () => "luz")}
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
