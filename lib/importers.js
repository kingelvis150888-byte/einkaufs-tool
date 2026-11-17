// Importe für Future Factory (Lagerbestand, Rückstandsliste Einkauf) und Sellerboard (Verkäufe, Lager).
// Alle Importer bekommen Zeilen als Array von Arrays (aus CSV oder Excel) und liefern normalisierte Daten.

import { toNumber, toArticleNumber, toDate, rowsToObjects, findColumn } from "./parse.js";

const ARTICLE_NR = /^\d{8}$/;

// Sucht die Kopfzeile (manche Exporte haben Leerzeilen oder Titel davor)
function headerIndex(rows, mustContain) {
  const i = rows.findIndex((r) => r.some((c) => String(c).trim().toLowerCase() === mustContain.toLowerCase()));
  if (i < 0) throw new Error(`Spalte "${mustContain}" nicht gefunden. Ist das die richtige Datei?`);
  return i;
}

// ---------- Future Factory: Lagerbestand ----------
// Erwartete Spalten: Artikelnummer, Artikel, Hauptlager, Spedpack, Summe Lagerstand
export function importFfStock(rows) {
  const objs = rowsToObjects(rows.slice(headerIndex(rows, "Artikelnummer")));
  const headers = Object.keys(objs[0] || {});
  const cNr = findColumn(headers, ["Artikelnummer"]);
  const cName = findColumn(headers, ["Artikel", "Bezeichnung"]);
  const cHaupt = findColumn(headers, ["Hauptlager"]);
  const cSped = findColumn(headers, ["Spedpack"]);
  const cSum = findColumn(headers, ["Summe Lagerstand"]);
  if (!cHaupt && !cSum) throw new Error("Weder 'Hauptlager' noch 'Summe Lagerstand' gefunden.");

  const stock = {};
  const warnings = { negative: [], duplicates: [] };
  for (const o of objs) {
    const nr = toArticleNumber(o[cNr]);
    if (!nr) continue;
    const haupt = cHaupt ? toNumber(o[cHaupt]) : 0;
    const sped = cSped ? toNumber(o[cSped]) : 0;
    const total = cSum && String(o[cSum]).trim() !== "" ? toNumber(o[cSum]) : haupt + sped;
    if (stock[nr]) {
      warnings.duplicates.push(nr);
      stock[nr].haupt += haupt; stock[nr].spedpack += sped; stock[nr].total += total;
    } else {
      stock[nr] = { nr, name: String(o[cName] || "").trim(), haupt, spedpack: sped, total };
    }
  }
  for (const s of Object.values(stock)) if (s.total < 0) warnings.negative.push(s.nr);
  return { stock, warnings, count: Object.keys(stock).length };
}

// ---------- Future Factory: Rückstandsliste Einkauf (offene Bestellungen) ----------
// Erwartete Spalten: Artikel ("04001605, Bezeichnung"), Offene Menge, Bestelldatum, Lieferdatum, Ursprungsmenge, Lieferant, Bestellung
const NON_STOCK = /fracht|zoll|transport|handling|gebühr|lcl|fee/i;

export function importFfOpenOrders(rows) {
  const objs = rowsToObjects(rows.slice(headerIndex(rows, "Offene Menge")));
  const headers = Object.keys(objs[0] || {});
  const c = {
    art: findColumn(headers, ["Artikel"]),
    open: findColumn(headers, ["Offene Menge"]),
    ordered: findColumn(headers, ["Bestelldatum"]),
    eta: findColumn(headers, ["Lieferdatum", "Liefertermin"]),
    orig: findColumn(headers, ["Ursprungsmenge"]),
    supplier: findColumn(headers, ["Lieferant"]),
    order: findColumn(headers, ["Bestellung"]),
  };
  const orders = [];
  const ignored = [];
  for (const o of objs) {
    const text = String(o[c.art] || "").trim();
    const m = text.match(/^(\d{8})\s*,\s*(.*)$/);
    const name = m ? m[2] : text;
    if (!m || NON_STOCK.test(name)) { ignored.push(text); continue; }
    const supplier = String(o[c.supplier] || "").trim();
    const orderNo = String(o[c.order] || "").split(",")[0].trim() || `ohne Nr. (${supplier})`;
    orders.push({
      nr: m[1],
      name,
      openQty: toNumber(o[c.open]),
      originalQty: toNumber(o[c.orig]),
      orderDate: toDate(o[c.ordered]),
      eta: toDate(o[c.eta]),
      supplier,
      orderNo,
      source: "ff",
    });
  }
  return { orders, ignored };
}

// ---------- Sellerboard: Dashboard nach Produkt (Verkäufe) ----------
export function importSellerboardSales(rows) {
  const objs = rowsToObjects(rows);
  const headers = Object.keys(objs[0] || {});
  const cDate = findColumn(headers, ["Date"]);
  const cSku = findColumn(headers, ["SKU"]);
  const cAsin = findColumn(headers, ["ASIN"]);
  const cMp = findColumn(headers, ["Marketplace"]);
  const cName = findColumn(headers, ["Name"]);
  const cOrg = findColumn(headers, ["UnitsOrganic"]);
  const cPpc = findColumn(headers, ["UnitsPPC"]);
  if (!cSku || !cOrg) throw new Error("Das ist nicht der Bericht 'Dashboard nach Produkt' (Spalten SKU/UnitsOrganic fehlen).");

  const bySku = {};
  let minDate = null, maxDate = null;
  for (const o of objs) {
    const sku = String(o[cSku] || "").trim();
    if (!sku) continue;
    const d = toDate(o[cDate]);
    if (d) { if (!minDate || d < minDate) minDate = d; if (!maxDate || d > maxDate) maxDate = d; }
    const units = toNumber(o[cOrg]) + toNumber(o[cPpc]);
    const e = (bySku[sku] ||= { sku, asin: String(o[cAsin] || "").trim(), name: String(o[cName] || "").trim(), units: 0, marketplaces: new Set() });
    e.units += units;
    if (cMp) e.marketplaces.add(String(o[cMp]).trim());
  }
  const days = minDate && maxDate ? Math.round((maxDate - minDate) / 86400000) + 1 : 0;
  for (const e of Object.values(bySku)) e.marketplaces = [...e.marketplaces];
  return { bySku, days, from: minDate, to: maxDate };
}

// ---------- Sellerboard: Lagerbestand (Amazon) ----------
export function importSellerboardStock(rows) {
  const objs = rowsToObjects(rows);
  const headers = Object.keys(objs[0] || {});
  const cSku = findColumn(headers, ["SKU"]);
  const cAsin = findColumn(headers, ["ASIN"]);
  const cTitle = findColumn(headers, ["Title"]);
  const cMp = findColumn(headers, ["Marketplace"]);
  const cFba = findColumn(headers, ["FBA/FBM Stock"]);
  const cRes = findColumn(headers, ["Reserved"]);
  const cSent = findColumn(headers, ["Sent to FBA"]);
  if (!cSku || !cFba) throw new Error("Das ist nicht der Sellerboard-Lagerbericht (Spalten SKU/FBA/FBM Stock fehlen).");

  const bySku = {};
  for (const o of objs) {
    const sku = String(o[cSku] || "").trim();
    if (!sku) continue;
    const e = (bySku[sku] ||= { sku, asin: String(o[cAsin] || "").trim(), name: String(o[cTitle] || "").trim(), fba: 0, reserved: 0, inbound: 0, marketplaces: [] });
    e.fba += Math.max(0, toNumber(o[cFba]));
    e.reserved += Math.max(0, toNumber(o[cRes]));
    e.inbound += Math.max(0, toNumber(o[cSent]));
    if (cMp) e.marketplaces.push(String(o[cMp]).trim());
  }
  return { bySku };
}

// ---------- SKU → Artikelnummer zuordnen ----------
// Reihenfolge: manuelle Zuordnung, SKU = Artikelnummer, Artikelnummer im SKU, gleiche ASIN wie eine bereits zugeordnete SKU
export function buildSkuResolver(knownNumbers, manualMap = {}) {
  const known = new Set(knownNumbers);
  const asinMap = {};
  function direct(sku) {
    if (manualMap[sku] !== undefined) return { nr: manualMap[sku] || null, how: manualMap[sku] ? "manuell" : "ignoriert" };
    if (known.has(sku)) return { nr: sku, how: "SKU = Artikelnr." };
    const hit = (sku.match(/\d{8}/g) || []).find((x) => known.has(x));
    if (hit) return { nr: hit, how: "Artikelnr. im SKU" };
    return null;
  }
  return {
    // Erster Durchlauf: ASINs der eindeutig zugeordneten SKUs merken
    learn(entries) {
      for (const e of entries) {
        const r = direct(e.sku);
        if (r && r.nr && e.asin) asinMap[e.asin] ||= r.nr;
      }
    },
    resolve(sku, asin) {
      const r = direct(sku);
      if (r) return r;
      if (asin && asinMap[asin]) return { nr: asinMap[asin], how: "gleiche ASIN" };
      return { nr: null, how: "offen" };
    },
  };
}

export { ARTICLE_NR };
