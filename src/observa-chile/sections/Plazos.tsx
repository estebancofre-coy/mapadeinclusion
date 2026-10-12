import { timeline } from "@/observa-chile/data/content";

export default function Plazos() {
  return (
    <section id="plazos" className="scroll-mt-20 py-16 sm:py-24">
      <div className="section-shell">
        <p className="section-eyebrow">Vigencia normativa</p>
        <h2 className="font-serif-display mt-2 text-3xl font-semibold text-foreground sm:text-4xl">
          Línea de tiempo de plazos de adecuación
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          La antigüedad del edificio determina su obligación legal. Verifica el año
          de construcción antes de evaluar.
        </p>

        <ol className="relative mt-12 space-y-8 border-l-2 border-primary/20 pl-8 sm:pl-10">
          {timeline.map((h) => (
            <li key={h.anio} className="relative">
              <span className="absolute -left-[41px] top-1 h-4 w-4 rounded-full border-4 border-background bg-accent sm:-left-[49px]" />
              <p className="font-serif-display text-lg font-semibold text-primary">{h.anio}</p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">{h.titulo}</p>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">{h.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
