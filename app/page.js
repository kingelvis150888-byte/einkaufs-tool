"use client";

import { useMemo, useState } from "react";

const initialData = [
  {
    parent: "Futterschale Silikon – Katze",
    variant: "steinfarben",
    articleNumber: "04001441",
    stock: 1156,
    sales12m: 1572,
    targetMonths: 3,
  },
  {
    parent: "Futterschale Silikon – Katze",
    variant: "salbeigrün",
    articleNumber: "04001438",
    stock: 736,
    sales12m: 1155,
    targetMonths: 3,
  },
  {
    parent: "Futterschale Silikon – Katze",
    variant: "graphitgrau",
    articleNumber: "04001637",
    stock: 73,
    sales12m: 1146,
    targetMonths: 3,
  },
  {
    parent: "Napfunterlage Silikon",
    variant: "stone grey",
    articleNumber: "04001553",
    stock: 307,
    sales12m: 1001,
    targetMonths: 3,
  },
  {
    parent: "Napfunterlage Silikon",
    variant: "salbeigrün",
    articleNumber: "04001564",
    stock: 0,
    sales12m: 1344,
    targetMonths: 3,
  },
  {
    parent: "Napfunterlage Silikon",
    variant: "lilac",
    articleNumber: "04001884",
    stock: 463,
    sales12m: 108,
    targetMonths: 3,
  },
  {
    parent: "Anti Schling Napf Silikon",
    variant: "blaugrau",
    articleNumber: "04001604",
    stock: 0,
    sales12m: 671,
    targetMonths: 3,
  },
  {
    parent: "Anti Schling Napf Silikon",
    variant: "salbeigrün",
    articleNumber: "04001606",
    stock: 571,
    sales12m: 878,
    targetMonths: 3,
  },
  {
    parent: "Anti Schling Napf Silikon",
    variant: "steingrau",
    articleNumber: "04001873",
    stock: 704,
    sales12m: 301,
    targetMonths: 3,
  },
];

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function getMonthlySales(sales12m) {
  return toNumber(sales12m) / 12;
}

function getCoverageMonths(stock, monthlySales) {
  if (!monthlySales || monthlySales <= 0) return 999;
  return toNumber(stock) / monthlySales;
}

function getStatus(coverage) {
  if (coverage < 1) {
    return { label: "Kritisch", color: "#dc2626", bg: "#fee2e2" };
  }
  if (coverage < 3) {
    return { label: "Achtung", color: "#d97706", bg: "#fef3c7" };
  }
  return { label: "OK", color: "#15803d", bg: "#dcfce7" };
}

function getOrderQty(stock, monthlySales, targetMonths) {
  const targetStock = monthlySales * toNumber(targetMonths);
  const raw = targetStock - toNumber(stock);
  return raw > 0 ? Math.ceil(raw) : 0;
}

function groupData(items) {
  const grouped = {};
  for (const item of items) {
    if (!grouped[item.parent]) grouped[item.parent] = [];
    grouped[item.parent].push(item);
  }
  return grouped;
}

export default function Home() {
  const [items, setItems] = useState(initialData);

  function updateItem(articleNumber, field, value) {
    setItems((prev) =>
      prev.map((item) =>
        item.articleNumber === articleNumber
          ? { ...item, [field]: toNumber(value) }
          : item
      )
    );
  }

  const grouped = useMemo(() => groupData(items), [items]);

  return (
    <main style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ marginBottom: 8 }}>Einkaufs-Planungstool</h1>
      <p style={{ marginBottom: 24 }}>
        Interaktive Version mit editierbaren Werten und Bestellmenge.
      </p>

      {Object.entries(grouped).map(([parent, groupItems]) => {
        const totalStock = groupItems.reduce((sum, item) => sum + toNumber(item.stock), 0);
        const totalSales12m = groupItems.reduce((sum, item) => sum + toNumber(item.sales12m), 0);
        const totalMonthly = totalSales12m / 12;
        const totalCoverage = getCoverageMonths(totalStock, totalMonthly);
        const parentStatus = getStatus(totalCoverage);
        const totalOrder = groupItems.reduce((sum, item) => {
          const monthly = getMonthlySales(item.sales12m);
          return sum + getOrderQty(item.stock, monthly, item.targetMonths);
        }, 0);

        return (
          <div
            key={parent}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 16,
              marginBottom: 24,
              background: "#fafafa",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <h2 style={{ margin: 0 }}>{parent}</h2>

              <span
                style={{
                  background: parentStatus.bg,
                  color: parentStatus.color,
                  padding: "6px 10px",
                  borderRadius: 999,
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                {parentStatus.label}
              </span>
            </div>

            <div style={{ marginBottom: 16, lineHeight: 1.8 }}>
              <strong>Gesamtbestand:</strong> {totalStock} |{" "}
              <strong>Verkäufe 12M:</strong> {totalSales12m} |{" "}
              <strong>Monat:</strong> {totalMonthly.toFixed(1)} |{" "}
              <strong>Reichweite:</strong> {totalCoverage.toFixed(1)} Monate |{" "}
              <strong>Bestellmenge gesamt:</strong> {totalOrder}
            </div>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "#fff",
              }}
            >
              <thead>
                <tr style={{ background: "#f3f4f6" }}>
                  <th style={th}>Artikelnummer</th>
                  <th style={th}>Variante</th>
                  <th style={th}>Bestand</th>
                  <th style={th}>Verkäufe 12M</th>
                  <th style={th}>Monat</th>
                  <th style={th}>Reichweite</th>
                  <th style={th}>Zielmonate</th>
                  <th style={th}>Bestellmenge</th>
                  <th style={th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {groupItems.map((item) => {
                  const monthly = getMonthlySales(item.sales12m);
                  const coverage = getCoverageMonths(item.stock, monthly);
                  const status = getStatus(coverage);
                  const orderQty = getOrderQty(item.stock, monthly, item.targetMonths);

                  return (
                    <tr key={item.articleNumber}>
                      <td style={td}>{item.articleNumber}</td>
                      <td style={td}>{item.variant}</td>
                      <td style={td}>
                        <input
                          type="number"
                          value={item.stock}
                          onChange={(e) =>
                            updateItem(item.articleNumber, "stock", e.target.value)
                          }
                          style={inputStyle}
                        />
                      </td>
                      <td style={td}>
                        <input
                          type="number"
                          value={item.sales12m}
                          onChange={(e) =>
                            updateItem(item.articleNumber, "sales12m", e.target.value)
                          }
                          style={inputStyle}
                        />
                      </td>
                      <td style={td}>{monthly.toFixed(1)}</td>
                      <td style={td}>{coverage === 999 ? "-" : coverage.toFixed(1)}</td>
                      <td style={td}>
                        <input
                          type="number"
                          value={item.targetMonths}
                          onChange={(e) =>
                            updateItem(item.articleNumber, "targetMonths", e.target.value)
                          }
                          style={inputStyle}
                        />
                      </td>
                      <td style={td}>
                        <strong>{orderQty}</strong>
                      </td>
                      <td style={td}>
                        <span
                          style={{
                            background: status.bg,
                            color: status.color,
                            padding: "4px 8px",
                            borderRadius: 999,
                            fontWeight: 700,
                            fontSize: 13,
                          }}
                        >
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </main>
  );
}

const th = {
  border: "1px solid #ddd",
  padding: "10px",
  textAlign: "left",
};

const td = {
  border: "1px solid #ddd",
  padding: "10px",
  verticalAlign: "middle",
};

const inputStyle = {
  width: "90px",
  padding: "6px 8px",
  fontSize: "14px",
};
