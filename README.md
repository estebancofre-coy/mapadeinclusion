# Visibilizar es Intervenir

**Plataforma de Organizaciones Sociales · Región de Aysén**

Mapa público de organizaciones de personas con discapacidad y neurodivergentes de la Región de Aysén (Chile), construido por estudiantes del electivo **Trabajo Social y Discapacidad (TSE013-1)** de la Universidad de Aysén, semestre 2026-II.

## Contenido del sitio

- **Mapa interactivo** de 14 organizaciones en 9 comunas (Leaflet + OpenStreetMap), con filtros por comuna/tipo/búsqueda, tabla accesible alternativa y exportación CSV.
- **El curso**: programa completo de la asignatura con unidades, evaluación y bibliografía.
- **Presentación**: deck de 12 diapositivas navegable por teclado para la primera clase.
- **Cartilla in situ**: instrumento de diagnóstico de barreras por agrupación (RAE 2).
- **Observa Chile**: marco legal y guía de campo nacional (Ley 20.422 / OGUC), con cartilla para edificios y eventos, evidencia fotográfica, puntaje automático y descarga de informe PDF. Las inspecciones se guardan en el navegador.
- **Panel de gestión**: validación de fichas, subida de nuevas organizaciones y registro de actividad (cuentas demo, datos en localStorage del navegador).

## Accesibilidad

WCAG 2.1 AA: alto contraste y texto grande persistentes, skip links, landmarks ARIA, live regions, navegación completa por teclado, tabla alternativa al mapa, `prefers-reduced-motion`.

## Identidad visual

La interfaz conserva el nombre, el propósito y los contenidos de **Visibilizar es Intervenir**. Su lenguaje visual usa la paleta y las ilustraciones ESPORA facilitadas para este trabajo; esto no supone patrocinio, operación ni aprobación de ESPORA. La atribución a la Universidad de Aysén se mantiene por su relación con el curso. No se incorporan logos de FAO.

## Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui + Leaflet
- **Backend**: Hono + tRPC 11 (en `api/`)
- **Base de datos**: Drizzle ORM + MySQL (API disponible para inspecciones; la cartilla integrada Observa Chile guarda sus datos localmente)

## Desarrollo local

```bash
npm install
cp .env.example .env   # completa DATABASE_URL con tu MySQL
npm run db:push        # crea las tablas
npm run dev            # http://localhost:3000
```

En PowerShell, usa `Copy-Item .env.example .env` para crear el archivo `.env`.

## Producción

```bash
npm run build          # compila frontend + backend a dist/
npm start              # sirve todo en el puerto 3000
```

## Publicación en GitHub Pages

Cada push a `main` ejecuta el flujo de GitHub Actions y publica el frontend estático en https://estebancofre-coy.github.io/mapadeinclusion/. Las inspecciones, cartillas y datos del panel se guardan en el navegador. GitHub Pages no ejecuta el backend Hono ni ofrece la base de datos MySQL; los endpoints `/api` no están disponibles en ese alojamiento.

## Importante al self-hostear

- **La base de datos de la plataforma Kimi no viaja con el código exportado.** Necesitas tu propia base MySQL (`DATABASE_URL` en `.env`) para usar la API `inspecciones`. La cartilla integrada Observa Chile no depende de esa base: guarda respuestas y evidencia en el almacenamiento local del navegador desde el que se completa.
- **Las cuentas del panel de gestión son de demostración** (definidas en `src/data/organizaciones.ts`) y las fichas se guardan en localStorage del navegador. Para producción con datos reales, migra ese flujo a la base de datos (la tabla y el router de `inspecciones` sirven de patrón).
- **Kimi login no está incluido** en el código exportado; requiere credenciales propias si se quiere OAuth.

## Equipo docente

Esteban Cofré (Trabajo Social) · Romina Barría (Terapia Ocupacional) · con colaboración de Cristina Barrientos (Presidenta ACIPA)

Mapas © OpenStreetMap · Logos institucionales © Universidad de Aysén
