"use client";

import { useEffect, useState } from "react";
import Isologo from "@/componentes/Isologo";
import SelectorPerfil from "@/componentes/SelectorPerfil";
import { CLASES_BOTON_CHICO, CLASES_ENLACE } from "@/lib/clases";
import { URL_INGRESAR } from "@/lib/enlaces";
import { unirPalabrasCortas } from "@/lib/texto";

// Encabezado fijo: el logo, el selector de perfil, el botón de la acción principal e "Ingresar".
// En el celular queda solo el logo con "Ingresar", para no ocupar pantalla: el selector va en el héroe.
export default function Encabezado({ perfil, alElegirPerfil, alIrArriba, refIsologo }) {
  const [conBorde, setConBorde] = useState(false);
  const [botonOculto, setBotonOculto] = useState(true);

  // El borde de abajo aparece apenas se baja un poco.
  useEffect(() => {
    function revisarScroll() {
      setConBorde(window.scrollY > 8);
    }
    window.addEventListener("scroll", revisarScroll, { passive: true });
    return () => window.removeEventListener("scroll", revisarScroll);
  }, []);

  // El botón se esconde mientras el del héroe está a la vista, para no repetir la misma acción dos veces.
  useEffect(() => {
    const accionesVisibles = new Set();
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) accionesVisibles.add(entrada.target);
          else accionesVisibles.delete(entrada.target);
        });
        setBotonOculto(accionesVisibles.size > 0);
      },
      { rootMargin: "-80px 0px 0px 0px" }
    );
    document.querySelectorAll("[data-acciones-heroe]").forEach((acciones) => observador.observe(acciones));
    return () => observador.disconnect();
  }, []);

  function irArriba(evento) {
    evento.preventDefault();
    alIrArriba();
  }

  return (
    <header
      id="encabezado"
      className={`sticky top-[env(safe-area-inset-top,0px)] z-20 border-b bg-superficie-pagina/85 backdrop-blur-md backdrop-saturate-150 transition-colors duration-300 ${
        conBorde ? "border-borde-suave" : "border-transparent"
      }`}
    >
      <div className="contenedor grid min-h-14 grid-cols-[1fr_auto] items-center gap-x-6 md:min-h-18.5 md:grid-cols-[1fr_auto_1fr]">
        <a href="#vecinos" onClick={irArriba} aria-label="habitando" className="inline-flex justify-self-start text-texto-principal">
          <Isologo ref={refIsologo} className="h-7 md:h-8.5" />
        </a>

        <SelectorPerfil perfil={perfil} alElegir={alElegirPerfil} className="hidden md:flex" />

        <div className="col-start-2 row-start-1 flex items-center gap-6 justify-self-end md:col-start-3">
          <div
            className={`hidden transition-[opacity,visibility] duration-300 md:block ${
              botonOculto ? "invisible opacity-0" : ""
            }`}
          >
            <a href="#accion" className={CLASES_BOTON_CHICO}>
              <span data-solo="vecinos">{unirPalabrasCortas("Contale a tu administración")}</span>
              <span data-solo="administraciones">Pedí una demo</span>
            </a>
          </div>
          {/* Para quien ya usa habitando. Va al final, así no se mueve cuando aparece el botón. */}
          <a href={URL_INGRESAR} className={CLASES_ENLACE}>
            Ingresar
          </a>
        </div>
      </div>
    </header>
  );
}
