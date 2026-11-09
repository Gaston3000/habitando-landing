import { LETRAS, TORRE_ALTA, TORRE_BAJA } from "@/lib/isologo";

// Isologotipo de habitando: las dos torres y el nombre. Toma el color del texto que lo rodea.
// "ref" lo usa la bienvenida para saber adónde tienen que volar las torres.
export default function Isologo({ ref, className = "", etiqueta }) {
  const accesible = etiqueta ? { role: "img", "aria-label": etiqueta } : { "aria-hidden": true };

  return (
    <svg
      ref={ref}
      viewBox="48 46 1440 306"
      fill="currentColor"
      className={`block aspect-[1440/306] w-auto overflow-visible ${className}`}
      {...accesible}
    >
      <path className="isologo-torre" d={TORRE_ALTA} />
      <path className="isologo-torre" d={TORRE_BAJA} />
      <g className="isologo-letras">
        {LETRAS.map((letra) => (
          <path key={letra.x} transform={`matrix(1 0 0 -1 ${letra.x} ${letra.y})`} d={letra.d} />
        ))}
      </g>
    </svg>
  );
}
