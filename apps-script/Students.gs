const STUDENT_SHEETS = {
  assignments: "Asignaciones Estudiantes",
  records: "Caracterizacion Bloque A",
};
const STUDENT_ASSIGNMENT_HEADERS = [
  "ID estudiante", "Estudiante", "ID organización", "Organización", "Comuna",
  "Tipo de asignación", "Búsqueda Info Secundaria", "Preparación Guion Entrevistas",
  "Contacto Preliminar", "Ejecución Entrevistas", "Documentación Encuentro",
  "Carga Info a Sitio", "Validación Info Orgs", "Observaciones / Bitácora",
];
const STUDENT_SESSION_SECONDS = 21600;
const STUDENT_PASSWORD_ITERATIONS = 8000;
const STUDENT_STAGES = [
  "Búsqueda de información secundaria", "Preparación del guion de entrevistas",
  "Contacto preliminar", "Ejecución de entrevistas", "Documentación del encuentro",
  "Carga del Bloque A", "Validación por el equipo docente",
];
const STUDENT_PROGRESS_VALUES = ["Pendiente", "En Proceso", "Completado", "No Aplica"];
const BLOCK_A_FIELDS = [
  { id: "A1", label: "Nombre completo de la organización", type: "text", required: true, max: 500 },
  { id: "A2", label: "Sigla o nombre corto, si lo tiene", type: "text", required: false, max: 120 },
  { id: "A3", label: "Año de fundación", type: "year", required: true },
  { id: "A4", label: "¿Cuenta con personería jurídica?", type: "select", required: true, options: ["Sí", "No", "En trámite"] },
  { id: "A4_tipo", label: "Tipo de personería jurídica", type: "select", required: true, when: ["A4", "Sí"], options: ["Organización comunitaria funcional", "Corporación", "Fundación", "Otra"] },
  { id: "A4_otra", label: "Otra personería jurídica: especificar", type: "text", required: true, max: 300, when: ["A4_tipo", "Otra"] },
  { id: "A5", label: "Según su origen y composición, la organización es:", type: "select", required: true, options: ["De personas con discapacidad (autogestión)", "De familiares o cuidadores", "Prestadora de servicios (profesionales/técnicos)", "Mixta", "Otra"] },
  { id: "A5_otra", label: "Otro origen y composición: especificar", type: "text", required: true, max: 300, when: ["A5", "Otra"] },
  { id: "A6", label: "Tipo(s) de discapacidad con las que trabaja", type: "multi", required: true, options: ["Visual", "Auditiva", "Física o motriz", "Intelectual o del desarrollo", "Psicosocial o de salud mental", "Múltiple", "Transversal (todas)"] },
  { id: "A7", label: "Campo(s) de acción principal", type: "multi", required: true, options: ["Rehabilitación", "Educación", "Empleo y formación laboral", "Deporte y recreación", "Cultura y arte", "Defensa y promoción de derechos", "Apoyo a familias y cuidadores", "Salud", "Otra"] },
  { id: "A7_otra", label: "Otro campo de acción: especificar", type: "text", required: true, max: 300, when: ["A7", "Otra"] },
  { id: "A8", label: "Ámbito territorial de acción", type: "select", required: true, options: ["Comunal", "Provincial", "Regional", "Interregional"] },
  { id: "A9", label: "Comuna(s) donde opera", type: "text", required: true, max: 500 },
  { id: "A10", label: "Carácter predominante del territorio que atiende", type: "select", required: true, options: ["Urbano", "Rural", "Mixto"] },
  { id: "A11", label: "Número de socios/as activos", type: "count", required: true },
  { id: "A12", label: "Número aproximado de personas usuarias o beneficiarias", type: "count", required: true },
  { id: "A13", label: "Presencia de personas con discapacidad en la directiva", type: "select", required: true, options: ["Mayoría", "Minoría", "Ninguna"] },
  { id: "A14", label: "La directiva es:", type: "select", required: true, options: ["Honoraria (sin remuneración)", "Parcialmente remunerada", "Remunerada"] },
  { id: "A15", label: "Frecuencia de reuniones ordinarias", type: "select", required: true, options: ["Semanal", "Quincenal", "Mensual", "Trimestral", "Irregular"] },
  { id: "A16", label: "Fuentes de financiamiento", type: "multi", required: true, options: ["Cuotas de socios/as", "Fondos públicos concursables", "Subvenciones municipales", "Donaciones privadas", "Actividades propias (rifas, ferias, servicios)", "Sin financiamiento actual"] },
  { id: "A17", label: "Espacio físico de funcionamiento", type: "select", required: true, options: ["Propio", "Cedido", "Arrendado", "Sin espacio fijo"] },
  { id: "A18", label: "El espacio físico de funcionamiento es accesible", type: "select", required: true, options: ["Sí", "Parcialmente", "No", "No aplica (sin espacio fijo)"] },
];
const STUDENT_RECORD_HEADERS = [
  "Solicitud", "Fecha", "ID estudiante", "Estudiante", "ID organización", "Versión",
  "Estado", "Avances previos (JSON)",
].concat(BLOCK_A_FIELDS.map(function (field) { return field.id + " · " + field.label; }));

function studentOwner_() {
  const email = Session.getActiveUser().getEmail();
  if (!email || email !== Session.getEffectiveUser().getEmail()) {
    throw new Error("Ejecuta esta función desde el editor con la cuenta propietaria.");
  }
}

function studentSpreadsheet_() {
  const id = PropertiesService.getScriptProperties().getProperty("INSPECTIONS_SPREADSHEET_ID");
  if (!id) throw new Error("Ejecuta primero initializeStorage.");
  return SpreadsheetApp.openById(id);
}

function studentSheet_(name, headers) {
  const sheet = studentSpreadsheet_().getSheetByName(name);
  if (!sheet) throw new Error("Falta preparar el portal de estudiantes.");
  const actual = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  if (JSON.stringify(actual) !== JSON.stringify(headers)) {
    throw new Error("Los encabezados de " + name + " cambiaron. No se modificaron los datos.");
  }
  return sheet;
}

function prepareStudentPortal() {
  studentOwner_();
  return studentLock_(function () {
    const spreadsheet = studentSpreadsheet_();
    [
      [STUDENT_SHEETS.assignments, STUDENT_ASSIGNMENT_HEADERS],
      [STUDENT_SHEETS.records, STUDENT_RECORD_HEADERS],
    ].forEach(function (entry) {
      let sheet = spreadsheet.getSheetByName(entry[0]);
      if (!sheet) sheet = spreadsheet.insertSheet(entry[0]);
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(entry[1]);
        sheet.setFrozenRows(1);
        sheet.getRange(1, 1, 1, entry[1].length).setFontWeight("bold").setWrap(true);
      }
      studentSheet_(entry[0], entry[1]);
    });
    return "Portal preparado sin borrar las inspecciones ni las asignaciones existentes.";
  });
}

function configureStudentAccess() {
  studentOwner_();
  const properties = PropertiesService.getScriptProperties();
  const initialPassword = properties.getProperty("STUDENTS_INITIAL_PASSWORD");
  if (!initialPassword || initialPassword.length < 8 || initialPassword.length > 128) {
    throw new Error("Define STUDENTS_INITIAL_PASSWORD en las propiedades del proyecto (8–128 caracteres).");
  }
  const salt = Utilities.getUuid().replace(/-/g, "") + Utilities.getUuid().replace(/-/g, "");
  const hash = studentPasswordHash_(initialPassword, salt);
  studentLock_(function () {
    properties.setProperties({
      STUDENTS_PASSWORD_SALT: salt,
      STUDENTS_PASSWORD_HASH: hash,
      STUDENTS_ACCESS_VERSION: Utilities.getUuid(),
    });
    properties.deleteProperty("STUDENTS_INITIAL_PASSWORD");
    properties.deleteProperty("STUDENTS_LOGIN_FAILURES");
  });
  return "Acceso Estudiantes configurado; se borró la clave inicial y se revocaron las sesiones anteriores.";
}

function importStudentWorkbook() {
  studentOwner_();
  const id = PropertiesService.getScriptProperties().getProperty("STUDENTS_WORKBOOK_ID");
  if (!id) throw new Error("Define STUDENTS_WORKBOOK_ID con el ID del Excel convertido a Google Sheets.");
  const workbook = SpreadsheetApp.openById(id);
  const summary = workbook.getSheetByName("Resumen por Estudiante");
  const advances = workbook.getSheetByName("Gestión de Avances");
  if (!summary || !advances) throw new Error("Faltan las pestañas Resumen por Estudiante o Gestión de Avances.");
  const summaryRows = summary.getDataRange().getValues();
  const advanceRows = advances.getDataRange().getValues();
  const sourceSummaryHeaders = ["N° Estudiante", "Estudiante Asignado", "N° Org", "Organización Social", "Comuna", "Tipo de Asignación"];
  const sourceAdvanceHeaders = ["N° Org", "Organización Social", "Comuna", "Estudiante Asignado", "1) Búsqueda Info Secundaria", "2) Preparación Guion Entrevistas", "3) Contacto Preliminar", "4) Ejecución Entrevistas", "5) Documentación Encuentro", "6) Carga Info a Sitio", "7) Validación Info Orgs", "% Avance General", "Observaciones / Bitácora"];
  if (JSON.stringify(summaryRows[0].slice(0, 6)) !== JSON.stringify(sourceSummaryHeaders) ||
      JSON.stringify(advanceRows[0].slice(0, 13)) !== JSON.stringify(sourceAdvanceHeaders)) {
    throw new Error("El libro no tiene las columnas esperadas. No se importó información.");
  }
  const advanceById = {};
  advanceRows.slice(1).filter(function (row) { return row[0] !== ""; }).forEach(function (row) {
    const orgId = studentSourceId_(row[0]);
    if (advanceById[orgId]) throw new Error("Una organización está duplicada en Gestión de Avances.");
    advanceById[orgId] = row;
  });
  const seen = {};
  const names = {};
  const rows = summaryRows.slice(1).filter(function (row) { return row[0] !== ""; }).map(function (row) {
    const studentId = studentSourceId_(row[0]);
    const orgId = studentSourceId_(row[2]);
    const name = studentText_(row[1], 150, true);
    const advance = advanceById[orgId];
    if (seen[orgId] || !advance || studentText_(advance[3], 150, true) !== name ||
        studentText_(advance[1], 500, true) !== studentText_(row[3], 500, true)) {
      throw new Error("Hay asignaciones duplicadas o diferencias entre las pestañas del libro.");
    }
    if (names[studentId] && names[studentId] !== name) throw new Error("Un ID estudiante tiene nombres distintos.");
    names[studentId] = name;
    seen[orgId] = true;
    const stages = advance.slice(4, 11).map(function (value) {
      if (!STUDENT_PROGRESS_VALUES.includes(value)) throw new Error("Una etapa tiene un estado no reconocido.");
      return value;
    });
    return [studentId, name, orgId, studentText_(row[3], 500, true),
      studentText_(row[4], 120, true), studentText_(row[5], 150, true)]
      .concat(stages, [studentText_(advance[12] || "", 4000, false)]);
  });
  if (!rows.length || Object.keys(advanceById).length !== rows.length) {
    throw new Error("Las pestañas no contienen el mismo conjunto de organizaciones.");
  }
  return studentLock_(function () {
    const sheet = studentSheet_(STUDENT_SHEETS.assignments, STUDENT_ASSIGNMENT_HEADERS);
    if (sheet.getLastRow() > 1) {
      throw new Error("Las asignaciones ya tienen datos. No se sobrescribieron avances ni responsables.");
    }
    sheet.getRange(2, 1, rows.length, STUDENT_ASSIGNMENT_HEADERS.length)
      .setValues(rows.map(function (row) { return row.map(studentCell_); }));
    return "Importados " + Object.keys(names).length + " estudiantes y " + rows.length + " organizaciones.";
  });
}

function studentSourceId_(value) {
  const id = String(value).trim();
  if (!/^[1-9]\d{0,7}$/.test(id)) throw new Error("Un identificador del libro no es válido.");
  return id;
}

function studentLogin(username, password) {
  if (typeof username !== "string" || typeof password !== "string" || password.length > 128) {
    throw new Error("Usuario o contraseña incorrectos.");
  }
  return studentLock_(function () {
    const properties = PropertiesService.getScriptProperties();
    const salt = properties.getProperty("STUDENTS_PASSWORD_SALT");
    const hash = properties.getProperty("STUDENTS_PASSWORD_HASH");
    const version = properties.getProperty("STUDENTS_ACCESS_VERSION");
    if (!salt || !hash || !version) throw new Error("El equipo docente aún debe configurar el acceso.");
    const failure = JSON.parse(properties.getProperty("STUDENTS_LOGIN_FAILURES") || '{"count":0,"until":0}');
    if (failure.until > Date.now()) throw new Error("Demasiados intentos. Espera 15 minutos antes de ingresar.");
    if (failure.until) failure.count = 0;
    if (username.trim() !== "Estudiantes" || !studentEquals_(studentPasswordHash_(password, salt), hash)) {
      failure.count += 1;
      failure.until = failure.count >= 5 ? Date.now() + 15 * 60 * 1000 : 0;
      properties.setProperty("STUDENTS_LOGIN_FAILURES", JSON.stringify(failure));
      throw new Error("Usuario o contraseña incorrectos.");
    }
    properties.deleteProperty("STUDENTS_LOGIN_FAILURES");
    const token = Utilities.getUuid() + Utilities.getUuid();
    CacheService.getScriptCache().put("student:" + studentHash_(token), JSON.stringify({
      version: version, expires: Date.now() + STUDENT_SESSION_SECONDS * 1000,
    }), STUDENT_SESSION_SECONDS);
    return { token: token, expiresAt: Date.now() + STUDENT_SESSION_SECONDS * 1000 };
  });
}

function studentLogout(token) {
  if (typeof token !== "string" || !/^[a-f0-9-]{72}$/i.test(token)) {
    throw new Error("La sesión no tiene un formato válido.");
  }
  CacheService.getScriptCache().remove("student:" + studentHash_(token));
  return { ok: true };
}

function studentSession_(token) {
  if (typeof token !== "string" || !/^[a-f0-9-]{72}$/i.test(token)) {
    throw new Error("La sesión expiró. Ingresa nuevamente.");
  }
  const value = CacheService.getScriptCache().get("student:" + studentHash_(token));
  if (!value) throw new Error("La sesión expiró. Ingresa nuevamente.");
  const session = JSON.parse(value);
  const version = PropertiesService.getScriptProperties().getProperty("STUDENTS_ACCESS_VERSION");
  if (session.expires <= Date.now() || session.version !== version) {
    throw new Error("La sesión expiró. Ingresa nuevamente.");
  }
  return session;
}

function studentRoster(token) {
  studentSession_(token);
  const students = {};
  studentAssignments_().forEach(function (item) { students[item.studentId] = item.studentName; });
  return {
    students: Object.keys(students).map(function (id) { return { id: id, name: students[id] }; }),
    fields: BLOCK_A_FIELDS,
    stages: STUDENT_STAGES,
    progressValues: STUDENT_PROGRESS_VALUES,
  };
}

function studentPortfolio(token, studentId) {
  studentSession_(token);
  const id = studentSourceId_(studentId);
  const records = studentRows_(studentSheet_(STUDENT_SHEETS.records, STUDENT_RECORD_HEADERS));
  return studentAssignments_().filter(function (item) { return item.studentId === id; }).map(function (item) {
    const latest = studentLatestRecord_(records, item.orgId);
    if (latest && String(latest[2]) !== id) {
      throw new Error("La asignación cambió. El equipo docente debe revisar el registro anterior.");
    }
    return {
      orgId: item.orgId, name: item.orgName, commune: item.commune, assignmentType: item.type,
      progress: item.progress, version: latest ? Number(latest[5]) : 0,
      status: latest ? String(latest[6]) : "Sin carga",
      answers: latest ? studentRecordAnswers_(latest) : { A1: item.orgName, A9: item.commune },
    };
  });
}

function studentSave(token, input) {
  studentSession_(token);
  if (!input || typeof input !== "object" || JSON.stringify(input).length > 25000 ||
      !/^[a-f0-9-]{36}$/i.test(input.requestId || "") ||
      !Number.isInteger(input.version) || input.version < 0 ||
      !["Borrador", "En revisión"].includes(input.status)) {
    throw new Error("El envío no tiene un formato válido.");
  }
  const studentId = studentSourceId_(input.studentId);
  const orgId = studentSourceId_(input.orgId);
  if (input.status === "En revisión" && input.confirmed !== true) {
    throw new Error("Confirma que puedes enviar el Bloque A al archivo privado del curso.");
  }
  const answers = studentValidateAnswers_(input.answers, input.status === "En revisión");
  if (!Array.isArray(input.progress) || input.progress.length !== 5 ||
      input.progress.some(function (value) { return !STUDENT_PROGRESS_VALUES.includes(value); })) {
    throw new Error("Las etapas de avance no son válidas.");
  }
  return studentLock_(function () {
    studentSession_(token);
    const assignment = studentAssignments_().find(function (item) {
      return item.studentId === studentId && item.orgId === orgId;
    });
    if (!assignment) throw new Error("La organización no está asignada al estudiante seleccionado.");
    if (assignment.progress[6] === "Completado") {
      throw new Error("La ficha está validada. Solicita al equipo docente que la reabra antes de modificarla.");
    }
    const sheet = studentSheet_(STUDENT_SHEETS.records, STUDENT_RECORD_HEADERS);
    const rows = studentRows_(sheet);
    const duplicate = rows.find(function (row) { return row[0] === input.requestId; });
    if (duplicate) {
      if (String(duplicate[2]) !== studentId || String(duplicate[4]) !== orgId ||
          duplicate[6] !== input.status ||
          duplicate[7] !== JSON.stringify(input.progress) ||
          JSON.stringify(studentRecordAnswers_(duplicate)) !== JSON.stringify(answers)) {
        throw new Error("La solicitud ya se usó para un envío diferente.");
      }
      const current = studentLatestRecord_(rows, orgId);
      if (Number(current[5]) > Number(duplicate[5])) {
        throw new Error("Este envío ya fue recibido y existe una versión posterior. Recarga las organizaciones.");
      }
      studentSyncProgress_(assignment, duplicate);
      return { version: Number(duplicate[5]), status: String(duplicate[6]) };
    }
    const latest = studentLatestRecord_(rows, orgId);
    if (latest && String(latest[2]) !== studentId) throw new Error("La asignación cambió; contacta al equipo docente.");
    const version = latest ? Number(latest[5]) : 0;
    if (version !== input.version) {
      throw new Error("Otra sesión actualizó esta ficha. Recarga las organizaciones antes de continuar.");
    }
    const row = [
      input.requestId, new Date(), studentId, assignment.studentName, orgId, version + 1,
      input.status, JSON.stringify(input.progress),
    ].concat(BLOCK_A_FIELDS.map(function (field) { return JSON.stringify(answers[field.id]); }));
    sheet.appendRow(row.map(studentCell_));
    SpreadsheetApp.flush();
    studentSyncProgress_(assignment, row);
    return { version: version + 1, status: input.status };
  });
}

function studentSyncProgress_(assignment, record) {
  const progress = JSON.parse(record[7]).concat([
    record[6] === "En revisión" ? "Completado" : "En Proceso",
  ]);
  studentSheet_(STUDENT_SHEETS.assignments, STUDENT_ASSIGNMENT_HEADERS)
    .getRange(assignment.row, 7, 1, 6).setValues([progress]);
}

function studentValidateAnswers_(value, submit) {
  if (!value || typeof value !== "object" || Array.isArray(value) ||
      Object.keys(value).some(function (id) { return !BLOCK_A_FIELDS.some(function (field) { return field.id === id; }); })) {
    throw new Error("La ficha contiene campos que no pertenecen al Bloque A.");
  }
  const answers = {};
  BLOCK_A_FIELDS.forEach(function (field) {
    if (!studentFieldActive_(field, answers)) {
      answers[field.id] = field.type === "multi" ? [] : "";
      return;
    }
    const raw = value[field.id];
    if (raw === null && field.id !== "A1") {
      answers[field.id] = null;
      return;
    }
    const empty = raw === undefined || raw === "" || (Array.isArray(raw) && !raw.length);
    if (empty) {
      if (submit && field.required) throw new Error("Completa " + field.id + " o marca «No informado».");
      answers[field.id] = field.type === "multi" ? [] : "";
    } else if (field.type === "multi") {
      if (!Array.isArray(raw) || raw.length > field.options.length ||
          new Set(raw).size !== raw.length || raw.some(function (option) { return !field.options.includes(option); })) {
        throw new Error("Las opciones de " + field.id + " no son válidas.");
      }
      answers[field.id] = field.options.filter(function (option) { return raw.includes(option); });
    } else if (field.type === "select") {
      if (!field.options.includes(raw)) throw new Error("Selecciona una opción válida en " + field.id + ".");
      answers[field.id] = raw;
    } else if (field.type === "year" || field.type === "count") {
      if (typeof raw !== "number" || !Number.isSafeInteger(raw) ||
          raw < (field.type === "year" ? 1800 : 0) ||
          raw > (field.type === "year" ? new Date().getFullYear() : 10000000)) {
        throw new Error("El número indicado en " + field.id + " no es válido.");
      }
      answers[field.id] = raw;
    } else {
      answers[field.id] = studentText_(raw, field.max, submit && field.required);
    }
  });
  if (answers.A16 && answers.A16.includes("Sin financiamiento actual") && answers.A16.length > 1) {
    throw new Error("«Sin financiamiento actual» no se puede combinar con fuentes de financiamiento.");
  }
  if (answers.A17 === "Sin espacio fijo" && answers.A18 && answers.A18 !== "No aplica (sin espacio fijo)") {
    throw new Error("A18 debe ser «No aplica» cuando no existe un espacio fijo.");
  }
  if (answers.A17 && answers.A17 !== "Sin espacio fijo" && answers.A18 === "No aplica (sin espacio fijo)") {
    throw new Error("Revisa A17 y A18: se indicó un espacio fijo y accesibilidad no aplicable.");
  }
  return answers;
}

function studentFieldActive_(field, answers) {
  if (!field.when) return true;
  const value = answers[field.when[0]];
  return Array.isArray(value) ? value.includes(field.when[1]) : value === field.when[1];
}

function studentAssignments_() {
  return studentRows_(studentSheet_(STUDENT_SHEETS.assignments, STUDENT_ASSIGNMENT_HEADERS))
    .map(function (row, index) {
      return {
        row: index + 2, studentId: String(row[0]), studentName: String(row[1]),
        orgId: String(row[2]), orgName: String(row[3]), commune: String(row[4]),
        type: String(row[5]), progress: row.slice(6, 13).map(String),
      };
    });
}

function studentRows_(sheet) {
  return sheet.getLastRow() < 2 ? [] : sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
}

function studentLatestRecord_(rows, orgId) {
  for (let index = rows.length - 1; index >= 0; index -= 1) {
    if (String(rows[index][4]) === orgId) return rows[index];
  }
  return null;
}

function studentRecordAnswers_(row) {
  const answers = {};
  BLOCK_A_FIELDS.forEach(function (field, index) { answers[field.id] = JSON.parse(row[index + 8]); });
  return answers;
}

function studentText_(value, max, required) {
  if (typeof value !== "string" || value.length > max || (required && !value.trim())) {
    throw new Error("Un texto requerido está vacío o supera el tamaño permitido.");
  }
  return value.trim();
}

function studentCell_(value) {
  return typeof value === "string" && /^[=+\-@\t\r]/.test(value) ? "'" + value : value;
}

function studentLock_(callback) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) throw new Error("El portal está ocupado. Intenta nuevamente en unos segundos.");
  try { return callback(); } finally { lock.releaseLock(); }
}

function studentHash_(value) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value, Utilities.Charset.UTF_8)
    .map(function (byte) { return ("0" + ((byte + 256) % 256).toString(16)).slice(-2); }).join("");
}

function studentPasswordHash_(password, salt) {
  const bytes = salt.match(/.{2}/g).map(function (pair) { return parseInt(pair, 16); })
    .concat([0, 0, 0, 1]).map(function (byte) { return byte > 127 ? byte - 256 : byte; });
  const key = Utilities.newBlob(password).getBytes();
  let u = Utilities.computeHmacSha256Signature(bytes, key);
  const result = u.map(function (byte) { return (byte + 256) % 256; });
  for (let iteration = 1; iteration < STUDENT_PASSWORD_ITERATIONS; iteration += 1) {
    u = Utilities.computeHmacSha256Signature(u, key);
    result.forEach(function (_, index) { result[index] ^= (u[index] + 256) % 256; });
  }
  return result.map(function (byte) { return ("0" + byte.toString(16)).slice(-2); }).join("");
}

function studentEquals_(left, right) {
  let mismatch = left.length ^ right.length;
  for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
    mismatch |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }
  return mismatch === 0;
}
