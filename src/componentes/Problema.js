"use client";

import { useState } from "react";
import EscenaProblema from "@/componentes/EscenaProblema";
import TramaPiso from "@/componentes/TramaPiso";
import { CLASES_ENLACE } from "@/lib/clases";

// Cada lado con lo que encontramos en la investigación: la encuesta a vecinos y la entrevista al administrador.
// Los porcentajes de la encuesta van como "3 de cada 4", que se entiende más rápido; el redondeo nunca infla el dato
// (74 % → 3 de cada 4, 47 % → casi la mitad, 41 % → 4 de cada 10) y los valores exactos quedan en la fuente.
const LADOS = {
  vecinos: {
    titulo: "Los vecinos",
    datos: [
      { cifra: "3 de cada 4", texto: "se enteraron tarde de algo importante del edificio: una obra, un corte, un aumento." },
      { cifra: "Casi la mitad", texto: "tuvo que preguntar, cada vez, cómo iba su propio reclamo." },
      { cifra: "4 de cada 10", texto: "tienen poca o ninguna confianza en cómo se administra la plata." },
    ],
    fuente: "Encuesta a 86 vecinos de Capital y Gran Buenos Aires, septiembre de 2026 (74 %, 47 % y 41 %).",
    cita: "Que el recibo de las expensas sea un choclo y no poder entender nada.",
    autorCita: "Un vecino, en la encuesta",
    conteo: "Lo preguntan una vez.",
    invitacion: "Ver cómo lo viven los vecinos",
  },
  administraciones: {
    titulo: "La administración",
    datos: [
      { cifra: "24 edificios", texto: "que se liquidan todos juntos, en la última semana del mes." },
      { cifra: "6 herramientas", texto: "que no se hablan entre sí: un sistema para liquidar, tres casillas de mail, WhatsApp y Excel." },
      { cifra: "1 Excel", texto: "para seis personas, que esperan turno para usarlo." },
    ],
    fuente: "Entrevista en profundidad a un administrador matriculado, septiembre de 2026.",
    cita: "Como todo es Excel, no se pueden sincronizar los archivos en vivo. Tenemos que esperar a terminar uno, pasárselo, y recién ahí seguir.",
    autorCita: "El administrador entrevistado",
    conteo: "Lo contesta veinte veces por día.",
    invitacion: "Ver cómo lo vive la administración",
  },
};

// Cada tarjeta termina con su escena sobre un piso de trama.
// La tarjeta del otro lado invita a cambiar de perfil: se puede tocar entera, y al pasar el mouse se levanta y repite su escena.
function Lado({ id, lado, esOtroLado, alVerElOtroLado }) {
  const [vuelta, setVuelta] = useState(0);

  return (
    <div
      onMouseEnter={() => esOtroLado && setVuelta(vuelta + 1)}
      className="relative flex min-w-0 flex-col gap-6 bg-superficie-elevada p-[clamp(1.6rem,3vw,2.5rem)] corte-26 transition-transform duration-300 has-[[data-invita]:hover]:-translate-y-1 has-[[data-invita]:focus-visible]:shadow-[inset_0_0_0_2px_var(--foco)]"
    >
      <TramaPiso />
      {/* "Tu lado" marca el lado del perfil que se está viendo */}
      <span
        data-solo={id}
        className="absolute top-[clamp(1.6rem,3vw,2.5rem)] right-[clamp(1.6rem,3vw,2.5rem)] bg-superficie-zona px-2.5 py-0.5 text-[0.78rem] font-semibold"
      >
        Tu lado
      </span>
      <h3 className="font-titulo text-[1.45rem] font-bold">{lado.titulo}</h3>

      {/* Cada lado lleva la fuente de sus datos justo debajo */}
      <div>
        <ul className="border-t border-borde-suave">
          {lado.datos.map((dato) => (
            <li key={dato.cifra} className="border-b border-borde-suave py-3.5">
              <p className="font-titulo text-[1.5rem] leading-tight font-bold tracking-[-0.01em]">{dato.cifra}</p>
              <p className="mt-1 text-texto-secundario">{dato.texto}</p>
            </li>
          ))}
        </ul>
        <p className="mt-2.5 text-[0.82rem] text-texto-secundario">{lado.fuente}</p>
      </div>

      <blockquote className="max-w-[30rem]">
        <p className="-indent-[0.42em] font-titulo text-[1.1rem] leading-[1.42] font-semibold">“{lado.cita}”</p>
        <footer className="mt-2 text-[0.88rem] text-texto-secundario">{lado.autorCita}</footer>
      </blockquote>

      <div className="mt-auto">
        <EscenaProblema key={vuelta} lado={id} />
      </div>
      <p className="-mt-2 font-titulo text-xl leading-[1.3] font-semibold">{lado.conteo}</p>

      {/* Se ve solo en la tarjeta del otro lado (en la propia queda invisible, así las dos miden lo mismo).
          El ::after estira el botón a toda la tarjeta. */}
      <button
        type="button"
        data-invita={id}
        onClick={alVerElOtroLado}
        className={`${CLASES_ENLACE} -mt-3 self-start after:absolute after:inset-0 focus-visible:outline-none`}
      >
        {lado.invitacion}
      </button>
    </div>
  );
}

// El mismo problema visto de los dos lados, con lo que encontramos en la investigación:
// el vecino pregunta una vez, la administración contesta veinte.
export default function Problema({ perfil, alVerElOtroLado }) {
  return (
    <section aria-labelledby="titulo-problema" className="espacio-seccion bg-superficie-zona">
      <div className="contenedor">
        {/* En escritorio: el título en dos renglones y, a su derecha, el subtítulo alineado con el último renglón */}
        <div className="grid grid-cols-1 gap-x-10 gap-y-4.5 lg:grid-cols-[auto_minmax(0,20rem)] lg:items-end lg:justify-between">
          <h2
            id="titulo-problema"
            className="max-w-[19ch] font-titulo text-titulo-seccion font-bold tracking-[-0.022em] text-balance escritorio:max-w-none"
          >
            <span className="escritorio:block">La información ya existe.</span>{" "}
            <span className="escritorio:block">El problema es que no circula.</span>
          </h2>
          <p className="max-w-xl text-[1.08rem] text-texto-secundario lg:pb-1">
            Le preguntamos a 86 vecinos y entrevistamos a un administrador con 24 edificios. Los dos sufren lo mismo.
          </p>
        </div>

        <div className="mt-[clamp(2.5rem,4vw,3.5rem)] grid grid-cols-1 gap-[clamp(0.75rem,1.6vw,1.25rem)] md:grid-cols-2">
          {Object.entries(LADOS).map(([id, lado]) => (
            <Lado key={id} id={id} lado={lado} esOtroLado={perfil !== id} alVerElOtroLado={alVerElOtroLado} />
          ))}
        </div>

        {/* La frase que cierra el problema y abre la solución. En escritorio, un renglón por oración. */}
        <p className="mt-[clamp(2.5rem,4vw,3.5rem)] font-titulo text-[clamp(1.2rem,1.8vw,1.4rem)] leading-[1.4] font-semibold text-balance">
          <span className="lg:block">habitando no inventa información nueva.</span>{" "}
          <span className="lg:block">Muestra la que la administración ya tiene a quien la necesita, cuando la necesita.</span>
        </p>
      </div>
    </section>
  );
}
