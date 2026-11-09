// Chip de estado, el mismo de la app (color + ícono + texto, nunca solo color).
// La diferencia es que acá todo mide en em, así se puede achicar entero con "tamano"
// (adentro del teléfono va más chico).
const ESTILOS = {
  proceso: { chip: "border-borde-fuerte bg-superficie-zona text-texto-principal", icono: "text-texto-principal" },
  exito: { chip: "border-exito-borde bg-exito-fondo text-exito-texto", icono: "text-exito-borde" },
  atencion: { chip: "border-atencion-borde bg-atencion-fondo text-atencion-texto", icono: "text-atencion-borde" },
  peligro: { chip: "border-peligro-borde bg-peligro-fondo text-peligro-texto", icono: "text-peligro-borde" },
};

const ICONOS = {
  exito: <path d="M5 12l5 5L20 7" />,
  proceso: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  atencion: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6M12 16.5v.5" />
    </>
  ),
  peligro: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </>
  ),
};

export default function ChipEstado({ tipo, texto, tamano = "text-xs" }) {
  const estilo = ESTILOS[tipo];

  return (
    <span
      className={`inline-flex items-center gap-[0.3em] rounded-full border py-[0.15em] pr-[0.6em] pl-[0.4em] leading-[1.3] font-medium whitespace-nowrap ${tamano} ${estilo.chip}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`size-[1.05em] ${estilo.icono}`}
      >
        {ICONOS[tipo]}
      </svg>
      {texto}
    </span>
  );
}
