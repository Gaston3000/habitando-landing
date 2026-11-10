"use client";

import { useEffect, useRef, useState } from "react";
import Sala from "@/componentes/Sala";
import { armarPlano, SALA_TUYA, SALAS } from "@/lib/trama";

// Cuánto se acerca la planta a "tu unidad" del lado del vecino
const ACERCAMIENTO = { angosto: 2, ancho: 2.4 };
// Lugar mínimo a la derecha del teléfono para que entre la unidad con su etiqueta
const LUGAR_PARA_ETIQUETA = 165;

// Trama de planta de fondo del héroe.
// Administración: la planta entera. Vecinos: se acerca a una sola unidad, resaltada, al lado del teléfono.
export default function TramaPlano({ refHeroe, perfil, movimientoReducido }) {
  const [medidas, setMedidas] = useState(null);

  const refPlano = useRef(null);
  const refEtiqueta = useRef(null);
  const refPerfilAnterior = useRef(perfil);

  // La planta se vuelve a armar solo si el héroe cambió bastante de tamaño.
  useEffect(() => {
    const heroe = refHeroe.current;
    const observador = new ResizeObserver(() => {
      setMedidas((anteriores) => {
        const ancho = heroe.clientWidth;
        const alto = heroe.clientHeight;
        if (anteriores && Math.abs(ancho - anteriores.ancho) <= 30 && alto <= anteriores.alto + 60) {
          return anteriores;
        }
        return { ancho, alto };
      });
    });
    observador.observe(heroe);
    return () => observador.disconnect();
  }, [refHeroe]);

  const plano = medidas ? armarPlano(medidas.ancho, medidas.alto) : null;

  useEffect(() => {
    if (!plano) return;

    const heroe = refHeroe.current;
    const grupo = refPlano.current;
    const etiqueta = refEtiqueta.current;
    // Se anima solo cuando cambia el perfil; al cambiar el tamaño de la pantalla, va directo.
    const animarCambio = refPerfilAnterior.current !== perfil && !movimientoReducido;
    refPerfilAnterior.current = perfil;

    function encuadrar(animar) {
      grupo.style.transition = animar ? "" : "none";

      if (perfil !== "vecinos") {
        grupo.style.transform = "translate(0px, 0px) scale(1)";
        etiqueta.dataset.visible = "false";
        return;
      }

      const cajaHeroe = heroe.getBoundingClientRect();
      const cajaTelefono = heroe.querySelector(".telefono").getBoundingClientRect();
      const acercamiento = cajaHeroe.width < 900 ? ACERCAMIENTO.angosto : ACERCAMIENTO.ancho;
      const libreDerecha = cajaHeroe.right - cajaTelefono.right;
      const conEtiqueta = libreDerecha >= LUGAR_PARA_ETIQUETA;

      // Si hay lugar, la unidad va a la derecha del teléfono; si no, queda detrás, sin etiqueta.
      const x = conEtiqueta
        ? cajaTelefono.right - cajaHeroe.left + libreDerecha / 2
        : cajaTelefono.left - cajaHeroe.left + cajaTelefono.width / 2;
      const y = cajaTelefono.top - cajaHeroe.top + cajaTelefono.height * (conEtiqueta ? 0.3 : 0.45);

      grupo.style.transform = `translate(${x - acercamiento * plano.unidad.x}px, ${y - acercamiento * plano.unidad.y}px) scale(${acercamiento})`;
      etiqueta.style.left = `${x}px`;
      etiqueta.style.top = `${y + 20 * acercamiento + 14}px`;
      etiqueta.dataset.visible = String(conEtiqueta);
    }

    encuadrar(animarCambio);

    let espera = 0;
    function alCambiarTamano() {
      clearTimeout(espera);
      espera = setTimeout(() => encuadrar(false), 120);
    }
    window.addEventListener("resize", alCambiarTamano);
    // Cuando terminan de cargar las tipografías el teléfono puede moverse un poco: se vuelve a encuadrar.
    // Solo si no se está animando un cambio de perfil, porque encuadrar sin transición cortaría el acercamiento.
    if (!animarCambio) document.fonts.ready.then(() => encuadrar(false));

    return () => {
      clearTimeout(espera);
      window.removeEventListener("resize", alCambiarTamano);
    };
  }, [plano, perfil, movimientoReducido, refHeroe]);

  return (
    <div aria-hidden="true" className="trama-heroe pointer-events-none absolute inset-0">
      <svg viewBox={medidas ? `0 0 ${medidas.ancho} ${medidas.alto}` : undefined} className="block size-full">
        <g ref={refPlano} className="trama-plano">
          {plano?.modulos.map((modulo) => (
            <g key={`${modulo.x}-${modulo.y}`} transform={`translate(${modulo.x} ${modulo.y})`}>
              {SALAS.map((sala, indice) => (
                <Sala
                  key={indice}
                  sala={sala}
                  className={`sala sala-tono-${sala.tono} ${modulo.tuyo && indice === SALA_TUYA ? "sala-tuya" : ""}`}
                />
              ))}
            </g>
          ))}
        </g>
      </svg>
      <span
        ref={refEtiqueta}
        data-visible="false"
        className="absolute -translate-x-1/2 bg-superficie-elevada px-2.5 py-1 text-[0.8rem] font-semibold whitespace-nowrap text-texto-principal opacity-0 shadow-[0_6px_18px_-8px_var(--sombra)] transition-opacity duration-400 data-[visible=true]:opacity-100 data-[visible=true]:delay-900"
      >
        UF 7 · 3º B, tu unidad
      </span>
    </div>
  );
}
