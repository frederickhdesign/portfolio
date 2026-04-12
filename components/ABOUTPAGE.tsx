"use client";

import { useState, useRef, useEffect } from "react";

type IconType = "sys" | "notes" | "trash" | "cv";
type WindowType = IconType | "fun";

type DesktopIcon = {
  id: IconType;
  label: string;
  x: number;
  y: number;
};

const INITIAL_ICONS: DesktopIcon[] = [
  { id: "sys", label: "USER_INFO", x: 42, y: 42 },
  { id: "notes", label: "ABOUT.txt", x: 42, y: 150 },
  { id: "cv", label: "CV", x: 42, y: 350 },
  { id: "trash", label: "RECYCLE BIN", x: 42, y: 366 },
];

export default function ABOUTPAGE() {
  const [icons, setIcons] = useState(INITIAL_ICONS);
  const [selectedIcon, setSelectedIcon] = useState<IconType | null>(null);
  const [openWindow, setOpenWindow] = useState<WindowType | null>(null);
  const [startMenuOpen, setStartMenuOpen] = useState(false);

  const desktopSurfaceRef = useRef<HTMLDivElement | null>(null);
  const startMenuRef = useRef<HTMLDivElement | null>(null);
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);

  const dragData = useRef<{
    id: IconType | null;
    offsetX: number;
    offsetY: number;
  }>({
    id: null,
    offsetX: 0,
    offsetY: 0,
  });

  useEffect(() => {
    clickAudioRef.current = new Audio("/audio/BUTTON%20CLICK.mp3");
    clickAudioRef.current.volume = 0.35;
  }, []);

  const playClickSound = () => {
    const audio = clickAudioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    audio.play().catch(() => {
      // Ignore playback interruption/user gesture edge cases
    });
  };

  const handleDownloadCV = () => {
    const link = document.createElement("a");
    link.href = "/sprites/CV%20PRINTABLE.png";
    link.download = "CV PRINTABLE.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setStartMenuOpen(false);
  };

  useEffect(() => {
    const placeTrashBottomRight = () => {
      const surface = desktopSurfaceRef.current;
      if (!surface) return;

      const rect = surface.getBoundingClientRect();

      setIcons((prev) =>
        prev.map((icon) =>
          icon.id === "trash"
            ? {
                ...icon,
                x: Math.max(12, rect.width - 110),
                y: Math.max(12, rect.height - 110),
              }
            : icon
        )
      );
    };

    placeTrashBottomRight();
    window.addEventListener("resize", placeTrashBottomRight);

    return () => {
      window.removeEventListener("resize", placeTrashBottomRight);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!startMenuRef.current) return;
      if (!startMenuRef.current.contains(event.target as Node)) {
        setStartMenuOpen(false);
      }
    };

    if (startMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [startMenuOpen]);

  const getIconImage = (id: IconType) => {
    switch (id) {
      case "sys":
        return "/sprites/INFO ICON.webp";
      case "notes":
        return "/sprites/NOTES ICON.webp";
      case "trash":
        return "/sprites/TRASH ICON.webp";
      case "cv":
        return "/sprites/INFO ICON.webp";
      default:
        return "";
    }
  };

  const getStartMenuImage = (id: "sys" | "notes" | "trash" | "cv" | "fun") => {
    switch (id) {
      case "sys":
        return "/sprites/INFO ICON.webp";
      case "notes":
        return "/sprites/NOTES ICON.webp";
      case "trash":
        return "/sprites/TRASH ICON.webp";
      case "cv":
        return "/sprites/CVDARK.webp";
      case "fun":
        return "/sprites/INFO ICON.webp";
      default:
        return "";
    }
  };

  const handlePointerDown = (
    e: React.PointerEvent<HTMLButtonElement>,
    id: IconType
  ) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();

    dragData.current = {
      id,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    };

    target.setPointerCapture(e.pointerId);
    setSelectedIcon(id);
    setStartMenuOpen(false);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragData.current.id) return;

    const wrapper = desktopSurfaceRef.current;
    if (!wrapper) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    const id = dragData.current.id;

    const newX = e.clientX - wrapperRect.left - dragData.current.offsetX;
    const newY = e.clientY - wrapperRect.top - dragData.current.offsetY;

    setIcons((prev) =>
      prev.map((icon) =>
        icon.id === id
          ? {
              ...icon,
              x: Math.max(12, Math.min(newX, wrapperRect.width - 110)),
              y: Math.max(12, Math.min(newY, wrapperRect.height - 110)),
            }
          : icon
      )
    );
  };

  const handlePointerUp = () => {
    dragData.current = {
      id: null,
      offsetX: 0,
      offsetY: 0,
    };
  };

  const openAnyWindow = (id: WindowType) => {
    playClickSound();

    if (id !== "fun") {
      setSelectedIcon(id);
    } else {
      setSelectedIcon(null);
    }

    setOpenWindow(id);
    setStartMenuOpen(false);
  };

  const renderWindowContent = () => {
    switch (openWindow) {
      case "sys":
        return (
          <div className="window-content">
            <p>USER PROFILE LOADED</p>
            <br />
            <p>NAME: Frederick Harden</p>
            <p>ROLE: Graphic / UI Designer</p>
            <p>FOCUS: UI Design, Open to all design mediums</p>
            <p>STATUS: Probably already making another portfolio site</p>
          </div>
        );

      case "notes":
        return (
          <div className="window-content">
            <p>ABOUT ME - CHECK START MENU FOR FULL CV</p>
            <br />
            <p>
              I'm a creative and versatile graphic designer, based in Coventry,
              UK.
            </p>
            <p>
              My main focuses within design are to thrive as a UI designer,
              however I welcome all opportunities.
            </p>
            <br />
            <p>
              Outside of design, I'm a dedicated mix martial artist and
              lifelong gamer, with a background in dance and stage performances.
              These collectively have helped me develop my creativity,
              discipline and my ability to perform whilst under pressure.
            </p>
            <p></p>
          </div>
        );

      case "trash":
        return (
          <div className="window-content">
            <p>TRASH</p>
            <br />
            <p>- ASSignment2_FINAL_REAL_v8.pdf</p>
            <p>- bad_design_234.png</p>
            <p>- locking_in_plan.txt</p>
          </div>
        );

      case "fun":
        return (
          <div className="window-content">
            <p>Hi</p>
            <br />
            <p>If you're reading this</p>
            <p>I love raccoons and burgers</p>
            <br />
            <p>idk what im doing okay</p>
          </div>
        );

      case "cv":
        return (
          <div className="window-content cv-window-content">
            <div className="cv-frame">
              <img
                src="/sprites/CVDARK.webp"
                alt="CV preview"
                className="cv-image"
              />
              <div className="cv-green-overlay" />
              <div className="cv-scanlines" />
              <div className="cv-vignette" />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getWindowTitle = () => {
    switch (openWindow) {
      case "sys":
        return "USER_INFO";
      case "notes":
        return "ABOUT.txt";
      case "trash":
        return "RECYCLE BIN";
      case "fun":
        return "FUN.txt";
      case "cv":
        return "CV";
      default:
        return "WINDOW";
    }
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
      `}</style>

      <div className="wrapper">
        <div className="crt-frame">
          <div className="crt-screen">
            <div className="screen-glow" />
            <div className="screen-noise" />

            <div className="desktop-area">
              <div className="desktop-header">
                <div className="desktop-title">DESKTOP</div>
                <div className="desktop-clock">13:38</div>
              </div>

              <div
                className="desktop-surface"
                ref={desktopSurfaceRef}
                onClick={() => {
                  setSelectedIcon(null);
                  setStartMenuOpen(false);
                }}
              >
                {icons.map((icon) => (
                  <button
                    key={icon.id}
                    className={`desktop-icon ${
                      selectedIcon === icon.id ? "selected" : ""
                    }`}
                    style={{
                      left: `${icon.x}px`,
                      top: `${icon.y}px`,
                    }}
                    onPointerDown={(e) => handlePointerDown(e, icon.id)}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onDoubleClick={() => openAnyWindow(icon.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIcon(icon.id);
                    }}
                  >
                    <img
                      src={getIconImage(icon.id)}
                      alt={icon.label}
                      className="desktop-icon-image"
                      draggable={false}
                    />
                    <span className="desktop-icon-label">{icon.label}</span>
                  </button>
                ))}

                <div className="wallpaper-info">
                  <p>FREDERICK OS</p>
                  <p>Have an explore!</p>
                </div>

                {openWindow && (
                  <>
                    <div
                      className="window-backdrop"
                      onClick={() => setOpenWindow(null)}
                    />
                    <div className="popup-window">
                      <div className="popup-topbar">
                        <span>{getWindowTitle()}</span>
                        <button
                          className="close-btn"
                          onClick={() => setOpenWindow(null)}
                        >
                          ×
                        </button>
                      </div>
                      {renderWindowContent()}
                    </div>
                  </>
                )}
              </div>

              <div className="taskbar">
                <div className="taskbar-left">
                  <div className="start-menu-anchor" ref={startMenuRef}>
                    <button
                      className="start-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        playClickSound();
                        setStartMenuOpen((prev) => !prev);
                      }}
                    >
                      START
                    </button>

                    {startMenuOpen && (
                      <div className="start-menu">
                        <button
                          className="start-menu-item"
                          onClick={() => openAnyWindow("sys")}
                        >
                          <img
                            src={getStartMenuImage("sys")}
                            alt="USER_INFO"
                            className="start-menu-icon"
                          />
                          <span>USER_INFO</span>
                        </button>

                        <button
                          className="start-menu-item"
                          onClick={() => openAnyWindow("notes")}
                        >
                          <img
                            src={getStartMenuImage("notes")}
                            alt="ABOUT.txt"
                            className="start-menu-icon"
                          />
                          <span>ABOUT.txt</span>
                        </button>

                        <button
                          className="start-menu-item"
                          onClick={() => openAnyWindow("trash")}
                        >
                          <img
                            src={getStartMenuImage("trash")}
                            alt="RECYCLE BIN"
                            className="start-menu-icon"
                          />
                          <span>RECYCLE BIN</span>
                        </button>

                        <button
                          className="start-menu-item"
                          onClick={() => openAnyWindow("fun")}
                        >
                          <img
                            src={getStartMenuImage("fun")}
                            alt="FUN.txt"
                            className="start-menu-icon"
                          />
                          <span>FUN.txt</span>
                        </button>

                        <button
                          className="start-menu-item"
                          onClick={() => openAnyWindow("cv")}
                        >
                          <img
                            src={getStartMenuImage("cv")}
                            alt="CV"
                            className="start-menu-icon cv-menu-icon"
                          />
                          <span>CV</span>
                        </button>

                        <button
                          className="start-menu-item"
                          onClick={handleDownloadCV}
                        >
                          <img
                            src={getStartMenuImage("cv")}
                            alt="Download CV"
                            className="start-menu-icon cv-menu-icon"
                          />
                          <span>DOWNLOAD CV - WHITE PRINT</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="taskbar-app active">ABOUT_DESKTOP</div>
                  {openWindow && (
                    <div className="taskbar-app">{getWindowTitle()}</div>
                  )}
                </div>

                <div className="taskbar-right">
                  <span>NET: OK</span>
                  <span>//</span>
                  <span>13:38</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .wrapper {
          height: 98vh;
          width: 98vw;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 auto;
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
          color: #72ff9f;
          background:
            radial-gradient(
              ellipse at center,
              rgba(17, 56, 28, 0.96) 0%,
              rgba(7, 22, 11, 0.985) 58%,
              rgba(2, 8, 4, 1) 100%
            );
          box-shadow:
            inset 0 0 60px rgba(0, 0, 0, 0.9),
            inset 0 0 20px rgba(255, 255, 255, 0.05),
            0 0 30px rgba(79, 255, 140, 0.08);
          animation: screenFlicker 5s infinite linear;
        }

        .crt-screen::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(
              ellipse at center,
              transparent 58%,
              rgba(0, 0, 0, 0.16) 78%,
              rgba(0, 0, 0, 0.42) 100%
            );
          z-index: 10;
        }

        .crt-screen::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: repeating-linear-gradient(
            to bottom,
            rgba(120, 255, 170, 0.085) 0px,
            rgba(120, 255, 170, 0.085) 1px,
            transparent 2px,
            transparent 4px
          );
          mix-blend-mode: screen;
          opacity: 0.55;
          z-index: 11;
        }

        .screen-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(
              ellipse at center,
              rgba(90, 255, 150, 0.1) 0%,
              rgba(90, 255, 150, 0.03) 45%,
              transparent 75%
            );
          z-index: 1;
        }

        .screen-noise {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.045;
          z-index: 2;
          background-image:
            repeating-linear-gradient(
              to right,
              rgba(255, 255, 255, 0.15) 0px,
              rgba(255, 255, 255, 0.15) 1px,
              transparent 1px,
              transparent 3px
            );
        }

        .desktop-area {
          position: relative;
          z-index: 3;
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
        }

        .desktop-header {
          height: 58px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.9rem 1.1rem 0.5rem;
          border-bottom: 1px solid rgba(114, 255, 159, 0.18);
        }

        .desktop-title {
          font-size: 1rem;
          letter-spacing: 0.12em;
          text-shadow:
            0 0 5px rgba(114, 255, 159, 0.5),
            0 0 12px rgba(114, 255, 159, 0.16);
        }

        .desktop-clock {
          font-size: 2.6rem;
          letter-spacing: 0.05em;
          line-height: 1;
          opacity: 0.92;
          text-shadow:
            0 0 8px rgba(114, 255, 159, 0.5),
            0 0 18px rgba(114, 255, 159, 0.14);
        }

        .desktop-surface {
          position: relative;
          flex: 1;
          overflow: hidden;
        }

        .desktop-icon {
          position: absolute;
          width: 92px;
          min-height: 86px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          gap: 0.4rem;
          padding: 0.4rem 0.35rem;
          background: transparent;
          border: 1px solid transparent;
          color: #85ffaf;
          cursor: grab;
          user-select: none;
          touch-action: none;
          font-family: "Glixels", sans-serif;
        }

        .desktop-icon:active {
          cursor: grabbing;
        }

        .desktop-icon.selected {
          border: 1px solid rgba(114, 255, 159, 0.55);
          background: rgba(114, 255, 159, 0.08);
          box-shadow: inset 0 0 8px rgba(114, 255, 159, 0.06);
        }

        .desktop-icon-image {
          width: 34px;
          height: 34px;
          object-fit: contain;
          image-rendering: pixelated;
          pointer-events: none;
          filter:
            drop-shadow(0 0 7px rgba(114, 255, 159, 0.6))
            drop-shadow(0 0 16px rgba(114, 255, 159, 0.16));
        }

        .desktop-icon-label {
          text-align: center;
          font-size: 1rem;
          line-height: 1.25;
          letter-spacing: 0.05em;
          text-shadow:
            0 0 5px rgba(114, 255, 159, 0.55),
            0 0 12px rgba(114, 255, 159, 0.14);
          word-break: break-word;
        }

        .wallpaper-info {
          position: absolute;
          right: 1.4rem;
          top: 1.1rem;
          text-align: right;
          opacity: 0.74;
        }

        .wallpaper-info p {
          margin: 0 0 0.35rem;
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          text-shadow:
            0 0 5px rgba(114, 255, 159, 0.45),
            0 0 10px rgba(114, 255, 159, 0.14);
        }

        .window-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.18);
          z-index: 20;
        }

        .popup-window {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: min(560px, calc(100% - 3rem));
          min-height: 260px;
          border: 1px solid rgba(114, 255, 159, 0.5);
          background:
            linear-gradient(
              to bottom,
              rgba(10, 28, 15, 0.98),
              rgba(4, 16, 8, 0.98)
            );
          box-shadow:
            0 0 18px rgba(114, 255, 159, 0.08),
            inset 0 0 18px rgba(114, 255, 159, 0.04);
          z-index: 21;
          display: flex;
          flex-direction: column;
        }

        .popup-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          padding: 0.6rem 0.75rem;
          border-bottom: 1px solid rgba(114, 255, 159, 0.35);
          background: rgba(114, 255, 159, 0.045);
          font-size: 1.25rem;
          letter-spacing: 0.08em;
          text-shadow:
            0 0 5px rgba(114, 255, 159, 0.45),
            0 0 10px rgba(114, 255, 159, 0.12);
        }

        .close-btn {
          border: 1px solid rgba(114, 255, 159, 0.45);
          background: transparent;
          color: #85ffaf;
          width: 28px;
          height: 28px;
          cursor: pointer;
          font-family: "Glixels", sans-serif;
          font-size: 1rem;
          line-height: 1;
        }

        .close-btn:hover {
          background: rgba(114, 255, 159, 0.08);
        }

        .window-content {
          padding: 1rem 1rem 1.1rem;
          font-size: 1rem;
          line-height: 1.7;
          letter-spacing: 0.1em;
          text-shadow:
            0 0 5px rgba(114, 255, 159, 0.42),
            0 0 10px rgba(114, 255, 159, 0.1);
        }

        .window-content p {
          margin: 0;
        }

        .cv-window-content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .cv-frame {
          position: relative;
          width: min(80%, 300px);
          height: 80%;
          max-height: 420px;
          border: 1px solid rgba(114, 255, 159, 0.35);
          background: rgba(0, 0, 0, 0.28);
          overflow: hidden;
          box-shadow:
            0 0 14px rgba(114, 255, 159, 0.06),
            inset 0 0 16px rgba(114, 255, 159, 0.04);
        }

        .cv-image {
          position: absolute;
          inset: 0;
          width: 80%;
          height: 80%;
          object-fit: contain;
          filter:
            grayscale(1)
            contrast(1.15)
            brightness(0.75)
            sepia(1)
            hue-rotate(55deg)
            saturate(4.2);
          mix-blend-mode: screen;
          opacity: 0.92;
        }

        .cv-green-overlay {
          position: absolute;
          inset: 0;
          background: rgba(70, 255, 140, 0.14);
          mix-blend-mode: screen;
          pointer-events: none;
        }

        .cv-scanlines {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            to bottom,
            rgba(120, 255, 170, 0.12) 0px,
            rgba(120, 255, 170, 0.12) 1px,
            transparent 2px,
            transparent 4px
          );
          opacity: 0.6;
          pointer-events: none;
          mix-blend-mode: screen;
        }

        .cv-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at center,
            transparent 55%,
            rgba(0, 0, 0, 0.18) 78%,
            rgba(0, 0, 0, 0.4) 100%
          );
          pointer-events: none;
        }

        .taskbar {
          height: 52px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          padding: 0 0.75rem;
          border-top: 1px solid rgba(114, 255, 159, 0.25);
          background:
            linear-gradient(
              to top,
              rgba(3, 12, 6, 0.96),
              rgba(9, 26, 13, 0.92)
            );
          box-shadow: inset 0 1px 0 rgba(114, 255, 159, 0.05);
        }

        .taskbar-left,
        .taskbar-right {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          min-width: 0;
        }

        .start-menu-anchor {
          position: relative;
        }

        .start-btn,
        .taskbar-app {
          height: 32px;
          display: flex;
          align-items: center;
          padding: 0 0.8rem;
          border: 1px solid rgba(114, 255, 159, 0.3);
          background: rgba(114, 255, 159, 0.045);
          color: #85ffaf;
          font-family: "Glixels", sans-serif;
          font-size: 1rem;
          letter-spacing: 0.06em;
          white-space: nowrap;
          text-shadow:
            0 0 5px rgba(114, 255, 159, 0.45),
            0 0 10px rgba(114, 255, 159, 0.1);
        }

        .start-btn {
          cursor: pointer;
        }

        .start-btn:hover {
          background: rgba(114, 255, 159, 0.08);
        }

        .start-menu {
          position: absolute;
          left: 0;
          bottom: calc(100% + 8px);
          width: 240px;
          padding: 0.45rem;
          border: 1px solid rgba(114, 255, 159, 0.38);
          background:
            linear-gradient(
              to bottom,
              rgba(8, 22, 11, 0.98),
              rgba(3, 12, 6, 0.98)
            );
          box-shadow:
            0 0 18px rgba(114, 255, 159, 0.08),
            inset 0 0 18px rgba(114, 255, 159, 0.04);
          z-index: 40;
        }

        .start-menu-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.7rem;
          padding: 0.65rem 0.7rem;
          border: 1px solid transparent;
          background: transparent;
          color: #85ffaf;
          font-family: "Glixels", sans-serif;
          font-size: 0.95rem;
          text-align: left;
          cursor: pointer;
          letter-spacing: 0.04em;
          text-shadow:
            0 0 5px rgba(114, 255, 159, 0.42),
            0 0 10px rgba(114, 255, 159, 0.08);
        }

        .start-menu-item:hover {
          border-color: rgba(114, 255, 159, 0.3);
          background: rgba(114, 255, 159, 0.06);
        }

        .start-menu-icon {
          width: 22px;
          height: 22px;
          object-fit: contain;
          flex-shrink: 0;
          image-rendering: pixelated;
          filter:
            drop-shadow(0 0 5px rgba(114, 255, 159, 0.42))
            drop-shadow(0 0 10px rgba(114, 255, 159, 0.08));
        }

        .cv-menu-icon {
          border: 1px solid rgba(114, 255, 159, 0.16);
          background: rgba(114, 255, 159, 0.03);
          padding: 1px;
        }

        .taskbar-app.active {
          background: rgba(114, 255, 159, 0.09);
        }

        .taskbar-right span {
          font-size: 0.9rem;
          letter-spacing: 0.06em;
          text-shadow:
            0 0 5px rgba(114, 255, 159, 0.42),
            0 0 10px rgba(114, 255, 159, 0.08);
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

        @media (max-width: 900px) {
          .crt-frame {
            padding: 1.5rem;
          }

          .crt-screen {
            width: min(94vw, 1100px);
            height: min(78vh, 760px);
          }

          .desktop-clock {
            font-size: 2rem;
          }

          .popup-window {
            width: min(500px, calc(100% - 2rem));
          }

          .taskbar-right span:nth-child(1),
          .taskbar-right span:nth-child(2) {
            display: none;
          }
        }

        @media (max-width: 560px) {
          .desktop-header {
            padding: 0.7rem 0.8rem 0.4rem;
          }

          .desktop-title {
            font-size: 1rem;
          }

          .desktop-clock {
            font-size: 1.5rem;
          }

          .popup-window {
            min-height: 220px;
          }

          .window-content {
            font-size: 1rem;
            line-height: 1.6;
          }

          .taskbar {
            padding: 0 0.45rem;
          }

          .start-btn,
          .taskbar-app {
            padding: 0 0.5rem;
            font-size: 0.75rem;
          }

          .start-menu {
            width: 210px;
          }

          .start-menu-item {
            font-size: 0.78rem;
            padding: 0.58rem 0.55rem;
          }
        }
      `}</style>
    </>
  );
}