"use client";

import { useState } from "react";
import ProjectCard from "./ProjectCard";
import type {
  PortfolioEntry,
  ProjectImage,
} from "./ProjectData";

type UIProjectProps = {
  project: PortfolioEntry;
  gridSize: number;
  onOpen?: (project: PortfolioEntry) => void;
  onClose?: (project: PortfolioEntry) => void;
};

export default function UIProject({
  project,
  gridSize,
  onOpen,
  onClose,
}: UIProjectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<
    number | null
  >(null);

  const closedWidth = gridSize * 10;
  const closedHeight = gridSize * 13;
  const openSize = gridSize * 14;

  const satelliteSize = gridSize * 6.5;
  const satelliteHoverSize = satelliteSize + gridSize;

  const previewHeight = gridSize * 25;
  const previewImageWidth = gridSize * 25;
  const previewTextWidth = gridSize * 9;

  const radius =
    openSize / 2 +
    satelliteSize / 2 +
    gridSize * 3.5;

  const getImageSrc = (
    image: string | ProjectImage
  ) => {
    if (typeof image === "string") {
      return image;
    }

    return image.src;
  };

  const getImageText = (
    image: string | ProjectImage
  ) => {
    if (typeof image === "string") {
      return "";
    }

    const text = image.text?.trim() ?? "";

    if (!text || text === "#") {
      return "";
    }

    return text;
  };

  const selectedImage =
    selectedImageIndex !== null
      ? project.images[selectedImageIndex]
      : null;

  const selectedImageSrc = selectedImage
    ? getImageSrc(selectedImage)
    : "";

  const selectedImageText = selectedImage
    ? getImageText(selectedImage)
    : "";

  const hasImageText =
    selectedImageText.length > 0;

  const openProject = () => {
    setIsOpen(true);
    onOpen?.(project);
  };

  const closeProject = () => {
    setSelectedImageIndex(null);
    setIsOpen(false);
    onClose?.(project);
  };

  const openImagePreview = (
    index: number
  ) => {
    setSelectedImageIndex(index);
  };

  const closeImagePreview = () => {
    setSelectedImageIndex(null);
  };

  return (
    <div
      className={`ui-project ${
        isOpen ? "is-open" : ""
      } ${
        selectedImageIndex !== null
          ? "has-image-preview"
          : ""
      }`}
      style={{
        width: closedWidth,
        height: closedHeight,
      }}
    >
      <div className="ui-radial-images">
        {project.images.map((image, index) => {
          const imageSrc = getImageSrc(image);

          const angle =
            (index / project.images.length) *
              Math.PI *
              2 -
            Math.PI / 2;

          const isDiagonal =
            Math.abs(Math.cos(angle)) > 0.45 &&
            Math.abs(Math.sin(angle)) > 0.45;

          const itemRadius = isDiagonal
            ? radius + gridSize * 2
            : radius;

          const x =
            Math.cos(angle) * itemRadius;

          const y =
            Math.sin(angle) * itemRadius;

          const threshold = 0.25;

          const originX =
            x > radius * threshold
              ? "0%"
              : x < -radius * threshold
              ? "100%"
              : "50%";

          const originY =
            y > radius * threshold
              ? "0%"
              : y < -radius * threshold
              ? "100%"
              : "50%";

          return (
            <div
              key={`${imageSrc}-${index}`}
              className="ui-radial-position"
              style={{
                width: satelliteSize,
                height: satelliteSize,
                left: openSize / 2 + x,
                top: openSize / 2 + y,
              }}
            >
              <button
                className="ui-radial-image"
                tabIndex={
                  isOpen &&
                  selectedImageIndex === null
                    ? 0
                    : -1
                }
                style={
                  {
                    width: satelliteSize,
                    height: satelliteSize,
                    transformOrigin: `${originX} ${originY}`,
                    "--hover-scale":
                      satelliteHoverSize /
                      satelliteSize,
                  } as React.CSSProperties
                }
                onClick={(e) => {
                  e.stopPropagation();
                  openImagePreview(index);
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                }}
              >
                <img
                  src={imageSrc}
                  alt=""
                  draggable={false}
                />
              </button>
            </div>
          );
        })}
      </div>

      <div
        className="ui-project-main"
        onClick={(e) => {
          e.stopPropagation();

          if (selectedImageIndex !== null) {
            return;
          }

          if (isOpen) {
            closeProject();
          } else {
            openProject();
          }
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="ui-project-visual">
          <ProjectCard
            project={project}
            gridSize={gridSize}
          />
        </div>

        <div className="ui-project-text">
          <button
            className="ui-project-close"
            aria-label="Close project"
            onClick={(e) => {
              e.stopPropagation();
              closeProject();
            }}
          >
            ×
          </button>

          <div className="ui-project-description">
            <h2>{project.title}</h2>

            <div className="ui-project-description-scroll">
              <p>{project.description}</p>
            </div>
          </div>
        </div>
      </div>

      {selectedImage && (
  <>
    <div
      className="ui-image-preview-backdrop"
      onClick={(e) => {
        e.stopPropagation();
        closeImagePreview();
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
      }}
    />

    <div
      className={`ui-image-preview ${
        hasImageText
          ? "has-text"
          : "image-only"
      }`}
      style={{
        width: hasImageText
          ? previewImageWidth + previewTextWidth
          : previewImageWidth,
        height: previewHeight,
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
      }}
    >

          <div
            className="ui-image-preview-image"
            style={{
              width: previewImageWidth,
            }}
          >
            <img
              src={selectedImageSrc}
              alt=""
              draggable={false}
            />
          </div>

          {hasImageText && (
            <div
              className="ui-image-preview-copy"
              style={{
                width: previewTextWidth,
              }}
            >
              <div className="ui-image-preview-scroll">
                <p>{selectedImageText}</p>
              </div>
            </div>
          )}
        </div>
      </>
      )}

      <style jsx>{`
        .ui-project {
          position: relative;
          overflow: visible;
        }

        .ui-project-main {
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
          border: 0 solid
            rgba(255, 255, 255, 0.95);
          background: #000;
          transition:
            width 480ms
              cubic-bezier(0.16, 1, 0.3, 1),
            height 480ms
              cubic-bezier(0.16, 1, 0.3, 1),
            top 480ms
              cubic-bezier(0.16, 1, 0.3, 1),
            border-width 180ms ease,
            opacity 220ms ease,
            transform 220ms ease;
        }

        .ui-project.is-open
          .ui-project-main {
          width: ${openSize}px;
          height: ${openSize}px;
          top: ${closedWidth / 2}px;
          border-width: 2px;
        }

        .ui-project.has-image-preview
          .ui-project-main {
          opacity: 0;
          transform:
            translate(-50%, -50%)
            scale(0.96);
          pointer-events: none;
        }

        .ui-project-visual {
          position: absolute;
          inset: 0;
          opacity: 1;
          transform: scale(1);
          transform-origin: center;
          pointer-events: auto;
          transition:
            opacity 220ms ease,
            transform 480ms
              cubic-bezier(0.16, 1, 0.3, 1);
        }

        .ui-project.is-open
          .ui-project-visual {
          opacity: 0;
          transform: scale(1.08);
          pointer-events: none;
        }

        .ui-project-text {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.86);
          opacity: 0;
          pointer-events: none;
          transition:
            opacity 260ms ease 120ms;
        }

        .ui-project.is-open
          .ui-project-text {
          opacity: 1;
          pointer-events: auto;
        }

        .ui-project-description {
          position: absolute;
          inset: ${gridSize * 0.85}px;
          display: flex;
          flex-direction: column;
          opacity: 0;
          transform: translateY(
            ${gridSize * 0.4}px
          );
          transition:
            opacity 220ms ease,
            transform 320ms
              cubic-bezier(0.16, 1, 0.3, 1);
        }

        .ui-project.is-open
          .ui-project-description {
          opacity: 1;
          transform: translateY(0);
          transition:
            opacity 220ms ease 220ms,
            transform 320ms
              cubic-bezier(0.16, 1, 0.3, 1)
              180ms;
        }

        .ui-project-description h2 {
          margin: 0 0
            ${gridSize * 0.55}px;
          font-size: ${gridSize * 0.75}px;
          line-height: 1;
          font-weight: 700;
          letter-spacing: -0.035em;
        }

        .ui-image-preview-backdrop {
  position: absolute;
  left: -5000px;
  top: -5000px;
  width: 10000px;
  height: 10000px;
  z-index: 49;
  cursor: default;
}

        .ui-project-description-scroll {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          padding-right:
            ${gridSize * 0.55}px;
          scrollbar-width: thin;
          scrollbar-color:
            rgba(255, 255, 255, 0.9)
            rgba(255, 255, 255, 0.08);
        }

        .ui-project-description-scroll::-webkit-scrollbar {
          width: ${gridSize * 0.25}px;
        }

        .ui-project-description-scroll::-webkit-scrollbar-track {
          background:
            rgba(255, 255, 255, 0.08);
          border-radius: 999px;
        }

        .ui-project-description-scroll::-webkit-scrollbar-thumb {
          background:
            rgba(255, 255, 255, 0.9);
          border-radius: 999px;
        }

        .ui-project-description p {
          margin: 0;
          white-space: pre-line;
          font-size: ${gridSize * 0.48}px;
          line-height: 1.35;
          font-weight: 400;
          color:
            rgba(255, 255, 255, 0.94);
        }

        .ui-project-close {
          position: absolute;
          top: ${gridSize * 0.3}px;
          right: ${gridSize * 0.3}px;
          z-index: 20;
          padding: 0;
          border: 0;
          background: transparent;
          color:
            rgba(255, 255, 255, 0.9);
          font-family: inherit;
          font-size: ${gridSize * 0.65}px;
          font-weight: 400;
          line-height: 1;
          cursor: pointer;
        }

        .ui-project-close:hover {
          color: #fff;
        }

        .ui-radial-images {
          position: absolute;
          left: calc(
            50% - ${openSize / 2}px
          );
          top: calc(
            ${closedWidth / 2}px -
              ${openSize / 2}px
          );
          width: ${openSize}px;
          height: ${openSize}px;
          pointer-events: none;
          z-index: 5;
          transition:
            opacity 180ms ease,
            transform 220ms ease;
        }

        .ui-project.has-image-preview
          .ui-radial-images {
          opacity: 0;
          transform: scale(0.96);
          pointer-events: none;
        }

        .ui-radial-position {
          position: absolute;
          pointer-events: none;
          opacity: 0;
          transform:
            translate(-50%, -50%)
            scale(0.25);
          transition:
            opacity 180ms ease,
            transform 420ms
              cubic-bezier(0.16, 1, 0.3, 1);
        }

        .ui-project.is-open
          .ui-radial-position {
          opacity: 1;
          pointer-events: auto;
          transform:
            translate(-50%, -50%)
            scale(1);
          transition:
            opacity 220ms ease 120ms,
            transform 420ms
              cubic-bezier(0.16, 1, 0.3, 1)
              80ms;
        }

        .ui-project.has-image-preview
          .ui-radial-position {
          pointer-events: none;
        }

        .ui-radial-image {
          position: absolute;
          inset: 0;
          padding: 0;
          border: 1px solid
            rgba(255, 255, 255, 0.95);
          border-radius:
            ${gridSize * 0.55}px;
          background: #000;
          overflow: hidden;
          cursor: pointer;
          transform: scale(1);
          transition:
            transform 170ms
              cubic-bezier(0.16, 1, 0.3, 1);
        }

        .ui-radial-image:hover {
          border-width: 2px;
          transform:
            scale(var(--hover-scale));
        }

        .ui-radial-image img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          pointer-events: none;
        }

        .ui-image-preview {
          position: absolute;
          left: 50%;
          top: ${closedWidth / 2}px;
          display: flex;
          transform:
            translate(-50%, -50%)
            scale(0.96);
          background: #000;
          border: 2px solid
            rgba(255, 255, 255, 0.95);
          z-index: 50;
          overflow: hidden;
          opacity: 0;
          animation:
            uiImagePreviewIn
            280ms
            cubic-bezier(0.16, 1, 0.3, 1)
            forwards;
        }

        .ui-image-preview.image-only {
          display: block;
        }

        .ui-image-preview-image {
          position: relative;
          height: 100%;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #000;
        }

        .ui-image-preview.has-text
          .ui-image-preview-image {
          border-right: 2px solid
            rgba(255, 255, 255, 0.95);
        }

        .ui-image-preview-image img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: contain;
          pointer-events: none;
        }

        .ui-image-preview-copy {
          position: relative;
          height: 100%;
          flex-shrink: 0;
          overflow: hidden;
          background: #000;
        }

        .ui-image-preview-scroll {
          position: absolute;
          inset: ${gridSize * 0.75}px;
          overflow-y: auto;
          padding-right:
            ${gridSize * 0.45}px;
          scrollbar-width: thin;
          scrollbar-color:
            rgba(255, 255, 255, 0.95)
            transparent;
        }

        .ui-image-preview-scroll::-webkit-scrollbar {
          width: ${gridSize * 0.22}px;
        }

        .ui-image-preview-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .ui-image-preview-scroll::-webkit-scrollbar-thumb {
          background:
            rgba(255, 255, 255, 0.95);
          border-radius: 999px;
        }

        .ui-image-preview-scroll p {
          margin: 0;
          white-space: pre-line;
          font-size: ${gridSize * 0.52}px;
          line-height: 1.35;
          font-weight: 400;
          color:
            rgba(255, 255, 255, 0.95);
        }

        .ui-image-preview-close {
          position: absolute;
          top: ${gridSize * 0.25}px;
          right: ${gridSize * 0.25}px;
          z-index: 60;
          padding: 0;
          border: 0;
          background: transparent;
          color: #fff;
          font-family: inherit;
          font-size: ${gridSize * 0.65}px;
          line-height: 1;
          cursor: pointer;
        }

        @keyframes uiImagePreviewIn {
          from {
            opacity: 0;
            transform:
              translate(-50%, -50%)
              scale(0.96);
          }

          to {
            opacity: 1;
            transform:
              translate(-50%, -50%)
              scale(1);
          }
        }
      `}</style>
    </div>
  );
}