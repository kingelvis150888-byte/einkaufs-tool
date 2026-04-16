"use client";

import { useMemo, useState } from "react";

const baseData = [
  {
    supplier: "Jeremy",
    hasFixedOrderDate: true,
    fixedOrderDate: "2026-06-01",
    parent: "Anti Schling Napf Silikon",
    variant: "blaugrau",
    articleNumber: "04001604",
    stock: 0,
    sales: 671,
    monthsObserved: 12,
  },
  {
    supplier: "Jeremy",
    hasFixedOrderDate: true,
    fixedOrderDate: "2026-06-01",
    parent: "Anti Schling Napf Silikon",
    variant: "malve",
    articleNumber: "04001605",
    stock: 347,
    sales: 570,
    monthsObserved: 12,
  },
  {
    supplier: "Jeremy",
    hasFixedOrderDate: true,
    fixedOrderDate: "2026-06-01",
    parent: "Anti Schling Napf Silikon",
    variant: "salbeigrün",
    articleNumber: "04001606",
    stock: 571,
    sales: 878,
    monthsObserved: 12,
  },
  {
    supplier: "Jeremy",
    hasFixedOrderDate: true,
    fixedOrderDate: "2026-06-01",
    parent: "Anti Schling Napf Silikon",
    variant: "taupe",
    articleNumber: "04001872",
    stock: 574,
    sales: 444,
    monthsObserved: 12,
  },
  {
    supplier: "Jeremy",
    hasFixedOrderDate: true,
    fixedOrderDate: "2026-06-01",
    parent: "Anti Schling Napf Silikon",
    variant: "steingrau",
    articleNumber: "04001873",
    stock: 704,
    sales: 301,
    monthsObserved: 12,
  },
  {
    supplier: "Jeremy",
    hasFixedOrderDate: true,
    fixedOrderDate: "2026-06-01",
    parent: "Anti Schling Napf Silikon",
    variant: "cool lilac",
    articleNumber: "04001929",
    stock: 400,
    sales: 13,
    monthsObserved: 1,
  },
  {
    supplier: "Jeremy",
    hasFixedOrderDate: true,
    fixedOrderDate: "2026-06-01",
    parent: "Anti Schling Napf Silikon",
    variant: "steel blue",
    articleNumber: "04001930",
    stock: 671,
    sales: 30,
    monthsObserved: 1,
  },
  {
    supplier: "Jeremy",
    hasFixedOrderDate: true,
    fixedOrderDate: "2026-06-01",
    parent: "Anti Schling Napf Silikon",
    variant: "ruby",
    articleNumber: "04001931",
    stock: 325,
    sales: 39,
    monthsObserved: 1,
  },
  {
    supplier: "Jeremy",
    hasFixedOrderDate: true,
    fixedOrderDate: "2026-06-01",
    parent: "Anti Schling Napf Silikon",
    variant: "graphite grey",
    articleNumber: "04001932",
    stock: 537,
    sales: 28,
    monthsObserved: 1,
  },

  {
    supplier: "Jeremy",
    hasFixedOrderDate: false,
    fixedOrderDate: "",
    parent: "Napfunterlage Silikon",
    variant: "stone grey",
    articleNumber: "04001553",
    stock: 307,
    sales: 1001,
    monthsObserved: 12,
  },
  {
    supplier: "Jeremy",
    hasFixedOrderDate: false,
    fixedOrderDate: "",
    parent: "Napfunterlage Silikon",
    variant: "rose",
    articleNumber: "04001555",
    stock: 480,
    sales: 501,
    monthsObserved: 12,
  },
  {
    supplier: "Jeremy",
    hasFixedOrderDate: false,
    fixedOrderDate: "",
    parent: "Napfunterlage Silikon",
    variant: "steel blue",
    articleNumber: "04001556",
    stock: 174,
    sales: 389,
    monthsObserved: 12,
  },
  {
    supplier: "Jeremy",
    hasFixedOrderDate: false,
    fixedOrderDate: "",
    parent: "Napfunterlage Silikon",
    variant: "anthrazit",
    articleNumber: "04001563",
    stock: 652,
    sales: 723,
    monthsObserved: 12,
  },
  {
    supplier: "Jeremy",
    hasFixedOrderDate: false,
    fixedOrderDate: "",
    parent: "Napfunterlage Silikon",
    variant: "salbeigrün",
    articleNumber: "04001564",
    stock: 0,
    sales: 1344,
    monthsObserved: 12,
  },
  {
    supplier: "Jeremy",
    hasFixedOrderDate: false,
    fixedOrderDate: "",
    parent: "Napfunterlage Silikon",
    variant: "lilac",
    articleNumber: "04001884",
    stock: 463,
    sales: 108,
    monthsObserved: 12,
  },
];

function normalizeHeader(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/"/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanCell(value) {
  return String(value || "").replace(/"/g, "").trim();
}

function parseGermanNumber(value) {
  if (!value) return 0;

  const cleaned = String(value)
    .replace(/"/g, "")
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^\d.-]/g, "");

  const num = Number(cleaned);
  return Number.isNaN(num) ? 0 : num;
}

function getMonthlySales(sales, monthsObserved) {
  return monthsObserved > 0 ? sales / monthsObserved : 0;
}

function getCoverageMonths(stock, monthlySales) {
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

  if (item.coverage < 3) {
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
  padding: "10px",
  textAlign: "left",
  background: "#f3f4f6",
};

const td = {
  border: "1px solid #d1d5db",
  padding: "10px",
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

  const [rawRows, setRawRows] = useState([]);
  const [parsedRows, setParsedRows] = useState([]);
  const [error, setError] = useState("");

  const today = new Date("2026-03-18");

  const suppliers = ["Alle", ...new Set(baseData.map((d) => d.supplier))];

  const handleStockFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    setRawRows([]);
    setParsedRows([]);

    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result;
      if (!text) {
        setError("Datei konnte nicht gelesen werden.");
        return;
      }

      const rows = text
        .split(/\r?\n/)
        .map((row) => row.split(";"))
        .filter((row) => row.some((cell) => String(cell).trim() !== ""));

      if (rows.length < 2) {
        setError("Die CSV enthält zu wenig Daten.");
        return;
      }

      setRawRows(rows.slice(0, 10));

      const headers = rows[0].map((h) => normalizeHeader(h));

      const articleNumberIndex = headers.findIndex((h) => h === "artikelnummer");
      const articleIndex = headers.findIndex((h) => h === "artikel");
      const hauptlagerIndex = headers.findIndex((h) => h === "hauptlager");
      const spedpackIndex = headers.findIndex((h) => h === "spedpack");
      const summeLagerstandIndex = headers.findIndex((h) => h === "summe lagerstand");

      if (
        articleNumberIndex === -1 ||
        articleIndex === -1 ||
        hauptlagerIndex === -1 ||
        summeLagerstandIndex === -1
      ) {
        setError(
          "Nicht alle benötigten Spalten wurden gefunden. Benötigt: Artikelnummer, Artikel, Hauptlager, Summe Lagerstand."
        );
        return;
      }

      const parsed = rows.slice(1).map((row) => ({
        articleNumber: cleanCell(row[articleNumberIndex]),
        article: cleanCell(row[articleIndex]),
        hauptlager: parseGermanNumber(row[hauptlagerIndex]),
        spedpack: spedpackIndex >= 0 ? parseGermanNumber(row[spedpackIndex]) : 0,
        stock: parseGermanNumber(row[summeLagerstandIndex]),
      }));

      setParsedRows(parsed.filter((row) => row.articleNumber));
    };

    reader.readAsText(file, "utf-8");
  };

  const stockMap = useMemo(() => {
    const map = {};
    for (const row of parsedRows) {
      map[row.articleNumber] = row;
    }
    return map;
  }, [parsedRows]);

  const mergedBaseData = useMemo(() => {
    return baseData.map((item) => {
      const imported = stockMap[item.articleNumber];

      if (!imported) {
        return {
          ...item,
          stockSource: "Fixer Wert",
          hauptlager: null,
          spedpack: null,
        };
      }

      return {
        ...item,
        stock: imported.stock,
        hauptlager: imported.hauptlager,
        spedpack: imported.spedpack,
        stockSource: "CSV",
      };
    });
  }, [stockMap]);

  const filteredData =
    supplierFilter === "Alle"
      ? mergedBaseData
      : mergedBaseData.filter((d) => d.supplier === supplierFilter);

  const grouped = groupData(filteredData);

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
    const monthlySales = getMonthlySales(item.sales, item.monthsObserved);
    const projectedSalesUntilArrival = monthlySales * monthsToArrival;
    const projectedStockAtArrival = Math.max(0, item.stock - projectedSalesUntilArrival);
    const targetStock = monthlySales * (targetMonths + safetyMonths);
    const coverage = getCoverageMonths(item.stock, monthlySales);

    const baseItem = {
      ...item,
      effectiveOrderDate,
      monthsUntilOrder,
      monthsToArrival,
      monthlySales,
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

  const overallMonthlySales = overallItems.reduce((sum, item) => sum + item.monthlySales, 0);
  const overallStock = overallItems.reduce((sum, item) => sum + item.stock, 0);
  const overallProjectedAtArrival = overallItems.reduce(
    (sum, item) => sum + item.projectedStockAtArrival,
    0
  );
  const overallTargetStock = overallItems.reduce((sum, item) => sum + item.targetStock, 0);
  const overallRecommendation = overallItems.reduce(
    (sum, item) => sum + item.recommendedOrderQty,
    0
  );

  return (
    <main
      style={{
        padding: 24,
        fontFamily: "Arial, sans-serif",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ marginBottom: 8 }}>Einkaufs-Tool</h1>
      <p style={{ marginBottom: 24, color: "#475569" }}>
        CSV-Bestände werden über Artikelnummer automatisch in die Einkaufsplanung übernommen.
      </p>

      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          alignItems: "end",
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
        }}
      >
        <div>
          <div style={{ marginBottom: 6, fontWeight: 700 }}>Lieferant</div>
          <select
            value={supplierFilter}
            onChange={(e) => setSupplierFilter(e.target.value)}
            style={inputStyle}
          >
            {suppliers.map((supplier) => (
              <option key={supplier} value={supplier}>
                {supplier}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div style={{ marginBottom: 6, fontWeight: 700 }}>Standard-Bestellstart</div>
          <input
            type="date"
            value={defaultOrderDate}
            onChange={(e) => setDefaultOrderDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <div style={{ marginBottom: 6, fontWeight: 700 }}>Zielreichweite</div>
          <input
            type="number"
            min="1"
            value={targetMonths}
            onChange={(e) => setTargetMonths(Number(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div>
          <div style={{ marginBottom: 6, fontWeight: 700 }}>Sicherheitsbestand</div>
          <input
            type="number"
            min="0"
            value={safetyMonths}
            onChange={(e) => setSafetyMonths(Number(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div>
          <div style={{ marginBottom: 6, fontWeight: 700 }}>Produktion</div>
          <input
            type="number"
            min="0"
            value={productionMonths}
            onChange={(e) => setProductionMonths(Number(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div>
          <div style={{ marginBottom: 6, fontWeight: 700 }}>Lieferzeit</div>
          <input
            type="number"
            min="0"
            value={shippingMonths}
            onChange={(e) => setShippingMonths(Number(e.target.value))}
            style={inputStyle}
          />
        </div>
      </div>

      <div
        style={{
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
        }}
      >
        <h3 style={{ marginBottom: 12 }}>Bestandsbericht (ERP) hochladen</h3>
        <input type="file" accept=".csv" onChange={handleStockFileUpload} />
      </div>

      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: 12,
            borderRadius: 10,
            marginBottom: 20,
            border: "1px solid #fecaca",
          }}
        >
          {error}
        </div>
      )}

      {parsedRows.length > 0 && (
        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 16,
            marginBottom: 24,
          }}
        >
          <div style={{ marginBottom: 12 }}>
            <strong>Importierte Bestandszeilen:</strong> {parsedRows.length}
          </div>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={th}>Artikelnummer</th>
                <th style={th}>Artikel</th>
                <th style={th}>Hauptlager</th>
                <th style={th}>Spedpack</th>
                <th style={th}>Summe Lagerstand</th>
              </tr>
            </thead>
            <tbody>
              {parsedRows.slice(0, 20).map((row, i) => (
                <tr key={i}>
                  <td style={td}>{row.articleNumber}</td>
                  <td style={td}>{row.article}</td>
                  <td style={td}>{row.hauptlager}</td>
                  <td style={td}>{row.spedpack}</td>
                  <td style={td}>{row.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
        }}
      >
        <div><strong>Auswahl:</strong> {supplierFilter}</div>
        <div><strong>Gesamtbestand:</strong> {overallStock.toFixed(0)}</div>
        <div><strong>Monatsverkauf:</strong> {overallMonthlySales.toFixed(1)}</div>
        <div><strong>Rest bei Wareneingang:</strong> {overallProjectedAtArrival.toFixed(0)}</div>
        <div><strong>Zielbestand:</strong> {overallTargetStock.toFixed(0)}</div>
        <div><strong>Bestellvorschlag:</strong> {overallRecommendation.toFixed(0)}</div>
      </div>

      {Object.entries(groupData(overallItems)).map(([parent, items]) => {
        const totalStock = items.reduce((sum, item) => sum + item.stock, 0);
        const totalSales = items.reduce((sum, item) => sum + item.sales, 0);
        const totalMonthlySales = items.reduce((sum, item) => sum + item.monthlySales, 0);
        const parentCoverage = getCoverageMonths(totalStock, totalMonthlySales);
        const parentProjectedStockAtArrival = items.reduce(
          (sum, item) => sum + item.projectedStockAtArrival,
          0
        );
        const parentTargetStock = items.reduce((sum, item) => sum + item.targetStock, 0);
        const parentRecommendedOrderQty = items.reduce(
          (sum, item) => sum + item.recommendedOrderQty,
          0
        );

        const parentStatus =
          items.some((item) => item.projectedStockAtArrival <= 0)
            ? { label: "Kritisch", bg: "#fee2e2", color: "#b91c1c" }
            : items.some((item) => item.projectedStockAtArrival < item.monthlySales * 2)
            ? { label: "Warnung", bg: "#ffedd5", color: "#c2410c" }
            : items.some((item) => item.coverage < 3)
            ? { label: "Achtung", bg: "#fef3c7", color: "#b45309" }
            : { label: "OK", bg: "#dcfce7", color: "#166534" };

        return (
          <details
            key={parent}
            open
            style={{
              marginBottom: 24,
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <summary style={{ cursor: "pointer", fontSize: 20, fontWeight: 700 }}>
              {parent}
            </summary>

            <div
              style={{
                display: "flex",
                gap: 20,
                flexWrap: "wrap",
                marginTop: 14,
                marginBottom: 16,
              }}
            >
              <div><strong>Lieferant:</strong> {items[0].supplier}</div>
              <div><strong>Gesamtbestand:</strong> {totalStock.toFixed(0)}</div>
              <div><strong>Verkäufe:</strong> {totalSales.toFixed(0)}</div>
              <div><strong>Monatsverkauf:</strong> {totalMonthlySales.toFixed(1)}</div>
              <div><strong>Reichweite:</strong> {parentCoverage.toFixed(1)} Monate</div>
              <div><strong>Rest bei Wareneingang:</strong> {parentProjectedStockAtArrival.toFixed(0)}</div>
              <div><strong>Zielbestand:</strong> {parentTargetStock.toFixed(0)}</div>
              <div><strong>Bestellvorschlag:</strong> {parentRecommendedOrderQty.toFixed(0)}</div>
              <div><span style={badgeStyle(parentStatus)}>{parentStatus.label}</span></div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
              <thead>
                <tr>
                  <th style={th}>Artikelnummer</th>
                  <th style={th}>Variante</th>
                  <th style={th}>Fixer Termin</th>
                  <th style={th}>Termin</th>
                  <th style={th}>Bestand</th>
                  <th style={th}>Quelle</th>
                  <th style={th}>Hauptlager</th>
                  <th style={th}>Spedpack</th>
                  <th style={th}>Monat</th>
                  <th style={th}>Reichweite</th>
                  <th style={th}>Rest bei Wareneingang</th>
                  <th style={th}>Bestellvorschlag</th>
                  <th style={th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.articleNumber}>
                    <td style={td}>{item.articleNumber}</td>
                    <td style={td}>{item.variant}</td>
                    <td style={td}>{item.hasFixedOrderDate ? "Ja" : "Nein"}</td>
                    <td style={td}>{item.effectiveOrderDate}</td>
                    <td style={td}>{item.stock}</td>
                    <td style={td}>{item.stockSource}</td>
                    <td style={td}>{item.hauptlager ?? "-"}</td>
                    <td style={td}>{item.spedpack ?? "-"}</td>
                    <td style={td}>{item.monthlySales.toFixed(1)}</td>
                    <td style={td}>{item.coverage.toFixed(1)} Monate</td>
                    <td style={td}>{item.projectedStockAtArrival.toFixed(1)}</td>
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

      {rawRows.length > 0 && (
        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 16,
            marginTop: 24,
          }}
        >
          <h3 style={{ marginBottom: 12 }}>Rohansicht der CSV (erste 10 Zeilen)</h3>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <tbody>
              {rawRows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      style={{
                        border: "1px solid #d1d5db",
                        padding: 6,
                        fontSize: 13,
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
