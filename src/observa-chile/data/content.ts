export interface LeyCard {
  articulo: string;
  titulo: string;
  parrafos: string[];
}

export const leyCards: LeyCard[] = [
  {
    articulo: "Art. 1° a 3°",
    titulo: "Ley N° 20.422",
    parrafos: [
      "Publicada el 10 de febrero de 2010, la Ley 20.422 “Establece normas sobre igualdad de oportunidades e inclusión social de personas con discapacidad”. Se fundamenta en los principios de vida independiente, accesibilidad universal, diseño universal, intersectorialidad, participación y diálogo social.",
    ],
  },
  {
    articulo: "Art. 8°",
    titulo: "Exigencias de accesibilidad y ajustes necesarios",
    parrafos: [
      "El Estado establecerá medidas contra la discriminación, que consistirán en exigencias de accesibilidad, realización de ajustes necesarios y prevención de conductas de acoso.",
      "Exigencias de accesibilidad: requisitos que deben cumplir los bienes, entornos, productos, servicios y procedimientos, con arreglo al principio de accesibilidad universal.",
      "Ajustes necesarios: medidas de adecuación del ambiente físico, social y de actitud a las carencias específicas de las personas con discapacidad que, de forma eficaz y práctica y sin que suponga una carga desproporcionada, faciliten la accesibilidad o participación en igualdad de condiciones.",
    ],
  },
  {
    articulo: "Art. 26°",
    titulo: "Lengua de señas",
    parrafos: [
      "Se reconoce la lengua de señas como medio de comunicación natural de la comunidad sorda. Esto implica que eventos públicos y servicios de atención deben contar con intérpretes de lengua de señas chilena cuando se requiera.",
    ],
  },
  {
    articulo: "Art. 28°",
    titulo: "Accesibilidad en edificios y espacios públicos",
    parrafos: [
      "“Todo edificio de uso público y todo aquel que, sin importar su carga de ocupación, preste un servicio a la comunidad, así como toda nueva edificación colectiva, deberán ser accesibles y utilizables en forma autovalente y sin dificultad por personas con discapacidad, especialmente por aquellas con movilidad reducida.”",
      "Fiscalización: corresponde a las Direcciones de Obras Municipales, que deben denunciar el incumplimiento ante el Juzgado de Policía Local. Cualquier persona puede presentar la denuncia.",
    ],
  },
  {
    articulo: "Art. 31°",
    titulo: "Estacionamientos",
    parrafos: [
      "Los establecimientos comerciales, industriales, de servicios, de espectáculos y espacios de uso público con estacionamientos deben reservar un número suficiente para personas con discapacidad, conforme a la OGUC. La municipalidad vela por su cumplimiento.",
    ],
  },
  {
    articulo: "Art. 57-58°",
    titulo: "Sanciones",
    parrafos: [
      "El incumplimiento constituye un acto arbitrario o ilegal sancionado con multa de 10 a 120 unidades tributarias mensuales (UTM), destinadas a programas para personas con discapacidad de la comuna. En caso de reincidencia, la multa se duplica. El juez puede decretar la clausura del establecimiento.",
    ],
  },
];

export interface NormaOguc {
  id: string;
  titulo: string;
  puntos: { label: string; detalle: string }[];
}

export const normasOguc: NormaOguc[] = [
  {
    id: "oguc-1",
    titulo: "2.1 Veredas y rutas accesibles",
    puntos: [
      { label: "Ancho mínimo continuo", detalle: "1,20 m (1,50 m en plazas y zonas de alta concurrencia)" },
      { label: "Altura libre mínima", detalle: "2,10 m (sin obstáculos colgantes)" },
      { label: "Superficie", detalle: "Firme, continua, antideslizante, sin desniveles abruptos" },
      { label: "Rebajes de cordón", detalle: "Obligatorios en cruces peatonales; pendiente ≤ 12%; ancho ≥ 1,20 m" },
      { label: "Pavimento podotáctil", detalle: "Obligatorio en zonas de riesgo, cambios de nivel, cruces y accesos" },
    ],
  },
  {
    id: "oguc-2",
    titulo: "2.2 Rampas",
    puntos: [
      { label: "Pendiente máxima", detalle: "12% (8% recomendado para mayor comodidad)" },
      { label: "Ancho mínimo", detalle: "1,20 m (1,50 m en espacios públicos de alta concurrencia)" },
      { label: "Descansos", detalle: "Obligatorios cada 9 m de longitud de rampa; dimensiones ≥ 1,50 m × 1,50 m" },
      { label: "Pasamanos", detalle: "A ambos lados, doble altura (0,70 m y 0,90 m), que sobresalgan 0,30 m al inicio y final" },
      { label: "Superficie", detalle: "Antideslizante, sin resbalones ni juntas que dificulten el tránsito" },
    ],
  },
  {
    id: "oguc-3",
    titulo: "2.3 Estacionamientos",
    puntos: [
      { label: "Dimensiones mínimas", detalle: "Largo 5,00 m × ancho 2,50 m" },
      { label: "Franja de seguridad", detalle: "1,10 m adyacente para maniobra de silla de ruedas" },
      { label: "Señalización", detalle: "Pintura demarcatoria, símbolo internacional de accesibilidad, ubicación cercana a accesos" },
    ],
  },
  {
    id: "oguc-4",
    titulo: "2.4 Puertas y accesos",
    puntos: [
      { label: "Ancho libre mínimo", detalle: "0,90 m (1,00 m recomendado)" },
      { label: "Umbral", detalle: "Máximo 13 mm de desnivel; si es mayor, debe resolverse con rampa" },
      { label: "Manillas", detalle: "Tipo palanca, a altura 0,80–1,10 m, con contraste visual" },
      { label: "Fuerza de apertura", detalle: "Máximo 22 N (aprox. 2,2 kg)" },
    ],
  },
  {
    id: "oguc-5",
    titulo: "2.5 Baños accesibles",
    puntos: [
      { label: "Puerta", detalle: "Ancho ≥ 0,90 m, apertura hacia afuera o corrediza" },
      { label: "Espacio de maniobra", detalle: "Diámetro de giro ≥ 1,50 m" },
      { label: "Inodoro", detalle: "Altura 0,45–0,50 m, barras de apoyo horizontales a 0,70 m y verticales a ambos lados" },
      { label: "Lavamanos", detalle: "Altura ≤ 0,80 m, con espacio para rodillas, grifos tipo palanca o sensor" },
      { label: "Espejo", detalle: "Parte inferior a ≤ 1,00 m del piso o inclinado" },
      { label: "Accesorios", detalle: "Dispensadores, toallas, papel a altura 0,90–1,10 m" },
    ],
  },
  {
    id: "oguc-6",
    titulo: "2.6 Ascensores y plataformas",
    puntos: [
      { label: "Cabina", detalle: "Dimensiones mínimas 1,10 m × 1,40 m" },
      { label: "Puertas", detalle: "Automáticas, ancho ≥ 0,90 m" },
      { label: "Botonera", detalle: "Braille y relieve, altura 0,90–1,10 m, contraste visual" },
      { label: "Avisos", detalle: "Sonoros y visuales de piso" },
    ],
  },
  {
    id: "oguc-7",
    titulo: "2.7 Señalética y comunicación",
    puntos: [
      { label: "Contraste", detalle: "Relación luminosa ≥ 70% entre texto y fondo" },
      { label: "Tipografía", detalle: "Sans-serif, tamaño proporcional a distancia de lectura" },
      { label: "Braille y relieve", detalle: "En ascensores, puertas de baños, servicios públicos; altura 1,40–1,60 m" },
      { label: "Pictogramas", detalle: "ISO 7001 o norma chilena equivalente, con contraste" },
      { label: "Bucle magnético", detalle: "En mostradores de atención y salas de espera" },
    ],
  },
];

export interface Hito {
  anio: string;
  titulo: string;
  texto: string;
}

export const timeline: Hito[] = [
  {
    anio: "2010",
    titulo: "Publicación Ley 20.422",
    texto: "Entra en vigencia. Edificios existentes de uso público tienen 3 años para adecuarse (plazo vencido en 2013).",
  },
  {
    anio: "2016",
    titulo: "Decreto 50 modifica OGUC",
    texto: "Publicado el 4 de marzo de 2016. Actualiza la Ordenanza General de Urbanismo y Construcciones con normas técnicas de accesibilidad universal.",
  },
  {
    anio: "2023",
    titulo: "Decreto 30 actualiza OGUC",
    texto: "Última modificación publicada en mayo de 2023. Refuerza y precisa estándares de accesibilidad.",
  },
  {
    anio: "Post-2010",
    titulo: "Edificios posteriores a 2010",
    texto: "Deben cumplir al momento de su recepción final. Si no lo hicieron, tienen 3 años para adecuarse desde la publicación del reglamento.",
  },
  {
    anio: "1994–2010",
    titulo: "Edificios 1994-2010",
    texto: "Solo deben adaptarse en caso de remodelaciones o cambios de uso (Art. 21 Ley 19.284).",
  },
  {
    anio: "Espacio público",
    titulo: "Plazo de 8 años desde 2010",
    texto: "Para que parques, plazas, vías públicas y transporte sean accesibles (plazo vencido en 2018).",
  },
];

export const guiaAntes: string[] = [
  "Reunión de preparación: la docente explica el Art. 28 de la Ley 20.422 y la OGUC. Se reparten roles: medidor/a (cinta y nivel), fotógrafo/a, entrevistador/a, anotador/a. Se revisa la cartilla y se identifican los artículos de la ley aplicables.",
  "Materiales: cinta métrica (mínimo 5 m), nivel de burbuja o app de nivel, cámara o celular, cuaderno de campo, copia de la cartilla, bolígrafo, calculadora para verificar pendientes (%).",
  "Contacto previo: avisar a la municipalidad (Dirección de Obras) o a la organización del evento. Solicitar permiso para fotografiar y medir. Si es edificio público, solicitar permiso de edificación para verificar cumplimiento normativo al momento de recepción.",
];

export const guiaDurante: string[] = [
  "Recorrido simulado: simular ser una persona con discapacidad: ¿puedo entrar solo/a? ¿puedo ir al baño? ¿puedo acceder a la información? ¿puedo evacuar? Verificar cada criterio contra la OGUC y la Ley 20.422.",
  "Medir y fotografiar: ancho de puertas, pendiente de rampas (usar nivel o app), altura de mostradores, dimensiones de baños. Fotografiar barreras Y elementos positivos. Registrar coordenadas GPS si es posible.",
  "Verificar plazos de adecuación: ¿cuándo se construyó el edificio? ¿Es post-2010 (debe cumplir) o pre-1994 (adecuación gradual)? ¿Hay remodelaciones recientes que activaron la obligación de adaptar?",
  "Completar la cartilla: marcar cada ítem en el momento. Anotar observaciones cualitativas y referencias normativas: “rampa existe pero pendiente del 14%, supera el máximo del 12% de la OGUC”.",
];

export const registroFotografico: { titulo: string; detalle: string }[] = [
  { titulo: "Foto general del acceso principal", detalle: "Capturar la fachada, escalones, rampas, señalización." },
  { titulo: "Rampas y escaleras", detalle: "Incluir cinta métrica o referencia de escala para verificar dimensiones." },
  { titulo: "Baños adaptados", detalle: "Ancho, barras de apoyo, inodoro, lavamanos, espejo." },
  { titulo: "Señalética", detalle: "Braille, relieve, pictogramas, contraste visual." },
  { titulo: "Mostrador de atención", detalle: "Altura, espacio para silla de ruedas, bucle magnético." },
  { titulo: "Estacionamientos preferenciales", detalle: "Dimensiones, señalización, ubicación respecto al acceso." },
];

export const preguntasDiscusion: string[] = [
  "¿El edificio/evento cumple con el Art. 28 de la Ley 20.422 y la OGUC? ¿En qué aspectos falla específicamente?",
  "¿Las barreras encontradas son “infranqueables” (impiden totalmente el acceso) o “incómodas” (dificultan pero no impiden)? ¿Qué tipo de discapacidad afectan?",
  "¿Quién tiene la responsabilidad de eliminar cada barrera: la municipalidad (Dirección de Obras), el ministerio sectorial, el organizador privado?",
  "¿Las soluciones propuestas son ajustes razonables (bajo costo, corto plazo) o requieren obra mayor? ¿Cuál sería el costo aproximado?",
  "¿Se puede presentar una denuncia ante el Juzgado de Policía Local (Art. 28 y 58 Ley 20.422)? ¿Qué evidencia se necesita?",
  "¿Qué mensaje envía una municipalidad o ministerio que no cumple con la accesibilidad sobre los derechos de las personas con discapacidad?",
  "¿Qué acciones concretas puede tomar este grupo de estudiantes? ¿Carta al alcalde? ¿Denuncia? ¿Solicitud de información pública (Ley 20.285)?",
];

export const estructuraInforme: { paso: string; detalle: string }[] = [
  { paso: "Portada", detalle: "Nombre de la institución/evento, fecha, lugar, comuna, integrantes del grupo, docente a cargo, institución educativa." },
  { paso: "Introducción", detalle: "Objetivo de la inspección, marco legal de referencia (Ley 20.422, OGUC Decretos 50/2015 y 30/2023, Convención ONU), metodología utilizada." },
  { paso: "Descripción del espacio o evento", detalle: "Ubicación, tipo de edificio/evento, antigüedad, usuario típico, flujo de personas. Indicar si es edificio post-2010 (debe cumplir) o pre-1994 (adecuación gradual)." },
  { paso: "Resultados por dimensión", detalle: "Presentar los 22 criterios de edificios o 17 de eventos, con puntaje, fotos georreferenciadas, observaciones y referencias normativas específicas (Art. 28, OGUC artículo X)." },
  { paso: "Análisis de barreras críticas", detalle: "Identificar las 3 barreras más graves, quiénes las padecen, qué derechos vulneran y qué artículos de la Ley 20.422 se infringen." },
  { paso: "Propuestas de mejora", detalle: "Acciones concretas, responsables (municipalidad, ministerio, organizador), plazos y costos estimados. Distinguir ajustes razonables de obra mayor." },
  { paso: "Acciones de incidencia", detalle: "¿Se enviará carta al alcalde? ¿Denuncia al Juzgado de Policía Local? ¿Solicitud de información pública (Ley 20.285)? ¿Difusión en redes sociales?" },
  { paso: "Conclusiones", detalle: "Nivel general de accesibilidad (alta/media/baja), comparación con otros espacios evaluados, reflexión final sobre el derecho a la accesibilidad universal en Chile." },
  { paso: "Anexos", detalle: "Fotografías con medidas, planos, entrevistas, cartilla completa con marcas, bibliografía normativa." },
];

export const viasDenuncia: { via: string; detalle: string }[] = [
  { via: "Juzgado de Policía Local", detalle: "Denuncia por incumplimiento del Art. 28 de la Ley 20.422. Cualquier persona puede denunciar. La multa va de 10 a 120 UTM." },
  { via: "Dirección de Obras Municipal", detalle: "Requerimiento de fiscalización. La municipalidad debe velar por el cumplimiento de la OGUC." },
  { via: "Servicio Nacional de la Discapacidad (SENADIS)", detalle: "Canal de orientación y derivación para personas con discapacidad." },
  { via: "Ley de Transparencia (Ley 20.285)", detalle: "Solicitar permisos de edificación, planos, recepciones finales y documentos que acrediten cumplimiento normativo." },
  { via: "Consejo para la Transparencia", detalle: "Reclamo si la municipalidad no entrega la información solicitada." },
];
