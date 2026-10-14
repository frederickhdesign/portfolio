
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collegeWork } from "./collegeworkdata";

export default function CollegeWorkPage() {
  const [imageIndex, setImageIndex] = useState(0);

  const images = collegeWork.images;
  const imageCount = images.length;

  const nextImage = () => {
    if (imageCount < 2) return;
    setImageIndex((index) => (index + 1) % imageCount);
  };

  const previousImage = () => {
    if (imageCount < 2) return;
    setImageIndex((index) => (index - 1 + imageCount) % imageCount);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        setImageIndex((index) =>
          imageCount > 1 ? (index + 1) % imageCount : index
        );
      }

      if (event.key === "ArrowLeft") {
        setImageIndex((index) =>
          imageCount > 1
            ? (index - 1 + imageCount) % imageCount
            : index
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [imageCount]);

  return (
    <main className="college-page">
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

        <h1>College Work</h1>
      </header>

      <div className="project-frame">
        <div className="project-content">
          <section className="project-description">
            <h2>{collegeWork.title}</h2>

            <div className="description-scroll">
              <p>{collegeWork.description}</p>
            </div>

            <a
              className="pdf-download"
              href={collegeWork.pdf}
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>DOWNLOAD FULL PROJECT PDF</span>
              <span className="download-icon">↓</span>
            </a>
          </section>

          <section className="project-gallery">
            <div className="image-display">
              {imageCount > 0 && (
                <img
                  src={images[imageIndex]}
                  alt={`${collegeWork.title} page ${imageIndex + 1}`}
                  draggable={false}
                />
              )}
            </div>

            <div className="gallery-controls">
              <button
                type="button"
                onClick={previousImage}
                disabled={imageCount < 2}
                aria-label="Previous image"
              >
                ←
              </button>

              <span>
                {String(imageCount > 0 ? imageIndex + 1 : 0).padStart(2, "0")}
                {" / "}
                {String(imageCount).padStart(2, "0")}
              </span>

              <button
                type="button"
                onClick={nextImage}
                disabled={imageCount < 2}
                aria-label="Next image"
              >
                →
              </button>
            </div>
          </section>
        </div>
      </div>

      <style jsx>{`
        .college-page {
          min-height: 100vh;
          background: #000;
          color: #fff;
          font-family: inherit;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }

        .archive-header {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 130px;
          flex-shrink: 0;
          padding: 0 32px;
          box-sizing: border-box;
        }

        .archive-header h1 {
          margin: 0;
          font-size: clamp(32px, 4vw, 64px);
          font-weight: 700;
          letter-spacing: -0.045em;
          text-align: center;
        }

        .project-frame {
          width: 90%;
          height: calc(100vh - 170px);
          min-height: 480px;
          margin: 0 auto 40px;
          border: 2px solid #fff;
          box-sizing: border-box;
          background: #000;
          display: flex;
          flex-direction: column;
        }

        .project-content {
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
          scrollbar-color: rgba(255, 255, 255, 0.9)
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

        .pdf-download {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-shrink: 0;
          margin-top: 30px;
          padding: 18px 20px;
          border: 1px solid #fff;
          background: transparent;
          color: #fff;
          text-decoration: none;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          transition: background 200ms ease, color 200ms ease;
        }

        .pdf-download:hover {
          background: #fff;
          color: #000;
        }

        .download-icon {
          font-size: 22px;
          font-weight: 400;
          line-height: 1;
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

        @media (max-width: 768px) {
          .archive-header {
            height: 110px;
            padding: 0 20px;
          }

          .archive-header h1 {
            font-size: 32px;
          }

          .project-frame {
            width: 94%;
            height: auto;
            min-height: calc(100vh - 140px);
            margin-bottom: 30px;
          }

          .project-content {
            display: flex;
            flex-direction: column;
            padding-top: 15px;
          }

          .project-description {
            flex: 0 0 auto;
            padding: 25px 22px;
            border-right: 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.3);
          }

          .project-description h2 {
            margin-bottom: 18px;
          }

          .description-scroll {
            flex: 0 1 auto;
            max-height: 35vh;
          }

          .pdf-download {
            margin-top: 24px;
          }

          .project-gallery {
            flex: 1;
            min-height: 320px;
            padding: 25px 20px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pdf-download {
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
