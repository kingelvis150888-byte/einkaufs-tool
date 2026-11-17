// Prüft die Rechenlogik mit dem abgestimmten Beispiel (17.11.2026). Start: node tests/planning.test.mjs
import assert from "node:assert/strict";
import { planArticle, buildBundles, resolveSettings } from "../lib/planning.js";

const today = new Date(Date.UTC(2026, 10, 17));
const s = resolveSettings({}, {}, {});
const art = (nr, monthly, stock, supplier = "Ningbo") =>
  planArticle({ nr, name: nr, supplier, ffStock: { total: stock, haupt: stock, spedpack: 0 }, unitsSold: monthly, salesDays: 30, orders: [], settings: s }, today);

// Grundbeispiel: 100/Monat, 600 Bestand -> fällig in 1 Monat, Menge 500
let p = art("A", 100, 600);
assert.equal(p.dueInDays, 30); assert.equal(p.orderQty, 500); assert.equal(p.status, "Achtung");
assert.equal(p.orderByDate.toISOString().slice(0, 10), "2026-12-17");

// Am Bestellpunkt: 500 Bestand -> 600 bestellen, Status Warnung
p = art("B", 100, 500); assert.equal(p.dueInDays, 0); assert.equal(p.orderQty, 600); assert.equal(p.status, "Warnung");
// Überfällig: 400 -> 700
p = art("C", 100, 400); assert.equal(p.orderQty, 700);
// Kritisch: reicht nicht bis Wareneingang (4 Monate = 400)
p = art("D", 100, 350); assert.equal(p.status, "Kritisch");

// Bündelungsbeispiel
const plans = [art("Salbeigruen", 200, 1080), art("StoneGrey", 150, 890), art("rosa", 80, 510), art("ruby", 60, 410), art("Anthrazit", 50, 500), art("Fremd", 100, 300, "Andere")];
const qty = Object.fromEntries(plans.map((x) => [x.nr, x.orderQty]));
assert.deepEqual([qty.Salbeigruen, qty.StoneGrey, qty.rosa, qty.ruby], [1120, 760, 370, 250]);
const b = buildBundles(plans).find((x) => x.supplier === "Ningbo");
assert.deepEqual(b.items.map((x) => x.nr), ["Salbeigruen", "StoneGrey", "rosa", "ruby"]);
assert.equal(b.totalQty, 2500);
// Probe: Bestand bei Wareneingang = 7 Monate
for (const x of b.items) assert.equal(Math.round(x.available - x.monthly * 4 + x.orderQty), x.monthly * 7);

// Offene Bestellung zählt mit, überfällige nicht
const withOrder = planArticle({ nr: "E", ffStock: { total: 300 }, unitsSold: 100, salesDays: 30, settings: s,
  orders: [{ openQty: 300, eta: new Date(Date.UTC(2027, 0, 10)) }, { openQty: 999, eta: new Date(Date.UTC(2026, 5, 1)) }] }, today);
assert.equal(withOrder.available, 600); assert.equal(withOrder.ordersToCheck.length, 1);

// Einstellungen: Artikel vor Lieferant vor Standard
assert.equal(resolveSettings({ coverageMonths: 6 }, { coverageMonths: 4, transportDays: 30 }, { coverageMonths: 8 }).coverageMonths, 8);
assert.equal(resolveSettings({}, { transportDays: 30 }, { transportDays: "" }).transportDays, 30);
console.log("Alle Rechentests bestanden");
