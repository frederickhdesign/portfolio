
"use client";

import { usePathname } from "next/navigation";

export default function MobilePortfolioNotice() {
  const pathname = usePathname();

  if (pathname !== "/") return null;

  return (
    <div className="mobile-portfolio-notice">
      <div className="mobile-notice-content">
        <div
          className="mobile-notice-icon"
          style={{
            width: "110px",
            height: "110px",
            minWidth: "110px",
            minHeight: "110px",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "visible",
          }}
        >
          <img
            src="/Sprites/LOGOFH.webp"
            alt="Frederick Harden Logo"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              imageRendering: "auto",
              display: "block",
            }}
          />
        </div>

        <h1>BEST VIEWED ON DESKTOP.</h1>

        <p>
          My new interactive portfolio is currently designed
          for desktop and doesn&apos;t fully support mobile devices.
          <br />
          <br />
          You can still explore my previous portfolio below.
        </p>

        <a href="/old" className="mobile-notice-button">
          VIEW OLD PORTFOLIO ↗
        </a>

        <span className="mobile-notice-footer">
          FREDERICK HARDEN — PORTFOLIO
        </span>
      </div>
    </div>
  );
}
