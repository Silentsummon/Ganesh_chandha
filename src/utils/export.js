import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function dateStamp() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function formatINR(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

function escapeCsvField(field) {
  const str = String(field ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportCSV(entries) {
  if (!entries || entries.length === 0) return;

  const header = ["Name", "Street", "Amount", "Description", "Status"];
  const rows = entries.map((e) => [
    e.name,
    e.street,
    e.amount,
    e.description || "",
    e.paid ? "Paid" : "Pending",
  ]);

  const csvContent = [header, ...rows]
    .map((row) => row.map(escapeCsvField).join(","))
    .join("\r\n");

  // Prefix with a UTF-8 BOM so ₹ and other characters render
  // correctly when the file is opened in Excel.
  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  downloadBlob(blob, `chandha-list-${dateStamp()}.csv`);
}

export function exportPDF(entries, summary) {
  if (!entries || entries.length === 0) return;

  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Chandha List", 14, 18);
  doc.setFontSize(10);
  doc.setTextColor(110, 110, 110);
  doc.text(`Generated ${new Date().toLocaleDateString("en-IN")}`, 14, 24);
  doc.setTextColor(0, 0, 0);

  autoTable(doc, {
    startY: 30,
    head: [["Name", "Street", "Amount", "Status"]],
    body: entries.map((e) => [
      e.name,
      e.street,
      formatINR(e.amount),
      e.paid ? "Paid" : "Pending",
    ]),
    headStyles: { fillColor: [42, 33, 21] },
    styles: { fontSize: 10 },
  });

  const finalY = doc.lastAutoTable.finalY + 12;
  doc.setFontSize(11);
  doc.text(
    `Paid: ${summary.paidCount} members  -  ${formatINR(summary.paidTotal)}`,
    14,
    finalY
  );
  doc.text(
    `Pending: ${summary.pendingCount} members  -  ${formatINR(
      summary.pendingTotal
    )}`,
    14,
    finalY + 7
  );
  doc.setFont(undefined, "bold");
  doc.text(
    `Total: ${summary.totalCount} members  -  ${formatINR(summary.totalAmount)}`,
    14,
    finalY + 14
  );
  doc.setFont(undefined, "normal");

  doc.save(`chandha-list-${dateStamp()}.pdf`);
}
