"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { PortfolioEntry } from "./ProjectData";

type ProjectCardProps = {
  project: PortfolioEntry;
  gridSize?: number;
  onClick?: () => void;
  children?: ReactNode;
};

const FORMAT_LABELS: Record<PortfolioEntry["format"], string> = {
  graphic: "Graphic Design",
  ui: "UI Design",
  branding: "Branding",
  editorial: "Editorial",
  web: "Web Design",
  game: "Game Design",
  typography: "Typography",
};

export default function ProjectCard({
  project,
  gridSize = 36,
  onClick,
  children,
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const previewSize = gridSize * 10;
  const infoHeight = gridSize * 3;

  return (
    <>
      <button
        type="button"
        className={`project-card ${isHovered ? "is-hovered" : ""}`}
        style={
          {
            "--project-preview-size": `${previewSize}px`,
            "--project-info-height": `${infoHeight}px`,
          } as CSSProperties
        }
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        onClick={onClick}
      >
        {/* =========================
            PREVIEW
        ========================= */}

        <div className="project-card-preview">
          <img
            className="project-card-image"
            src={project.cover}
            alt={project.title}
            draggable={false}
          />

          {/* Dark hover overlay */}
          <div className="project-card-shade" />

          {/* Category appears on hover */}
          <div className="project-card-format">
            {FORMAT_LABELS[project.format]}
          </div>

          {children}
        </div>

        {/* =========================
            INFO BAR
        ========================= */}

        <div className="project-card-info">
          <h2 className="project-card-title">
            {project.title}
          </h2>

          <span
            className="project-card-arrow"
            aria-hidden="true"
          >
            <span className="project-card-arrow-line" />
          </span>
        </div>
      </button>

      <style jsx>{`
        /* =========================================
           CARD
        ========================================= */

        .project-card {
          position: relative;
          display: block;

          width: var(--project-preview-size);

          margin: 0;
          padding: 0;

          border: 0;
          outline: none;

          background: transparent;

          color: #fff;
          text-align: left;

          cursor: pointer;

          overflow: visible;
        }

        /* =========================================
           PREVIEW
        ========================================= */

        .project-card-preview {
          position: relative;

          box-sizing: border-box;

          width: var(--project-preview-size);
          height: var(--project-preview-size);

          overflow: hidden;

          border: 1px solid rgba(255, 255, 255, 0.9);

          background: #000;
        }

        .project-card-image {
          position: absolute;

          inset: 0;

          width: 100%;
          height: 100%;

          display: block;

          object-fit: cover;

          pointer-events: none;
          user-select: none;
        }

        /* =========================================
           DARK HOVER OVERLAY
        ========================================= */

        .project-card-shade {
          position: absolute;

          inset: 0;

          z-index: 2;

          background: rgba(0, 0, 0, 0);

          pointer-events: none;

          transition:
            background 180ms ease;
        }

        /* =========================================
           CATEGORY TEXT
        ========================================= */

        .project-card-format {
          position: absolute;

          left: 50%;
          top: 50%;

          z-index: 3;

          transform:
            translate(-50%, -50%)
            translateY(8px);

          color: #fff;

          font-size: 28px;
          line-height: 1;

          font-weight: 600;

          letter-spacing: -0.035em;

          white-space: nowrap;

          opacity: 0;

          pointer-events: none;

          transition:
            opacity 160ms ease,
            transform 240ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* =========================================
           BOTTOM INFO BAR
        ========================================= */

        .project-card-info {
          position: relative;

          box-sizing: border-box;

          width: var(--project-preview-size);
          height: var(--project-info-height);

          display: flex;

          align-items: center;
          justify-content: space-between;

          padding: 0 22px;

          margin-top: -1px;

          border: 1px solid rgba(255, 255, 255, 0.9);

          background:
  linear-gradient(
    90deg,
    rgba(80, 225, 235, 0.16) 0%,
    rgba(80, 225, 235, 0.09) 5%,
    rgba(80, 225, 235, 0.035) 10%,
    rgba(0, 0, 0, 0) 42%,
    rgba(0, 0, 0, 0) 58%,
    rgba(235, 75, 70, 0.03) 90%,
    rgba(235, 75, 70, 0.085) 95%,
    rgba(235, 75, 70, 0.15) 100%
  ),
            #000;
        }

        .project-card-title {
          max-width: calc(100% - 78px);

          margin: 0;

          color: #fff;

          font-size: 27px;
          line-height: 1.04;

          font-weight: 700;

          letter-spacing: -0.04em;
        }

        /* =========================================
           ARROW
        ========================================= */

        .project-card-arrow {
          position: relative;

          flex: 0 0 auto;

          width: 52px;
          height: 52px;

          margin-left: 16px;

          pointer-events: none;

          transition:
            transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .project-card-arrow::before {
          content: "";

          position: absolute;

          right: 3px;
          top: 3px;

          width: 35px;
          height: 35px;

          border-top: 1px solid rgba(255, 255, 255, 0.95);
          border-right: 1px solid rgba(255, 255, 255, 0.95);
        }

        .project-card-arrow-line {
          position: absolute;

          right: 3px;
          top: 3px;

          width: 50px;
          height: 1px;

          background: rgba(255, 255, 255, 0.95);

          transform-origin: right center;
          transform: rotate(-45deg);
        }

        /* =========================================
           HOVER STATE
        ========================================= */

        .project-card.is-hovered .project-card-preview {
          border-width: 2px;
          border-color: #fff;
        }

        .project-card.is-hovered .project-card-info {
          border-width: 2px;
          border-color: #fff;
        }

        .project-card.is-hovered .project-card-shade {
          background: rgba(0, 0, 0, 0.62);
        }

        .project-card.is-hovered .project-card-format {
          opacity: 1;

          transform:
            translate(-50%, -50%)
            translateY(0);
        }

        .project-card.is-hovered .project-card-arrow {
          transform: translate(5px, -5px);
        }
      `}</style>
    </>
  );
}