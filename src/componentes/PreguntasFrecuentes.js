// Las dudas que frenan a alguien antes de decidirse, para cada perfil.
// Las respuestas dicen solo lo que la app ya hace: el precio todavía no está definido.
const PREGUNTAS = {
  vecinos: [
    {
      pregunta: "¿Tengo que pagar algo?",
      respuesta: "No. Habitando lo contrata la administración y para los vecinos es gratis.",
    },
    {
      pregunta: "¿Y si mi administración no lo usa?",
      respuesta:
        "Mandale el mensaje que te dejamos acá abajo. Si lo suma, te llega una invitación a tu mail para entrar con tu unidad.",
    },
    {
      pregunta: "¿Tengo que instalar algo?",
      respuesta: "No. Es una página web: entrás desde el celular o la compu con tu mail.",
    },
    {
      pregunta: "¿Quién ve mis datos?",
      respuesta:
        "Vos y tu administración. El resto del edificio solo puede ver si una unidad está al día, como pide la ley; tus datos personales, no.",
    },
    {
      pregunta: "¿Cambia la forma de pagar?",
      respuesta:
        "No. Pagás como siempre y después subís el comprobante desde tu unidad, así la administración lo ve en el momento.",
    },
  ],
  administraciones: [
    {
      pregunta: "¿Cuánto cuesta?",
      respuesta: "Es un abono mensual por cada unidad funcional que administrás. Para los vecinos es gratis.",
    },
    {
      pregunta: "¿Cómo empiezo si hoy trabajo con Excel?",
      respuesta:
        "Cargás cada edificio con sus unidades y el porcentaje de cada una. Desde ese mes, los gastos se cargan en Habitando y la expensa se arma sola.",
    },
    {
      pregunta: "¿Los vecinos tienen que instalar algo?",
      respuesta: "No. Es una página web: cada vecino entra con su mail desde el celular o la compu.",
    },
    {
      pregunta: "¿Quién ve la información de cada edificio?",
      respuesta:
        "Cada consorcio tiene sus datos separados: ningún edificio ve los de otro. Y cada vecino ve solamente su unidad.",
    },
    {
      pregunta: "¿Qué pasa si me equivoco en un gasto?",
      respuesta:
        "Mientras el mes está abierto, lo corregís o lo borrás. Cuando cerrás el mes, la liquidación queda fija y los vecinos la ven.",
    },
  ],
};

export default function PreguntasFrecuentes() {
  return (
    <section aria-labelledby="titulo-preguntas" className="pb-[clamp(4.5rem,9vw,8rem)]">
      <div className="contenedor grid grid-cols-1 items-start gap-[clamp(2rem,6vw,6rem)] escritorio:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <h2
          id="titulo-preguntas"
          className="max-w-[19ch] font-titulo text-titulo-seccion font-bold tracking-[-0.022em] text-balance escritorio:sticky escritorio:top-28"
        >
          Preguntas frecuentes
        </h2>

        {Object.entries(PREGUNTAS).map(([id, preguntas]) => (
          <div key={id} data-solo={id} className="border-t border-borde-suave">
            {preguntas.map((item) => (
              // <details> se abre y se cierra solo, con teclado incluido
              <details key={item.pregunta} className="group border-b border-borde-suave">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[1.08rem] font-semibold [&::-webkit-details-marker]:hidden">
                  {item.pregunta}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="size-5 shrink-0 text-texto-secundario transition-transform duration-200 group-open:rotate-45"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </summary>
                <p className="max-w-[60ch] pr-10 pb-6 text-texto-secundario">{item.respuesta}</p>
              </details>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
