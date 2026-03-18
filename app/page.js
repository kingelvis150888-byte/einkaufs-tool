const data = [
  {
    parent: "Futterschale Silikon – Katze",
    variant: "steinfarben",
    articleNumber: "04001441",
    stock: 1156,
    sales12m: 1572,
  },
  {
    parent: "Futterschale Silikon – Katze",
    variant: "salbeigrün",
    articleNumber: "04001438",
    stock: 736,
    sales12m: 1155,
  },
  {
    parent: "Futterschale Silikon – Katze",
    variant: "rosa",
    articleNumber: "04001440",
    stock: 392,
    sales12m: 668,
  },
  {
    parent: "Futterschale Silikon – Katze",
    variant: "blau",
    articleNumber: "04001442",
    stock: 1056,
    sales12m: 840,
  },
  {
    parent: "Futterschale Silikon – Katze",
    variant: "cool lilac",
    articleNumber: "04001571",
    stock: 811,
    sales12m: 601,
  },
  {
    parent: "Futterschale Silikon – Katze",
    variant: "graphitgrau",
    articleNumber: "04001637",
    stock: 73,
    sales12m: 1146,
  },

  {
    parent: "Napfunterlage Silikon",
    variant: "stone grey",
    articleNumber: "04001553",
    stock: 307,
    sales12m: 1001,
  },
  {
    parent: "Napfunterlage Silikon",
    variant: "rose",
    articleNumber: "04001555",
    stock: 480,
    sales12m: 501,
  },
  {
    parent: "Napfunterlage Silikon",
    variant: "steel blue",
    articleNumber: "04001556",
    stock: 174,
    sales12m: 389,
  },
  {
    parent: "Napfunterlage Silikon",
    variant: "anthrazit",
    articleNumber: "04001563",
    stock: 652,
    sales12m: 723,
  },
  {
    parent: "Napfunterlage Silikon",
    variant: "salbeigrün",
    articleNumber: "04001564",
    stock: 0,
    sales12m: 1344,
  },
  {
    parent: "Napfunterlage Silikon",
    variant: "lilac",
    articleNumber: "04001884",
    stock: 463,
    sales12m: 108,
  },

  {
    parent: "Anti Schling Napf Silikon",
    variant: "blaugrau",
    articleNumber: "04001604",
    stock: 0,
    sales12m: 671,
  },
  {
    parent: "Anti Schling Napf Silikon",
    variant: "malve",
    articleNumber: "04001605",
    stock: 347,
    sales12m: 570,
  },
  {
    parent: "Anti Schling Napf Silikon",
    variant: "salbeigrün",
    articleNumber: "04001606",
    stock: 571,
    sales12m: 878,
  },
  {
    parent: "Anti Schling Napf Silikon",
    variant: "taupe",
    articleNumber: "04001872",
    stock: 574,
    sales12m: 444,
  },
  {
    parent: "Anti Schling Napf Silikon",
    variant: "steingrau",
    articleNumber: "04001873",
    stock: 704,
    sales12m: 301,
  },
  {
    parent: "Anti Schling Napf Silikon",
    variant: "cool lilac",
    articleNumber: "04001929",
    stock: 400,
    sales12m: 13,
  },
  {
    parent: "Anti Schling Napf Silikon",
    variant: "steel blue",
    articleNumber: "04001930",
    stock: 671,
    sales12m: 30,
  },
  {
    parent: "Anti Schling Napf Silikon",
    variant: "ruby",
    articleNumber: "04001931",
    stock: 325,
    sales12m: 39,
  },
  {
    parent: "Anti Schling Napf Silikon",
    variant: "graphite grey",
    articleNumber: "04001932",
    stock: 537,
    sales12m: 28,
  },
];

function getMonthlySales(sales12m) {
  return sales12m / 12;
}

function getCoverageMonths(stock, monthlySales) {
  if (monthlySales <= 0) return 999;
  return stock / monthlySales;
}

function getVariantStatus(stock, monthlySales) {
  const coverage = getCoverageMonths(stock, monthlySales);

  if (coverage < 1) {
    return { label: "Kritisch", color: "#dc2626", bg: "#fee2e2" };
  }
  if (coverage < 3) {
    return { label: "Achtung", color: "#d97706", bg: "#fef3c7" };
  }
  return { label: "OK", color: "#15803d", bg: "#dcfce7" };
}

function getParentStatus(items) {
  const statuses = items.map((item) =>
    getVariantStatus(item.stock, getMonthlySales(item.sales12m)).label
  );

  if (statuses.includes("Kritisch")) {
    return { label: "Kritisch", color: "#dc2626", bg: "#fee2e2" };
  }
  if (statuses.includes("Achtung")) {
    return { label: "Achtung", color: "#d97706", bg: "#fef3c7" };
  }
  return { label: "OK", color: "#15803d", bg: "#dcfce7" };
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
    color: status.color,
    background: status.bg,
    fontSize: 13,
  };
}

const th = {
  border: "1px solid #ddd",
  padding: "10px",
  textAlign: "left",
  background: "#f3f4f6",
};

const td = {
  border: "1px solid #ddd",
  padding: "10px",
};

export default function Home() {
  const grouped = groupData(data);

  return (
    <main style={{ padding: 24, fontFamily: "Arial, sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: 8 }}>Einkaufs-Planungstool</h1>
      <p style={{ marginBottom: 24, color: "#475569" }}>
        Live-Version mit Parent-Gruppen, Prozentanteilen und Statuslogik.
      </p>

      {Object.entries(grouped).map(([parent, items]) => {
        const totalStock = items.reduce((sum, item) => sum + item.stock, 0);
        const totalSales12m = items.reduce((sum, item) => sum + item.sales12m, 0);
        const totalMonthlySales = totalSales12m / 12;
        const parentCoverage = getCoverageMonths(totalStock, totalMonthlySales);
        const parentStatus = getParentStatus(items);

        return (
          <details
            key={parent}
            open
            style={{
              border: "1px solid #dbeafe",
              borderRadius: 12,
              marginBottom: 24,
              padding: 16,
              background: "white",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <summary
              style={{
                cursor: "pointer",
                fontSize: 20,
                fontWeight: 700,
                marginBottom: 14,
              }}
            >
              {parent}
            </summary>

            <div
              style={{
                display: "flex",
                gap: 20,
                flexWrap: "wrap",
                marginBottom: 16,
                alignItems: "center",
              }}
            >
              <div><strong>Gesamtbestand:</strong> {totalStock}</div>
              <div><strong>Verkäufe 12M:</strong> {totalSales12m}</div>
              <div><strong>Monatsverkauf:</strong> {totalMonthlySales.toFixed(1)}</div>
              <div><strong>Reichweite:</strong> {parentCoverage.toFixed(1)} Monate</div>
              <div><span style={badgeStyle(parentStatus)}>{parentStatus.label}</span></div>
            </div>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "white",
              }}
            >
              <thead>
                <tr>
                  <th style={th}>Artikelnummer</th>
                  <th style={th}>Variante</th>
                  <th style={th}>Bestand</th>
                  <th style={th}>Verkäufe 12M</th>
                  <th style={th}>Monat</th>
                  <th style={th}>Anteil am Parent</th>
                  <th style={th}>Reichweite</th>
                  <th style={th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const monthlySales = getMonthlySales(item.sales12m);
                  const share = totalSales12m > 0 ? (item.sales12m / totalSales12m) * 100 : 0;
                  const coverage = getCoverageMonths(item.stock, monthlySales);
                  const status = getVariantStatus(item.stock, monthlySales);

                  return (
                    <tr key={item.articleNumber}>
                      <td style={td}>{item.articleNumber}</td>
                      <td style={td}>{item.variant}</td>
                      <td style={td}>{item.stock}</td>
                      <td style={td}>{item.sales12m}</td>
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
