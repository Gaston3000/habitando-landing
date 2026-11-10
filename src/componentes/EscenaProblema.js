"use client";

import { useAparecerEnPantalla } from "@/lib/aparecer";

const CLASES_GLOBO = "rounded-[6px_20px_20px_20px] px-4 py-2.75 font-semibold whitespace-nowrap";

// Cuántas veces se apila la misma pregunta del lado de la administración
const PREGUNTAS_APILADAS = 6;

// El vecino pregunta, la administración la ve y empieza a escribir… pero la respuesta no llega.
function PreguntaSinRespuesta() {
  return (
    <div className="absolute bottom-0 left-0 flex flex-col items-start gap-1.5">
      <p className={`aparece ${CLASES_GLOBO} bg-superficie-zona`}>¿Ya salieron las expensas?</p>
      <p className="aparece flex items-center gap-1.5 pl-1 text-[0.8rem] text-texto-secundario" style={{ "--demora": "450ms" }}>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4"
        >
          <path d="M2 13l4 4L15 8M10 15.5l1.5 1.5L22 8" />
        </svg>
        Visto 21:14
      </p>
      {/* "escribiendo…": aparece y se apaga. Al final de la escena no queda nada: la respuesta no llegó. */}
      <span className="escribiendo mt-1 inline-flex gap-1 rounded-[6px_16px_16px_16px] bg-superficie-zona px-3.5 py-2.5">
        <span className="size-1.5 rounded-full bg-texto-secundario" />
        <span className="size-1.5 rounded-full bg-texto-secundario" />
        <span className="size-1.5 rounded-full bg-texto-secundario" />
      </span>
    </div>
  );
}

// La misma pregunta, una y otra vez: se apilan de atrás para adelante. Las de atrás quedan solo como borde.
function PilaDePreguntas() {
  const pila = Array.from({ length: PREGUNTAS_APILADAS }, (_, indice) => PREGUNTAS_APILADAS - 1 - indice);

  return (
    <div className="absolute bottom-0 left-0 h-full w-full">
      {pila.map((orden) => (
        <p
          key={orden}
          style={{ "--orden": orden, "--demora": `${(PREGUNTAS_APILADAS - 1 - orden) * 110}ms` }}
          className={`aparece globo-pila absolute bottom-0 left-0 shadow-[0_0_0_1px_var(--borde-fuerte)] ${CLASES_GLOBO} ${
            orden === 0 ? "bg-superficie-elevada" : "bg-superficie-zona text-transparent"
          }`}
        >
          ¿Ya salieron las expensas?
        </p>
      ))}
    </div>
  );
}

// El dibujo del final de cada tarjeta del problema. Se anima una sola vez, cuando aparece en pantalla.
// Para repetirla, quien la usa la vuelve a montar con otra "key".
// Con movimiento reducido se muestra directo como termina.
export default function EscenaProblema({ lado }) {
  const [refEscena, estado] = useAparecerEnPantalla();

  return (
    <div ref={refEscena} data-estado={estado} aria-hidden="true" className="escena-problema relative h-32">
      {lado === "vecinos" ? <PreguntaSinRespuesta /> : <PilaDePreguntas />}
    </div>
  );
}
