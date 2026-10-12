export interface Organizacion {
  id: number; nombre: string; comuna: string; tipo: string; direccion: string;
  telefono: string; email: string; horario: string; descripcion: string;
  accesibilidad: string; lat: number; lng: number; estado: 'activa' | 'pendiente'; cohorte: string;
}

export const ORGANIZACIONES_BASE: Organizacion[] = [
  {
    "id": 1,
    "nombre": "ACIPA — Asociación de Ciegos de la Patagonia",
    "comuna": "Coyhaique",
    "tipo": "Visual",
    "direccion": "Av. Baquedano 1234, Coyhaique",
    "telefono": "+56 67 223 4567",
    "email": "contacto@acipa.cl",
    "horario": "Lunes a viernes, 09:00 a 17:00 hrs.",
    "descripcion": "Agrupación de personas con discapacidad visual de la Patagonia chilena. Ofrece apoyo mutuo, orientación y movilidad, actividades recreativas y representación ante organismos públicos. Su presidenta, Cristina Barrientos, colabora activamente con el curso Trabajo Social y Discapacidad de la Universidad de Aysén.",
    "accesibilidad": "Sede con acceso nivelado, señalización en braille y personal capacitado en guía de personas ciegas.",
    "lat": -45.5712,
    "lng": -72.0685,
    "estado": "activa",
    "cohorte": "2026-II"
  },
  {
    "id": 2,
    "nombre": "Agrupación TEA Aysén — Familias del Espectro Autista",
    "comuna": "Coyhaique",
    "tipo": "Neurodivergencia",
    "direccion": "Calle Bilbao 456, Coyhaique",
    "telefono": "+56 9 8765 4321",
    "email": "tea.aysen@gmail.com",
    "horario": "Martes y jueves, 15:00 a 18:00 hrs.",
    "descripcion": "Corporación de familias de personas dentro del espectro autista. Desarrolla talleres de apoyo familiar, instancias de socialización para niños, niñas y adolescentes, y difusión sobre neurodivergencia en escuelas de la región.",
    "accesibilidad": "Espacio con sala de estimulación tranquila y pictogramas de apoyo a la comunicación.",
    "lat": -45.5756,
    "lng": -72.066,
    "estado": "activa",
    "cohorte": "2026-II"
  },
  {
    "id": 3,
    "nombre": "Agrupación de Sordos de Aysén",
    "comuna": "Puerto Aysén",
    "tipo": "Auditiva",
    "direccion": "Sargento Aldea 789, Puerto Aysén",
    "telefono": "+56 9 7654 3210 (solo mensajes)",
    "email": "sordos.aysen@outlook.com",
    "horario": "Sábados, 11:00 a 13:00 hrs.",
    "descripcion": "Organización de personas sordas y usuarias de Lengua de Señas Chilena (LSCh). Promueve clases de lengua de señas abiertas a la comunidad, instancias culturales y acompañamiento en trámites con intérpretes.",
    "accesibilidad": "Reuniones con interpretación en LSCh; comunicación por escrito y videollamada.",
    "lat": -45.403,
    "lng": -72.6918,
    "estado": "pendiente",
    "cohorte": "2026-II"
  },
  {
    "id": 4,
    "nombre": "Movimiento Independiente — Discapacidad Física Aysén",
    "comuna": "Coyhaique",
    "tipo": "Física",
    "direccion": "Pasaje Lautaro 321, Coyhaique",
    "telefono": "+56 67 267 8901",
    "email": "mi.aysen@gmail.com",
    "horario": "Lunes, miércoles y viernes, 10:00 a 16:00 hrs.",
    "descripcion": "Agrupación de personas con discapacidad física y movilidad reducida. Trabaja por la accesibilidad universal del espacio público, el transporte inclusivo y el acompañamiento entre pares para vida independiente.",
    "accesibilidad": "Sede con rampa de acceso, baño universal y estacionamiento preferente.",
    "lat": -45.5698,
    "lng": -72.0721,
    "estado": "activa",
    "cohorte": "2026-II"
  },
  {
    "id": 5,
    "nombre": "Corporación Sol Inclusivo — Discapacidad Intelectual",
    "comuna": "Puerto Aysén",
    "tipo": "Intelectual",
    "direccion": "Av. Costanera 234, Puerto Aysén",
    "telefono": "+56 67 233 2211",
    "email": "solinclusivo@correo.cl",
    "horario": "Lunes a viernes, 09:30 a 13:30 hrs.",
    "descripcion": "Corporación de familias y personas con discapacidad intelectual. Ofrece talleres ocupacionales, apoyo a la inserción laboral protegida y actividades deportivas y artísticas inclusivas.",
    "accesibilidad": "Comunicación en lectura fácil; apoyos visuales en todos los espacios.",
    "lat": -45.3985,
    "lng": -72.6944,
    "estado": "pendiente",
    "cohorte": "2026-II"
  },
  {
    "id": 6,
    "nombre": "Colectivo Mentes Libres — Salud Mental Aysén",
    "comuna": "Chile Chico",
    "tipo": "Psicosocial",
    "direccion": "Calle O'Higgins 567, Chile Chico",
    "telefono": "+56 9 6543 2109",
    "email": "menteslibres.aysen@gmail.com",
    "horario": "Miércoles, 18:00 a 20:00 hrs.",
    "descripcion": "Colectivo de personas con experiencia en discapacidad psicosocial. Desarrolla espacios de apoyo mutuo, difusión de derechos en salud mental y articulación con los servicios de salud del territorio.",
    "accesibilidad": "Encuentros con pautas de cuidado acordadas; participación flexible y sin requisitos.",
    "lat": -46.5403,
    "lng": -71.7225,
    "estado": "activa",
    "cohorte": "2026-II"
  },
  {
    "id": 7,
    "nombre": "Agrupación Inclusiva Austral — Red Territorial",
    "comuna": "Cochrane",
    "tipo": "Mixta",
    "direccion": "Plaza de Armas s/n, Cochrane",
    "telefono": "+56 9 5432 1098",
    "email": "inclusivaaustral@gmail.com",
    "horario": "Último sábado de cada mes, 15:00 hrs.",
    "descripcion": "Red territorial que articula agrupaciones de distintos tipos de discapacidad en la provincia Capitán Prat. Coordina actividades de difusión, formación en derechos y representación en el consejo comunal de inclusión.",
    "accesibilidad": "Actividades itinerantes con criterios de accesibilidad universal.",
    "lat": -47.2545,
    "lng": -72.5731,
    "estado": "activa",
    "cohorte": "2026-II"
  },
  {
    "id": 8,
    "nombre": "Taller de Arte y Neurodiversidad Patagonia",
    "comuna": "Coyhaique",
    "tipo": "Neurodivergencia",
    "direccion": "Calle Errázuriz 890, Coyhaique",
    "telefono": "+56 9 4321 0987",
    "email": "arte.neurodiversidad@gmail.com",
    "horario": "Martes, 16:00 a 18:30 hrs.",
    "descripcion": "Espacio de creación artística para jóvenes y adultos neurodivergentes. Combina talleres de arte, música y teatro con instancias de encuentro y validación de las identidades neurodivergentes.",
    "accesibilidad": "Materiales adaptados, pausas sensoriales y asistencia personalizada.",
    "lat": -45.578,
    "lng": -72.0712,
    "estado": "pendiente",
    "cohorte": "2026-II"
  },
  {
    "id": 9,
    "nombre": "Club Deportivo Inclusivo Cisnes",
    "comuna": "Cisnes",
    "tipo": "Física",
    "direccion": "Gimnasio Municipal, Cisnes",
    "telefono": "+56 9 3210 9876",
    "email": "deporte.cisnes@gmail.com",
    "horario": "Sábados, 10:00 a 12:00 hrs.",
    "descripcion": "Club deportivo que desarrolla básquetbol en silla de ruedas, boccia y natación adaptada para personas con discapacidad física de la comuna de Cisnes y localidades aledañas.",
    "accesibilidad": "Gimnasio con acceso nivelado, camarines universales y sillas deportivas disponibles en préstamo.",
    "lat": -44.7286,
    "lng": -72.6984,
    "estado": "activa",
    "cohorte": "2026-II"
  },
  {
    "id": 10,
    "nombre": "Agrupación Manos que Hablan — LSCh Guaitecas",
    "comuna": "Guaitecas",
    "tipo": "Auditiva",
    "direccion": "Centro Comunitario Melinka, Guaitecas",
    "telefono": "+56 9 2109 8765 (solo mensajes)",
    "email": "manosquehablan@gmail.com",
    "horario": "Primer viernes de cada mes, 17:00 hrs.",
    "descripcion": "Agrupación de personas sordas del archipiélago de las Guaitecas. Mantiene un círculo de práctica de Lengua de Señas Chilena abierto a la comunidad insular y gestiona apoyos para trámites y atenciones de salud.",
    "accesibilidad": "Encuentros con intérprete de LSCh; coordinación por mensajería de texto.",
    "lat": -43.9,
    "lng": -73.75,
    "estado": "pendiente",
    "cohorte": "2026-II"
  },
  {
    "id": 11,
    "nombre": "Red de Apoyo TDAH Aysén",
    "comuna": "Coyhaique",
    "tipo": "Neurodivergencia",
    "direccion": "Calle Lillo 156, Coyhaique",
    "telefono": "+56 9 1098 7654",
    "email": "tdah.aysen@gmail.com",
    "horario": "Jueves, 19:00 a 20:30 hrs. (modalidad híbrida)",
    "descripcion": "Red de adultos con TDAH y familias de niños y niñas con TDAH. Organiza grupos de apoyo mutuo, charlas de psicoeducación y orientación sobre evaluación y acompañamiento en la región.",
    "accesibilidad": "Modalidad híbrida presencial y en línea; grabaciones y resúmenes en lectura fácil.",
    "lat": -45.5738,
    "lng": -72.0755,
    "estado": "activa",
    "cohorte": "2026-II"
  },
  {
    "id": 12,
    "nombre": "Agrupación Nuevo Amanecer — O'Higgins",
    "comuna": "O'Higgins",
    "tipo": "Mixta",
    "direccion": "Casa de la Cultura, Villa O'Higgins",
    "telefono": "+56 9 0987 6543",
    "email": "nuevoamanecer.ohiggins@gmail.com",
    "horario": "Segundo sábado de cada mes, 15:00 hrs.",
    "descripcion": "Agrupación territorial de personas con discapacidad y sus familias de Villa O'Higgins. Trabaja por el acceso a servicios de rehabilitación, transporte inclusivo en rutas australes y participación comunitaria.",
    "accesibilidad": "Reuniones en espacios públicos accesibles; apoyo de traslado coordinado entre socios.",
    "lat": -48.4689,
    "lng": -72.5594,
    "estado": "activa",
    "cohorte": "2026-II"
  },
  {
    "id": 13,
    "nombre": "Comité de Madres y Padres por la Inclusión Educativa — Lago Verde",
    "comuna": "Lago Verde",
    "tipo": "Intelectual",
    "direccion": "Escuela Rural La Tapera, Lago Verde",
    "telefono": "+56 9 9876 5432",
    "email": "inclusion.lagoverde@gmail.com",
    "horario": "Según calendario escolar",
    "descripcion": "Comité de familias que promueve la inclusión educativa de estudiantes con discapacidad intelectual y del desarrollo en las escuelas rurales de la comuna, en articulación con los proyectos de integración escolar.",
    "accesibilidad": "Materiales en lectura fácil y acompañamiento personalizado a familias.",
    "lat": -44.243,
    "lng": -71.85,
    "estado": "activa",
    "cohorte": "2026-II"
  },
  {
    "id": 14,
    "nombre": "Colectivo Río Ibáñez Inclusivo",
    "comuna": "Río Ibáñez",
    "tipo": "Mixta",
    "direccion": "Sede Social Puerto Ingeniero Ibáñez",
    "telefono": "+56 9 8765 1234",
    "email": "colectivo.rioibanez@gmail.com",
    "horario": "Últimos viernes de cada mes, 16:00 hrs.",
    "descripcion": "Colectivo comunal de personas con discapacidad, cuidadoras y cuidadores. Gestiona adecuaciones de accesibilidad en espacios públicos de la comuna y actividades de encuentro y recreación inclusiva.",
    "accesibilidad": "Actividades con criterios de diseño universal; comunicación simple y directa.",
    "lat": -46.298,
    "lng": -71.937,
    "estado": "pendiente",
    "cohorte": "2026-II"
  }
];

export const STORAGE_KEY = 'aysen_organizaciones_v3';

export function cargarOrganizaciones(): Organizacion[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Organizacion[];
  } catch { /* noop */ }
  guardarOrganizaciones(ORGANIZACIONES_BASE);
  return ORGANIZACIONES_BASE;
}

export function guardarOrganizaciones(orgs: Organizacion[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orgs));
}

export function agregarOrganizacion(org: Omit<Organizacion, 'id' | 'estado' | 'cohorte'>): Organizacion[] {
  const orgs = cargarOrganizaciones();
  const nueva: Organizacion = { ...org, id: Math.max(0, ...orgs.map(o => o.id)) + 1, estado: 'pendiente', cohorte: '2026-II' };
  orgs.push(nueva);
  guardarOrganizaciones(orgs);
  return orgs;
}

export function validarOrganizacion(id: number): Organizacion[] {
  const orgs = cargarOrganizaciones().map(o => o.id === id ? { ...o, estado: 'activa' as const } : o);
  guardarOrganizaciones(orgs);
  return orgs;
}

export function eliminarOrganizacion(id: number): Organizacion[] {
  const orgs = cargarOrganizaciones().filter(o => o.id !== id);
  guardarOrganizaciones(orgs);
  return orgs;
}

export interface UsuarioDemo { email: string; nombre: string; rol: 'admin' | 'operador' | 'estudiante'; password: string; }

export const USUARIOS_DEMO: UsuarioDemo[] = [
  { email: 'esteban.cofre@uaysen.cl', nombre: 'Esteban Cofré', rol: 'admin', password: 'password123' },
  { email: 'romina.barria@uaysen.cl', nombre: 'Romina Barría', rol: 'operador', password: 'password123' },
  { email: 'estudiante@uaysen.cl', nombre: 'Estudiante Demo', rol: 'estudiante', password: 'password123' },
];

export interface LogEntry { fecha: string; usuario: string; accion: string; }
const LOG_KEY = 'aysen_log_v1';

export function registrarLog(usuario: string, accion: string): void {
  const log: LogEntry[] = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
  log.unshift({ fecha: new Date().toLocaleString('es-CL'), usuario, accion });
  localStorage.setItem(LOG_KEY, JSON.stringify(log.slice(0, 100)));
}

export function leerLog(): LogEntry[] {
  return JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
}

export const COMUNAS = [...new Set(ORGANIZACIONES_BASE.map(o => o.comuna))].sort();
export const TIPOS = [...new Set(ORGANIZACIONES_BASE.map(o => o.tipo))].sort();
