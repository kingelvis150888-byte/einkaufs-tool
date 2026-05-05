"use client";

import { useMemo, useState } from "react";

function clean(v) {
  return String(v || "").replace(/"/g, "").trim();
}

function num(v) {
  return Number(String(v).replace(/[^\d.-]/g, "")) || 0;
}

function parseDate(text) {
  const m = String(text).match(/(\d{2})_(\d{2})_(\d{4})/g);
  if (!m || m.length < 2) return 30;

  const toDate = (t) => {
    const [d, m, y] = t.split("_");
    return new Date(`${y}-${m}-${d}`);
  };

  const start = toDate(m[0]);
  const end = toDate(m[1]);

  return Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
}

function getCoverage(stock, monthly) {
  if (monthly <= 0) return 999;
  return stock / monthly;
}

function getStatus(item) {
  if (item.projectedStockAtArrival <= 0) {
    return "Kritisch";
  }
  if (item.projectedStockAtArrival < item.monthlySales * 2) {
    return "Warnung";
  }
  if (item.coverage < 3) {
    return "Achtung";
  }
  return "OK";
}

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [parent, setParent] = useState(null);
  const [stockMap, setStockMap] = useState({});
  const [salesMap, setSalesMap] = useState({});
  const [error, setError] = useState("");

  const [targetMonths, setTargetMonths] = useState(6);
  const [safetyMonths, setSafetyMonths] = useState(1);

  const today = new Date();

  // 📦 Stammdaten
  function handleArticles(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (ev) => {
    const rows = ev.target.result
      .split(/\r?\n/)
      .map(r => r.includes(";") ? r.split(";") : r.split(","))
      .filter(r => r.some(c => String(c).trim() !== ""));

    const headers = rows[0].map(h => clean(h).toLowerCase());

    const idxNr = headers.findIndex(h => h.includes("artikel"));
    const idxName = headers.findIndex(h => h.includes("bezeichnung"));
    const idxType = headers.findIndex(h => h.includes("verkauf"));
    const idxAsin = headers.findIndex(h => h === "asin");

    if (idxNr === -1 || idxAsin === -1 || idxType === -1) {
      setError("Stammdaten: Spalten nicht erkannt (Artikelnummer, ASIN oder Verkaufstyp fehlt)");
      return;
    }

    const parsed = rows.slice(1).map(r => ({
      articleNumber: clean(r[idxNr]),
      asin: clean(r[idxAsin]),
      name: clean(r[idxName]),
      type: clean(r[idxType]),
    }));

    const parentItem = parsed.find(x => x.type.toLowerCase().includes("gesperrt"));
    const variants = parsed.filter(x => x.type.toLowerCase().includes("verkauf"));

    setParent(parentItem || null);
    setArticles(variants);
  };

  reader.readAsText(file, "utf-8");
}

  // 📦 ERP
  function handleStock(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (ev) => {
      const rows = ev.target.result.split("\n").map(r => r.split(";"));

      const headers = rows[0].map(h => clean(h).toLowerCase());

      const idxNr = headers.findIndex(h => h === "artikelnummer");
      const idxStock = headers.findIndex(h => h.includes("lager"));

      const map = {};

      rows.slice(1).forEach(r => {
        const nr = clean(r[idxNr]);
        map[nr] = num(r[idxStock]);
      });

      setStockMap(map);
    };

    reader.readAsText(file);
  }

  // 📦 Sellerboard
  function handleSales(e) {
    const file = e.target.files[0];
    if (!file) return;

    const days = parseDate(file.name);

    const reader = new FileReader();

    reader.onload = (ev) => {
      const rows = ev.target.result.split("\n").map(r => r.split(";"));

      const map = {};

      rows.slice(1).forEach(r => {
        const asin = clean(r[1]);
        const qty = num(r[3]);

        map[asin] = (qty / days) * 30;
      });

      setSalesMap(map);
    };

    reader.readAsText(file);
  }

  const data = useMemo(() => {
    return articles.map(a => {
      const stock = stockMap[a.articleNumber] || 0;
      const monthlySales = salesMap[a.asin] || 0;

      const coverage = getCoverage(stock, monthlySales);

      const projectedStockAtArrival = stock - monthlySales * 3;

      const targetStock = monthlySales * (targetMonths + safetyMonths);

      const order = Math.max(0, targetStock - projectedStockAtArrival);

      return {
        ...a,
        stock,
        monthlySales,
        coverage,
        projectedStockAtArrival,
        targetStock,
        order,
        status: getStatus({
          projectedStockAtArrival,
          monthlySales,
          coverage
        })
      };
    });
  }, [articles, stockMap, salesMap, targetMonths, safetyMonths]);

  return (
    <main style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Einkaufs Tool</h1>

      <h3>1. Stammdaten</h3>
      <input type="file" onChange={handleArticles} />

      <h3>2. ERP Bestand</h3>
      <input type="file" onChange={handleStock} />

      <h3>3. Sellerboard Verkäufe</h3>
      <input type="file" onChange={handleSales} />

      {parent && <h2>{parent.name}</h2>}

      <table style={{ width: "100%", marginTop: 20 }}>
        <thead>
          <tr>
            <th>Artikel</th>
            <th>Bestand</th>
            <th>Monat</th>
            <th>Reichweite</th>
            <th>Rest</th>
            <th>Ziel</th>
            <th>Bestellen</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map(d => (
            <tr key={d.articleNumber}>
              <td>{d.name}</td>
              <td>{d.stock}</td>
              <td>{d.monthlySales.toFixed(1)}</td>
              <td>{d.coverage.toFixed(1)}</td>
              <td>{d.projectedStockAtArrival.toFixed(1)}</td>
              <td>{d.targetStock.toFixed(0)}</td>
              <td>{d.order.toFixed(0)}</td>
              <td>{d.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
