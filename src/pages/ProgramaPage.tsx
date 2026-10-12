import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { CalendarDays, Users, BookOpen, Scale } from 'lucide-react';

const UNIDADES = [
  {
    n: 'Unidad 1', color: 'bg-primary', titulo: 'Comprensión crítica de los modelos de discapacidad y cartografía socio-espacial',
    semanas: 'Semanas 1–6', desc: 'Modelos médico, social, de derechos, ecológico y crítico. Análisis de prensa local, taller de diseño universal y levantamiento del listado territorial de agrupaciones.',
  },
  {
    n: 'Unidad 2', color: 'bg-secondary', titulo: 'Investigación-intervención con agrupación asignada',
    semanas: 'Semanas 7–13 (16 sep – 30 oct)', desc: 'Contacto formal, consentimiento informado, trabajo de campo con bitácora, aplicación del checklist de diseño universal y construcción de la ficha pública.',
  },
  {
    n: 'Unidad 3', color: 'bg-accent', titulo: 'Lanzamiento público y sostenibilidad',
    semanas: 'Semanas 14–18', desc: 'Validación final de fichas con las agrupaciones, lanzamiento de la plataforma, devolución del proceso y presentación oral del portafolio reflexivo.',
  },
];

const EVALUACIONES = [
  { nombre: 'Evaluación mixta (RAE 1)', pct: 20 },
  { nombre: 'Checklist de diseño universal (RAE 2)', pct: 15 },
  { nombre: 'Ficha pública + portafolio reflexivo (RAE 3)', pct: 40 },
  { nombre: 'Presentación oral final (RAE 3)', pct: 25 },
];

const BIBLIO = [
  { g: 'Modelos y teoría de la discapacidad', refs: ['Barnes, C. & Mercer, G. (2006). La discapacidad. Gedisa.', 'Oliver, M. (1996). Understanding Disability: From Theory to Practice. Macmillan.', 'Shakespeare, T. (2010). The Social Model of Disability. En Davis (Ed.), The Disability Studies Reader.'] },
  { g: 'Convención y derechos', refs: ['Naciones Unidas (2006). Convención sobre los Derechos de las Personas con Discapacidad.', 'Ley 20.422 (Chile). Igualdad de oportunidades e inclusión social de personas con discapacidad.', 'SENADIS (2022). III Estudio Nacional de la Discapacidad.'] },
  { g: 'Trabajo social e intervención', refs: ['Payne, M. (2017). Teoría y práctica del trabajo social contemporáneo. Gedisa.', 'Riffo, M. (2019). Trabajo social y discapacidad: miradas críticas desde Chile. UAH.'] },
  { g: 'Accesibilidad y diseño universal', refs: ['W3C (2018). Web Content Accessibility Guidelines (WCAG) 2.1.', 'Persson, H. et al. (2015). Universal design, inclusive design, accessible design, design for all. Applied Ergonomics.'] },
  { g: 'Neurodivergencia', refs: ['Singer, J. (2017). NeuroDiversity: The Birth of an Idea.', 'Milton, D. (2012). On the ontological status of autism: the double empathy problem. Disability & Society.'] },
  { g: 'Territorio y Patagonia', refs: ['Documentos de política regional de inclusión, Gobierno Regional de Aysén.', 'Estudios de accesibilidad urbana en ciudades intermedias del sur austral.'] },
];

export function ProgramaPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <p className="text-secondary font-semibold uppercase tracking-wide text-sm">Programa de asignatura · 2026-II</p>
      <h1 className="text-4xl font-extrabold text-primary mt-2">Trabajo Social y Discapacidad</h1>
      <p className="text-lg text-muted-foreground mt-2">TSE013-1 · Carrera de Trabajo Social · Universidad de Aysén</p>

      <Card className="mt-8">
        <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" /> Ficha del curso</CardTitle></CardHeader>
        <CardContent>
          <dl className="grid sm:grid-cols-3 gap-x-6 gap-y-2 text-sm">
            <div><dt className="font-semibold">Sigla</dt><dd>TSE013-1</dd></div>
            <div><dt className="font-semibold">Semestre plan</dt><dd>VIII</dd></div>
            <div><dt className="font-semibold">Créditos</dt><dd>6 SCT</dd></div>
            <div><dt className="font-semibold">Horas</dt><dd>4,5 pedagógicas + 4,5 autónomas</dd></div>
            <div><dt className="font-semibold">Lugar</dt><dd>Campus Coyhaique, Lillo 669</dd></div>
            <div><dt className="font-semibold">Período</dt><dd>2026 segundo semestre</dd></div>
          </dl>
        </CardContent>
      </Card>

      <section className="mt-10" aria-labelledby="proposito">
        <h2 id="proposito" className="text-2xl font-bold text-primary">Propósito</h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          El curso desarrolla comprensión crítica de los modelos de discapacidad y sus expresiones territoriales en la
          Región de Aysén. Su <strong className="text-foreground">único proceso de investigación-intervención</strong> es la
          construcción de una plataforma pública de organizaciones sociales de personas con discapacidad y neurodivergentes,
          realizada junto a las propias agrupaciones, con consentimiento informado, criterios de diseño universal y
          devolución del proceso al territorio. <em>Visibilizar es intervenir.</em>
        </p>
      </section>

      <section className="mt-10" aria-labelledby="raes">
        <h2 id="raes" className="text-2xl font-bold text-primary">Resultados de aprendizaje esperados</h2>
        <ol className="mt-4 space-y-3">
          {[
            'RAE 1 — Comprende críticamente los modelos de discapacidad y su expresión socio-espacial en el territorio aysenino.',
            'RAE 2 — Aplica criterios de accesibilidad y diseño universal en la construcción de un producto digital público.',
            'RAE 3 — Desarrolla un proceso de investigación-intervención ético y colaborativo con organizaciones sociales del territorio.',
          ].map(r => (
            <li key={r} className="flex gap-3 items-start">
              <Badge variant="secondary" className="mt-0.5 shrink-0">RAE</Badge>
              <span className="text-sm">{r}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10" aria-labelledby="unidades">
        <h2 id="unidades" className="text-2xl font-bold text-primary">Unidades y calendario</h2>
        <div className="mt-4 space-y-4">
          {UNIDADES.map(u => (
            <Card key={u.n} className="overflow-hidden">
              <div className={`h-2 ${u.color}`} aria-hidden="true" />
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{u.n}</Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {u.semanas}</span>
                </div>
                <CardTitle className="text-lg">{u.titulo}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{u.desc}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-10" aria-labelledby="evaluacion">
        <h2 id="evaluacion" className="text-2xl font-bold text-primary">Evaluación</h2>
        <div className="mt-4 space-y-3">
          {EVALUACIONES.map(ev => (
            <div key={ev.nombre}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{ev.nombre}</span>
                <span className="font-bold text-primary">{ev.pct}%</span>
              </div>
              <Progress value={ev.pct} aria-label={`${ev.nombre}: ${ev.pct} por ciento`} />
            </div>
          ))}
        </div>
        <ul className="mt-4 text-sm text-muted-foreground list-disc list-inside space-y-1">
          <li>Asistencia mínima: 70 %.</li>
          <li>Examen obligatorio si promedio de presentación es inferior a 5,5. Nota mínima de aprobación: 4,0 (art. 46).</li>
          <li>Nota final: 70 % presentación + 30 % examen (si corresponde).</li>
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="biblio">
        <h2 id="biblio" className="text-2xl font-bold text-primary">Bibliografía</h2>
        <Accordion type="multiple" className="mt-3">
          {BIBLIO.map((b, i) => (
            <AccordionItem key={b.g} value={`b-${i}`}>
              <AccordionTrigger>{b.g}</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {b.refs.map(r => <li key={r}>{r}</li>)}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="mt-10" aria-labelledby="etica">
        <h2 id="etica" className="text-2xl font-bold text-primary flex items-center gap-2"><Scale className="h-5 w-5" /> Compromisos éticos</h2>
        <ul className="mt-3 text-sm text-muted-foreground list-disc list-inside space-y-1">
          <li>Consentimiento informado de cada agrupación antes de cualquier publicación.</li>
          <li>Las organizaciones revisan y aprueban su ficha final.</li>
          <li>Sin datos sensibles ni identificables sin autorización expresa.</li>
          <li>El proceso se devuelve a las organizaciones al cierre del curso.</li>
        </ul>
      </section>

      <section className="mt-10 mb-8" aria-labelledby="equipo">
        <h2 id="equipo" className="text-2xl font-bold text-primary flex items-center gap-2"><Users className="h-5 w-5" /> Equipo docente</h2>
        <div className="mt-4 grid sm:grid-cols-3 gap-4">
          {[
            { n: 'Esteban Cofré', r: 'Docente · Trabajo Social' },
            { n: 'Romina Barría', r: 'Docente · Terapia Ocupacional' },
            { n: 'Cristina Barrientos', r: 'Colaboradora · Presidenta ACIPA' },
          ].map(p => (
            <Card key={p.n}><CardContent className="pt-4"><p className="font-semibold">{p.n}</p><p className="text-sm text-muted-foreground">{p.r}</p></CardContent></Card>
          ))}
        </div>
      </section>
    </main>
  );
}
