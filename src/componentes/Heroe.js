"use client";

import { useEffect, useRef } from "react";
import EscenaTelefono from "@/componentes/EscenaTelefono";
import TramaPlano from "@/componentes/TramaPlano";
import { CLASES_BOTON, CLASES_ENLACE } from "@/lib/clases";
import { useBienvenidaActiva, useMovimientoReducido } from "@/lib/pagina";

const TEXTOS = {
  vecinos: {
    titulo: ["Dejá de preguntar", "en el grupo del edificio."],
    bajada: ["Tu expensa con cada factura,", "los avisos del edificio y tus arreglos, en un solo lugar."],
    boton: "Contale a tu administración",
    enlace: "Qué vas a ver",
  },
  administraciones: {
    titulo: ["Contestá una vez.", "No cuarenta."],
    bajada: ["Cargás los gastos y habitando arma las expensas.", "Cada vecino ve el detalle de la suya sin tener que llamarte."],
    boton: "Pedí una demo",
    enlace: "Qué incluye",
  },
};

// Lo que asoma de la sección siguiente por debajo del héroe, en escritorio
const ASOMA = 28;

// Primera pantalla: el título, la acción principal y el teléfono con "Hoy / Con habitando".
// En escritorio el héroe ocupa justo una pantalla (menos el encabezado) y el teléfono se achica
// para que entre entero; en el celular va debajo del texto.
export default function Heroe({ perfil }) {
  const bienvenidaActiva = useBienvenidaActiva();
  const movimientoReducido = useMovimientoReducido();

  const refHeroe = useRef(null);
  const refGrilla = useRef(null);

  useEffect(() => {
    const heroe = refHeroe.current;
    const grilla = refGrilla.current;

    function ajustarTelefono() {
      const altoPantalla = window.innerHeight;
      const anchoPantalla = window.innerWidth;
      const altoEncabezado = document.getElementById("encabezado").offsetHeight;
      document.documentElement.style.setProperty("--alto-encabezado", `${altoEncabezado}px`);

      let escala;
      if (anchoPantalla >= 900) {
        // El selector va al costado, así que todo el alto es para el teléfono. El ancho de la columna también limita.
        // Nunca menos del 68 %: más chico ya no se lee.
        const estilo = getComputedStyle(heroe);
        const relleno = parseFloat(estilo.paddingTop) + parseFloat(estilo.paddingBottom);
        const selector = heroe.querySelector(".selector-escena");
        const anchoLibre = grilla.clientWidth / 2 - selector.offsetWidth - 18;
        const altoLibre = altoPantalla - altoEncabezado - ASOMA - relleno;
        escala = Math.min(1, anchoLibre / 288, Math.max(0.68, altoLibre / 590));
      } else {
        escala = Math.min(1, (anchoPantalla * 0.82) / 288, (altoPantalla - 140) / 590);
      }
      heroe.style.setProperty("--escala", escala.toFixed(3));
    }

    ajustarTelefono();
    window.addEventListener("resize", ajustarTelefono);
    const observador = new ResizeObserver(ajustarTelefono);
    observador.observe(heroe);
    return () => {
      window.removeEventListener("resize", ajustarTelefono);
      observador.disconnect();
    };
  }, []);

  return (
    <section
      ref={refHeroe}
      className="relative overflow-hidden pt-[clamp(2rem,4.5vw,3.75rem)] pb-[clamp(3.5rem,7vw,6rem)] escritorio:flex escritorio:min-h-[calc(100svh-var(--alto-encabezado,75px)-28px)] escritorio:items-center escritorio:py-[clamp(1rem,3.5vh,2.75rem)]"
    >
      <TramaPlano refHeroe={refHeroe} perfil={perfil} movimientoReducido={movimientoReducido} />

      <div
        ref={refGrilla}
        className="contenedor relative grid grid-cols-1 items-center gap-[clamp(2.5rem,5vw,5rem)] escritorio:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]"
      >
        <div className="min-w-0">
          {Object.entries(TEXTOS).map(([id, textos]) => (
            <div key={id} data-solo={id}>
              <h1 className="max-w-[12.5ch] font-titulo text-titulo-heroe font-bold tracking-[-0.028em] text-balance escritorio:max-w-none escritorio:text-titulo-heroe-escritorio">
                {/* En escritorio, cada parte es un renglón */}
                <span className="escritorio:block escritorio:whitespace-nowrap">{textos.titulo[0]}</span>{" "}
                <span className="escritorio:block escritorio:whitespace-nowrap">{textos.titulo[1]}</span>
              </h1>
              <p className="mt-5.5 max-w-[34rem] text-bajada text-texto-secundario escritorio:max-w-none">
                <span className="escritorio:block">{textos.bajada[0]}</span>{" "}
                <span className="escritorio:block">{textos.bajada[1]}</span>
              </p>
              <div data-acciones-heroe className="mt-[clamp(1.4rem,3.2vh,2.1rem)] flex flex-wrap items-center gap-x-7 gap-y-3">
                <a href="#accion" className={CLASES_BOTON}>
                  {textos.boton}
                </a>
                <a href="#funciones" className={CLASES_ENLACE}>
                  {textos.enlace}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Al cambiar de perfil o al terminar la bienvenida, la escena se vuelve a montar y empieza de nuevo */}
        <EscenaTelefono
          key={`${perfil}-${bienvenidaActiva}`}
          automatica={!bienvenidaActiva && !movimientoReducido}
          movimientoReducido={movimientoReducido}
        />
      </div>
    </section>
  );
}
