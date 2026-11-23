"use client";

import { useState } from "react";
import { CLASES_BOTON } from "@/lib/clases";
import { unirPalabrasCortas } from "@/lib/texto";

// Precio por unidad funcional, por mes. Cada tramo se paga a su precio: con 200 unidades, las primeras 100 van
// a $ 2.000 y las otras 100 a $ 1.500. "largo" es cuántas unidades entran en el tramo (el último no tiene tope:
// en la barra se dibuja con 200, como el segundo).
const TRAMOS = [
  { nombre: "1 a 100", largo: 100, precio: 2000 },
  { nombre: "101 a 300", largo: 200, precio: 1500 },
  { nombre: "301 o más", largo: Infinity, precio: 1000 },
];
const LARGO_DIBUJADO_ULTIMO = 200;

// Los ejemplos de la presentación, como atajos
const EJEMPLOS = [24, 200, 400];
const UNIDADES_DE_ENTRADA = 200;

function formatearPesos(numero) {
  return `$ ${numero.toLocaleString("es-AR")}`;
}

// Cuántas unidades caen en cada tramo y cuánto suman
function calcular(unidades) {
  let quedan = unidades;
  const partes = TRAMOS.map((tramo) => {
    const cantidad = Math.max(0, Math.min(quedan, tramo.largo));
    quedan -= cantidad;
    return { ...tramo, cantidad };
  });
  const total = partes.reduce((suma, parte) => suma + parte.cantidad * parte.precio, 0);
  return { partes, total };
}

// Barra de los tres tramos: cada uno se llena con las unidades que le tocan
function BarraTramos({ partes }) {
  return (
    <div aria-hidden="true" className="flex gap-1">
      {partes.map((parte) => {
        const largo = Number.isFinite(parte.largo) ? parte.largo : LARGO_DIBUJADO_ULTIMO;
        const lleno = Math.min(1, parte.cantidad / largo);
        return (
          <div key={parte.nombre} className="min-w-0" style={{ flexGrow: largo, flexBasis: 0 }}>
            <div className="h-3 overflow-hidden bg-borde-fuerte/45">
              <div
                className="h-full origin-left bg-accion-principal transition-transform duration-300 ease-out"
                style={{ transform: `scaleX(${lleno})` }}
              />
            </div>
            <p className="mt-1.5 text-[0.78rem] leading-tight text-texto-secundario">
              {parte.nombre}
              <span className="block font-semibold text-texto-principal tabular-nums">{formatearPesos(parte.precio)}</span>
            </p>
          </div>
        );
      })}
    </div>
  );
}

// Cuánto cuesta, solo en la versión para administraciones. En el rubro casi nadie publica el precio:
// acá está la tabla de tramos y, al lado, una cuenta para tu cantidad de unidades, que muestra cómo se paga cada tramo.
// "Pedí una demo" lleva al formulario de abajo con las unidades ya escritas.
export default function Precios() {
  const [texto, setTexto] = useState(String(UNIDADES_DE_ENTRADA));
  const unidades = /^\d+$/.test(texto) ? Number(texto) : 0;
  const { partes, total } = calcular(unidades);
  const cuenta = partes
    .filter((parte) => parte.cantidad > 0)
    .map((parte) => `${parte.cantidad.toLocaleString("es-AR")} × ${formatearPesos(parte.precio)}`)
    .join(" + ");

  function llevarAlFormulario() {
    const campo = document.getElementById("unidades");
    if (campo && unidades > 0) campo.value = String(unidades);
  }

  return (
    <section id="precios" data-solo="administraciones" aria-labelledby="titulo-precios" className="espacio-seccion">
      <div className="contenedor grid gap-[clamp(2.5rem,4vw,4rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] lg:items-start">
        <div>
          <h2 id="titulo-precios" className="font-titulo text-titulo-seccion font-bold tracking-[-0.022em] text-balance">
            El precio está publicado.
          </h2>
          <p className="mt-4.5 max-w-xl text-[1.08rem] text-texto-secundario">
            {unirPalabrasCortas("En el rubro casi nadie publica el precio. Si hablamos de transparencia, empieza por acá.")}
          </p>

          <table className="mt-[clamp(2rem,3.5vw,3rem)] w-full max-w-xl border-collapse text-left">
            <caption className="sr-only">Precio por unidad funcional, por mes, según la cantidad de unidades</caption>
            <thead>
              <tr className="border-b-2 border-texto-principal text-[0.9rem] text-texto-secundario">
                <th scope="col" className="pb-2.5 font-semibold">
                  Unidades
                </th>
                <th scope="col" className="pb-2.5 text-right font-semibold">
                  Por unidad, por mes
                </th>
              </tr>
            </thead>
            <tbody>
              {TRAMOS.map((tramo) => (
                <tr key={tramo.nombre} className="border-b border-borde-suave">
                  <th scope="row" className="py-3.5 font-semibold">
                    {tramo.nombre}
                  </th>
                  <td className="py-3.5 text-right font-titulo text-[1.5rem] leading-none font-bold tabular-nums">
                    {formatearPesos(tramo.precio)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 max-w-xl text-[0.95rem] text-texto-secundario">
            {unirPalabrasCortas("Cada tramo se paga a su precio, así que sumar un edificio siempre conviene.")}
          </p>
        </div>

        {/* La cuenta: una sala más de la planta, como el formulario de la banda final */}
        <div className="grid gap-5 bg-superficie-elevada p-[clamp(1.5rem,3vw,2.25rem)] corte-26 shadow-[0_0_0_1px_var(--borde-suave),0_28px_56px_-28px_var(--sombra)]">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="unidades-precio" className="text-[0.95rem] font-semibold">
              ¿Cuántas unidades administrás?
            </label>
            <input
              id="unidades-precio"
              inputMode="numeric"
              autoComplete="off"
              value={texto}
              onChange={(evento) => setTexto(evento.target.value.replace(/\D/g, "").slice(0, 5))}
              className="w-full rounded-md border border-borde-fuerte bg-superficie-pagina px-3.5 py-2.75 font-titulo text-[1.3rem] leading-normal font-bold tabular-nums focus-visible:outline-offset-1"
            />
            <div role="group" aria-labelledby="ejemplos-precio" className="flex flex-wrap items-center gap-2 pt-1">
              <span id="ejemplos-precio" className="mr-1 text-[0.9rem] text-texto-secundario">
                Ejemplos:
              </span>
              {EJEMPLOS.map((ejemplo) => (
                <button
                  key={ejemplo}
                  type="button"
                  aria-pressed={unidades === ejemplo}
                  aria-label={`${ejemplo} unidades`}
                  onClick={() => setTexto(String(ejemplo))}
                  className="min-h-11 min-w-14 cursor-pointer rounded-full border border-borde-fuerte px-3.5 text-[0.9rem] font-semibold text-texto-secundario tabular-nums transition-colors duration-200 hover:text-texto-principal aria-pressed:border-accion-principal aria-pressed:bg-accion-principal aria-pressed:text-accion-principal-texto"
                >
                  {ejemplo}
                </button>
              ))}
            </div>
          </div>

          <BarraTramos partes={partes} />

          <div aria-live="polite" className="border-t border-borde-suave pt-4">
            {unidades > 0 ? (
              <>
                <p className="text-[0.92rem] text-texto-secundario tabular-nums">{cuenta}</p>
                <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
                  <span className="font-titulo text-[2rem] leading-tight font-bold tabular-nums">{formatearPesos(total)}</span>
                  <span className="text-texto-secundario">por mes</span>
                </p>
              </>
            ) : (
              <p className="text-texto-secundario">Escribí cuántas unidades administrás y te mostramos el total.</p>
            )}
          </div>

          <a href="#accion" onClick={llevarAlFormulario} className={`${CLASES_BOTON} justify-self-start`}>
            Pedí una demo
          </a>
        </div>
      </div>
    </section>
  );
}
