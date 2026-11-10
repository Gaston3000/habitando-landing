"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Sala from "@/componentes/Sala";
import { useMovimientoReducido } from "@/lib/pagina";
import { ALTO_MODULO, ANCHO_MODULO, SALAS } from "@/lib/trama";

// Misma escala que la trama clara de la banda final, así cada luz cae justo sobre su sala
const ESCALA = 0.8;
const ANCHO = ANCHO_MODULO * ESCALA;
const ALTO = ALTO_MODULO * ESCALA;
// Hasta qué distancia del cursor se encienden las salas, en px
const ALCANCE = 110;
// Lo que baja el corte con el pie por debajo de la banda (ABAJO en Pie.js): ahí también se encienden las salas claras
const FRANJA_PIE = 96;

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

// Todas las salas que cubren la banda
function armarLuces({ columnas, filas }) {
  const luces = [];
  for (let fila = 0; fila < filas; fila++) {
    for (let columna = 0; columna < columnas; columna++) {
      SALAS.forEach((sala, indice) => {
        luces.push({ clave: `${columna}-${fila}-${indice}`, columna, fila, sala });
      });
    }
  }
  return luces;
}

// Al pasar el mouse por la banda final, las salas cercanas se encienden en un celeste más fuerte, nítidas, y al irse
// se apagan de a poco, dejando un rastro. Va encima de la trama clara, con las salas en el mismo lugar.
// También se encienden las salas claras del corte con el pie (las dibuja Pie.js, también con la clase "luz").
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
    const banda = refSvg.current.parentElement;
    let luces = [];
    let cajas = [];
    let adentro = false;
    let encendidas = new Set();
    let cuadro = 0;

    // Las cajas se miden al entrar a la zona, relativas a la banda: no cambian con el scroll
    function medirLuces(cajaBanda) {
      luces = [...document.querySelectorAll(".luz")];
      cajas = luces.map((luz) => {
        const caja = luz.getBoundingClientRect();
        return [caja.left - cajaBanda.left, caja.top - cajaBanda.top, caja.width, caja.height];
      });
      encendidas = new Set();
    }

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

    // Se escucha en toda la página porque la zona sigue debajo de la banda, en el corte con el pie
    function alMover(evento) {
      cancelAnimationFrame(cuadro);
      cuadro = requestAnimationFrame(() => {
        const cajaBanda = banda.getBoundingClientRect();
        const x = evento.clientX - cajaBanda.left;
        const y = evento.clientY - cajaBanda.top;
        const enZona = y >= 0 && y <= cajaBanda.height + FRANJA_PIE && !evento.target.closest("form");

        if (!enZona) {
          if (adentro) encender(-Infinity, -Infinity);
          adentro = false;
          return;
        }
        if (!adentro) medirLuces(cajaBanda);
        adentro = true;
        encender(x, y);
      });
    }

    document.addEventListener("pointermove", alMover);
    return () => {
      cancelAnimationFrame(cuadro);
      document.removeEventListener("pointermove", alMover);
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
