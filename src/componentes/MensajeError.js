// Mensaje de error con ícono + texto (nunca solo color).
// Con "destacado" se muestra como caja, para errores generales del formulario.
export default function MensajeError({ id, destacado = false, children }) {
  const clases = destacado
    ? "flex items-start gap-2 rounded-md border border-peligro-borde bg-peligro-fondo px-4 py-3 text-sm text-peligro-texto"
    : "flex items-start gap-1.5 text-sm text-peligro-texto";

  return (
    <p id={id} role={destacado ? "alert" : undefined} className={clases}>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="mt-0.5 h-4 w-4 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="10" cy="10" r="8" />
        <path d="M10 6v5" strokeLinecap="round" />
        <circle cx="10" cy="13.75" r="0.75" fill="currentColor" />
      </svg>
      <span>{children}</span>
    </p>
  );
}
