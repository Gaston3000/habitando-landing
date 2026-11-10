"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Sala from "@/componentes/Sala";
import { useMovimientoReducido } from "@/lib/pagina";
import { ALTO_MODULO, ANCHO_MODULO, altoSala, SALAS } from "@/lib/trama";

// Misma escala que la trama clara de la banda final, así cada luz cae justo sobre su sala
const ESCALA = 0.8;
const ANCHO = ANCHO_MODULO * ESCALA;
const ALTO = ALTO_MODULO * ESCALA;
// Hasta qué distancia del cursor se encienden las salas, en px
const ALCANCE = 110;

const CONSULTA_MOUSE = "(hover: hover) and (pointer: fine)";

// true si hay mouse (en el celular no hay hover, así que la trama queda quieta)
function useHayMouse() {
  return useSyncExternalStore(
    (avisar) => {
      const consulta = window.matchMedia(CONSULTA_MOUSE);
      consulta.addEventListener("change", avisar);
      return () => consulta.removeEventListener("change", avisar);
    },
    () => window.matchMedia(CONSULTA_MOUSE).matches,
    () => false
  );
}

function cajaSala(sala) {
  if (sala.rect) return sala.rect;
  const xs = sala.puntos.split(" ").map((punto) => Number(punto.split(",")[0]));
  const [arriba, abajo] = altoSala(sala);
  return [Math.min(...xs), arriba, Math.max(...xs) - Math.min(...xs), abajo - arriba];
}

// Todas las salas que cubren la banda, con su caja en px dentro de la banda (para medir la distancia al cursor)
function armarLuces({ columnas, filas }) {
  const luces = [];
  for (let fila = 0; fila < filas; fila++) {
    for (let columna = 0; columna < columnas; columna++) {
      SALAS.forEach((sala, indice) => {
        const [x, y, ancho, alto] = cajaSala(sala);
        luces.push({
          clave: `${columna}-${fila}-${indice}`,
          columna,
          fila,
          sala,
          caja: [columna * ANCHO + x * ESCALA, fila * ALTO + y * ESCALA, ancho * ESCALA, alto * ESCALA],
        });
      });
    }
  }
  return luces;
}

// Al pasar el mouse por la banda final, las salas cercanas se encienden en un celeste más fuerte, nítidas, y al irse
// se apagan de a poco, dejando un rastro. Va encima de la trama clara, con las salas en el mismo lugar.
// Sobre el formulario no pasa nada, para no distraer mientras alguien lo completa.
export default function TramaLuces() {
  const hayMouse = useHayMouse();
  const movimientoReducido = useMovimientoReducido();
  const activa = hayMouse && !movimientoReducido;

  const [medidas, setMedidas] = useState(null);
  const refSvg = useRef(null);

  // Cuántos módulos de trama hacen falta para cubrir la banda
  useEffect(() => {
    if (!activa) return;
    const banda = refSvg.current.parentElement;
    const observador = new ResizeObserver(() =>
      setMedidas({ columnas: Math.ceil(banda.clientWidth / ANCHO) + 1, filas: Math.ceil(banda.clientHeight / ALTO) + 1 })
    );
    observador.observe(banda);
    return () => observador.disconnect();
  }, [activa]);

  useEffect(() => {
    if (!activa || !medidas) return;
    const svg = refSvg.current;
    const banda = svg.parentElement;
    // Mismo orden que en el dibujo: la luz número i es la sala número i de armarLuces
    const luces = [...svg.querySelectorAll(".luz")];
    const cajas = armarLuces(medidas).map((luz) => luz.caja);
    let encendidas = new Set();
    let cuadro = 0;

    function encender(x, y) {
      const nuevas = new Set();
      cajas.forEach(([izquierda, arriba, ancho, alto], indice) => {
        const dx = Math.max(izquierda - x, 0, x - (izquierda + ancho));
        const dy = Math.max(arriba - y, 0, y - (arriba + alto));
        if (dx * dx + dy * dy < ALCANCE * ALCANCE) nuevas.add(indice);
      });
      encendidas.forEach((indice) => !nuevas.has(indice) && luces[indice].classList.remove("encendida"));
      nuevas.forEach((indice) => !encendidas.has(indice) && luces[indice].classList.add("encendida"));
      encendidas = nuevas;
    }

    function alMover(evento) {
      cancelAnimationFrame(cuadro);
      cuadro = requestAnimationFrame(() => {
        if (evento.target.closest("form")) {
          encender(-Infinity, -Infinity);
          return;
        }
        const caja = banda.getBoundingClientRect();
        encender(evento.clientX - caja.left, evento.clientY - caja.top);
      });
    }

    function alSalir() {
      cancelAnimationFrame(cuadro);
      encender(-Infinity, -Infinity);
    }

    banda.addEventListener("pointermove", alMover);
    banda.addEventListener("pointerleave", alSalir);
    return () => {
      cancelAnimationFrame(cuadro);
      banda.removeEventListener("pointermove", alMover);
      banda.removeEventListener("pointerleave", alSalir);
    };
  }, [activa, medidas]);

  const luces = activa && medidas ? armarLuces(medidas) : [];

  return (
    <svg ref={refSvg} aria-hidden="true" className="pointer-events-none absolute inset-0 block size-full">
      {luces.map(({ clave, columna, fila, sala }) => (
        <g key={clave} transform={`translate(${columna * ANCHO} ${fila * ALTO}) scale(${ESCALA})`}>
          <Sala sala={sala} className="luz" />
        </g>
      ))}
    </svg>
  );
}
