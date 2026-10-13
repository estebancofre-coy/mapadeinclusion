import { Button } from '@/components/ui/button';
import { Contrast, Type, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { assetUrl } from '@/lib/assetUrl';

interface Props {
  onPanel: () => void;
  altoContraste: boolean;
  textoGrande: boolean;
  toggleContraste: () => void;
  toggleTexto: () => void;
  ruta: string;
  ir: (r: string) => void;
}

const NAV = [
  { ruta: '#/', label: 'Mapa de organizaciones' },
  { ruta: '#/programa', label: 'El curso' },
  { ruta: '#/cartilla', label: 'Cartilla in situ' },
  { ruta: '#/observa', label: 'Observa Chile' },
  { ruta: '#/presentacion', label: 'Presentación' },
];

export function Header(p: Props) {
  const [abierto, setAbierto] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-4">
        <a href="#/" onClick={(e) => { e.preventDefault(); p.ir('#/'); }} className="flex min-w-0 items-center gap-3 shrink-0" aria-label="Inicio — Visibilizar es Intervenir">
          <img src={assetUrl('assets/espora/espora-arbol-bosque.png')} alt="" className="h-11 w-11 shrink-0 object-contain" />
          <span className="leading-tight">
            <span className="block font-bold text-primary text-sm sm:text-base">Visibilizar es Intervenir</span>
            <span className="block text-muted-foreground text-xs">Plataforma de Organizaciones Sociales · Aysén</span>
          </span>
        </a>

        <nav className="hidden xl:flex min-w-0 flex-wrap justify-end items-center gap-1 ml-auto" aria-label="Navegación principal">
          {NAV.map(n => (
            <Button key={n.ruta} variant={p.ruta === n.ruta ? 'secondary' : 'ghost'} size="sm"
              aria-current={p.ruta === n.ruta ? 'page' : undefined}
              onClick={() => p.ir(n.ruta)}>{n.label}</Button>
          ))}
          <Button size="sm" onClick={() => p.ir('#/estudiantes')} className="ml-2"
            aria-current={p.ruta === '#/estudiantes' ? 'page' : undefined}>Ingresar estudiantes</Button>
          <Button size="sm" variant="ghost" onClick={p.onPanel}>Panel demo</Button>
          <div className="flex items-center gap-1 ml-2 border-l pl-2" role="group" aria-label="Controles de accesibilidad">
            <Button variant={p.altoContraste ? 'default' : 'outline'} size="icon" onClick={p.toggleContraste}
              aria-pressed={p.altoContraste} title="Alto contraste" aria-label="Alternar alto contraste"><Contrast className="h-4 w-4" /></Button>
            <Button variant={p.textoGrande ? 'default' : 'outline'} size="icon" onClick={p.toggleTexto}
              aria-pressed={p.textoGrande} title="Aumentar texto" aria-label="Alternar tamaño de texto"><Type className="h-4 w-4" /></Button>
          </div>
        </nav>

        <Button variant="ghost" size="icon" className="xl:hidden ml-auto" onClick={() => setAbierto(!abierto)} aria-expanded={abierto} aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}>
          {abierto ? <X /> : <Menu />}
        </Button>
      </div>

      {abierto && (
        <nav className="xl:hidden border-t px-4 py-3 flex flex-col gap-2" aria-label="Navegación móvil">
          {NAV.map(n => (
            <Button key={n.ruta} variant={p.ruta === n.ruta ? 'secondary' : 'ghost'} className="justify-start"
              onClick={() => { p.ir(n.ruta); setAbierto(false); }}>{n.label}</Button>
          ))}
          <Button onClick={() => { p.ir('#/estudiantes'); setAbierto(false); }}
            aria-current={p.ruta === '#/estudiantes' ? 'page' : undefined}>Ingresar estudiantes</Button>
          <Button variant="outline" onClick={() => { p.onPanel(); setAbierto(false); }}>Panel demo (datos locales)</Button>
          <div className="flex gap-2">
            <Button variant={p.altoContraste ? 'default' : 'outline'} onClick={p.toggleContraste} aria-pressed={p.altoContraste}><Contrast className="h-4 w-4 mr-2" /> Contraste</Button>
            <Button variant={p.textoGrande ? 'default' : 'outline'} onClick={p.toggleTexto} aria-pressed={p.textoGrande}><Type className="h-4 w-4 mr-2" /> Texto</Button>
          </div>
        </nav>
      )}
    </header>
  );
}
