import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { MapPin, BookOpen } from 'lucide-react';
import { assetUrl } from '@/lib/assetUrl';

export function Hero({ ir }: { ir: (r: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const mapa = L.map(ref.current, {
      center: [-45.9, -72.6],
      zoom: 8,
      minZoom: 7,
      maxZoom: 9,
      maxBounds: [[-49.5, -76.5], [-43.0, -70.5]],
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      keyboard: false,
      attributionControl: false,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(mapa);
    return () => { mapa.remove(); };
  }, []);

  return (
    <section className="relative overflow-hidden text-white" aria-label="Presentación de la plataforma">
      <div ref={ref} className="hero-map" aria-hidden="true" />
      <div className="hero-overlay" aria-hidden="true" />
      <div className="hero-content relative z-10 mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:py-14 md:grid-cols-[1.2fr_.8fr] md:gap-8 lg:gap-12 lg:py-16">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Visibilizar es <br className="sm:hidden" />Intervenir
          </h1>
          <p className="mt-3 text-xl font-semibold text-white sm:text-2xl">Plataforma de Organizaciones Sociales · Región de Aysén</p>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
            Mapa público de organizaciones de personas con discapacidad y neurodivergentes de la región,
            construido por estudiantes del electivo <strong>Trabajo Social y Discapacidad (TSE013-1)</strong> de la Universidad de Aysén.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" variant="secondary" onClick={() => document.getElementById('mapa')?.scrollIntoView({ behavior: 'smooth' })}>
              <MapPin className="mr-2 h-5 w-5" /> Explorar el mapa
            </Button>
            <Button size="lg" variant="outline" className="border-white/50 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              onClick={() => ir('#/programa')}>
              <BookOpen className="mr-2 h-5 w-5" /> Conocer el curso
            </Button>
          </div>
        </div>
        <div className="hero-art-stage" aria-hidden="true">
          <img src={assetUrl('assets/espora/espora-arbol-salvia.png')} alt="" className="hero-art" />
        </div>
      </div>
    </section>
  );
}
