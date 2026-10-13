const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");

const script = fs.readFileSync(path.join(__dirname, "..", "Students.gs"), "utf8");
const byteArray = (buffer) => [...buffer].map((byte) => byte > 127 ? byte - 256 : byte);
const asBuffer = (bytes) => Buffer.from(bytes.map((byte) => (byte + 256) % 256));
const clone = (value) => JSON.parse(JSON.stringify(value));

class Sheet {
  constructor(rows = []) { this.rows = rows; }
  getLastRow() { return this.rows.length; }
  getLastColumn() { return this.rows.reduce((max, row) => Math.max(max, row.length), 0); }
  appendRow(row) { this.rows.push([...row]); }
  getDataRange() { return { getValues: () => this.rows }; }
  getRange(row, col, height, width) {
    return {
      getValues: () => Array.from({ length: height }, (_, i) =>
        Array.from({ length: width }, (_, j) => this.rows[row - 1 + i]?.[col - 1 + j] ?? "")),
      setValues: (values) => {
        values.forEach((valuesRow, i) => {
          this.rows[row - 1 + i] ||= [];
          valuesRow.forEach((value, j) => { this.rows[row - 1 + i][col - 1 + j] = value; });
        });
      },
      setFontWeight: () => ({ setWrap() {} }),
    };
  }
  setFrozenRows() {}
}

function harness() {
  const properties = new Map([["INSPECTIONS_SPREADSHEET_ID", "storage"]]);
  const cache = new Map();
  const sheets = new Map();
  const workbookSheets = new Map();
  const context = vm.createContext({
    console, Date, Set,
    Session: { getActiveUser: () => ({ getEmail: () => "owner@example.test" }),
      getEffectiveUser: () => ({ getEmail: () => "owner@example.test" }) },
    PropertiesService: { getScriptProperties: () => ({
      getProperty: (key) => properties.get(key) || null,
      setProperty: (key, value) => properties.set(key, value),
      deleteProperty: (key) => properties.delete(key),
      setProperties: (values) => Object.entries(values).forEach(([key, value]) => properties.set(key, value)),
    }) },
    CacheService: { getScriptCache: () => ({
      get: (key) => cache.get(key) || null, put: (key, value) => cache.set(key, value),
      remove: (key) => cache.delete(key),
    }) },
    LockService: { getScriptLock: () => ({ tryLock: () => true, releaseLock() {} }) },
    SpreadsheetApp: {
      openById: (id) => ({
        getSheetByName: (name) => (id === "source" ? workbookSheets : sheets).get(name) || null,
        insertSheet: (name) => { const sheet = new Sheet(); sheets.set(name, sheet); return sheet; },
      }),
      flush() {},
    },
    Utilities: {
      getUuid: () => crypto.randomUUID(), DigestAlgorithm: { SHA_256: "sha256" }, Charset: { UTF_8: "utf8" },
      computeDigest: (_, value) => byteArray(crypto.createHash("sha256").update(value).digest()),
      computeHmacSha256Signature: (bytes, key) => byteArray(crypto.createHmac("sha256", asBuffer(key)).update(asBuffer(bytes)).digest()),
      newBlob: (value) => ({ getBytes: () => byteArray(Buffer.from(value, "utf8")) }),
    },
  });
  vm.runInContext(script, context);
  context.prepareStudentPortal();
  const config = vm.runInContext("({fields: BLOCK_A_FIELDS, assignmentHeaders: STUDENT_ASSIGNMENT_HEADERS, iterations: STUDENT_PASSWORD_ITERATIONS})", context);
  const assignments = sheets.get("Asignaciones Estudiantes");
  assignments.appendRow(["1", "Estudiante de prueba", "10", "Organización de prueba", "Coyhaique", "Asignación directa",
    "Completado", "Completado", "En Proceso", "Pendiente", "Pendiente", "Pendiente", "Pendiente", ""]);
  assignments.appendRow(["2", "Otra estudiante", "20", "Otra organización", "Cochrane", "Asignación aleatoria",
    ...Array(7).fill("Pendiente"), ""]);
  properties.set("STUDENTS_INITIAL_PASSWORD", "Clave+SoloPruebas2026");
  context.configureStudentAccess();
  const login = context.studentLogin("Estudiantes", "Clave+SoloPruebas2026");
  const answers = Object.fromEntries(config.fields.map((field) => [field.id, field.options ? (field.type === "multi" ? [field.options[0]] : field.options[0]) : (field.type === "year" ? 2000 : field.type === "count" ? 0 : "Dato")]));
  answers.A4_otra = ""; answers.A5_otra = ""; answers.A7_otra = "";
  const input = () => ({
    requestId: crypto.randomUUID(), studentId: "1", orgId: "10", version: 0,
    status: "En revisión", confirmed: true, progress: Array(5).fill("Completado"), answers: clone(answers),
  });
  return { context, config, properties, cache, sheets, workbookSheets, assignments, token: login.token, input };
}

test("password KDF matches PBKDF2 and setup consumes plaintext property", () => {
  const h = harness();
  const salt = h.properties.get("STUDENTS_PASSWORD_SALT");
  const expected = crypto.pbkdf2Sync("Clave+SoloPruebas2026", Buffer.from(salt, "hex"), h.config.iterations, 32, "sha256").toString("hex");
  assert.equal(h.properties.get("STUDENTS_PASSWORD_HASH"), expected);
  assert.equal(h.properties.has("STUDENTS_INITIAL_PASSWORD"), false);
  assert.equal([...h.cache.keys()].some((key) => key.includes(h.token)), false);
});

test("every roster and data operation requires an unexpired, revocable session", () => {
  const h = harness();
  assert.throws(() => h.context.studentRoster(""));
  assert.throws(() => h.context.studentPortfolio("bad", "1"));
  assert.throws(() => h.context.studentSave("", h.input()));
  assert.equal(h.context.studentRoster(h.token).students.length, 2);
  assert.equal(h.context.studentPortfolio(h.token, "1").length, 1);
  h.properties.set("STUDENTS_ACCESS_VERSION", "rotated");
  assert.throws(() => h.context.studentRoster(h.token));
});

test("shared login lockout blocks even correct credentials, logout revokes token", () => {
  const h = harness();
  for (let i = 0; i < 5; i++) assert.throws(() => h.context.studentLogin("Estudiantes", "incorrect"));
  assert.throws(() => h.context.studentLogin("Estudiantes", "Clave+SoloPruebas2026"), /15 minutos/);
  h.properties.delete("STUDENTS_LOGIN_FAILURES");
  const session = h.context.studentLogin("Estudiantes", "Clave+SoloPruebas2026");
  h.context.studentLogout(session.token);
  assert.throws(() => h.context.studentRoster(session.token));
  h.context.studentLogout(session.token);
});

test("submit writes all A fields, updates loading but never grants validation", () => {
  const h = harness();
  const result = h.context.studentSave(h.token, h.input());
  assert.equal(result.version, 1);
  const sheet = h.sheets.get("Caracterizacion Bloque A");
  assert.equal(sheet.rows[1].length, 8 + h.config.fields.length);
  assert.equal(h.assignments.rows[1][11], "Completado");
  assert.equal(h.assignments.rows[1][12], "Pendiente");
  const portfolio = h.context.studentPortfolio(h.token, "1");
  assert.equal(portfolio[0].answers.A11, 0);
  assert.equal(portfolio[0].status, "En revisión");
  assert.equal(portfolio[0].answers.A4_otra, "");
});

test("draft allows blanks; unknown is distinct from zero; qualitative fields rejected", () => {
  const h = harness();
  const draft = h.input(); draft.status = "Borrador"; draft.answers = { A1: "Organización" };
  h.context.studentSave(h.token, draft);
  assert.equal(h.assignments.rows[1][11], "En Proceso");
  const submit = h.input(); submit.version = 1; submit.answers.A11 = null;
  h.context.studentSave(h.token, submit);
  assert.equal(h.context.studentPortfolio(h.token, "1")[0].answers.A11, null);
  const bad = h.input(); bad.version = 2; bad.answers.B1 = "Entrevista";
  assert.throws(() => h.context.studentSave(h.token, bad), /Bloque A/);
});

test("validation rejects invented options, missing required data, counts and inconsistent answers", () => {
  const h = harness();
  for (const change of [
    (input) => { input.answers.A1 = ""; },
    (input) => { input.answers.A5 = "Inventada"; },
    (input) => { input.answers.A11 = -1; },
    (input) => { input.answers.A3 = 4000; },
    (input) => { input.answers.A16.push("Sin financiamiento actual"); },
    (input) => { input.answers.A17 = "Sin espacio fijo"; },
    (input) => { input.answers.A4_tipo = "Otra"; input.answers.A4_otra = ""; },
    (input) => { input.answers.A6 = ["Visual", "Visual"]; },
    (input) => { input.confirmed = false; },
  ]) {
    const input = h.input(); change(input);
    assert.throws(() => h.context.studentSave(h.token, input));
  }
  const valid = h.input(); valid.answers.A17 = "Sin espacio fijo"; valid.answers.A18 = "No aplica (sin espacio fijo)";
  h.context.studentSave(h.token, valid);
});

test("assignments checked server-side; revisions, validation and retry cannot overwrite another edit", () => {
  const h = harness();
  const wrong = h.input(); wrong.orgId = "20";
  assert.throws(() => h.context.studentSave(h.token, wrong), /asignada/);
  const first = h.input();
  h.context.studentSave(h.token, first);
  h.context.studentSave(h.token, first);
  assert.equal(h.sheets.get("Caracterizacion Bloque A").rows.length, 2);
  const second = h.input();
  assert.throws(() => h.context.studentSave(h.token, second), /Otra sesión/);
  second.version = 1; h.context.studentSave(h.token, second);
  assert.throws(() => h.context.studentSave(h.token, first), /versión posterior/);
  assert.equal(h.sheets.get("Caracterizacion Bloque A").rows.length, 3);
  h.assignments.rows[1][12] = "Completado";
  const third = h.input(); third.version = 2;
  assert.throws(() => h.context.studentSave(h.token, third), /validada/);
});

test("prepare preserves existing rows and detects altered headers", () => {
  const h = harness();
  h.context.prepareStudentPortal();
  assert.equal(h.assignments.rows.length, 3);
  h.assignments.rows[0][0] = "changed";
  assert.throws(() => h.context.prepareStudentPortal(), /encabezados/);
});

test("workbook import maps progress without overwriting existing data", () => {
  const h = harness();
  h.assignments.rows.splice(1);
  h.properties.set("STUDENTS_WORKBOOK_ID", "source");
  h.workbookSheets.set("Resumen por Estudiante", new Sheet([
    ["N° Estudiante", "Estudiante Asignado", "N° Org", "Organización Social", "Comuna", "Tipo de Asignación"],
    [1, "Estudiante de prueba", 10, "Organización de prueba", "Coyhaique", "Directa"],
  ]));
  h.workbookSheets.set("Gestión de Avances", new Sheet([
    ["N° Org", "Organización Social", "Comuna", "Estudiante Asignado", "1) Búsqueda Info Secundaria", "2) Preparación Guion Entrevistas", "3) Contacto Preliminar", "4) Ejecución Entrevistas", "5) Documentación Encuentro", "6) Carga Info a Sitio", "7) Validación Info Orgs", "% Avance General", "Observaciones / Bitácora"],
    [10, "Organización de prueba", "Coyhaique", "Estudiante de prueba", "Completado", "Completado", "En Proceso", "Pendiente", "Pendiente", "Pendiente", "Pendiente", 2 / 7, "=private"],
  ]));
  assert.match(h.context.importStudentWorkbook(), /1 estudiantes y 1 organizaciones/);
  assert.equal(h.assignments.rows[1][8], "En Proceso");
  assert.equal(h.assignments.rows[1][13], "'=private");
  assert.throws(() => h.context.importStudentWorkbook(), /sobrescribieron/);
});

test("write failures preserve request for idempotent recovery without duplicate records", () => {
  const h = harness();
  const input = h.input();
  const setRange = h.assignments.getRange.bind(h.assignments);
  h.assignments.getRange = (row, col, ...rest) => {
    const range = setRange(row, col, ...rest);
    if (row > 1 && col === 7) range.setValues = () => { throw new Error("Simulated Sheets failure"); };
    return range;
  };
  assert.throws(() => h.context.studentSave(h.token, input), /Simulated/);
  h.assignments.getRange = setRange;
  h.context.studentSave(h.token, input);
  assert.equal(h.sheets.get("Caracterizacion Bloque A").rows.length, 2);
  assert.equal(h.assignments.rows[1][11], "Completado");
});

test("supplied workbook imports 12 students and 35 assignments with original progress", {
  skip: !process.env.STUDENT_WORKBOOK_TEST_DATA,
}, () => {
  const source = JSON.parse(fs.readFileSync(process.env.STUDENT_WORKBOOK_TEST_DATA, "utf8"));
  const h = harness();
  h.assignments.rows.splice(1);
  h.properties.set("STUDENTS_WORKBOOK_ID", "source");
  for (const item of source) {
    h.workbookSheets.set(item.name, new Sheet(item.rows));
  }
  assert.match(h.context.importStudentWorkbook(), /12 estudiantes y 35 organizaciones/);
  assert.equal(h.context.studentRoster(h.token).students.length, 12);
  assert.equal(h.assignments.rows.length, 36);
  const progress = h.workbookSheets.get("Gestión de Avances").rows;
  for (const assignment of h.assignments.rows.slice(1)) {
    const original = progress.find((row) => String(row[0]) === String(assignment[2]));
    assert.deepEqual(assignment.slice(6, 13), original.slice(4, 11));
  }
});
