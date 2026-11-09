import MensajeError from "@/componentes/MensajeError";

// Campo de varias líneas con etiqueta, ayuda y error (como CampoFormulario, pero con <textarea>).
export default function CampoTextoLargo({ id, etiqueta, ayuda, error, filas = 5, ...propsTexto }) {
  const idAyuda = ayuda ? `${id}-ayuda` : undefined;
  const idError = error ? `${id}-error` : undefined;
  const descripciones = [idAyuda, idError].filter(Boolean).join(" ") || undefined;

  const colorBorde = error ? "border-peligro-borde" : "border-borde-fuerte";

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[0.95rem] font-semibold">
        {etiqueta}
      </label>

      <textarea
        id={id}
        name={id}
        rows={filas}
        aria-invalid={error ? true : undefined}
        aria-describedby={descripciones}
        className={`min-h-38 w-full resize-y rounded-md border bg-superficie-pagina px-3.5 py-2.75 leading-normal placeholder:text-texto-atenuado focus-visible:outline-offset-1 ${colorBorde}`}
        {...propsTexto}
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
