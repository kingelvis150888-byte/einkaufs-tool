// Einkaufslogik: Bestellpunkt, Bestelltermin, Bestellmenge, Status und Bündelung je Lieferant.
//
// Grundidee (abgestimmt am 17.11.2026):
//   Bestelltermin  = Datum, an dem der Bestand aufgebraucht ist − Vorlaufzeit − Puffer
//   Bestellmenge   = Ø Monatsverkauf × (Vorlaufzeit + Puffer + Reichweite) − verfügbarer Bestand
//   Verfügbar      = Hauptlager + Spedpack + Amazon (verfügbar, reserviert, unterwegs) + offene Bestellungen
// Wird ein Artikel früher mitbestellt (Bündelung), sinkt seine Menge automatisch,
// weil sein Bestand höher ist. Alle gebündelten Artikel werden danach wieder gleichzeitig fällig.

// Ein Monat = 30 Tage, damit 60 + 60 Tage genau 4 Monate Vorlaufzeit ergeben
export const DAYS_PER_MONTH = 30;
const DAY = 86400000;

export const DEFAULT_SETTINGS = {
  productionDays: 60,   // Produktionszeit
  transportDays: 60,    // Seefracht bis Spedpack
  bufferMonths: 1,      // Sicherheitspuffer
  coverageMonths: 6,    // Reichweite nach Wareneingang
  bundleWindowDays: 60, // Artikel, die innerhalb dieses Zeitraums fällig werden, werden mitbestellt
  attentionDays: 30,    // Status "Achtung", wenn die Bestellung in so vielen Tagen fällig wird
  overdueOrderDays: 30, // Offene Bestellungen, deren Liefertermin so lange überschritten ist, zählen nicht mehr
  packSize: 1,          // Bestellmenge wird auf ein Vielfaches davon aufgerundet
};

// Einstellungen zusammenführen: Artikel vor Lieferant vor Standard. Leere Werte werden übersprungen.
export function resolveSettings(globalSettings, supplierSettings, articleSettings) {
  const out = { ...DEFAULT_SETTINGS };
  for (const layer of [globalSettings, supplierSettings, articleSettings]) {
    if (!layer) continue;
    for (const [k, v] of Object.entries(layer)) {
      if (v !== null && v !== undefined && v !== "" && k in DEFAULT_SETTINGS) out[k] = Number(v);
    }
  }
  return out;
}

const addDays = (d, n) => new Date(d.getTime() + Math.round(n) * DAY);
const daysBetween = (a, b) => Math.round((b - a) / DAY);

// Teilt offene Bestellungen in "zählt" und "bitte prüfen" (Liefertermin zu lange überschritten)
export function classifyOrders(orders, today, overdueOrderDays) {
  const valid = [], check = [];
  for (const o of orders) {
    if (o.status === "Eingegangen" || o.status === "Storniert") continue;
    const late = o.eta ? daysBetween(o.eta, today) : 0;
    if (o.eta && late > overdueOrderDays && !o.confirmed) check.push({ ...o, daysLate: late });
    else valid.push(o);
  }
  return { valid, check };
}

// Berechnet alle Planwerte für einen Artikel.
// input: { nr, name, supplier, family, ffStock, amazon, unitsSold, salesDays, orders, settings }
export function planArticle(input, today = new Date()) {
  const s = input.settings || DEFAULT_SETTINGS;
  const notes = [];

  // Bestand
  const ffRaw = input.ffStock ? input.ffStock.total : 0;
  if (ffRaw < 0) notes.push(`Negativer Bestand in FF (${ffRaw}), als 0 gewertet`);
  const ff = Math.max(0, ffRaw);
  const amz = input.amazon ? input.amazon.fba + input.amazon.reserved + input.amazon.inbound : 0;
  const onHand = ff + amz;

  // Offene Bestellungen
  const { valid, check } = classifyOrders(input.orders || [], today, s.overdueOrderDays);
  const openQty = valid.reduce((a, o) => a + o.openQty, 0);
  if (check.length) notes.push(`${check.length} offene Bestellung(en) überfällig, bitte prüfen`);
  const available = onHand + openQty;

  // Verkauf
  const monthly = input.salesDays > 0 ? (input.unitsSold / input.salesDays) * DAYS_PER_MONTH : 0;
  const leadMonths = (s.productionDays + s.transportDays) / DAYS_PER_MONTH;

  const base = {
    nr: input.nr, name: input.name, supplier: input.supplier || "", family: input.family || "",
    settings: s, ff, ffHaupt: input.ffStock?.haupt || 0, ffSpedpack: input.ffStock?.spedpack || 0,
    amazon: amz, onHand, openQty, available, monthly,
    leadMonths, ordersValid: valid, ordersToCheck: check, notes,
  };

  if (monthly <= 0) {
    return { ...base, status: "Kein Verkauf", statusRank: 4, reachMonths: null, runOutDate: null, orderByDate: null, dueInDays: null, orderQty: 0, breakdown: null };
  }

  // Wann ist der Bestand (inkl. offener Bestellungen) aufgebraucht, wann muss bestellt werden?
  const reachMonths = available / monthly;
  const runOutDate = addDays(today, reachMonths * DAYS_PER_MONTH);
  const orderByDate = addDays(runOutDate, -(s.productionDays + s.transportDays + s.bufferMonths * DAYS_PER_MONTH));
  const dueInDays = daysBetween(today, orderByDate);

  // Bestellmenge, wenn heute bestellt würde
  const breakdown = {
    leadSales: monthly * leadMonths,
    buffer: monthly * s.bufferMonths,
    coverage: monthly * s.coverageMonths,
    available,
  };
  const need = breakdown.leadSales + breakdown.buffer + breakdown.coverage - available;
  const pack = Math.max(1, s.packSize || 1);
  const orderQty = need > 0 ? Math.ceil(need / pack) * pack : 0;

  // Kritisch: Ware, die bis zum Eingang einer heute aufgegebenen Bestellung da ist, reicht nicht
  const arrivalToday = addDays(today, s.productionDays + s.transportDays);
  const arrivingInTime = valid.filter((o) => !o.eta || o.eta <= arrivalToday).reduce((a, o) => a + o.openQty, 0);
  const critical = onHand + arrivingInTime < monthly * leadMonths;

  let status, statusRank;
  if (critical) { status = "Kritisch"; statusRank = 0; }
  else if (dueInDays <= 0) { status = "Warnung"; statusRank = 1; }
  else if (dueInDays <= s.attentionDays) { status = "Achtung"; statusRank = 2; }
  else { status = "OK"; statusRank = 3; }

  return { ...base, status, statusRank, reachMonths, runOutDate, orderByDate, dueInDays, orderQty, breakdown };
}

// Bündelungsvorschläge je Lieferant: Sobald der erste Artikel fällig wird (bzw. innerhalb der Achtungsfrist),
// werden alle Artikel desselben Lieferanten mitbestellt, die innerhalb des Bündelungsfensters fällig werden.
export function buildBundles(plans) {
  const bySupplier = {};
  for (const p of plans) {
    if (p.dueInDays === null) continue;
    (bySupplier[p.supplier || "Ohne Lieferant"] ||= []).push(p);
  }
  const bundles = [];
  for (const [supplier, items] of Object.entries(bySupplier)) {
    items.sort((a, b) => a.dueInDays - b.dueInDays);
    const trigger = items[0];
    if (trigger.dueInDays > trigger.settings.attentionDays) continue;
    const limit = Math.max(trigger.dueInDays, 0) + trigger.settings.bundleWindowDays;
    const members = items.filter((p) => p.dueInDays <= limit && p.orderQty > 0);
    bundles.push({
      supplier,
      trigger: trigger.nr,
      dueInDays: trigger.dueInDays,
      windowDays: trigger.settings.bundleWindowDays,
      items: members,
      totalQty: members.reduce((a, p) => a + p.orderQty, 0),
    });
  }
  return bundles.sort((a, b) => a.dueInDays - b.dueInDays);
}
