// Lleva el foco al primer campo con error, en el orden en que aparecen en el formulario.
// Si no hay errores en campos, usa "focoPorDefecto" (por ejemplo, la contraseña en el login).
// Sirve para quien usa teclado o lector de pantalla: el foco queda donde hay que corregir.
//
// Busca el campo por id y, si no lo encuentra, por name: en un grupo de opciones (CampoOpciones)
// el id es del grupo y no de un campo, así el foco va al primer botón del grupo.
export function enfocarPrimerError(ordenCampos, errores = {}, focoPorDefecto) {
  const idCampo = ordenCampos.find((id) => errores[id]) ?? focoPorDefecto;

  if (!idCampo) {
    return;
  }

  const campo =
    document.getElementById(idCampo) ?? document.querySelector(`[name="${idCampo}"]`);
  campo?.focus();
}
