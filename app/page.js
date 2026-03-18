const data = [
  {
    parent: "Anti Schling Napf Silikon",
    variant: "blaugrau",
    articleNumber: "04001604",
    stock: 0,
    sales: 671,
    monthsObserved: 12,
  },
  {
    parent: "Anti Schling Napf Silikon",
    variant: "malve",
    articleNumber: "04001605",
    stock: 347,
    sales: 570,
    monthsObserved: 12,
  },
  {
    parent: "Anti Schling Napf Silikon",
    variant: "salbeigrün",
    articleNumber: "04001606",
    stock: 571,
    sales: 878,
    monthsObserved: 12,
  },
  {
    parent: "Anti Schling Napf Silikon",
    variant: "taupe",
    articleNumber: "04001872",
    stock: 574,
    sales: 444,
    monthsObserved: 12,
  },
  {
    parent: "Anti Schling Napf Silikon",
    variant: "steingrau",
    articleNumber: "04001873",
    stock: 704,
    sales: 301,
    monthsObserved: 12,
  },
  {
    parent: "Anti Schling Napf Silikon",
    variant: "cool lilac",
    articleNumber: "04001929",
    stock: 400,
    sales: 13,
    monthsObserved: 1,
  },
  {
    parent: "Anti Schling Napf Silikon",
    variant: "steel blue",
    articleNumber: "04001930",
    stock: 671,
    sales: 30,
    monthsObserved: 1,
  },
  {
    parent: "Anti Schling Napf Silikon",
    variant: "ruby",
    articleNumber: "04001931",
    stock: 325,
    sales: 39,
    monthsObserved: 1,
  },
  {
    parent: "Anti Schling Napf Silikon",
    variant: "graphite grey",
    articleNumber: "04001932",
    stock: 537,
    sales: 28,
    monthsObserved: 1,
  },

  {
    parent: "Napfunterlage Silikon",
    variant: "stone grey",
    articleNumber: "04001553",
    stock: 307,
    sales: 1001,
    monthsObserved: 12,
  },
  {
    parent: "Napfunterlage Silikon",
    variant: "rose",
    articleNumber: "04001555",
    stock: 480,
    sales: 501,
    monthsObserved: 12,
  },
  {
    parent: "Napfunterlage Silikon",
    variant: "steel blue",
    articleNumber: "04001556",
    stock: 174,
    sales: 389,
    monthsObserved: 12,
  },
  {
    parent: "Napfunterlage Silikon",
    variant: "anthrazit",
    articleNumber: "04001563",
    stock: 652,
    sales: 723,
    monthsObserved: 12,
  },
  {
    parent: "Napfunterlage Silikon",
    variant: "salbeigrün",
    articleNumber: "04001564",
    stock: 0,
    sales: 1344,
    monthsObserved: 12,
  },
  {
    parent: "Napfunterlage Silikon",
    variant: "lilac",
    articleNumber: "04001884",
    stock: 463,
    sales: 108,
    monthsObserved: 12,
  },
];

function getMonthlySales(sales, monthsObserved) {
  if (monthsObserved <= 0) return 0;
  return sales / monthsObserved;
}

function getCoverageMonths(stock, monthlySales) {
  if (monthlySales <= 0) return 999;
  return stock / monthlySales;
}

function getStatus(stock, monthlySales) {
  const coverage = getCoverageMonths(stock, monthlySales);

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

export default function Home() {
  const grouped = groupData(data);

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
        Parent-Gruppen, Prozentanteile und korrekte Monatslogik.
      </p>

      {Object.entries(grouped).map(([parent, items]) => {
        const totalStock = items.reduce((sum, item) => sum + item.stock, 0);
        const totalSales = items.reduce((sum, item) => sum + item.sales, 0);
        const totalMonthlySales = items.reduce(
          (sum, item) => sum + getMonthlySales(item.sales, item.monthsObserved),
          0
        );
        const parentCoverage = getCoverageMonths(totalStock, totalMonthlySales);

        const parentStatus =
          items.some(
            (item) =>
              getStatus(item.stock, getMonthlySales(item.sales, item.monthsObserved)).label ===
              "Kritisch"
          )
            ? { label: "Kritisch", bg: "#fee2e2", color: "#b91c1c" }
            : items.some(
                (item) =>
                  getStatus(item.stock, getMonthlySales(item.sales, item.monthsObserved)).label ===
                  "Achtung"
              )
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
              <div><strong>Gesamtbestand:</strong> {totalStock}</div>
              <div><strong>Verkäufe:</strong> {totalSales}</div>
              <div><strong>Monatsverkauf:</strong> {totalMonthlySales.toFixed(1)}</div>
              <div><strong>Reichweite:</strong> {parentCoverage.toFixed(1)} Monate</div>
              <div><span style={badgeStyle(parentStatus)}>{parentStatus.label}</span></div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", background: "white" }}>
              <thead>
                <tr>
                  <th style={th}>Artikelnummer</th>
                  <th style={th}>Variante</th>
                  <th style={th}>Bestand</th>
                  <th style={th}>Verkäufe</th>
                  <th style={th}>Monate beobachtet</th>
                  <th style={th}>Monat</th>
                  <th style={th}>Anteil am Parent</th>
                  <th style={th}>Reichweite</th>
                  <th style={th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const monthlySales = getMonthlySales(item.sales, item.monthsObserved);
                  const coverage = getCoverageMonths(item.stock, monthlySales);
                  const share = totalSales > 0 ? (item.sales / totalSales) * 100 : 0;
                  const status = getStatus(item.stock, monthlySales);

                  return (
                    <tr key={item.articleNumber}>
                      <td style={td}>{item.articleNumber}</td>
                      <td style={td}>{item.variant}</td>
                      <td style={td}>{item.stock}</td>
                      <td style={td}>{item.sales}</td>
                      <td style={td}>{item.monthsObserved}</td>
                      <td style={td}>{monthlySales.toFixed(1)}</td>
                      <td style={td}>{share.toFixed(1)}%</td>
                      <td style={td}>{coverage.toFixed(1)} Monate</td>
                      <td style={td}>
                        <span style={badgeStyle(status)}>{status.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </details>
        );
      })}
    </main>
  );
}
