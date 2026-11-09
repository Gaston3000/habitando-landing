"use client";

import { useSyncExternalStore } from "react";

// Estado de la página que vive en <html>, porque se decide antes de que cargue React (ver layout.js):
// - data-perfil: "vecinos" o "administraciones";
// - la clase "bienvenida-activa": mientras se ve la animación del logo.
// Los componentes lo leen con usePerfil y useBienvenidaActiva, y lo cambian con ponerPerfil y ponerBienvenida.

const EVENTO = "cambio-en-pagina";

function suscribir(avisar) {
  window.addEventListener(EVENTO, avisar);
  return () => window.removeEventListener(EVENTO, avisar);
}

function avisarCambio() {
  window.dispatchEvent(new Event(EVENTO));
}

export function leerPerfil() {
  return document.documentElement.dataset.perfil === "administraciones" ? "administraciones" : "vecinos";
}

export function ponerPerfil(perfil) {
  document.documentElement.dataset.perfil = perfil;
  avisarCambio();
}

export function usePerfil() {
  return useSyncExternalStore(suscribir, leerPerfil, () => "vecinos");
}

function leerBienvenida() {
  return document.documentElement.classList.contains("bienvenida-activa");
}

export function ponerBienvenida(activa) {
  document.documentElement.classList.toggle("bienvenida-activa", activa);
  avisarCambio();
}

// En el servidor todavía no se sabe: se toma como activa, así la escena no arranca antes de tiempo.
export function useBienvenidaActiva() {
  return useSyncExternalStore(suscribir, leerBienvenida, () => true);
}

const CONSULTA_MOVIMIENTO = "(prefers-reduced-motion: reduce)";

function suscribirMovimiento(avisar) {
  const consulta = window.matchMedia(CONSULTA_MOVIMIENTO);
  consulta.addEventListener("change", avisar);
  return () => consulta.removeEventListener("change", avisar);
}

// true si la persona pidió menos movimiento en su sistema: no hay animaciones automáticas.
export function useMovimientoReducido() {
  return useSyncExternalStore(
    suscribirMovimiento,
    () => window.matchMedia(CONSULTA_MOVIMIENTO).matches,
    () => false
  );
}
