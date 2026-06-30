import { useState, useRef, useEffect } from "react";
import { Download, FileSpreadsheet, FileCode, Table } from "lucide-react";
import { downloadCSV, downloadJSON, downloadExcelHTML } from "../utils/exportUtils.js";

const FORMATS = [
  { key: "csv", label: "CSV (Excel)", icon: FileSpreadsheet, desc: "Comma-separated values" },
  { key: "json", label: "JSON", icon: FileCode, desc: "Machine-readable data" },
  { key: "excel", label: "Excel (.xls)", icon: Table, desc: "Formatted HTML table" },
];

export default function ExportButton({ data, filename, variant = "primary" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleExport = (format) => {
    setOpen(false);
    if (!data || data.length === 0) {
      alert("No data to export.");
      return;
    }
    switch (format) {
      case "csv":
        downloadCSV(data, filename);
        break;
      case "json":
        downloadJSON(data, filename);
        break;
      case "excel":
        downloadExcelHTML(data, filename);
        break;
    }
  };

  const baseStyle = {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 16px",
    borderRadius: 10,
    fontFamily: "inherit",
    fontWeight: 600,
    fontSize: ".85rem",
    cursor: "pointer",
    border: "1px solid var(--border)",
    background: "var(--surface-strong)",
    color: "var(--text)",
    transition: "all .15s",
    position: "relative",
    whiteSpace: "nowrap",
  };

  const activeStyle = variant === "accent"
    ? { background: "var(--accent)", color: "#fff", border: "none" }
    : {};

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ ...baseStyle, ...activeStyle }}
        onMouseEnter={(e) => { if (variant !== "accent") e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.color = "#fff"; }}
        onMouseLeave={(e) => { if (variant !== "accent") { e.currentTarget.style.background = "var(--surface-strong)"; e.currentTarget.style.color = "var(--text)"; } }}
      >
        <Download size={16} />
        Export
        <span style={{ fontSize: ".65rem", marginLeft: 2 }}>▾</span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: 6,
            background: "#fff",
            border: "1px solid var(--border)",
            borderRadius: 12,
            boxShadow: "0 8px 30px rgba(0,0,0,.12)",
            minWidth: 220,
            zIndex: 100,
            overflow: "hidden",
          }}
        >
          {FORMATS.map((fmt) => {
            const Icon = fmt.icon;
            return (
              <button
                key={fmt.key}
                onClick={() => handleExport(fmt.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  width: "100%",
                  padding: "12px 16px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: ".85rem",
                  textAlign: "left",
                  color: "var(--text)",
                  borderBottom: "1px solid rgba(0,0,0,.04)",
                  transition: "background .1s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(13,126,82,.08)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <Icon size={18} style={{ color: "var(--accent)", flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600 }}>{fmt.label}</div>
                  <div style={{ fontSize: ".75rem", opacity: .6 }}>{fmt.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
