"use client";

import { useMemo, useState } from "react";

const baseData = [
  { supplier: "Jeremy", parent: "Anti Schling Napf Silikon", variant: "blaugrau", articleNumber: "04001604", stock: 0, sales: 671, monthsObserved: 12, hasFixedOrderDate: true, fixedOrderDate: "2026-06-01" },
  { supplier: "Jeremy", parent: "Anti Schling Napf Silikon", variant: "malve", articleNumber: "04001605", stock: 347, sales: 570, monthsObserved: 12, hasFixedOrderDate: true, fixedOrderDate: "2026-06-01" },
  { supplier: "Jeremy", parent: "Anti Schling Napf Silikon", variant: "salbeigrün", articleNumber: "04001606", stock: 571, sales: 878, monthsObserved: 12, hasFixedOrderDate: true, fixedOrderDate: "2026-06-01" },
  { supplier: "Jeremy", parent: "Anti Schling Napf Silikon", variant: "taupe", articleNumber: "04001872", stock: 574, sales: 444, monthsObserved: 12, hasFixedOrderDate: true, fixedOrderDate: "2026-06-01" },
  { supplier: "Jeremy", parent: "Anti Schling Napf Silikon", variant: "steingrau", articleNumber: "04001873", stock: 704, sales: 301, monthsObserved: 12, hasFixedOrderDate: true, fixedOrderDate: "2026-06-01" },
  { supplier: "Jeremy", parent: "Anti Schling Napf Silikon", variant: "cool lilac", articleNumber: "04001929", stock: 400, sales: 13, monthsObserved: 1, hasFixedOrderDate: true, fixedOrderDate: "2026-06-01" },
  { supplier: "Jeremy", parent: "Anti Schling Napf Silikon", variant: "steel blue", articleNumber: "04001930", stock: 671, sales: 30, monthsObserved: 1, hasFixedOrderDate: true, fixedOrderDate: "2026-06-01" },
  { supplier: "Jeremy", parent: "Anti Schling Napf Silikon", variant: "ruby", articleNumber: "04001931", stock: 325, sales: 39, monthsObserved: 1, hasFixedOrderDate: true, fixedOrderDate: "2026-06-01" },
  { supplier: "Jeremy", parent: "Anti Schling Napf Silikon", variant: "graphite grey", articleNumber: "04001932", stock: 537, sales: 28, monthsObserved: 1, hasFixedOrderDate: true, fixedOrderDate: "2026-06-01" },

  { supplier: "Jeremy", parent: "Napfunterlage Silikon", variant: "stone grey", articleNumber: "04001553", stock: 307, sales: 1001, monthsObserved: 12, hasFixedOrderDate: false, fixedOrderDate: "" },
  { supplier: "Jeremy", parent: "Napfunterlage Silikon", variant: "rose", articleNumber: "04001555", stock: 480, sales: 501, monthsObserved: 12, hasFixedOrderDate: false, fixedOrderDate: "" },
  { supplier: "Jeremy", parent: "Napfunterlage Silikon", variant: "steel blue", articleNumber: "04001556", stock: 174, sales: 389, monthsObserved: 12, hasFixedOrderDate: false, fixedOrderDate: "" },
  { supplier: "Jeremy", parent: "Napfunterlage Silikon", variant: "anthrazit", articleNumber: "04001563", stock: 652, sales: 723, monthsObserved: 12, hasFixedOrderDate: false, fixedOrderDate: "" },
  { supplier: "Jeremy", parent: "Napfunterlage Silikon", variant: "salbeigrün", articleNumber: "04001564", stock: 0, sales: 1344, monthsObserved: 12, hasFixedOrderDate: false, fixedOrderDate: "" },
  { supplier: "Jeremy", parent: "Napfunterlage Silikon", variant: "lilac", articleNumber: "04001884", stock: 463, sales: 108, monthsObserved: 12, hasFixedOrderDate: false, fixedOrderDate: "" },
];

function cleanCell(value) {
  return String(value || "").replace(/"/g, "").trim();
}

function normalizeHeader(value) {
  return cleanCell(value).toLowerCase();
}

function parseNumber(value) {
  if (!value) return 0;
  const cleaned = String(value)
    .replace(/"/g, "")
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^\d.-]/g, "");
  return Number(cleaned) || 0;
}

function parseDateText(text) {
  const match = String(text).match(/(\d{2})_(\d{2})_(\d{4})/);
  if (!match) return null;
  const day = match[1];
  const month = match[2];
  const year = match[3];
  return new Date(`${year}-${month}-${day}T00:00:00`);
}

function getDateRangeFromFilename(filename) {
  const matches = String(filename).match(/\d{2}_\d{2}_\d{4}/g);
  if (!matches || matches.length < 2) return null;

  const start = parseDateText(matches[0]);
  const end = parseDateText(matches[1]);

  if (!start || !end) return null;

  const days =
    Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

  return {
    start,
    end,
    days: days > 0 ? days : 30,
  };
}

function getCoverage(stock, monthlySales) {
  if (monthlySales <= 0) return 999;
  return stock / monthlySales;
}

function getStatus(item) {
  if (item.hasFixedOrderDate) {
    if (item.projectedStockAtArrival <= 0) {
      return { label: "Kritisch", bg: "#fee2e2", color: "#b91c1c" };
    }

    if (item.projectedStockAtArrival < item.monthlySales * 2) {
      return { label: "Warnung", bg: "#ffedd5", color: "#c2410c" };
    }
  } else {
    if (item.coverage < 1) {
      return { label: "Kritisch", bg: "#fee2e2", color: "#b91c1c" };
    }

    if (item.coverage < 3) {
      return { label: "Warnung", bg: "#ffedd5", color: "#c2410c" };
    }
  }

  if (item.coverage < 6) {
    return { label: "Achtung", bg: "#fef3c7", color: "#b45309" };
  }

  return { label: "OK", bg: "#dcfce7", color: "#166534" };
}

function groupData(items) {
  const grouped = {};
  for (const item of items) {
    if (!grouped[item.parent]) grouped[item.parent] = [];
    grouped[item.parent].push(item);
  }
  return grouped;
}

function badgeStyle(status) {
  return {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: 999,
    fontWeight: 700,
    background: status.bg,
    color: status.color,
    fontSize: 13,
  };
}

const th = {
  border: "1px solid #d1d5db",
  padding: 10,
  textAlign: "left",
  background: "#f3f4f6",
};

const td = {
  border: "1px solid #d1d5db",
  padding: 10,
};

const inputStyle = {
  padding: "8px 10px",
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  fontSize: 14,
  minWidth: 180,
};

export default function Home() {
  const [defaultOrderDate, setDefaultOrderDate] = useState("2026-06-01");
  const [targetMonths, setTargetMonths] = useState(12);
  const [safetyMonths, setSafetyMonths] = useState(2);
  const [productionMonths, setProductionMonths] = useState(2);
  const [shippingMonths, setShippingMonths] = useState(2);
  const [supplierFilter, setSupplierFilter] = useState("Alle");

  const [stockRows, setStockRows] = useState([]);
  const [salesRows, setSalesRows] = useState([]);
  const [salesInfo, setSalesInfo] = useState(null);
  const [error, setError] = useState("");

  const today = new Date("2026-03-18");
  const suppliers = ["Alle", ...new Set(baseData.map((d) => d.supplier))];

  function handleStockUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");

    const reader = new FileReader();

    reader.onload = (ev) => {
      const text = ev.target?.result;
      if (!text) {
        setError("Bestandsdatei konnte nicht gelesen werden.");
        return;
      }

      const rows = text
        .split(/\r?\n/)
        .map((row) => row.split(";"))
        .filter((row) => row.some((cell) => String(cell).trim() !== ""));

      const headers = rows[0].map(normalizeHeader);

      const idxArticle = headers.findIndex((h) => h === "artikelnummer");
      const idxHauptlager = headers.findIndex((h) => h === "hauptlager");
      const idxSpedpack = headers.findIndex((h) => h === "spedpack");
      const idxStock = headers.findIndex((h) => h === "summe lagerstand");

      if (idxArticle === -1 || idxStock === -1) {
        setError("Bestandsdatei: Artikelnummer oder Summe Lagerstand wurde nicht gefunden.");
        return;
      }

      const parsed = rows.slice(1).map((row) => ({
        articleNumber: cleanCell(row[idxArticle]),
        stock: parseNumber(row[idxStock]),
        hauptlager: idxHauptlager >= 0 ? parseNumber(row[idxHauptlager]) : 0,
        spedpack: idxSpedpack >= 0 ? parseNumber(row[idxSpedpack]) : 0,
      }));

      setStockRows(parsed.filter((row) => row.articleNumber));
    };

    reader.readAsText(file, "utf-8");
  }

  function handleSalesUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");

    const range = getDateRangeFromFilename(file.name);
    const days = range ? range.days : 30;

    const reader = new FileReader();

    reader.onload = (ev) => {
      const text = ev.target?.result;
      if (!text) {
        setError("Sellerboard-Datei konnte nicht gelesen werden.");
        return;
      }

      const rows = text
        .split(/\r?\n/)
        .map((row) => row.split(";"))
        .filter((row) => row.some((cell) => String(cell).trim() !== ""));

      const parsed = rows.slice(1).map((row) => {
        const sku = cleanCell(row[2]);      // Spalte C
        const quantity = parseNumber(row[3]); // Spalte D
        const monthlySales = days > 0 ? (quantity / days) * 30 : quantity;

        return {
          articleNumber: sku,
          quantity,
          monthlySales,
        };
      });

      setSalesRows(parsed.filter((row) => row.articleNumber));
      setSalesInfo({
        filename: file.name,
        days,
        start: range ? range.start.toLocaleDateString("de-DE") : "-",
        end: range ? range.end.toLocaleDateString("de-DE") : "-",
      });
    };

    reader.readAsText(file, "utf-8");
  }

  const stockMap = useMemo(() => {
    const map = {};
    for (const row of stockRows) {
      map[row.articleNumber] = row;
    }
    return map;
  }, [stockRows]);

  const salesMap = useMemo(() => {
    const map = {};
    for (const row of salesRows) {
      map[row.articleNumber] = row;
    }
    return map;
  }, [salesRows]);

  const mergedBaseData = useMemo(() => {
    return baseData.map((item) => {
      const importedStock = stockMap[item.articleNumber];
      const importedSales = salesMap[item.articleNumber];

      const fallbackMonthlySales =
        item.monthsObserved > 0 ? item.sales / item.monthsObserved : 0;

      return {
        ...item,
        stock: importedStock ? importedStock.stock : item.stock,
        hauptlager: importedStock ? importedStock.hauptlager : null,
        spedpack: importedStock ? importedStock.spedpack : null,
        stockSource: importedStock ? "ERP CSV" : "Fixer Wert",

        monthlySales: importedSales ? importedSales.monthlySales : fallbackMonthlySales,
        salesRaw: importedSales ? importedSales.quantity : item.sales,
        salesSource: importedSales ? "Sellerboard CSV" : "Fixer Wert",
      };
    });
  }, [stockMap, salesMap]);

  const filteredData =
    supplierFilter === "Alle"
      ? mergedBaseData
      : mergedBaseData.filter((item) => item.supplier === supplierFilter);

  const overallItems = filteredData.map((item) => {
    const effectiveOrderDate =
      item.hasFixedOrderDate && item.fixedOrderDate
        ? item.fixedOrderDate
        : defaultOrderDate;

    const orderDateObj = new Date(effectiveOrderDate);

    const monthsUntilOrder = Math.max(
      0,
      (orderDateObj - today) / (1000 * 60 * 60 * 24) / 30.44
    );

    const monthsToArrival = monthsUntilOrder + productionMonths + shippingMonths;
    const projectedSalesUntilArrival = item.monthlySales * monthsToArrival;
    const projectedStockAtArrival = Math.max(0, item.stock - projectedSalesUntilArrival);
    const targetStock = item.monthlySales * (targetMonths + safetyMonths);
    const coverage = getCoverage(item.stock, item.monthlySales);

    const baseItem = {
      ...item,
      effectiveOrderDate,
      monthsUntilOrder,
      monthsToArrival,
      projectedSalesUntilArrival,
      projectedStockAtArrival,
      targetStock,
      coverage,
    };

    const status = getStatus(baseItem);
    const recommendedOrderQty = Math.max(0, targetStock - projectedStockAtArrival);

    return {
      ...baseItem,
      status,
      recommendedOrderQty,
    };
  });

  const grouped = groupData(overallItems);

  const overallStock = overallItems.reduce((sum, item) => sum + item.stock, 0);
  const overallMonthlySales = overallItems.reduce((sum, item) => sum + item.monthlySales, 0);
  const overallProjectedAtArrival = overallItems.reduce((sum, item) => sum + item.projectedStockAtArrival, 0);
  const overallTargetStock = overallItems.reduce((sum, item) => sum + item.targetStock, 0);
  const overallRecommendation = overallItems.reduce((sum, item) => sum + item.recommendedOrderQty, 0);

  return (
    <main style={{ padding: 24, fontFamily: "Arial, sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      <h1>Einkaufs-Tool</h1>
      <p style={{ color: "#475569" }}>
        Bestand aus ERP und Verkäufe aus Sellerboard werden automatisch übernommen.
      </p>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", background: "white", padding: 16, borderRadius: 12, marginBottom: 24 }}>
        <div>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Lieferant</div>
          <select value={supplierFilter} onChange={(e) => setSupplierFilter(e.target.value)} style={inputStyle}>
            {suppliers.map((supplier) => (
              <option key={supplier} value={supplier}>{supplier}</option>
            ))}
          </select>
        </div>

        <div>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Standard-Bestellstart</div>
          <input type="date" value={defaultOrderDate} onChange={(e) => setDefaultOrderDate(e.target.value)} style={inputStyle} />
        </div>

        <div>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Zielreichweite</div>
          <input type="number" value={targetMonths} onChange={(e) => setTargetMonths(Number(e.target.value))} style={inputStyle} />
        </div>

        <div>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Sicherheitsbestand</div>
          <input type="number" value={safetyMonths} onChange={(e) => setSafetyMonths(Number(e.target.value))} style={inputStyle} />
        </div>

        <div>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Produktion</div>
          <input type="number" value={productionMonths} onChange={(e) => setProductionMonths(Number(e.target.value))} style={inputStyle} />
        </div>

        <div>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Lieferzeit</div>
          <input type="number" value={shippingMonths} onChange={(e) => setShippingMonths(Number(e.target.value))} style={inputStyle} />
        </div>
      </div>

      <div style={{ background: "white", padding: 16, borderRadius: 12, marginBottom: 24 }}>
        <h3>Bestandsbericht ERP</h3>
        <input type="file" accept=".csv" onChange={handleStockUpload} />
      </div>

      <div style={{ background: "white", padding: 16, borderRadius: 12, marginBottom: 24 }}>
        <h3>Verkaufsbericht Sellerboard</h3>
        <input type="file" accept=".csv" onChange={handleSalesUpload} />

        {salesInfo && (
          <div style={{ marginTop: 12, color: "#475569" }}>
            <div><strong>Datei:</strong> {salesInfo.filename}</div>
            <div><strong>Zeitraum:</strong> {salesInfo.start} bis {salesInfo.end}</div>
            <div><strong>Tage erkannt:</strong> {salesInfo.days}</div>
          </div>
        )}
      </div>

      {error && (
        <div style={{ background: "#fee2e2", color: "#991b1b", padding: 12, borderRadius: 10, marginBottom: 20 }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", background: "white", padding: 16, borderRadius: 12, marginBottom: 24 }}>
        <div><strong>Gesamtbestand:</strong> {overallStock.toFixed(0)}</div>
        <div><strong>Monatsverkauf:</strong> {overallMonthlySales.toFixed(1)}</div>
        <div><strong>Rest bei Wareneingang:</strong> {overallProjectedAtArrival.toFixed(0)}</div>
        <div><strong>Zielbestand:</strong> {overallTargetStock.toFixed(0)}</div>
        <div><strong>Bestellvorschlag:</strong> {overallRecommendation.toFixed(0)}</div>
      </div>

      {Object.entries(grouped).map(([parent, items]) => {
        const totalStock = items.reduce((sum, item) => sum + item.stock, 0);
        const totalMonthlySales = items.reduce((sum, item) => sum + item.monthlySales, 0);
        const parentCoverage = getCoverage(totalStock, totalMonthlySales);
        const parentRecommendedOrderQty = items.reduce((sum, item) => sum + item.recommendedOrderQty, 0);

        const parentStatus =
          items.some((item) => item.status.label === "Kritisch")
            ? { label: "Kritisch", bg: "#fee2e2", color: "#b91c1c" }
            : items.some((item) => item.status.label === "Warnung")
            ? { label: "Warnung", bg: "#ffedd5", color: "#c2410c" }
            : items.some((item) => item.status.label === "Achtung")
            ? { label: "Achtung", bg: "#fef3c7", color: "#b45309" }
            : { label: "OK", bg: "#dcfce7", color: "#166534" };

        return (
          <details key={parent} open style={{ background: "white", padding: 16, borderRadius: 12, marginBottom: 24 }}>
            <summary style={{ cursor: "pointer", fontSize: 20, fontWeight: 700 }}>
              {parent}
            </summary>

            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginTop: 14, marginBottom: 16 }}>
              <div><strong>Bestand:</strong> {totalStock.toFixed(0)}</div>
              <div><strong>Monatsverkauf:</strong> {totalMonthlySales.toFixed(1)}</div>
              <div><strong>Reichweite:</strong> {parentCoverage.toFixed(1)} Monate</div>
              <div><strong>Bestellvorschlag:</strong> {parentRecommendedOrderQty.toFixed(0)}</div>
              <div><span style={badgeStyle(parentStatus)}>{parentStatus.label}</span></div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={th}>Artikelnummer</th>
                  <th style={th}>Variante</th>
                  <th style={th}>Bestand</th>
                  <th style={th}>Quelle Bestand</th>
                  <th style={th}>Verkäufe roh</th>
                  <th style={th}>Quelle Verkäufe</th>
                  <th style={th}>Monatsverkauf</th>
                  <th style={th}>Reichweite</th>
                  <th style={th}>Rest bei Wareneingang</th>
                  <th style={th}>Zielbestand</th>
                  <th style={th}>Bestellvorschlag</th>
                  <th style={th}>Status</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr key={item.articleNumber}>
                    <td style={td}>{item.articleNumber}</td>
                    <td style={td}>{item.variant}</td>
                    <td style={td}>{item.stock}</td>
                    <td style={td}>{item.stockSource}</td>
                    <td style={td}>{item.salesRaw.toFixed(1)}</td>
                    <td style={td}>{item.salesSource}</td>
                    <td style={td}>{item.monthlySales.toFixed(1)}</td>
                    <td style={td}>{item.coverage.toFixed(1)} Monate</td>
                    <td style={td}>{item.projectedStockAtArrival.toFixed(1)}</td>
                    <td style={td}>{item.targetStock.toFixed(1)}</td>
                    <td style={td}>{item.recommendedOrderQty.toFixed(1)}</td>
                    <td style={td}>
                      <span style={badgeStyle(item.status)}>{item.status.label}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        );
      })}
    </main>
  );
}
