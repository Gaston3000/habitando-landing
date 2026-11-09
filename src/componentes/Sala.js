// Una sala del módulo de trama (ver lib/trama.js): un rectángulo o una sala con la esquina cortada.
export default function Sala({ sala, className }) {
  if (sala.puntos) {
    return <polygon points={sala.puntos} className={className} />;
  }

  const [x, y, ancho, alto] = sala.rect;
  return <rect x={x} y={y} width={ancho} height={alto} className={className} />;
}
