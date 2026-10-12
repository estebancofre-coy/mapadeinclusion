import { normasOguc } from "@/observa-chile/data/content";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function NormasOguc() {
  return (
    <section id="normas" className="scroll-mt-20 bg-white py-16 sm:py-24">
      <div className="section-shell">
        <p className="section-eyebrow">Normativa técnica</p>
        <h2 className="font-serif-display mt-2 text-3xl font-semibold text-foreground sm:text-4xl">
          Normas técnicas OGUC
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Ordenanza General de Urbanismo y Construcciones, actualizada por los
          Decretos 50/2015 y 30/2023. Son de cumplimiento obligatorio para obras
          nuevas; los edificios existentes deben ajustarse gradualmente.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
          <Accordion type="multiple" defaultValue={["oguc-1"]} className="space-y-3">
            {normasOguc.map((n) => (
              <AccordionItem
                key={n.id}
                value={n.id}
                className="paper-card overflow-hidden px-5"
              >
                <AccordionTrigger className="py-4 text-left font-serif-display text-base font-semibold text-primary hover:no-underline">
                  {n.titulo}
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <dl className="space-y-3">
                    {n.puntos.map((p) => (
                      <div key={p.label} className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
                        <dt className="w-40 shrink-0 text-sm font-semibold text-foreground">
                          {p.label}
                        </dt>
                        <dd className="text-sm text-muted-foreground">{p.detalle}</dd>
                      </div>
                    ))}
                  </dl>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl bg-secondary/10 p-5">
              <p className="text-sm font-semibold text-foreground">Nota importante</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Para edificios existentes, la Ley 20.422 establece adecuación
                “gradual”. La falta de presupuesto no es excusa para no realizar
                ajustes razonables de bajo costo.
              </p>
            </div>
            <div className="paper-card p-5">
              <p className="text-sm font-semibold text-foreground">Medidas clave para terreno</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>· Vereda: ancho mínimo 1,20 m</li>
                <li>· Rampa: pendiente máxima 12%</li>
                <li>· Puerta: ancho libre 0,90 m</li>
                <li>· Giro silla de ruedas: Ø 1,50 m</li>
                <li>· Estacionamiento: 5,00 × 2,50 m</li>
                <li>· Braille: altura 1,40–1,60 m</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
