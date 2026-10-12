import { Camera, ClipboardList, MessageSquareQuote, ShieldAlert } from "lucide-react";
import {
  guiaAntes,
  guiaDurante,
  preguntasDiscusion,
  registroFotografico,
} from "@/observa-chile/data/content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GuiaCampo() {
  return (
    <section id="guia" className="scroll-mt-20 bg-white py-16 sm:py-24">
      <div className="section-shell">
        <p className="section-eyebrow">Metodología</p>
        <h2 className="font-serif-display mt-2 text-3xl font-semibold text-foreground sm:text-4xl">
          Guía de trabajo de campo
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Cómo preparar la salida, qué medir y cómo registrar la evidencia con rigor
          y ética.
        </p>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <Card className="paper-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif-display text-lg text-primary">
                <ClipboardList className="h-5 w-5 text-accent" /> Antes de salir
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {guiaAntes.map((t, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    {t}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card className="paper-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif-display text-lg text-primary">
                <ShieldAlert className="h-5 w-5 text-accent" /> Durante la inspección
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {guiaDurante.map((t, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    {t}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        <h3 className="font-serif-display mt-12 text-xl font-semibold text-foreground">
          Registro fotográfico obligatorio
        </h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {registroFotografico.map((f) => (
            <div key={f.titulo} className="paper-card p-5">
              <Camera className="h-5 w-5 text-accent" />
              <p className="mt-3 text-sm font-semibold text-foreground">{f.titulo}</p>
              <p className="mt-1 text-sm text-muted-foreground">{f.detalle}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl bg-destructive/5 p-5">
          <p className="text-sm font-semibold text-foreground">Ética del trabajo de campo</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            No fotografiar a personas sin su consentimiento. Priorizar la dignidad
            sobre la “evidencia”. El objetivo no es exponer, sino transformar.
          </p>
        </div>

        <h3 className="font-serif-display mt-12 flex items-center gap-2 text-xl font-semibold text-foreground">
          <MessageSquareQuote className="h-5 w-5 text-accent" /> Preguntas para la discusión en sala
        </h3>
        <ol className="mt-5 grid gap-3 md:grid-cols-2">
          {preguntasDiscusion.map((p, i) => (
            <li key={i} className="paper-card flex gap-3 p-4 text-sm leading-relaxed text-muted-foreground">
              <span className="font-serif-display text-lg font-semibold text-accent">{i + 1}.</span>
              {p}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
