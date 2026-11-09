import MensajeError from "@/componentes/MensajeError";

// Campo de texto con etiqueta, ayuda y error (como el de la app, con el estilo de la landing).
export default function CampoFormulario({ id, etiqueta, tipo = "text", ayuda, error, ...propsInput }) {
  const idAyuda = ayuda ? `${id}-ayuda` : undefined;
  const idError = error ? `${id}-error` : undefined;
  const descripciones = [idAyuda, idError].filter(Boolean).join(" ") || undefined;

  const colorBorde = error ? "border-peligro-borde" : "border-borde-fuerte";

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[0.95rem] font-semibold">
        {etiqueta}
      </label>

      <input
        id={id}
        name={id}
        type={tipo}
        aria-invalid={error ? true : undefined}
        aria-describedby={descripciones}
        className={`w-full rounded-md border bg-superficie-pagina px-3.5 py-2.75 leading-normal placeholder:text-texto-atenuado focus-visible:outline-offset-1 ${colorBorde}`}
        {...propsInput}
      />

      {ayuda && (
        <p id={idAyuda} className="text-sm text-texto-secundario">
          {ayuda}
        </p>
      )}

      {error && <MensajeError id={idError}>{error}</MensajeError>}
    </div>
  );
}
