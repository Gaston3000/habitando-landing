"use client";

import { useState } from "react";
import Isologo from "@/componentes/Isologo";
import { CLASES_ENLACE } from "@/lib/clases";

// Las dudas que frenan a alguien antes de decidirse, para cada perfil.
// Las respuestas dicen solo lo que la app ya hace: el precio todavía no está definido.
const PREGUNTAS = {
  vecinos: [
    {
      pregunta: "¿Tengo que pagar algo?",
      respuesta: "No. Habitando lo contrata la administración y para los vecinos es gratis.",
    },
    {
      pregunta: "¿Y si mi administración no lo usa?",
      respuesta:
        "Mandale el mensaje que te dejamos acá abajo. Si lo suma, te pasa el código del edificio y con eso te sumás a tu unidad.",
    },
    {
      pregunta: "¿Tengo que instalar algo?",
      respuesta: "No. Es una página web: entrás desde el celular o la compu con tu mail.",
    },
    {
      pregunta: "¿Quién ve mis datos?",
      respuesta:
        "Vos y tu administración. El resto del edificio solo puede ver si una unidad está al día, como pide la ley; tus datos personales, no.",
    },
    {
      pregunta: "¿Cambia la forma de pagar?",
      respuesta:
        "No. Pagás como siempre y después informás el pago desde tu unidad, con el comprobante si lo tenés. La administración lo ve y lo confirma.",
    },
  ],
  administraciones: [
    {
      pregunta: "¿Cuánto cuesta?",
      respuesta: "Es un abono mensual por cada unidad funcional que administrás. Para los vecinos es gratis.",
    },
    {
      pregunta: "¿Cómo empiezo si hoy trabajo con Excel?",
      respuesta:
        "Cargás cada edificio con sus unidades y el porcentaje de cada una. Desde ese mes, los gastos se cargan en Habitando y la expensa se arma sola.",
    },
    {
      pregunta: "¿Los vecinos tienen que instalar algo?",
      respuesta: "No. Es una página web: cada vecino entra con su mail desde el celular o la compu.",
    },
    {
      pregunta: "¿Quién ve la información de cada edificio?",
      respuesta:
        "Cada consorcio tiene sus datos separados: ningún edificio ve los de otro. Y cada vecino ve solamente su unidad.",
    },
    {
      pregunta: "¿Qué pasa si me equivoco en un gasto?",
      respuesta:
        "Mientras el mes está abierto, lo corregís o lo borrás. Cuando cerrás el mes, la liquidación queda fija y los vecinos la ven.",
    },
  ],
};

// Para quien le quedó una duda: lo lleva a la acción de la banda final. La pregunta va en un renglón y la salida, en otro.
const SALIDAS = {
  vecinos: (
    <>
      <a href="#accion" className={CLASES_ENLACE}>
        Preguntásela a tu administración
      </a>{" "}
      acá abajo.
    </>
  ),
  administraciones: (
    <>
      Te la respondemos en la demo.{" "}
      <a href="#accion" className={CLASES_ENLACE}>
        Pedí una demo
      </a>
    </>
  ),
};

// Portero eléctrico del edificio, con un timbre por pregunta: se enciende el de la pregunta abierta
// y tocar un timbre abre su pregunta. Es un atajo para el mouse: con teclado y lector de pantalla
// se usan las preguntas, por eso los timbres no reciben foco.
function Portero({ cantidad, abierta, alTocar }) {
  return (
    <div aria-hidden="true" className="portero hidden w-60 bg-torre px-7 pt-12 pb-8 text-torre-texto corte-48 escritorio:block">
      <Isologo className="h-5" />
      <div className="parlante mt-6 h-16" />
      <div className="mt-7 grid gap-3">
        {Array.from({ length: cantidad }, (_, indice) => (
          <button
            key={indice}
            type="button"
            tabIndex={-1}
            onClick={() => alTocar(indice)}
            data-encendido={abierta === indice}
            className="timbre flex w-full cursor-pointer items-center gap-3"
          >
            <span className="timbre-boton size-4.5 shrink-0 rounded-full" />
            <span className="timbre-etiqueta h-2.5 flex-1 rounded-sm" />
          </button>
        ))}
      </div>
    </div>
  );
}

// Las preguntas de un perfil, con su portero. Se abre una sola a la vez.
function Preguntas({ id, preguntas }) {
  const [abierta, setAbierta] = useState(null);

  function alCambiar(evento, indice) {
    if (evento.currentTarget.open) setAbierta(indice);
    else if (abierta === indice) setAbierta(null);
  }

  return (
    <div
      data-solo={id}
      className="mt-[clamp(2.5rem,4vw,3.5rem)] grid grid-cols-1 gap-x-[clamp(2rem,6vw,6rem)] gap-y-8 escritorio:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] escritorio:grid-rows-[auto_1fr]"
    >
      <Portero cantidad={preguntas.length} abierta={abierta} alTocar={setAbierta} />

      <div className="border-t border-borde-suave escritorio:col-start-2 escritorio:row-span-2 escritorio:row-start-1">
        {preguntas.map((item, indice) => (
          // Todas llevan el mismo "name": el navegador cierra la abierta cuando se abre otra
          <details
            key={item.pregunta}
            name={`preguntas-${id}`}
            open={abierta === indice}
            onToggle={(evento) => alCambiar(evento, indice)}
            className="pregunta group border-b border-borde-suave px-5 corte-20 transition-colors duration-300 open:border-transparent open:bg-superficie-elevada"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[1.15rem] leading-snug font-semibold [&::-webkit-details-marker]:hidden">
              {item.pregunta}
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="size-5 shrink-0 text-texto-secundario transition-transform duration-300 group-open:rotate-45"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </summary>
            <p className="max-w-[60ch] pr-10 pb-6 text-texto-secundario">{item.respuesta}</p>
          </details>
        ))}
      </div>

      <p className="text-[1.05rem] escritorio:col-start-1 escritorio:row-start-2 escritorio:self-end">
        <span className="block">¿Te quedó otra duda?</span>
        <span className="block">{SALIDAS[id]}</span>
      </p>
    </div>
  );
}

export default function PreguntasFrecuentes() {
  return (
    <section aria-labelledby="titulo-preguntas" className="espacio-seccion">
      <div className="contenedor">
        <h2 id="titulo-preguntas" className="font-titulo text-titulo-seccion font-bold tracking-[-0.022em] text-balance">
          Preguntas frecuentes
        </h2>
        {Object.entries(PREGUNTAS).map(([id, preguntas]) => (
          <Preguntas key={id} id={id} preguntas={preguntas} />
        ))}
      </div>
    </section>
  );
}
