import { COLORS, SERIF, pageBase, card, formatINR } from "../theme";
import { Watermark, Crest } from "../components/Logo";
import { exportCSV, exportPDF } from "../utils/export";

export default function ChandhaList({ entries, loading, onHome, onAdd }) {
  const paidEntries = entries.filter((e) => e.paid);
  const pendingEntries = entries.filter((e) => !e.paid);
  const paidTotal = paidEntries.reduce((s, e) => s + Number(e.amount), 0);
  const pendingTotal = pendingEntries.reduce((s, e) => s + Number(e.amount), 0);
  const totalAmount = paidTotal + pendingTotal;

  const summary = {
    paidCount: paidEntries.length,
    paidTotal,
    pendingCount: pendingEntries.length,
    pendingTotal,
    totalCount: entries.length,
    totalAmount,
  };

  const summaryCard = (title, count, amt, tint) => (
    <div
      style={{
        background: tint.bg,
        borderRadius: "12px",
        border: `1.5px solid ${tint.border}`,
        boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
        padding: "22px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderLeft: `6px solid ${tint.border}`,
      }}
    >
      <div>
        <div style={{ fontSize: "13.5px", fontWeight: 700, color: tint.text, marginBottom: "4px", letterSpacing: "0.02em" }}>
          {title}
        </div>
        <div style={{ fontSize: "13.5px", color: tint.text, opacity: 0.75 }}>
          {count} {count === 1 ? "member" : "members"}
        </div>
      </div>
      <div style={{ fontSize: "23px", fontWeight: 700, color: tint.text }}>
        {formatINR(amt)}
      </div>
    </div>
  );

  const exportButtonStyle = {
    flex: 1,
    padding: "11px",
    borderRadius: "10px",
    border: `1px solid ${COLORS.goldDeep}88`,
    background: COLORS.bgAlt,
    color: COLORS.gold,
    fontSize: "13.5px",
    fontWeight: 600,
    cursor: entries.length === 0 ? "default" : "pointer",
    opacity: entries.length === 0 ? 0.5 : 1,
  };

  return (
    <div style={pageBase}>
      <Watermark opacity={0.06} size={480} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: "560px", margin: "0 auto" }}>
        <button
          onClick={onHome}
          style={{ background: "none", border: "none", color: COLORS.creamMuted, fontSize: "13.5px", cursor: "pointer", padding: 0, marginBottom: "18px" }}
        >
          ← Home
        </button>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "18px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <Crest size={36} />
              <div style={{ fontSize: "11.5px", fontWeight: 700, color: COLORS.gold, letterSpacing: "0.08em" }}>
                LAKSHMI NARASIMA SWAMY YOUTH ASSOCIATION
              </div>
            </div>
            <h1 style={{ fontFamily: SERIF, fontSize: "26px", fontWeight: 700, margin: 0, color: COLORS.goldBright }}>
              Chandha list
            </h1>
          </div>
          <button
            onClick={onAdd}
            style={{
              padding: "10px 16px", borderRadius: "10px", border: `1px solid ${COLORS.goldDeep}88`,
              background: COLORS.bgAlt, color: COLORS.gold, fontSize: "14px", fontWeight: 600,
              cursor: "pointer", whiteSpace: "nowrap",
            }}
          >
            Add another
          </button>
        </div>

        <div style={{ display: "flex", gap: "10px", marginBottom: "18px" }}>
          <button
            onClick={() => exportCSV(entries)}
            disabled={entries.length === 0}
            style={exportButtonStyle}
          >
            Export as CSV
          </button>
          <button
            onClick={() => exportPDF(entries, summary)}
            disabled={entries.length === 0}
            style={exportButtonStyle}
          >
            Export as PDF
          </button>
        </div>

        <div style={{ ...card, padding: "8px 0", marginBottom: "24px" }}>
          {loading ? (
            <div style={{ padding: "24px", color: "#7A6C46", fontSize: "14.5px" }}>Loading…</div>
          ) : entries.length === 0 ? (
            <div style={{ padding: "24px", color: "#7A6C46", fontSize: "14.5px" }}>No chandhas added yet.</div>
          ) : (
            entries.map((e, i) => (
              <div
                key={e.id ?? i}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "14px 24px",
                  borderBottom: i === entries.length - 1 ? "none" : "1px solid #EFE6CB",
                }}
              >
                <span style={{ fontSize: "15px", fontWeight: 500, color: COLORS.ink }}>{e.name}</span>
                <span style={{ fontSize: "15px", fontWeight: 700, color: COLORS.ink }}>{formatINR(e.amount)}</span>
              </div>
            ))
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {summaryCard("Paid", paidEntries.length, paidTotal, { border: COLORS.green, text: COLORS.greenText, bg: COLORS.greenBg })}
          {summaryCard("Pending", pendingEntries.length, pendingTotal, { border: COLORS.amber, text: COLORS.amberText, bg: COLORS.amberBg })}
          {summaryCard("Total", entries.length, totalAmount, { border: COLORS.maroon, text: COLORS.maroon, bg: COLORS.card })}
        </div>
      </div>
    </div>
  );
}
