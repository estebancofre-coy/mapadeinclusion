import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ClipboardCheck, Upload, Globe, BookOpen, Accessibility, Eye, Keyboard, MonitorSmartphone } from 'lucide-react';
import { assetUrl } from '@/lib/assetUrl';

export function ComoParticipar() {
  const pasos = [
    { icon: Users, titulo: '1. Contacto con la agrupación', texto: 'Las duplas de estudiantes contactan formalmente a cada organización y acuerdan los términos del trabajo conjunto.' },
    { icon: ClipboardCheck, titulo: '2. Consentimiento informado', texto: 'La organización decide qué información se publica, revisa su ficha y aprueba el texto final antes de la publicación.' },
    { icon: Upload, titulo: '3. Construcción de la ficha', texto: 'Se levanta la información con checklist de diseño universal y se valida con la agrupación en terreno.' },
    { icon: Globe, titulo: '4. Publicación y devolución', texto: 'La ficha se publica en el mapa y el proceso se devuelve a la organización para su sostenibilidad.' },
  ];
  return (
    <section className="bg-muted/50 py-16" aria-labelledby="titulo-participar">
      <div className="max-w-7xl mx-auto px-4">
        <h2 id="titulo-participar" className="text-3xl font-bold text-primary">¿Cómo participar?</h2>
        <p className="text-muted-foreground mt-2 max-w-2xl">La plataforma se construye con las organizaciones, no sobre ellas. Este es el proceso que siguen las y los estudiantes del curso.</p>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pasos.map(p => (
            <Card key={p.titulo}>
              <CardHeader>
                <p.icon className="h-8 w-8 text-secondary" aria-hidden="true" />
                <CardTitle className="text-base">{p.titulo}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{p.texto}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CursoSection({ ir }: { ir: (r: string) => void }) {
  return (
    <section className="py-16" aria-labelledby="titulo-curso">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 id="titulo-curso" className="text-3xl font-bold text-primary">El curso detrás de la plataforma</h2>
          <p className="mt-4 text-muted-foreground">
            <strong className="text-foreground">Trabajo Social y Discapacidad (TSE013-1)</strong> es un electivo de la carrera de
            Trabajo Social de la Universidad de Aysén. Su único proceso de investigación-intervención es la construcción
            de esta plataforma pública: visibilizar es intervenir.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex gap-2"><BookOpen className="h-4 w-4 mt-0.5 text-secondary shrink-0" /> Semestre 2026-II · 6 créditos SCT · VIII semestre</li>
            <li className="flex gap-2"><Users className="h-4 w-4 mt-0.5 text-secondary shrink-0" /> Docentes: Esteban Cofré (TS) y Romina Barría (TO), con colaboración de Cristina Barrientos (ACIPA)</li>
            <li className="flex gap-2"><Globe className="h-4 w-4 mt-0.5 text-secondary shrink-0" /> Unidades: modelos de discapacidad y cartografía · trabajo de campo con agrupaciones · lanzamiento público</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => ir('#/programa')}>Ver programa completo</Button>
            <Button variant="outline" onClick={() => ir('#/presentacion')}>Presentación primera clase</Button>
          </div>
        </div>
        <Card className="bg-primary text-primary-foreground">
          <CardHeader><CardTitle>Resultados de aprendizaje</CardTitle></CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-3 text-sm">
              <li>Comprender críticamente los modelos de discapacidad y su expresión territorial en Aysén.</li>
              <li>Aplicar criterios de diseño universal y accesibilidad en un producto digital real.</li>
              <li>Desarrollar un proceso de investigación-intervención con organizaciones sociales, con ética y consentimiento.</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export function AccesibilidadSection() {
  const items = [
    { icon: Accessibility, titulo: 'WCAG 2.1 AA', texto: 'Contraste de color, foco visible, navegación por teclado y mensajes de estado en vivo.' },
    { icon: Eye, titulo: 'Alternativas de acceso', texto: 'Tabla accesible equivalente al mapa, texto alternativo y opciones de alto contraste y texto grande.' },
    { icon: Keyboard, titulo: 'Navegación por teclado', texto: 'Toda la plataforma —incluida la presentación— se recorre sin mouse, con gestión de foco en ventanas modales.' },
    { icon: MonitorSmartphone, titulo: 'Diseño responsivo', texto: 'Funciona en computadores, tablets y teléfonos, respetando preferencias de movimiento reducido.' },
  ];
  return (
    <section className="bg-muted/50 py-16" aria-labelledby="titulo-accesibilidad">
      <div className="max-w-7xl mx-auto px-4">
        <h2 id="titulo-accesibilidad" className="text-3xl font-bold text-primary">Accesibilidad de la plataforma</h2>
        <p className="text-muted-foreground mt-2 max-w-2xl">Una plataforma sobre discapacidad debe ser accesible en sí misma. Estos son los compromisos técnicos del sitio.</p>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map(i => (
            <Card key={i.titulo}>
              <CardHeader>
                <i.icon className="h-8 w-8 text-secondary" aria-hidden="true" />
                <CardTitle className="text-base">{i.titulo}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{i.texto}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-10">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-6 items-center">
        <img src={assetUrl('assets/logo-uaysen-horizontal.png')} alt="Universidad de Aysén — Patagonia" className="h-16 w-auto bg-white rounded-lg p-2" />
        <div className="text-sm">
          <p className="font-semibold">Visibilizar es Intervenir — Plataforma de Organizaciones Sociales · Región de Aysén</p>
          <p className="opacity-80 mt-1">Electivo Trabajo Social y Discapacidad (TSE013-1) · Carrera de Trabajo Social · 2026-II</p>
          <p className="opacity-80">Campus Coyhaique · Lillo 669</p>
        </div>
        <div className="text-sm opacity-80 md:text-right">
          <p>Datos de demostración almacenados localmente en tu navegador.</p>
          <p className="mt-1">Mapas © OpenStreetMap</p>
        </div>
      </div>
    </footer>
  );
}
