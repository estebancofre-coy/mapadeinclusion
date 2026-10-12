import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { ChecklistSection, InspectionState, ScoreResult } from "@/observa-chile/types/inspection";
import { NIVEL_LABEL } from "@/observa-chile/types/inspection";

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable?: { finalY: number };
  }
}

const NAVY: [number, number, number] = [28, 54, 90];
const GOLD: [number, number, number] = [176, 132, 42];
const INK: [number, number, number] = [24, 33, 48];
const MUTED: [number, number, number] = [96, 108, 124];

/** jsPDF standard fonts (WinAnsi) don't support ≥ ≤ × — normalize them. */
function san(text: string): string {
  return text
    .replace(/≥/g, ">=")
    .replace(/≤/g, "<=")
    .replace(/×/g, "x")
    .replace(/→/g, "->")
    .replace(/·/g, "-");
}

function estadoLabel(ev: string | undefined): string {
  if (ev === "cumple") return "Cumple";
  if (ev === "nocumple") return "No cumple";
  if (ev === "na") return "No aplica";
  return "Sin evaluar";
}

function tableFinalY(doc: jsPDF): number {
  const finalY = doc.lastAutoTable?.finalY;
  if (finalY === undefined) throw new Error("No se pudo calcular la posición de la tabla del informe.");
  return finalY;
}

export function generatePdf(
  state: InspectionState,
  sections: ChecklistSection[],
  score: ScoreResult
): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 16;
  let y = 0;

  const footer = () => {
    const count = doc.getNumberOfPages();
    for (let i = 1; i <= count; i++) {
      doc.setPage(i);
      doc.setFontSize(7.5);
      doc.setTextColor(...MUTED);
      doc.text(
        san(
          `Informe de Inspeccion de Accesibilidad Universal - Ley 20.422 / OGUC - Pagina ${i} de ${count}`
        ),
        pageW / 2,
        pageH - 8,
        { align: "center" }
      );
    }
  };

  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - 18) {
      doc.addPage();
      y = margin + 4;
    }
  };

  // ---------- Portada ----------
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, pageW, 54, "F");
  doc.setFillColor(...GOLD);
  doc.rect(0, 54, pageW, 2.5, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.text("Informe de Inspeccion de Accesibilidad Universal", pageW / 2, 24, { align: "center" });
  doc.setFontSize(10.5);
  doc.setFont("helvetica", "normal");
  doc.text(
    san(`Cumplimiento Ley N 20.422 y OGUC (Decretos 50/2015 y 30/2023) - ${state.modo === "edificio" ? "Edificio publico" : "Evento publico"}`),
    pageW / 2,
    33,
    { align: "center" }
  );
  doc.setFontSize(8.5);
  doc.text("Documento generado por estudiantes - Herramienta pedagogica universitaria", pageW / 2, 41, {
    align: "center",
  });
  y = 66;

  // ---------- Datos generales ----------
  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("1. Datos generales", margin, y);
  y += 4;

  const d = state.datos;
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: "grid",
    styles: { fontSize: 8.6, cellPadding: 2.2, textColor: INK },
    headStyles: { fillColor: NAVY, textColor: 255, fontSize: 8.6 },
    body: [
      ["Institucion educativa", san(d.institucion || "-")],
      ["Docente a cargo", san(d.docente || "-")],
      ["Estudiantes / integrantes", san(d.estudiantes || "-")],
      ["Fecha de inspeccion", san(`${d.fecha || "-"}   Inicio: ${d.horaInicio || "-"}   Termino: ${d.horaTermino || "-"}`)],
      ["Edificio / evento inspeccionado", san(d.lugar || "-")],
      ["Direccion", san(d.direccion || "-")],
      ["Comuna", san(d.comuna || "-")],
      ["Tipo de edificio / evento", san(d.tipoEdificio || "-")],
      ["Ano de construccion", san(d.anioConstruccion || "-")],
      ["Permiso de edificacion vigente", san(d.permisoEdificacion || "-")],
    ],
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 62 } },
  });
  y = tableFinalY(doc) + 10;

  // ---------- Resultado global ----------
  ensureSpace(34);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("2. Resultado global", margin, y);
  y += 5;

  const pctText = score.porcentaje === null ? "Sin items evaluados" : `${score.porcentaje}%`;
  const nivelText = score.nivel ? NIVEL_LABEL[score.nivel] : "Sin determinar";
  doc.setFillColor(245, 243, 238);
  doc.roundedRect(margin, y, pageW - margin * 2, 26, 2.5, 2.5, "F");
  doc.setFontSize(11);
  doc.setTextColor(...NAVY);
  doc.text(`Puntaje: ${score.cumple} / ${score.aplicables} items aplicables (${pctText})`, margin + 5, y + 9);
  doc.text(`Nivel: ${nivelText}`, margin + 5, y + 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.4);
  doc.setTextColor(...MUTED);
  doc.text(
    san(
      `Cumple: ${score.cumple}   |   No cumple: ${score.noCumple}   |   No aplica: ${score.na}   |   Total cartilla: ${score.total}`
    ),
    margin + 5,
    y + 22.5
  );
  y += 32;

  doc.setFontSize(8.4);
  doc.text(
    san("Escala: >= 80% alta accesibilidad  |  50-79% media accesibilidad  |  < 50% baja accesibilidad."),
    margin,
    y
  );
  y += 9;

  // ---------- Resultados por seccion ----------
  ensureSpace(20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...INK);
  doc.text("3. Resultados por dimension", margin, y);
  y += 5;

  for (const sec of sections) {
    const secScore = sec.items.reduce(
      (acc, it) => {
        const ev = state.evaluaciones[it.id];
        if (ev === "cumple") acc.c += 1;
        else if (ev === "nocumple") acc.n += 1;
        else if (ev === "na") acc.na += 1;
        return acc;
      },
      { c: 0, n: 0, na: 0 }
    );
    ensureSpace(16);
    doc.setFontSize(10);
    doc.setTextColor(...NAVY);
    doc.text(san(`${sec.titulo}   (${secScore.c} cumple / ${secScore.c + secScore.n} aplicables)`), margin, y);
    y += 3;
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      theme: "striped",
      styles: { fontSize: 8, cellPadding: 1.8, textColor: INK },
      headStyles: { fillColor: NAVY, textColor: 255, fontSize: 8 },
      alternateRowStyles: { fillColor: [247, 245, 240] },
      head: [["#", "Criterio", "Estado", "Observacion"]],
      body: sec.items.map((it, i) => [
        String(i + 1),
        san(it.texto),
        estadoLabel(state.evaluaciones[it.id]),
        san(state.notas[it.id] || ""),
      ]),
      columnStyles: {
        0: { cellWidth: 7 },
        1: { cellWidth: 84 },
        2: { cellWidth: 20 },
        3: { cellWidth: "auto" },
      },
      didParseCell: (data) => {
        if (data.section === "body" && data.column.index === 2) {
          const v = String(data.cell.raw);
          if (v === "Cumple") data.cell.styles.textColor = [22, 122, 62];
          else if (v === "No cumple") data.cell.styles.textColor = [183, 44, 44];
          else if (v === "No aplica") data.cell.styles.textColor = MUTED;
        }
      },
    });
    y = tableFinalY(doc) + 8;
  }

  // ---------- Observaciones ----------
  if (state.observaciones.trim()) {
    ensureSpace(24);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...INK);
    doc.text("4. Observaciones generales", margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const lines = doc.splitTextToSize(san(state.observaciones), pageW - margin * 2);
    for (const line of lines) {
      ensureSpace(6);
      doc.text(line, margin, y);
      y += 4.6;
    }
    y += 5;
  }

  // ---------- Entrevista ----------
  const e = state.entrevista;
  if (e.nombre.trim() || e.notas.trim()) {
    ensureSpace(24);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...INK);
    doc.text("5. Entrevista (registro opcional)", margin, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      theme: "grid",
      styles: { fontSize: 8.6, cellPadding: 2.2, textColor: INK },
      body: [
        ["Entrevistado/a", san(e.nombre || "-")],
        ["Rol", san(e.rol || "-")],
        ["Consentimiento informado", san(e.consentimiento || "-")],
        ["Notas", san(e.notas || "-")],
      ],
      columnStyles: { 0: { fontStyle: "bold", cellWidth: 62 } },
    });
    y = tableFinalY(doc) + 10;
  }

  // ---------- Evidencias ----------
  const evid = state.evidencias.filter((ev) => ev.descripcion.trim() || ev.ubicacion.trim() || ev.medicion.trim() || ev.foto);
  if (evid.length > 0) {
    ensureSpace(24);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...INK);
    doc.text("6. Registro fotografico y evidencia", margin, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      theme: "striped",
      styles: { fontSize: 8, cellPadding: 1.8, textColor: INK },
      headStyles: { fillColor: NAVY, textColor: 255 },
      head: [["N", "Descripcion", "Ubicacion / referencia", "Medicion"]],
      body: evid.map((ev) => [String(ev.id), san(ev.descripcion), san(ev.ubicacion), san(ev.medicion)]),
      columnStyles: { 0: { cellWidth: 8 } },
    });
    y = tableFinalY(doc) + 8;

    const fotos = evid.filter((ev) => ev.foto);
    if (fotos.length > 0) {
      ensureSpace(60);
      doc.setFontSize(9);
      doc.setTextColor(...MUTED);
      doc.text("Fotografias adjuntas:", margin, y);
      y += 4;
      const imgW = (pageW - margin * 2 - 8) / 3;
      const imgH = imgW * 0.68;
      let col = 0;
      for (const ev of fotos) {
        if (col === 0) ensureSpace(imgH + 10);
        const x = margin + col * (imgW + 4);
        try {
          doc.addImage(ev.foto!, "JPEG", x, y, imgW, imgH);
          doc.setFontSize(7.2);
          doc.setTextColor(...INK);
          const cap = doc.splitTextToSize(san(`F${ev.id}: ${ev.descripcion || "Sin descripcion"}`), imgW);
          doc.text(cap.slice(0, 2), x, y + imgH + 3.5);
        } catch {
          /* imagen no valida: se omite */
        }
        col += 1;
        if (col === 3) {
          col = 0;
          y += imgH + 12;
        }
      }
      if (col !== 0) y += imgH + 12;
    }
  }

  // ---------- Cierre ----------
  ensureSpace(30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...INK);
  doc.text("7. Vias de denuncia y reclamo", margin, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.6);
  const vias = [
    "Juzgado de Policia Local: denuncia por incumplimiento del Art. 28 Ley 20.422 (multa de 10 a 120 UTM).",
    "Direccion de Obras Municipal: requerimiento de fiscalizacion del cumplimiento de la OGUC.",
    "SENADIS: canal de orientacion y derivacion para personas con discapacidad.",
    "Ley de Transparencia (Ley 20.285): solicitar permisos de edificacion, planos y recepciones finales.",
    "Consejo para la Transparencia: reclamo si no se entrega la informacion solicitada.",
  ];
  for (const v of vias) {
    ensureSpace(6);
    const lines = doc.splitTextToSize(san(`-  ${v}`), pageW - margin * 2 - 4);
    doc.text(lines, margin + 2, y);
    y += lines.length * 4.4 + 1;
  }

  footer();

  const nombre = san(d.lugar || "inspeccion").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").toLowerCase();
  doc.save(`informe-accesibilidad-${nombre || "sin-nombre"}.pdf`);
}
