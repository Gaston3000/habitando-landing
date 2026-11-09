import ChipEstado from "@/componentes/ChipEstado";
import Icono from "@/componentes/Icono";

// Lugar y color de cada bloque. La grilla sale del recurso "bloques de reparto" (16 x 10):
// en pantallas grandes cada bloque ocupa su lugar del dibujo; más chico, se apilan de a dos o de a uno.
const BLOQUES = [
  {
    lugar: "corte-34 sm:col-span-2 lg:col-start-1 lg:col-end-7 lg:row-start-1 lg:row-end-5",
    color: "bg-bloque-fuerte text-bloque-fuerte-texto",
    destacado: true,
  },
  { lugar: "lg:col-start-7 lg:col-end-11 lg:row-start-1 lg:row-end-5", color: "bg-bloque-claro" },
  {
    lugar: "sm:col-span-2 lg:col-start-11 lg:col-end-17 lg:row-start-1 lg:row-end-7",
    color: "bg-superficie-elevada inset-ring inset-ring-borde-suave",
  },
  { lugar: "lg:col-start-1 lg:col-end-5 lg:row-start-5 lg:row-end-11", color: "bg-bloque-medio text-bloque-medio-texto" },
  { lugar: "lg:col-start-5 lg:col-end-11 lg:row-start-5 lg:row-end-8", color: "bg-bloque-suave", corto: true },
  { lugar: "lg:col-start-5 lg:col-end-11 lg:row-start-8 lg:row-end-11", color: "bg-bloque-suave", corto: true },
  { lugar: "lg:col-start-11 lg:col-end-14 lg:row-start-7 lg:row-end-11", color: "bg-bloque-celeste text-bloque-celeste-texto" },
  { lugar: "lg:col-start-14 lg:col-end-17 lg:row-start-7 lg:row-end-11", color: "bg-bloque-celeste text-bloque-celeste-texto" },
];

const ESTADOS_RECLAMO = [
  { paso: "hecho", texto: "Pendiente", fecha: "mar 27/10" },
  { paso: "actual", texto: "En curso: el plomero va el lunes", fecha: "jue 29/10" },
  { paso: "falta", texto: "Resuelto", fecha: "" },
];

const UNIDADES = [
  { unidad: "UF 1 · PB A", deuda: "", estado: { tipo: "exito", texto: "Al día" } },
  { unidad: "UF 2 · 1º A", deuda: "$ 61.200", estado: { tipo: "atencion", texto: "Pendiente" } },
  { unidad: "UF 7 · 3º B", deuda: "", estado: { tipo: "exito", texto: "Al día" } },
  { unidad: "UF 9 · 4º A", deuda: "$ 129.900", estado: { tipo: "peligro", texto: "Vencido" } },
];

function LineaReclamo() {
  return (
    <div className="mt-4.5 border-t border-borde-suave pt-4 text-[0.88rem]">
      <p className="mb-3 text-[0.95rem] font-semibold">Filtración en el palier del 3º</p>
      <ol className="grid gap-2.5">
        {ESTADOS_RECLAMO.map((estado) => (
          <li
            key={estado.texto}
            data-paso={estado.paso}
            className="linea-estado grid grid-cols-[16px_1fr_auto] items-center gap-2.5 text-texto-secundario data-[paso=actual]:font-semibold data-[paso=actual]:text-texto-principal"
          >
            <span>{estado.texto}</span>
            <time className="text-[0.8rem] font-normal text-texto-secundario tabular-nums">{estado.fecha}</time>
          </li>
        ))}
      </ol>
    </div>
  );
}

function TablaUnidades() {
  return (
    <div className="mt-4.5 border-t border-borde-suave pt-4">
      <table className="w-full border-collapse text-[0.86rem]">
        <caption className="sr-only">Estado de cuenta de algunas unidades</caption>
        <tbody>
          {UNIDADES.map((fila) => (
            <tr key={fila.unidad} className="border-t border-borde-suave first:border-t-0">
              <th scope="row" className="py-1.75 text-left font-medium whitespace-nowrap">
                {fila.unidad}
              </th>
              <td className="py-1.75 pl-2.5 text-right whitespace-nowrap tabular-nums">{fila.deuda}</td>
              <td className="py-1.75 pl-2.5 text-right">
                <ChipEstado tipo={fila.estado.tipo} texto={fila.estado.texto} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const FUNCIONES = {
  vecinos: {
    titulo: "Lo de tu edificio, a la vista.",
    bloques: [
      { icono: "expensas", titulo: "Tu expensa, explicada", texto: "Cada gasto del mes con su factura. Si sube, ves por qué." },
      { icono: "avisos", titulo: "Avisos a tiempo", texto: "Cortes, obras y asambleas te llegan al celular antes de que pasen." },
      {
        icono: "reclamos",
        titulo: "Arreglos con estado",
        texto: "Pedís el arreglo con una foto y seguís cada paso sin tener que volver a preguntar.",
        detalle: <LineaReclamo />,
      },
      {
        icono: "pagos",
        titulo: "Pagás e informás el pago",
        texto: "Transferís como siempre e informás el pago desde tu unidad, con el comprobante. La administración lo confirma y te ahorrás el mail.",
      },
      { icono: "unidad", titulo: "Tu historial y tu saldo", texto: "Todas tus expensas y pagos anteriores, con el saldo al día." },
      { icono: "documentos", titulo: "Los papeles del edificio", texto: "Facturas, actas y reglamento, siempre a mano." },
      { icono: "edificio", titulo: "Sin instalar nada", texto: "Es una web. Entrás desde el celular o la compu." },
      {
        icono: "vecinos",
        titulo: "Tus datos, cuidados",
        texto: "Se ve si una unidad está al día, como pide la ley. Tus datos personales, no.",
      },
    ],
  },
  administraciones: {
    titulo: "Lo que hoy está en seis lugares, en uno solo.",
    bloques: [
      {
        icono: "expensas",
        titulo: "Liquidación automática",
        texto: "Cargás los gastos con su comprobante y el sistema prorratea por unidad, arrastra saldos y calcula intereses.",
      },
      { icono: "avisos", titulo: "Un aviso, todo el edificio", texto: "Lo escribís una vez y le llega a cada unidad." },
      {
        icono: "pagos",
        titulo: "Pagos y estado de cuenta",
        texto: "Registrás cada pago y ves qué unidades están al día, pendientes o vencidas.",
        detalle: <TablaUnidades />,
      },
      {
        icono: "documentos",
        titulo: "Pagos informados en un solo lugar",
        texto: "El vecino informa su pago con el comprobante y vos lo confirmás. Se terminó buscarlo en tres casillas de mail.",
      },
      { icono: "vecinos", titulo: "Todo el equipo a la vez", texto: "Varias personas trabajan sobre los mismos datos, sin esperar turno." },
      {
        icono: "reclamos",
        titulo: "Arreglos ordenados",
        texto: "Cada uno con su foto, su estado y su historial. El vecino sigue el avance solo.",
      },
      { icono: "edificio", titulo: "Todos tus edificios", texto: "Cada consorcio con sus unidades y sus porcentajes." },
      {
        icono: "unidad",
        titulo: "Propietario e inquilino",
        texto: "Lo del inquilino cubre primero las ordinarias; lo del propietario, las extraordinarias.",
      },
    ],
  },
};

// Qué hace Habitando, en la grilla de bloques de reparto.
export default function Funciones() {
  return (
    <section id="funciones" aria-label="Qué hace Habitando" className="espacio-seccion">
      <div className="contenedor">
        {Object.entries(FUNCIONES).map(([id, funciones]) => (
          <div key={id} data-solo={id}>
            <h2 className="max-w-[19ch] font-titulo text-titulo-seccion font-bold tracking-[-0.022em] text-balance">
              {funciones.titulo}
            </h2>
            <div className="mt-[clamp(2.5rem,4vw,3.5rem)] grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-16 lg:grid-rows-[repeat(10,minmax(54px,auto))]">
              {funciones.bloques.map((bloque, indice) => {
                const { lugar, color, destacado, corto } = BLOQUES[indice];
                return (
                  <article key={bloque.titulo} className={`flex min-w-0 flex-col gap-2.25 px-6 pt-6 pb-6.5 ${lugar} ${color}`}>
                    <Icono nombre={bloque.icono} className={`box-content size-7.5 pb-3.5 ${corto ? "" : "lg:mb-auto"}`} />
                    <h3
                      className={`font-titulo leading-[1.2] font-bold ${
                        destacado ? "text-[clamp(1.4rem,2.1vw,1.75rem)]" : "text-[1.22rem]"
                      }`}
                    >
                      {bloque.titulo}
                    </h3>
                    <p className="text-[0.97rem] leading-[1.55]">{bloque.texto}</p>
                    {bloque.detalle}
                  </article>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
