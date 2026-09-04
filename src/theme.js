export const COLORS = {
  bg: "#181410",
  bgAlt: "#1F1913",
  card: "#FFFCF5",
  gold: "#C9A24B",
  goldBright: "#E4C46A",
  goldDeep: "#8A6A2A",
  maroon: "#7A1F2B",
  ink: "#2A2115",
  cream: "#F3EAD3",
  creamMuted: "#C9BFA5",
  green: "#1FA153",
  greenBg: "#DBF3E2",
  greenText: "#0F6B33",
  amber: "#E08A00",
  amberBg: "#FDECC8",
  amberText: "#A35C00",
};

export const SERIF = "'Georgia', 'Times New Roman', serif";

export const pageBase = {
  minHeight: "100vh",
  background: `
    linear-gradient(135deg, rgba(24, 20, 16, 0.92) 0%, rgba(31, 25, 19, 0.92) 100%),
    url('/ganesha-bg.png') center/cover no-repeat
  `,
  backgroundAttachment: "fixed",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  color: COLORS.cream,
  padding: "40px 20px",
  boxSizing: "border-box",
  position: "relative",
  overflow: "hidden",
};

export const card = {
  background: COLORS.card,
  borderRadius: "16px",
  border: `1px solid ${COLORS.goldDeep}55`,
  boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
};

export function formatINR(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}
