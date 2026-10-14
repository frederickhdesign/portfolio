
"use client";

import { useState } from "react";
import ProjectCard from "./ProjectCard";
import type { PortfolioEntry, ProjectImage } from "./ProjectData";

type GraphicDesignProjectProps = {
  project: PortfolioEntry;
  gridSize: number;
  onOpen?: (project: PortfolioEntry) => void;
  onClose?: (project: PortfolioEntry) => void;
};

type Slide = {
  kind: "image" | "video";
  src: string;
  text?: string;
};

function videoEmbed(url: string) {
  const youtube = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/
  );
  if (youtube) {
    return `https://www.youtube-nocookie.com/embed/${youtube[1]}`;
  }

  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) {
    return `https://player.vimeo.com/video/${vimeo[1]}`;
  }

  return url;
}

export default function GraphicDesignProject({
  project,
  gridSize,
  onOpen,
  onClose,
}: GraphicDesignProjectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const slides: Slide[] = project.images
    .map((image: string | ProjectImage) =>
      typeof image === "string"
        ? { kind: "image" as const, src: image }
        : { kind: "image" as const, src: image.src, text: image.text }
    )
    .filter(
      (slide) =>
        Boolean(slide.src && slide.src.trim() && slide.src !== "#")
    );

  if (typeof project.video === "string" && project.video.trim()) {
    slides.push({ kind: "video", src: project.video });
  }

  const total = slides.length;

  const closedWidth = gridSize * 10;
  const closedHeight = gridSize * 13;
  const introWidth = gridSize * 16;
  const introHeight = gridSize * 21;
  const galleryWidth = gridSize * 30;
  const galleryHeight = gridSize * 20;

  const openProject = () => {
    setActiveIndex(0);
    setGalleryOpen(false);
    setIsOpen(true);
    onOpen?.(project);
  };

  const closeProject = () => {
    setIsOpen(false);
    setGalleryOpen(false);
    setActiveIndex(0);
    onClose?.(project);
  };

  const move = (direction: number) => {
    if (total < 2) return;
    setActiveIndex((index) => (index + direction + total) % total);
  };

  const getOffset = (index: number) => {
    if (total <= 1) return 0;
    const forward = (index - activeIndex + total) % total;
    const backward = (activeIndex - index + total) % total;
    return forward <= backward ? forward : -backward;
  };

  return (
    <div
      className={`graphic-design-project ${isOpen ? "is-open" : ""} ${
        galleryOpen ? "is-gallery" : ""
      }`}
      style={{
        width: isOpen
          ? galleryOpen
            ? galleryWidth
            : introWidth
          : closedWidth,
        height: isOpen
          ? galleryOpen
            ? galleryHeight
            : introHeight
          : closedHeight,
        left: closedWidth / 2,
        top: closedHeight / 2,
        transform: "translate(-50%, -50%)",
      }}
      onPointerDown={(event) => event.stopPropagation()}
      onPointerMove={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation();
        if (!isOpen) openProject();
      }}
    >
      <div className={`closed-card ${isOpen ? "hidden" : ""}`}>
        <ProjectCard project={project} gridSize={gridSize} />
      </div>

      <div className={`open-project ${isOpen ? "visible" : ""}`}>
        <section
          className={`intro-content ${galleryOpen ? "receded" : ""}`}
          onClick={(event) => {
            event.stopPropagation();
            if (!galleryOpen) closeProject();
          }}
        >
          <button
            type="button"
            className="intro-close"
            aria-label="Close project"
            onClick={(event) => {
              event.stopPropagation();
              closeProject();
            }}
          >
            ×
          </button>

          <div className="intro-description">
            <h2>{project.title}</h2>

            <div className="description-scroll">
              <p>{project.description}</p>
            </div>
          </div>
        </section>

        {total > 0 ? (
          <>
            <div
              className={`intro-preview ${
                galleryOpen ? "dismissed" : ""
              }`}
            >
              <button
                type="button"
                className="preview-trigger"
                onClick={(event) => {
                  event.stopPropagation();
                  setGalleryOpen(true);
                }}
                aria-label="Open artwork gallery"
                tabIndex={galleryOpen ? -1 : 0}
              >
                <img
                  src={
                    slides[0].kind === "image"
                      ? slides[0].src
                      : project.cover
                  }
                  alt={`${project.title} preview`}
                />
                <span>CLICK TO EXPLORE ↗</span>
              </button>
            </div>

            <div className={`gallery ${galleryOpen ? "active" : ""}`}>
              <div className="carousel-stage">
                {slides.map((slide, index) => {
                  const offset = getOffset(index);
                  const visible = Math.abs(offset) <= 1;
                  const centered = offset === 0;

                  return (
                    <div
                      key={`${slide.kind}-${slide.src}-${index}`}
                      className={`carousel-slide ${
                        centered ? "centered" : ""
                      }`}
                      style={{
                        transform: `translate(-50%, -50%) translateX(${
                          offset * 83
                        }%) translateZ(${
                          centered ? 0 : -120
                        }px) rotateY(${
                          offset * -27
                        }deg) scale(${centered ? 1 : 0.72})`,
                        opacity: visible
                          ? centered
                            ? 1
                            : 0.3
                          : 0,
                        zIndex: centered ? 3 : visible ? 2 : 0,
                        pointerEvents:
                          galleryOpen && visible ? "auto" : "none",
                      }}
                    >
                      {slide.kind === "video" && centered ? (
                        <iframe
                          src={videoEmbed(slide.src)}
                          title={`${project.title} video`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      ) : slide.kind === "video" ? (
                        <button
                          type="button"
                          className="artwork video-placeholder"
                          onClick={() => setActiveIndex(index)}
                        >
                          <span>▶</span>
                          <small>PROJECT VIDEO</small>
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="artwork"
                          onClick={(event) => {
                            event.stopPropagation();
                            if (centered) setGalleryOpen(false);
                            else setActiveIndex(index);
                          }}
                          aria-label={
                            centered
                              ? "Return to project introduction"
                              : "View this artwork"
                          }
                        >
                          <img
                            src={slide.src}
                            alt={`${project.title} artwork ${
                              index + 1
                            }`}
                          />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="gallery-controls">
                <button
                  type="button"
                  onClick={() => move(-1)}
                  disabled={total < 2}
                  aria-label="Previous artwork"
                >
                  ‹
                </button>

                <div className="slide-details">
                  <span>
                    {String(activeIndex + 1).padStart(2, "0")} /{" "}
                    {String(total).padStart(2, "0")}
                  </span>
                  {slides[activeIndex]?.text && (
                    <p>{slides[activeIndex].text}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => move(1)}
                  disabled={total < 2}
                  aria-label="Next artwork"
                >
                  ›
                </button>
              </div>

              <button
                type="button"
                className="return-button"
                onClick={() => setGalleryOpen(false)}
              >
                ↑ PROJECT OVERVIEW
              </button>
            </div>
          </>
        ) : (
          <div className="empty-gallery">Artwork coming soon</div>
        )}
      </div>

      <style jsx>{`
        .graphic-design-project {
          position: absolute;
          color: white;
          font-family: inherit;
          box-sizing: border-box;
          transform-origin: center;
          transition:
            width 650ms cubic-bezier(0.22, 1, 0.36, 1),
            height 650ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .closed-card {
          position: absolute;
          inset: 0;
          z-index: 2;
          opacity: 1;
          transition:
            opacity 180ms ease,
            transform 350ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .closed-card.hidden {
          opacity: 0;
          transform: scale(1.04);
          pointer-events: none;
        }

        .open-project {
          position: absolute;
          inset: 0;
          opacity: 0;
          transform: scale(0.985);
          pointer-events: none;
          transition:
            opacity 280ms ease 180ms,
            transform 500ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .open-project.visible {
          opacity: 1;
          transform: scale(1);
          pointer-events: auto;
        }

        .intro-content {
          position: absolute;
          top: 0;
          left: 50%;
          width: ${gridSize * 14}px;
          height: ${gridSize * 14}px;
          transform: translateX(-50%);
          box-sizing: border-box;
          border: 2px solid rgba(255, 255, 255, 0.95);
          background: #000;
          overflow: hidden;
          cursor: pointer;
          transition:
            transform 700ms cubic-bezier(0.22, 1, 0.36, 1),
            opacity 450ms ease;
        }

        .intro-content.receded {
          transform: translate(-50%, -110%) scale(0.72);
          opacity: 0;
          pointer-events: none;
        }

        .intro-description {
          position: absolute;
          inset: ${gridSize * 0.85}px;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .intro-description h2 {
          margin: 0 0 ${gridSize * 0.55}px;
          font-family: inherit;
          font-size: ${gridSize * 0.75}px;
          line-height: 1;
          font-weight: 700;
          letter-spacing: -0.035em;
        }

        .description-scroll {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          padding-right: ${gridSize * 0.55}px;
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.9)
            rgba(255, 255, 255, 0.08);
        }

        .description-scroll::-webkit-scrollbar {
          width: ${gridSize * 0.25}px;
        }

        .description-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 999px;
        }

        .description-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 999px;
        }

        .description-scroll p {
          margin: 0;
          white-space: pre-line;
          font-family: inherit;
          font-size: ${gridSize * 0.48}px;
          line-height: 1.35;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.94);
        }

        .intro-close {
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

        .intro-close:hover {
          color: #fff;
        }

        .intro-preview {
          position: absolute;
          top: ${gridSize * 14.6}px;
          left: 50%;
          width: ${gridSize * 7}px;
          height: ${gridSize * 5.6}px;
          transform: translateX(-50%);
          transition:
            transform 650ms cubic-bezier(0.22, 1, 0.36, 1),
            opacity 320ms ease;
        }

        .intro-preview.dismissed {
          transform: translate(-50%, -70%) scale(1.7);
          opacity: 0;
          pointer-events: none;
        }

        .preview-trigger {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          width: 100%;
          height: 100%;
          padding: 0;
          border: 0;
          background: transparent;
          color: white;
          font-family: inherit;
          cursor: pointer;
        }

        .preview-trigger img {
          width: 100%;
          height: calc(100% - 25px);
          object-fit: contain;
          opacity: 0.42;
          transform: scale(0.9);
          transition:
            opacity 220ms ease,
            transform 300ms ease;
        }

        .preview-trigger:hover img {
          opacity: 0.8;
          transform: scale(1);
        }

        .preview-trigger > span {
          font-family: inherit;
          font-size: 10px;
          letter-spacing: 0.2em;
          white-space: nowrap;
        }

        .gallery {
          position: absolute;
          inset: 0;
          opacity: 0;
          pointer-events: none;
          transition: opacity 420ms ease 170ms;
        }

        .gallery.active {
          opacity: 1;
          pointer-events: auto;
        }

        .carousel-stage {
          position: absolute;
          top: 6%;
          bottom: 17%;
          left: 0;
          right: 0;
          perspective: 1100px;
        }

        .carousel-slide {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 54%;
          height: 90%;
          transform-style: preserve-3d;
          transition:
            transform 700ms cubic-bezier(0.22, 1, 0.36, 1),
            opacity 500ms ease;
          will-change: transform, opacity;
        }

        .artwork {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          padding: 0;
          border: 0;
          background: transparent;
          font-family: inherit;
          cursor: pointer;
        }

        .artwork img {
          display: block;
          width: auto;
          height: auto;
          max-width: 100%;
          max-height: 100%;
          box-sizing: border-box;
          border: 2px solid rgba(255, 255, 255, 0.95);
          object-fit: contain;
        }

        .carousel-slide iframe {
          display: block;
          width: 100%;
          height: 100%;
          border: 2px solid rgba(255, 255, 255, 0.95);
          box-sizing: border-box;
        }

        .video-placeholder {
          flex-direction: column;
          gap: 12px;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.6);
        }

        .video-placeholder span {
          font-size: 42px;
        }

        .video-placeholder small {
          font-family: inherit;
          font-size: 11px;
          letter-spacing: 0.2em;
        }

        .gallery-controls {
          position: absolute;
          left: 50%;
          bottom: 8%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: ${gridSize * 0.75}px;
        }

        .gallery-controls > button {
          border: 0;
          background: transparent;
          color: white;
          font-family: inherit;
          font-size: 48px;
          line-height: 1;
          cursor: pointer;
          padding: 0 10px;
        }

        .gallery-controls > button:disabled {
          opacity: 0.2;
          cursor: default;
        }

        .slide-details {
          min-width: ${gridSize * 5}px;
          max-width: ${gridSize * 11}px;
          text-align: center;
          font-family: inherit;
          font-size: 12px;
          letter-spacing: 0.15em;
        }

        .slide-details p {
          font-family: inherit;
          font-size: 12px;
          line-height: 1.4;
          letter-spacing: 0;
          margin: 8px 0 0;
          color: rgba(255, 255, 255, 0.7);
        }

        .return-button {
          position: absolute;
          left: ${gridSize * 13}px;
          bottom: ${gridSize * 20}px;
          border: 0;
          background: transparent;
          color: rgba(255, 255, 255, 0.65);
          font-family: inherit;
          font-size: 10px;
          letter-spacing: 0.15em;
          cursor: pointer;
        }

        .return-button:hover {
          color: white;
        }

        .empty-gallery {
          position: absolute;
          bottom: 12%;
          width: 100%;
          text-align: center;
          font-family: inherit;
          font-size: 13px;
          opacity: 0.5;
        }

        @media (prefers-reduced-motion: reduce) {
          .graphic-design-project,
          .closed-card,
          .open-project,
          .intro-content,
          .intro-preview,
          .gallery,
          .carousel-slide {
            transition-duration: 0ms;
          }
        }
      `}</style>
    </div>
  );
}
