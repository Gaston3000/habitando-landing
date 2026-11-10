"use client";

import { useState } from "react";
import CampoFormulario from "@/componentes/CampoFormulario";
import { CLASES_BOTON } from "@/lib/clases";
import { enfocarPrimerError } from "@/lib/foco";

const ORDEN_CAMPOS = ["nombre", "mail", "unidades"];

function revisarDatos({ nombre, mail, unidades }) {
  const errores = {};

  if (!nombre.trim()) errores.nombre = "Escribí tu nombre.";

  if (!mail.trim()) errores.mail = "Escribí tu mail.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail.trim())) errores.mail = "Revisá el mail: le falta algo (por ejemplo, la @).";

  const cantidad = unidades.trim().replace(/\./g, "");
  if (!cantidad) errores.unidades = "Contanos cuántas unidades administrás, aunque sea aproximado.";
  else if (!/^\d+$/.test(cantidad) || Number(cantidad) < 1) errores.unidades = "Escribí un número, por ejemplo 240.";

  return errores;
}

// Pedido de demo de una administración. Como la landing es una propuesta, todavía no se envía:
// se revisan los datos y se avisa.
export default function FormularioDemo({ className }) {
  const [errores, setErrores] = useState({});
  const [nombreEnviado, setNombreEnviado] = useState(null);

  function enviar(evento) {
    evento.preventDefault();
    const datos = Object.fromEntries(new FormData(evento.currentTarget));
    const nuevosErrores = revisarDatos(datos);
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      setNombreEnviado(null);
      enfocarPrimerError(ORDEN_CAMPOS, nuevosErrores);
      return;
    }
    setNombreEnviado(datos.nombre.trim().split(" ")[0]);
  }

  return (
    <form onSubmit={enviar} noValidate className={className}>
      {/* Nombre y mail en una fila; las unidades con el botón al lado: los mismos datos, más rápidos de completar */}
      <div className="grid gap-4.5 sm:grid-cols-2 sm:gap-4">
        <CampoFormulario id="nombre" etiqueta="Tu nombre" autoComplete="name" error={errores.nombre} />
        <CampoFormulario id="mail" etiqueta="Tu mail" tipo="email" autoComplete="email" error={errores.mail} />
      </div>
      <div className="grid gap-4.5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-4">
        <CampoFormulario
          id="unidades"
          etiqueta="Unidades que administrás"
          inputMode="numeric"
          placeholder="Ej.: 240"
          error={errores.unidades}
        />
        {/* El margen lo baja a la altura del campo, debajo de la etiqueta */}
        <button type="submit" className={`${CLASES_BOTON} justify-self-start sm:mt-7.5`}>
          Pedir una demo
        </button>
      </div>
      <p aria-live="polite" className="min-h-[1.4em] text-[0.92rem] font-medium text-exito-texto">
        {nombreEnviado &&
          `Gracias, ${nombreEnviado}. Esta página es una propuesta, así que el pedido todavía no se envía.`}
      </p>
    </form>
  );
}
