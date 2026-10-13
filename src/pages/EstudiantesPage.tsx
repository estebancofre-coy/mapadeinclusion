import { assetUrl } from '@/lib/assetUrl';

export function EstudiantesPage() {
  const configuredUrl = import.meta.env.VITE_APPS_SCRIPT_URL?.trim();
  let portalUrl: string | undefined;
  if (configuredUrl && URL.canParse(configuredUrl)) {
    const url = new URL(configuredUrl);
    if (url.protocol === 'https:' && url.hostname === 'script.google.com' && url.pathname.endsWith('/exec')) {
      url.searchParams.set('portal', 'estudiantes');
      portalUrl = url.toString();
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-primary sm:text-4xl">Gestión de estudiantes</h1>
          <p className="mt-4 max-w-2xl text-lg text-foreground">
            Registra la caracterización de las organizaciones que tienes asignadas en el curso
            Trabajo Social y Discapacidad.
          </p>
        </div>
        <img
          src={assetUrl('assets/elementos/dialogo.png')}
          alt=""
          className="h-28 w-auto object-contain self-center sm:self-auto shrink-0 animate-subtle-float"
        />
      </div>

      <div className="mt-8 space-y-4 text-muted-foreground">
        <p>Ingresa con el acceso compartido del curso, selecciona tu nombre y abre una de tus organizaciones.</p>
        <p>
          Puedes guardar un borrador o enviar a revisión las respuestas A1–A18 del
          <strong className="text-foreground"> Bloque A de la pauta de entrevista</strong>.
          Los bloques B y C no se cargan en esta etapa.
        </p>
        <p>
          Las respuestas quedan en el archivo privado del curso. Enviar una ficha no la
          publica en el mapa: la revisión y validación corresponden al equipo docente.
        </p>
      </div>
      {portalUrl ? (
        <a
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={portalUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ingresar al portal de estudiantes
          <span className="sr-only"> (se abre en una pestaña nueva)</span>
        </a>
      ) : (
        <p className="mt-8 rounded-md border border-border bg-muted p-4" role="status">
          El portal de estudiantes aún no está conectado. El equipo docente debe configurar
          la URL del despliegue de Apps Script antes de recibir datos.
        </p>
      )}
      <p className="mt-6 text-sm text-muted-foreground">
        El acceso compartido identifica el curso, no verifica tu identidad individual.
        La contraseña y el listado de estudiantes no se publican en este sitio.
      </p>
    </main>
  );
}
