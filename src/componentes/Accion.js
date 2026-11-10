import FormularioDemo from "@/componentes/FormularioDemo";
import FormularioMensaje from "@/componentes/FormularioMensaje";
import Sala from "@/componentes/Sala";
import { ALTO_MODULO, ANCHO_MODULO, SALAS } from "@/lib/trama";

// El formulario es una sala más de la planta: blanco, con el corte de 30°, un borde fino y una sombra suave.
const CLASES_FORMULARIO =
  "grid min-w-0 gap-4.5 bg-superficie-elevada p-[clamp(1.5rem,3vw,2.25rem)] text-texto-principal corte-26 shadow-[0_0_0_1px_var(--borde-suave),0_28px_56px_-28px_var(--sombra)]";

// La trama clara del manual (ambientes celestes sobre blanco). Detrás del texto se apaga un poco, para que se lea.
function TramaClara() {
  return (
    <svg aria-hidden="true" className="absolute inset-0 block size-full">
      <defs>
        <pattern
          id="trama-clara"
          width={ANCHO_MODULO}
          height={ALTO_MODULO}
          patternUnits="userSpaceOnUse"
          patternTransform="scale(.8)"
        >
          {SALAS.map((sala, indice) => (
            <Sala key={indice} sala={sala} className={`trama-piso-${sala.tono}`} />
          ))}
        </pattern>
        <linearGradient id="banda-desvanecer" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity=".45" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".75" />
          <stop offset="1" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id="banda-mascara">
          <rect width="100%" height="100%" fill="url(#banda-desvanecer)" />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="url(#trama-clara)" mask="url(#banda-mascara)" />
    </svg>
  );
}

function Llamado({ titulo, texto }) {
  return (
    <div>
      <h2 className="max-w-[14ch] font-titulo text-titulo-banda font-bold tracking-[-0.022em] text-balance">{titulo}</h2>
      <p className="mt-4.5 max-w-xl text-[1.08rem] text-texto-secundario">{texto}</p>
    </div>
  );
}

const CLASES_GRILLA =
  "contenedor relative grid grid-cols-1 items-center gap-[clamp(2.5rem,5vw,5rem)] py-[clamp(4.5rem,9vw,7.5rem)] escritorio:grid-cols-2";

// Banda final con la acción de cada perfil: el vecino le escribe a su administración;
// la administración pide una demo. Va sobre la trama clara y siempre en tema claro (ver .siempre-claro en landing.css):
// es el único momento blanco de la página, así el final se siente como un final.
export default function Accion() {
  return (
    <section id="accion" aria-label="Empezar" className="siempre-claro relative overflow-hidden bg-superficie-elevada text-texto-principal">
      <TramaClara />

      <div data-solo="vecinos" className={CLASES_GRILLA}>
        <Llamado
          titulo="Contale a tu administración."
          texto="Habitando lo contrata la administración, así que el primer paso lo das vos. Te dejamos el mensaje escrito: completá tu unidad, copialo y mandalo."
        />
        <FormularioMensaje className={CLASES_FORMULARIO} />
      </div>

      <div data-solo="administraciones" className={CLASES_GRILLA}>
        <Llamado
          titulo="Probalo con uno de tus edificios."
          texto="Contanos cuántas unidades administrás y te mostramos Habitando funcionando con un edificio tuyo."
        />
        <FormularioDemo className={CLASES_FORMULARIO} />
      </div>
    </section>
  );
}
