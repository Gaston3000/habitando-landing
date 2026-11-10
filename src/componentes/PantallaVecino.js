import ChipEstado from "@/componentes/ChipEstado";
import Icono from "@/componentes/Icono";
import Simbolo from "@/componentes/Simbolo";

// Mensajes del grupo del edificio. "orden" escalona cómo se van cuando entra habitando.
const MENSAJES = [
  { autor: "3º B", texto: "¿Alguien entiende por qué vino tan alta la expensa?", hora: "21:14", orden: 1 },
  { autor: "1º A", texto: "Yo tampoco. El recibo es un choclo", hora: "21:16", orden: 2 },
  { autor: "PB C", texto: "¿Y el ascensor? Hace dos semanas que no anda", hora: "21:20", orden: 3 },
  { texto: "Le escribí al administrador el lunes y nada", hora: "21:31", orden: 4 },
  { autor: "5º D", texto: "¿Ya salieron las de octubre?", hora: "22:02", orden: 5 },
];

function Globo({ autor, texto, hora, orden }) {
  return (
    <div className={`globo animado ${autor ? "" : "globo-propio"}`} style={{ "--orden": orden }}>
      {autor && <p className="globo-autor">{autor}</p>}
      <p>{texto}</p>
      <time>{hora}</time>
    </div>
  );
}

// Lo que ve un vecino en el celular: hoy, el grupo del edificio; con habitando, su unidad.
// "llegando" esconde el último mensaje hasta que entra, como si recién llegara.
export default function PantallaVecino({ llegando }) {
  return (
    <div className="pantalla" data-solo="vecinos">
      <div className="capa capa-hoy">
        <div className="barra-estado animado">
          <span>22:05</span>
          <span />
        </div>
        <div className="chat-cabecera animado">
          <span className="avatar">
            <Icono nombre="edificio" />
          </span>
          <div>
            <p className="chat-nombre">Edificio Rivadavia 4520</p>
            <p className="chat-sub">38 participantes</p>
          </div>
        </div>
        <div className="chat-cuerpo">
          <p className="sin-leer animado" style={{ "--orden": 1 }}>
            {llegando ? 46 : 47} mensajes sin leer
          </p>
          {MENSAJES.map((mensaje) => (
            <Globo key={mensaje.hora} {...mensaje} />
          ))}
          <div className={`llega ${llegando ? "esperando" : ""}`}>
            <Globo autor="2º B" texto="¿Alguien sabe si ya salieron las expensas?" hora="22:05" orden={6} />
          </div>
        </div>
        <p className="chat-escribir animado" style={{ "--orden": 6 }}>
          Mensaje
        </p>
      </div>

      <div className="capa capa-con">
        <div className="barra-estado">
          <span>22:05</span>
          <span />
        </div>
        <div className="app-cabecera">
          <span className="app-marca">
            <Simbolo />
            Rivadavia 4520
          </span>
          <span className="app-dato">UF 7 · 3º B</span>
        </div>
        <div className="app-cuerpo">
          <p className="saludo">Hola, 3º B</p>
          <article className="tarjeta corte-14">
            <div className="fila">
              <p className="tarjeta-titulo">Octubre</p>
              <ChipEstado tipo="atencion" texto="Pendiente" />
            </div>
            <p className="monto-grande">$ 84.300</p>
            <p className="dato-chico">Vence el 10 de noviembre</p>
            <ul className="desglose">
              <li>
                <span>Expensas ordinarias</span>
                <span>$ 71.900</span>
              </li>
              <li>
                <span>
                  Arreglo del ascensor
                  <small>
                    Extraordinaria. <u>Ver factura</u>
                  </small>
                </span>
                <span>$ 12.400</span>
              </li>
            </ul>
          </article>
          <article className="tarjeta">
            <p className="tarjeta-etiqueta">
              <Icono nombre="avisos" />
              Aviso de la administración
            </p>
            <p>El ascensor vuelve a andar el jueves 5. El técnico viene a la mañana.</p>
          </article>
          <article className="tarjeta">
            <p className="tarjeta-etiqueta">
              <Icono nombre="reclamos" />
              Tu pedido de arreglo
            </p>
            <div className="fila">
              <p>Filtración en el palier</p>
              <ChipEstado tipo="proceso" texto="En curso" />
            </div>
          </article>
          <p className="app-boton corte-11">Informar un pago</p>
        </div>
      </div>
    </div>
  );
}
