"use client";

import { useMemo, useRef, useState } from "react";
import {
  portfolioEntries,
  portfolioFilters,
  type PortfolioEntry,
  type PortfolioFilter,
} from "./PORTFOLIODATA";

type OverlayView = "portfolio" | "settings" | null;

export default function PORTFOLIOPAGE() {
  const [activeOverlay, setActiveOverlay] = useState<OverlayView>(null);
  const [activeFilter, setActiveFilter] = useState<PortfolioFilter>("ALL");
  const [selectedProject, setSelectedProject] = useState<PortfolioEntry | null>(
    null
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState("RED");
  const [floatMode, setFloatMode] = useState(false);

  const hoverAudioRef = useRef<HTMLAudioElement | null>(null);
const clickAudioRef = useRef<HTMLAudioElement | null>(null);

const playHoverSound = () => {
  if (!hoverAudioRef.current) {
    hoverAudioRef.current = new Audio("/audio/BUTTONHOVER.mp3");
    hoverAudioRef.current.volume = 0.45;
  }

  hoverAudioRef.current.currentTime = 0;
  hoverAudioRef.current.play().catch(() => {});
};

const playClickSound = () => {
  if (!clickAudioRef.current) {
    clickAudioRef.current = new Audio("/audio/BUTTON CLICK.mp3");
    clickAudioRef.current.volume = 0.5;
  }

  clickAudioRef.current.currentTime = 0;
  clickAudioRef.current.play().catch(() => {});
};

  const filteredEntries = useMemo(() => {
    if (activeFilter === "ALL") return portfolioEntries;

    return portfolioEntries.filter((entry) =>
      entry.tags.includes(activeFilter)
    );
  }, [activeFilter]);

  const openProject = (entry: PortfolioEntry) => {
    setSelectedProject(entry);
    setSelectedImage(null);
  };

  const closeProject = () => {
    setSelectedProject(null);
    setSelectedImage(null);
  };

  const closeAllOverlays = () => {
    setActiveOverlay(null);
    setSelectedProject(null);
    setSelectedImage(null);
  };

  return (
    <>
      <style jsx global>{`
        @font-face {
          font-family: "Glixels";
          src: url("/Fonts/Glixels-Regular.otf") format("opentype");
          font-display: swap;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          background: #dcdcdc;
        }

        * {
          box-sizing: border-box;
        }

        button,
        a,
        select {
          font: inherit;
        }
      `}</style>

      <div
        className={`wrapper theme-${selectedTheme.toLowerCase()} ${
          floatMode ? "chaos-on" : "chaos-off"
        }`}
      >
        <div className="crt-frame">
          <div className="crt-screen">
            <div className="background-media-layer">
              <video
                className="background-media"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
              >
                <source
                  src="/sprites/BACKGROUNDPORTFOLIO.mp4"
                  type="video/mp4"
                />
              </video>
            </div>

            <div className="screen-left-fade" />
            <div className="screen-vignette" />
            <div className="screen-glow" />
            <div className="screen-noise" />

            <div className="portfolio-ui">
              <div className="topbar">
                <div className="topbar-title">PORTFOLIO</div>

                <a
                  href="https://www.behance.net/hardenfrederick"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="behance-link"
                >
                  BEHANCE
                </a>
              </div>

              <div className="content-area">
                <div className="menu-stack">
                  <button
  className="menu-button"
  onMouseEnter={playHoverSound}
  onClick={() => {
    playClickSound();
    setActiveOverlay("portfolio");
  }}
  type="button"
>
                    <span className="menu-button-accent" />
                    <span className="menu-button-fill" />
                    <span className="menu-button-underline" />
                    <span className="menu-button-label">PORTFOLIO</span>
                  </button>

                  <button
  className="menu-button"
  onMouseEnter={playHoverSound}
  onClick={() => {
    playClickSound();
    setActiveOverlay("settings");
  }}
  type="button"
>
                    <span className="menu-button-accent" />
                    <span className="menu-button-fill" />
                    <span className="menu-button-underline" />
                    <span className="menu-button-label">SETTINGS</span>
                  </button>
                </div>
              </div>

              <div className="floating-footer">
                FREDERICK HARDEN // PORTFOLIO INDEX
              </div>
            </div>

            {activeOverlay && (
              <div className="overlay-shell" onClick={closeAllOverlays}>
                <div
                  className="overlay-panel"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="overlay-panel-glow" />
                  <div className="overlay-panel-noise" />

                  <div className="overlay-content">
                    <div className="overlay-header">
                      <div className="overlay-title">
                        {activeOverlay === "portfolio" ? "MY WORK" : "SETTINGS"}
                      </div>

                      <button
                        type="button"
                        className="close-button"
                        onClick={closeAllOverlays}
                        aria-label="Close overlay"
                      >
                        X
                      </button>
                    </div>

                    <div className="overlay-body">
                      {activeOverlay === "portfolio" ? (
                        <div className="portfolio-browser">
                          <div className="filter-bar">
                            {portfolioFilters.map((filter) => (
                              <button
  key={filter}
  className={`filter-button ${
    activeFilter === filter ? "active" : ""
  }`}
  onMouseEnter={playHoverSound}
  onClick={() => {
    playClickSound();
    setActiveFilter(filter);
  }}
  type="button"
>
                                <span className="filter-button-fill" />
                                <span className="filter-button-label">
                                  {filter}
                                </span>
                              </button>
                            ))}
                          </div>

                          <div className="portfolio-grid">
                            {filteredEntries.map((entry) => (
                              <button
  key={entry.id}
  className="portfolio-card"
  type="button"
  onClick={() => {
    playClickSound();
    openProject(entry);
  }}
>
                                <div className="portfolio-card-image">
                                  <img
                                    src={entry.cover}
                                    alt={entry.title}
                                    className="portfolio-cover-image"
                                  />
                                </div>

                                <div className="portfolio-card-info">
                                  <div className="portfolio-card-title">
                                    {entry.title}
                                  </div>

                                  <div className="portfolio-card-tags">
                                    {entry.tags.join(" // ")}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="settings-panel">
                          <div className="settings-row">
                            <label className="settings-label" htmlFor="theme-select">
                              ACCENT COLOUR
                            </label>

                            <select
                              id="theme-select"
                              className="settings-select"
                              value={selectedTheme}
                              onChange={(e) => setSelectedTheme(e.target.value)}
                            >
                              <option value="RED">RED</option>
                              <option value="YELLOW">YELLOW</option>
                              <option value="BLUE">BLUE</option>
                              <option value="GREEN">GREEN</option>
                              <option value="PURPLE">PURPLE</option>
                            </select>
                          </div>

                          <div className="settings-row">
                            <span className="settings-label">FLOATING</span>

                            <button
  type="button"
  className={`settings-toggle ${
    floatMode ? "active" : ""
  }`}
  onClick={() => {
    playClickSound();
    setFloatMode((prev) => !prev);
  }}
>
                              {floatMode ? "ON" : "OFF"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedProject && (
                    <div
                      className="project-overlay-shell"
                      onClick={closeProject}
                    >
                      <div
                        className="project-overlay-panel"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="project-overlay-header">
                          <div className="project-overlay-title">
                            {selectedProject.title}
                          </div>

                          <button
                            type="button"
                            className="close-button"
                            onClick={closeProject}
                            aria-label="Close project"
                          >
                            X
                          </button>
                        </div>

                        <div className="project-overlay-body">
                          <div className="project-main-column">
                            <div className="project-meta-block">
                              <div className="project-meta-line">
                                ID: {String(selectedProject.id).padStart(2, "0")}
                              </div>

                              <div className="project-meta-line">
                                TAGS: {selectedProject.tags.join(" // ")}
                              </div>
                            </div>

                            <div className="project-description-block">
                              {selectedProject.description ? (
                                <p>{selectedProject.description}</p>
                              ) : (
                                <p>
                                  Add a description in PORTFOLIODATA.ts for this
                                  project.
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="project-sidebar">
                            <div className="project-sidebar-label">IMAGES</div>

                            <div className="project-image-list">
                              {selectedProject.images.map((imageSrc, index) => (
                                <button
  key={`${selectedProject.id}-${index}`}
  type="button"
  className="project-thumb-button"
  onClick={() => {
    playClickSound();
    setSelectedImage(imageSrc);
  }}
>
                                  <img
                                    src={imageSrc}
                                    alt={`${selectedProject.title} ${index + 1}`}
                                    className="project-thumb-image"
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {selectedImage && (
                          <div
                            className="image-overlay-shell"
                            onClick={() => setSelectedImage(null)}
                          >
                            <div
                              className="image-overlay-panel"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="image-overlay-header">
                                <div className="image-overlay-title">
                                  IMAGE_VIEWER
                                </div>

                                <button
                                  type="button"
                                  className="close-button"
                                  onClick={() => setSelectedImage(null)}
                                  aria-label="Close image viewer"
                                >
                                  X
                                </button>
                              </div>

                              <div className="image-overlay-body">
                                <img
                                  src={selectedImage}
                                  alt="Selected project image"
                                  className="image-overlay-full"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .wrapper {
          --theme-rgb: 255, 80, 80;
          --theme-main: rgb(var(--theme-rgb));
          --theme-text: rgba(var(--theme-rgb), 0.95);
          --theme-soft-text: rgba(var(--theme-rgb), 0.75);
          --theme-border: rgba(var(--theme-rgb), 0.26);
          --theme-border-strong: rgba(var(--theme-rgb), 0.42);
          --theme-glow: rgba(var(--theme-rgb), 0.22);
          --theme-bg-soft: rgba(var(--theme-rgb), 0.08);
          --theme-bg-mid: rgba(var(--theme-rgb), 0.16);

          height: 98vh;
          width: 98vw;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 auto;
        }

        .wrapper.theme-red {
          --theme-rgb: 255, 80, 80;
        }

        .wrapper.theme-yellow {
          --theme-rgb: 255, 210, 70;
        }

        .wrapper.theme-blue {
          --theme-rgb: 90, 170, 255;
        }

        .wrapper.theme-green {
          --theme-rgb: 90, 255, 150;
        }

        .wrapper.theme-purple {
          --theme-rgb: 190, 120, 255;
        }

        .crt-frame {
          position: relative;
          padding: 2.8rem;
          background:
            linear-gradient(
              135deg,
              #3a3a3a 0%,
              #2b2b2b 18%,
              #1d1d1d 18%,
              #171717 50%,
              #0f0f0f 82%,
              #050505 100%
            );
          box-shadow:
            inset 2px 2px 0 rgba(255, 255, 255, 0.08),
            inset -3px -5px 0 rgba(0, 0, 0, 0.5),
            0 18px 30px rgba(0, 0, 0, 0.38);
        }

        .crt-frame::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.14) 0%,
              rgba(255, 255, 255, 0.08) 10%,
              transparent 22%
            ),
            linear-gradient(
              to right,
              rgba(255, 255, 255, 0.04) 0%,
              transparent 12%,
              transparent 88%,
              rgba(0, 0, 0, 0.22) 100%
            ),
            linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0.05) 0%,
              transparent 16%,
              transparent 84%,
              rgba(0, 0, 0, 0.35) 100%
            ),
            repeating-linear-gradient(
              45deg,
              rgba(255, 255, 255, 0.012) 0px,
              rgba(255, 255, 255, 0.012) 2px,
              rgba(0, 0, 0, 0.012) 2px,
              rgba(0, 0, 0, 0.012) 4px
            );
          mix-blend-mode: screen;
        }

        .crt-frame::after {
          content: "";
          position: absolute;
          top: 16px;
          left: 16px;
          right: 16px;
          bottom: 16px;
          border-radius: 16px;
          pointer-events: none;
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.08) 0%,
              rgba(255, 255, 255, 0.025) 18%,
              transparent 30%
            );
          box-shadow:
            inset 6px 6px 10px rgba(0, 0, 0, 0.55),
            inset -2px -2px 4px rgba(255, 255, 255, 0.03),
            inset 0 0 0 2px rgba(0, 0, 0, 0.35);
        }

        .crt-screen {
          width: min(80vw, 1000px);
          height: min(70vh, 900px);
          position: relative;
          overflow: hidden;
          font-family: "Glixels", sans-serif;
          color: #ff6b6b;
          background: #050505;
          box-shadow:
            inset 0 0 60px rgba(0, 0, 0, 0.9),
            inset 0 0 20px rgba(255, 255, 255, 0.05),
            0 0 30px rgba(255, 60, 60, 0.12);
          animation: screenFlicker 5s infinite linear;
        }

        .background-media-layer {
          position: absolute;
          inset: 0;
          z-index: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #000;
        }

        .background-media {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          display: block;
          pointer-events: none;
          user-select: none;
        }

        .screen-left-fade {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 5;
          background: linear-gradient(
            to right,
            rgba(0, 0, 0, 0.58) 0%,
            rgba(0, 0, 0, 0.34) 24%,
            rgba(0, 0, 0, 0.14) 42%,
            transparent 66%
          );
        }

        .screen-vignette {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 8;
          background:
            radial-gradient(
              ellipse at center,
              transparent 56%,
              rgba(0, 0, 0, 0.14) 76%,
              rgba(0, 0, 0, 0.42) 100%
            );
        }

        .screen-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 6;
          background:
            radial-gradient(
              ellipse at center,
              rgba(255, 70, 70, 0.1) 0%,
              rgba(255, 70, 70, 0.035) 45%,
              transparent 75%
            );
        }

        .screen-noise {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.04;
          z-index: 9;
          background-image:
            repeating-linear-gradient(
              to right,
              rgba(255, 255, 255, 0.14) 0px,
              rgba(255, 255, 255, 0.14) 1px,
              transparent 1px,
              transparent 3px
            );
        }

        .crt-screen::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: repeating-linear-gradient(
            to bottom,
            rgba(255, 120, 120, 0.09) 0px,
            rgba(255, 120, 120, 0.09) 1px,
            transparent 2px,
            transparent 4px
          );
          mix-blend-mode: screen;
          opacity: 0.6;
          z-index: 12;
        }

        .portfolio-ui {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          padding: 0.8rem 1rem 0.9rem;
        }

        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          width: 100%;
          padding: 0.35rem 0.55rem 0.85rem;
          background: linear-gradient(
            to right,
            rgba(22, 4, 4, 0.82) 0%,
            rgba(12, 2, 2, 0.58) 58%,
            rgba(0, 0, 0, 0.12) 100%
          );
          border: 1px solid rgba(255, 95, 95, 0.16);
          box-shadow:
            inset 0 0 18px rgba(255, 255, 255, 0.015),
            inset 0 0 18px rgba(255, 70, 70, 0.035),
            0 6px 18px rgba(255, 60, 60, 0.06);
        }

        .topbar-title {
          font-size: 4rem;
          letter-spacing: 0.08em;
          line-height: 1;
          color: var(--theme-text);
          text-shadow:
            0 0 5px var(--theme-glow),
            0 0 12px rgba(var(--theme-rgb), 0.14);
        }

        .behance-link {
          align-self: center;
          margin-top: 8px;
          font-size: 2rem;
          letter-spacing: 0.12em;
          color: #ffc0c0;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          text-shadow:
            0 0 4px rgba(255, 85, 85, 0.28),
            0 0 8px rgba(255, 85, 85, 0.08);
          transition:
            color 180ms ease,
            border-color 180ms ease,
            text-shadow 180ms ease,
            transform 180ms ease;
        }

        .behance-link:hover {
          color: #ffffff;
          border-color: rgba(255, 120, 120, 0.55);
          text-shadow:
            0 0 6px rgba(255, 90, 90, 0.42),
            0 0 14px rgba(255, 90, 90, 0.14);
          transform: translateY(-1px);
        }

        .content-area {
          flex: 1;
          min-height: 0;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding-left: 0.1rem;
        }

        .menu-stack {
          margin-bottom: 10px;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .menu-button {
          position: relative;
          display: inline-flex;
          align-items: center;
          min-width: 410px;
          min-height: 82px;
          padding: 0;
          border: none;
          background: transparent;
          cursor: pointer;
          text-align: left;
          overflow: hidden;
        }

        .menu-button-accent {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 16px;
          background: var(--theme-main);
          z-index: 3;
          box-shadow: 0 0 10px var(--theme-glow);
        }

        .menu-button-fill {
          position: absolute;
          left: 16px;
          top: 0;
          bottom: 0;
          width: 0%;
          background: linear-gradient(
            to right,
            rgba(var(--theme-rgb), 0.22),
            rgba(var(--theme-rgb), 0.12)
          );
          border-bottom: 4px solid var(--theme-main);
          z-index: 1;
          transition:
            width 220ms ease,
            opacity 220ms ease;
          opacity: 0.92;
        }

        .menu-button-underline {
          position: absolute;
          left: 16px;
          bottom: 0;
          height: 4px;
          width: 0%;
          background: var(--theme-main);
          z-index: 2;
          transition: width 220ms ease;
        }

        .menu-button-label {
          position: relative;
          z-index: 4;
          padding-left: 30px;
          padding-right: 1rem;
          padding-bottom: 10px;
          font-size: 5rem;
          line-height: 0;
          letter-spacing: 0.04em;
          color: #f3f3f3;
          text-shadow:
            0 0 2px rgba(255, 255, 255, 0.08),
            0 0 8px rgba(255, 255, 255, 0.05);
          transition: color 180ms ease, transform 180ms ease;
        }

        .menu-button:hover .menu-button-fill,
        .menu-button:focus-visible .menu-button-fill {
          width: calc(100% - 16px);
        }

        .menu-button:hover .menu-button-underline,
        .menu-button:focus-visible .menu-button-underline {
          width: calc(100% - 16px);
        }

        .menu-button:hover .menu-button-label,
        .menu-button:focus-visible .menu-button-label {
          color: #ffffff;
          transform: translateX(2px);
        }

        .menu-button:focus-visible {
          outline: none;
        }

        .floating-footer {
          position: absolute;
          left: 1rem;
          bottom: 0.9rem;
          z-index: 10;
          font-size: 0.82rem;
          letter-spacing: 0.05em;
          color: var(--theme-text);
          text-shadow:
            0 0 5px var(--theme-glow),
            0 0 10px rgba(var(--theme-rgb), 0.06);
          opacity: 0.92;
        }

        .overlay-shell {
          position: absolute;
          inset: 0;
          z-index: 30;
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgba(0, 0, 0, 0.18);
          animation: overlayFade 180ms ease;
        }

        .overlay-panel {
          position: relative;
          width: 90%;
          height: 90%;
          overflow: hidden;
          border: 1px solid var(--theme-border-strong);
          background:
            linear-gradient(
              to bottom,
              rgba(18, 4, 4, 0.88),
              rgba(7, 2, 2, 0.9)
            );
          box-shadow:
            0 0 24px rgba(var(--theme-rgb), 0.08),
            inset 0 0 30px rgba(255, 255, 255, 0.02),
            inset 0 0 40px rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(2px);
          animation: overlayPanelIn 220ms ease;
        }

        .overlay-panel::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: repeating-linear-gradient(
            to bottom,
            rgba(255, 120, 120, 0.07) 0px,
            rgba(255, 120, 120, 0.07) 1px,
            transparent 2px,
            transparent 4px
          );
          mix-blend-mode: screen;
          opacity: 0.52;
          z-index: 4;
        }

        .overlay-panel-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(
              ellipse at center,
              rgba(255, 70, 70, 0.08) 0%,
              rgba(255, 70, 70, 0.025) 45%,
              transparent 75%
            );
          z-index: 1;
        }

        .overlay-panel-noise {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.035;
          z-index: 2;
          background-image:
            repeating-linear-gradient(
              to right,
              rgba(255, 255, 255, 0.14) 0px,
              rgba(255, 255, 255, 0.14) 1px,
              transparent 1px,
              transparent 3px
            );
        }

        .overlay-content {
          position: relative;
          z-index: 3;
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          padding: 1rem;
          color: #ffb8b8;
        }

        .overlay-header,
        .project-overlay-header,
        .image-overlay-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          padding-bottom: 0.85rem;
          border-bottom: 1px solid var(--theme-border);
        }

        .overlay-title,
        .project-overlay-title,
        .image-overlay-title {
          font-size: 1.7rem;
          letter-spacing: 0.1em;
          color: var(--theme-text);
          text-shadow:
            0 0 5px var(--theme-glow),
            0 0 12px rgba(var(--theme-rgb), 0.12);
        }

        .close-button {
          min-width: 50px;
          min-height: 42px;
          border: 1px solid var(--theme-border-strong);
          background: var(--theme-bg-soft);
          color: var(--theme-text);
          cursor: pointer;
          font-family: "Glixels", sans-serif;
          font-size: 0.95rem;
          letter-spacing: 0.06em;
          text-shadow:
            0 0 4px var(--theme-glow),
            0 0 8px rgba(var(--theme-rgb), 0.08);
          transition: background 180ms ease, border-color 180ms ease;
        }

        .close-button:hover {
          background: rgba(var(--theme-rgb), 0.16);
          border-color: var(--theme-border-strong);
        }

        .overlay-body {
          flex: 1;
          min-height: 0;
          display: flex;
          padding-top: 1rem;
          overflow: hidden;
        }

        .settings-panel {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 1.8rem;
        }

        .settings-row {
          width: min(420px, 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.7rem;
          padding: 1rem;
          border: 1px solid var(--theme-border);
          background:
            linear-gradient(
              to bottom,
              rgba(24, 8, 8, 0.58),
              rgba(10, 4, 4, 0.72)
            );
          box-shadow:
            0 0 14px rgba(var(--theme-rgb), 0.05),
            inset 0 0 14px rgba(var(--theme-rgb), 0.03);
        }

        .settings-label {
          font-size: 1rem;
          letter-spacing: 0.08em;
          color: var(--theme-text);
          text-align: center;
          text-shadow:
            0 0 4px var(--theme-glow),
            0 0 8px rgba(var(--theme-rgb), 0.08);
        }

        .settings-select {
          width: min(240px, 100%);
          padding: 0.75rem 1rem;
          border: 1px solid var(--theme-border-strong);
          background: rgba(10, 3, 3, 0.92);
          color: var(--theme-text);
          font-family: "Glixels", sans-serif;
          font-size: 0.95rem;
          letter-spacing: 0.08em;
          text-align: center;
          outline: none;
          cursor: pointer;
        }

        .settings-toggle {
          min-width: 140px;
          padding: 0.8rem 1.2rem;
          border: 1px solid var(--theme-border-strong);
          background: rgba(40, 10, 10, 0.72);
          color: var(--theme-text);
          font-family: "Glixels", sans-serif;
          font-size: 1rem;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition:
            background 180ms ease,
            border-color 180ms ease,
            color 180ms ease,
            transform 180ms ease;
        }

        .settings-toggle:hover {
          transform: translateY(-1px);
          border-color: var(--theme-border-strong);
        }

        .settings-toggle.active {
          background: var(--theme-bg-mid);
          color: #ffffff;
          border-color: var(--theme-border-strong);
        }

        .portfolio-browser {
          display: flex;
          flex-direction: column;
          width: 100%;
          min-height: 0;
          gap: 1rem;
        }

        .filter-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 0.7rem;
          padding-bottom: 0.8rem;
          border-bottom: 1px solid rgba(255, 95, 95, 0.18);
        }

        .filter-button {
          position: relative;
          border: none;
          background: transparent;
          padding: 0.55rem 0.95rem 0.5rem;
          cursor: pointer;
          overflow: hidden;
          min-height: 44px;
        }

        .filter-button-fill {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 0%;
          background: rgba(var(--theme-rgb), 0.18);
          transition: height 180ms ease, transform 180ms ease;
          z-index: 1;
        }

        .filter-button::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 3px;
          background: var(--theme-main);
          z-index: 2;
        }

        .filter-button:hover .filter-button-fill,
        .filter-button.active .filter-button-fill {
          height: 100%;
        }

        .filter-button-label {
          position: relative;
          z-index: 3;
          font-size: 1.2rem;
          letter-spacing: 0.08em;
          color: #ffd0d0;
          text-shadow:
            0 0 4px rgba(255, 85, 85, 0.35),
            0 0 8px rgba(255, 85, 85, 0.08);
        }

        .portfolio-grid {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1.4rem;
          padding-right: 0.3rem;
          align-content: start;
        }

        .portfolio-grid::-webkit-scrollbar,
        .project-image-list::-webkit-scrollbar {
          width: 16px;
        }

        .portfolio-grid::-webkit-scrollbar-track,
        .project-image-list::-webkit-scrollbar-track {
          background: rgba(12, 4, 4, 0.72);
        }

        .portfolio-grid::-webkit-scrollbar-thumb,
        .project-image-list::-webkit-scrollbar-thumb {
          border: 1px solid rgba(255, 95, 95, 0.26);
          background:
            linear-gradient(#ffb2b2, #ffb2b2) center calc(50% - 4px) / 8px 2px
              no-repeat,
            linear-gradient(#ffb2b2, #ffb2b2) center 50% / 8px 2px no-repeat,
            linear-gradient(#ffb2b2, #ffb2b2) center calc(50% + 4px) / 8px 2px
              no-repeat;
          min-height: 34px;
        }

        .portfolio-card {
          width: 100%;
          border: 1px solid var(--theme-border);
          background:
            linear-gradient(
              to bottom,
              rgba(24, 8, 8, 0.72),
              rgba(11, 4, 4, 0.82)
            );
          padding: 0;
          cursor: pointer;
          text-align: left;
          color: inherit;
          box-shadow:
            0 0 14px rgba(var(--theme-rgb), 0.04),
            inset 0 0 14px rgba(var(--theme-rgb), 0.03);
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease;
        }

        .portfolio-card:hover {
          transform: translateY(-2px);
          border-color: var(--theme-border-strong);
          background:
            linear-gradient(
              to bottom,
              rgba(32, 10, 10, 0.8),
              rgba(14, 5, 5, 0.9)
            );
        }

        .portfolio-card-image {
          width: 100%;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          border-bottom: 1px solid rgba(255, 95, 95, 0.22);
          background: rgba(0, 0, 0, 0.35);
        }

        .portfolio-cover-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .portfolio-card-info {
          padding: 0.7rem;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .portfolio-card-title {
          font-size: 1.5rem;
          line-height: 1.25;
          color: #ffe4e4;
          letter-spacing: 0.04em;
        }

        .portfolio-card-tags {
          font-size: 0.7rem;
          line-height: 1.4;
          color: #ffb8b8;
          letter-spacing: 0.04em;
        }

        .project-overlay-shell,
        .image-overlay-shell {
          position: absolute;
          inset: 0;
          z-index: 40;
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgba(0, 0, 0, 0.28);
          animation: overlayFade 180ms ease;
        }

        .project-overlay-panel,
        .image-overlay-panel {
          position: relative;
          width: 90%;
          height: 90%;
          background:
            linear-gradient(
              to bottom,
              rgba(16, 4, 4, 0.98),
              rgba(8, 2, 2, 0.98)
            );
          border: 1px solid rgba(255, 95, 95, 0.3);
          box-shadow:
            0 0 24px rgba(255, 70, 70, 0.08),
            inset 0 0 30px rgba(255, 255, 255, 0.02),
            inset 0 0 40px rgba(0, 0, 0, 0.45);
          padding: 1rem;
          overflow: hidden;
          animation: overlayPanelIn 220ms ease;
        }

        .project-overlay-panel::after,
        .image-overlay-panel::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: repeating-linear-gradient(
            to bottom,
            rgba(255, 120, 120, 0.07) 0px,
            rgba(255, 120, 120, 0.07) 1px,
            transparent 2px,
            transparent 4px
          );
          mix-blend-mode: screen;
          opacity: 0.45;
        }

        .project-overlay-body {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 210px;
          gap: 1rem;
          height: calc(100% - 3.6rem);
          padding-top: 1rem;
          min-height: 0;
        }

        .project-main-column {
          min-height: 0;
          overflow-y: auto;
          border: 1px solid rgba(255, 95, 95, 0.22);
          background:
            linear-gradient(
              to bottom,
              rgba(20, 7, 7, 0.76),
              rgba(10, 4, 4, 0.88)
            );
          padding: 1rem;
        }

        .project-meta-block {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 95, 95, 0.18);
        }

        .project-meta-line {
          font-size: 0.9rem;
          letter-spacing: 0.06em;
          color: #ffc6c6;
        }

        .project-description-block p {
          margin: 0;
          font-size: 0.92rem;
          line-height: 1.8;
          letter-spacing: 0.03em;
          color: #ffe0e0;
          white-space: pre-wrap;
        }

        .project-sidebar {
          min-height: 0;
          display: grid;
          grid-template-rows: auto 1fr;
          border: 1px solid rgba(255, 95, 95, 0.22);
          background:
            linear-gradient(
              to bottom,
              rgba(20, 7, 7, 0.76),
              rgba(10, 4, 4, 0.88)
            );
        }

        .project-sidebar-label {
          padding: 0.65rem 0.8rem;
          border-bottom: 1px solid rgba(255, 95, 95, 0.18);
          color: #ff9d9d;
          font-size: 0.82rem;
          letter-spacing: 0.08em;
        }

        .project-image-list {
          min-height: 0;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
          padding: 0.75rem;
        }

        .project-thumb-button {
          flex: 0 0 auto;
          width: 100%;
          padding: 0;
          border: 1px solid rgba(255, 95, 95, 0.2);
          background: rgba(0, 0, 0, 0.28);
          cursor: pointer;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease;
        }

        .project-thumb-button:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 110, 110, 0.42);
          background: rgba(255, 60, 60, 0.08);
        }

        .project-thumb-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .image-overlay-panel {
          display: grid;
          grid-template-rows: auto 1fr;
          gap: 1rem;
        }

        .image-overlay-body {
          min-height: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 1px solid rgba(255, 95, 95, 0.22);
          background:
            linear-gradient(
              to bottom,
              rgba(20, 7, 7, 0.76),
              rgba(10, 4, 4, 0.88)
            );
          padding: 1rem;
        }

        .image-overlay-full {
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
          object-fit: contain;
          display: block;
        }

        .chaos-on .topbar {
          animation: driftTopbar 6.1s ease-in-out infinite;
          will-change: transform;
        }

        .chaos-on .behance-link {
          animation: driftTiny 3.6s ease-in-out infinite;
          animation-delay: 0.8s;
          will-change: transform;
        }

        .chaos-on .menu-button {
          animation: driftA 4.8s ease-in-out infinite;
          will-change: transform;
        }

        .chaos-on .menu-button:nth-child(2) {
          animation: driftB 5.6s ease-in-out infinite;
          animation-delay: 0.7s;
        }

        .chaos-on .menu-button-accent {
          animation: driftAccent 3.1s ease-in-out infinite;
          will-change: transform;
        }

        .chaos-on .menu-button:nth-child(2) .menu-button-accent {
          animation-delay: 0.9s;
        }

        .chaos-on .floating-footer {
          animation: driftFooter 6.2s ease-in-out infinite;
          will-change: transform;
        }

        .chaos-on .overlay-panel {
          animation:
            overlayPanelIn 220ms ease,
            driftPanel 7s ease-in-out infinite;
          will-change: transform;
        }

        .chaos-on .settings-row {
          animation: driftC 5.2s ease-in-out infinite;
          will-change: transform;
        }

        .chaos-on .settings-row:nth-child(2) {
          animation-delay: 1.2s;
        }

        .chaos-on .filter-button {
          animation: driftTiny 3.8s ease-in-out infinite;
          will-change: transform;
        }

        .chaos-on .filter-button:nth-child(2n) {
          animation-delay: 0.4s;
        }

        .chaos-on .filter-button:nth-child(3n) {
          animation-delay: 1s;
        }

        .chaos-on .portfolio-card {
          animation: driftCardA 5.1s ease-in-out infinite;
          will-change: transform;
        }

        .chaos-on .portfolio-card:nth-child(2n) {
          animation: driftCardB 6s ease-in-out infinite;
          animation-delay: 0.5s;
        }

        .chaos-on .portfolio-card:nth-child(3n) {
          animation-delay: 1.1s;
        }

        .chaos-on .project-overlay-panel {
          animation:
            overlayPanelIn 220ms ease,
            driftProjectPanel 6.4s ease-in-out infinite;
          will-change: transform;
        }

        .chaos-on .project-main-column {
          animation: driftColumnA 5.7s ease-in-out infinite;
          will-change: transform;
        }

        .chaos-on .project-sidebar {
          animation: driftColumnB 6.6s ease-in-out infinite;
          animation-delay: 0.8s;
          will-change: transform;
        }

        .chaos-on .project-thumb-button {
          animation: driftThumb 4.1s ease-in-out infinite;
          will-change: transform;
        }

        .chaos-on .project-thumb-button:nth-child(2n) {
          animation-delay: 0.45s;
        }

        .chaos-on .project-thumb-button:nth-child(3n) {
          animation-delay: 0.95s;
        }

        .chaos-on .image-overlay-panel {
          animation:
            overlayPanelIn 220ms ease,
            driftImagePanel 4.8s ease-in-out infinite;
          will-change: transform;
        }

        @keyframes driftA {
          0% {
            transform: translate(0px, 0px) rotate(0deg);
          }
          20% {
            transform: translate(8px, -12px) rotate(-0.9deg);
          }
          45% {
            transform: translate(-10px, -22px) rotate(0.7deg);
          }
          70% {
            transform: translate(7px, -14px) rotate(-0.5deg);
          }
          100% {
            transform: translate(0px, 0px) rotate(0deg);
          }
        }

        @keyframes driftB {
          0% {
            transform: translate(0px, 0px) rotate(0deg);
          }
          25% {
            transform: translate(-11px, -10px) rotate(0.8deg);
          }
          55% {
            transform: translate(9px, -24px) rotate(-0.8deg);
          }
          80% {
            transform: translate(-6px, -13px) rotate(0.4deg);
          }
          100% {
            transform: translate(0px, 0px) rotate(0deg);
          }
        }

        @keyframes driftAccent {
          0% {
            transform: translate(0px, 0px);
          }
          25% {
            transform: translate(2px, -10px);
          }
          55% {
            transform: translate(-3px, -24px);
          }
          80% {
            transform: translate(2px, -14px);
          }
          100% {
            transform: translate(0px, 0px);
          }
        }

        @keyframes driftFooter {
          0% {
            transform: translate(0px, 0px);
          }
          30% {
            transform: translate(10px, -6px);
          }
          65% {
            transform: translate(-7px, -14px);
          }
          100% {
            transform: translate(0px, 0px);
          }
        }

        @keyframes driftPanel {
          0% {
            transform: translate(0px, 0px) rotate(0deg);
          }
          20% {
            transform: translate(10px, -6px) rotate(-0.25deg);
          }
          50% {
            transform: translate(-8px, -14px) rotate(0.2deg);
          }
          75% {
            transform: translate(7px, -8px) rotate(-0.15deg);
          }
          100% {
            transform: translate(0px, 0px) rotate(0deg);
          }
        }

        @keyframes driftTopbar {
          0% {
            transform: translate(0px, 0px);
          }
          35% {
            transform: translate(6px, -5px);
          }
          70% {
            transform: translate(-5px, -10px);
          }
          100% {
            transform: translate(0px, 0px);
          }
        }

        @keyframes driftTiny {
          0% {
            transform: translate(0px, 0px);
          }
          25% {
            transform: translate(3px, -4px);
          }
          60% {
            transform: translate(-2px, -8px);
          }
          100% {
            transform: translate(0px, 0px);
          }
        }

        @keyframes driftC {
          0% {
            transform: translate(0px, 0px) rotate(0deg);
          }
          20% {
            transform: translate(-5px, -6px) rotate(0.4deg);
          }
          50% {
            transform: translate(8px, -15px) rotate(-0.6deg);
          }
          80% {
            transform: translate(-4px, -8px) rotate(0.3deg);
          }
          100% {
            transform: translate(0px, 0px) rotate(0deg);
          }
        }

        @keyframes driftCardA {
          0% {
            transform: translate(0px, 0px) rotate(0deg);
          }
          25% {
            transform: translate(5px, -8px) rotate(-0.6deg);
          }
          50% {
            transform: translate(-8px, -18px) rotate(0.7deg);
          }
          75% {
            transform: translate(4px, -10px) rotate(-0.3deg);
          }
          100% {
            transform: translate(0px, 0px) rotate(0deg);
          }
        }

        @keyframes driftCardB {
          0% {
            transform: translate(0px, 0px) rotate(0deg);
          }
          20% {
            transform: translate(-6px, -7px) rotate(0.5deg);
          }
          55% {
            transform: translate(9px, -20px) rotate(-0.7deg);
          }
          85% {
            transform: translate(-4px, -11px) rotate(0.25deg);
          }
          100% {
            transform: translate(0px, 0px) rotate(0deg);
          }
        }

        @keyframes driftProjectPanel {
          0% {
            transform: translate(0px, 0px) rotate(0deg);
          }
          30% {
            transform: translate(9px, -8px) rotate(-0.2deg);
          }
          60% {
            transform: translate(-7px, -16px) rotate(0.18deg);
          }
          100% {
            transform: translate(0px, 0px) rotate(0deg);
          }
        }

        @keyframes driftColumnA {
          0% {
            transform: translate(0px, 0px);
          }
          25% {
            transform: translate(4px, -6px);
          }
          60% {
            transform: translate(-6px, -13px);
          }
          100% {
            transform: translate(0px, 0px);
          }
        }

        @keyframes driftColumnB {
          0% {
            transform: translate(0px, 0px);
          }
          30% {
            transform: translate(-5px, -7px);
          }
          70% {
            transform: translate(7px, -16px);
          }
          100% {
            transform: translate(0px, 0px);
          }
        }

        @keyframes driftThumb {
          0% {
            transform: translate(0px, 0px) rotate(0deg);
          }
          20% {
            transform: translate(2px, -5px) rotate(-0.35deg);
          }
          55% {
            transform: translate(-3px, -10px) rotate(0.35deg);
          }
          85% {
            transform: translate(2px, -4px) rotate(-0.18deg);
          }
          100% {
            transform: translate(0px, 0px) rotate(0deg);
          }
        }

        @keyframes driftImagePanel {
          0% {
            transform: translate(0px, 0px) rotate(0deg);
          }
          25% {
            transform: translate(7px, -5px) rotate(-0.15deg);
          }
          60% {
            transform: translate(-6px, -11px) rotate(0.12deg);
          }
          100% {
            transform: translate(0px, 0px) rotate(0deg);
          }
        }

        @keyframes screenFlicker {
          0% {
            opacity: 0.99;
          }
          2% {
            opacity: 0.97;
          }
          3% {
            opacity: 0.985;
          }
          10% {
            opacity: 0.975;
          }
          100% {
            opacity: 0.99;
          }
        }

        @keyframes overlayFade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes overlayPanelIn {
          from {
            opacity: 0;
            transform: scale(0.985);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (max-width: 900px) {
          .crt-frame {
            padding: 1.5rem;
          }

          .crt-screen {
            width: min(94vw, 1000px);
            height: min(78vh, 760px);
          }

          .topbar-title {
            font-size: 1.8rem;
          }

          .behance-link {
            font-size: 0.72rem;
          }

          .menu-button {
            min-width: 300px;
            min-height: 62px;
          }

          .menu-button-label {
            font-size: 2.8rem;
            padding-left: 26px;
          }

          .floating-footer {
            font-size: 0.68rem;
          }

          .project-overlay-body {
            grid-template-columns: 1fr 170px;
          }

          .overlay-title,
          .project-overlay-title,
          .image-overlay-title {
            font-size: 1.15rem;
          }
        }

        @media (max-width: 560px) {
          .portfolio-ui {
            padding: 0.55rem 0.65rem 0.7rem;
          }

          .menu-stack {
            gap: 0.9rem;
          }

          .menu-button {
            min-width: 220px;
            min-height: 48px;
          }

          .menu-button-accent {
            width: 12px;
          }

          .menu-button-fill,
          .menu-button-underline {
            left: 12px;
          }

          .menu-button:hover .menu-button-fill,
          .menu-button:focus-visible .menu-button-fill,
          .menu-button:hover .menu-button-underline,
          .menu-button:focus-visible .menu-button-underline {
            width: calc(100% - 12px);
          }

          .menu-button-label {
            font-size: 1.9rem;
            padding-left: 22px;
            padding-bottom: 6px;
          }

          .overlay-panel,
          .project-overlay-panel,
          .image-overlay-panel {
            width: 92%;
            height: 88%;
          }

          .overlay-title,
          .project-overlay-title,
          .image-overlay-title {
            font-size: 0.95rem;
          }

          .close-button {
            min-width: 42px;
            font-size: 0.72rem;
          }

          .floating-footer {
            left: 0.7rem;
            bottom: 0.65rem;
            font-size: 0.56rem;
          }

          .filter-bar {
            gap: 0.45rem;
          }

          .filter-button {
            padding: 0.45rem 0.7rem 0.42rem;
            min-height: 38px;
          }

          .filter-button-label {
            font-size: 0.68rem;
          }

          .portfolio-grid {
            grid-template-columns: 1fr;
            gap: 0.8rem;
          }

          .portfolio-card-title {
            font-size: 0.76rem;
          }

          .portfolio-card-tags {
            font-size: 0.7rem;
          }

          .project-overlay-body {
            grid-template-columns: 1fr;
            grid-template-rows: minmax(0, 1fr) 180px;
          }

          .project-sidebar {
            min-height: 180px;
          }

          .project-description-block p,
          .project-meta-line {
            font-size: 0.74rem;
          }
        }
      `}</style>
    </>
  );
}