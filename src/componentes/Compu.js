import Image from "next/image";
import capturaAdministracion from "@/imagenes/app-administracion.png";

// La compu de "Con habitando" para la administración: el panel de verdad, una captura del resumen de un edificio.
// Se diseña a 560 x 346 y se escala entera (--escala-compu, lo calcula el héroe). Sin marca: tapa, pantalla y base.
// La pantalla lleva "capa-con" para entrar barriendo en diagonal, igual que la del teléfono.
export default function Compu() {
  return (
    <div className="compu" data-solo="administraciones">
      <div className="compu-tapa">
        <div className="compu-pantalla capa-con">
          <Image
            src={capturaAdministracion}
            alt="El panel de habitando para la administración: el resumen del edificio, las expensas por cerrar y la cobranza."
            sizes="(min-width: 900px) 500px, 90vw"
            className="block size-full object-cover object-left-top"
          />
        </div>
      </div>
      <div className="compu-base" />
    </div>
  );
}
