"use client";

import { useState } from "react";
import ProjectCard from "./ProjectCard";
import type { PortfolioEntry, ProjectImage } from "./ProjectData";

type TypographyProjectProps = {
  project: PortfolioEntry;
  gridSize: number;
  onOpen?: (project: PortfolioEntry) => void;
  onClose?: (project: PortfolioEntry) => void;
};

export default function TypographyProject({
  project,
  gridSize,
  onOpen,
  onClose,
}: TypographyProjectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const [testText, setTestText] = useState("");

  const closedWidth = gridSize * 10;
  const closedHeight = gridSize * 13;

  const openWidth = gridSize * 30;
  const openHeight = gridSize * 20;

  const typography = project.typography;

  if (!typography) {
    return (
      <ProjectCard
        project={project}
        gridSize={gridSize}
      />
    );
  }

  const openProject = () => {
    setShowImages(false);
    setIsOpen(true);
    onOpen?.(project);
  };

  const closeProject = () => {
    setShowImages(false);
    setTestText("");
    setIsOpen(false);
    onClose?.(project);
  };

  const getImageSrc = (
    image: string | ProjectImage
  ) => {
    if (typeof image === "string") {
      return image;
    }

    return image.src;
  };

  return (
    <div
      className={`typography-project ${
        isOpen ? "is-open" : ""
      }`}
      style={{
        width: `${
          isOpen ? openWidth : closedWidth
        }px`,
        height: `${
          isOpen ? openHeight : closedHeight
        }px`,
        left: `${closedWidth / 2}px`,
        top: `${closedHeight / 2}px`,
        transform: "translate(-50%, -50%)",
        transformOrigin: "center",
        fontFamily: `"${typography.fontFamily}", monospace`,
      }}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerMove={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();

        if (!isOpen) {
          openProject();
        }
      }}
    >
      <div
        className={`closed-card ${
          isOpen ? "hidden" : ""
        }`}
      >
        <ProjectCard
          project={project}
          gridSize={gridSize}
        />
      </div>

      <div
        className={`open-project ${
          isOpen ? "visible" : ""
        }`}
      >
        <div className="page-viewport">
          <div
            className={`typography-page project-page ${
              showImages ? "page-left" : "page-active"
            }`}
          >
            <div className="typography-panel">
              <aside className="typography-info">
                <h2
                  style={{
                    fontSize: `${
                      typography.sectionTitleStyle
                        ?.fontSize ??
                      gridSize * 1.35
                    }px`,
                    lineHeight:
                      typography.sectionTitleStyle
                        ?.lineHeight ?? 0.9,
                    letterSpacing: `${
                      typography.sectionTitleStyle
                        ?.letterSpacing ?? 0
                    }px`,
                    transform: `translate(
                      ${
                        typography.sectionTitleStyle
                          ?.x ?? 0
                      }px,
                      ${
                        typography.sectionTitleStyle
                          ?.y ?? 0
                      }px
                    )`,
                  }}
                >
                  {project.format.toUpperCase()}
                </h2>

                <div className="description-wrap">
                  <p
                    style={{
                      fontSize: `${
                        typography.descriptionStyle
                          ?.fontSize ??
                        gridSize * 0.47
                      }px`,
                      lineHeight:
                        typography.descriptionStyle
                          ?.lineHeight ?? 1.55,
                      letterSpacing: `${
                        typography.descriptionStyle
                          ?.letterSpacing ?? 0
                      }px`,
                      transform: `translate(
                        ${
                          typography.descriptionStyle
                            ?.x ?? 0
                        }px,
                        ${
                          typography.descriptionStyle
                            ?.y ?? 0
                        }px
                      )`,
                    }}
                  >
                    {project.description}
                  </p>
                </div>
              </aside>

              <div className="typography-divider" />

              <main className="typography-main">
                <div className="type-content">
                  <h1
                    style={{
                      fontSize: `${
                        typography.displayTitleStyle
                          ?.fontSize ??
                        gridSize * 5.4
                      }px`,
                      lineHeight:
                        typography.displayTitleStyle
                          ?.lineHeight ?? 0.88,
                      letterSpacing: `${
                        typography.displayTitleStyle
                          ?.letterSpacing ?? -1.2
                      }px`,
                      transform: `translate(
                        ${
                          typography.displayTitleStyle
                            ?.x ?? 0
                        }px,
                        ${
                          typography.displayTitleStyle
                            ?.y ?? 0
                        }px
                      )`,
                    }}
                  >
                    {typography.displayName}
                  </h1>

                  <div
                    className="character-set"
                    style={{
                      fontFamily: `"${typography.fontFamily}", monospace`,
                      fontSize: `${
                        typography.characterStyle
                          ?.fontSize ??
                        gridSize * 1.33
                      }px`,
                      lineHeight:
                        typography.characterStyle
                          ?.lineHeight ?? 1.18,
                      letterSpacing: `${
                        typography.characterStyle
                          ?.letterSpacing ?? 0
                      }px`,
                      transform: `translate(
                        ${
                          typography.characterStyle
                            ?.x ?? 0
                        }px,
                        ${
                          typography.characterStyle
                            ?.y ?? 0
                        }px
                      )`,
                    }}
                  >
                    {typography.uppercase && (
                      <div>{typography.uppercase}</div>
                    )}

                    {typography.lowercase && (
                      <div>{typography.lowercase}</div>
                    )}

                    {typography.numbers && (
                      <div>{typography.numbers}</div>
                    )}

                    {typography.symbols && (
                      <div>{typography.symbols}</div>
                    )}
                  </div>
                </div>

                <div className="tester">
                  <div className="tester-divider" />

                  <p
                    style={{
                      fontSize: `${
                        typography.testerLabelStyle
                          ?.fontSize ??
                        gridSize * 0.48
                      }px`,
                      lineHeight:
                        typography.testerLabelStyle
                          ?.lineHeight ?? 1,
                      letterSpacing: `${
                        typography.testerLabelStyle
                          ?.letterSpacing ?? 0
                      }px`,
                      transform: `translate(
                        ${
                          typography.testerLabelStyle
                            ?.x ?? 0
                        }px,
                        ${
                          typography.testerLabelStyle
                            ?.y ?? 0
                        }px
                      )`,
                    }}
                  >
                    {typography.testerLabel}
                  </p>

                  <div className="tester-input-wrap">
                    <input
                      value={testText}
                      onChange={(e) =>
                        setTestText(e.target.value)
                      }
                      placeholder={
                        typography.testerPlaceholder
                      }
                      spellCheck={false}
                      style={{
                        fontFamily: `"${typography.fontFamily}", monospace`,
                        fontSize: `${
                          typography.testerInputStyle
                            ?.fontSize ??
                          gridSize * 1.05
                        }px`,
                        lineHeight:
                          typography.testerInputStyle
                            ?.lineHeight ?? 1,
                        letterSpacing: `${
                          typography.testerInputStyle
                            ?.letterSpacing ?? 0
                        }px`,
                        transform: `translate(
                          ${
                            typography.testerInputStyle
                              ?.x ?? 0
                          }px,
                          ${
                            typography.testerInputStyle
                              ?.y ?? 0
                          }px
                        )`,
                      }}
                    />
                  </div>
                </div>
              </main>
            </div>
          </div>

          <div
            className={`image-page project-page ${
              showImages ? "page-active" : "page-right"
            }`}
          >
            <div className="image-panel">
              <div className="image-grid">
                {project.images
                  .slice(0, 2)
                  .map((image, index) => (
                    <div
                      key={`${getImageSrc(
                        image
                      )}-${index}`}
                      className="image-slot"
                    >
                      <img
                        src={getImageSrc(image)}
                        alt={`${project.title} ${
                          index + 1
                        }`}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <button
          className={`next-button ${
            showImages ? "arrow-hidden" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setShowImages(true);
          }}
          aria-label="View project images"
          tabIndex={showImages ? -1 : 0}
        >
          <span />
        </button>

        <button
          className={`back-button ${
            showImages ? "" : "arrow-hidden"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setShowImages(false);
          }}
          aria-label="Back to typography"
          tabIndex={showImages ? 0 : -1}
        >
          <span />
        </button>
      </div>

      {isOpen && (
        <button
          className="close-button"
          onClick={(e) => {
            e.stopPropagation();
            closeProject();
          }}
          aria-label="Close project"
        >
          ×
        </button>
      )}

      <style jsx>{`
        .typography-project {
          position: absolute;
          color: white;
          box-sizing: border-box;
          transition:
            width 650ms
              cubic-bezier(0.22, 1, 0.36, 1),
            height 650ms
              cubic-bezier(0.22, 1, 0.36, 1);
          will-change: width, height;
        }

        .closed-card {
          position: absolute;
          inset: 0;
          z-index: 2;
          opacity: 1;
          transform: scale(1);
          transition:
            opacity 180ms ease,
            transform 350ms
              cubic-bezier(0.22, 1, 0.36, 1);
          pointer-events: auto;
        }

        .closed-card.hidden {
          opacity: 0;
          transform: scale(1.04);
          pointer-events: none;
        }

        .open-project {
          position: absolute;
          inset: 0;
          z-index: 1;
          opacity: 0;
          transform: scale(0.985);
          overflow: visible;
          transition:
            opacity 280ms ease 180ms,
            transform 500ms
              cubic-bezier(0.22, 1, 0.36, 1);
          pointer-events: none;
        }

        .open-project.visible {
          opacity: 1;
          transform: scale(1);
          pointer-events: auto;
        }

        .page-viewport {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .project-page {
          position: absolute;
          inset: 0;
          opacity: 1;
          will-change: transform;
          transition:
            transform 620ms
              cubic-bezier(0.76, 0, 0.24, 1),
            opacity 260ms ease;
        }

        .project-page.page-active {
          transform: translateX(0);
          opacity: 1;
          pointer-events: auto;
        }

        .project-page.page-left {
          transform: translateX(-100%);
          opacity: 0.35;
          pointer-events: none;
        }

        .project-page.page-right {
          transform: translateX(100%);
          opacity: 0.35;
          pointer-events: none;
        }

        .typography-panel,
        .image-panel {
          position: absolute;
          inset: 0;
          display: flex;
          overflow: hidden;
          box-sizing: border-box;
          border: 2px solid
            rgba(255, 255, 255, 0.95);
          background:
            linear-gradient(
              rgba(80, 225, 235, 0.16) 0%,
              rgba(80, 225, 235, 0.09) 5%,
              rgba(80, 225, 235, 0.035) 10%,
              rgba(0, 0, 0, 0) 42%,
              rgba(0, 0, 0, 0) 58%,
              rgba(235, 75, 70, 0.03) 90%,
              rgba(235, 75, 70, 0.085) 95%,
              rgba(235, 75, 70, 0.15) 100%
            ),
            rgba(0, 0, 0, 0.75);
        }

        .typography-info {
          position: relative;
          width: 28%;
          flex-shrink: 0;
          box-sizing: border-box;
          padding:
            ${gridSize * 0.85}px
            ${gridSize * 0.7}px
            ${gridSize * 0.7}px
            ${gridSize * 0.95}px;
        }

        .typography-info h2 {
          margin: 0 0 ${gridSize * 0.6}px;
          font-weight: normal;
          white-space: nowrap;
        }

        .description-wrap {
          position: relative;
          height: ${gridSize * 16}px;
          padding-right: ${gridSize * 0.45}px;
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: thin;
          scrollbar-color:
            white
            rgba(255, 255, 255, 0.2);
        }

        .description-wrap::-webkit-scrollbar {
          width: 3px;
        }

        .description-wrap::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 999px;
        }

        .description-wrap::-webkit-scrollbar-thumb {
          background: white;
          border-radius: 999px;
        }

        .description-wrap::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.75);
        }

        .description-wrap p {
          margin: 0;
          white-space: pre-line;
        }

        .typography-divider {
          width: 2px;
          flex-shrink: 0;
          margin:
            ${gridSize * 0.9}px
            0
            ${gridSize * 1.45}px;
          background: rgba(255, 255, 255, 0.95);
        }

        .typography-main {
          min-width: 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          padding:
            ${gridSize * 0.75}px
            ${gridSize * 3}px
            ${gridSize * 1.35}px
            ${gridSize * 0.55}px;
          box-sizing: border-box;
        }

        .type-content {
          min-height: 0;
        }

        .type-content h1 {
          margin: 0;
          font-weight: normal;
          white-space: nowrap;
        }

        .character-set {
          margin-top: ${gridSize * 0.45}px;
          white-space: nowrap;
          overflow: hidden;
        }

        .tester {
          margin-top: ${gridSize * 0.45}px;
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .tester-divider {
          width: 100%;
          height: 2px;
          flex-shrink: 0;
          background: rgba(255, 255, 255, 0.95);
        }

        .tester p {
          margin:
            ${gridSize * 0.25}px
            0
            0;
        }

        .tester-input-wrap {
          flex: 1;
          display: flex;
          align-items: flex-end;
          padding-bottom:
            ${gridSize * 0.05}px;
        }

        .tester-input-wrap input {
          width: 100%;
          box-sizing: border-box;
          padding:
            0
            ${gridSize * 0.2}px
            ${gridSize * 0.25}px;
          border: none;
          border-bottom: 2px solid white;
          outline: none;
          background: transparent;
          color: white;
        }

        .tester-input-wrap input::placeholder {
          color: rgba(255, 255, 255, 0.45);
          opacity: 1;
        }

        .next-button,
        .back-button {
          position: absolute;
          top: 50%;
          width: ${gridSize * 1.55}px;
          height: ${gridSize * 3.1}px;
          padding: 0;
          border: 0;
          outline: 0;
          background: transparent;
          transform: translateY(-50%);
          cursor: pointer;
          opacity: 1;
          transition:
            opacity 180ms ease,
            transform 160ms
              cubic-bezier(0.16, 1, 0.3, 1);
        }

        .next-button {
          right: ${gridSize * -2}px;
        }

        .back-button {
          left: ${gridSize * -2}px;
        }

        .next-button.arrow-hidden,
        .back-button.arrow-hidden {
          opacity: 0;
          pointer-events: none;
        }

        .next-button span,
        .back-button span {
          position: absolute;
          inset: 0;
        }

        .next-button span::before,
        .next-button span::after,
        .back-button span::before,
        .back-button span::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 2px;
          height: 58%;
          background: white;
          transform-origin: center;
        }

        .next-button span::before {
          transform:
            translate(-50%, -91%)
            rotate(-35deg);
        }

        .next-button span::after {
          transform:
            translate(-50%, -9%)
            rotate(35deg);
        }

        .back-button span::before {
          transform:
            translate(-50%, -91%)
            rotate(35deg);
        }

        .back-button span::after {
          transform:
            translate(-50%, -9%)
            rotate(-35deg);
        }

        .next-button:hover,
        .back-button:hover {
          transform:
            translateY(-50%)
            scale(1.08);
        }

        .close-button {
          position: absolute;
          top: ${gridSize * 0.25}px;
          right: ${gridSize * 0.3}px;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          width: ${gridSize * 0.65}px;
          height: ${gridSize * 0.65}px;
          padding: 0;
          border: 0;
          background: transparent;
          color: rgba(255, 255, 255, 0.7);
          font-family: inherit;
          font-size: ${gridSize * 0.65}px;
          line-height: 1;
          cursor: pointer;
        }

        .close-button:hover {
          color: white;
        }

        .image-panel {
          padding: ${gridSize * 0.7}px;
        }

        .image-grid {
          width: 100%;
          height: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: ${gridSize * 0.55}px;
        }

        .image-slot {
          min-width: 0;
          min-height: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .image-slot img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      `}</style>
    </div>
  );
}