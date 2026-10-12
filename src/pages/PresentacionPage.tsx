import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { assetUrl } from '@/lib/assetUrl';

const EVALS = [
  { nombre: 'Evaluación mixta (RAE 1)', pct: 20 },
  { nombre: 'Checklist diseño universal (RAE 2)', pct: 15 },
  { nombre: 'Ficha pública + portafolio (RAE 3)', pct: 40 },
  { nombre: 'Presentación oral (RAE 3)', pct: 25 },
];

function Slide({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`slide activa flex-col items-center justify-center text-center px-6 py-16 min-h-[70vh] ${className}`}>
      {children}
    </div>
  );
}

const TOTAL = 12;

export function PresentacionPage() {
  const [i, setI] = useState(() => Math.min(TOTAL - 1, Math.max(0, parseInt(location.hash.split('/').pop() || '0') || 0)));

  const ir = useCallback((n: number) => setI(Math.min(TOTAL - 1, Math.max(0, n))), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowRight', 'ArrowDown', ' '].includes(e.key)) { e.preventDefault(); ir(i + 1); }
      if (['ArrowLeft', 'ArrowUp'].includes(e.key)) { e.preventDefault(); ir(i - 1); }
      if (e.key === 'Home') ir(0);
      if (e.key === 'End') ir(TOTAL - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [i, ir]);

  const slides = [
    <Slide key={0}>
      <img src={assetUrl('assets/logo-uaysen-horizontal.png')} alt="Universidad de Aysén — Patagonia" className="h-20 w-auto bg-white rounded-lg p-2 mb-8" />
      <h1 className="text-5xl font-extrabold text-primary">Trabajo Social y Discapacidad</h1>
      <p className="text-xl text-muted-foreground mt-4">TSE013-1 · Electivo · 2026-II</p>
      <p className="text-muted-foreground mt-2">Esteban Cofré · Romina Barría · con Cristina Barrientos (ACIPA)</p>
    </Slide>,
    <Slide key={1}>
      <h2 className="text-4xl font-bold text-primary">Ficha del curso</h2>
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl text-left">
        {[['Sigla', 'TSE013-1'], ['Semestre', 'VIII'], ['Créditos', '6 SCT'], ['Horas', '4,5 + 4,5'], ['Lugar', 'Lillo 669, Coyhaique'], ['Período', '2026-II']].map(([k, v]) => (
          <div key={k} className="border rounded-lg p-4"><p className="text-xs text-muted-foreground uppercase">{k}</p><p className="font-bold text-lg">{v}</p></div>
        ))}
      </div>
    </Slide>,
    <Slide key={2}>
      <blockquote className="text-4xl md:text-5xl font-extrabold text-primary max-w-4xl leading-tight">
        «Visibilizar es intervenir»
      </blockquote>
      <p className="text-xl text-muted-foreground mt-8 max-w-2xl">El único proceso de investigación-intervención del curso es construir, junto a las agrupaciones de Aysén, una plataforma pública de organizaciones sociales.</p>
    </Slide>,
    <Slide key={3}>
      <h2 className="text-4xl font-bold text-primary">Las tensiones que atravesamos</h2>
      <ul className="mt-8 space-y-4 text-xl text-left max-w-2xl">
        <li>🧠 ¿El "problema" está en la persona o en el entorno?</li>
        <li>🏙️ Aysén: distancias, clima y barreras territoriales reales.</li>
        <li>🤝 Visibilizar sin exponer: ética y consentimiento.</li>
        <li>🛠️ Hacer tecnología accesible, no solo hablar de accesibilidad.</li>
      </ul>
    </Slide>,
    <Slide key={4}>
      <h2 className="text-4xl font-bold text-primary">Resultados de aprendizaje</h2>
      <ol className="mt-8 space-y-5 text-left max-w-2xl text-lg list-decimal list-inside">
        <li>Comprender críticamente los modelos de discapacidad en el territorio.</li>
        <li>Aplicar diseño universal y accesibilidad en un producto digital real.</li>
        <li>Investigar-intervenir con organizaciones, con ética y consentimiento.</li>
      </ol>
    </Slide>,
    <Slide key={5} className="bg-primary text-white rounded-2xl">
      <Badge className="bg-white/20 text-white mb-4">Semanas 1–6</Badge>
      <h2 className="text-4xl font-bold">Unidad 1 · Comprensión crítica</h2>
      <p className="mt-6 text-lg max-w-2xl text-white/90">Cinco modelos de discapacidad, análisis de prensa, taller de diseño universal y cartografía socio-espacial del territorio.</p>
    </Slide>,
    <Slide key={6} className="bg-secondary text-white rounded-2xl">
      <Badge className="bg-white/20 text-white mb-4">Semanas 7–13</Badge>
      <h2 className="text-4xl font-bold">Unidad 2 · Investigación-intervención</h2>
      <p className="mt-6 text-lg max-w-2xl text-white/90">Cada dupla trabaja con una agrupación asignada: contacto, consentimiento, bitácora de campo, checklist de accesibilidad y ficha pública.</p>
    </Slide>,
    <Slide key={7} className="bg-accent text-accent-foreground rounded-2xl">
      <Badge className="bg-black/10 mb-4">Semanas 14–18</Badge>
      <h2 className="text-4xl font-bold">Unidad 3 · Lanzamiento y sostenibilidad</h2>
      <p className="mt-6 text-lg max-w-2xl">Validación con las agrupaciones, lanzamiento público de la plataforma, devolución del proceso y presentación oral final.</p>
    </Slide>,
    <Slide key={8}>
      <h2 className="text-4xl font-bold text-primary">Evaluación</h2>
      <div className="mt-8 space-y-5 max-w-xl w-full text-left">
        {EVALS.map(ev => (
          <div key={ev.nombre}>
            <div className="flex justify-between mb-1"><span className="font-medium">{ev.nombre}</span><span className="font-bold text-primary">{ev.pct}%</span></div>
            <Progress value={ev.pct} />
          </div>
        ))}
        <p className="text-sm text-muted-foreground pt-2">Asistencia 70 % · Examen si promedio &lt; 5,5 · Nota mínima 4,0</p>
      </div>
    </Slide>,
    <Slide key={9}>
      <h2 className="text-4xl font-bold text-primary">Reglas del juego</h2>
      <ul className="mt-8 space-y-4 text-xl text-left max-w-2xl">
        <li>✅ Consentimiento antes que publicación. Siempre.</li>
        <li>✅ La agrupación aprueba su ficha final.</li>
        <li>✅ La bitácora es tu herramienta: una entrada semanal mínimo.</li>
        <li>✅ La incomodidad también es un dato: se registra y se elabora.</li>
      </ul>
    </Slide>,
    <Slide key={10}>
      <h2 className="text-4xl font-bold text-primary">Equipo docente</h2>
      <div className="mt-8 grid sm:grid-cols-3 gap-4 max-w-3xl">
        {[['Esteban Cofré', 'Trabajo Social'], ['Romina Barría', 'Terapia Ocupacional'], ['Cristina Barrientos', 'Presidenta ACIPA']].map(([n, r]) => (
          <div key={n} className="border rounded-xl p-6"><p className="font-bold text-lg">{n}</p><p className="text-muted-foreground">{r}</p></div>
        ))}
      </div>
    </Slide>,
    <Slide key={11}>
      <h2 className="text-4xl font-bold text-primary max-w-3xl leading-tight">¿Con qué modelo de discapacidad llegaste hoy a la universidad?</h2>
      <p className="text-xl text-muted-foreground mt-6">Esa es tu primera entrada de bitácora.</p>
      <div className="mt-10 flex gap-3">
        <Button onClick={() => { location.hash = '#/programa'; }}>Ver programa completo</Button>
        <Button variant="secondary" onClick={() => { location.hash = '#/'; }}>Explorar la plataforma</Button>
      </div>
    </Slide>,
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 py-10" aria-label="Presentación del curso">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground" role="status" aria-live="polite">Diapositiva {i + 1} de {TOTAL} — usa las flechas del teclado</p>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => ir(i - 1)} disabled={i === 0} aria-label="Diapositiva anterior"><ChevronLeft /></Button>
          <Button variant="outline" size="icon" onClick={() => ir(i + 1)} disabled={i === TOTAL - 1} aria-label="Diapositiva siguiente"><ChevronRight /></Button>
        </div>
      </div>
      <Progress value={((i + 1) / TOTAL) * 100} className="mb-2" aria-hidden="true" />
      {slides[i]}
    </main>
  );
}
