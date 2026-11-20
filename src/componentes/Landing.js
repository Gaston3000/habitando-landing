"use client";

import { useEffect, useRef } from "react";
import Accion from "@/componentes/Accion";
import BarraAccion from "@/componentes/BarraAccion";
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
  // Siempre arranca desde el héroe: cada versión es otro discurso y lo primero es su promesa. Si estabas más abajo,
  // se funde la página entera y, mientras no se ve, sube de golpe (un desplazamiento desde el pie marearía).
  function elegirPerfil(nuevo) {
    if (nuevo === leerPerfil()) return;
    history.replaceState(null, "", `#${nuevo}`);
    const subir = window.scrollY > 0;

    function cambiar() {
      if (subir) window.scrollTo({ top: 0, behavior: "instant" });
      ponerPerfil(nuevo);
    }

    if (movimientoReducido) {
      cambiar();
      return;
    }
    const raiz = document.documentElement;
    raiz.classList.add("cambiando-perfil");
    raiz.classList.toggle("subiendo", subir);
    setTimeout(() => {
      cambiar();
      requestAnimationFrame(() => raiz.classList.remove("cambiando-perfil", "subiendo"));
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

  // Desde el pie: muestra la versión elegida desde el héroe. Si ya es la que se ve, solo sube.
  function verPerfil(nuevo) {
    if (nuevo === leerPerfil()) irArriba();
    else elegirPerfil(nuevo);
  }

  function verElOtroLado() {
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
        <Heroe perfil={perfil} alElegirPerfil={elegirPerfil} />
        <Problema perfil={perfil} alVerElOtroLado={verElOtroLado} />
        <Funciones />
        <Pasos />
        <PreguntasFrecuentes />
        <Accion />
      </main>
      <Pie alVerPerfil={verPerfil} alRepetirBienvenida={repetirBienvenida} />
      <BarraAccion perfil={perfil} alElegirPerfil={elegirPerfil} />
    </>
  );
}
