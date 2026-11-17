// Palabras cortas que no pueden quedar solas al final de un renglón ("Dejá de / preguntar" se lee cortado)
const PALABRAS_CORTAS = [
  "a", "al", "con", "de", "del", "e", "el", "en", "la", "las", "lo", "los", "mi", "no", "o", "por",
  "que", "se", "sin", "su", "tu", "u", "un", "una", "y", "ya",
];

const DESPUES_DE_CORTA = new RegExp(`(^|\\s)(${PALABRAS_CORTAS.join("|")}) `, "gi");

// Pega cada palabra corta a la siguiente con un espacio que no se corta, así ningún renglón termina en
// "de", "en", "el"... Es la regla de composición de los títulos: no depende de cómo caiga el texto en cada pantalla.
export function unirPalabrasCortas(texto) {
  // Dos pasadas: en "y a la" una palabra corta sigue a otra, y la primera pasada no las alcanza todas
  return texto.replace(DESPUES_DE_CORTA, "$1$2 ").replace(DESPUES_DE_CORTA, "$1$2 ");
}
