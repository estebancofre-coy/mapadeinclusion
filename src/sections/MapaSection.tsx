import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Eraser, Mail, MapPin, Phone, Clock } from 'lucide-react';
import { COMUNAS, TIPOS, type Organizacion } from '@/data/organizaciones';
import { assetUrl } from '@/lib/assetUrl';

const iconoActiva = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

interface Props {
  organizaciones: Organizacion[];
}

export function MapaSection({ organizaciones }: Props) {
  const [comuna, setComuna] = useState('todas');
  const [tipo, setTipo] = useState('todos');
  const [buscar, setBuscar] = useState('');
  const [activaId, setActivaId] = useState<number | null>(null);
  const mapaRef = useRef<HTMLDivElement>(null);
  const mapa = useRef<L.Map | null>(null);
  const marcadores = useRef<Map<number, L.Marker>>(new Map());

  const filtradas = useMemo(() => organizaciones.filter(o => {
    const q = buscar.trim().toLowerCase();
    return (comuna === 'todas' || o.comuna === comuna)
      && (tipo === 'todos' || o.tipo === tipo)
      && (!q || o.nombre.toLowerCase().includes(q) || o.descripcion.toLowerCase().includes(q));
  }), [organizaciones, comuna, tipo, buscar]);

  useEffect(() => {
    if (!mapaRef.current || mapa.current) return;
    mapa.current = L.map(mapaRef.current, { center: [-45.9, -72.3], zoom: 8, scrollWheelZoom: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapa.current);
    return () => { mapa.current?.remove(); mapa.current = null; };
  }, []);

  useEffect(() => {
    if (!mapa.current) return;
    marcadores.current.forEach(m => m.remove());
    marcadores.current.clear();
    filtradas.forEach(o => {
      const m = L.marker([o.lat, o.lng], { icon: iconoActiva, title: o.nombre })
        .addTo(mapa.current!)
        .bindPopup(`<strong>${o.nombre}</strong><br>${o.direccion}<br><em>${o.tipo} · ${o.comuna}</em>`);
      m.on('click', () => setActivaId(o.id));
      marcadores.current.set(o.id, m);
    });
  }, [filtradas]);

  const enfocar = (o: Organizacion) => {
    setActivaId(o.id);
    mapa.current?.setView([o.lat, o.lng], 11, { animate: true });
    marcadores.current.get(o.id)?.openPopup();
  };

  const limpiar = () => { setComuna('todas'); setTipo('todos'); setBuscar(''); };

  const exportarCSV = () => {
    const cols = ['nombre', 'comuna', 'tipo', 'direccion', 'telefono', 'email', 'horario', 'descripcion', 'accesibilidad'] as const;
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const csv = [cols.join(','), ...filtradas.map(o => cols.map(c => esc(o[c])).join(','))].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    a.download = 'organizaciones_aysen.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <section id="mapa" className="max-w-7xl mx-auto px-4 py-16" aria-labelledby="titulo-mapa">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="titulo-mapa" className="text-3xl font-bold text-primary">Mapa de organizaciones</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Explora las organizaciones por comuna y tipo de discapacidad. Todas las fichas fueron construidas
            con consentimiento informado de cada agrupación.
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center rounded-full border border-border bg-card px-3 py-1.5 text-sm font-semibold text-foreground">
          {organizaciones.length} en el catálogo
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3" role="search" aria-label="Filtros de organizaciones">
        <div>
          <label htmlFor="f-comuna" className="text-sm font-medium">Comuna</label>
          <Select value={comuna} onValueChange={setComuna}>
            <SelectTrigger id="f-comuna"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              {COMUNAS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="f-tipo" className="text-sm font-medium">Tipo</label>
          <Select value={tipo} onValueChange={setTipo}>
            <SelectTrigger id="f-tipo"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {TIPOS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="f-buscar" className="text-sm font-medium">Buscar</label>
          <Input id="f-buscar" placeholder="Nombre o descripción…" value={buscar} onChange={e => setBuscar(e.target.value)} />
        </div>
        <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-2">
          <Button variant="outline" onClick={limpiar}><Eraser className="mr-2 h-4 w-4" /> Limpiar</Button>
          <Button variant="secondary" onClick={exportarCSV}><Download className="mr-2 h-4 w-4" /> Exportar CSV</Button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 items-center" aria-label="Filtro rápido por ámbito de inclusión">
        <span className="text-xs font-semibold text-muted-foreground mr-1">Filtro rápido:</span>
        <button
          type="button"
          onClick={() => setTipo('todos')}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
            tipo === 'todos' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted hover:bg-muted/80 text-foreground'
          }`}
        >
          Todas
        </button>
        <button
          type="button"
          onClick={() => setTipo('Física')}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
            tipo === 'Física' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted hover:bg-muted/80 text-foreground'
          }`}
        >
          <img src={assetUrl('assets/elementos/silla-ruedas.png')} alt="" className="h-4 w-auto object-contain" />
          Física / Motriz
        </button>
        <button
          type="button"
          onClick={() => setTipo('Visual')}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
            tipo === 'Visual' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted hover:bg-muted/80 text-foreground'
          }`}
        >
          <img src={assetUrl('assets/elementos/perro-guia.png')} alt="" className="h-4 w-auto object-contain" />
          Visual
        </button>
        <button
          type="button"
          onClick={() => setTipo('Auditiva')}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
            tipo === 'Auditiva' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted hover:bg-muted/80 text-foreground'
          }`}
        >
          <img src={assetUrl('assets/elementos/lengua-senas.png')} alt="" className="h-4 w-auto object-contain" />
          Auditiva / LSCh
        </button>
        <button
          type="button"
          onClick={() => setTipo('Neurodivergencia')}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
            tipo === 'Neurodivergencia' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted hover:bg-muted/80 text-foreground'
          }`}
        >
          <img src={assetUrl('assets/elementos/red-comunitaria.png')} alt="" className="h-4 w-auto object-contain" />
          Neurodivergencia
        </button>
        <button
          type="button"
          onClick={() => setTipo('Mixta')}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
            tipo === 'Mixta' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted hover:bg-muted/80 text-foreground'
          }`}
        >
          <img src={assetUrl('assets/elementos/personas-mayores.png')} alt="" className="h-4 w-auto object-contain" />
          Mixta / Cuidado
        </button>
      </div>

      <p className="mt-4 text-sm" role="status" aria-live="polite">
        Mostrando {filtradas.length} de {organizaciones.length} organizaciones
      </p>

      <div className="mt-4 grid lg:grid-cols-[1.2fr_1fr] gap-6">
        <div ref={mapaRef} className="mapa-principal" role="application" aria-label="Mapa interactivo de organizaciones" />
        <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1" aria-label="Listado de organizaciones">
          {filtradas.length === 0 && (
            <div className="py-12 px-4 text-center border rounded-xl bg-card">
              <img src={assetUrl('assets/elementos/cuidado-corazon.png')} alt="" className="h-16 w-auto object-contain mx-auto mb-3 animate-subtle-float" />
              <p className="font-semibold text-foreground">No encontramos organizaciones con esos filtros</p>
              <p className="text-sm text-muted-foreground mt-1">Prueba seleccionando otra comuna o limpiando la búsqueda.</p>
              <Button variant="outline" size="sm" onClick={limpiar} className="mt-4">Restablecer filtros</Button>
            </div>
          )}
          {filtradas.map(o => (
            <Card key={o.id}
              tabIndex={0}
              onMouseEnter={() => setActivaId(o.id)}
              onFocus={() => enfocar(o)}
              onClick={() => enfocar(o)}
              className={`cursor-pointer transition-shadow hover:shadow-lg ${activaId === o.id ? 'org-card-activa' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base leading-snug">{o.nombre}</CardTitle>
                  <Badge variant={o.estado === 'activa' ? 'default' : 'secondary'}>{o.estado === 'activa' ? 'Validada' : 'En revisión'}</Badge>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">{o.comuna}</Badge>
                  <Badge variant="outline">{o.tipo}</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-1.5">
                <p className="text-muted-foreground">{o.descripcion.slice(0, 140)}…</p>
                <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 shrink-0" /> {o.direccion}</p>
                <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 shrink-0" /> {o.telefono}</p>
                <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 shrink-0" /> {o.email}</p>
                <p className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 shrink-0" /> {o.horario}</p>
                <p className="pt-1 text-secondary font-medium">♿ {o.accesibilidad}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <details className="mt-8 border rounded-lg p-4">
        <summary className="font-semibold cursor-pointer">Ver tabla accesible (alternativa al mapa)</summary>
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead><TableHead>Comuna</TableHead><TableHead>Tipo</TableHead>
                <TableHead>Dirección</TableHead><TableHead>Contacto</TableHead><TableHead>Accesibilidad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtradas.map(o => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">{o.nombre}</TableCell>
                  <TableCell>{o.comuna}</TableCell>
                  <TableCell>{o.tipo}</TableCell>
                  <TableCell>{o.direccion}</TableCell>
                  <TableCell>{o.telefono}<br />{o.email}</TableCell>
                  <TableCell>{o.accesibilidad}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </details>
    </section>
  );
}
