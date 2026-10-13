# Visibilizar es Intervenir

**Plataforma de Organizaciones Sociales · Región de Aysén**

Mapa público de organizaciones de personas con discapacidad y neurodivergentes de la Región de Aysén (Chile), construido por estudiantes del electivo **Trabajo Social y Discapacidad (TSE013-1)** de la Universidad de Aysén, semestre 2026-II.

## Contenido del sitio

- **Mapa interactivo** de 14 organizaciones en 9 comunas (Leaflet + OpenStreetMap), con filtros por comuna/tipo/búsqueda, tabla accesible alternativa y exportación CSV.
- **El curso**: programa completo de la asignatura con unidades, evaluación y bibliografía.
- **Presentación**: deck de 12 diapositivas navegable por teclado para la primera clase.
- **Cartilla in situ**: instrumento de diagnóstico de barreras por agrupación (RAE 2).
- **Observa Chile**: marco legal y guía de campo nacional (Ley 20.422 / OGUC), con cartilla para edificios y eventos, evidencia fotográfica, puntaje automático y descarga de informe PDF. Cuando se despliega Apps Script y se configura su URL, el portal guarda respuestas y fotos en una hoja y carpeta privadas de Google Drive.
- **Panel de gestión**: validación de fichas, subida de nuevas organizaciones y registro de actividad (cuentas demo, datos en localStorage del navegador).
- **Ingreso de estudiantes**: portal de Apps Script con acceso compartido, identificación por listado del curso, organizaciones asignadas, avances y carga estandarizada A1–A18. Los borradores y envíos quedan en Sheets, no en el mapa público.

## Accesibilidad

WCAG 2.1 AA: alto contraste y texto grande persistentes, skip links, landmarks ARIA, live regions, navegación completa por teclado, tabla alternativa al mapa, `prefers-reduced-motion`.

## Identidad visual

La interfaz conserva el nombre, el propósito y los contenidos de **Visibilizar es Intervenir**. Su lenguaje visual usa la paleta y las ilustraciones ESPORA facilitadas para este trabajo; esto no supone patrocinio, operación ni aprobación de ESPORA. La atribución a la Universidad de Aysén se mantiene por su relación con el curso. No se incorporan logos de FAO.

## Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui + Leaflet
- **Backend**: Apps Script + Google Sheets + Drive para inspecciones; Hono + tRPC 11 y Drizzle ORM + MySQL siguen disponibles para desarrollo/self-hosting.

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

Cada push a `main` ejecuta el flujo de GitHub Actions y publica el frontend estático en https://estebancofre-coy.github.io/mapadeinclusion/. GitHub Pages no ejecuta Apps Script, Hono ni ofrece la base de datos MySQL. El enlace al portal Apps Script se configura con la variable pública de repositorio `VITE_APPS_SCRIPT_URL`; si no está configurada, la cartilla informa que solo guarda localmente.

### Configurar el almacenamiento privado de inspecciones

1. Crea un proyecto independiente en [Google Apps Script](https://script.google.com/) y copia `apps-script/Code.gs`, `apps-script/Index.html` y `apps-script/appsscript.json` en el proyecto.
2. En Apps Script, ejecuta `initializeStorage` desde la cuenta propietaria y autoriza los permisos de Drive y Sheets. Esto crea una carpeta privada, una hoja de cálculo dentro de ella y las propiedades necesarias para la aplicación.
3. Comparte la carpeta de Drive únicamente con las cuentas Google autorizadas del equipo. No habilites acceso público ni enlaces para “cualquier persona”.
4. Despliega como aplicación web que se ejecuta como la cuenta propietaria y permite acceso anónimo para recibir envíos públicos. La aplicación solo expone una operación de escritura; no tiene endpoints públicos para consultar ni descargar inspecciones.
5. Guarda la URL del despliegue como variable de repositorio `VITE_APPS_SCRIPT_URL` en **Settings → Secrets and variables → Actions → Variables** y vuelve a publicar Pages. La URL no es una credencial secreta.

El formulario comprime las fotos en el navegador y las guarda como archivos privados de Drive; la hoja almacena metadatos e identificadores, no las imágenes base64. El informe PDF se descarga en el dispositivo y no se sube a Drive. GitHub Pages sirve el formulario dentro del portal Apps Script mediante `postMessage`; el navegador no llama directamente a la API de Apps Script ni recibe permisos de lectura. Los envíos anónimos consumen las cuotas de la cuenta propietaria; esta configuración está pensada para un piloto y conviene supervisar el uso y revisar periódicamente el acceso y retención de los datos.

### Activar el portal de estudiantes

El portal se sirve directamente desde Apps Script con `?portal=estudiantes`; no usa cuentas demo ni valida contraseñas en React. Mantiene separado el instrumento de inspección de accesibilidad y el **IV. Bloque A de la pauta de entrevista de organizaciones**. No recibe respuestas de los bloques B, C ni D, ni documentos cualitativos.

1. Actualiza `Code.gs` en el proyecto de Apps Script existente; agrega `Students.gs` y el archivo HTML `Student` (o `Students`). Conserva `Index.html` y actualiza `appsscript.json` (activa su visualización desde Configuración del proyecto). No vuelvas a crear otra hoja de inspecciones.
2. Ejecuta `prepareStudentPortal` desde el editor con la cuenta propietaria. Agrega las pestañas privadas **Asignaciones Estudiantes** y **Caracterizacion Bloque A** a la hoja creada anteriormente; no borra inspecciones ni avances.
3. Sube el Excel de asignaciones a Drive y conviértelo a Google Sheets con **Archivo → Guardar como Hojas de cálculo de Google**. En Configuración del proyecto → Propiedades de la secuencia de comandos, define `STUDENTS_WORKBOOK_ID` con el ID de ese documento convertido (la parte entre `/d/` y `/edit` de su URL). Conserva sus pestañas y encabezados originales.
4. Ejecuta `importStudentWorkbook`. Importa **Resumen por Estudiante** y **Gestión de Avances**: el libro facilitado contiene 12 estudiantes y 35 organizaciones, con siete etapas de avance. Preserva los estados previos, incluido **No Aplica**, y la bitácora; no importa teléfonos ni correos al portal. Rechaza discrepancias o una reimportación que sobrescribiría trabajo existente.
5. Define la propiedad temporal `STUDENTS_INITIAL_PASSWORD` con la contraseña compartida acordada por el curso. Ejecuta `configureStudentAccess`: configura el usuario **Estudiantes**, guarda un derivado PBKDF2 con sal, borra la propiedad temporal y revoca sesiones anteriores. La contraseña no debe incluirse en archivos, variables `VITE_*`, el repositorio ni la hoja de cálculo.
6. En **Implementar → Gestionar implementaciones → Editar**, elige **Nueva versión** y actualiza la aplicación web existente. Debe ejecutarse como la cuenta propietaria, con acceso público al portal de ingreso; la hoja y la carpeta permanecen privadas. Autoriza los permisos actualizados.
7. La variable de Actions `VITE_APPS_SCRIPT_URL` debe contener la URL `/exec` del despliegue. El sitio agrega `?portal=estudiantes` al enlace. Publica los cambios del frontend para que aparezca **Ingresar estudiantes**.

El estudiante selecciona su nombre, abre una organización asignada y guarda un borrador o envía a revisión. Las opciones corresponden a A1–A18, con campos condicionales para «Otra», selección múltiple y un indicador separado **No informado**: no confunde ausencia de información con cero. Cada guardado añade una versión; se comprueba la asignación en el servidor, se rechazan ediciones simultáneas desactualizadas y los reintentos no duplican el envío. Las primeras cinco etapas son editables; la sexta se actualiza con el guardado y la séptima queda reservada a docencia. El equipo puede marcar **Validación Info Orgs** como **Completado** en la pestaña privada para cerrar una ficha; reabrirla requiere cambiar ese estado. Validar no publica automáticamente el contenido.

**Limitación del acceso compartido:** elegir un nombre atribuye el trabajo, pero no demuestra quién lo envió. Cualquier persona que conozca la clave puede seleccionar otro nombre y acceder a sus fichas del Bloque A. No se deben cargar testimonios, diagnósticos individuales ni información sensible de estudiantes. La clave compartida solicitada es débil para uso permanente; el bloqueo de intentos y las sesiones temporales son resguardos de piloto, no sustituyen cuentas individuales. Las sesiones expiran como máximo en seis horas (la caché puede revocarlas antes), no se guardan en el navegador y cinco fallos consecutivos bloquean el acceso compartido durante 15 minutos.

La importación y configuración se ejecutan desde el editor por la cuenta propietaria; no pueden invocarse por estudiantes. El listado real queda en Sheets y no se incorpora al repositorio ni al frontend público. Las organizaciones recibidas permanecen privadas y pendientes de revisión: este flujo no actualiza todavía el mapa público.

Para ejecutar las pruebas del portal sin acceder a Google ni a datos reales: `node --test apps-script\tests\students.cjs`. Se emplean identidades sintéticas.

## Importante al self-hostear

- **La base de datos de la plataforma Kimi no viaja con el código exportado.** Necesitas tu propia base MySQL (`DATABASE_URL` en `.env`) para usar el backend Hono/MySQL. El router MySQL de inspecciones no se monta en la API porque no incluye autenticación de lectura; usa Apps Script + Sheets + Drive para persistir inspecciones privadas.
- **Las cuentas del panel de gestión son de demostración** (definidas en `src/data/organizaciones.ts`) y las fichas se guardan en localStorage del navegador. Para producción con datos reales, migra ese flujo a un backend con autenticación.
- **Kimi login no está incluido** en el código exportado; requiere credenciales propias si se quiere OAuth.

## Equipo docente

Esteban Cofré (Trabajo Social) · Romina Barría (Terapia Ocupacional) · con colaboración de Cristina Barrientos (Presidenta ACIPA)

Mapas © OpenStreetMap · Logos institucionales © Universidad de Aysén
