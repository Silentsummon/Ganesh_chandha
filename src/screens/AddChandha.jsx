import { useState } from "react";
import { COLORS, SERIF } from "../theme";
import { Crest } from "../components/Logo";
import { supabase } from "../lib/supabaseClient";

const pageStyle = {
  minHeight: "100vh",
  background: `linear-gradient(135deg, rgba(24, 20, 16, 0.85) 0%, rgba(31, 25, 19, 0.85) 100%), url('/bappa-bg.png') center/cover no-repeat fixed`,
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  color: COLORS.cream,
  padding: "40px 20px",
  boxSizing: "border-box",
  position: "relative",
  overflow: "hidden",
};

export default function AddChandha({ onHome, onAdded, onViewList, entryCount }) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [street, setStreet] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const label = {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    color: "#6B5B36",
    marginBottom: "6px",
    letterSpacing: "0.01em",
  };

  const inputBase = {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 14px",
    borderRadius: "10px",
    border: "1px solid #E2D6B4",
    fontSize: "15px",
    fontFamily: "inherit",
    color: COLORS.ink,
    background: "#FFFDF8",
    outline: "none",
  };

  const errorText = { fontSize: "12.5px", color: "#B3401E", marginTop: "5px" };
  const card = {
    background: COLORS.card,
    borderRadius: "16px",
    border: `1px solid ${COLORS.goldDeep}55`,
    boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
  };

  const handleAdd = async () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Enter a name";
    if (!mobile.trim()) newErrors.mobile = "Enter a mobile number";
    if (!/^\d{10}$/.test(mobile.replace(/\D/g, ''))) newErrors.mobile = "Enter a valid 10-digit number";
    if (!street.trim()) newErrors.street = "Enter a street";
    if (!amount || Number(amount) <= 0) newErrors.amount = "Enter an amount";
    if (!status) newErrors.status = "Choose paid or pending";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    setSaveError("");

    const { error } = await supabase.from("chandhas").insert({
      name: name.trim(),
      mobile: mobile.trim(),
      street: street.trim(),
      amount: Number(amount),
      description: description.trim(),
      paid: status === "paid",
    });

    setSaving(false);

    if (error) {
      setSaveError("Could not save that entry. Check your connection and try again.");
      return;
    }

    setName("");
    setMobile("");
    setStreet("");
    setAmount("");
    setDescription("");
    setStatus(null);
    setErrors({});
    onAdded();
  };

  return (
    <div style={pageStyle}>
      <div style={{ position: "relative", zIndex: 1, maxWidth: "480px", margin: "0 auto" }}>
        <button
          onClick={onHome}
          style={{ background: "none", border: "none", color: COLORS.creamMuted, fontSize: "13.5px", cursor: "pointer", padding: 0, marginBottom: "18px" }}
        >
          ← Home
        </button>

        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <Crest size={36} />
            <div style={{ fontSize: "11.5px", fontWeight: 700, color: COLORS.gold, letterSpacing: "0.08em" }}>
              LAKSHMI NARASIMHA SWAMY YOUTH ASSOCIATION
            </div>
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: "26px", fontWeight: 700, margin: 0, color: COLORS.goldBright }}>
            Add a chandha
          </h1>
          <p style={{ fontSize: "14.5px", color: COLORS.creamMuted, margin: "6px 0 0" }}>
            Record one member's contribution and payment status.
          </p>
        </div>

        <div style={{ ...card, padding: "28px" }}>
          <div style={{ marginBottom: "20px" }}>
            <label style={label}>Name</label>
            <input
              style={{ ...inputBase, borderColor: errors.name ? "#D9532F" : inputBase.border }}
              placeholder="Enter name"
              value={name}
              onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((p) => ({ ...p, name: null })); }}
            />
            {errors.name && <div style={errorText}>{errors.name}</div>}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={label}>Mobile number</label>
            <input
              style={{ ...inputBase, borderColor: errors.mobile ? "#D9532F" : inputBase.border }}
              placeholder="Enter 10-digit mobile number"
              value={mobile}
              onChange={(e) => { setMobile(e.target.value); if (errors.mobile) setErrors((p) => ({ ...p, mobile: null })); }}
            />
            {errors.mobile && <div style={errorText}>{errors.mobile}</div>}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={label}>Street</label>
            <input
              style={{ ...inputBase, borderColor: errors.street ? "#D9532F" : inputBase.border }}
              placeholder="Enter street"
              value={street}
              onChange={(e) => { setStreet(e.target.value); if (errors.street) setErrors((p) => ({ ...p, street: null })); }}
            />
            {errors.street && <div style={errorText}>{errors.street}</div>}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={label}>Chandha amount</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9A8858", fontSize: "15px" }}>₹</span>
              <input
                style={{ ...inputBase, paddingLeft: "28px", borderColor: errors.amount ? "#D9532F" : inputBase.border }}
                type="number"
                min="0"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); if (errors.amount) setErrors((p) => ({ ...p, amount: null })); }}
              />
            </div>
            {errors.amount && <div style={errorText}>{errors.amount}</div>}
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={label}>Description (optional)</label>
            <textarea
              style={{ ...inputBase, minHeight: "72px", resize: "vertical" }}
              placeholder="Enter description if needed"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: "28px" }}>
            <label style={label}>Payment status</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={() => { setStatus("paid"); if (errors.status) setErrors((p) => ({ ...p, status: null })); }}
                style={{
                  flex: 1, padding: "12px", borderRadius: "10px",
                  border: status === "paid" ? `1.5px solid ${COLORS.green}` : "1px solid #E2D6B4",
                  background: status === "paid" ? COLORS.greenBg : "#FFFDF8",
                  color: status === "paid" ? COLORS.greenText : "#6B5B36",
                  fontWeight: 600, fontSize: "14.5px", cursor: "pointer",
                }}
              >
                Paid
              </button>
              <button
                type="button"
                onClick={() => { setStatus("pending"); if (errors.status) setErrors((p) => ({ ...p, status: null })); }}
                style={{
                  flex: 1, padding: "12px", borderRadius: "10px",
                  border: status === "pending" ? `1.5px solid ${COLORS.amber}` : "1px solid #E2D6B4",
                  background: status === "pending" ? COLORS.amberBg : "#FFFDF8",
                  color: status === "pending" ? COLORS.amberText : "#6B5B36",
                  fontWeight: 600, fontSize: "14.5px", cursor: "pointer",
                }}
              >
                Pending
              </button>
            </div>
            {errors.status && <div style={errorText}>{errors.status}</div>}
          </div>

          {saveError && <div style={{ ...errorText, marginBottom: "14px" }}>{saveError}</div>}

          <button
            onClick={handleAdd}
            disabled={saving}
            style={{
              width: "100%", padding: "13px", borderRadius: "10px", border: "none",
              background: `linear-gradient(180deg, ${COLORS.goldBright}, ${COLORS.gold})`,
              color: "#2A2115", fontSize: "15px", fontWeight: 700,
              cursor: saving ? "default" : "pointer", opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "Saving…" : "Add"}
          </button>
        </div>

        {entryCount > 0 && (
          <button
            onClick={onViewList}
            style={{ display: "block", margin: "18px auto 0", background: "none", border: "none", color: COLORS.creamMuted, fontSize: "14px", cursor: "pointer", textDecoration: "underline" }}
          >
            View chandha list ({entryCount})
          </button>
        )}
      </div>
    </div>
  );
}
