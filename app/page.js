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
  const cleaned = String(v)
    .replace(/"/g, "")
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^\d.-]/g, "");
  return Number(cleaned) || 0;
}

function splitCsvLine(line) {
  return line.includes(";") ? line.split(";") : line.split(",");
}

function getRows(text) {
  return text
    .split(/\r?\n/)
    .map(splitCsvLine)
    .filter((row) => row.some((cell) => clean(cell) !== ""));
}

function getDaysFromFilename(filename) {
  const matches = String(filename).match(/\d{2}_\d{2}_\d{4}/g);
  if (!matches || matches.length < 2) return 30;

  const toDate = (s) => {
    const [d, m, y] = s.split("_");
    return new Date(`${y}-${m}-${d}T00:00:00`);
  };

  const start = toDate(matches[0]);
  const end = toDate(matches[1]);
  const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

  return days > 0 ? days : 30;
}

function getCoverage(stock, monthlySales) {
  if (monthlySales <= 0) return 999;
  return stock / monthlySales;
}

function getStatus(item) {
  if (item.projectedStockAtArrival <= 0) return "Kritisch";
  if (item.projectedStockAtArrival < item.monthlySales * 2) return "Warnung";
  if (item.coverage < 3) return "Achtung";
  return "OK";
}

function statusStyle(status) {
  if (status === "Kritisch") return { background: "#fee2e2", color: "#b91c1c" };
  if (status === "Warnung") return { background: "#ffedd5", color: "#c2410c" };
  if (status === "Achtung") return { background: "#fef3c7", color: "#b45309" };
  return { background: "#dcfce7", color: "#166534" };
}

const th = {
  border: "1px solid #d1d5db",
  padding: 10,
  background: "#f3f4f6",
  textAlign: "left",
};

const td = {
  border: "1px solid #d1d5db",
  padding: 10,
};

export default function Home() {
  const [parent, setParent] = useState(null);
  const [articles, setArticles] = useState([]);
  const [stockMap, setStockMap] = useState({});
  const [salesMap, setSalesMap] = useState({});
  const [salesDays, setSalesDays] = useState(30);
  const [error, setError] = useState("");

  const [targetMonths, setTargetMonths] = useState(6);
  const [safetyMonths, setSafetyMonths] = useState(1);
  const [productionMonths, setProductionMonths] = useState(2);
  const [shippingMonths, setShippingMonths] = useState(2);

  function handleArticlesUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    const reader = new FileReader();

    reader.onload = (ev) => {
      const text = ev.target?.result;
      const rows = getRows(text);

      if (rows.length < 2) {
        setError("Stammdaten-Datei enthält zu wenig Daten.");
        return;
      }

      const headers = rows[0].map(normalize);

      const idxArticle = headers.findIndex(
        (h) => h.includes("artikelnr") || h.includes("artikelnummer")
      );
      const idxName = headers.findIndex((h) => h.includes("bezeichnung"));
      const idxType = headers.findIndex((h) => h.includes("verkaufstyp"));
      const idxAsin = headers.findIndex((h) => h === "asin");

      if (idxArticle === -1 || idxName === -1 || idxType === -1 || idxAsin === -1) {
        setError(
          "Stammdaten: Benötigt werden Artikelnr., Bezeichnung, Verkaufstyp und ASIN."
        );
        return;
      }

      const parsed = rows.slice(1).map((row) => ({
        articleNumber: clean(row[idxArticle]),
        name: clean(row[idxName]),
        type: clean(row[idxType]),
        asin: clean(row[idxAsin]),
      }));

      const foundParent = parsed.find((item) =>
        item.type.toLowerCase().includes("gesperrt")
      );

      const variants = parsed.filter((item) =>
        item.type.toLowerCase().includes("verkauf")
      );

      setParent(foundParent || null);
      setArticles(variants);
    };

    reader.readAsText(file, "utf-8");
  }

  function handleStockUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    const reader = new FileReader();

    reader.onload = (ev) => {
      const rows = getRows(ev.target?.result);

      if (rows.length < 2) {
        setError("ERP-Datei enthält zu wenig Daten.");
        return;
      }

      const headers = rows[0].map(normalize);

      const idxArticle = headers.findIndex(
        (h) => h.includes("artikelnr") || h.includes("artikelnummer")
      );

      const idxStock = headers.findIndex(
        (h) => h.includes("summe") && h.includes("lager")
      );

      if (idxArticle === -1 || idxStock === -1) {
        setError("ERP: Artikelnummer oder Summe Lagerstand wurde nicht gefunden.");
        return;
      }

      const map = {};

      rows.slice(1).forEach((row) => {
        const articleNumber = clean(row[idxArticle]);
        if (articleNumber) {
          map[articleNumber] = num(row[idxStock]);
        }
      });

      setStockMap(map);
    };

    reader.readAsText(file, "utf-8");
  }

  function handleSalesUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    const days = getDaysFromFilename(file.name);
    setSalesDays(days);

    const reader = new FileReader();

    reader.onload = (ev) => {
      const rows = getRows(ev.target?.result);
      const map = {};

      rows.slice(1).forEach((row) => {
        const asin = clean(row[1]); // Spalte B
        const quantity = num(row[3]); // Spalte D

        if (asin) {
          map[asin] = {
            quantity,
            monthlySales: days > 0 ? (quantity / days) * 30 : quantity,
          };
        }
      });

      setSalesMap(map);
    };

    reader.readAsText(file, "utf-8");
  }

  const data = useMemo(() => {
    return articles.map((article) => {
      const stock = stockMap[article.articleNumber] ?? 0;
      const sales = salesMap[article.asin];

      const monthlySales = sales?.monthlySales ?? 0;
      const rawSales = sales?.quantity ?? 0;

      const monthsToArrival = productionMonths + shippingMonths;
      const projectedStockAtArrival = Math.max(
        0,
        stock - monthlySales * monthsToArrival
      );

      const targetStock = monthlySales * (targetMonths + safetyMonths);
      const recommendedOrderQty = Math.max(0, targetStock - projectedStockAtArrival);
      const coverage = getCoverage(stock, monthlySales);

      const item = {
        ...article,
        stock,
        rawSales,
        monthlySales,
        coverage,
        projectedStockAtArrival,
        targetStock,
        recommendedOrderQty,
      };

      return {
        ...item,
        status: getStatus(item),
      };
    });
  }, [
    articles,
    stockMap,
    salesMap,
    targetMonths,
    safetyMonths,
    productionMonths,
    shippingMonths,
  ]);

  const totalStock = data.reduce((sum, item) => sum + item.stock, 0);
  const totalMonthlySales = data.reduce((sum, item) => sum + item.monthlySales, 0);
  const totalOrder = data.reduce((sum, item) => sum + item.recommendedOrderQty, 0);

  return (
    <main style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
      <h1>Einkaufs-Tool</h1>

      <div style={{ marginBottom: 20 }}>
        <h3>1. Stammdaten CSV</h3>
        <input type="file" accept=".csv" onChange={handleArticlesUpload} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <h3>2. ERP Bestand CSV</h3>
        <input type="file" accept=".csv" onChange={handleStockUpload} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <h3>3. Sellerboard Verkäufe CSV</h3>
        <input type="file" accept=".csv" onChange={handleSalesUpload} />
        <div style={{ marginTop: 6 }}>Erkannte Verkaufstage: {salesDays}</div>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
        <label>
          Zielreichweite:
          <input
            type="number"
            value={targetMonths}
            onChange={(e) => setTargetMonths(Number(e.target.value))}
            style={{ marginLeft: 8 }}
          />
        </label>

        <label>
          Sicherheit:
          <input
            type="number"
            value={safetyMonths}
            onChange={(e) => setSafetyMonths(Number(e.target.value))}
            style={{ marginLeft: 8 }}
          />
        </label>

        <label>
          Produktion:
          <input
            type="number"
            value={productionMonths}
            onChange={(e) => setProductionMonths(Number(e.target.value))}
            style={{ marginLeft: 8 }}
          />
        </label>

        <label>
          Lieferzeit:
          <input
            type="number"
            value={shippingMonths}
            onChange={(e) => setShippingMonths(Number(e.target.value))}
            style={{ marginLeft: 8 }}
          />
        </label>
      </div>

      {error && (
        <div style={{ background: "#fee2e2", padding: 12, color: "#991b1b" }}>
          {error}
        </div>
      )}

      {parent && <h2>{parent.name}</h2>}

      <div style={{ marginBottom: 16 }}>
        <strong>Artikel:</strong> {data.length} |{" "}
        <strong>Gesamtbestand:</strong> {totalStock.toFixed(0)} |{" "}
        <strong>Monatsverkauf:</strong> {totalMonthlySales.toFixed(1)} |{" "}
        <strong>Bestellvorschlag:</strong> {totalOrder.toFixed(0)}
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={th}>Artikelnummer</th>
            <th style={th}>ASIN</th>
            <th style={th}>Bezeichnung</th>
            <th style={th}>Bestand</th>
            <th style={th}>Verkäufe roh</th>
            <th style={th}>Monatsverkauf</th>
            <th style={th}>Reichweite</th>
            <th style={th}>Rest bei Wareneingang</th>
            <th style={th}>Zielbestand</th>
            <th style={th}>Bestellvorschlag</th>
            <th style={th}>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.articleNumber}>
              <td style={td}>{item.articleNumber}</td>
              <td style={td}>{item.asin}</td>
              <td style={td}>{item.name}</td>
              <td style={td}>{item.stock}</td>
              <td style={td}>{item.rawSales}</td>
              <td style={td}>{item.monthlySales.toFixed(1)}</td>
              <td style={td}>{item.coverage.toFixed(1)} Monate</td>
              <td style={td}>{item.projectedStockAtArrival.toFixed(1)}</td>
              <td style={td}>{item.targetStock.toFixed(1)}</td>
              <td style={td}>{item.recommendedOrderQty.toFixed(1)}</td>
              <td style={td}>
                <span
                  style={{
                    ...statusStyle(item.status),
                    padding: "4px 10px",
                    borderRadius: 999,
                    fontWeight: 700,
                  }}
                >
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
