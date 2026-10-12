import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { inspecciones } from "@db/schema";
import { eq, desc } from "drizzle-orm";

const resumenSchema = z.object({
  cumple: z.number(),
  noCumple: z.number(),
  na: z.number(),
  aplicables: z.number(),
  total: z.number(),
  porcentaje: z.number().nullable(),
  nivel: z.string().nullable(),
});

function generarCodigo(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let c = "";
  for (let i = 0; i < 8; i++) c += chars[Math.floor(Math.random() * chars.length)];
  return c;
}

export const inspeccionesRouter = createRouter({
  /** Guarda una inspección completa con su PDF (base64). Devuelve el código público. */
  guardar: publicQuery
    .input(
      z.object({
        modo: z.string().max(20).default("edificio"),
        datos: z.record(z.string(), z.unknown()).optional(),
        evaluaciones: z.record(z.string(), z.string()).optional(),
        notas: z.record(z.string(), z.string()).optional(),
        observaciones: z.string().max(20000).optional(),
        resumen: resumenSchema.optional(),
        pdfBase64: z.string().max(12_000_000).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const codigo = generarCodigo();
      await getDb().insert(inspecciones).values({
        codigo,
        modo: input.modo,
        datos: input.datos ?? null,
        evaluaciones: input.evaluaciones ?? null,
        notas: input.notas ?? null,
        observaciones: input.observaciones ?? null,
        resumen: input.resumen ?? null,
        pdfBase64: input.pdfBase64 ?? null,
      });
      return { codigo };
    }),

  /** Recupera una inspección por su código público (sin el PDF). */
  obtener: publicQuery
    .input(z.object({ codigo: z.string().min(4).max(16) }))
    .query(async ({ input }) => {
      const rows = await getDb()
        .select()
        .from(inspecciones)
        .where(eq(inspecciones.codigo, input.codigo.toUpperCase()))
        .limit(1);
      const r = rows[0];
      if (!r) return null;
      const { pdfBase64: _omit, ...resto } = r;
      return { ...resto, tienePdf: Boolean(r.pdfBase64) };
    }),

  /** Descarga el PDF (base64) de una inspección por código. */
  descargarPdf: publicQuery
    .input(z.object({ codigo: z.string().min(4).max(16) }))
    .query(async ({ input }) => {
      const rows = await getDb()
        .select({ pdfBase64: inspecciones.pdfBase64, datos: inspecciones.datos })
        .from(inspecciones)
        .where(eq(inspecciones.codigo, input.codigo.toUpperCase()))
        .limit(1);
      return rows[0] ?? null;
    }),

  /** Listado resumido para el panel (sin PDFs). */
  listar: publicQuery
    .input(z.object({ limite: z.number().min(1).max(500).default(100) }).optional())
    .query(async ({ input }) => {
      const rows = await getDb()
        .select({
          id: inspecciones.id,
          codigo: inspecciones.codigo,
          modo: inspecciones.modo,
          datos: inspecciones.datos,
          resumen: inspecciones.resumen,
          createdAt: inspecciones.createdAt,
        })
        .from(inspecciones)
        .orderBy(desc(inspecciones.createdAt))
        .limit(input?.limite ?? 100);
      return rows;
    }),

  /** Estadísticas agregadas para el panel público. */
  estadisticas: publicQuery.query(async () => {
    const rows = await getDb()
      .select({ resumen: inspecciones.resumen, modo: inspecciones.modo, datos: inspecciones.datos })
      .from(inspecciones);
    const conPct = rows.filter((r) => (r.resumen as { porcentaje: number | null } | null)?.porcentaje != null);
    const promedio = conPct.length
      ? Math.round(
          conPct.reduce((a, r) => a + ((r.resumen as { porcentaje: number }).porcentaje ?? 0), 0) / conPct.length
        )
      : null;
    const comunas = new Set<string>();
    for (const r of rows) {
      const c = (r.datos as { comuna?: string } | null)?.comuna;
      if (c) comunas.add(c);
    }
    return {
      total: rows.length,
      promedioAccesibilidad: promedio,
      comunas: [...comunas].sort(),
      edificios: rows.filter((r) => r.modo === "edificio").length,
      espaciosPublicos: rows.filter((r) => r.modo !== "edificio").length,
    };
  }),
});
