import type { ChecklistSection } from "@/observa-chile/types/inspection";

export const checklistEdificio: ChecklistSection[] = [
  {
    id: "ed-1",
    titulo: "4.1 Entorno y aproximación urbana",
    items: [
      {
        id: "ed-1-1",
        texto: "Existen rebajes de cordón en cruces peatonales cercanos al edificio",
        meta: "Pendiente ≤ 12%; ancho ≥ 1,20 m — OGUC / Art. 28 Ley 20.422",
      },
      {
        id: "ed-1-2",
        texto: "Las veredas tienen ancho mínimo de 1,20 m y superficie firme y continua",
        meta: "1,50 m en plazas; altura libre ≥ 2,10 m; sin obstáculos — OGUC",
      },
      {
        id: "ed-1-3",
        texto: "Hay pavimento podotáctil en zonas de riesgo, cruces y accesos",
        meta: "Baldosas de advertencia y guías de dirección — OGUC",
      },
      {
        id: "ed-1-4",
        texto: "Hay estacionamientos preferenciales para personas con discapacidad",
        meta: "5,00 m × 2,50 m + franja 1,10 m; señalización visible — Art. 31 Ley 20.422 / OGUC",
      },
      {
        id: "ed-1-5",
        texto: "Ruta accesible desde el transporte/estacionamiento hasta el ingreso",
        meta: "Sin escalones, iluminada, señalizada, superficie antideslizante",
      },
    ],
  },
  {
    id: "ed-2",
    titulo: "4.2 Ingreso principal y circulación",
    items: [
      {
        id: "ed-2-1",
        texto: "Ingreso accesible sin escalones o con rampa/ascensor alternativo",
        meta: "Ancho ≥ 0,90 m; rampa pendiente ≤ 12% (ideal ≤ 8%); pasamanos dobles — OGUC",
      },
      {
        id: "ed-2-2",
        texto: "Puerta principal con ancho mínimo de 0,90 m y umbral ≤ 13 mm",
        meta: "Manilla palanca a 0,80–1,10 m; fuerza apertura ≤ 22 N — OGUC",
      },
      {
        id: "ed-2-3",
        texto: "Hall de recepción con espacio de giro ≥ 1,50 m de diámetro",
        meta: "Superficie antideslizante; iluminación uniforme sin deslumbramiento",
      },
      {
        id: "ed-2-4",
        texto: "Pasillos interiores con ancho libre ≥ 1,20 m",
        meta: "Sin elementos sobresalientes a < 2,10 m; superficie firme — OGUC",
      },
      {
        id: "ed-2-5",
        texto: "Ascensores accesibles o plataformas elevadoras en edificios de más de un nivel",
        meta: "Cabina ≥ 1,10×1,40 m; botones con braille; avisos sonoros y visuales — OGUC / Art. 28",
      },
    ],
  },
  {
    id: "ed-3",
    titulo: "4.3 Servicios higiénicos",
    items: [
      {
        id: "ed-3-1",
        texto: "Baño accesible en cada planta o a no más de 50 m de distancia",
        meta: "Señalización clara con pictograma y braille — OGUC",
      },
      {
        id: "ed-3-2",
        texto: "Espacio de maniobra interior ≥ 1,50 m de diámetro",
        meta: "Puerta ≥ 0,90 m; apertura hacia afuera o corrediza — OGUC",
      },
      {
        id: "ed-3-3",
        texto: "Inodoro con altura 0,45–0,50 m y barras de apoyo a ambos lados",
        meta: "Lavamanos con espacio para rodillas; grifos palanca o sensor — OGUC",
      },
      {
        id: "ed-3-4",
        texto: "Espejo inclinado o con parte inferior a ≤ 1,00 m del piso",
        meta: "Dispensadores y toallas a 0,90–1,10 m de altura — OGUC",
      },
    ],
  },
  {
    id: "ed-4",
    titulo: "4.4 Señalética y comunicación",
    items: [
      {
        id: "ed-4-1",
        texto: "Señalización visual con alto contraste (≥ 70%) y tipografía legible",
        meta: "Sans-serif; tamaño proporcional; sin reflejos — OGUC",
      },
      {
        id: "ed-4-2",
        texto: "Señalización en braille y relieve en ascensores, puertas y servicios",
        meta: "Altura 1,40–1,60 m desde el piso — OGUC",
      },
      {
        id: "ed-4-3",
        texto: "Pictogramas normalizados (ISO 7001 o NCh) para identificar servicios",
        meta: "Evitar símbolos ambiguos; alto contraste — OGUC",
      },
      {
        id: "ed-4-4",
        texto: "Información en formatos alternativos (digital, audio, lectura fácil)",
        meta: "Folletos, trámites y formularios accesibles — Art. 8 Ley 20.422",
      },
    ],
  },
  {
    id: "ed-5",
    titulo: "4.5 Atención al público",
    items: [
      {
        id: "ed-5-1",
        texto: "Mostrador de atención con altura ≤ 0,80 m o doble altura",
        meta: "Espacio para acercar silla de ruedas; atención preferencial — OGUC",
      },
      {
        id: "ed-5-2",
        texto: "Sala de espera con sillas con/sin apoyabrazos y espacio para silla de ruedas",
        meta: "Bucle magnético en mostrador/sala de espera — OGUC",
      },
      {
        id: "ed-5-3",
        texto: "Personal capacitado en atención inclusiva y trato digno",
        meta: "Conocimiento de ajustes razonables; no infantilizar — Art. 8 Ley 20.422",
      },
      {
        id: "ed-5-4",
        texto: "Protocolo de emergencia con evacuación asistida y zonas de confinamiento",
        meta: "Rutas accesibles; personal asignado; señalización luminosa — OGUC",
      },
    ],
  },
];

export const checklistEvento: ChecklistSection[] = [
  {
    id: "ev-1",
    titulo: "5.1 Planificación y difusión previa",
    items: [
      {
        id: "ev-1-1",
        texto: "La invitación/difusión incluye información sobre accesibilidad del lugar",
        meta: "Transporte, estacionamiento, servicios, contacto para requerimientos — Art. 8 Ley 20.422",
      },
      {
        id: "ev-1-2",
        texto: "Material de difusión accesible (contraste, tamaño de letra, lectura fácil)",
        meta: "Imágenes con texto alternativo; lenguaje claro e inclusivo — Art. 8",
      },
      {
        id: "ev-1-3",
        texto: "Formulario de inscripción consulta necesidades de accesibilidad",
        meta: "Espacio para requerimientos específicos y contacto de confianza",
      },
      {
        id: "ev-1-4",
        texto: "Se designa un coordinador/a de accesibilidad con contacto público",
        meta: "Responsable de verificar medidas antes, durante y después — Art. 23 Ley 20.422",
      },
    ],
  },
  {
    id: "ev-2",
    titulo: "5.2 Lugar y accesos",
    items: [
      {
        id: "ev-2-1",
        texto: "Itinerario accesible desde transporte/estacionamiento hasta la entrada",
        meta: "Vereda ≥ 1,20 m; rebajes en cruces; piso firme e iluminado — OGUC / Art. 28",
      },
      {
        id: "ev-2-2",
        texto: "Entrada principal accesible o entrada alternativa señalizada",
        meta: "Ancho ≥ 0,90 m; sin umbrales; personal de apoyo identificado — OGUC",
      },
      {
        id: "ev-2-3",
        texto: "Baños accesibles disponibles y señalizados en el recinto",
        meta: "Máximo 50 m del área principal; cumplen estándares OGUC",
      },
      {
        id: "ev-2-4",
        texto: "Área de asientos con espacios para sillas de ruedas dispersos",
        meta: "Línea de visión equivalente; asientos acompañantes adyacentes — OGUC",
      },
      {
        id: "ev-2-5",
        texto: "Zonas de descanso con asientos a diferentes alturas y espacios amplios",
        meta: "Considerar fatiga, dolor crónico, personas mayores, embarazadas",
      },
    ],
  },
  {
    id: "ev-3",
    titulo: "5.3 Comunicación e información",
    items: [
      {
        id: "ev-3-1",
        texto: "Intérprete de lengua de señas chilena o subtitulado en tiempo real (CART)",
        meta: "Visible desde todas las posiciones; bien iluminado — Art. 26 Ley 20.422",
      },
      {
        id: "ev-3-2",
        texto: "Sistema de sonido con bucle magnético o FM para audífonos",
        meta: "Anunciar disponibilidad al inicio; probar funcionamiento — OGUC",
      },
      {
        id: "ev-3-3",
        texto: "Presentaciones con contraste adecuado, letra grande, lectura fácil",
        meta: "Describir imágenes oralmente; fondos sin patrones — Art. 8",
      },
      {
        id: "ev-3-4",
        texto: "Programa impreso y digital en formatos accesibles",
        meta: "Braille, audio, lectura fácil o digital compatible con lectores — Art. 27 Ley 20.422",
      },
    ],
  },
  {
    id: "ev-4",
    titulo: "5.4 Atención, protocolo y emergencias",
    items: [
      {
        id: "ev-4-1",
        texto: "Equipo organizador identificado y capacitado en atención inclusiva",
        meta: "Distintivo visible; saber orientar, asistir y no infantilizar — Art. 8",
      },
      {
        id: "ev-4-2",
        texto: "Se informa al inicio sobre rutas de evacuación y medidas de accesibilidad",
        meta: "Baños, zonas de descanso, puntos de apoyo señalados — OGUC",
      },
      {
        id: "ev-4-3",
        texto: "Protocolo de evacuación con asistencia a personas con movilidad reducida",
        meta: "Áreas de confinamiento seguras; rutas accesibles; personal asignado — OGUC",
      },
      {
        id: "ev-4-4",
        texto: "Permitir entrada de perros de asistencia y acompañantes personales",
        meta: "Sin costo adicional; espacio reservado cerca del usuario — Art. 8",
      },
    ],
  },
];
