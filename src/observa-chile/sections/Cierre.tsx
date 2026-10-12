import { FileCheck2, Gavel } from "lucide-react";
import { estructuraInforme, viasDenuncia } from "@/observa-chile/data/content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Cierre() {
  return (
    <section id="cierre" className="scroll-mt-20 bg-white py-16 sm:py-24">
      <div className="section-shell">
        <p className="section-eyebrow">Del terreno a la acción</p>
        <h2 className="font-serif-display mt-2 text-3xl font-semibold text-foreground sm:text-4xl">
          Informe final y vías de denuncia
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          El PDF descargado sigue esta estructura y puede ser la base de una
          denuncia formal, una carta al alcalde o una solicitud de información pública.
        </p>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <Card className="paper-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif-display text-lg text-primary">
                <FileCheck2 className="h-5 w-5 text-accent" /> Estructura del informe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {estructuraInforme.map((p, i) => (
                  <li key={p.paso} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <span>
                      <strong className="text-foreground">{p.paso}:</strong> {p.detalle}
                    </span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card className="paper-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif-display text-lg text-primary">
                <Gavel className="h-5 w-5 text-accent" /> Vías de denuncia y reclamo en Chile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {viasDenuncia.map((v, i) => (
                  <li key={v.via} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <span>
                      <strong className="text-foreground">{v.via}:</strong> {v.detalle}
                    </span>
                  </li>
                ))}
              </ol>
              <div className="mt-5 rounded-lg bg-secondary/10 p-4 text-sm leading-relaxed text-foreground">
                El informe no es un ejercicio académico más: la Ley 20.422 entrega
                herramientas concretas para exigir cambios. Úsalas.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
