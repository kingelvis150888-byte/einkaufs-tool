"use client";

import { useState } from "react";

const data = [
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

  const today = new Date("2026-03-18");

  const suppliers = ["Alle", ...new Set(data.map((d) => d.supplier))];

  const filteredData =
    supplierFilter === "Alle"
      ? data
      : data.filter((d) => d.supplier === supplierFilter);

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
        Test für fixe Termine vs. freie Artikel.
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

      {Object.entries(groupData(overallItems)).map(([parent, items]) => (
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

          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
            <thead>
              <tr>
                <th style={th}>Artikelnummer</th>
                <th style={th}>Variante</th>
                <th style={th}>Fixer Termin</th>
                <th style={th}>Termin</th>
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
      ))}
    </main>
  );
}
