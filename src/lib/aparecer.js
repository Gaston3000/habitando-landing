"use client";

import { useEffect, useRef, useState } from "react";
import { useMovimientoReducido } from "@/lib/pagina";

// Para las animaciones que corren una sola vez, cuando el elemento aparece en pantalla.
// Devuelve la ref para el elemento y su estado, que va en data-estado:
// - "esperando": todavía no apareció (la animación no arrancó);
// - "activa": apareció y se está animando;
// - "final": con movimiento reducido, se muestra directo como termina.
// "visible" es qué parte del elemento tiene que verse para que arranque (de 0 a 1).
// "margenAbajo" achica la pantalla por abajo: con visible en 0, arranca cuando el borde de arriba del elemento
// pasa esa altura. Sirve para los elementos recortados con clip-path, porque el navegador mide solo la parte
// que no está recortada.
export function useAparecerEnPantalla(visible = 0.6, margenAbajo = "0px") {
  const movimientoReducido = useMovimientoReducido();
  const [vista, setVista] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (movimientoReducido) return;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVista(true);
          observador.disconnect();
        }
      },
      { threshold: visible, rootMargin: `0px 0px -${margenAbajo} 0px` }
    );
    observador.observe(ref.current);
    return () => observador.disconnect();
  }, [movimientoReducido, visible, margenAbajo]);

  const estado = movimientoReducido ? "final" : vista ? "activa" : "esperando";
  return [ref, estado];
}
