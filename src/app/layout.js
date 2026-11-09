import { Bitter, Chivo } from "next/font/google";
import "./globals.css";

const bitter = Bitter({
  variable: "--font-bitter",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const chivo = Chivo({
  variable: "--font-chivo",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "habitando",
  description: "Expensas, avisos y reclamos del edificio en un solo lugar, para vecinos y administraciones.",
};

// Corre antes de pintar la página, así no parpadea:
// - marca el perfil que viene en la dirección (#vecinos o #administraciones);
// - decide si se muestra la bienvenida (una vez por visita, y nunca con movimiento reducido).
const PREPARAR_PAGINA = `(function () {
  var raiz = document.documentElement;
  raiz.dataset.perfil = location.hash === "#administraciones" ? "administraciones" : "vecinos";
  var reducir = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var vista = false;
  try { vista = sessionStorage.getItem("habitando-bienvenida") === "si"; } catch (e) {}
  if (!reducir && !vista) raiz.classList.add("bienvenida-activa");
})();`;

export default function LayoutRaiz({ children }) {
  return (
    // suppressHydrationWarning: el script de arriba cambia <html> antes de que cargue React.
    <html lang="es" className={`${bitter.variable} ${chivo.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREPARAR_PAGINA }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
