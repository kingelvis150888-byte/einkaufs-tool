// Hilfsfunktionen zum Einlesen von CSV-Dateien und deutschen Zahlenformaten.

// Liest eine Zahl in deutschem oder englischem Format: "1.234,5", "2 688", "4205,63", "12.5"
export function toNumber(value) {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  let s = String(value).replace(/[\s €%]/g, "").trim();
  if (s === "" || s === "-") return 0;
  if (s.includes(",")) {
    // Komma ist Dezimaltrennzeichen, Punkte sind Tausendertrennzeichen
    s = s.replace(/\./g, "").replace(",", ".");
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

// Artikelnummern immer als Text behandeln (führende Nullen bleiben erhalten)
export function toArticleNumber(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

// Datum aus "TT.MM.JJJJ", "JJJJ-MM-TT" oder Excel-Datum lesen
export function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value) ? null : value;
  const s = String(value).trim();
  let m = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (m) return new Date(Date.UTC(+m[3], +m[2] - 1, +m[1]));
  m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return null;
}

// CSV-Parser mit Anführungszeichen, Kommas/Semikolons in Feldern und Zeilenumbrüchen
export function parseCsv(text) {
  text = text.replace(/^﻿/, "");
  const firstLine = text.split(/\r?\n/, 1)[0];
  const sep = (firstLine.match(/;/g) || []).length > (firstLine.match(/,/g) || []).length ? ";" : ",";
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === sep) { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.some((f) => f.trim() !== "")) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((f) => f.trim() !== "")) rows.push(row);
  return rows;
}

// Wandelt Zeilen (erste Zeile = Kopfzeile) in Objekte um
export function rowsToObjects(rows) {
  const headers = rows[0].map((h) => String(h).trim().replace(/\s+/g, " "));
  return rows.slice(1).map((r) => {
    const o = {};
    headers.forEach((h, i) => { o[h] = r[i] === undefined ? "" : r[i]; });
    return o;
  });
}

// Findet eine Spalte über mehrere mögliche Namen (Groß-/Kleinschreibung egal)
export function findColumn(headers, candidates) {
  const norm = (s) => String(s).toLowerCase().replace(/\s+/g, " ").trim();
  const hs = headers.map(norm);
  for (const c of candidates) {
    const i = hs.indexOf(norm(c));
    if (i >= 0) return headers[i];
  }
  return null;
}
