import { useCallback } from 'react';
import Cierre from '@/observa-chile/sections/Cierre';
import GuiaCampo from '@/observa-chile/sections/GuiaCampo';
import Hero from '@/observa-chile/sections/Hero';
import Inspeccion from '@/observa-chile/sections/Inspeccion';
import MarcoLegal from '@/observa-chile/sections/MarcoLegal';
import NormasOguc from '@/observa-chile/sections/NormasOguc';
import Plazos from '@/observa-chile/sections/Plazos';

const SECCIONES = [
  ['marco-legal', 'Marco legal'],
  ['normas', 'Normas OGUC'],
  ['plazos', 'Plazos'],
  ['guia', 'Guía de campo'],
  ['inspeccion', 'Cartilla'],
] as const;

export function ObservaPage() {
  const irASeccion = useCallback((id: string) => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(id)?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  }, []);

  return (
    <main className="observa-chile" aria-label="Observa Chile — Accesibilidad universal">
      <Hero irASeccion={irASeccion} />
      <nav className="sticky top-16 z-40 border-y bg-background/95 backdrop-blur" aria-label="Secciones de Observa Chile">
        <div className="section-shell flex gap-1 overflow-x-auto py-2">
          {SECCIONES.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => irASeccion(id)}
              className="shrink-0 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {label}
            </button>
          ))}
        </div>
      </nav>
      <section className="border-b bg-muted/50 py-5" aria-label="Vínculo con el curso">
        <div className="section-shell text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Desde Aysén al país.</strong> Recurso de trabajo de campo del electivo
          Trabajo Social y Discapacidad (TSE013-1), Universidad de Aysén. La cartilla permite registrar barreras
          con evidencia y convertir los hallazgos en acciones de accesibilidad.
        </div>
      </section>
      <MarcoLegal />
      <NormasOguc />
      <Plazos />
      <GuiaCampo />
      <Inspeccion />
      <Cierre />
    </main>
  );
}
