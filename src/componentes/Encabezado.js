"use client";

import { useEffect, useState } from "react";
import Isologo from "@/componentes/Isologo";
import Simbolo from "@/componentes/Simbolo";
import { CLASES_BOTON_CHICO, CLASES_ENLACE } from "@/lib/clases";
import { URL_INGRESAR } from "@/lib/enlaces";

const PERFILES = [
  { id: "vecinos", nombre: "Para vecinos", torre: "alta" },
  { id: "administraciones", nombre: "Para administraciones", torre: "baja" },
];

// Encabezado fijo: el logo, el selector de perfil, el botón de la acción principal e "Ingresar".
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

  function elegir(evento, id) {
    evento.preventDefault();
    alElegirPerfil(id);
  }

  return (
    <header
      id="encabezado"
      className={`sticky top-[env(safe-area-inset-top,0px)] z-20 border-b bg-superficie-pagina/85 backdrop-blur-md backdrop-saturate-150 transition-colors duration-300 ${
        conBorde ? "border-borde-suave" : "border-transparent"
      }`}
    >
      {/* En el celular: el logo e "Ingresar" arriba, el selector de perfil abajo. En escritorio, todo en una fila. */}
      <div className="contenedor grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2.5 pt-3 pb-2.5 md:min-h-18.5 md:grid-cols-[1fr_auto_1fr] md:py-0">
        <a href="#vecinos" onClick={irArriba} aria-label="habitando" className="inline-flex justify-self-start text-texto-principal">
          <Isologo ref={refIsologo} className="h-7 md:h-8.5" />
        </a>

        <nav
          aria-label="Elegí tu perfil"
          className="col-span-2 row-start-2 flex w-full gap-1 bg-superficie-zona p-1 corte-16 md:col-span-1 md:row-start-auto md:w-auto"
        >
          {PERFILES.map((opcion) => (
            <a
              key={opcion.id}
              href={`#${opcion.id}`}
              onClick={(evento) => elegir(evento, opcion.id)}
              aria-current={perfil === opcion.id ? "page" : undefined}
              className="inline-flex flex-1 items-center justify-center gap-2.5 px-2 py-2 text-[0.9rem] font-semibold whitespace-nowrap text-texto-secundario corte-12 transition-colors duration-300 hover:text-texto-principal focus-visible:shadow-[inset_0_0_0_2px_var(--foco)] focus-visible:outline-none aria-[current=page]:bg-superficie-elevada aria-[current=page]:text-texto-principal md:flex-none md:pr-4 md:pl-4.5 md:text-[0.95rem]"
            >
              <Simbolo resaltar={opcion.torre} className="h-4.25 w-2.25" />
              {opcion.nombre}
            </a>
          ))}
        </nav>

        <div className="col-start-2 row-start-1 flex items-center gap-6 justify-self-end md:col-start-3">
          <div
            className={`hidden transition-[opacity,visibility] duration-300 md:block ${
              botonOculto ? "invisible opacity-0" : ""
            }`}
          >
            <a href="#accion" className={CLASES_BOTON_CHICO}>
              <span data-solo="vecinos">Contale a tu administración</span>
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
