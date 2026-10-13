import { useEffect, useMemo, useRef, useState } from "react";
import {
  Building2,
  CalendarRange,
  Check,
  Download,
  Eraser,
  Minus,
  StickyNote,
  Upload,
  X,
} from "lucide-react";
import { checklistEdificio, checklistEvento } from "@/observa-chile/data/checklists";
import {
  computeScore,
  initialState,
  NIVEL_LABEL,
  type EvalState,
  type InspectionState,
} from "@/observa-chile/types/inspection";
import { generatePdf } from "@/observa-chile/lib/pdf";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

const STORAGE_KEY = "observa-chile-inspeccion-v1";

function loadState(): InspectionState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...initialState(), ...JSON.parse(raw) };
  } catch {
    /* estado corrupto: se reinicia */
  }
  return initialState();
}

async function fileToDataUrl(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const max = 900;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

const EVAL_OPTIONS: { value: EvalState; label: string; short: string }[] = [
  { value: "cumple", label: "Cumple", short: "Sí" },
  { value: "nocumple", label: "No cumple", short: "No" },
  { value: "na", label: "No aplica", short: "N/A" },
];

const datosFields: { key: keyof InspectionState["datos"]; label: string; type?: string; placeholder?: string }[] = [
  { key: "institucion", label: "Institución educativa", placeholder: "Universidad / carrera / asignatura" },
  { key: "docente", label: "Docente a cargo" },
  { key: "estudiantes", label: "Integrantes del grupo", placeholder: "Nombres separados por coma" },
  { key: "fecha", label: "Fecha de inspección", type: "date" },
  { key: "horaInicio", label: "Hora inicio", type: "time" },
  { key: "horaTermino", label: "Hora término", type: "time" },
  { key: "lugar", label: "Nombre del edificio / evento" },
  { key: "direccion", label: "Dirección" },
  { key: "comuna", label: "Comuna" },
  { key: "tipoEdificio", label: "Tipo de edificio / evento", placeholder: "Municipalidad, biblioteca, feria…" },
  { key: "anioConstruccion", label: "Año de construcción", type: "number" },
  { key: "permisoEdificacion", label: "¿Permiso de edificación vigente?", placeholder: "Sí / No / Se desconoce" },
];

export default function Inspeccion() {
  const dentroDeMarco = window.parent !== window;
  const [state, setState] = useState<InspectionState>(() =>
    dentroDeMarco ? initialState() : loadState()
  );
  const [notasAbiertas, setNotasAbiertas] = useState<Record<string, boolean>>({});
  const fileInputs = useRef<Record<number, HTMLInputElement | null>>({});
  const [hostOrigin, setHostOrigin] = useState<string | null>(null);
  const [envio, setEnvio] = useState<
    | { estado: "inactivo" }
    | { estado: "enviando" }
    | { estado: "error" }
    | { estado: "enviado"; codigo: string }
  >({ estado: "inactivo" });
  const [confirmarEnvio, setConfirmarEnvio] = useState(false);

  useEffect(() => {
    if (dentroDeMarco) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        /* almacenamiento lleno (fotos grandes): se omite el guardado */
      }
    }, 400);
    return () => clearTimeout(t);
  }, [dentroDeMarco, state]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== window.parent) return;
      const host = new URL(event.origin);
      const esAppsScript =
        host.protocol === "https:" &&
        (host.hostname === "script.google.com" ||
          host.hostname === "script.googleusercontent.com" ||
          host.hostname.endsWith(".script.googleusercontent.com"));
      if (!esAppsScript) return;

      if (event.data?.type === "ESPORA_INSPECTION_HOST_READY") {
        setHostOrigin(event.origin);
        window.parent.postMessage({ type: "ESPORA_INSPECTION_CHILD_READY" }, event.origin);
      } else if (event.data?.type === "ESPORA_INSPECTION_SAVED") {
        setEnvio({ estado: "enviado", codigo: event.data.codigo });
      } else if (event.data?.type === "ESPORA_INSPECTION_FAILED") {
        setEnvio({ estado: "error" });
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const sections = state.modo === "edificio" ? checklistEdificio : checklistEvento;
  const score = useMemo(() => computeScore(sections, state.evaluaciones), [sections, state.evaluaciones]);
  const progreso = useMemo(() => {
    const evaluados = Object.keys(state.evaluaciones).filter((k) =>
      sections.some((s) => s.items.some((i) => i.id === k))
    ).length;
    return Math.round((evaluados / score.total) * 100);
  }, [state.evaluaciones, sections, score.total]);

  const setEval = (id: string, v: EvalState) =>
    setState((s) => {
      const evaluaciones = { ...s.evaluaciones };
      if (evaluaciones[id] === v) delete evaluaciones[id];
      else evaluaciones[id] = v;
      return { ...s, evaluaciones };
    });

  const nivelColor =
    score.nivel === "alta"
      ? "bg-emerald-600"
      : score.nivel === "media"
        ? "bg-amber-500"
        : score.nivel === "baja"
          ? "bg-red-600"
          : "bg-muted";

  const descargarPdf = () => generatePdf(state, sections, score);

  const enviarAlEquipo = () => {
    if (!hostOrigin || !confirmarEnvio || envio.estado === "enviando") return;
    setEnvio({ estado: "enviando" });
    window.parent.postMessage(
      { type: "ESPORA_INSPECTION_SUBMIT", inspeccion: { state, score } },
      hostOrigin
    );
  };

  const limpiar = () => {
    if (window.confirm("¿Borrar todos los datos de la inspección actual?")) {
      localStorage.removeItem(STORAGE_KEY);
      setState(initialState());
      setNotasAbiertas({});
    }
  };

  return (
    <section id="inspeccion" className="scroll-mt-20 py-16 sm:py-24">
      <div className="section-shell">
        <p className="section-eyebrow">Instrumento de evaluación</p>
        <h2 className="font-serif-display mt-2 text-3xl font-semibold text-foreground sm:text-4xl">
          Cartilla de inspección
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Evalúa cada criterio en terreno y agrega observaciones con medidas y
          referencias normativas. Tus respuestas se guardan automáticamente en este
          navegador si completas la cartilla desde el sitio público; en el portal Apps
          Script puedes enviarlas al archivo privado del equipo.
        </p>

        {/* Selector de tipo de inspección */}
        <div className="mt-8">
          <p className="text-sm font-semibold text-foreground">
            Paso 1 — ¿Qué vas a inspeccionar?
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {(
              [
                {
                  value: "edificio" as const,
                  icon: Building2,
                  titulo: "Edificio público",
                  detalle: "Municipalidades, bibliotecas, hospitales, servicios…",
                  criterios: "22 criterios · 5 dimensiones",
                },
                {
                  value: "evento" as const,
                  icon: CalendarRange,
                  titulo: "Evento público",
                  detalle: "Ferias, ceremonias, charlas, actividades masivas…",
                  criterios: "17 criterios · 4 dimensiones",
                },
              ]
            ).map((opt) => {
              const activo = state.modo === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setState((s) => ({ ...s, modo: opt.value }))}
                  aria-pressed={activo}
                  className={`flex items-start gap-4 rounded-xl border-2 p-5 text-left transition-all ${
                    activo
                      ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/30"
                      : "border-border bg-white hover:border-primary/40"
                  }`}
                >
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
                      activo ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"
                    }`}
                  >
                    <opt.icon className="h-6 w-6" />
                  </span>
                  <span className="flex-1">
                    <span className="flex items-center gap-2">
                      <span className="font-serif-display text-lg font-semibold text-foreground">
                        {opt.titulo}
                      </span>
                      {activo && (
                        <Badge className="bg-primary text-primary-foreground hover:bg-primary">
                          Seleccionado
                        </Badge>
                      )}
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">{opt.detalle}</span>
                    <span className="mt-1.5 block text-xs font-semibold uppercase tracking-wide text-accent">
                      {opt.criterios}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
          <div className="space-y-10">
            {/* Datos generales */}
            <div className="paper-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-serif-display text-xl font-semibold text-primary">
                  Paso 2 — Datos generales
                </h3>
                <Badge variant="outline" className="border-primary/30 text-primary">
                  {state.modo === "edificio" ? "Inspección de edificio" : "Inspección de evento"}
                </Badge>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {datosFields
                  .filter(
                    (f) =>
                      state.modo === "edificio" ||
                      (f.key !== "anioConstruccion" && f.key !== "permisoEdificacion")
                  )
                  .map((f) => {
                  const label =
                    f.key === "lugar"
                      ? state.modo === "edificio"
                        ? "Nombre del edificio"
                        : "Nombre del evento"
                      : f.key === "tipoEdificio"
                        ? state.modo === "edificio"
                          ? "Tipo de edificio"
                          : "Tipo de evento"
                        : f.label;
                  return (
                  <div key={f.key} className={f.key === "estudiantes" || f.key === "lugar" ? "sm:col-span-2" : ""}>
                    <Label htmlFor={`dg-${f.key}`} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {label}
                    </Label>
                    <Input
                      id={`dg-${f.key}`}
                      type={f.type ?? "text"}
                      placeholder={f.placeholder}
                      className="mt-1.5 bg-white"
                      value={state.datos[f.key]}
                      onChange={(e) =>
                        setState((s) => ({ ...s, datos: { ...s.datos, [f.key]: e.target.value } }))
                      }
                    />
                  </div>
                  );
                })}
              </div>
            </div>

            {/* Checklist */}
            {sections.map((sec) => (
              <div key={sec.id}>
                <h3 className="font-serif-display text-xl font-semibold text-primary">{sec.titulo}</h3>
                <div className="paper-card mt-4 divide-y divide-border overflow-hidden">
                  {sec.items.map((item, idx) => {
                    const ev = state.evaluaciones[item.id];
                    const notaAbierta = notasAbiertas[item.id] || Boolean(state.notas[item.id]);
                    return (
                      <div key={item.id} className="p-4 sm:p-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex gap-3">
                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-primary">
                              {idx + 1}
                            </span>
                            <div>
                              <p className="text-sm font-medium leading-snug text-foreground">{item.texto}</p>
                              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.meta}</p>
                            </div>
                          </div>
                          <div className="flex shrink-0 gap-1.5 pl-9 sm:pl-0">
                            {EVAL_OPTIONS.map((opt) => {
                              const active = ev === opt.value;
                              const activeCls =
                                opt.value === "cumple"
                                  ? "border-emerald-600 bg-emerald-600 text-white"
                                  : opt.value === "nocumple"
                                    ? "border-red-600 bg-red-600 text-white"
                                    : "border-slate-500 bg-slate-500 text-white";
                              return (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => setEval(item.id, opt.value)}
                                  title={opt.label}
                                  className={`rounded-md border px-2.5 py-1.5 text-xs font-semibold transition-colors sm:px-3 ${
                                    active
                                      ? activeCls
                                      : "border-border bg-white text-muted-foreground hover:border-primary/40 hover:text-foreground"
                                  }`}
                                >
                                  {opt.short}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <div className="pl-9">
                          {!notaAbierta ? (
                            <button
                              type="button"
                              onClick={() => setNotasAbiertas((m) => ({ ...m, [item.id]: true }))}
                              className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
                            >
                              <StickyNote className="h-3.5 w-3.5" /> Agregar observación
                            </button>
                          ) : (
                            <Textarea
                              className="mt-3 bg-white text-sm"
                              rows={2}
                              placeholder="Ej.: rampa existe pero pendiente del 14%, supera el máximo del 12% de la OGUC"
                              value={state.notas[item.id] ?? ""}
                              onChange={(e) =>
                                setState((s) => ({ ...s, notas: { ...s.notas, [item.id]: e.target.value } }))
                              }
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Observaciones generales */}
            <div className="paper-card p-6">
              <h3 className="font-serif-display text-xl font-semibold text-primary">Observaciones generales</h3>
              <Textarea
                className="mt-4 bg-white"
                rows={5}
                placeholder="Barreras críticas detectadas, contexto del lugar, antecedentes relevantes…"
                value={state.observaciones}
                onChange={(e) => setState((s) => ({ ...s, observaciones: e.target.value }))}
              />
            </div>

            {/* Entrevista */}
            <div className="paper-card p-6">
              <h3 className="font-serif-display text-xl font-semibold text-primary">
                Entrevista <span className="text-sm font-normal text-muted-foreground">(opcional, con consentimiento)</span>
              </h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {(
                  [
                    ["nombre", "Nombre entrevistado/a"],
                    ["rol", "Rol (usuario, funcionario…)"],
                    ["consentimiento", "¿Consentimiento informado?"],
                  ] as const
                ).map(([k, label]) => (
                  <div key={k}>
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</Label>
                    <Input
                      className="mt-1.5 bg-white"
                      placeholder={k === "consentimiento" ? "Sí / No" : undefined}
                      value={state.entrevista[k]}
                      onChange={(e) =>
                        setState((s) => ({ ...s, entrevista: { ...s.entrevista, [k]: e.target.value } }))
                      }
                    />
                  </div>
                ))}
              </div>
              <Textarea
                className="mt-4 bg-white"
                rows={3}
                placeholder="Notas de la entrevista…"
                value={state.entrevista.notas}
                onChange={(e) =>
                  setState((s) => ({ ...s, entrevista: { ...s.entrevista, notas: e.target.value } }))
                }
              />
            </div>

            {/* Evidencias */}
            <div className="paper-card p-6">
              <h3 className="font-serif-display text-xl font-semibold text-primary">Registro fotográfico y evidencia</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Adjunta fotografías (se incluirán en el PDF) y registra la medición verificada.
              </p>
              <div className="mt-5 space-y-4">
                {state.evidencias.map((ev, i) => (
                  <div key={ev.id} className="rounded-lg border border-border bg-white p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-primary">Evidencia #{ev.id}</span>
                      <div className="flex items-center gap-2">
                        <input
                          ref={(el) => {
                            fileInputs.current[ev.id] = el;
                          }}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (!f) return;
                            const foto = await fileToDataUrl(f);
                            setState((s) => {
                              const evidencias = [...s.evidencias];
                              evidencias[i] = { ...evidencias[i], foto };
                              return { ...s, evidencias };
                            });
                            e.target.value = "";
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputs.current[ev.id]?.click()}
                        >
                          <Upload className="mr-1.5 h-3.5 w-3.5" />
                          {ev.foto ? "Cambiar foto" : "Subir foto"}
                        </Button>
                        {ev.foto && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setState((s) => {
                                const evidencias = [...s.evidencias];
                                evidencias[i] = { ...evidencias[i], foto: null };
                                return { ...s, evidencias };
                              })
                            }
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                    {ev.foto && (
                      <img
                        src={ev.foto}
                        alt={`Evidencia ${ev.id}`}
                        className="mt-3 h-32 w-auto rounded-md border border-border object-cover"
                      />
                    )}
                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      <Input
                        placeholder="Descripción"
                        className="bg-white"
                        value={ev.descripcion}
                        onChange={(e) =>
                          setState((s) => {
                            const evidencias = [...s.evidencias];
                            evidencias[i] = { ...evidencias[i], descripcion: e.target.value };
                            return { ...s, evidencias };
                          })
                        }
                      />
                      <Input
                        placeholder="Ubicación / referencia"
                        className="bg-white"
                        value={ev.ubicacion}
                        onChange={(e) =>
                          setState((s) => {
                            const evidencias = [...s.evidencias];
                            evidencias[i] = { ...evidencias[i], ubicacion: e.target.value };
                            return { ...s, evidencias };
                          })
                        }
                      />
                      <Input
                        placeholder="Medición (ej.: 0,85 m)"
                        className="bg-white"
                        value={ev.medicion}
                        onChange={(e) =>
                          setState((s) => {
                            const evidencias = [...s.evidencias];
                            evidencias[i] = { ...evidencias[i], medicion: e.target.value };
                            return { ...s, evidencias };
                          })
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Panel de puntaje */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="paper-card border-t-4 border-t-accent p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Resultado en vivo
              </p>
              <div className="mt-4 flex items-end justify-between">
                <p className="font-serif-display text-4xl font-semibold text-foreground">
                  {score.porcentaje === null ? "—" : `${score.porcentaje}%`}
                </p>
                {score.nivel && (
                  <Badge className={`${nivelColor} text-white hover:${nivelColor}`}>
                    {NIVEL_LABEL[score.nivel]}
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {score.cumple} de {score.aplicables} criterios aplicables cumplidos
              </p>

              <div className="mt-5">
                <div className="flex justify-between text-xs font-medium text-muted-foreground">
                  <span>Avance de la cartilla</span>
                  <span>{progreso}%</span>
                </div>
                <Progress value={progreso} className="mt-2 h-2" />
              </div>

              <div className="mt-5 space-y-2 text-sm">
                <p className="flex items-center gap-2 text-emerald-700">
                  <Check className="h-4 w-4" /> Cumple: <strong>{score.cumple}</strong>
                </p>
                <p className="flex items-center gap-2 text-red-700">
                  <X className="h-4 w-4" /> No cumple: <strong>{score.noCumple}</strong>
                </p>
                <p className="flex items-center gap-2 text-slate-500">
                  <Minus className="h-4 w-4" /> No aplica: <strong>{score.na}</strong>
                </p>
              </div>

              <div className="mt-5 rounded-lg bg-secondary/60 p-3 text-xs leading-relaxed text-muted-foreground">
                <strong className="text-foreground">Escala:</strong> ≥ 80% alta · 50–79% media ·
                &lt; 50% baja accesibilidad. Bajo 50% se recomienda denuncia ante el
                Juzgado de Policía Local (Art. 28 y 58).
              </div>

              <Button className="mt-5 w-full bg-primary hover:bg-primary/90" size="lg" onClick={descargarPdf}>
                <Download className="mr-2 h-4 w-4" /> Descargar informe PDF
              </Button>
              <Button variant="outline" className="mt-2 w-full" onClick={limpiar}>
                <Eraser className="mr-2 h-4 w-4" /> Limpiar formulario
              </Button>
              {hostOrigin ? (
                <div className="mt-4 border-t border-border pt-4">
                  <label className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                    <input
                      type="checkbox"
                      className="mt-0.5"
                      checked={confirmarEnvio}
                      onChange={(event) => setConfirmarEnvio(event.target.checked)}
                      disabled={envio.estado === "enviando" || envio.estado === "enviado"}
                    />
                    <span>
                      Confirmo que puedo enviar esta inspección para su almacenamiento
                      privado por el equipo responsable.
                    </span>
                  </label>
                  <Button
                    className="mt-3 w-full bg-primary hover:bg-primary/90"
                    size="lg"
                    onClick={enviarAlEquipo}
                    disabled={!confirmarEnvio || envio.estado === "enviando" || envio.estado === "enviado"}
                  >
                    {envio.estado === "enviando"
                      ? "Enviando…"
                      : envio.estado === "enviado"
                        ? "Inspección enviada"
                        : "Enviar al equipo"}
                  </Button>
                  <p className="mt-2 text-center text-xs leading-relaxed text-muted-foreground" role="status">
                    {envio.estado === "enviado"
                      ? `Registro recibido. Código de referencia: ${envio.codigo}`
                      : envio.estado === "error"
                        ? "No se pudo guardar. Revisa tu conexión e inténtalo nuevamente."
                        : "El envío guarda respuestas y fotos en archivos privados de Google Drive; el PDF se descarga por separado."}
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
                  {dentroDeMarco
                    ? "El portal seguro no está conectado. Abre la cartilla desde el enlace oficial."
                    : "Los datos se guardan solo en este navegador; no se envían a ningún servidor."}
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
