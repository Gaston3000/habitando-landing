import Simbolo from "@/componentes/Simbolo";

const PERFILES = [
  { id: "vecinos", nombre: "Para vecinos", torre: "alta" },
  { id: "administraciones", nombre: "Para administraciones", torre: "baja" },
];

// "Para vecinos / Para administraciones". En escritorio va en el encabezado; en el celular, al principio del héroe.
export default function SelectorPerfil({ perfil, alElegir, className = "" }) {
  function elegir(evento, id) {
    evento.preventDefault();
    alElegir(id);
  }

  return (
    <nav aria-label="Elegí tu perfil" className={`gap-1 bg-superficie-zona p-1 corte-16 ${className}`}>
      {PERFILES.map((opcion) => (
        <a
          key={opcion.id}
          href={`#${opcion.id}`}
          onClick={(evento) => elegir(evento, opcion.id)}
          aria-current={perfil === opcion.id ? "page" : undefined}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2.5 px-2 py-2 text-[0.9rem] font-semibold whitespace-nowrap text-texto-secundario corte-12 transition-colors duration-300 hover:text-texto-principal focus-visible:shadow-[inset_0_0_0_2px_var(--foco)] focus-visible:outline-none aria-[current=page]:bg-superficie-elevada aria-[current=page]:text-texto-principal md:min-h-0 md:flex-none md:pr-4 md:pl-4.5 md:text-[0.95rem]"
        >
          <Simbolo resaltar={opcion.torre} className="h-4.25 w-2.25" />
          {opcion.nombre}
        </a>
      ))}
    </nav>
  );
}
