import { COLORS, SERIF, pageBase, card } from "../theme";
import { Watermark, Crest } from "../components/Logo";

export default function Home({ onAdd, onViewList }) {
  return (
    <div style={{
      ...pageBase,
      background: `
        linear-gradient(135deg, rgba(24, 20, 16, 0.93) 0%, rgba(31, 25, 19, 0.93) 100%),
        url('/ganesha-bg.png') center/cover no-repeat
      `,
      backgroundAttachment: "fixed",
    }}>
      <Watermark opacity={0.09} size={560} />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "480px",
          margin: "40px auto 0",
          textAlign: "center",
        }}
      >
        <Crest size={92} />
        <div
          style={{
            marginTop: "22px",
            fontSize: "12px",
            fontWeight: 700,
            color: COLORS.gold,
            letterSpacing: "0.12em",
          }}
        >
          LAKSHMI NARASIMA SWAMY YOUTH ASSOCIATION
        </div>
        <h1
          style={{
            fontFamily: SERIF,
            fontSize: "32px",
            fontWeight: 700,
            margin: "10px 0 0",
            color: COLORS.goldBright,
          }}
        >
          Chandha Management
        </h1>
        <p
          style={{
            fontSize: "15px",
            color: COLORS.creamMuted,
            margin: "12px 0 36px",
            lineHeight: 1.6,
          }}
        >
          Record member contributions and track who has paid and who is
          still pending, all in one place.
        </p>

        <div style={{ ...card, padding: "28px", textAlign: "left" }}>
          <button
            onClick={onAdd}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "10px",
              border: "none",
              background: `linear-gradient(180deg, ${COLORS.goldBright}, ${COLORS.gold})`,
              color: "#2A2115",
              fontSize: "15.5px",
              fontWeight: 700,
              cursor: "pointer",
              marginBottom: "12px",
            }}
          >
            Add a chandha
          </button>
          <button
            onClick={onViewList}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: "10px",
              border: `1px solid ${COLORS.goldDeep}88`,
              background: "transparent",
              color: COLORS.ink,
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            View chandha list
          </button>
        </div>
      </div>
    </div>
  );
}
