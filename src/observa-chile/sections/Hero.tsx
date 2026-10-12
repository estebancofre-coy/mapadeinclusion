import { ArrowDown, FileText, Landmark, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { icon: Landmark, valor: "Ley 20.422", detalle: "Igualdad de oportunidades e inclusión social (2010)" },
  { icon: Ruler, valor: "OGUC", detalle: "Normas técnicas · Decretos 50/2015 y 30/2023" },
  { icon: FileText, valor: "22 + 17", detalle: "Criterios de inspección para edificios y eventos" },
];

export default function Hero({ irASeccion }: { irASeccion: (id: string) => void }) {
  return (
    <section id="inicio" className="relative scroll-mt-16 overflow-hidden bg-primary">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
          backgroundSize: "26px 26px",
        }}
      />
      <div className="section-shell relative pb-16 pt-12 sm:pb-24 sm:pt-16">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide text-accent">
          Herramienta pedagógica universitaria · Chile
        </p>
        <h1 className="font-serif-display max-w-3xl text-4xl font-semibold leading-[1.12] text-white sm:text-5xl lg:text-6xl">
          Cartilla de Inspección de{" "}
          <span className="text-accent">Accesibilidad Universal</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
          Evalúa edificios y eventos públicos según la Ley N° 20.422 y la OGUC.
          Marca cada criterio en terreno, registra evidencia fotográfica, obtén el
          puntaje de accesibilidad y descarga el informe en PDF listo para la
          discusión en sala o una denuncia formal.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <a href="#inspeccion" onClick={(event) => { event.preventDefault(); irASeccion("inspeccion"); }}>
              Comenzar inspección
              <ArrowDown className="ml-1 h-4 w-4" />
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            <a href="#marco-legal" onClick={(event) => { event.preventDefault(); irASeccion("marco-legal"); }}>Ver marco legal</a>
          </Button>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.valor} className="rounded-xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm">
              <s.icon className="h-6 w-6 text-accent" />
              <p className="font-serif-display mt-3 text-2xl font-semibold text-white">{s.valor}</p>
              <p className="mt-1 text-sm text-white/70">{s.detalle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
