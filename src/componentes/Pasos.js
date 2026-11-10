"use client";

import TramaPiso from "@/componentes/TramaPiso";
import { useAparecerEnPantalla } from "@/lib/aparecer";

const PASOS = {
  vecinos: {
    titulo: "Así llega Habitando a tu edificio.",
    pasos: [
      { titulo: "Le contás a tu administración", texto: "Con el mensaje que te dejamos acá abajo." },
      { titulo: "La administración carga el edificio", texto: "Y te pasa el código del edificio." },
      { titulo: "Te sumás con el código", texto: "Elegís tu unidad y ves tu expensa, tus pagos y tus arreglos desde el primer día." },
    ],
  },
  administraciones: {
    titulo: "Empezás en tres pasos.",
    pasos: [
      { titulo: "Cargás el edificio", texto: "Con sus unidades y el porcentaje de cada una." },
      { titulo: "Compartís el código del edificio", texto: "Cada vecino se suma con el código o el QR y ve solamente su unidad." },
      { titulo: "Cerrás el primer mes", texto: "Cargás los gastos, revisás la liquidación y la publicás." },
    ],
  },
};

// Alto de cada torre en escritorio y ancho de cada barra en el celular: cada paso es más grande que el anterior.
const TAMANOS = [
  "md:h-[clamp(17rem,24vw,19rem)] max-md:w-[78%]",
  "md:h-[clamp(20.5rem,29vw,23rem)] max-md:w-[89%]",
  "md:h-[clamp(24rem,34vw,27rem)] max-md:w-full",
];

// Cada paso es una torre con el techo cortado a 30°, como las del logo, y cada una más alta que la anterior:
// el edificio crece con Habitando. En escritorio, la sección termina en la base de las torres:
// el fondo de la sección siguiente es el piso. Al aparecer en pantalla, suben desde el piso una sola vez.
// En el celular, las torres se acuestan y salen de una línea a la izquierda.
function Torres({ pasos }) {
  const [refTorres, estado] = useAparecerEnPantalla(0.3);

  return (
    <ol
      ref={refTorres}
      data-estado={estado}
      className="torres mt-[clamp(2.5rem,4vw,3.5rem)] grid gap-3 overflow-hidden border-torre max-md:border-l-2 md:grid-cols-3 md:items-end md:gap-[clamp(0.75rem,2vw,1.5rem)]"
    >
      {pasos.map((paso, indice) => (
        <li
          key={paso.titulo}
          style={{ "--demora": `${indice * 130}ms` }}
          className={`torre relative flex flex-col bg-torre px-6 pt-11 pb-6 text-torre-texto corte-56 ${TAMANOS[indice]}`}
        >
          <TramaPiso variante="oscura" />
          <p className="font-titulo text-[2.4rem] leading-none font-bold text-torre-texto-secundario">{indice + 1}</p>
          <h3 className="mt-4 font-titulo text-[1.25rem] leading-[1.2] font-bold text-balance">{paso.titulo}</h3>
          <p className="mt-2 text-torre-texto-secundario">{paso.texto}</p>
        </li>
      ))}
    </ol>
  );
}

// Cómo se empieza a usar, en tres pasos. Es la única sección sobre el celeste de la marca:
// corta el ritmo de la página justo antes de las preguntas y la acción.
export default function Pasos() {
  return (
    <section aria-label="Cómo empezar" className="espacio-seccion bg-superficie-pasos text-texto-pasos md:pb-0">
      <div className="contenedor">
        {Object.entries(PASOS).map(([id, contenido]) => (
          <div key={id} data-solo={id}>
            <h2 className="font-titulo text-titulo-seccion font-bold tracking-[-0.022em] text-balance">{contenido.titulo}</h2>
            <Torres pasos={contenido.pasos} />
          </div>
        ))}
      </div>
    </section>
  );
}
