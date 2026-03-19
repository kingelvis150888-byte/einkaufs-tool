"use client";

import { useState } from "react";

const data = [
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
    parent: "Anti Schling Napf Silikon",
    variant: "malve",
    articleNumber: "04001605",
    stock: 347,
    sales: 570,
    monthsObserved: 12,
  },
  {
    supplier: "Jeremy",
    parent: "Anti Schling Napf Silikon",
    variant: "salbeigrün",
    articleNumber: "04001606",
    stock: 571,
    sales: 878,
    monthsObserved: 12,
  },
  {
    supplier: "Jeremy",
    parent: "Anti Schling Napf Silikon",
    variant: "taupe",
    articleNumber: "04001872",
    stock: 574,
    sales: 444,
    monthsObserved: 12,
  },
  {
    supplier: "Jeremy",
    parent: "Anti Schling Napf Silikon",
    variant: "steingrau",
    articleNumber: "04001873",
    stock: 704,
    sales: 301,
    monthsObserved: 12,
  },
  {
    supplier: "Jeremy",
    parent: "Anti Schling Napf Silikon",
    variant: "cool lilac",
    articleNumber: "04001929",
    stock: 400,
    sales: 13,
    monthsObserved: 1,
  },
  {
    supplier: "Jeremy",
    parent: "Anti Schling Napf Silikon",
    variant: "steel blue",
    articleNumber: "04001930",
    stock: 671,
    sales: 30,
    monthsObserved: 1,
  },
  {
    supplier: "Jeremy",
    parent: "Anti Schling Napf Silikon",
    variant: "ruby",
    articleNumber: "04001931",
    stock: 325,
    sales: 39,
    monthsObserved: 1,
  },
  {
    supplier: "Jeremy",
    parent: "Anti Schling Napf Silikon",
    variant: "graphite grey",
    articleNumber: "04001932",
    stock: 537,
    sales: 28,
    monthsObserved: 1,
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
  {
    supplier: "Jeremy",
    parent: "Napfunterlage Silikon",
    variant: "rose",
    articleNumber: "04001555",
    stock: 480,
    sales: 501,
    monthsObserved: 12,
  },
  {
    supplier: "Jeremy",
    parent: "Napfunterlage Silikon",
    variant: "steel blue",
    articleNumber: "04001556",
    stock: 174,
    sales: 389,
    monthsObserved: 12,
  },
  {
    supplier: "Jeremy",
    parent: "Napfunterlage Silikon",
    variant: "anthrazit",
    articleNumber: "04001563",
    stock: 652,
    sales: 723,
    monthsObserved: 12,
  },
  {
    supplier: "Jeremy",
    parent: "Napfunterlage Silikon",
    variant: "salbeigrün",
    articleNumber: "04001564",
    stock: 0,
    sales: 1344,
    monthsObserved: 12,
  },
  {
    supplier: "Jeremy",
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

function getStatusByCoverage(coverage) {
  if (coverage < 1) {
    return { label: "Kritisch", bg: "#fee2e2", color: "#b91c1c" };
  }
  if (coverage < 3) {
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
  const [orderDate, setOrderDate] = useState("2026-06-01");
  const [targetMonths, setTargetMonths] = useState(3);
  const [supplierFilter, setSupplierFilter] = useState("Alle");

  const today = new Date("2026-03-18");
  const orderDateObj = new Date(orderDate);

  const monthsUntilOrder = Math.max(
    0,
    (orderDateObj - today) / (1000 * 60 * 60 * 24) / 30.44
  );

  const suppliers = ["Alle", ...new Set(data.map((d) => d.supplier))];

  const filteredData =
    supplierFilter === "Alle"
      ? data
      : data.filter((d) => d.supplier === supplierFilter);

  const grouped = groupData(filteredData);

  const overallMonthlySales = filteredData.reduce(
    (sum, item) => sum + getMonthlySales(item.sales, item.monthsObserved),
    0
  );

  const overallStock = filteredData.reduce((sum, item) => sum + item.stock, 0);

  const overallProjectedAtOrder = filteredData.reduce((sum, item) => {
    const monthlySales = getMonthlySales(item.sales, item.monthsObserved);
    const projectedSalesUntilOrder = monthlySales * monthsUntilOrder;
    const projectedStockAtOrder = Math.max(0, item.stock - projectedSalesUntilOrder);
    return sum + projectedStockAtOrder;
  }, 0);

  const overallTargetStock = filteredData.reduce((sum, item) => {
    const monthlySales = getMonthlySales(item.sales, item.monthsObserved);
    return sum + monthlySales * targetMonths;
  }, 0);

  const overallRecommendation = Math.max(0, overallTargetStock - overallProjectedAtOrder);

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
        Lieferanten-Filter, Bestelllogik und saubere Verteilung auf Varianten.
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
          <div style={{ marginBottom: 6, fontWeight: 700 }}>Bestellstart</div>
          <input
            type="date"
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <div style={{ marginBottom: 6, fontWeight: 700 }}>Zielreichweite (Monate)</div>
          <input
            type="number"
            min="1"
            step="1"
            value={targetMonths}
            onChange={(e) => setTargetMonths(Number(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div>
          <div style={{ marginBottom: 6, fontWeight: 700 }}>Monate bis Bestellstart</div>
          <div style={{ ...inputStyle, background: "#f8fafc" }}>
            {monthsUntilOrder.toFixed(1)}
          </div>
        </div>
      </div>

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
        <div><strong>Rest bei Bestellstart:</strong> {overallProjectedAtOrder.toFixed(0)}</div>
        <div><strong>Zielbestand:</strong> {overallTargetStock.toFixed(0)}</div>
        <div><strong>Bestellvorschlag:</strong> {overallRecommendation.toFixed(0)}</div>
      </div>

      {Object.entries(grouped).map(([parent, items]) => {
        const baseItems = items.map((item) => {
          const monthlySales = getMonthlySales(item.sales, item.monthsObserved);
          const projectedSalesUntilOrder = monthlySales * monthsUntilOrder;
          const projectedStockAtOrder = Math.max(0, item.stock - projectedSalesUntilOrder);
          const targetStock = monthlySales * targetMonths;
          const coverage = getCoverageMonths(item.stock, monthlySales);
          const status = getStatusByCoverage(coverage);

          return {
            ...item,
            monthlySales,
            projectedSalesUntilOrder,
            projectedStockAtOrder,
            targetStock,
            coverage,
            status,
          };
        });

        const totalStock = baseItems.reduce((sum, item) => sum + item.stock, 0);
        const totalSales = baseItems.reduce((sum, item) => sum + item.sales, 0);
        const totalMonthlySales = baseItems.reduce((sum, item) => sum + item.monthlySales, 0);
        const parentCoverage = getCoverageMonths(totalStock, totalMonthlySales);
        const parentProjectedStockAtOrder = baseItems.reduce(
          (sum, item) => sum + item.projectedStockAtOrder,
          0
        );
        const parentTargetStock = baseItems.reduce((sum, item) => sum + item.targetStock, 0);
        const parentRecommendedOrderQty = Math.max(
          0,
          parentTargetStock - parentProjectedStockAtOrder
        );

        const enrichedItems = baseItems.map((item) => {
          const share =
            totalMonthlySales > 0
              ? (item.monthlySales / totalMonthlySales) * 100
              : 0;

        const recommendedOrderQty = Math.max(0, item.targetStock - item.projectedStockAtOrder);
          
          return {
            ...item,
            share,
            recommendedOrderQty,
          };
        });

        const parentStatus =
          enrichedItems.some((item) => item.status.label === "Kritisch")
            ? { label: "Kritisch", bg: "#fee2e2", color: "#b91c1c" }
            : enrichedItems.some((item) => item.status.label === "Achtung")
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
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
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
              <div><strong>Rest bei Bestellstart:</strong> {parentProjectedStockAtOrder.toFixed(0)}</div>
              <div><strong>Zielbestand:</strong> {parentTargetStock.toFixed(0)}</div>
              <div><strong>Bestellvorschlag:</strong> {parentRecommendedOrderQty.toFixed(0)}</div>
              <div><span style={badgeStyle(parentStatus)}>{parentStatus.label}</span></div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", background: "white" }}>
              <thead>
                <tr>
                  <th style={th}>Artikelnummer</th>
                  <th style={th}>Variante</th>
                  <th style={th}>Lieferant</th>
                  <th style={th}>Bestand</th>
                  <th style={th}>Verkäufe</th>
                  <th style={th}>Monate beobachtet</th>
                  <th style={th}>Monat</th>
                  <th style={th}>Anteil am Parent</th>
                  <th style={th}>Reichweite</th>
                  <th style={th}>Verbrauch bis Bestellstart</th>
                  <th style={th}>Rest bei Bestellstart</th>
                  <th style={th}>Zielbestand</th>
                  <th style={th}>Bestellvorschlag</th>
                  <th style={th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {enrichedItems.map((item) => (
                  <tr key={item.articleNumber}>
                    <td style={td}>{item.articleNumber}</td>
                    <td style={td}>{item.variant}</td>
                    <td style={td}>{item.supplier}</td>
                    <td style={td}>{item.stock}</td>
                    <td style={td}>{item.sales}</td>
                    <td style={td}>{item.monthsObserved}</td>
                    <td style={td}>{item.monthlySales.toFixed(1)}</td>
                    <td style={td}>{item.share.toFixed(1)}%</td>
                    <td style={td}>{item.coverage.toFixed(1)} Monate</td>
                    <td style={td}>{item.projectedSalesUntilOrder.toFixed(1)}</td>
                    <td style={td}>{item.projectedStockAtOrder.toFixed(1)}</td>
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
