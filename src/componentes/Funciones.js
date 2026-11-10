import ChipEstado from "@/componentes/ChipEstado";
import Icono from "@/componentes/Icono";

// Lugar y color de cada bloque, sobre la grilla de los bloques de reparto (16 columnas).
// En pantallas grandes: uno alto a la izquierda, dos apilados a la derecha y tres chicos abajo.
// Más chico, se apilan de a dos o de a uno.
const BLOQUES = [
  {
    lugar: "corte-34 sm:col-span-2 lg:col-start-1 lg:col-end-10 lg:row-start-1 lg:row-end-3",
    color: "bg-bloque-fuerte text-bloque-fuerte-texto",
    grande: true,
  },
  {
    lugar: "sm:col-span-2 lg:col-start-10 lg:col-end-17 lg:row-start-1 lg:row-end-2",
    color: "bg-superficie-elevada inset-ring inset-ring-borde-suave",
    grande: true,
  },
  { lugar: "sm:col-span-2 lg:col-start-10 lg:col-end-17 lg:row-start-2 lg:row-end-3", color: "bg-bloque-claro" },
  { lugar: "lg:col-start-1 lg:col-end-6 lg:row-start-3", color: "bg-bloque-medio text-bloque-medio-texto" },
  { lugar: "lg:col-start-6 lg:col-end-11 lg:row-start-3", color: "bg-bloque-suave" },
  { lugar: "sm:col-span-2 lg:col-span-1 lg:col-start-11 lg:col-end-17 lg:row-start-3", color: "bg-bloque-celeste text-bloque-celeste-texto" },
];

// Pedacito de la app adentro de un bloque: siempre sobre el fondo de la página, así se lee en cualquier color de bloque.
// "alto": ocupa todo el alto que le queda al bloque (en el bloque alto de la izquierda).
function Pieza({ alto = false, children }) {
  return (
    <div
      className={`mt-6 bg-superficie-pagina p-4 text-[0.88rem] text-texto-principal corte-14 ${
        alto ? "flex flex-1 flex-col" : "lg:mt-auto"
      }`}
    >
      {children}
    </div>
  );
}

function Fila({ izquierda, derecha, detalle }) {
  return (
    <li className="flex items-baseline justify-between gap-4 border-t border-borde-suave py-2 first:border-t-0">
      <span>
        {izquierda}
        {detalle && <small className="block text-[0.8rem] text-texto-secundario">{detalle}</small>}
      </span>
      <span className="font-medium whitespace-nowrap tabular-nums">{derecha}</span>
    </li>
  );
}

// Los gastos de octubre de Rivadavia 4520 y lo que le toca a la UF 7 (4,12 %).
// Las cuentas cierran con lo que muestra el teléfono del héroe: $ 71.900 de ordinarias + $ 12.400 del ascensor.
const GASTOS = [
  { nombre: "Sueldo del encargado", total: "$ 980.000", parte: "$ 40.376" },
  { nombre: "Luz de espacios comunes", total: "$ 412.300", parte: "$ 16.987" },
  { nombre: "Arreglo del ascensor", total: "$ 300.970", parte: "$ 12.400", extraordinaria: true },
  { nombre: "Limpieza", total: "$ 236.850", parte: "$ 9.758" },
  { nombre: "Seguro del edificio", total: "$ 116.000", parte: "$ 4.779" },
];

function EncabezadoExpensa() {
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold">Octubre, UF 7 · 3º B</p>
        <ChipEstado tipo="atencion" texto="Pendiente" />
      </div>
      <p className="mt-1 font-titulo text-[1.6rem] leading-tight font-bold tabular-nums">$ 84.300</p>
    </>
  );
}

// La expensa de una unidad, como la ve el vecino. "completo": cada gasto con su parte y su factura.
function DetalleExpensa({ completo = false }) {
  if (completo) {
    return (
      <Pieza alto>
        <EncabezadoExpensa />
        <ul className="mt-2 border-t border-borde-suave">
          {GASTOS.map((gasto) => (
            <Fila
              key={gasto.nombre}
              izquierda={gasto.nombre}
              detalle={
                <>
                  {gasto.extraordinaria ? "Extraordinaria. " : ""}
                  <u>Ver factura</u>
                </>
              }
              derecha={gasto.parte}
            />
          ))}
        </ul>
      </Pieza>
    );
  }

  return (
    <Pieza>
      <EncabezadoExpensa />
      <ul className="mt-2 border-t border-borde-suave">
        <Fila izquierda="Expensas ordinarias" derecha="$ 71.900" />
        <Fila izquierda="Arreglo del ascensor" detalle={<>Extraordinaria. <u>Ver factura</u></>} derecha="$ 12.400" />
      </ul>
    </Pieza>
  );
}

// Los gastos del mes, cada uno con su comprobante, y lo que le toca a una unidad según su porcentaje
function GastosDelMes() {
  return (
    <Pieza alto>
      <p className="font-semibold">Gastos de octubre, Rivadavia 4520</p>
      <ul className="mt-2">
        {GASTOS.map((gasto) => (
          <Fila key={gasto.nombre} izquierda={gasto.nombre} detalle="Con comprobante" derecha={gasto.total} />
        ))}
      </ul>
      <div className="mt-auto border-t-2 border-texto-principal pt-2.5">
        <p className="flex items-baseline justify-between gap-4 text-texto-secundario">
          <span>Total del mes</span>
          <span className="tabular-nums">$ 2.046.120</span>
        </p>
        <p className="mt-1 flex items-baseline justify-between gap-4">
          <span className="font-semibold">UF 7 · 3º B, 4,12 %</span>
          <span className="font-titulo text-[1.3rem] font-bold tabular-nums">$ 84.300</span>
        </p>
      </div>
    </Pieza>
  );
}

const UNIDADES = [
  { unidad: "UF 7 · 3º B", monto: "$ 84.300", estado: { tipo: "proceso", texto: "Por confirmar" } },
  { unidad: "UF 1 · PB A", monto: "", estado: { tipo: "exito", texto: "Al día" } },
  { unidad: "UF 2 · 1º A", monto: "$ 61.200", estado: { tipo: "atencion", texto: "Pendiente" } },
  { unidad: "UF 9 · 4º A", monto: "$ 129.900", estado: { tipo: "peligro", texto: "Vencido" } },
];

// Los pagos que informan los vecinos, junto al estado de cuenta de cada unidad
function PagosInformados() {
  return (
    <Pieza>
      <table className="w-full border-collapse">
        <caption className="sr-only">Pagos informados y estado de cuenta de algunas unidades</caption>
        <tbody>
          {UNIDADES.map((fila) => (
            <tr key={fila.unidad} className="border-t border-borde-suave first:border-t-0">
              <th scope="row" className="py-1.75 text-left font-medium whitespace-nowrap">
                {fila.unidad}
              </th>
              <td className="py-1.75 pl-2.5 text-right whitespace-nowrap tabular-nums">{fila.monto}</td>
              <td className="py-1.75 pl-2.5 text-right">
                <ChipEstado tipo={fila.estado.tipo} texto={fila.estado.texto} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Pieza>
  );
}

// Un aviso de la administración, como le llega a cada unidad
function Aviso() {
  return (
    <Pieza>
      <p className="flex items-center gap-1.5 text-[0.8rem] font-semibold text-texto-secundario">
        <Icono nombre="avisos" className="size-3.5" />
        Aviso de la administración
        <span className="ml-auto font-normal">hace 2 días</span>
      </p>
      <p className="mt-1.5 font-medium">Corte de agua el jueves 12, de 9 a 13, por el cambio de una cañería.</p>
    </Pieza>
  );
}

const ESTADOS_ARREGLO = [
  { paso: "hecho", texto: "Pendiente", fecha: "mar 27/10" },
  { paso: "actual", texto: "En curso: el plomero va el lunes", fecha: "jue 29/10" },
  { paso: "falta", texto: "Resuelto", fecha: "" },
];

// La línea de estados de un pedido de arreglo
function EstadoArreglo() {
  return (
    <Pieza>
      <p className="mb-3 font-semibold">Filtración en el palier del 3º</p>
      <ol className="grid gap-2.5">
        {ESTADOS_ARREGLO.map((estado) => (
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
    </Pieza>
  );
}

// Ordenados por el problema que resuelven, en el mismo orden que los datos de "El problema".
// Los tres primeros llevan un pedacito de la app; los chicos, solo el título.
const FUNCIONES = {
  vecinos: {
    titulo: "Lo de tu edificio, a la vista.",
    bloques: [
      { icono: "expensas", titulo: "Tu expensa, con cada factura", pieza: <DetalleExpensa completo /> },
      { icono: "avisos", titulo: "Los avisos te llegan a tiempo", pieza: <Aviso /> },
      { icono: "reclamos", titulo: "Tus arreglos, con su estado", pieza: <EstadoArreglo /> },
      { icono: "pagos", titulo: "Informás tu pago desde tu unidad" },
      { icono: "unidad", titulo: "Tu historial y tu saldo" },
      { icono: "documentos", titulo: "Los papeles del edificio, siempre a mano" },
    ],
  },
  administraciones: {
    titulo: "De seis herramientas a una.",
    bloques: [
      { icono: "expensas", titulo: "La expensa se arma sola", pieza: <GastosDelMes /> },
      { icono: "unidad", titulo: "Cada vecino ve el detalle de su expensa", pieza: <DetalleExpensa /> },
      { icono: "pagos", titulo: "Los pagos informados, en un solo lugar", pieza: <PagosInformados /> },
      { icono: "avisos", titulo: "Un aviso llega a todo el edificio" },
      { icono: "reclamos", titulo: "Cada arreglo, con su estado" },
      { icono: "vecinos", titulo: "Todo el equipo trabaja a la vez" },
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
            <h2 className="font-titulo text-titulo-seccion font-bold tracking-[-0.022em] text-balance">
              {funciones.titulo}
            </h2>
            <div className="mt-[clamp(2.5rem,4vw,3.5rem)] grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-16">
              {funciones.bloques.map((bloque, indice) => {
                const { lugar, color, grande } = BLOQUES[indice];
                return (
                  <article
                    key={bloque.titulo}
                    className={`flex min-w-0 flex-col p-6 ${bloque.pieza ? "" : "min-h-44"} ${lugar} ${color}`}
                  >
                    <Icono nombre={bloque.icono} className="size-7.5 shrink-0" />
                    {/* Con pieza, el título va arriba y la pieza abajo; sin pieza, el título baja al pie del bloque */}
                    <h3
                      className={`font-titulo leading-[1.15] font-bold text-balance ${bloque.pieza ? "mt-4" : "mt-auto pt-6"} ${
                        grande ? "text-[clamp(1.4rem,2.1vw,1.75rem)]" : "text-[1.22rem]"
                      }`}
                    >
                      {bloque.titulo}
                    </h3>
                    {bloque.pieza}
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
