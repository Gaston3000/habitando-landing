"use client";

import { useEffect, useState } from "react";
import Simbolo from "@/componentes/Simbolo";
import { CLASES_BOTON } from "@/lib/clases";

// Solo en el celular: una barra fija abajo con la acción de la versión elegida, siempre a mano para el pulgar,
// y al lado el cambio de versión (las dos torres). Aparece cuando ya pasaste el botón del héroe y se esconde
// en la banda final y en el pie, donde la acción ya está a la vista.
export default function BarraAccion({ perfil, alElegirPerfil }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const aLaVista = new Set();
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) aLaVista.add(entrada.target);
        else aLaVista.delete(entrada.target);
      });
      setVisible(aLaVista.size === 0);
    });
    const vigilados = [
      ...document.querySelectorAll("[data-acciones-heroe]"),
      document.getElementById("accion"),
      document.querySelector("body > footer"),
    ];
    vigilados.forEach((elemento) => elemento && observador.observe(elemento));
    return () => observador.disconnect();
  }, []);

  const otro = perfil === "vecinos" ? "administraciones" : "vecinos";

  return (
    <div
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-borde-suave bg-superficie-pagina/90 pt-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] backdrop-blur-md backdrop-saturate-150 transition-transform duration-300 ease-out md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="contenedor flex items-center gap-3">
        <a href="#accion" className={`${CLASES_BOTON} flex-1`}>
          <span data-solo="vecinos">Contale a tu administración</span>
          <span data-solo="administraciones">Pedí una demo</span>
        </a>
        <button
          type="button"
          onClick={() => alElegirPerfil(otro)}
          aria-label={otro === "vecinos" ? "Ver la versión para vecinos" : "Ver la versión para administraciones"}
          className="flex min-h-12.5 min-w-14 cursor-pointer flex-col items-center justify-center gap-1 px-2 text-[0.72rem] font-semibold text-texto-secundario"
        >
          <Simbolo resaltar={otro === "vecinos" ? "alta" : "baja"} className="h-5 w-2.75" />
          <span data-solo="vecinos">Para admin.</span>
          <span data-solo="administraciones">Para vecinos</span>
        </button>
      </div>
    </div>
  );
}
