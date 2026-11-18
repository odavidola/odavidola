import { ImageResponse } from "next/og";

export const alt = "David Olagunju — Senior AI Product Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#f5f4ef", color: "#15110e" }}>
        <div style={{ fontSize: 26, letterSpacing: 4, textTransform: "uppercase", color: "#2b4bff" }}>Senior AI Product Engineer</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 132, lineHeight: 1, fontWeight: 800, letterSpacing: -4 }}>David Olagunju</div>
          <div style={{ fontSize: 34, marginTop: 28, color: "#4a423a" }}>Moko · Ebb · Marex · JPMorgan · BNP Paribas</div>
        </div>
        <div style={{ fontSize: 24, color: "#7a7066" }}>odavidola.com</div>
      </div>
    ),
    size,
  );
}
