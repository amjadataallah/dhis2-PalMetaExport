import React from "react";
import { Button, ButtonStrip } from "@dhis2/ui";
import * as XLSX from "xlsx"; // Add this line

function exportJSON(data, fileName) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.json`;
  link.click();
}

function exportCSV(data, fileName) {
  const headers = ["ID", "Name", "Code", "Value Type", "Description"];
  const rows = data.map((de) => [
    de.id,
    de.displayName,
    de.code || "",
    de.valueType,
    de.description || "",
  ]);

  const csvContent = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.csv`;
  link.click();
}

function exportXLSX(data, fileName) {
  const headers = Object.keys(data[0] || {});
  const rows = data.map((row) => headers.map((h) => String(row[h] ?? "")));

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Export");

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

export default function ExportButtons({
  data,
  fileName = "export",
  excludeJSON = false,
}) {
  if (!data || data.length === 0) return null;

  return (
    <div style={{ marginTop: "1.5rem" }}>
      <h3>Export</h3>
      <ButtonStrip>
        {!excludeJSON && (
          <Button onClick={() => exportJSON(data, fileName)}>
            Export JSON
          </Button>
        )}
        <Button onClick={() => exportCSV(data, fileName)}>Export CSV</Button>
        <Button onClick={() => exportXLSX(data, fileName)}>Export XLSX</Button>
      </ButtonStrip>
    </div>
  );
}
