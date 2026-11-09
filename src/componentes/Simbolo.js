import { TORRE_ALTA, TORRE_BAJA } from "@/lib/isologo";

// El símbolo solo (las dos torres). Con "resaltar" una torre queda llena y la otra apagada:
// en el selector de perfil, la alta es la de los vecinos y la baja, la de la administración.
export default function Simbolo({ resaltar, className = "" }) {
  const opacidad = (torre) => (!resaltar || resaltar === torre ? 1 : 0.28);

  return (
    <svg aria-hidden="true" viewBox="50.3 49.6 161.5 300.1" fill="currentColor" className={`shrink-0 ${className}`}>
      <path d={TORRE_ALTA} opacity={opacidad("alta")} />
      <path d={TORRE_BAJA} opacity={opacidad("baja")} />
    </svg>
  );
}
