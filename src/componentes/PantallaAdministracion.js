import ChipEstado from "@/componentes/ChipEstado";
import Icono from "@/componentes/Icono";
import Simbolo from "@/componentes/Simbolo";

// Íconos de las notificaciones del celular (trazo, como los del sistema del teléfono)
const ICONOS_NOTIFICACION = {
  llamada: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
  mensaje: <path d="M4 5h16v11H9l-5 4z" />,
  mail: (
    <>
      <path d="M3 6h18v12H3z" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
};

const NOTIFICACIONES = [
  { icono: "llamada", de: "Teléfono", cuando: "ahora", texto: "14 llamadas perdidas" },
  { icono: "mensaje", de: "3º B, Rivadavia", cuando: "2 min", texto: "¿Ya salieron las expensas?" },
  { icono: "mail", de: "Mail, 12 nuevos", cuando: "8 min", texto: "Consulta expensas octubre" },
  { icono: "mensaje", de: "1º A, Rivadavia", cuando: "15 min", texto: "Te mandé el comprobante por mail, ¿lo viste?" },
  { icono: "mensaje", de: "PB C, Laprida", cuando: "21 min", texto: "¿Ya salieron las expensas?" },
  { icono: "mensaje", de: "5º D, Rivadavia", cuando: "34 min", texto: "El ascensor sigue sin andar" },
];

const PAGOS = [
  { unidad: "UF 7 · 3º B", monto: "$ 84.300", detalle: "Transferencia, hace 5 minutos" },
  { unidad: "UF 2 · 1º A", monto: "$ 61.200", detalle: "Depósito, informado por el vecino" },
  { unidad: "UF 3 · PB C", monto: "$ 23.000", detalle: "Efectivo, pago parcial" },
];

function Notificacion({ icono, de, cuando, texto, orden }) {
  return (
    <div className="notificacion animado" style={{ "--orden": orden }}>
      <span className="notificacion-icono">
        <svg aria-hidden="true" viewBox="0 0 24 24">
          {ICONOS_NOTIFICACION[icono]}
        </svg>
      </span>
      <span className="notificacion-de">{de}</span>
      <span className="notificacion-cuando">{cuando}</span>
      <span className="notificacion-texto">{texto}</span>
    </div>
  );
}

// Lo que ve la administración en el celular: hoy, la pantalla bloqueada llena de consultas;
// con Habitando, las expensas publicadas y los pagos que van entrando.
export default function PantallaAdministracion({ llegando }) {
  return (
    <div className="pantalla" data-solo="administraciones">
      <div className="capa capa-hoy bloqueo">
        <div className="barra-estado animado">
          <span />
          <span />
        </div>
        <p className="hora animado">22:47</p>
        <p className="fecha animado">viernes 30 de octubre</p>
        <ul className="notificaciones">
          {NOTIFICACIONES.map((notificacion, indice) => (
            <li key={notificacion.cuando}>
              <Notificacion {...notificacion} orden={indice + 1} />
            </li>
          ))}
          <li className={`llega ${llegando ? "esperando" : ""}`}>
            <Notificacion icono="mensaje" de="2º B, Laprida" cuando="ahora" texto="¿Ya salieron las expensas?" orden={7} />
          </li>
        </ul>
      </div>

      <div className="capa capa-con">
        <div className="barra-estado">
          <span>22:47</span>
          <span />
        </div>
        <div className="app-cabecera">
          <span className="app-marca">
            <Simbolo />
            Rivadavia 4520
          </span>
          <span className="app-dato">Octubre</span>
        </div>
        <div className="app-cuerpo">
          <p className="aviso-publicado">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12l5 5L20 7" />
            </svg>
            Expensas de octubre publicadas. Las 24 unidades ya ven su detalle.
          </p>
          <div className="indicadores">
            <div className="indicador">
              <b>17</b>
              <ChipEstado tipo="exito" texto="Al día" tamano="text-[9.5px]" />
            </div>
            <div className="indicador">
              <b>5</b>
              <ChipEstado tipo="atencion" texto="Pendientes" tamano="text-[9.5px]" />
            </div>
            <div className="indicador">
              <b>2</b>
              <ChipEstado tipo="peligro" texto="Vencidas" tamano="text-[9.5px]" />
            </div>
          </div>
          <article className="tarjeta corte-14">
            <p className="tarjeta-titulo">Últimos pagos</p>
            <ul className="pagos">
              {PAGOS.map((pago) => (
                <li key={pago.unidad}>
                  <span>{pago.unidad}</span>
                  <b>{pago.monto}</b>
                  <small>{pago.detalle}</small>
                </li>
              ))}
            </ul>
          </article>
          <article className="tarjeta">
            <p className="tarjeta-etiqueta">
              <Icono nombre="pagos" />
              Por cobrar este mes
            </p>
            <p className="monto-grande">$ 498.700</p>
          </article>
        </div>
      </div>
    </div>
  );
}
