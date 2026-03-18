"use client";

import { useMemo, useState } from "react";

const initialData = [
  {
    id: 1,
    parent: "Futterschale Silikon – Katze",
    variant: "steinfarben",
    articleNumber: "04001441",
    supplier: "Jeremy",
    brand: "ne&no",
    region: "EU",
    stock: 1156,
    inbound: 0,
    sales12m: 1572,
    targetMonths: 12,
    safetyMonths: 2,
    productionMonths: 2,
    shippingMonths: 2,
    active: true,
  },
  {
    id: 2,
    parent: "Futterschale Silikon – Katze",
    variant: "salbeigrün",
    articleNumber: "04001438",
    supplier: "Jeremy",
    brand: "ne&no",
    region: "EU",
    stock: 736,
    inbound: 0,
    sales12m: 1155,
    targetMonths: 12,
    safetyMonths: 2,
    productionMonths: 2,
    shippingMonths: 2,
    active: true,
  },
  {
    id: 3,
    parent: "Futterschale Silikon – Katze",
    variant: "rosa",
    articleNumber: "04001440",
    supplier: "Jeremy",
    brand: "ne&no",
    region: "EU",
    stock: 392,
    inbound: 0,
    sales12m: 668,
    targetMonths: 12,
    safetyMonths: 2,
    productionMonths: 2,
    shippingMonths: 2,
    active: true,
  },
  {
    id: 4,
    parent: "Futterschale Silikon – Katze",
    variant: "blau",
    articleNumber: "04001442",
    supplier: "Jeremy",
    brand: "ne&no",
    region: "EU",
    stock: 1056,
    inbound: 0,
    sales12m: 840,
    targetMonths: 12,
    safetyMonths: 2,
    productionMonths: 2,
    shippingMonths: 2,
    active: true,
  },
  {
    id: 5,
    parent: "Futterschale Silikon – Katze",
    variant: "cool lilac",
    articleNumber: "04001571",
    supplier: "Jeremy",
    brand: "ne&no",
    region: "EU",
    stock: 811,
    inbound: 0,
    sales12m: 601,
    targetMonths: 12,
    safetyMonths: 2,
    productionMonths: 2,
    shippingMonths: 2,
    active: true,
  },
  {
    id: 6,
    parent: "Futterschale Silikon – Katze",
    variant: "graphitgrau",
    articleNumber: "04001637",
    supplier: "Jeremy",
    brand: "ne&no",
    region: "EU",
    stock: 73,
    inbound: 0,
    sales12m: 1146,
    targetMonths: 12,
    safetyMonths: 2,
    productionMonths: 2,
    shippingMonths: 2,
    active: true,
  },

  {
    id: 7,
    parent: "Napfunterlage Silikon",
    variant: "stone grey",
    articleNumber: "04001553",
    supplier: "Jeremy",
    brand: "ne&no",
    region: "EU",
    stock: 307,
    inbound: 0,
    sales12m: 1001,
    targetMonths: 12,
    safetyMonths: 2,
    productionMonths: 2,
    shippingMonths: 2,
    active: true,
  },
  {
    id: 8,
    parent: "Napfunterlage Silikon",
    variant: "rose",
    articleNumber: "04001555",
    supplier: "Jeremy",
    brand: "ne&no",
    region: "EU",
    stock: 480,
    inbound: 0,
    sales12m: 501,
    targetMonths: 12,
    safetyMonths: 2,
    productionMonths: 2,
    shippingMonths: 2,
    active: true,
  },
  {
    id: 9,
    parent: "Napfunterlage Silikon",
    variant: "steel blue",
    articleNumber: "04001556",
    supplier: "Jeremy",
    brand: "ne&no",
    region: "EU",
    stock: 174,
    inbound: 0,
    sales12m: 389,
    targetMonths: 12,
    safetyMonths: 2,
    productionMonths: 2,
    shippingMonths: 2,
    active: true,
  },
  {
    id: 10,
    parent: "Napfunterlage Silikon",
    variant: "anthrazit",
    articleNumber: "04001563",
    supplier: "Jeremy",
    brand: "ne&no",
    region: "EU",
    stock: 652,
    inbound: 0,
    sales12m: 723,
    targetMonths: 12,
    safetyMonths: 2,
    productionMonths: 2,
    shippingMonths: 2,
    active: true,
  },
  {
    id: 11,
    parent: "Napfunterlage Silikon",
    variant: "salbeigrün",
    articleNumber: "04001564",
    supplier: "Jeremy",
    brand: "ne&no",
    region: "EU",
    stock: 0,
    inbound: 0,
    sales12m: 1344,
    targetMonths: 12,
    safetyMonths: 2,
    productionMonths: 2,
    shippingMonths: 2,
    active: true,
  },
  {
    id: 12,
    parent: "Napfunterlage Silikon",
    variant: "lilac",
    articleNumber: "04001884",
    supplier: "Jeremy",
    brand: "ne&no",
    region: "EU",
    stock: 463,
    inbound: 0,
    sales12m: 108,
    targetMonths: 12,
    safetyMonths: 2,
    productionMonths: 2,
    shippingMonths: 2,
    active: true,
  },

  {
    id: 13,
    parent: "Anti Schling Napf Silikon",
    variant: "malve",
    articleNumber: "04001605",
    supplier: "Jeremy",
    brand: "ne&no",
    region: "EU",
    stock: 347,
    inbound: 0,
    sales12m: 570,
    targetMonths: 12,
    safetyMonths: 2,
    productionMonths: 2,
    shippingMonths: 2,
    active: true,
  },
  {
    id: 14,
    parent: "Anti Schling Napf Silikon",
    variant: "salbeigrün",
    articleNumber: "04001606",
    supplier: "Jeremy",
    brand: "ne&no",
    region: "EU",
    stock: 571,
    inbound: 0,
    sales12m: 878,
    targetMonths: 12,
    safetyMonths: 2,
    productionMonths: 2,
    shippingMonths: 2,
    active: true,
  },
  {
    id: 15,
    parent: "Anti Schling Napf Silikon",
    variant: "taupe",
    articleNumber: "04001872",
    supplier: "Jeremy",
    brand: "ne&no",
    region: "EU",
    stock: 574,
    inbound: 0,
    sales12m: 444,
    targetMonths: 12,
    safetyMonths: 2,
    productionMonths: 2,
    shippingMonths: 2,
    active: true,
  },
  {
    id: 16,
    parent: "Anti Schling Napf Silikon",
    variant: "steingrau",
    articleNumber: "04001873",
    supplier: "Jeremy",
    brand: "ne&no",
    region: "EU",
    stock: 704,
    inbound: 0,
    sales12m: 301,
    targetMonths: 12,
    safetyMonths: 2,
    productionMonths: 2,
    shippingMonths: 2,
    active: true,
  },
  {
    id: 17,
    parent: "Anti Schling Napf Silikon",
    variant: "cool lilac",
    articleNumber: "04001929",
    supplier: "Jeremy",
    brand: "ne&no",
    region: "EU",
    stock: 400,
    inbound: 0,
    sales12m: 13,
    observedMonths: 1,
    targetMonths: 12,
    safetyMonths: 2,
    productionMonths: 2,
    shippingMonths: 2,
    active: true,
  },
  {
    id: 18,
    parent: "Anti Schling Napf Silikon",
    variant: "steel blue",
    articleNumber: "04001930",
    supplier: "Jeremy",
    brand: "ne&no",
    region: "EU",
    stock: 671,
    inbound: 0,
    sales12m: 30,
    observedMonths: 1,
    targetMonths: 12,
    safetyMonths: 2,
    productionMonths: 2,
    shippingMonths: 2,
    active: true,
  },
  {
    id: 19,
    parent: "Anti Schling Napf Silikon",
    variant: "ruby",
    articleNumber: "04001931",
    supplier: "Jeremy",
    brand: "ne&no",
    region: "EU",
    stock: 325,
    inbound: 0,
    sales12m: 39,
    observedMonths: 1,
    targetMonths: 12,
    safetyMonths: 2,
    productionMonths: 2,
    shippingMonths: 2,
    active: true,
  },
  {
    id: 20,
    parent: "Anti Schling Napf Silikon",
    variant: "graphite grey",
    articleNumber: "04001932",
    supplier: "Jeremy",
    brand: "ne&no",
    region: "EU",
    stock: 537,
    inbound: 0,
    sales12m: 28,
    observedMonths: 1,
    targetMonths: 12,
    safetyMonths: 2,
    productionMonths: 2,
    shippingMonths: 2,
    active: true,
  },
];

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function getObservedMonths(item) {
  return item.observedMonths ? toNumber(item.observedMonths) : 12;
}

function monthlySales(item) {
  const observed = getObservedMonths(item);
  if (observed <= 0) return 0;
  return toNumber(item.sales12m) / observed;
}

function monthsToArrival(item) {
  return toNumber(item.productionMonths) + toNumber(item.shippingMonths);
}

function coverageMonths(stock, monthly) {
  if (!monthly || monthly <= 0) return 999;
  return toNumber(stock) / monthly;
}

function expectedStockAtArrival(item) {
  const monthly = monthlySales(item);
  const futureConsumption = monthly * monthsToArrival(item);
  return Math.max(0, toNumber(item.stock) + toNumber(item.inbound) - futureConsumption);
}

function requiredFromArrival(item) {
  const monthly = monthlySales(item);
  return monthly * (toNumber(item.targetMonths) + toNumber(item.safetyMonths));
}

function orderQty(item) {
  const need = requiredFromArrival(item) - expectedStockAtArrival(item);
  return need > 0 ? Math.ceil(need) : 0;
}

function getStatus(item) {
  const monthly = monthlySales(item);
  const currentCoverage = coverageMonths(item.stock + item.inbound, monthly);

  if (!item.active) {
    return { label: "Inaktiv", bg: "#e5e7eb", color: "#374151" };
  }
  if (currentCoverage < 1) {
    return { label: "Kritisch", bg: "#fee2e2", color: "#dc2626" };
  }
  if (currentCoverage < 3) {
    return { label: "Achtung", bg: "#fef3c7", color: "#d97706" };
  }
  return { label: "OK", bg: "#dcfce7", color: "#15803d" };
}

function getWarning(item) {
  const monthly = monthlySales(item);
  const arrivalMonths = monthsToArrival(item);
  const coverageNow = coverageMonths(item.stock + item.inbound, monthly);

  if (!item.active) return "";
  if (coverageNow < arrivalMonths) {
    return `Achtung: Ware könnte vor Wareneingang knapp werden. Reichweite ${coverageNow.toFixed(
      1
    )} M, Wareneingang in ${arrivalMonths.toFixed(1)} M.`;
  }
  return "";
}

function groupItems(items) {
  const grouped = {};
  for (const item of items) {
    const key = `${item.parent}__${item.supplier}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item);
  }
  return grouped;
}

function statCard(title, value) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statTitle}>{title}</div>
      <div style={styles.statValue}>{value}</div>
    </div>
  );
}

export default function Home() {
  const [items, setItems] = useState(initialData);
  const [supplierFilter, setSupplierFilter] = useState("Alle");
  const [statusFilter, setStatusFilter] = useState("Alle");
  const [needOnly, setNeedOnly] = useState(false);

  function updateItem(id, field, value) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: field === "active" ? value : toNumber(value),
            }
          : item
      )
    );
  }

  const suppliers = useMemo(() => {
    return ["Alle", ...new Set(items.map((item) => item.supplier))];
  }, [items]);

  const computedItems = useMemo(() => {
    return items.map((item) => {
      const monthly = monthlySales(item);
      const currentCoverage = coverageMonths(item.stock + item.inbound, monthly);
      const expectedAtArrival = expectedStockAtArrival(item);
      const requiredArrival = requiredFromArrival(item);
      const qty = orderQty(item);
      const status = getStatus(item);
      const warning = getWarning(item);

      return {
        ...item,
        monthly,
        currentCoverage,
        expectedAtArrival,
        requiredArrival,
        qty,
        status,
        warning,
      };
    });
  }, [items]);

  const filteredItems = useMemo(() => {
    return computedItems.filter((item) => {
      if (supplierFilter !== "Alle" && item.supplier !== supplierFilter) return false;
      if (statusFilter !== "Alle" && item.status.label !== statusFilter) return false;
      if (needOnly && item.qty <= 0) return false;
      return true;
    });
  }, [computedItems, supplierFilter, statusFilter, needOnly]);

  const grouped = useMemo(() => groupItems(filteredItems), [filteredItems]);

  const dashboard = useMemo(() => {
    const critical = filteredItems.filter((i) => i.status.label === "Kritisch").length;
    const orderTotal = filteredItems.reduce((sum, i) => sum + i.qty, 0);
    const activeSuppliers = new Set(filteredItems.map((i) => i.supplier)).size;
    const warnings = filteredItems.filter((i) => i.warning).length;
    return { critical, orderTotal, activeSuppliers, warnings };
  }, [filteredItems]);

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.headerWrap}>
          <div>
            <h1 style={styles.h1}>Einkaufs-Planungstool</h1>
            <p style={styles.lead}>
              Live-Version mit Dashboard, Warnungen und Bestelllogik ab Wareneingang.
            </p>
          </div>
        </div>

        <div style={styles.statsGrid}>
          {statCard("Artikelgruppen", Object.keys(grouped).length)}
          {statCard("Kritische Varianten", dashboard.critical)}
          {statCard("Bestellmenge gesamt", dashboard.orderTotal)}
          {statCard("Lieferanten aktiv", dashboard.activeSuppliers)}
        </div>

        <div style={styles.filterCard}>
          <div style={styles.filterGrid}>
            <div>
              <label style={styles.label}>Lieferant</label>
              <select
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
                style={styles.select}
              >
                {suppliers.map((supplier) => (
                  <option key={supplier} value={supplier}>
                    {supplier}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={styles.label}>Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={styles.select}
              >
                <option>Alle</option>
                <option>OK</option>
                <option>Achtung</option>
                <option>Kritisch</option>
                <option>Inaktiv</option>
              </select>
            </div>

            <div style={styles.checkboxWrap}>
              <label style={styles.label}>Nur mit Bedarf</label>
              <div style={styles.checkboxBox}>
                <input
                  type="checkbox"
                  checked={needOnly}
                  onChange={(e) => setNeedOnly(e.target.checked)}
                />
                <span>Bestellmenge &gt; 0</span>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.warningSection}>
          {filteredItems
            .filter((item) => item.warning)
            .slice(0, 6)
            .map((item) => (
              <div key={`warn-${item.id}`} style={styles.warningCard}>
                <strong>
                  {item.parent} – {item.variant}
                </strong>
                <div style={{ marginTop: 6 }}>{item.warning}</div>
              </div>
            ))}
        </div>

        {Object.entries(grouped).map(([groupKey, groupItems]) => {
          const first = groupItems[0];
          const totalStock = groupItems.reduce(
            (sum, item) => sum + toNumber(item.stock) + toNumber(item.inbound),
            0
          );
          const totalSales12m = groupItems.reduce((sum, item) => {
            const observed = getObservedMonths(item);
            return sum + monthlySales(item) * observed;
          }, 0);
          const totalMonthly = groupItems.reduce((sum, item) => sum + item.monthly, 0);
          const totalCoverage = coverageMonths(totalStock, totalMonthly);
          const totalOrder = groupItems.reduce((sum, item) => sum + item.qty, 0);

          let parentStatus = { label: "OK", bg: "#dcfce7", color: "#15803d" };
          if (groupItems.some((i) => i.status.label === "Kritisch")) {
            parentStatus = { label: "Kritisch", bg: "#fee2e2", color: "#dc2626" };
          } else if (groupItems.some((i) => i.status.label === "Achtung")) {
            parentStatus = { label: "Achtung", bg: "#fef3c7", color: "#d97706" };
          }

          return (
            <details key={groupKey} open style={styles.groupCard}>
              <summary style={styles.summary}>
                <div>
                  <div style={styles.groupTitle}>{first.parent}</div>
                  <div style={styles.groupMeta}>
                    Lieferant: {first.supplier} | Marke: {first.brand} | Region: {first.region}
                  </div>
                </div>

                <div style={styles.summaryRight}>
                  <span
                    style={{
                      ...styles.badge,
                      background: parentStatus.bg,
                      color: parentStatus.color,
                    }}
                  >
                    {parentStatus.label}
                  </span>
                </div>
              </summary>

              <div style={styles.groupInfo}>
                <strong>Gesamtbestand:</strong> {totalStock} |{" "}
                <strong>Verkäufe 12M:</strong> {Math.round(totalSales12m)} |{" "}
                <strong>Monat:</strong> {totalMonthly.toFixed(1)} |{" "}
                <strong>Reichweite:</strong> {totalCoverage.toFixed(1)} Monate |{" "}
                <strong>Bestellmenge:</strong> {totalOrder}
              </div>

              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.theadRow}>
                      <th style={styles.th}>Artikelnummer</th>
                      <th style={styles.th}>Variante</th>
                      <th style={styles.th}>Bestand</th>
                      <th style={styles.th}>Unterwegs</th>
                      <th style={styles.th}>Verkäufe</th>
                      <th style={styles.th}>Monate beobachtet</th>
                      <th style={styles.th}>Monat</th>
                      <th style={styles.th}>Ziel</th>
                      <th style={styles.th}>Sicherheit</th>
                      <th style={styles.th}>Produktion</th>
                      <th style={styles.th}>Lieferung</th>
                      <th style={styles.th}>Bestand bei Eingang</th>
                      <th style={styles.th}>Bestellmenge</th>
                      <th style={styles.th}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupItems.map((item) => (
                      <tr key={item.id}>
                        <td style={styles.td}>{item.articleNumber}</td>
                        <td style={styles.td}>{item.variant}</td>
                        <td style={styles.td}>
                          <input
                            type="number"
                            value={item.stock}
                            onChange={(e) => updateItem(item.id, "stock", e.target.value)}
                            style={styles.input}
                          />
                        </td>
                        <td style={styles.td}>
                          <input
                            type="number"
                            value={item.inbound}
                            onChange={(e) => updateItem(item.id, "inbound", e.target.value)}
                            style={styles.input}
                          />
                        </td>
                        <td style={styles.td}>
                          <input
                            type="number"
                            value={item.sales12m}
                            onChange={(e) => updateItem(item.id, "sales12m", e.target.value)}
                            style={styles.input}
                          />
                        </td>
                        <td style={styles.td}>
                          <input
                            type="number"
                            value={getObservedMonths(item)}
                            onChange={(e) =>
                              updateItem(item.id, "observedMonths", e.target.value)
                            }
                            style={styles.input}
                          />
                        </td>
                        <td style={styles.td}>{item.monthly.toFixed(1)}</td>
                        <td style={styles.td}>
                          <input
                            type="number"
                            value={item.targetMonths}
                            onChange={(e) => updateItem(item.id, "targetMonths", e.target.value)}
                            style={styles.input}
                          />
                        </td>
                        <td style={styles.td}>
                          <input
                            type="number"
                            value={item.safetyMonths}
                            onChange={(e) => updateItem(item.id, "safetyMonths", e.target.value)}
                            style={styles.input}
                          />
                        </td>
                        <td style={styles.td}>
                          <input
                            type="number"
                            value={item.productionMonths}
                            onChange={(e) =>
                              updateItem(item.id, "productionMonths", e.target.value)
                            }
                            style={styles.input}
                          />
                        </td>
                        <td style={styles.td}>
                          <input
                            type="number"
                            value={item.shippingMonths}
                            onChange={(e) =>
                              updateItem(item.id, "shippingMonths", e.target.value)
                            }
                            style={styles.input}
                          />
                        </td>
                        <td style={styles.td}>{item.expectedAtArrival.toFixed(0)}</td>
                        <td style={styles.td}>
                          <strong>{item.qty}</strong>
                        </td>
                        <td style={styles.td}>
                          <span
                            style={{
                              ...styles.badge,
                              background: item.status.bg,
                              color: item.status.color,
                            }}
                          >
                            {item.status.label}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          );
        })}
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
    color: "#111827",
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
  },
  headerWrap: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    gap: "16px",
  },
  h1: {
    fontSize: "34px",
    margin: 0,
    marginBottom: "6px",
  },
  lead: {
    margin: 0,
    color: "#4b5563",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "20px",
  },
  statCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "18px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  statTitle: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "8px",
  },
  statValue: {
    fontSize: "28px",
    fontWeight: 700,
  },
  filterCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "18px",
    marginBottom: "18px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  filterGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: 700,
    marginBottom: "8px",
  },
  select: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    background: "#fff",
  },
  checkboxWrap: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  checkboxBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    minHeight: "42px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    padding: "0 12px",
    background: "#fff",
  },
  warningSection: {
    display: "grid",
    gap: "12px",
    marginBottom: "18px",
  },
  warningCard: {
    background: "#fff7ed",
    border: "1px solid #fdba74",
    color: "#9a3412",
    borderRadius: "14px",
    padding: "14px 16px",
  },
  groupCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "18px",
    marginBottom: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  summary: {
    listStyle: "none",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    cursor: "pointer",
  },
  groupTitle: {
    fontSize: "28px",
    fontWeight: 700,
    marginBottom: "4px",
  },
  groupMeta: {
    color: "#6b7280",
    fontSize: "14px",
  },
  summaryRight: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  groupInfo: {
    marginTop: "16px",
    marginBottom: "16px",
    lineHeight: 1.9,
    color: "#111827",
  },
  badge: {
    display: "inline-block",
    borderRadius: "999px",
    padding: "6px 10px",
    fontWeight: 700,
    fontSize: "13px",
    whiteSpace: "nowrap",
  },
  tableWrap: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    minWidth: "1400px",
  },
  theadRow: {
    background: "#f3f4f6",
  },
  th: {
    border: "1px solid #e5e7eb",
    padding: "10px",
    textAlign: "left",
    fontSize: "14px",
  },
  td: {
    border: "1px solid #e5e7eb",
    padding: "10px",
    fontSize: "14px",
    verticalAlign: "middle",
  },
  input: {
    width: "80px",
    padding: "6px 8px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
  },
};
