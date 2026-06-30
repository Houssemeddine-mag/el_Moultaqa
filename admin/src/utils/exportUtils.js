function downloadBlob(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadCSV(data, filename) {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]);
  const quote = (val) => {
    if (val === null || val === undefined) return '""';
    return `"${String(val).replace(/"/g, '""')}"`;
  };
  const rows = data.map((row) => headers.map((h) => quote(row[h])).join(","));
  const csv = [headers.map((h) => `"${h}"`).join(","), ...rows].join("\r\n");
  downloadBlob("\uFEFF" + csv, `${filename}.csv`, "text/csv;charset=utf-8");
}

export function downloadJSON(data, filename) {
  if (!data || data.length === 0) return;
  const json = JSON.stringify(data, null, 2);
  downloadBlob(json, `${filename}.json`, "application/json;charset=utf-8");
}

export function downloadExcelHTML(data, filename) {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]);

  const esc = (val) => {
    if (val === null || val === undefined) return "";
    return String(val)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  };

  const headerRow = headers.map((h) => `<th>${esc(h)}</th>`).join("");
  const dataRows = data
    .map(
      (row) =>
        `<tr>${headers.map((h) => `<td>${esc(row[h])}</td>`).join("")}</tr>`
    )
    .join("\n");

  const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="UTF-8">
<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
<x:Name>Sheet1</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
</x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
<style>
  table { border-collapse: collapse; font-family: Segoe UI, sans-serif; font-size: 11pt; }
  th { background: #0d7e52; color: #fff; padding: 8px 12px; text-align: left; border: 1px solid #ccc; }
  td { padding: 6px 12px; border: 1px solid #ccc; }
  tr:nth-child(even) td { background: #f6fff8; }
</style></head>
<body><table>${headerRow ? `<thead><tr>${headerRow}</tr></thead>` : ""}<tbody>${dataRows}</tbody></table></body></html>`;

  downloadBlob(html, `${filename}.xls`, "application/vnd.ms-excel;charset=utf-8");
}
