
"use client";

import { useState } from "react";
import ProjectCard from "./ProjectCard";
import type { PortfolioEntry, ProjectImage } from "./ProjectData";

type BrandingProjectProps = {
  project: PortfolioEntry;
  gridSize: number;
  onOpen?: (project: PortfolioEntry) => void;
  onClose?: (project: PortfolioEntry) => void;
};

export default function BrandingProject({
  project,
  gridSize,
  onOpen,
  onClose,
}: BrandingProjectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCycling, setIsCycling] = useState(false);

  const images = project.images
    .map((image: string | ProjectImage) =>
      typeof image === "string" ? image : image.src
    )
    .filter((src) => Boolean(src && src.trim() && src !== "#"));

  const total = images.length;

  const closedWidth = gridSize * 10;
  const closedHeight = gridSize * 13;
  const openSize = gridSize * 14;

  const stackWidth = gridSize * 12;
  const stackHeight = gridSize * 12;

  const stackGap = gridSize * 3;

  const stackLeft = openSize + stackGap;

  const cycleDuration = 600;

  const openProject = () => {
    setActiveIndex(0);
    setIsCycling(false);
    setIsOpen(true);
    onOpen?.(project);
  };

  const closeProject = () => {
    setIsOpen(false);
    setIsCycling(false);
    setActiveIndex(0);
    onClose?.(project);
  };

  const cycleImage = () => {
    if (total < 2 || isCycling) return;

    setIsCycling(true);

    window.setTimeout(() => {
      setActiveIndex((index) => (index + 1) % total);
      setIsCycling(false);
    }, cycleDuration);
  };

  const getStackPosition = (index: number) => {
    if (total === 0) return 0;

    return (index - activeIndex + total) % total;
  };

  const getStackStyle = (index: number): React.CSSProperties => {
    const position = getStackPosition(index);

    const visibleCount = Math.min(total, 5);

    if (position >= visibleCount) {
      return {
        opacity: 0,
        pointerEvents: "none",
        transform:
          "translate(-50%, -50%) scale(0.8)",
        zIndex: 0,
      };
    }

    const spread = Math.min(position, 4);

    const rotations = [9, 4, -3, -8, -12];
    const offsetsX = [0, -12, -24, -36, -48];
    const offsetsY = [0, -10, -18, -26, -34];

    const isFront = position === 0;

    const x = offsetsX[spread] * (gridSize / 36);
    const y = offsetsY[spread] * (gridSize / 36);

    const rotation = rotations[spread];

    const cyclingTransform =
      isFront && isCycling
        ? `translate(
            calc(-50% + ${gridSize * 8}px),
            calc(-50% - ${gridSize * 1.5}px)
          ) rotate(28deg) scale(0.94)`
        : `translate(
            calc(-50% + ${x}px),
            calc(-50% + ${y}px)
          ) rotate(${rotation}deg) scale(${1 - spread * 0.025})`;

    return {
      transform: cyclingTransform,
      opacity: isFront && isCycling ? 0 : 1,
      zIndex: visibleCount - position,
      pointerEvents: isFront && !isCycling ? "auto" : "none",
    };
  };

  return (
    <div
      className={`branding-project ${isOpen ? "is-open" : ""}`}
      style={{
        width: closedWidth,
        height: closedHeight,
      }}
    >
      <div
        className="branding-project-main"
        onClick={(event) => {
          event.stopPropagation();

          if (isOpen) {
            closeProject();
          } else {
            openProject();
          }
        }}
        onPointerDown={(event) => {
          event.stopPropagation();
        }}
      >
        <div className="branding-project-visual">
          <ProjectCard
            project={project}
            gridSize={gridSize}
          />
        </div>

        <div className="branding-project-text">
          <button
            type="button"
            className="branding-project-close"
            aria-label="Close project"
            onClick={(event) => {
              event.stopPropagation();
              closeProject();
            }}
          >
            ×
          </button>

          <div className="branding-project-description">
            <h2>{project.title}</h2>

            <div className="branding-project-description-scroll">
              <p>{project.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="branding-stack">
        {images.map((src, index) => {
          const position = getStackPosition(index);
          const isFront = position === 0;

          return (
            <button
              key={`${src}-${index}`}
              type="button"
              className="branding-stack-card"
              style={getStackStyle(index)}
              tabIndex={isOpen && isFront ? 0 : -1}
              aria-label={
                isFront
                  ? "Show next branding image"
                  : `Branding image ${index + 1}`
              }
              onClick={(event) => {
                event.stopPropagation();
                cycleImage();
              }}
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
            >
              <img
                src={src}
                alt={`${project.title} branding image ${index + 1}`}
                draggable={false}
              />
            </button>
          );
        })}
      </div>

      <style jsx>{`
        .branding-project {
          position: relative;
          overflow: visible;
          color: #fff;
        }

        .branding-project-main {
          position: absolute;
          left: 50%;
          top: ${closedHeight / 2}px;
          width: ${closedWidth}px;
          height: ${closedHeight}px;
          transform: translate(-50%, -50%);
          transform-origin: center;
          cursor: pointer;
          overflow: hidden;
          z-index: 10;
          border: 0 solid rgba(255, 255, 255, 0.95);
          background: #000;
          box-sizing: border-box;
          transition:
            width 480ms cubic-bezier(0.16, 1, 0.3, 1),
            height 480ms cubic-bezier(0.16, 1, 0.3, 1),
            top 480ms cubic-bezier(0.16, 1, 0.3, 1),
            border-width 180ms ease,
            opacity 220ms ease,
            transform 220ms ease;
        }

        .branding-project.is-open .branding-project-main {
          width: ${openSize}px;
          height: ${openSize}px;
          top: ${closedWidth / 2}px;
          border-width: 2px;
        }

        .branding-project-visual {
          position: absolute;
          inset: 0;
          opacity: 1;
          transform: scale(1);
          transform-origin: center;
          pointer-events: auto;
          transition:
            opacity 220ms ease,
            transform 480ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .branding-project.is-open .branding-project-visual {
          opacity: 0;
          transform: scale(1.08);
          pointer-events: none;
        }

        .branding-project-text {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.86);
          opacity: 0;
          pointer-events: none;
          transition: opacity 260ms ease 120ms;
        }

        .branding-project.is-open .branding-project-text {
          opacity: 1;
          pointer-events: auto;
        }

        .branding-project-description {
          position: absolute;
          inset: ${gridSize * 0.85}px;
          display: flex;
          flex-direction: column;
          opacity: 0;
          transform: translateY(${gridSize * 0.4}px);
          transition:
            opacity 220ms ease,
            transform 320ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .branding-project.is-open .branding-project-description {
          opacity: 1;
          transform: translateY(0);
          transition:
            opacity 220ms ease 220ms,
            transform 320ms cubic-bezier(0.16, 1, 0.3, 1) 180ms;
        }

        .branding-project-description h2 {
          margin: 0 0 ${gridSize * 0.55}px;
          font-size: ${gridSize * 0.75}px;
          line-height: 1;
          font-weight: 700;
          letter-spacing: -0.035em;
        }

        .branding-project-description-scroll {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          padding-right: ${gridSize * 0.55}px;
          scrollbar-width: thin;
          scrollbar-color:
            rgba(255, 255, 255, 0.9)
            rgba(255, 255, 255, 0.08);
        }

        .branding-project-description-scroll::-webkit-scrollbar {
          width: ${gridSize * 0.25}px;
        }

        .branding-project-description-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 999px;
        }

        .branding-project-description-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 999px;
        }

        .branding-project-description p {
          margin: 0;
          white-space: pre-line;
          font-size: ${gridSize * 0.48}px;
          line-height: 1.35;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.94);
        }

        .branding-project-close {
          position: absolute;
          top: ${gridSize * 0.3}px;
          right: ${gridSize * 0.3}px;
          z-index: 20;
          padding: 0;
          border: 0;
          background: transparent;
          color: rgba(255, 255, 255, 0.9);
          font-family: inherit;
          font-size: ${gridSize * 0.65}px;
          font-weight: 400;
          line-height: 1;
          cursor: pointer;
        }

        .branding-project-close:hover {
          color: #fff;
        }

        .branding-stack {
          position: absolute;
          left: ${stackLeft}px;
          top: ${closedWidth / 2}px;
          width: ${stackWidth}px;
          height: ${stackHeight}px;
          transform: translateY(-50%);
          opacity: 0;
          pointer-events: none;
          z-index: 15;
          transition:
            opacity 350ms ease,
            transform 480ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .branding-project.is-open .branding-stack {
          opacity: 1;
          pointer-events: auto;
        }

        .branding-stack-card {
          position: absolute;
          left: 50%;
          top: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          width: ${stackWidth}px;
          height: ${stackHeight}px;
          padding: 0;
          border: 0;
          background: transparent;
          cursor: pointer;
          transform-origin: center;
          transition:
            transform ${cycleDuration}ms
              cubic-bezier(0.16, 1, 0.3, 1),
            opacity ${cycleDuration}ms ease;
            user-select: none;
-webkit-user-select: none;
-webkit-tap-highlight-color: transparent;
        }

        .branding-stack-card img {
          display: block;
          width: auto;
          height: auto;
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border: 2px solid rgba(255, 255, 255, 0.95);
          box-sizing: border-box;
          pointer-events: none;
          user-select: none;
-webkit-user-select: none;
-webkit-user-drag: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .branding-project-main,
          .branding-project-visual,
          .branding-project-text,
          .branding-project-description,
          .branding-stack,
          .branding-stack-card {
            transition-duration: 0ms;
          }
        }
      `}</style>
    </div>
  );
}
