import { useId } from "react";
import Sala from "@/componentes/Sala";
import { ALTO_MODULO, ANCHO_MODULO, SALAS } from "@/lib/trama";

// Opacidad y tonos de cada versión de la trama (los define tema.css)
const VARIANTES = {
  clara: { opacidad: "[opacity:var(--trama-clara-opacidad)]", tono: "trama-piso" },
  oscura: { opacidad: "[opacity:var(--trama-oscura-opacidad)]", tono: "trama-oscura" },
};

// Franja de trama en la parte de abajo de una tarjeta, que se desvanece hacia arriba.
// "oscura" es para fondos marinos (como las torres de los pasos).
// Va detrás del contenido (-z-10): la tarjeta tiene que ser "relative" y armar su propia capa (el corte de 30° ya lo hace).
export default function TramaPiso({ variante = "clara" }) {
  const { opacidad, tono } = VARIANTES[variante];
  // El id del patrón tiene que ser único en la página (hay una trama por tarjeta) y servir dentro de url(#...)
  const idPatron = `trama-piso-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[55%] w-full [mask-image:linear-gradient(to_top,#000_10%,transparent)] ${opacidad}`}
    >
      <defs>
        <pattern
          id={idPatron}
          width={ANCHO_MODULO}
          height={ALTO_MODULO}
          patternUnits="userSpaceOnUse"
          patternTransform="scale(.55)"
        >
          {SALAS.map((sala, indice) => (
            <Sala key={indice} sala={sala} className={`${tono}-${sala.tono}`} />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${idPatron})`} />
    </svg>
  );
}
