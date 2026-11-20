"use client";

import { useEffect, useRef } from "react";
import EscenaTelefono from "@/componentes/EscenaTelefono";
import SelectorPerfil from "@/componentes/SelectorPerfil";
import TramaPlano from "@/componentes/TramaPlano";
import { CLASES_BOTON, CLASES_ENLACE } from "@/lib/clases";
import { useBienvenidaActiva, useMovimientoReducido } from "@/lib/pagina";
import { unirPalabrasCortas } from "@/lib/texto";

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

// En el celular, lo que queda libre debajo del teléfono y su selector al mirarlo entero
const MARGEN_CELULAR = 80;

// Ancho al que se diseña la compu de la administración (ver Compu.js), lo más que puede crecer en escritorio
// y el aire que deja siempre contra el borde de la ventana
const ANCHO_COMPU = 560;
const ANCHO_COMPU_MAXIMO = 640;
const AIRE_COMPU = 24;

// En escritorio el selector "Hoy / Con habitando" va a la izquierda del dispositivo, apoyado en su misma línea:
// su margen de abajo (escritorio:mb-6), lo que lo separa del dispositivo y lo mínimo que lo separa de los botones
const MARGEN_ABAJO_SELECTOR = 24;
const SEPARACION_SELECTOR = 28;
const DISTANCIA_A_LOS_BOTONES = 32;

// Primera pantalla: el título, la acción principal y el teléfono con "Hoy / Con habitando".
// En escritorio el héroe ocupa justo una pantalla (menos el encabezado) y el teléfono se achica
// para que entre entero. En el celular no entran los dos a un tamaño que se lea, así que la primera pantalla se arma
// como un afiche: arriba la trama como imagen y el texto apoyado abajo; el teléfono empieza justo debajo,
// pegado al botón, y nunca aparece cortado por la mitad.
export default function Heroe({ perfil, alElegirPerfil }) {
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
      let escalaCompu;
      let sobraCompu = 0;
      if (anchoPantalla >= 900) {
        // El selector va al costado, así que todo el alto es para el teléfono. El ancho de la columna también limita.
        // Nunca menos del 68 %: más chico ya no se lee.
        const estilo = getComputedStyle(heroe);
        const relleno = parseFloat(estilo.paddingTop) + parseFloat(estilo.paddingBottom);
        const selector = heroe.querySelector(".selector-escena");
        const anchoLibre = grilla.clientWidth / 2 - selector.offsetWidth - 18;
        const altoLibre = altoPantalla - altoEncabezado - ASOMA - relleno;
        escala = Math.min(1, anchoLibre / 288, Math.max(0.68, altoLibre / 590));
        heroe.style.setProperty("--escala", escala.toFixed(3));

        // El selector sale de la escena hacia la izquierda, debajo del texto, y le deja ese lugar al dispositivo.
        // Solo si queda bien separado de los botones del texto; si no (pantallas bajas), sigue al lado del dispositivo.
        const escena = heroe.querySelector(".escena");
        const acciones = [...heroe.querySelectorAll("[data-acciones-heroe]")].find((elemento) => elemento.offsetParent);
        const arribaSelector = escena.getBoundingClientRect().bottom - MARGEN_ABAJO_SELECTOR - selector.offsetHeight;
        const selectorAfuera = arribaSelector >= acciones.getBoundingClientRect().bottom + DISTANCIA_A_LOS_BOTONES;
        escena.dataset.selector = selectorAfuera ? "afuera" : "al-lado";

        // La compu ocupa el ancho de la columna (menos el selector, si va al lado), avanza sobre parte del espacio
        // entre las columnas y, del otro lado, sobre el margen de la página hasta casi el borde: crece sin cortarse.
        const estiloGrilla = getComputedStyle(grilla);
        const anchoColumna = parseFloat(estiloGrilla.gridTemplateColumns.split(" ")[1]);
        const separacion = parseFloat(estiloGrilla.columnGap);
        const enColumna = anchoColumna + separacion * 0.75 - (selectorAfuera ? 0 : selector.offsetWidth + 18);
        const corrimiento = selector.offsetWidth + SEPARACION_SELECTOR + separacion * 0.75;
        heroe.style.setProperty("--corrimiento-escena", `${Math.round(corrimiento)}px`);
        const bordeContenido = grilla.getBoundingClientRect().right - parseFloat(estiloGrilla.paddingRight);
        const margenLibre = Math.max(0, document.documentElement.clientWidth - bordeContenido - AIRE_COMPU);
        escalaCompu = Math.min(ANCHO_COMPU_MAXIMO / ANCHO_COMPU, (enColumna + margenLibre) / ANCHO_COMPU);
        sobraCompu = Math.max(0, ANCHO_COMPU * escalaCompu - enColumna);
      } else {
        // Que el teléfono con su selector entre entero en una pantalla
        escala = Math.min(1, (anchoPantalla * 0.82) / 288, (altoPantalla - altoEncabezado - MARGEN_CELULAR) / 590);
        // La compu, de lado a lado de la caja de contenido
        const estiloGrilla = getComputedStyle(grilla);
        const anchoContenido = grilla.clientWidth - parseFloat(estiloGrilla.paddingLeft) - parseFloat(estiloGrilla.paddingRight);
        escalaCompu = Math.min(1, anchoContenido / ANCHO_COMPU);
      }
      heroe.style.setProperty("--escala", escala.toFixed(3));
      heroe.style.setProperty("--escala-compu", escalaCompu.toFixed(3));
      heroe.style.setProperty("--sobra-compu", `${Math.round(sobraCompu)}px`);
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
        {/* En el celular ocupa la primera pantalla entera (menos el encabezado y el margen de arriba):
            el selector arriba, la trama en el medio y el texto apoyado abajo */}
        <div className="min-w-0 max-escritorio:flex max-escritorio:min-h-[calc(100svh-var(--alto-encabezado,56px)-2rem)] max-escritorio:flex-col max-escritorio:pb-4">
          <SelectorPerfil perfil={perfil} alElegir={alElegirPerfil} className="mb-7 flex md:hidden" />
          <div className="max-escritorio:mt-auto">
            {Object.entries(TEXTOS).map(([id, textos]) => (
              <div key={id} data-solo={id}>
                <h1 className="font-titulo text-titulo-heroe font-bold tracking-[-0.028em] escritorio:text-titulo-heroe-escritorio">
                  {/* Siempre dos renglones, cortados por sentido: el tamaño se ajusta para que el más largo entre en el ancho */}
                  <span className="block whitespace-nowrap">{unirPalabrasCortas(textos.titulo[0])}</span>{" "}
                  <span className="block whitespace-nowrap">{unirPalabrasCortas(textos.titulo[1])}</span>
                </h1>
                <p className="mt-5.5 max-w-[34rem] text-bajada text-texto-secundario escritorio:max-w-none">
                  <span className="escritorio:block">{unirPalabrasCortas(textos.bajada[0])}</span>{" "}
                  <span className="escritorio:block">{unirPalabrasCortas(textos.bajada[1])}</span>
                </p>
                <div data-acciones-heroe className="mt-[clamp(1.4rem,3.2vh,2.1rem)] flex flex-wrap items-center gap-x-7 gap-y-3">
                  <a href="#accion" className={CLASES_BOTON}>
                    {unirPalabrasCortas(textos.boton)}
                  </a>
                  <a href="#funciones" className={`${CLASES_ENLACE} inline-flex min-h-11 items-center`}>
                    {textos.enlace}
                  </a>
                </div>
              </div>
            ))}
          </div>
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
