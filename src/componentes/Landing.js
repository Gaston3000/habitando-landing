"use client";

import { useEffect, useRef } from "react";
import Accion from "@/componentes/Accion";
import Bienvenida from "@/componentes/Bienvenida";
import Encabezado from "@/componentes/Encabezado";
import Funciones from "@/componentes/Funciones";
import Heroe from "@/componentes/Heroe";
import Pasos from "@/componentes/Pasos";
import Pie from "@/componentes/Pie";
import PreguntasFrecuentes from "@/componentes/PreguntasFrecuentes";
import Problema from "@/componentes/Problema";
import { leerPerfil, ponerBienvenida, ponerPerfil, useMovimientoReducido, usePerfil } from "@/lib/pagina";

const PERFILES = ["vecinos", "administraciones"];
// Lo que dura el fundido al cambiar de perfil (ver landing.css)
const FUNDIDO = 200;

// La landing entera, con sus dos perfiles: vecinos y administraciones.
// Las dos versiones de cada sección están en la página y se muestra la del perfil elegido.
export default function Landing() {
  const perfil = usePerfil();
  const movimientoReducido = useMovimientoReducido();
  const refIsologo = useRef(null);

  // Cambia de perfil con un fundido corto y deja el perfil en la dirección, así el link se puede compartir.
  function elegirPerfil(nuevo) {
    if (nuevo === leerPerfil()) return;
    history.replaceState(null, "", `#${nuevo}`);

    if (movimientoReducido) {
      ponerPerfil(nuevo);
      return;
    }
    const raiz = document.documentElement;
    raiz.classList.add("cambiando-perfil");
    setTimeout(() => {
      ponerPerfil(nuevo);
      requestAnimationFrame(() => raiz.classList.remove("cambiando-perfil"));
    }, FUNDIDO);
  }

  // Si alguien cambia el final de la dirección a mano (#vecinos o #administraciones)
  useEffect(() => {
    function alCambiarDireccion() {
      const pedido = location.hash.slice(1);
      if (PERFILES.includes(pedido)) elegirPerfil(pedido);
    }
    window.addEventListener("hashchange", alCambiarDireccion);
    return () => window.removeEventListener("hashchange", alCambiarDireccion);
  });

  function irArriba() {
    window.scrollTo({ top: 0, behavior: movimientoReducido ? "auto" : "smooth" });
  }

  // Desde el pie: sube y muestra la versión elegida
  function verPerfil(nuevo) {
    irArriba();
    elegirPerfil(nuevo);
  }

  function verElOtroLado() {
    irArriba();
    elegirPerfil(perfil === "vecinos" ? "administraciones" : "vecinos");
  }

  function repetirBienvenida() {
    if (movimientoReducido) return;
    window.scrollTo(0, 0);
    ponerBienvenida(true);
  }

  return (
    <>
      <Bienvenida refIsologo={refIsologo} />
      <Encabezado perfil={perfil} alElegirPerfil={elegirPerfil} alIrArriba={irArriba} refIsologo={refIsologo} />
      <main>
        {/* De lo más importante a lo menos: la promesa, el problema con sus datos, qué incluye,
            cómo se empieza, las dudas de antes de decidirse y la acción. */}
        <Heroe perfil={perfil} />
        <Problema perfil={perfil} alVerElOtroLado={verElOtroLado} />
        <Funciones />
        <Pasos />
        <PreguntasFrecuentes />
        <Accion />
      </main>
      <Pie alVerPerfil={verPerfil} alRepetirBienvenida={repetirBienvenida} />
    </>
  );
}
