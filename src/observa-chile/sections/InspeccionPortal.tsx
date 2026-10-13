import Inspeccion from "@/observa-chile/sections/Inspeccion";

const appsScriptUrl = import.meta.env.VITE_APPS_SCRIPT_URL?.trim();

export default function InspeccionPortal() {
  if (!appsScriptUrl) {
    return (
      <>
        <section className="border-y border-amber-300 bg-amber-50 py-5">
          <div className="section-shell text-sm leading-relaxed text-amber-950">
            <strong>Portal privado aún no configurado.</strong> Esta versión guarda las
            respuestas únicamente en este navegador. No uses este formulario para enviar
            información sensible hasta que se habilite el portal de Google.
          </div>
        </section>
        <Inspeccion />
      </>
    );
  }

  return (
    <section id="inspeccion" className="scroll-mt-20 py-16 sm:py-24">
      <div className="section-shell">
        <p className="section-eyebrow">Instrumento de evaluación</p>
        <h2 className="font-serif-display mt-2 text-3xl font-semibold text-foreground sm:text-4xl">
          Cartilla de inspección
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Completa la cartilla en el portal de inspección. Las respuestas y evidencias
          se almacenan en archivos privados del equipo responsable; no se publican en el
          mapa.
        </p>
        <a
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={appsScriptUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Abrir portal privado de inspección
          <span className="sr-only"> (se abre en una pestaña nueva)</span>
        </a>
      </div>
    </section>
  );
}
