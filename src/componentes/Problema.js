import { CLASES_ENLACE } from "@/lib/clases";

const CLASES_GLOBO =
  "absolute bottom-0 left-0 rounded-[6px_20px_20px_20px] px-4 py-2.75 font-semibold whitespace-nowrap";

// Cuántas veces se apila la misma pregunta del lado de la administración
const PREGUNTAS_APILADAS = 6;

// Cada lado con lo que encontramos en la investigación: la encuesta a vecinos y la entrevista al administrador.
const LADOS = {
  vecinos: {
    titulo: "Los vecinos",
    datos: [
      { cifra: "74", porcentaje: true, texto: "se enteró tarde de algo importante del edificio: una obra, un corte, un aumento." },
      { cifra: "47", porcentaje: true, texto: "tuvo que preguntar, cada vez, cómo iba su propio reclamo." },
      { cifra: "41", porcentaje: true, texto: "tiene poca o ninguna confianza en cómo se administra la plata." },
    ],
    cita: "Que el recibo de las expensas sea un choclo y no poder entender nada.",
    autorCita: "Un vecino, en la encuesta",
    conteo: "Lo preguntan una vez.",
  },
  administraciones: {
    titulo: "La administración",
    datos: [
      { cifra: "24", texto: "edificios que se liquidan todos juntos, en la última semana del mes." },
      { cifra: "6", texto: "herramientas que no se hablan entre sí: un sistema para liquidar, tres casillas de mail, WhatsApp y Excel." },
      { cifra: "1", texto: "Excel para seis personas, que esperan turno para usarlo." },
    ],
    cita: "Como todo es Excel, no se pueden sincronizar los archivos en vivo. Tenemos que esperar a terminar uno, pasárselo, y recién ahí seguir.",
    autorCita: "El administrador entrevistado",
    conteo: "Lo contesta veinte veces por día.",
  },
};

function Lado({ id, lado, children }) {
  return (
    <div className="relative flex min-w-0 flex-col gap-6 bg-superficie-elevada p-[clamp(1.6rem,3vw,2.5rem)] corte-26">
      {/* "Tu lado" marca el lado del perfil que se está viendo */}
      <span
        data-solo={id}
        className="absolute top-[clamp(1.6rem,3vw,2.5rem)] right-[clamp(1.6rem,3vw,2.5rem)] bg-superficie-zona px-2.5 py-0.5 text-[0.78rem] font-semibold"
      >
        Tu lado
      </span>
      <h3 className="font-titulo text-[1.45rem] font-bold">{lado.titulo}</h3>

      <ul className="border-t border-borde-suave">
        {lado.datos.map((dato) => (
          <li
            key={dato.cifra}
            className="grid grid-cols-[4.4rem_minmax(0,1fr)] items-baseline gap-x-4 border-b border-borde-suave py-3.5"
          >
            <p className="font-titulo text-[2rem] leading-none font-bold tracking-[-0.02em] whitespace-nowrap tabular-nums">
              {dato.cifra}
              {dato.porcentaje && <small className="text-[0.5em] tracking-normal">%</small>}
            </p>
            <p className="text-texto-secundario">{dato.texto}</p>
          </li>
        ))}
      </ul>

      <blockquote className="max-w-[30rem]">
        <p className="-indent-[0.42em] font-titulo text-[1.1rem] leading-[1.42] font-semibold">“{lado.cita}”</p>
        <footer className="mt-2 text-[0.88rem] text-texto-secundario">{lado.autorCita}</footer>
      </blockquote>

      <div className="relative mt-auto h-32">{children}</div>
      <p className="-mt-2 font-titulo text-xl leading-[1.3] font-semibold">{lado.conteo}</p>
    </div>
  );
}

// El mismo problema visto de los dos lados, con lo que encontramos en la investigación:
// el vecino pregunta una vez, la administración contesta veinte.
export default function Problema({ alVerElOtroLado }) {
  const pila = Array.from({ length: PREGUNTAS_APILADAS }, (_, indice) => PREGUNTAS_APILADAS - 1 - indice);

  return (
    <section aria-labelledby="titulo-problema" className="espacio-seccion bg-superficie-zona">
      <div className="contenedor">
        <h2
          id="titulo-problema"
          className="max-w-[19ch] font-titulo text-titulo-seccion font-bold tracking-[-0.022em] text-balance"
        >
          La información ya existe. El problema es que no circula.
        </h2>
        <p className="mt-4.5 max-w-xl text-[1.08rem] text-texto-secundario">
          Le preguntamos a 86 vecinos cómo funciona su edificio y entrevistamos a un administrador con 24 edificios a
          cargo. Los dos sufren el mismo problema.
        </p>

        <div className="mt-[clamp(2.5rem,4vw,3.5rem)] grid grid-cols-1 gap-[clamp(0.75rem,1.6vw,1.25rem)] md:grid-cols-2">
          <Lado id="vecinos" lado={LADOS.vecinos}>
            <p className={`${CLASES_GLOBO} bg-superficie-zona`}>¿Ya salieron las expensas?</p>
          </Lado>

          <Lado id="administraciones" lado={LADOS.administraciones}>
            {/* Las de atrás quedan solo como borde: se lee la de adelante */}
            <div aria-hidden="true">
              {pila.map((orden) => (
                <p
                  key={orden}
                  style={{ "--orden": orden }}
                  className={`${CLASES_GLOBO} globo-pila shadow-[0_0_0_1px_var(--borde-fuerte)] ${
                    orden === 0 ? "bg-superficie-elevada" : "bg-superficie-zona text-transparent"
                  }`}
                >
                  ¿Ya salieron las expensas?
                </p>
              ))}
            </div>
          </Lado>
        </div>

        <div className="mt-[clamp(2rem,3vw,2.75rem)] flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
          <p className="max-w-[38rem] text-[1.08rem]">
            Habitando no inventa información nueva. Muestra la que la administración ya tiene a quien la necesita,
            cuando la necesita.
          </p>
          <button type="button" onClick={alVerElOtroLado} className={CLASES_ENLACE}>
            <span data-solo="vecinos">Ver cómo lo vive la administración</span>
            <span data-solo="administraciones">Ver cómo lo viven los vecinos</span>
          </button>
        </div>

        <p className="mt-8 text-[0.85rem] text-texto-secundario">
          Encuesta propia a vecinos de edificios de Capital y Gran Buenos Aires (86 respuestas) y entrevista en
          profundidad a un administrador matriculado, septiembre de 2026.
        </p>
      </div>
    </section>
  );
}
