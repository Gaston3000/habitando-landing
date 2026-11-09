// Módulo de la trama de planta (recurso "trama-planta", 360 x 240): cada sala con su tono.
// Los rectángulos son [x, y, ancho, alto]; los polígonos, la lista de puntos (son las salas con la
// esquina cortada a 30°). El tono (1, 2 o 3) es el de la versión clara del recurso.
export const ANCHO_MODULO = 360;
export const ALTO_MODULO = 240;

export const SALAS = [
  { rect: [5, 5, 60, 30], tono: 1 },
  { rect: [75, 5, 30, 30], tono: 1 },
  { rect: [5, 45, 30, 80], tono: 1 },
  { rect: [45, 45, 60, 30], tono: 1 },
  { rect: [45, 85, 60, 40], tono: 1 },
  { puntos: "5,149.435 30,135 55,135 55,175 5,175", tono: 1 },
  { rect: [5, 185, 50, 50], tono: 2 },
  { rect: [65, 135, 40, 30], tono: 1 },
  { rect: [65, 175, 40, 60], tono: 2 },
  { rect: [115, 5, 40, 40], tono: 2 },
  { rect: [115, 55, 40, 40], tono: 1 },
  { puntos: "165,19.435 190,5 225,5 225,45 165,45", tono: 3 },
  { rect: [165, 55, 60, 40], tono: 3 },
  { rect: [115, 105, 60, 80], tono: 2 },
  { puntos: "185,119.435 210,105 225,105 225,185 185,185", tono: 1 },
  { rect: [115, 195, 60, 40], tono: 1 },
  { rect: [185, 195, 40, 40], tono: 2 },
  { rect: [235, 5, 30, 50], tono: 2 },
  { rect: [235, 65, 30, 60], tono: 2 },
  { rect: [275, 5, 80, 70], tono: 1 },
  { puntos: "275,99.435 300,85 355,85 355,125 275,125", tono: 1 },
  { rect: [235, 135, 50, 60], tono: 3 },
  { rect: [235, 205, 50, 30], tono: 3 },
  { rect: [295, 135, 60, 50], tono: 1 },
  { rect: [295, 195, 60, 40], tono: 1 },
];

// La unidad que se resalta del lado del vecino: la sala con la esquina cortada de abajo a la izquierda.
export const SALA_TUYA = 5;
const CENTRO_TUYA = [30, 155];

// Repite el módulo hasta cubrir un área de ancho x alto (con un módulo de sobra para cada lado,
// así el zoom nunca deja ver el borde) y elige en qué módulo está "tu unidad":
// a la derecha del héroe, donde queda cerca del teléfono.
export function armarPlano(ancho, alto) {
  const angosto = ancho < 900;
  const columnas = Math.ceil(ancho / ANCHO_MODULO) + 3;
  const filas = Math.ceil(alto / ALTO_MODULO) + 3;
  const columnaTuya = Math.round((ancho * (angosto ? 0.7 : 0.66) - CENTRO_TUYA[0]) / ANCHO_MODULO) + 1;
  const filaTuya = Math.round((alto * (angosto ? 0.72 : 0.45) - CENTRO_TUYA[1]) / ALTO_MODULO) + 1;

  const modulos = [];
  for (let fila = 0; fila < filas; fila++) {
    for (let columna = 0; columna < columnas; columna++) {
      modulos.push({
        x: (columna - 1) * ANCHO_MODULO,
        y: (fila - 1) * ALTO_MODULO,
        tuyo: columna === columnaTuya && fila === filaTuya,
      });
    }
  }

  const moduloTuyo = modulos.find((modulo) => modulo.tuyo);
  return { modulos, unidad: { x: moduloTuyo.x + CENTRO_TUYA[0], y: moduloTuyo.y + CENTRO_TUYA[1] } };
}
