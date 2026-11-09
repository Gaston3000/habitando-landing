// Íconos de la marca (carpeta "iconos/app"). Son formas llenas con el corte de 30°.
// Toman el color del texto que los rodea.
const ICONOS = {
  edificio:
    "M6.62,4.97235 L11.7758,2 L11.7758,22 L6.62,22 Z M12.2224,8.17053 L17.3812,11.1544 L17.3812,22 L12.2214,22 Z M8.2,12 L10.2,12 L10.2,14 L8.2,14 Z M8.2,16 L10.2,16 L10.2,18 L8.2,18 Z M13.8,16 L15.8,16 L15.8,18 L13.8,18 Z",
  unidad: "M6,4.3096 L10,2 L18,2 L18,22 L6,22 Z M14,12 L16,12 L16,14 L14,14 Z",
  vecinos:
    "M3.5,6 a3,3 0 1,0 6,0 a3,3 0 1,0 -6,0 Z M14.5,6 a3,3 0 1,0 6,0 a3,3 0 1,0 -6,0 Z M2,13.3096 L6,11 L11,11 L11,22 L2,22 Z M13,13.3096 L17,11 L22,11 L22,22 L13,22 Z",
  expensas:
    "M5,4.3096 L9,2 L19,2 L19,22 L5,22 Z M9,8 L15,8 L15,10 L9,10 Z M9,12 L15,12 L15,14 L9,14 Z M9,16 L13,16 L13,18 L9,18 Z",
  pagos:
    "M9,6.2 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0 Z M16,3.9 L12.3,3.9 L12.3,6.8 L14.6,6.8 L14.6,7.3 L12,7.3 L12,8.6 L15.9,8.6 L15.9,5.5 L13.6,5.5 L13.6,5.2 L16,5.2 Z M13.5,2.6 L14.5,2.6 L14.5,3.9 L13.5,3.9 Z M13.5,8.6 L14.5,8.6 L14.5,10 L13.5,10 Z M6.6,14.6 L10,13.4 L14.6,13.4 L15.6,14.9 L19.6,12.6 L21.4,12.4 L22.2,13.9 L16.6,19.6 L8.6,20.8 Z M11.2,16.1 L15.2,16.1 L14.2,17.3 L11.2,17.3 Z M1.6,15.6 L4.6,14.6 L6.6,20.6 L3.6,21.6 Z",
  avisos:
    "M2,9.5 L4,9.5 L4,8 L10,8 L10,16 L4,16 L4,14.5 L2,14.5 Z M12,8 L21.5,2.5 L21.5,21.5 L12,16 Z M5,18 L9,18 L10.6,22.5 L6.6,22.5 Z",
  reclamos: "M2,6.31 L6,4 L22,4 L22,17 L11,17 L6,22 L6,17 L2,17 Z M11,7 L13,7 L13,11 L11,11 Z M11,13 L13,13 L13,15 L11,15 Z",
  documentos: "M2,4 L9,4 L13.33,6.5 L22,6.5 L22,20 L2,20 Z",
};

export default function Icono({ nombre, className = "" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d={ICONOS[nombre]} />
    </svg>
  );
}
