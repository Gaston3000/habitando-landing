# habitando · landing

Página de presentación de habitando, con una versión para vecinos y otra para administraciones.
Es un proyecto aparte de la app: no se conecta con la base de datos ni con el login.

Está hecha con lo mismo que la app (Next.js con React en JavaScript y Tailwind CSS) y sigue sus
convenciones de código (`info/convenciones-de-codigo.md` en el repo de la app).

## Cómo correrla

```bash
npm install
npm run dev
```

Antes de subir cambios, `npm run lint` y `npm run build` tienen que pasar sin errores.

## Estructura de carpetas

```
src/app          La página, el layout y el ícono
src/componentes  Cada sección de la landing y sus piezas
src/lib          Datos de la trama y del logo, clases compartidas y el estado de la página
src/estilos      tema.css (copia del de la app, no se toca) y landing.css (lo propio de la landing)
```

## La bienvenida (animación de entrada)

Las dos torres del logo suben desde el piso, se cortan a 30° y vuelan al logo del encabezado.
Está repartida en cuatro lugares:

- `src/componentes/Bienvenida.js`: la animación (los tiempos de cada tramo y el vuelo final).
- `src/lib/isologo.js`: las coordenadas de las torres y las letras del logo oficial.
- `src/estilos/landing.css`, sección 5: el fondo, el tamaño del símbolo y cómo espera el logo del encabezado.
- `src/app/layout.js`: decide antes de pintar si se muestra (una vez por visita y nunca con movimiento reducido).

## Cómo funcionan los dos perfiles

Las dos versiones de cada sección están en la página: cada una lleva `data-solo="vecinos"` o
`data-solo="administraciones"`, y se ve la del perfil marcado en `<html data-perfil="...">`.
El perfil se lee de la dirección (`#vecinos` o `#administraciones`) antes de pintar, así no parpadea.

## Publicación

Está en Vercel, en el proyecto `habitando-landing`. Para subir una versión nueva:

```bash
vercel deploy --prod
```
