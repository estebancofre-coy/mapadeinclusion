import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Header } from '@/sections/Header';
import { Hero } from '@/sections/Hero';
import { MapaSection } from '@/sections/MapaSection';
import { AccesibilidadSection, ComoParticipar, CursoSection, Footer } from '@/sections/Secciones';
import { PanelOperador } from '@/sections/PanelOperador';
import { ProgramaPage } from '@/pages/ProgramaPage';
import { PresentacionPage } from '@/pages/PresentacionPage';
import { CartillaPage } from '@/pages/CartillaPage';
import { EstudiantesPage } from '@/pages/EstudiantesPage';
import { useA11y } from '@/hooks/useA11y';
import { cargarOrganizaciones, type Organizacion } from '@/data/organizaciones';

const ObservaPage = lazy(() => import('@/pages/ObservaPage').then((module) => ({ default: module.ObservaPage })));
const InspectionForm = lazy(() => import('@/observa-chile/sections/Inspeccion'));

function rutaActual(): string {
  const h = location.hash || '#/';
  if (h.startsWith('#/presentacion')) return '#/presentacion';
  if (h.startsWith('#/programa')) return '#/programa';
  if (h.startsWith('#/cartilla')) return '#/cartilla';
  if (h.startsWith('#/observa')) return '#/observa';
  if (h.startsWith('#/inspeccion')) return '#/inspeccion';
  if (h.startsWith('#/estudiantes')) return '#/estudiantes';
  return '#/';
}

export default function App() {
  const a11y = useA11y();
  const [ruta, setRuta] = useState(rutaActual);
  const [panel, setPanel] = useState(false);
  const [orgs, setOrgs] = useState<Organizacion[]>(() => cargarOrganizaciones());

  useEffect(() => {
    const onHash = () => setRuta(rutaActual());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const ir = useCallback((r: string) => {
    location.hash = r;
    setRuta(r);
    window.scrollTo(0, 0);
  }, []);

  if (ruta === '#/inspeccion') {
    return (
      <Suspense fallback={<p className="px-4 py-12 text-center" role="status">Cargando cartilla…</p>}>
        <main>
          <InspectionForm />
        </main>
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <a href="#contenido" className="skip-link">Saltar al contenido principal</a>
      <Header
        ruta={ruta}
        ir={ir}
        onPanel={() => setPanel(true)}
        altoContraste={a11y.altoContraste}
        textoGrande={a11y.textoGrande}
        toggleContraste={a11y.toggleContraste}
        toggleTexto={a11y.toggleTexto}
      />
      <div id="contenido" className="flex-1">
        {ruta === '#/' && (
          <main>
            <Hero ir={ir} />
            <MapaSection organizaciones={orgs.filter(o => o.estado === 'activa' || true)} />
            <ComoParticipar />
            <CursoSection ir={ir} />
            <AccesibilidadSection />
          </main>
        )}
        {ruta === '#/programa' && <ProgramaPage />}
        {ruta === '#/cartilla' && <CartillaPage />}
        {ruta === '#/observa' && (
          <Suspense fallback={<p className="px-4 py-12 text-center text-muted-foreground" role="status">Cargando Observa Chile…</p>}>
            <ObservaPage />
          </Suspense>
        )}
        {ruta === '#/presentacion' && <PresentacionPage />}
        {ruta === '#/estudiantes' && <EstudiantesPage />}
      </div>
      <Footer />
      <PanelOperador abierto={panel} onCerrar={() => setPanel(false)} organizaciones={orgs} onCambio={setOrgs} />
    </div>
  );
}
