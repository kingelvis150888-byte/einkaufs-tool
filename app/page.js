"use client";

import { useState } from "react";

function normalizeHeader(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function parseGermanNumber(value) {
  if (!value) return 0;

  const cleaned = String(value)
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^\d.-]/g, "");

  const num = Number(cleaned);
  return Number.isNaN(num) ? 0 : num;
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
  const [rawRows, setRawRows] = useState([]);
  const [parsedRows, setParsedRows] = useState([]);
  const [error, setError] = useState("");

  const handleFileUpload = (event) => {
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
        articleNumber: row[articleNumberIndex]?.trim() || "",
        article: row[articleIndex]?.trim() || "",
        hauptlagerRaw: row[hauptlagerIndex]?.trim() || "",
        stockRaw: row[summeLagerstandIndex]?.trim() || "",
        hauptlager: parseGermanNumber(row[hauptlagerIndex]),
        stock: parseGermanNumber(row[summeLagerstandIndex]),
      }));

      setParsedRows(parsed.filter((row) => row.articleNumber));
    };

    reader.readAsText(file, "utf-8");
  };

  return (
    <main
      style={{
        padding: 24,
        fontFamily: "Arial, sans-serif",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ marginBottom: 8 }}>CSV Import Test</h1>
      <p style={{ marginBottom: 20, color: "#475569" }}>
        Automatische Erkennung von Artikelnummer, Artikel, Hauptlager und Summe Lagerstand.
      </p>

      <div
        style={{
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
        }}
      >
        <div style={{ marginBottom: 8, fontWeight: 700 }}>
          Bestandsbericht (ERP) hochladen
        </div>
        <input type="file" accept=".csv" onChange={handleFileUpload} />
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

      {rawRows.length > 0 && (
        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 16,
            marginBottom: 24,
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

      {parsedRows.length > 0 && (
        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 16,
          }}
        >
          <h3 style={{ marginBottom: 12 }}>Erkannte Bestandsdaten</h3>
          <div style={{ marginBottom: 12 }}>
            <strong>Gefundene Artikel:</strong> {parsedRows.length}
          </div>

          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={th}>Artikelnummer</th>
                <th style={th}>Artikel</th>
                <th style={th}>Hauptlager</th>
                <th style={th}>Summe Lagerstand</th>
              </tr>
            </thead>
            <tbody>
              {parsedRows.slice(0, 25).map((row, i) => (
                <tr key={i}>
                  <td style={td}>{row.articleNumber}</td>
                  <td style={td}>{row.article}</td>
                  <td style={td}>{row.hauptlager}</td>
                  <td style={td}>{row.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
