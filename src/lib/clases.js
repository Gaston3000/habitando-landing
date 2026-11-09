// Clases que comparten varios componentes de la landing.

// Botón principal: lleva el corte de 30° de la marca, que se agranda al pasar el mouse.
// El contorno de foco va hacia adentro porque el corte recorta lo que sale del botón.
export const CLASES_BOTON =
  "inline-flex min-h-12.5 cursor-pointer items-center justify-center bg-accion-principal py-3 pr-6 pl-7 leading-tight font-semibold text-accion-principal-texto corte-13 transition-[clip-path,background-color] duration-300 ease-out hover:bg-accion-principal-hover hover:corte-24 focus-visible:outline-accion-principal-texto focus-visible:-outline-offset-6";

export const CLASES_BOTON_CHICO =
  "inline-flex min-h-10.5 cursor-pointer items-center justify-center bg-accion-principal py-2.5 pr-4.5 pl-5 text-[0.95rem] leading-tight font-semibold text-accion-principal-texto corte-13 transition-[clip-path,background-color] duration-300 ease-out hover:bg-accion-principal-hover hover:corte-24 focus-visible:outline-accion-principal-texto focus-visible:-outline-offset-6";

// Enlace de texto: subrayado suave que se marca al pasar el mouse.
export const CLASES_ENLACE =
  "cursor-pointer py-1.5 font-semibold underline decoration-borde-fuerte decoration-[1.5px] underline-offset-[0.3em] hover:decoration-current";
