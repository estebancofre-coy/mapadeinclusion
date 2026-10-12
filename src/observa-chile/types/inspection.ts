export type EvalState = "cumple" | "nocumple" | "na";

export type ModoInspeccion = "edificio" | "evento";

export interface ChecklistItem {
  id: string;
  texto: string;
  meta: string;
}

export interface ChecklistSection {
  id: string;
  titulo: string;
  items: ChecklistItem[];
}

export interface DatosGenerales {
  institucion: string;
  docente: string;
  estudiantes: string;
  fecha: string;
  horaInicio: string;
  horaTermino: string;
  lugar: string;
  direccion: string;
  comuna: string;
  tipoEdificio: string;
  anioConstruccion: string;
  permisoEdificacion: string;
}

export interface Entrevista {
  nombre: string;
  rol: string;
  consentimiento: string;
  notas: string;
}

export interface Evidencia {
  id: number;
  descripcion: string;
  ubicacion: string;
  medicion: string;
  foto: string | null;
}

export interface InspectionState {
  modo: ModoInspeccion;
  datos: DatosGenerales;
  evaluaciones: Record<string, EvalState>;
  notas: Record<string, string>;
  observaciones: string;
  entrevista: Entrevista;
  evidencias: Evidencia[];
}

export interface ScoreResult {
  cumple: number;
  noCumple: number;
  na: number;
  aplicables: number;
  total: number;
  porcentaje: number | null;
  nivel: "alta" | "media" | "baja" | null;
}

export const emptyDatos: DatosGenerales = {
  institucion: "",
  docente: "",
  estudiantes: "",
  fecha: "",
  horaInicio: "",
  horaTermino: "",
  lugar: "",
  direccion: "",
  comuna: "",
  tipoEdificio: "",
  anioConstruccion: "",
  permisoEdificacion: "",
};

export const emptyEntrevista: Entrevista = {
  nombre: "",
  rol: "",
  consentimiento: "",
  notas: "",
};

export function emptyEvidencias(): Evidencia[] {
  return Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    descripcion: "",
    ubicacion: "",
    medicion: "",
    foto: null,
  }));
}

export function initialState(): InspectionState {
  return {
    modo: "edificio",
    datos: { ...emptyDatos },
    evaluaciones: {},
    notas: {},
    observaciones: "",
    entrevista: { ...emptyEntrevista },
    evidencias: emptyEvidencias(),
  };
}

export function computeScore(
  sections: ChecklistSection[],
  evaluaciones: Record<string, EvalState>
): ScoreResult {
  let cumple = 0;
  let noCumple = 0;
  let na = 0;
  let total = 0;
  for (const sec of sections) {
    for (const item of sec.items) {
      total += 1;
      const ev = evaluaciones[item.id];
      if (ev === "cumple") cumple += 1;
      else if (ev === "nocumple") noCumple += 1;
      else if (ev === "na") na += 1;
    }
  }
  const aplicables = cumple + noCumple;
  const porcentaje = aplicables > 0 ? Math.round((cumple / aplicables) * 100) : null;
  const nivel =
    porcentaje === null ? null : porcentaje >= 80 ? "alta" : porcentaje >= 50 ? "media" : "baja";
  return { cumple, noCumple, na, aplicables, total, porcentaje, nivel };
}

export const NIVEL_LABEL: Record<"alta" | "media" | "baja", string> = {
  alta: "Alta accesibilidad",
  media: "Media accesibilidad",
  baja: "Baja accesibilidad",
};
