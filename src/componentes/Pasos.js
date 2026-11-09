const PASOS = {
  vecinos: {
    titulo: "Cómo llega Habitando a tu edificio",
    pasos: [
      { titulo: "Le contás a tu administración", texto: "Con el mensaje que te dejamos acá abajo." },
      { titulo: "La administración carga el edificio", texto: "Y te manda una invitación a tu mail." },
      { titulo: "Entrás y ves tu unidad", texto: "Tu expensa, tus pagos y tus reclamos desde el primer día." },
    ],
  },
  administraciones: {
    titulo: "Cómo empezar",
    pasos: [
      { titulo: "Cargás el edificio", texto: "Con sus unidades y el porcentaje de cada una." },
      { titulo: "Invitás a los vecinos", texto: "Cada uno entra con su mail y ve solamente su unidad." },
      { titulo: "Cerrás el primer mes", texto: "Cargás los gastos, revisás la liquidación y la publicás." },
    ],
  },
};

// Cómo se empieza a usar, en tres pasos numerados.
export default function Pasos() {
  return (
    <section aria-label="Cómo empezar" className="pb-[clamp(4.5rem,9vw,8rem)]">
      <div className="contenedor">
        {Object.entries(PASOS).map(([id, contenido]) => (
          <div key={id} data-solo={id}>
            <h2 className="max-w-[19ch] font-titulo text-titulo-seccion font-bold tracking-[-0.022em] text-balance">
              {contenido.titulo}
            </h2>
            <ol className="pasos mt-[clamp(2.5rem,4vw,3.5rem)] grid grid-cols-1 gap-[clamp(1.5rem,3vw,2.5rem)] md:grid-cols-3">
              {contenido.pasos.map((paso) => (
                <li key={paso.titulo} className="paso grid gap-2.25 border-t-2 border-texto-principal pt-5">
                  <h3 className="font-titulo text-[1.25rem] font-bold">{paso.titulo}</h3>
                  <p className="text-texto-secundario">{paso.texto}</p>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}
