"use client";

import { useMemo, useState } from "react";

function clean(v) {
  return String(v || "").replace(/"/g, "").trim();
}

function normalize(v) {
  return clean(v).toLowerCase().replace(/\./g, "").trim();
}

function num(v) {
  if (!v) return 0;
  return Number(String(v).replace(/[^\d.-]/g, "")) || 0;
}

function split(line) {
  return line.includes(";") ? line.split(";") : line.split(",");
}

function getRows(text) {
  return text
    .split(/\r?\n/)
    .map(split)
    .filter(r => r.some(c => clean(c) !== ""));
}

function getDays(filename) {
  const m = filename.match(/\d{2}_\d{2}_\d{4}/g);
  if (!m || m.length < 2) return 30;

  const d = (t) => {
    const [day, mon, year] = t.split("_");
    return new Date(`${year}-${mon}-${day}`);
  };

  const start = d(m[0]);
  const end = d(m[1]);

  return Math.floor((end - start) / (1000*60*60*24)) + 1;
}

export default function Home() {
  const [families, setFamilies] = useState([]);
  const [stockMap, setStockMap] = useState({});
  const [salesMap, setSalesMap] = useState({});
  const [error, setError] = useState("");

  // 👉 Stammdaten (JETZT ADD statt ersetzen)
  function handleArticles(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (ev) => {
      const rows = getRows(ev.target.result);

      const headers = rows[0].map(normalize);

      const idxNr = headers.findIndex(h => h.includes("artikel"));
      const idxName = headers.findIndex(h => h.includes("bezeichnung"));
      const idxType = headers.findIndex(h => h.includes("verkauf"));
      const idxAsin = headers.findIndex(h => h === "asin");

      const parsed = rows.slice(1).map(r => ({
        articleNumber: clean(r[idxNr]),
        asin: clean(r[idxAsin]),
        name: clean(r[idxName]),
        type: clean(r[idxType]),
      }));

      const parent = parsed.find(x => x.type.toLowerCase().includes("gesperrt"));
      const variants = parsed.filter(x => x.type.toLowerCase().includes("verkauf"));

      setFamilies(prev => [
        ...prev,
        {
          id: Date.now(),
          parent,
          articles: variants
        }
      ]);
    };

    reader.readAsText(file);
  }

  function handleStock(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (ev) => {
      const rows = getRows(ev.target.result);
      const headers = rows[0].map(normalize);

      const idxNr = headers.findIndex(h => h.includes("artikel"));
      const idxStock = headers.findIndex(h => h.includes("lager"));

      const map = {};
      rows.slice(1).forEach(r => {
        map[clean(r[idxNr])] = num(r[idxStock]);
      });

      setStockMap(map);
    };

    reader.readAsText(file);
  }

  function handleSales(e) {
    const file = e.target.files[0];
    if (!file) return;

    const days = getDays(file.name);

    const reader = new FileReader();

    reader.onload = (ev) => {
      const rows = getRows(ev.target.result);

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

  return (
    <main style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Einkaufs Tool</h1>

      <h3>1. Stammdaten</h3>
      <input type="file" onChange={handleArticles} />

      <h3>2. ERP</h3>
      <input type="file" onChange={handleStock} />

      <h3>3. Sellerboard</h3>
      <input type="file" onChange={handleSales} />

      {families.map(family => {
        const data = family.articles.map(a => {
          const stock = stockMap[a.articleNumber] || 0;
          const monthly = salesMap[a.asin] || 0;

          const order = Math.max(0, monthly * 7 - stock);

          return {
            ...a,
            stock,
            monthly,
            order
          };
        });

        return (
          <div key={family.id} style={{ marginTop: 40 }}>
            <h2>{family.parent?.name}</h2>

            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Artikel</th>
                  <th>Bestand</th>
                  <th>Monat</th>
                  <th>Bestellen</th>
                </tr>
              </thead>

              <tbody>
                {data.map(d => (
                  <tr key={d.articleNumber}>
                    <td>{d.name}</td>
                    <td>{d.stock}</td>
                    <td>{d.monthly.toFixed(1)}</td>
                    <td>{d.order.toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </main>
  );
}
