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
    variant: "salbeigrün",
    articleNumber: "04001606",
    stock: 571,
    sales12m: 878,
  },
  {
    parent: "Anti Schling Napf Silikon",
    variant: "steingrau",
    articleNumber: "04001873",
    stock: 704,
    sales12m: 301,
  },
];

function getMonthlySales(sales12m) {
  return sales12m / 12;
}

function getCoverageMonths(stock, monthlySales) {
  if (!monthlySales || monthlySales <= 0) return 999;
  return stock / monthlySales;
}

function getStatus(coverage) {
  if (coverage < 1) {
    return { label: "Kritisch", color: "#dc2626", bg: "#fee2e2" };
  }
  if (coverage < 3) {
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

export default function Home() {
  const grouped = groupData(data);

  return (
    <main style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ marginBottom: 8 }}>Einkaufs-Planungstool</h1>
      <p style={{ marginBottom: 24 }}>
        Erste Live-Version mit Statuslogik.
      </p>

      {Object.entries(grouped).map(([parent, items]) => {
        const totalStock = items.reduce((sum, item) => sum + item.stock, 0);
        const totalSales12m = items.reduce((sum, item) => sum + item.sales12m, 0);
        const totalMonthly = totalSales12m / 12;
        const totalCoverage = getCoverageMonths(totalStock, totalMonthly);
        const parentStatus = getStatus(totalCoverage);

        return (
          <div
            key={parent}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 16,
              marginBottom: 24,
              background: "#fafafa",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <h2 style={{ margin: 0 }}>{parent}</h2>

              <span
                style={{
                  background: parentStatus.bg,
                  color: parentStatus.color,
                  padding: "6px 10px",
                  borderRadius: 999,
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                {parentStatus.label}
              </span>
            </div>

            <div style={{ marginBottom: 16 }}>
              <strong>Gesamtbestand:</strong> {totalStock} |{" "}
              <strong>Verkäufe 12M:</strong> {totalSales12m} |{" "}
              <strong>Monat:</strong> {totalMonthly.toFixed(1)} |{" "}
              <strong>Reichweite:</strong> {totalCoverage.toFixed(1)} Monate
            </div>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "#fff",
              }}
            >
              <thead>
                <tr style={{ background: "#f3f4f6" }}>
                  <th style={th}>Artikelnummer</th>
                  <th style={th}>Variante</th>
                  <th style={th}>Bestand</th>
                  <th style={th}>Verkäufe 12M</th>
                  <th style={th}>Monat</th>
                  <th style={th}>Reichweite</th>
                  <th style={th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const monthly = getMonthlySales(item.sales12m);
                  const coverage = getCoverageMonths(item.stock, monthly);
                  const status = getStatus(coverage);

                  return (
                    <tr key={item.articleNumber}>
                      <td style={td}>{item.articleNumber}</td>
                      <td style={td}>{item.variant}</td>
                      <td style={td}>{item.stock}</td>
                      <td style={td}>{item.sales12m}</td>
                      <td style={td}>{monthly.toFixed(1)}</td>
                      <td style={td}>{coverage === 999 ? "-" : coverage.toFixed(1)}</td>
                      <td style={td}>
                        <span
                          style={{
                            background: status.bg,
                            color: status.color,
                            padding: "4px 8px",
                            borderRadius: 999,
                            fontWeight: 700,
                            fontSize: 13,
                          }}
                        >
                          {status.label}
                        </span>
                      </td>
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

const th = {
  border: "1px solid #ddd",
  padding: "10px",
  textAlign: "left",
};

const td = {
  border: "1px solid #ddd",
  padding: "10px",
};         
