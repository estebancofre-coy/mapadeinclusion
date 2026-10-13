const STORAGE_PROPERTY_KEYS = {
  spreadsheetId: "INSPECTIONS_SPREADSHEET_ID",
  folderId: "INSPECTIONS_DRIVE_FOLDER_ID",
};

const MAX_PAYLOAD_CHARS = 3000000;
const MAX_PHOTO_DATA_URL_CHARS = 900000;

const BUILDING_ITEM_IDS = [
  "ed-1-1", "ed-1-2", "ed-1-3", "ed-1-4", "ed-1-5",
  "ed-2-1", "ed-2-2", "ed-2-3", "ed-2-4", "ed-2-5",
  "ed-3-1", "ed-3-2", "ed-3-3", "ed-3-4",
  "ed-4-1", "ed-4-2", "ed-4-3", "ed-4-4",
  "ed-5-1", "ed-5-2", "ed-5-3", "ed-5-4",
];

const EVENT_ITEM_IDS = [
  "ev-1-1", "ev-1-2", "ev-1-3", "ev-1-4",
  "ev-2-1", "ev-2-2", "ev-2-3", "ev-2-4", "ev-2-5",
  "ev-3-1", "ev-3-2", "ev-3-3", "ev-3-4",
  "ev-4-1", "ev-4-2", "ev-4-3", "ev-4-4",
];

const DATA_FIELDS = [
  "institucion", "docente", "estudiantes", "fecha", "horaInicio", "horaTermino",
  "lugar", "direccion", "comuna", "tipoEdificio", "anioConstruccion",
  "permisoEdificacion",
];

const INTERVIEW_FIELDS = ["nombre", "rol", "consentimiento", "notas"];
const EVIDENCE_FIELDS = ["descripcion", "ubicacion", "medicion"];

function doGet(event) {
  const students = event && event.parameter && event.parameter.portal === "estudiantes";
  const studentTemplate = ["Student", "Students", "StudentPortal"].find(function (name) {
    try {
      return HtmlService.createHtmlOutputFromFile(name) !== null;
    } catch (_) {
      return false;
    }
  }) || "Student";
  return HtmlService.createHtmlOutputFromFile(students ? studentTemplate : "Index")
    .setTitle(students ? "Visibilizar es Intervenir · Estudiantes" : "Observa Chile · Cartilla de inspección")
    .addMetaTag("viewport", "width=device-width, initial-scale=1");
}

function initializeStorage() {
  const activeEmail = Session.getActiveUser().getEmail();
  const ownerEmail = Session.getEffectiveUser().getEmail();
  if (!activeEmail || activeEmail !== ownerEmail) {
    throw new Error("Ejecuta la inicialización desde la cuenta propietaria del proyecto.");
  }

  const properties = PropertiesService.getScriptProperties();
  const existingSpreadsheetId = properties.getProperty(STORAGE_PROPERTY_KEYS.spreadsheetId);
  const existingFolderId = properties.getProperty(STORAGE_PROPERTY_KEYS.folderId);
  if (existingSpreadsheetId && existingFolderId) {
    return {
      spreadsheetId: existingSpreadsheetId,
      folderId: existingFolderId,
      message: "El almacenamiento ya estaba configurado.",
    };
  }

  const folder = DriveApp.createFolder("Observa Chile - Inspecciones privadas");
  const spreadsheet = SpreadsheetApp.create("Observa Chile - Inspecciones");
  DriveApp.getFileById(spreadsheet.getId()).moveTo(folder);
  const sheet = spreadsheet.getSheets()[0];
  sheet.setName("Inspecciones");
  sheet.appendRow([
    "Fecha de recepción",
    "Código de referencia",
    "Tipo",
    "Porcentaje",
    "Nivel",
    "Datos generales (JSON)",
    "Evaluaciones (JSON)",
    "Notas por criterio (JSON)",
    "Observaciones generales",
    "Entrevista (JSON)",
    "Evidencias y archivos Drive (JSON)",
  ]);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, 11).setFontWeight("bold").setWrap(true);
  sheet.setColumnWidth(1, 170);
  sheet.setColumnWidth(2, 190);
  sheet.setColumnWidths(3, 3, 140);
  sheet.setColumnWidths(6, 6, 280);

  properties.setProperties({
    [STORAGE_PROPERTY_KEYS.spreadsheetId]: spreadsheet.getId(),
    [STORAGE_PROPERTY_KEYS.folderId]: folder.getId(),
  });

  return {
    spreadsheetId: spreadsheet.getId(),
    folderId: folder.getId(),
    message: "Almacenamiento privado creado.",
  };
}

function saveInspection(input) {
  const inspection = validateInspection_(input);
  const storage = getStorage_();
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) {
    throw new Error("El sistema está ocupado. Inténtalo nuevamente en un momento.");
  }

  const userKey = Session.getTemporaryActiveUserKey();
  const cache = CacheService.getScriptCache();
  const cacheKey = userKey ? `last-submit-${userKey}` : null;
  let recordFolder = null;

  try {
    if (cacheKey && cache.get(cacheKey)) {
      throw new Error("Espera un minuto antes de enviar otra inspección.");
    }

    const code = Utilities.getUuid().replace(/-/g, "").toUpperCase();
    recordFolder = DriveApp.getFolderById(storage.folderId).createFolder(code);
    const evidences = inspection.evidencias.map((item) => {
      let fileId = null;
      if (item.foto) {
        const match = item.foto.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
        if (!match) throw new Error("Una fotografía tiene un formato no admitido.");
        const extension = match[1] === "image/jpeg" ? "jpg" : match[1].split("/")[1];
        const blob = Utilities.newBlob(
          Utilities.base64Decode(match[2]),
          match[1],
          `${code}-evidencia-${item.id}.${extension}`
        );
        fileId = recordFolder.createFile(blob).getId();
      }
      return {
        id: item.id,
        descripcion: item.descripcion,
        ubicacion: item.ubicacion,
        medicion: item.medicion,
        archivoDriveId: fileId,
      };
    });

    const score = calculateScore_(inspection.mode, inspection.evaluaciones);
    storage.sheet.appendRow([
      new Date(),
      code,
      inspection.mode,
      score.porcentaje === null ? "" : score.porcentaje,
      score.nivel || "",
      JSON.stringify(inspection.datos),
      JSON.stringify(inspection.evaluaciones),
      JSON.stringify(inspection.notas),
      JSON.stringify(inspection.observaciones),
      JSON.stringify(inspection.entrevista),
      JSON.stringify(evidences),
    ]);
    if (cacheKey) {
      try {
        cache.put(cacheKey, "1", 60);
      } catch (cacheError) {
        console.error(`No se pudo actualizar el límite de envíos: ${cacheError}`);
      }
    }
    return { codigo: code };
  } catch (error) {
    if (recordFolder) {
      try {
        recordFolder.setTrashed(true);
      } catch (cleanupError) {
        console.error(`No se pudo limpiar la carpeta parcial: ${cleanupError}`);
      }
    }
    console.error(`Error al guardar inspección: ${error}`);
    if (error instanceof Error && error.message.startsWith("Espera un minuto")) throw error;
    throw new Error("No se pudo guardar la inspección. Inténtalo nuevamente.");
  } finally {
    lock.releaseLock();
  }
}

function getStorage_() {
  const properties = PropertiesService.getScriptProperties();
  const spreadsheetId = properties.getProperty(STORAGE_PROPERTY_KEYS.spreadsheetId);
  const folderId = properties.getProperty(STORAGE_PROPERTY_KEYS.folderId);
  if (!spreadsheetId || !folderId) {
    throw new Error("El almacenamiento no está inicializado. Contacta al equipo responsable.");
  }
  return {
    sheet: SpreadsheetApp.openById(spreadsheetId).getSheetByName("Inspecciones"),
    folderId,
  };
}

function validateInspection_(input) {
  if (!input || typeof input !== "object" || !input.state || typeof input.state !== "object") {
    throw new Error("La inspección no tiene un formato válido.");
  }
  if (JSON.stringify(input).length > MAX_PAYLOAD_CHARS) {
    throw new Error("El envío excede el tamaño permitido. Reduce o elimina algunas fotografías.");
  }

  const state = input.state;
  const mode = state.modo;
  if (mode !== "edificio" && mode !== "evento") {
    throw new Error("El tipo de inspección no es válido.");
  }

  const validIds = mode === "edificio" ? BUILDING_ITEM_IDS : EVENT_ITEM_IDS;
  const datos = validateTextObject_(state.datos, DATA_FIELDS, 500, "datos generales");
  const evaluaciones = validateEvaluations_(state.evaluaciones, validIds);
  const notas = validateTextObject_(state.notas, validIds, 1500, "notas");
  if (JSON.stringify(notas).length > 45000) {
    throw new Error("Las notas exceden el tamaño que se puede guardar en la hoja.");
  }
  const entrevista = validateTextObject_(state.entrevista, INTERVIEW_FIELDS, 4000, "entrevista");
  const tieneEntrevista = ["nombre", "rol", "notas"].some((field) =>
    entrevista[field] && entrevista[field].trim()
  );
  if (
    tieneEntrevista &&
    !/^(sí|si)(?:\b|$)/i.test(entrevista.consentimiento.trim())
  ) {
    throw new Error("Registra el consentimiento informado antes de enviar la entrevista.");
  }
  const observaciones = validateString_(state.observaciones, 20000, "observaciones");
  if (!Array.isArray(state.evidencias) || state.evidencias.length > 6) {
    throw new Error("El número de evidencias excede el límite permitido.");
  }

  const seenEvidenceIds = {};
  const evidencias = state.evidencias.map((item) => {
    if (!item || !Number.isInteger(item.id) || item.id < 1 || item.id > 6 || seenEvidenceIds[item.id]) {
      throw new Error("Una evidencia tiene un identificador no válido.");
    }
    seenEvidenceIds[item.id] = true;
    const metadata = validateTextObject_(
      {
        descripcion: item.descripcion,
        ubicacion: item.ubicacion,
        medicion: item.medicion,
      },
      EVIDENCE_FIELDS,
      1000,
      "evidencia"
    );
    if (item.foto !== null && item.foto !== undefined) {
      if (typeof item.foto !== "string" || item.foto.length > MAX_PHOTO_DATA_URL_CHARS) {
        throw new Error("Una fotografía supera el tamaño máximo permitido.");
      }
      if (!/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(item.foto)) {
        throw new Error("Una fotografía tiene un formato no admitido.");
      }
    }
    return {
      id: item.id,
      ...metadata,
      foto: item.foto || null,
    };
  });

  return { mode, datos, evaluaciones, notas, observaciones, entrevista, evidencias };
}

function validateEvaluations_(value, allowedIds) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Las evaluaciones no tienen un formato válido.");
  }
  const result = {};
  Object.keys(value).forEach((id) => {
    if (!allowedIds.includes(id) || !["cumple", "nocumple", "na"].includes(value[id])) {
      throw new Error("Una evaluación contiene un criterio o valor no válido.");
    }
    result[id] = value[id];
  });
  return result;
}

function validateTextObject_(value, allowedFields, maxLength, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Los ${label} no tienen un formato válido.`);
  }
  const result = {};
  Object.keys(value).forEach((key) => {
    if (!allowedFields.includes(key)) {
      throw new Error(`Los ${label} contienen un campo no válido.`);
    }
    result[key] = validateString_(value[key], maxLength, label);
  });
  return result;
}

function validateString_(value, maxLength, label) {
  if (typeof value !== "string" || value.length > maxLength) {
    throw new Error(`El campo ${label} excede el formato permitido.`);
  }
  return value;
}

function calculateScore_(mode, evaluations) {
  const ids = mode === "edificio" ? BUILDING_ITEM_IDS : EVENT_ITEM_IDS;
  let cumple = 0;
  let noCumple = 0;
  let na = 0;
  ids.forEach((id) => {
    if (evaluations[id] === "cumple") cumple += 1;
    else if (evaluations[id] === "nocumple") noCumple += 1;
    else if (evaluations[id] === "na") na += 1;
  });
  const aplicables = cumple + noCumple;
  const porcentaje = aplicables ? Math.round((cumple / aplicables) * 100) : null;
  const nivel = porcentaje === null ? "" : porcentaje >= 80 ? "alta" : porcentaje >= 50 ? "media" : "baja";
  return { cumple, noCumple, na, aplicables, total: ids.length, porcentaje, nivel };
}
