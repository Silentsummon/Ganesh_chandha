import { COLORS } from "../theme";

export function Watermark({ opacity = 0.07, size = 520 }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <img
        src="/logo.webp"
        alt=""
        style={{ width: size, height: size, opacity, filter: "grayscale(15%)" }}
      />
    </div>
  );
}

export function Crest({ size = 40 }) {
  return (
    <img
      src="/logo.webp"
      alt="Lakshmi Narasima Swamy Youth Association"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `1.5px solid ${COLORS.gold}`,
        objectFit: "cover",
      }}
    />
  );
}
