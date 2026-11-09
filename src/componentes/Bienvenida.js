"use client";

import { useEffect, useRef } from "react";
import { ponerBienvenida, useBienvenidaActiva } from "@/lib/pagina";

// Coordenadas del símbolo oficial (ver lib/isologo.js): el piso está en y = 349,71.
const PISO = 349.71;
const VIEWBOX = [0, 40, 262, 320];
const VIEWBOX_ISOLOGO = [48, 46, 1440, 306];

function salida(t) {
  return 1 - Math.pow(1 - t, 3);
}

function suave(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Cuánto avanzó un tramo de la animación (de 0 a 1) entre los milisegundos "desde" y "hasta".
function tramo(t, desde, hasta) {
  return Math.min(1, Math.max(0, (t - desde) / (hasta - desde)));
}

// Dónde queda el símbolo dentro de un svg en pantalla, según su viewBox [x, y, ancho, alto].
function cajaSimbolo(svg, viewBox) {
  const caja = svg.getBoundingClientRect();
  const escala = caja.height / viewBox[3];
  return {
    caja,
    left: caja.left + (50.316 - viewBox[0]) * escala,
    top: caja.top + (49.62 - viewBox[1]) * escala,
    alto: 300.1 * escala,
  };
}

// Bienvenida de 1,7 segundos: se dibuja el piso, las dos torres suben con el techo plano,
// se cortan a 30° (la alta baja su esquina izquierda y la baja, la derecha) y vuelan al logo del encabezado.
// Se ve una vez por visita; un clic o una tecla la saltean.
export default function Bienvenida({ refIsologo }) {
  const activa = useBienvenidaActiva();

  const refSimbolo = useRef(null);
  const refTorreAlta = useRef(null);
  const refTorreBaja = useRef(null);
  const refPiso = useRef(null);
  const refFondo = useRef(null);

  useEffect(() => {
    if (!activa) return;

    try {
      sessionStorage.setItem("habitando-bienvenida", "si");
    } catch {
      // Sin sessionStorage (modo privado): se vuelve a ver la próxima vez, no pasa nada.
    }

    const simbolo = refSimbolo.current;
    const piso = refPiso.current;
    const fondo = refFondo.current;
    let cuadro = 0;

    function dibujar(t) {
      const subeAlta = salida(tramo(t, 150, 700));
      const subeBaja = salida(tramo(t, 290, 820));
      const corte = suave(tramo(t, 810, 1080));
      const techoAlta = PISO - (PISO - 49.62) * subeAlta;
      const techoBaja = PISO - (PISO - 142.21) * subeBaja;
      const esquinaAlta = Math.min(PISO, techoAlta + 44.6 * corte);
      const esquinaBaja = Math.min(PISO, techoBaja + 44.77 * corte);
      refTorreAlta.current.setAttribute(
        "points",
        `50.316,${esquinaAlta} 127.68,${techoAlta} 127.68,${PISO} 50.316,${PISO}`
      );
      refTorreBaja.current.setAttribute(
        "points",
        `134.377,${techoBaja} 211.785,${esquinaBaja} 211.785,${PISO} 134.367,${PISO}`
      );
      const mitadPiso = salida(tramo(t, 0, 360)) * 121;
      piso.setAttribute("x1", 131.05 - mitadPiso);
      piso.setAttribute("x2", 131.05 + mitadPiso);
    }

    // Al terminar (o al saltearla) se saca la clase de <html>; la limpieza de abajo frena lo que quede.
    function terminar() {
      ponerBienvenida(false);
    }

    function volar() {
      dibujar(Infinity);
      const origen = cajaSimbolo(simbolo, VIEWBOX);
      const destino = cajaSimbolo(refIsologo.current, VIEWBOX_ISOLOGO);
      const escala = destino.alto / origen.alto;
      const dx = destino.left - origen.caja.left - (origen.left - origen.caja.left) * escala;
      const dy = destino.top - origen.caja.top - (origen.top - origen.caja.top) * escala;
      const duracion = 520;

      const vuelo = simbolo.animate(
        [{ transform: "translate(0px, 0px) scale(1)" }, { transform: `translate(${dx}px, ${dy}px) scale(${escala})` }],
        { duration: duracion, easing: "cubic-bezier(.65,0,.25,1)", fill: "forwards" }
      );
      piso.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, fill: "forwards" });
      fondo.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: duracion - 100,
        delay: 100,
        easing: "ease-out",
        fill: "forwards",
      });
      vuelo.onfinish = terminar;
    }

    let inicio = null;
    function avanzar(ahora) {
      if (inicio === null) inicio = ahora;
      const t = ahora - inicio;
      dibujar(t);
      if (t < 1180) cuadro = requestAnimationFrame(avanzar);
      else volar();
    }

    dibujar(0);
    cuadro = requestAnimationFrame(avanzar);
    document.addEventListener("keydown", terminar);

    return () => {
      cancelAnimationFrame(cuadro);
      document.removeEventListener("keydown", terminar);
      [simbolo, piso, fondo].forEach((elemento) => elemento.getAnimations().forEach((animacion) => animacion.cancel()));
    };
  }, [activa, refIsologo]);

  return (
    <div className="bienvenida" aria-hidden="true" onPointerDown={() => ponerBienvenida(false)}>
      <div ref={refFondo} className="absolute inset-0 bg-superficie-pagina" />
      <svg ref={refSimbolo} className="bienvenida-simbolo" viewBox={VIEWBOX.join(" ")}>
        <line ref={refPiso} x1="131.05" y1="350.6" x2="131.05" y2="350.6" />
        <polygon ref={refTorreAlta} points="0,0" />
        <polygon ref={refTorreBaja} points="0,0" />
      </svg>
    </div>
  );
}
