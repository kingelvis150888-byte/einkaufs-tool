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
];

function getMonthlySales(sales12m) {
  return sales12m / 12;
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
    <main style={{ padding: 24, fontFamily: "Arial" }}>
      <h1>Einkaufs-Tool</h1>

      {Object.entries(grouped).map(([parent, items]) => (
        <div key={parent} style={{ marginBottom: 20 }}>
          <h2>{parent}</h2>

          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Artikel</th>
                <th>Variante</th>
                <th>Bestand</th>
                <th>12M Verkäufe</th>
                <th>Monat</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const monthly = getMonthlySales(item.sales12m);

                return (
                  <tr key={item.articleNumber}>
                    <td>{item.articleNumber}</td>
                    <td>{item.variant}</td>
                    <td>{item.stock}</td>
                    <td>{item.sales12m}</td>
                    <td>{monthly.toFixed(1)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </main>
  );
}
