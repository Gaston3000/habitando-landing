import Isologo from "@/componentes/Isologo";
import { CLASES_ENLACE } from "@/lib/clases";
import { URL_INGRESAR } from "@/lib/enlaces";

export default function Pie({ alRepetirBienvenida }) {
  return (
    <footer className="border-t border-borde-suave pt-12 pb-14">
      <div className="contenedor flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
        <div>
          <Isologo etiqueta="habitando" className="h-7.5" />
          <p className="mt-4 max-w-[24ch] font-titulo text-[1.15rem] leading-[1.35] font-semibold">
            La información ya existe. Nosotros abrimos la puerta.
          </p>
        </div>
        <div className="grid justify-items-start gap-1.5 text-[0.88rem] text-texto-secundario sm:justify-items-end sm:text-right">
          <p>
            ¿Ya usás habitando?{" "}
            <a href={URL_INGRESAR} className={`${CLASES_ENLACE} text-texto-principal`}>
              Ingresar
            </a>
          </p>
          <p>Proyecto de tesis de Diseño y Programación Web, 2026.</p>
          <button type="button" onClick={alRepetirBienvenida} className={CLASES_ENLACE}>
            Ver la bienvenida de nuevo
          </button>
        </div>
      </div>
    </footer>
  );
}
