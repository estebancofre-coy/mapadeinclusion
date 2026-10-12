import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Download, RotateCcw, Save } from 'lucide-react';
import { cargarOrganizaciones } from '@/data/organizaciones';

export type ValorItem = 0 | 1 | 2 | 3; // 0=no cumple, 1=parcial, 2=cumple, 3=no aplica
export type Respuestas = Record<string, { valor: ValorItem; nota: string }>;

interface Item { id: string; texto: string }
interface Dimension { id: string; titulo: string; fundamento: string; items: Item[] }

// Cartilla construida desde el programa 2026-II (RAE 2, tabla de criterios 2.1–2.3):
// normativas CDPD, Ley 20.422, Ley 21.015, COMPIN/IVADEC + diseño universal aplicado in situ.
export const DIMENSIONES: Dimension[] = [
  {
    id: 'fisica',
    titulo: '1. Accesibilidad física de la sede',
    fundamento: 'Ley 20.422 (arts. 8 y 14) · Norma de accesibilidad urbana OGUC',
    items: [
      { id: 'f1', texto: 'Acceso principal nivelado o con rampa reglamentaria (pendiente ≤ 1:12)' },
      { id: 'f2', texto: 'Puertas con ancho libre ≥ 80 cm y manillas de palanca' },
      { id: 'f3', texto: 'Baño de uso universal disponible y señalizado' },
      { id: 'f4', texto: 'Circulación interior despejada, sin obstáculos ni escalones sorpresa' },
      { id: 'f5', texto: 'Estacionamiento reservado o punto de descenso cercano' },
      { id: 'f6', texto: 'Pavimento de acceso firme, estable y antideslizante' },
    ],
  },
  {
    id: 'sensorial',
    titulo: '2. Accesibilidad sensorial y comunicacional',
    fundamento: 'CDPD (art. 9 y 21) · Ley 20.422 (accesibilidad comunicacional)',
    items: [
      { id: 's1', texto: 'Señalética visual clara, de alto contraste y en relieve o braille' },
      { id: 's2', texto: 'Disponibilidad de interpretación en LSCh o comunicación escrita' },
      { id: 's3', texto: 'Iluminación adecuada y control de reverberación acústica en salas' },
      { id: 's4', texto: 'Espacio de calma o reducción de estímulos para personas neurodivergentes' },
      { id: 's5', texto: 'Información de contacto en formatos alternativos (texto, audio, video)' },
    ],
  },
  {
    id: 'cognitiva',
    titulo: '3. Accesibilidad cognitiva',
    fundamento: 'Diseño universal para el aprendizaje · Lectura fácil (norma UNE 153101)',
    items: [
      { id: 'c1', texto: 'Documentos y avisos en lenguaje claro y comprensible' },
      { id: 'c2', texto: 'Uso de pictogramas o apoyos visuales en espacios y trámites' },
      { id: 'c3', texto: 'Instrucciones de actividades entregadas paso a paso' },
      { id: 'c4', texto: 'Personal orientado en apoyos a la comunicación aumentativa' },
    ],
  },
  {
    id: 'participacion',
    titulo: '4. Participación y autodeterminación',
    fundamento: 'CDPD (art. 4.3 y 29) · Enfoque "nada sobre nosotros sin nosotros"',
    items: [
      { id: 'p1', texto: 'Las personas con discapacidad participan en la dirección de la agrupación' },
      { id: 'p2', texto: 'Existen mecanismos para que socios/as incidan en las decisiones' },
      { id: 'p3', texto: 'La agrupación representa sus propios intereses ante autoridades' },
      { id: 'p4', texto: 'Se evita el trato paternalista o asistencialista en la comunicación' },
    ],
  },
  {
    id: 'digital',
    titulo: '5. Verificación de la ficha digital (antes de publicar)',
    fundamento: 'WCAG 2.1 AA · Checklist de accesibilidad del proyecto de plataforma',
    items: [
      { id: 'd1', texto: '¿El lenguaje es claro y comprensible?' },
      { id: 'd2', texto: '¿La información tiene estructura jerárquica (títulos, párrafos)?' },
      { id: 'd3', texto: '¿Las imágenes tienen texto alternativo descriptivo?' },
      { id: 'd4', texto: '¿El contraste de colores es suficiente (mínimo 4,5:1)?' },
      { id: 'd5', texto: '¿La información es navegable completamente por teclado?' },
      { id: 'd6', texto: '¿Se evitan estímulos sensoriales intensos (parpadeos, sonidos)?' },
      { id: 'd7', texto: '¿Es compatible con lectores de pantalla?' },
      { id: 'd8', texto: '¿La agrupación validó el contenido antes de publicar?' },
      { id: 'd9', texto: '¿El consentimiento informado está documentado?' },
    ],
  },
];

const ETIQUETAS: Record<ValorItem, string> = { 0: 'No cumple', 1: 'Parcial', 2: 'Cumple', 3: 'No aplica' };

function storageKey(orgId: string) { return `aysen_cartilla_${orgId}`; }

export function CartillaPage() {
  const orgs = useMemo(() => cargarOrganizaciones(), []);
  const [orgId, setOrgId] = useState('');
  const [respuestas, setRespuestas] = useState<Respuestas>({});
  const [guardado, setGuardado] = useState('');

  const seleccionar = (id: string) => {
    setOrgId(id);
    setGuardado('');
    try {
      setRespuestas(JSON.parse(localStorage.getItem(storageKey(id)) || '{}'));
    } catch { setRespuestas({}); }
  };

  const marcar = (itemId: string, valor: ValorItem) => {
    setRespuestas(r => ({ ...r, [itemId]: { valor, nota: r[itemId]?.nota || '' } }));
  };
  const nota = (itemId: string, texto: string) => {
    setRespuestas(r => ({ ...r, [itemId]: { valor: r[itemId]?.valor ?? 1, nota: texto } }));
  };

  const totalItems = DIMENSIONES.reduce((a, d) => a + d.items.length, 0);
  const respondidos = Object.keys(respuestas).length;
  const aplicables = Object.values(respuestas).filter(r => r.valor !== 3);
  const puntaje = aplicables.length ? Math.round((aplicables.reduce((a, r) => a + r.valor, 0) / (aplicables.length * 2)) * 100) : 0;

  const guardar = () => {
    if (!orgId) return;
    localStorage.setItem(storageKey(orgId), JSON.stringify(respuestas));
    setGuardado('Cartilla guardada localmente en este navegador.');
  };

  const reiniciar = () => {
    if (!confirm('¿Limpiar todas las respuestas de esta cartilla?')) return;
    setRespuestas({}); setGuardado('');
  };

  const exportarCSV = () => {
    const org = orgs.find(o => String(o.id) === orgId);
    const filas = [['agrupacion', 'dimension', 'item', 'resultado', 'nota']];
    DIMENSIONES.forEach(d => d.items.forEach(it => {
      const r = respuestas[it.id];
      filas.push([org?.nombre || '', d.titulo, it.texto, r ? ETIQUETAS[r.valor] : 'Sin responder', (r?.nota || '').replace(/\n/g, ' ')]);
    }));
    const esc = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
    const csv = filas.map(f => f.map(esc).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    a.download = `cartilla_insitu_${org?.nombre?.slice(0, 30) || 'sin_asignar'}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <p className="text-secondary font-semibold uppercase tracking-wide text-sm">Evaluación 2 · RAE 2 · Unidad 2</p>
      <h1 className="text-4xl font-extrabold text-primary mt-2">Cartilla de evaluación in situ</h1>
      <p className="text-lg text-muted-foreground mt-2 max-w-2xl">
        Instrumento de diagnóstico de barreras que cada dupla aplica durante las visitas a su agrupación
        asignada (semanas 9–13). Se fundamenta en la CDPD, la Ley 20.422, la Ley 21.015 y los criterios
        de diseño universal trabajados en la Unidad 1.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Agrupación evaluada</CardTitle>
          <CardDescription>Selecciona la agrupación para cargar o iniciar su cartilla. Los datos se guardan en este navegador.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Select value={orgId} onValueChange={seleccionar}>
            <SelectTrigger className="w-full sm:w-96" aria-label="Seleccionar agrupación"><SelectValue placeholder="Seleccionar agrupación…" /></SelectTrigger>
            <SelectContent>
              {orgs.map(o => <SelectItem key={o.id} value={String(o.id)}>{o.nombre}</SelectItem>)}
            </SelectContent>
          </Select>
          {orgId && (
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="secondary">{respondidos}/{totalItems} ítems</Badge>
              {aplicables.length > 0 && <Badge variant={puntaje >= 80 ? 'default' : puntaje >= 50 ? 'secondary' : 'destructive'}>Cumplimiento: {puntaje}%</Badge>}
            </div>
          )}
        </CardContent>
      </Card>

      {orgId && (
        <>
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-1"><span>Progreso de la cartilla</span><span>{respondidos} de {totalItems}</span></div>
            <Progress value={(respondidos / totalItems) * 100} aria-label={`Progreso: ${respondidos} de ${totalItems} ítems`} />
          </div>

          {DIMENSIONES.map(dim => (
            <Card key={dim.id} className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">{dim.titulo}</CardTitle>
                <CardDescription>{dim.fundamento}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {dim.items.map(it => {
                  const r = respuestas[it.id];
                  return (
                    <fieldset key={it.id} className="border rounded-lg p-4">
                      <legend className="text-sm font-medium px-1">{it.texto}</legend>
                      <div className="flex flex-wrap gap-2 mt-2" role="radiogroup" aria-label={it.texto}>
                        {([2, 1, 0, 3] as ValorItem[]).map(v => (
                          <Button key={v} type="button" size="sm"
                            variant={r?.valor === v ? (v === 0 ? 'destructive' : v === 2 ? 'default' : 'secondary') : 'outline'}
                            aria-pressed={r?.valor === v}
                            onClick={() => marcar(it.id, v)}>{ETIQUETAS[v]}</Button>
                        ))}
                      </div>
                      <Textarea className="mt-3" rows={2} placeholder="Evidencia u observación en terreno (opcional)…"
                        aria-label={`Observación para: ${it.texto}`}
                        value={r?.nota || ''} onChange={e => nota(it.id, e.target.value)} />
                    </fieldset>
                  );
                })}
              </CardContent>
            </Card>
          ))}

          <div className="mt-8 mb-10 flex flex-wrap items-center gap-3">
            <Button onClick={guardar}><Save className="mr-2 h-4 w-4" /> Guardar cartilla</Button>
            <Button variant="secondary" onClick={exportarCSV}><Download className="mr-2 h-4 w-4" /> Exportar CSV</Button>
            <Button variant="outline" onClick={reiniciar}><RotateCcw className="mr-2 h-4 w-4" /> Limpiar</Button>
            {guardado && <p role="status" className="text-sm text-secondary">{guardado}</p>}
          </div>

          <Card className="bg-muted/50">
            <CardContent className="pt-4 text-sm text-muted-foreground">
              <strong className="text-foreground">Recuerda:</strong> esta cartilla es evidencia del expediente de
              investigación de la agrupación (RAE 2). Registra las observaciones en tu bitácora de campo el mismo
              día de la visita, y contrasta los resultados con la propia agrupación antes de incluirlos en la ficha pública.
            </CardContent>
          </Card>
        </>
      )}
    </main>
  );
}
