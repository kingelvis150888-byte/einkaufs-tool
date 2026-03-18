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

  // NEUE ARTIKEL (nur 1 Monat!)
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

  if (coverage < 1) return "Kritisch";
  if (coverage < 3) return "Achtung";
  return "OK";
}

export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Einkaufs-Tool</h1>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Artikel</th>
            <th>Variante</th>
            <th>Bestand</th>
            <th>Verkäufe</th>
            <th>Monat</th>
            <th>Reichweite</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => {
            const monthly = getMonthlySales(item.sales, item.monthsObserved);
            const coverage = getCoverageMonths(item.stock, monthly);
            const status = getStatus(item.stock, monthly);

            return (
              <tr key={item.articleNumber}>
                <td>{item.articleNumber}</td>
                <td>{item.variant}</td>
                <td>{item.stock}</td>
                <td>{item.sales}</td>
                <td>{monthly.toFixed(1)}</td>
                <td>{coverage.toFixed(1)} Monate</td>
                <td>{status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
