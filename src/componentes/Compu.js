import Image from "next/image";
import capturaCompu from "@/imagenes/compu-administracion.webp";

// La compu de "Con habitando" para la administración: el panel de verdad, el resumen de un edificio,
// en una compu con fondo transparente. Se diseña a 560 x 322 y se escala entera (--escala-compu, lo calcula el héroe).
export default function Compu() {
  return (
    <div className="compu" data-solo="administraciones">
      <Image
        src={capturaCompu}
        alt="El panel de habitando para la administración en una compu: el resumen del edificio, las expensas del mes y la cobranza."
        sizes="(min-width: 900px) 560px, 100vw"
        className="block size-full"
      />
    </div>
  );
}
