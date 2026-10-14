
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  universityWorkEntries,
  type UniversityWorkEntry,
  type UniversityWorkImage,
} from "./universityworkdata";

export default function UniversityWorkPage() {
  const [selectedProject, setSelectedProject] =
    useState<UniversityWorkEntry | null>(null);

  const [imageIndex, setImageIndex] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  const getImageSrc = (image: string | UniversityWorkImage) => {
    return typeof image === "string" ? image : image.src;
  };

  const getImageText = (image: string | UniversityWorkImage) => {
    return typeof image === "string"
      ? ""
      : image.text?.trim() ?? "";
  };

  const openProject = (project: UniversityWorkEntry) => {
    setImageIndex(0);
    setIsClosing(false);
    setSelectedProject(project);
  };

  const closeProject = () => {
    if (!selectedProject || isClosing) return;
    setIsClosing(true);
  };

  const nextImage = () => {
    if (!selectedProject || selectedProject.images.length === 0) return;

    setImageIndex(
      (index) => (index + 1) % selectedProject.images.length
    );
  };

  const previousImage = () => {
    if (!selectedProject || selectedProject.images.length === 0) return;

    setImageIndex(
      (index) =>
        (index - 1 + selectedProject.images.length) %
        selectedProject.images.length
    );
  };

  useEffect(() => {
    if (!selectedProject) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedProject]);

  useEffect(() => {
    if (!selectedProject) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeProject();
      }

      if (event.key === "ArrowRight" && !isClosing) {
        nextImage();
      }

      if (event.key === "ArrowLeft" && !isClosing) {
        previousImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  const activeImage =
    selectedProject?.images[imageIndex] ?? null;

  const activeImageSrc = activeImage
    ? getImageSrc(activeImage)
    : "";

  const activeImageText = activeImage
    ? getImageText(activeImage)
    : "";

  return (
    <main className="university-page">
      <header className="archive-header">
        <Link
          href="/"
          className="back-link"
          style={{
            position: "absolute",
            left: "40px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "white",
            textDecoration: "none",
            fontSize: "12px",
            letterSpacing: "0.12em",
          }}
        >
          ← PORTFOLIO
        </Link>

        <h1>University Work</h1>
      </header>

      <section className="project-grid">
        {universityWorkEntries.map((project) => (
          <button
            key={project.id}
            type="button"
            className="project-tile"
            onClick={() => openProject(project)}
            aria-label={`Open ${project.title}`}
          >
            <img
              src={project.cover}
              alt={project.title}
              draggable={false}
            />

            <div className="project-tile-overlay">
              <h2>{project.title}</h2>
            </div>
          </button>
        ))}
      </section>

      {selectedProject && (
        <>
          <div
            className="overlay-backdrop"
            onClick={closeProject}
          />

          <div
            className={`project-overlay ${isClosing ? "closing" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-label={selectedProject.title}
            onAnimationEnd={(event) => {
              if (
                isClosing &&
                event.target === event.currentTarget
              ) {
                setSelectedProject(null);
                setIsClosing(false);
                setImageIndex(0);
              }
            }}
          >
            <button
              type="button"
              className="close-button"
              onClick={closeProject}
              aria-label="Close project"
            >
              ×
            </button>

            <div className="overlay-content">
              <section className="project-description">
                <h2>{selectedProject.title}</h2>

                <div className="description-scroll">
                  <p>{selectedProject.description}</p>
                </div>
              </section>

              <section className="project-gallery">
                <div className="image-display">
                  {activeImageSrc && (
                    <img
                      src={activeImageSrc}
                      alt={`${selectedProject.title} image ${
                        imageIndex + 1
                      }`}
                      draggable={false}
                    />
                  )}
                </div>

                {activeImageText && (
                  <p className="image-description">
                    {activeImageText}
                  </p>
                )}

                <div className="gallery-controls">
                  <button
                    type="button"
                    onClick={previousImage}
                    disabled={selectedProject.images.length < 2}
                    aria-label="Previous image"
                  >
                    ←
                  </button>

                  <span>
                    {String(imageIndex + 1).padStart(2, "0")}
                    {" / "}
                    {String(selectedProject.images.length).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <button
                    type="button"
                    onClick={nextImage}
                    disabled={selectedProject.images.length < 2}
                    aria-label="Next image"
                  >
                    →
                  </button>
                </div>
              </section>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .university-page {
          min-height: 100vh;
          background: #000;
          color: #fff;
          font-family: inherit;
        }

        .archive-header {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 180px;
          padding: 0 32px;
          box-sizing: border-box;
          background: #000;
        }

        .archive-header h1 {
          margin: 0;
          font-size: clamp(32px, 4vw, 64px);
          font-weight: 700;
          letter-spacing: -0.045em;
          text-align: center;
        }

        .project-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          width: min(100% - 120px, 1000px);
          margin: 0 auto;
          gap: 20px;
          padding-bottom: 100px;
        }

        .project-tile {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          aspect-ratio: 1 / 1;
          padding: 0;
          border: 0;
          background: #000;
          overflow: hidden;
          cursor: pointer;
          user-select: none;
          -webkit-user-select: none;
        }

        .project-tile img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition:
            transform 450ms cubic-bezier(0.16, 1, 0.3, 1),
            filter 350ms ease;
          pointer-events: none;
        }

        .project-tile-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px;
          background: rgba(0, 0, 0, 0.65);
          opacity: 0;
          transition: opacity 280ms ease;
          pointer-events: none;
        }

        .project-tile-overlay h2 {
          margin: 0;
          font-size: clamp(24px, 3vw, 48px);
          font-weight: 700;
          letter-spacing: -0.035em;
          text-align: center;
          transform: translateY(12px);
          transition:
            transform 350ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .project-tile:hover img {
          transform: scale(1.035);
          filter: brightness(0.75);
        }

        .project-tile:hover .project-tile-overlay,
        .project-tile:focus-visible .project-tile-overlay {
          opacity: 1;
        }

        .project-tile:hover .project-tile-overlay h2,
        .project-tile:focus-visible .project-tile-overlay h2 {
          transform: translateY(0);
        }

        .overlay-backdrop {
          position: fixed;
          inset: 0;
          z-index: 999;
          background: rgba(0, 0, 0, 0.55);
        }

        .project-overlay {
          position: fixed;
          top: 5%;
          left: 5%;
          width: 90%;
          height: 90%;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          background: #000;
          border: 2px solid #fff;
          box-sizing: border-box;
          animation: overlaySlideUp 550ms
            cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .project-overlay.closing {
          animation: overlaySlideDown 450ms
            cubic-bezier(0.7, 0, 0.84, 0) both;
        }

        .close-button {
          position: absolute;
          top: 12px;
          right: 20px;
          z-index: 10;
          padding: 0;
          border: 0;
          background: transparent;
          color: #fff;
          font-family: inherit;
          font-size: 32px;
          line-height: 1;
          cursor: pointer;
        }

        .close-button:hover {
          opacity: 0.6;
        }

        .overlay-content {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr);
          flex: 1;
          min-height: 0;
          padding-top: 35px;
        }

        .project-description {
          display: flex;
          flex-direction: column;
          min-height: 0;
          padding: 30px 45px 45px;
          border-right: 1px solid rgba(255, 255, 255, 0.3);
          box-sizing: border-box;
        }

        .project-description h2 {
          margin: 0 0 32px;
          font-size: clamp(28px, 3vw, 48px);
          line-height: 1;
          font-weight: 700;
          letter-spacing: -0.035em;
        }

        .description-scroll {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          padding-right: 20px;
          scrollbar-width: thin;
          scrollbar-color:
            rgba(255, 255, 255, 0.9)
            rgba(255, 255, 255, 0.08);
        }

        .description-scroll::-webkit-scrollbar {
          width: 7px;
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
          font-size: 17px;
          line-height: 1.5;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.94);
        }

        .project-gallery {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-width: 0;
          min-height: 0;
          padding: 20px 45px 35px;
          box-sizing: border-box;
        }

        .image-display {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          flex: 1;
          min-height: 0;
          overflow: hidden;
        }

        .image-display img {
          display: block;
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
          object-fit: contain;
          user-select: none;
          -webkit-user-select: none;
        }

        .image-description {
          max-width: 650px;
          margin: 16px 0 0;
          font-size: 13px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
          white-space: pre-line;
        }

        .gallery-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 35px;
          flex-shrink: 0;
          padding-top: 22px;
        }

        .gallery-controls button {
          padding: 8px 12px;
          border: 0;
          background: transparent;
          color: #fff;
          font-family: inherit;
          font-size: 28px;
          cursor: pointer;
        }

        .gallery-controls button:hover {
          opacity: 0.6;
        }

        .gallery-controls button:disabled {
          opacity: 0.2;
          cursor: default;
        }

        .gallery-controls span {
          min-width: 70px;
          font-size: 12px;
          letter-spacing: 0.15em;
          text-align: center;
        }

        @keyframes overlaySlideUp {
          from {
            transform: translateY(110vh);
          }
          to {
            transform: translateY(0);
          }
        }

        @keyframes overlaySlideDown {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(110vh);
          }
        }

        @media (max-width: 768px) {
          .archive-header {
            height: 130px;
            padding: 0 20px;
          }

          .archive-header h1 {
            font-size: 32px;
          }

          .project-grid {
            width: calc(100% - 40px);
            grid-template-columns: 1fr;
            gap: 16px;
            padding-bottom: 50px;
          }

          .project-overlay {
            top: 3%;
            left: 3%;
            width: 94%;
            height: 94%;
          }

          .overlay-content {
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            padding-top: 35px;
          }

          .project-description {
            flex: 0 0 auto;
            min-height: 180px;
            max-height: 40vh;
            padding: 25px 22px;
            border-right: 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.3);
          }

          .project-description h2 {
            margin-bottom: 18px;
          }

          .description-scroll {
            max-height: 24vh;
          }

          .project-gallery {
            flex: 1;
            min-height: 320px;
            padding: 25px 20px;
          }

          .close-button {
            top: 8px;
            right: 15px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .project-overlay,
          .project-overlay.closing {
            animation-duration: 1ms;
          }

          .project-tile img,
          .project-tile-overlay,
          .project-tile-overlay h2 {
            transition-duration: 0ms;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          margin: 0;
        }
      `}</style>
    </main>
  );
}
