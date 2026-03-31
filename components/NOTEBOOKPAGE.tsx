import { useEffect, useRef, useState } from "react";

type NotebookPageData = {
  fileNumber: string;
  archiveLabel: string;
  title: string;
  text: string;
  footerName: string;
  pageNumber: string;
  images?: string[];
};

export default function NOTEBOOKPAGE() {
  const [currentPage, setCurrentPage] = useState(0);
  const [leftPressed, setLeftPressed] = useState(false);
  const [rightPressed, setRightPressed] = useState(false);
  const [scale, setScale] = useState(1);

  const pageTurnAudioRef = useRef<HTMLAudioElement | null>(null);

  const pages: NotebookPageData[] = [
    {
      fileNumber: "01",
      archiveLabel: "ARCHIVE : PORTFOLIO INFO",
      title: "ABOUT THIS PORTFOLIO",
      text: `Whilst making this portfolio, I figured it'd be best to add a little document detailing the process, as I want this portfolio to show my capability and diversity as a designer.

This document will run through the various softwares, techniques and areas of design I've covered throughout the creation of this portfolio.

This portfolio was designed and developed by myself, with some assistance of AI tools solely for implementation purposes.`,
      footerName: "FREDERICK HARDEN",
      pageNumber: "01",
      images: ["/sprites/LOGOFHBLACK.webp"],
    },
    {
      fileNumber: "02",
      archiveLabel: "ARCHIVE : PORTFOLIO INFO",
      title: "BLENDER MODELLING",
      text: `Kicking off this project I had to face my first of many new challenges, Blender.
I'm relatively inexperienced with Blender and so the prospect of creating a fully interactive portfolio based off of a blender file was quite daunting.

With some tutorials for practice, I was able to pick it up fairly quick and chose to model a retro TV screen, which I was able to set up in a scene with 3 more of various sizes. I then used BlenderKit to add some extra items to the environment.

I finished this off by adding a lightbulb and a small ceiling element at the top.`,
      footerName: "FREDERICK HARDEN",
      pageNumber: "02",
    },
  ];

  useEffect(() => {
    const updateScale = () => {
      const DESIGN_WIDTH = 1400;
      const DESIGN_HEIGHT = 1120;

      const widthScale = window.innerWidth / DESIGN_WIDTH;
      const heightScale = window.innerHeight / DESIGN_HEIGHT;

      setScale(Math.min(widthScale, heightScale, 1));
    };

    updateScale();
    window.addEventListener("resize", updateScale);

    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const page = pages[currentPage];

  const playPageTurnSound = () => {
    if (!pageTurnAudioRef.current) {
      pageTurnAudioRef.current = new Audio("/audio/PAGETURN.mp3");
      pageTurnAudioRef.current.volume = 0.9;
    }

    pageTurnAudioRef.current.currentTime = 0;
    pageTurnAudioRef.current.play().catch(() => {});
  };

  const goLeft = () => {
    playPageTurnSound();
    setCurrentPage((prev) => (prev - 1 + pages.length) % pages.length);
  };

  const goRight = () => {
    playPageTurnSound();
    setCurrentPage((prev) => (prev + 1) % pages.length);
  };

  return (
    <div style={styles.page}>
      <div
        style={{
          ...styles.scaleWrap,
          transform: `scale(${scale})`,
        }}
      >
        <div style={styles.notebookWrap}>
          <button
            onMouseDown={() => setLeftPressed(true)}
            onMouseUp={() => setLeftPressed(false)}
            onMouseLeave={() => setLeftPressed(false)}
            onTouchStart={() => setLeftPressed(true)}
            onTouchEnd={() => setLeftPressed(false)}
            onClick={goLeft}
            aria-label="Previous page"
            style={{ ...styles.arrowButton, ...styles.arrowLeft }}
          >
            <img
              src={
                leftPressed
                  ? "/sprites/ARROWLCLICK.webp"
                  : "/sprites/ARROWL.webp"
              }
              alt=""
              style={styles.arrowImage}
            />
          </button>

          <div style={styles.notebook}>
            <div style={styles.spine} />

            <div style={styles.paper}>
              <div style={styles.paperTexture} />
              <div style={styles.paperStains} />
              <div style={styles.paperEdges} />

              <div style={styles.headerRow}>
                <div style={styles.label}>FILE // {page.fileNumber}</div>
                <div style={styles.label}>{page.archiveLabel}</div>
              </div>

              <div style={styles.mainContent}>
                <div style={styles.textColumn}>
                  <h1 style={styles.title}>{page.title}</h1>
                  <div style={styles.rule} />
                  <p style={styles.text}>{page.text}</p>
                </div>

                <div style={styles.imageColumn}>
                  {page.images?.map((imageSrc, index) => (
                    <img
                      key={`${page.pageNumber}-${index}`}
                      src={imageSrc}
                      alt=""
                      style={styles.referenceImage}
                    />
                  ))}
                </div>
              </div>

              <div style={styles.footer}>
                <span>{page.footerName}</span>
                <span>PAGE {page.pageNumber}</span>
              </div>
            </div>
          </div>

          <button
            onMouseDown={() => setRightPressed(true)}
            onMouseUp={() => setRightPressed(false)}
            onMouseLeave={() => setRightPressed(false)}
            onTouchStart={() => setRightPressed(true)}
            onTouchEnd={() => setRightPressed(false)}
            onClick={goRight}
            aria-label="Next page"
            style={{ ...styles.arrowButton, ...styles.arrowRight }}
          >
            <img
              src={
                rightPressed
                  ? "/sprites/ARROWRCLICK.webp"
                  : "/sprites/ARROWR.webp"
              }
              alt=""
              style={styles.arrowImage}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "98vh",
    width: "98%",
    margin: 0,
    padding: "24px",
    boxSizing: "border-box" as const,
    display: "flex" as const,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    position: "relative" as const,
    overflow: "hidden",
  },

  scaleWrap: {
    display: "flex" as const,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    transformOrigin: "center center",
  },

  notebookWrap: {
    position: "relative" as const,
    width: "1280px",
    height: "900px",
    display: "flex" as const,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },

  notebook: {
    width: "980px",
    height: "1000px",
    display: "flex" as const,
    position: "relative" as const,
    transform: "perspective(1200px) rotateX(5deg) rotateY(5deg)",
    imageRendering: "pixelated" as const,
    filter: "contrast(1.02) saturate(0.92)",
  },

  spine: {
    width: "50px",
    background:
      "linear-gradient(to left, #4a2a11 0%, #35200d 35%, #24140900 100%)",
    borderRight: "5px solid #090909",
  },

  paper: {
    flex: 1,
    position: "relative" as const,
    overflow: "hidden",
    backgroundColor: "#d7cebb",
    backgroundImage: `
      linear-gradient(to right, transparent 74px, rgba(145,50,50,0.34) 74px, rgba(145,50,50,0.34) 76px, transparent 76px),
      repeating-linear-gradient(to bottom, transparent 0px, transparent 31px, rgba(126,149,201,0.46) 31px, rgba(126,149,201,0.46) 32px),
      linear-gradient(to bottom, rgba(255,255,255,0.09), rgba(0,0,0,0.07))
    `,
    padding: "36px 36px 44px 96px",
  },

  paperTexture: {
    position: "absolute" as const,
    inset: 0,
    pointerEvents: "none" as const,
    zIndex: 1,
    opacity: 0.18,
    backgroundImage: 'url("/sprites/paperstain.webp")',
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    mixBlendMode: "multiply" as const,
  },

  paperStains: {
    position: "absolute" as const,
    inset: 0,
    pointerEvents: "none" as const,
    zIndex: 1,
    opacity: 0.75,
    background: `
      radial-gradient(circle at 14% 84%, rgba(120,82,36,0.16) 0%, rgba(120,82,36,0.12) 4%, transparent 11%),
      radial-gradient(circle at 86% 79%, rgba(70,54,31,0.12) 0%, rgba(70,54,31,0.08) 3.5%, transparent 10%),
      radial-gradient(circle at 76% 28%, rgba(96,74,38,0.08) 0%, transparent 8%),
      radial-gradient(circle at 28% 12%, rgba(80,58,24,0.05) 0%, transparent 6%)
    `,
    filter: "blur(0.4px)",
    mixBlendMode: "multiply" as const,
  },

  paperEdges: {
    position: "absolute" as const,
    inset: 0,
    pointerEvents: "none" as const,
    zIndex: 1,
    background: `
      linear-gradient(to right, rgba(70, 44, 18, 0.35), transparent 8%, transparent 92%, rgba(45, 28, 12, 0.12)),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.18), transparent 10%, transparent 88%, rgba(50, 32, 14, 0.23))
    `,
  },

  headerRow: {
    position: "relative" as const,
    zIndex: 2,
    display: "flex" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: "24px",
    gap: "12px",
    flexWrap: "wrap" as const,
  },

  label: {
    fontFamily: "Glixels, monospace",
    fontSize: "1rem",
    letterSpacing: "0.08em",
    color: "#3b3427",
    textShadow: "1px 1px 0 rgba(255,255,255,0.18)",
    transform: "translateY(-1px)",
  },

  mainContent: {
    position: "relative" as const,
    zIndex: 2,
    display: "flex" as const,
    justifyContent: "space-between" as const,
    alignItems: "flex-start" as const,
    gap: "35px",
    width: "100%",
  },

  textColumn: {
    width: "450px",
    flexShrink: 0,
  },

  imageColumn: {
    width: "300px",
    display: "flex" as const,
    flexDirection: "column" as const,
    alignItems: "flex-end" as const,
    gap: "15px",
    paddingTop: "18px",
    flexShrink: 0,
  },

  referenceImage: {
    width: "300px",
    height: "auto",
    display: "block",
    imageRendering: "pixelated" as const,
    objectFit: "contain" as const,
    border: "none",
    backgroundColor: "rgba(255,255,255,0.04)",
  },

  title: {
    margin: 0,
    color: "#111",
    fontSize: "clamp(3rem, 8vw, 6rem)",
    lineHeight: 0.65,
    letterSpacing: "0.04em",
    fontFamily: "Glixels, monospace",
    textTransform: "uppercase" as const,
    textShadow: "2px 2px 0 rgba(255,255,255,0.16)",
    transform: "translateY(18px)",
    minHeight: "3.2em",
    whiteSpace: "pre-line" as const,
  },

  rule: {
    width: "100%",
    height: "3px",
    margin: "30px 0 20px 0",
    background:
      "linear-gradient(to right, rgb(0, 0, 0), rgb(0, 0, 0), transparent)",
    transform: "translateY(-180px)",
  },

  text: {
    margin: "0 0 18px 0",
    maxWidth: "680px",
    color: "#1b1b1b",
    fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
    lineHeight: 0.91,
    letterSpacing: "0.03em",
    fontFamily: "Glixels, monospace",
    textShadow: "1px 1px 0 rgba(255,255,255,0.14)",
    transform: "translateY(-185px)",
    minHeight: "6em",
    whiteSpace: "pre-line" as const,
  },

  footer: {
    position: "absolute" as const,
    left: "96px",
    right: "36px",
    bottom: "16px",
    zIndex: 2,
    display: "flex" as const,
    justifyContent: "space-between" as const,
    fontFamily: "Glixels, monospace",
    fontSize: "1rem",
    color: "#3f382b",
    letterSpacing: "0.08em",
    transform: "translateY(-15px)",
  },

  arrowButton: {
    position: "absolute" as const,
    top: "50%",
    transform: "translateY(-50%)",
    width: "72px",
    height: "72px",
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    background: "transparent",
    border: "none",
    padding: 0,
    cursor: "pointer",
    zIndex: 20,
  },

  arrowLeft: {
    left: "-20px",
  },

  arrowRight: {
    right: "-20px",
  },

  arrowImage: {
    width: "64px",
    height: "64px",
    display: "block",
    imageRendering: "pixelated" as const,
  },
};