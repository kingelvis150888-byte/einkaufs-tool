"use client";

import { useMemo, useState } from "react";

const baseData = [
  {
    supplier: "Jeremy",
    parent: "Anti Schling Napf Silikon",
    variant: "blaugrau",
    articleNumber: "04001604",
    stock: 0,
    sales: 671,
    monthsObserved: 12,
  },
  {
    supplier: "Jeremy",
    parent: "Napfunterlage Silikon",
    variant: "stone grey",
    articleNumber: "04001553",
    stock: 307,
    sales: 1001,
    monthsObserved: 12,
  },
];

function normalizeHeader(v) {
  return String(v || "").toLowerCase().replace(/"/g, "").trim();
}

function cleanCell(v) {
  return String(v || "").replace(/"/g, "").trim();
}

function parseNumber(v) {
  if (!v) return 0;
  return Number(String(v).replace(/[^\d.-]/g, "")) || 0;
}

export default function Home() {
  const [stockRows, setStockRows] = useState([]);
  const [salesRows, setSalesRows] = useState([]);
  const [salesDays, setSalesDays] = useState(30);

  // ERP
  const handleStockUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (ev) => {
      const rows = ev.target.result.split("\n").map(r => r.split(";"));
      const headers = rows[0].map(normalizeHeader);

      const idxSku = headers.findIndex(h => h === "artikelnummer");
      const idxStock = headers.findIndex(h => h === "summe lagerstand");

      const parsed = rows.slice(1).map(r => ({
        articleNumber: cleanCell(r[idxSku]),
        stock: parseNumber(r[idxStock])
      }));

      setStockRows(parsed);
    };

    reader.readAsText(file);
  };

  // AMAZON
  const handleSalesUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (ev) => {
      const rows = ev.target.result.split("\n").map(r => r.split(";"));
      const headers = rows[0].map(normalizeHeader);

      const idxSku = headers.findIndex(h => h === "sku");
      const idxUnits = headers.findIndex(h => h.includes("bestellte"));

      const parsed = rows.slice(1).map(r => ({
        articleNumber: cleanCell(r[idxSku]),
        units: parseNumber(r[idxUnits])
      }));

      setSalesRows(parsed);
    };

    reader.readAsText(file);
  };

  const stockMap = useMemo(() => {
    const m = {};
    stockRows.forEach(r => m[r.articleNumber] = r.stock);
    return m;
  }, [stockRows]);

  const salesMap = useMemo(() => {
    const m = {};
    salesRows.forEach(r => {
      const monthly = (r.units / salesDays) * 30;
      m[r.articleNumber] = monthly;
    });
    return m;
  }, [salesRows, salesDays]);

  const merged = baseData.map(item => ({
    ...item,
    stock: stockMap[item.articleNumber] ?? item.stock,
    monthlySales: salesMap[item.articleNumber] ?? item.sales / item.monthsObserved
  }));

  return (
    <main style={{ padding: 24, fontFamily: "Arial" }}>
      <h1>Einkaufs Tool</h1>

      <div style={{ marginBottom: 20 }}>
        <h3>Bestand (ERP)</h3>
        <input type="file" onChange={handleStockUpload} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <h3>Verkäufe (Amazon Business Report)</h3>
        <input type="file" onChange={handleSalesUpload} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>Zeitraum Verkäufe (Tage): </label>
        <input
          type="number"
          value={salesDays}
          onChange={(e) => setSalesDays(Number(e.target.value))}
        />
      </div>

      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={th}>Artikelnummer</th>
            <th style={th}>Bestand</th>
            <th style={th}>Monatsverkauf</th>
          </tr>
        </thead>
        <tbody>
          {merged.map(item => (
            <tr key={item.articleNumber}>
              <td style={td}>{item.articleNumber}</td>
              <td style={td}>{item.stock}</td>
              <td style={td}>{item.monthlySales.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

const th = {
  border: "1px solid #ccc",
  padding: 8,
  background: "#eee"
};

const td = {
  border: "1px solid #ccc",
  padding: 8
};
