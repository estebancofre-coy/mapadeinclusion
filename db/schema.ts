import {
  mysqlTable,
  serial,
  varchar,
  text,
  timestamp,
  json,
} from "drizzle-orm/mysql-core";

/**
 * Respuestas de la cartilla de inspección de accesibilidad "Observa Aysén".
 * Instrumento público desarrollado por la carrera de Trabajo Social,
 * Universidad de Aysén.
 */
export const inspecciones = mysqlTable("inspecciones", {
  id: serial("id").primaryKey(),
  /** Identificador público para recuperar la inspección (código corto). */
  codigo: varchar("codigo", { length: 16 }).notNull().unique(),
  modo: varchar("modo", { length: 20 }).notNull().default("edificio"),
  /** Datos del lugar inspeccionado (lugar, dirección, comuna, etc.). */
  datos: json("datos"),
  /** Evaluaciones por ítem: { [itemId]: "cumple" | "nocumple" | "na" }. */
  evaluaciones: json("evaluaciones"),
  /** Notas por ítem: { [itemId]: string }. */
  notas: json("notas"),
  observaciones: text("observaciones"),
  /** Resumen calculado: { cumple, noCumple, na, aplicables, total, porcentaje, nivel }. */
  resumen: json("resumen"),
  /** Informe PDF generado, codificado en base64 (para descarga posterior). */
  pdfBase64: text("pdf_base64"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Inspeccion = typeof inspecciones.$inferSelect;
export type NuevaInspeccion = typeof inspecciones.$inferInsert;
