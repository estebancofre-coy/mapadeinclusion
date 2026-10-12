import { Scale } from "lucide-react";
import { leyCards } from "@/observa-chile/data/content";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MarcoLegal() {
  return (
    <section id="marco-legal" className="scroll-mt-20 py-16 sm:py-24">
      <div className="section-shell">
        <p className="section-eyebrow">Fundamentos</p>
        <h2 className="font-serif-display mt-2 text-3xl font-semibold text-foreground sm:text-4xl">
          Marco legal: Ley N° 20.422
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          La accesibilidad no es una obra de caridad ni un favor: es un derecho humano
          consagrado en la Convención sobre los Derechos de las Personas con
          Discapacidad (Art. 9) y en la legislación chilena. Su ausencia constituye discriminación.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {leyCards.map((c) => (
            <Card key={c.articulo} className="paper-card border-t-4 border-t-primary">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-secondary text-primary hover:bg-secondary">{c.articulo}</Badge>
                  <Scale className="h-4 w-4 text-accent" />
                </div>
                <CardTitle className="font-serif-display text-lg">{c.titulo}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                {c.parrafos.map((p, i) => (
                  <p key={i} className={p.startsWith("“") ? "border-l-2 border-accent pl-3 italic" : ""}>
                    {p}
                  </p>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
