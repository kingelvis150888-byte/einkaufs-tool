"use client";

import { useMemo, useState } from "react";

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

function groupData(items) {
  const grouped = {};
  for (const item of items) {
    if (!grouped[item.parent]) grouped[item.parent] = [];
    grouped[item.parent].push(item);
  }
  return grouped;
}

export default function Home() {
  const [orderDate, setOrderDate] = useState("2026-06-01");
  const [targetMonths, setTargetMonths] = useState(3);
  const [supplierFilter, setSupplierFilter] = useState("Alle");

  const today = new Date("2026-03-18");
  const orderDateObj = new Date(orderDate);

  const monthsUntilOrder =
    (orderDateObj - today) / (1000 * 60 * 60 * 24) / 30.44;

  const suppliers = ["Alle", ...new Set(data.map((d) => d.supplier))];

  const filteredData =
    supplierFilter === "Alle"
      ? data
      : data.filter((d) => d.supplier === supplierFilter);

  const grouped = groupData(filteredData);

  return (
    <main style={{ padding: 24 }}>
      <h1>Einkaufs-Tool</h1>

      <div style={{ marginBottom: 20 }}>
        <select
          value={supplierFilter}
          onChange={(e) => setSupplierFilter(e.target.value)}
        >
          {suppliers.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <input
          type="date"
          value={orderDate}
          onChange={(e) => setOrderDate(e.target.value)}
        />

        <input
          type="number"
          value={targetMonths}
          onChange={(e) => setTargetMonths(Number(e.target.value))}
        />
      </div>

      {Object.entries(grouped).map(([parent, items]) => {
        const enriched = items.map((item) => {
          const monthlySales = getMonthlySales(
            item.sales,
            item.monthsObserved
          );

          const projectedStock =
            item.stock - monthlySales * monthsUntilOrder;

          const targetStock = monthlySales * targetMonths;

          return {
            ...item,
            monthlySales,
            projectedStock,
            targetStock,
          };
        });

        const parentMonthly = enriched.reduce(
          (sum, i) => sum + i.monthlySales,
          0
        );

        const parentProjected = enriched.reduce(
          (sum, i) => sum + Math.max(0, i.projectedStock),
          0
        );

        const parentTarget = enriched.reduce(
          (sum, i) => sum + i.targetStock,
          0
        );

        const parentOrder = Math.max(0, parentTarget - parentProjected);

        return (
          <div key={parent}>
            <h2>{parent}</h2>

            <table border="1">
              <thead>
                <tr>
                  <th>Artikel</th>
                  <th>Variante</th>
                  <th>Monat</th>
                  <th>Anteil</th>
                  <th>Bestellvorschlag</th>
                </tr>
              </thead>

              <tbody>
                {enriched.map((item) => {
                  const share =
                    parentMonthly > 0
                      ? (item.monthlySales / parentMonthly) * 100
                      : 0;

                  const order =
                    (parentOrder * share) / 100;

                  return (
                    <tr key={item.articleNumber}>
                      <td>{item.articleNumber}</td>
                      <td>{item.variant}</td>
                      <td>{item.monthlySales.toFixed(1)}</td>
                      <td>{share.toFixed(1)}%</td>
                      <td>{order.toFixed(1)}</td>
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
