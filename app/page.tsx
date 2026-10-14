"use client";
import { useEffect, useRef, useState } from "react";
import ProjectCard from "./components/ProjectCard";
import {
  portfolioEntries,
  type PortfolioEntry,
} from "./components/ProjectData";
import UIProject from "./components/UIProject";
import TypographyProject from "./components/TypographyProject";
import GraphicDesignProject from "./components/GraphicDesignProject";
import BrandingProject from "./components/BrandingProject";

const DESIGN_WIDTH = 2560;
const DESIGN_HEIGHT = 1440;
const MIN_ZOOM = 0.35;
const MAX_ZOOM = 2.5;
// Mobile starts closer to the projects instead of showing the whole board.
const MOBILE_START_ZOOM = 1.8;
const MOBILE_BREAKPOINT = 768;
// Limit the bitmap, NOT the CSS/world size, to avoid mobile Safari memory crashes.
const MAX_CANVAS_PIXELS = 3_000_000;
const MAX_CANVAS_DIMENSION = 2048;
const ZOOM_SPEED = 0.0015;
const GRID_SIZE = 36;
const MOUSE_RADIUS = 150;
const GRID_LINE_OPACITY = 0.07;
const MAJOR_GRID_INTERVAL = 5;
const MAJOR_GRID_STRENGTH = 0.4;

const ABOUT_WIDTH = GRID_SIZE * 40; 
const ABOUT_HEIGHT = GRID_SIZE * 25; 
const ABOUT_X = -ABOUT_WIDTH / 2; 
const ABOUT_Y = GRID_SIZE * 10; 
const ABOUT_CAMERA = {
  x: 0,
  y: ABOUT_Y + ABOUT_HEIGHT / 2,
};
const ARCHIVE_WIDTH = GRID_SIZE * 10;
const ARCHIVE_HEIGHT = GRID_SIZE * 4;
const ARCHIVE_X = -GRID_SIZE * 20;
const ARCHIVE_01_Y = GRID_SIZE * -7;
const ARCHIVE_02_Y = GRID_SIZE * -2;
const ARCHIVE_03_Y = GRID_SIZE * 3;

const FEATURED_SIZE = GRID_SIZE * 20;
const FEATURED_X = GRID_SIZE * 10;
const FEATURED_Y = GRID_SIZE * -13;
const FEATURED_INFO_HEIGHT = GRID_SIZE * 3.2;

const ABOUT_DRAW_DURATION = 1700;
const ABOUT_FILL_DURATION = 500;

const SECTION_WIPE_DURATION = 350;

const EXPERIENCE_DRAW_DURATION = 1700;
const EXPERIENCE_FILL_DURATION = 500;

const SKILLS_HEIGHT = GRID_SIZE * 28;
const SKILLS_Y = ABOUT_Y;
const SKILLS_CAMERA = { x: 0, y: SKILLS_Y + SKILLS_HEIGHT / 2 };
const SKILLS_DRAW_DURATION = 1700;
const SKILLS_FILL_DURATION = 500;
const SKILLS_BAR_DURATION = 1000;

const CONTACT_WIDTH = GRID_SIZE * 30;
const CONTACT_HEIGHT = GRID_SIZE * 15;
const CONTACT_X = -CONTACT_WIDTH / 2;
const CONTACT_Y = ABOUT_Y;
const CONTACT_CAMERA = { x: 0, y: CONTACT_Y + CONTACT_HEIGHT / 2 };
const CONTACT_DRAW_DURATION = 1500;
const CONTACT_FILL_DURATION = 500;
const CONTACT_ASSETS = {
  artstation: "/Sprites/ARTSTN.png",
  instagram: "/Sprites/INSTA.png",
  linkedin: "/Sprites/LNKDN.png",
  behance: "/Sprites/BHNCE.png",
  pdf: "/Sprites/LOGOFH.webp",
  download: "/Sprites/DWNLD.png",
};
const CONTACT_LINKS = [
  { name: "Artstation", icon: CONTACT_ASSETS.artstation, href: "https://frederickharden.artstation.com/" },
  { name: "Instagram", icon: CONTACT_ASSETS.instagram, href: "https://www.instagram.com/fredz.exe/" },
  { name: "LinkedIn", icon: CONTACT_ASSETS.linkedin, href: "https://www.linkedin.com/in/frederick-harden-812717339/" },
  { name: "Behance", icon: CONTACT_ASSETS.behance, href: "https://www.behance.net/hardenfrederick" },
] as const;
const SKILL_GROUPS = [
  { title: "UI / UX", skills: [["Wireframing", 7], ["Prototyping", 8], ["User Research", 9], ["Interaction Design", 6], ["Design Systems", 7]] },
  { title: "Graphic Design", skills: [["Branding", 8], ["Typography", 6], ["Layout Design", 8], ["Print Design", 7], ["Visual Identity", 6]] },
  { title: "Software", skills: [["Adobe Suite", 9], ["Figma", 7], ["Blender", 5], ["Aseprite", 10], ["UE + Unity", 2, "new + learning"]] },
] as const;
export default function Home() {
  const [entered, setEntered] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loaderRingsVisible, setLoaderRingsVisible] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileCollapsed, setProfileCollapsed] = useState(false);
  type SectionName = "about" | "experience" | "skills" | "contact";
  type SectionPhase = "hidden" | "drawing" | "fill" | "content";
  const [activeSection, setActiveSection] = useState<SectionName | null>(null);
  const [aboutPhase, setAboutPhase] = useState<SectionPhase>("hidden");
  const [experiencePhase, setExperiencePhase] = useState<SectionPhase>("hidden");
  const [skillsPhase, setSkillsPhase] = useState<SectionPhase>("hidden");
  const [contactPhase, setContactPhase] = useState<SectionPhase>("hidden");
  const [portfolioScale, setPortfolioScale] = useState(1);
  const [stageHeight, setStageHeight] = useState(DESIGN_HEIGHT);
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [gridPointerTick, setGridPointerTick] = useState(0);
  const gridPointerFrame = useRef<number | null>(null);
  const lastGridPointerFrame = useRef(0);
  const requestGridPointerDraw = () => {
    if (gridPointerFrame.current !== null) return;
    gridPointerFrame.current = requestAnimationFrame((now) => {
      gridPointerFrame.current = null;
      // Mouse glow at up to 30fps, rather than redrawing at 60+fps forever.
      if (now - lastGridPointerFrame.current >= 33) {
        lastGridPointerFrame.current = now;
        setGridPointerTick((n) => n + 1);
      }
    });
  };
  const [projectPreviewOpen, setProjectPreviewOpen] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<number | null>(null);

  const previewPreviousView = useRef({
    camera: { x: 0, y: 0 },
    zoom: 1,
  });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: -9999, y: -9999 });
  const revealAnimation = useRef<number | null>(null);
  const viewAnimation = useRef<number | null>(null);
  const aboutPanelRef = useRef<HTMLElement | null>(null);
  const experiencePanelRef = useRef<HTMLElement | null>(null);
  const skillsPanelRef = useRef<HTMLElement | null>(null);
  const contactPanelRef = useRef<HTMLElement | null>(null);
  const hasOpenedSection = useRef(false);
  const bloomReveal = useRef(0);
  const touches = useRef({
    pinching: false,
    distance: 0,
    zoom: 1,
  });
  const clampZoom = (value: number) =>
    Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
  const changeZoom = (amount: number) => {
    setZoom((prev) => {
      const next = Math.round((prev + amount) * 10) / 10;
      return clampZoom(next);
    });
  };
  const openProjectPreview = async (project: PortfolioEntry) => {
    previewPreviousView.current = {
      camera: { ...camera },
      zoom,
    };

    setMenuOpen(false);
    setProfileCollapsed(true);
    setActiveProjectId(project.id);
    setProjectPreviewOpen(true);

    await animateViewTo(
      {
        x: project.x * GRID_SIZE + GRID_SIZE * 5,
        y: project.y * GRID_SIZE + GRID_SIZE * 5,
      },
      1,
      650
    );
  };

  const closeProjectPreview = async () => {
    setProjectPreviewOpen(false);
    setActiveProjectId(null);
    setProfileCollapsed(false);

    await animateViewTo(
      previewPreviousView.current.camera,
      previewPreviousView.current.zoom,
      650
    );
  };
  const animateViewTo = (
    targetCamera: { x: number; y: number },
    targetZoom: number,
    duration = 900
  ) => {
    if (viewAnimation.current) {
      cancelAnimationFrame(viewAnimation.current);
    }
    const startCamera = { ...camera };
    const startZoom = zoom;
    const startTime = performance.now();
    const easeInOutCubic = (t: number) =>
      t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    return new Promise<void>((resolve) => {
      const animate = (currentTime: number) => {
        const rawProgress = Math.min(
          (currentTime - startTime) / duration,
          1
        );
        const progress = easeInOutCubic(rawProgress);
        setCamera({
          x:
            startCamera.x +
            (targetCamera.x - startCamera.x) * progress,
          y:
            startCamera.y +
            (targetCamera.y - startCamera.y) * progress,
        });
        setZoom(
          startZoom +
            (targetZoom - startZoom) * progress
        );
        if (rawProgress < 1) {
          viewAnimation.current = requestAnimationFrame(animate);
        } else {
          setCamera(targetCamera);
          setZoom(targetZoom);
          viewAnimation.current = null;
          resolve();
        }
      };
      viewAnimation.current = requestAnimationFrame(animate);
    });
  };
  const resetView = () => {
    void animateViewTo({ x: 0, y: 0 }, 1, 900);
  };
  const minimumDelay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  const shouldCenterSection = (target: { x: number; y: number }) => {
    if (!hasOpenedSection.current) return true;
    const dx = (target.x - camera.x) * zoom;
    const dy = (target.y - camera.y) * zoom;
    return Math.hypot(dx, dy) >= Math.hypot(DESIGN_WIDTH / 2, stageHeight / 2);
  };
  const centerSectionIfNeeded = async (target: { x: number; y: number }) => {
    const shouldCenter = shouldCenterSection(target);
    hasOpenedSection.current = true;
    if (shouldCenter) await animateViewTo(target, 1, 900);
  };
  const wipeCurrentSection = async () => {
    const panel =
      activeSection === "about"
        ? aboutPanelRef.current
        : activeSection === "experience"
        ? experiencePanelRef.current
        : activeSection === "skills"
        ? skillsPanelRef.current
        : activeSection === "contact"
        ? contactPanelRef.current
        : null;
    if (!panel) return;
    const animation = panel.animate(
      [
        { clipPath: "inset(0 0 0 0)" },
        { clipPath: "inset(0 0 0 100%)" },
      ],
      {
        duration: SECTION_WIPE_DURATION,
        easing: "cubic-bezier(0.76, 0, 0.24, 1)",
        fill: "forwards",
      }
    );
    try {
      await animation.finished;
    } catch {}
  };
  const revealAbout = async () => {
    await minimumDelay(40);
    setAboutPhase("drawing");
    await minimumDelay(ABOUT_DRAW_DURATION);
    setAboutPhase("fill");
    await minimumDelay(ABOUT_FILL_DURATION);
    setAboutPhase("content");
    await minimumDelay(420);
  };
  const revealExperience = async () => {
    await minimumDelay(40);
    setExperiencePhase("drawing");
    await minimumDelay(EXPERIENCE_DRAW_DURATION);
    setExperiencePhase("fill");
    await minimumDelay(EXPERIENCE_FILL_DURATION);
    setExperiencePhase("content");
    await minimumDelay(420);
  };
  const revealSkills = async () => {
    await minimumDelay(40);
    setSkillsPhase("drawing");
    await minimumDelay(SKILLS_DRAW_DURATION);
    setSkillsPhase("fill");
    await minimumDelay(SKILLS_FILL_DURATION);
    setSkillsPhase("content");
    await minimumDelay(SKILLS_BAR_DURATION);
  };
  const openAbout = async () => {
    if (!interactive && activeSection !== "about") return;
    setMenuOpen(false);
    setInteractive(false);
    if (activeSection === "about" && aboutPhase === "content") {
      await centerSectionIfNeeded(ABOUT_CAMERA);
      setInteractive(true);
      return;
    }
    if (activeSection && activeSection !== "about") await wipeCurrentSection();
    setAboutPhase("hidden");
    setActiveSection("about");
    await centerSectionIfNeeded(ABOUT_CAMERA);
    await revealAbout();
    setInteractive(true);
  };
  const openExperience = async () => {
    if (!interactive && activeSection !== "experience") return;
    setMenuOpen(false);
    setInteractive(false);
    if (activeSection === "experience" && experiencePhase === "content") {
      await centerSectionIfNeeded(ABOUT_CAMERA);
      setInteractive(true);
      return;
    }
    if (activeSection && activeSection !== "experience") await wipeCurrentSection();
    setExperiencePhase("hidden");
    setActiveSection("experience");
    await centerSectionIfNeeded(ABOUT_CAMERA);
    await revealExperience();
    setInteractive(true);
  };
  const openSkills = async () => {
    if (!interactive && activeSection !== "skills") return;
    setMenuOpen(false);
    setInteractive(false);
    if (activeSection === "skills" && skillsPhase === "content") {
      await centerSectionIfNeeded(SKILLS_CAMERA);
      setInteractive(true);
      return;
    }
    if (activeSection && activeSection !== "skills") await wipeCurrentSection();
    setSkillsPhase("hidden");
    setActiveSection("skills");
    await centerSectionIfNeeded(SKILLS_CAMERA);
    await revealSkills();
    setInteractive(true);
  };
  const revealContact = async () => {
    await minimumDelay(40);
    setContactPhase("drawing");
    await minimumDelay(CONTACT_DRAW_DURATION);
    setContactPhase("fill");
    await minimumDelay(CONTACT_FILL_DURATION);
    setContactPhase("content");
    await minimumDelay(420);
  };
  const openContact = async () => {
    if (!interactive && activeSection !== "contact") return;
    setMenuOpen(false);
    setInteractive(false);
    if (activeSection === "contact" && contactPhase === "content") {
      await centerSectionIfNeeded(CONTACT_CAMERA);
      setInteractive(true);
      return;
    }
    if (activeSection && activeSection !== "contact") await wipeCurrentSection();
    setContactPhase("hidden");
    setActiveSection("contact");
    await centerSectionIfNeeded(CONTACT_CAMERA);
    await revealContact();
    setInteractive(true);
  };
  const getStageOffset = () => {
    const scaledWidth = DESIGN_WIDTH * portfolioScale;
    return {
      x: (window.innerWidth - scaledWidth) / 2,
      y: 0,
    };
  };
  const screenToStage = (clientX: number, clientY: number) => {
    const offset = getStageOffset();
    return {
      x: (clientX - offset.x) / portfolioScale,
      y: (clientY - offset.y) / portfolioScale,
    };
  };
  const enterSite = async () => {
    if (entered) return;
    setEntered(true);
    setIntroVisible(false);
    setLoading(true);
    setLoaderRingsVisible(true);
    setLogoVisible(false);
    setInteractive(false);
    bloomReveal.current = 0;
    await minimumDelay(1500);
    setLoaderRingsVisible(false);
    await minimumDelay(260);
    setRevealed(true);
    requestAnimationFrame(() => {
      setLoading(false);
      setLogoVisible(true);
      const startTime = performance.now();
      const animateReveal = (currentTime: number) => {
        const progress = Math.min((currentTime - startTime) / 820, 1);
        bloomReveal.current = 1 - Math.pow(1 - progress, 3);
        if (progress < 1) {
          revealAnimation.current = requestAnimationFrame(animateReveal);
        } else {
  bloomReveal.current = 1;
  revealAnimation.current = null;

  void (async () => {
  setMenuOpen(true);

  setTimeout(() => {
    setMenuOpen(false);
  }, 2000);

  await revealAbout();
  setActiveSection("about");
  setInteractive(true);
})();
}
      };
      revealAnimation.current = requestAnimationFrame(animateReveal);
    });
  };
  const getTouchDistance = (a: React.Touch, b: React.Touch) =>
    Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  useEffect(() => {
    const updateViewport = () => {
      const scale = window.innerWidth / DESIGN_WIDTH;
      setPortfolioScale(scale);
      setStageHeight(window.innerHeight / scale);
    };
    updateViewport();
    // Only override initial zoom on small screens; don't reset user zoom on rotation.
    if (window.innerWidth <= MOBILE_BREAKPOINT) setZoom(MOBILE_START_ZOOM);
    window.addEventListener("resize", updateViewport);
    return () => {
      window.removeEventListener("resize", updateViewport);
    };
  }, []);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        enterSite();
      }
    };
    window.addEventListener("keydown", down);
    return () => {
      window.removeEventListener("keydown", down);
    };
  }, [entered]);
  useEffect(() => {
    if (!revealed) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const glowCanvas = document.createElement("canvas");
    const glowSize = 48;
    const glowCtx = glowCanvas.getContext("2d");
    glowCanvas.width = glowSize;
    glowCanvas.height = glowSize;
    if (glowCtx) {
      const cx = glowSize / 2;
      const cy = glowSize / 2;
      const cyan = glowCtx.createRadialGradient(
        cx - 3,
        cy,
        0,
        cx - 3,
        cy,
        glowSize / 2
      );
      cyan.addColorStop(0, "rgba(245,255,255,0.95)");
      cyan.addColorStop(0.16, "rgba(80,225,235,0.5)");
      cyan.addColorStop(0.45, "rgba(80,225,235,0.16)");
      cyan.addColorStop(1, "rgba(80,225,235,0)");
      glowCtx.fillStyle = cyan;
      glowCtx.fillRect(0, 0, glowSize, glowSize);
      const red = glowCtx.createRadialGradient(
        cx + 3,
        cy,
        0,
        cx + 3,
        cy,
        glowSize / 2
      );
      red.addColorStop(0, "rgba(255,245,245,0.35)");
      red.addColorStop(0.18, "rgba(235,75,70,0.34)");
      red.addColorStop(0.5, "rgba(235,75,70,0.1)");
      red.addColorStop(1, "rgba(235,75,70,0)");
      glowCtx.fillStyle = red;
      glowCtx.fillRect(0, 0, glowSize, glowSize);
    }
    const draw = () => {
      const width = DESIGN_WIDTH;
      const height = stageHeight;
      // Mobile can have a very tall logical stage (~5,500px). A full DPR
      // backing store would consume hundreds of MB and crash Safari.
      const preferredDpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const resolutionScale = Math.min(
        preferredDpr,
        MAX_CANVAS_DIMENSION / Math.max(width, height),
        Math.sqrt(MAX_CANVAS_PIXELS / (width * height))
      );
      const targetWidth = Math.max(1, Math.floor(width * resolutionScale));
      const targetHeight = Math.max(1, Math.floor(height * resolutionScale));
      if (
        canvas.width !== targetWidth ||
        canvas.height !== targetHeight
      ) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }
      ctx.setTransform(targetWidth / width, 0, 0, targetHeight / height, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const startWorldX =
        Math.floor((camera.x - width / 2 / zoom) / GRID_SIZE) * GRID_SIZE;
      const endWorldX =
        Math.ceil((camera.x + width / 2 / zoom) / GRID_SIZE) * GRID_SIZE;
      const startWorldY =
        Math.floor((camera.y - height / 2 / zoom) / GRID_SIZE) * GRID_SIZE;
      const endWorldY =
        Math.ceil((camera.y + height / 2 / zoom) / GRID_SIZE) * GRID_SIZE;
      const estimatedIntersections =
        ((endWorldX - startWorldX) / GRID_SIZE) *
        ((endWorldY - startWorldY) / GRID_SIZE);
      const multiplier = estimatedIntersections > 45000 ? 8
        : estimatedIntersections > 12000 ? 4
        : estimatedIntersections > 4000 ? 2 : 1;
      const step = GRID_SIZE * multiplier;
      ctx.lineWidth = Math.max(0.2, 0.55 * zoom);
      ctx.strokeStyle = `rgba(190,220,220,${GRID_LINE_OPACITY})`;
      ctx.beginPath();
      for (
        let worldX = Math.floor(startWorldX / step) * step;
        worldX <= endWorldX;
        worldX += step
      ) {
        const x = width / 2 + (worldX - camera.x) * zoom;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (
        let worldY = Math.floor(startWorldY / step) * step;
        worldY <= endWorldY;
        worldY += step
      ) {
        const y = height / 2 + (worldY - camera.y) * zoom;
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();
      for (
        let worldX = Math.floor(startWorldX / step) * step;
        worldX <= endWorldX;
        worldX += step
      ) {
        for (
          let worldY = Math.floor(startWorldY / step) * step;
          worldY <= endWorldY;
          worldY += step
        ) {
          const x = width / 2 + (worldX - camera.x) * zoom;
const y = height / 2 + (worldY - camera.y) * zoom;
const gridX = Math.round(worldX / GRID_SIZE);
const gridY = Math.round(worldY / GRID_SIZE);
const isMajorIntersection =
  gridX % MAJOR_GRID_INTERVAL === 0 &&
  gridY % MAJOR_GRID_INTERVAL === 0;
const dx = x - mouse.current.x;
const dy = y - mouse.current.y;
const distSq = dx * dx + dy * dy;
const nearMouse =
  distSq < MOUSE_RADIUS * MOUSE_RADIUS;
const mouseInfluence = nearMouse
  ? 1 - Math.sqrt(distSq) / MOUSE_RADIUS
  : 0;
const influence = Math.max(
  mouseInfluence,
  isMajorIntersection ? MAJOR_GRID_STRENGTH : 0
);
const normalPointSize = Math.max(0.45, 0.72 * zoom);
const majorPointSize = Math.max(0.8, 1.35 * zoom);
const pointSize = isMajorIntersection
  ? majorPointSize
  : normalPointSize;
ctx.beginPath();
ctx.arc(x, y, pointSize, 0, Math.PI * 2);
ctx.fillStyle = isMajorIntersection
  ? "rgba(245,255,255,0.82)"
  : "rgba(240,250,250,0.55)";
ctx.fill();
if (influence > 0 && glowCtx) {
  const size = 12 + influence * 14;
  ctx.globalAlpha = 0.35 + influence * 0.65;
  ctx.drawImage(
    glowCanvas,
    x - size / 2,
    y - size / 2,
    size,
    size
  );
  ctx.globalAlpha = 1;
  const flare = 2 + influence * 5;
  ctx.strokeStyle = `rgba(225,250,250,${
    0.08 + influence * 0.2
  })`;
  ctx.lineWidth = 0.4;
  ctx.beginPath();
  ctx.moveTo(x - flare, y);
  ctx.lineTo(x + flare, y);
  ctx.moveTo(x, y - flare);
  ctx.lineTo(x, y + flare);
  ctx.stroke();
}
}
}
      const revealAmount = bloomReveal.current;
      if (revealAmount < 1) {
        const centerX = width / 2;
        const centerY = height / 2;
        const maxRadius = Math.hypot(width, height) / 2;
        const bloomRadius = 120 + maxRadius * revealAmount;
        const innerRadius = Math.max(0, bloomRadius * 0.28);
        const outerAlpha = Math.min(0.92, revealAmount * 0.92);
        ctx.globalCompositeOperation = "destination-in";
        const mask = ctx.createRadialGradient(
          centerX,
          centerY,
          innerRadius,
          centerX,
          centerY,
          bloomRadius
        );
        mask.addColorStop(0, "rgba(255,255,255,1)");
        mask.addColorStop(
          0.58,
          `rgba(255,255,255,${Math.max(0.72, outerAlpha)})`
        );
        mask.addColorStop(
          1,
          `rgba(255,255,255,${outerAlpha})`
        );
        ctx.fillStyle = mask;
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = "source-over";
        const strength = (1 - revealAmount) * 0.18;
        if (strength > 0.01) {
          const bloom = ctx.createRadialGradient(
            centerX,
            centerY,
            0,
            centerX,
            centerY,
            Math.min(360, bloomRadius * 0.7)
          );
          bloom.addColorStop(
            0,
            `rgba(245,255,255,${strength})`
          );
          bloom.addColorStop(
            0.35,
            `rgba(80,225,235,${strength * 0.22})`
          );
          bloom.addColorStop(
            0.7,
            `rgba(235,75,70,${strength * 0.12})`
          );
          bloom.addColorStop(
            1,
            "rgba(0,0,0,0)"
          );
          ctx.fillStyle = bloom;
          ctx.fillRect(0, 0, width, height);
        }
      }
    };
    // Draw only when the view, reveal or pointer changes.
    // The old implementation ran a permanent animation loop and restarted it
    // every time camera/zoom state changed.
    draw();
  }, [revealed, camera, zoom, stageHeight, gridPointerTick]);
  useEffect(() => {
    return () => {
      if (gridPointerFrame.current !== null) cancelAnimationFrame(gridPointerFrame.current);
      if (viewAnimation.current !== null) cancelAnimationFrame(viewAnimation.current);
      if (revealAnimation.current) {
        cancelAnimationFrame(revealAnimation.current);
      }
    };
  }, []);
  return (
    <>
      <main
        className="portfolio-viewport"
        onClick={() => {
          if (!revealed) enterSite();
        }}
        onMouseMove={(e) => {
          mouse.current = screenToStage(e.clientX, e.clientY);
          requestGridPointerDraw();
        }}
        onWheel={(e) => {
          if (!interactive || projectPreviewOpen) return;
          setZoom((prev) =>
            clampZoom(
              prev - e.deltaY * ZOOM_SPEED
            )
          );
        }}
        onPointerDown={(e) => {
          if (!interactive || projectPreviewOpen) return;
          dragging.current = true;
          lastPointer.current = {
            x: e.clientX,
            y: e.clientY,
          };
        }}
        onPointerMove={(e) => {
          mouse.current = screenToStage(e.clientX, e.clientY);
          requestGridPointerDraw();
          if (
            !dragging.current ||
            !interactive ||
            projectPreviewOpen ||
            touches.current.pinching
          ) {
            return;
          }
          const dx =
            (e.clientX -
              lastPointer.current.x) /
            portfolioScale;
          const dy =
            (e.clientY -
              lastPointer.current.y) /
            portfolioScale;
          setCamera((prev) => ({
            x: prev.x - dx / zoom,
            y: prev.y - dy / zoom,
          }));
          lastPointer.current = {
            x: e.clientX,
            y: e.clientY,
          };
        }}
        onPointerUp={() => {
          dragging.current = false;
        }}
        onPointerLeave={() => {
          dragging.current = false;
          mouse.current = { x: -9999, y: -9999 };
          requestGridPointerDraw();
        }}
        onTouchStart={(e) => {
          if (
            !interactive ||
            projectPreviewOpen ||
            e.touches.length !== 2
          ) {
            return;
          }
          touches.current.pinching = true;
          touches.current.distance =
            getTouchDistance(
              e.touches[0],
              e.touches[1]
            );
          touches.current.zoom = zoom;
        }}
        onTouchMove={(e) => {
          if (
            !interactive ||
            projectPreviewOpen ||
            e.touches.length !== 2 ||
            !touches.current.pinching
          ) {
            return;
          }
          e.preventDefault();
          const distance =
            getTouchDistance(
              e.touches[0],
              e.touches[1]
            );
          setZoom(
            clampZoom(
              touches.current.zoom *
                (distance /
                  touches.current.distance)
            )
          );
        }}
        onTouchEnd={() => {
          touches.current.pinching = false;
        }}
      >
        <div
          className="portfolio-stage"
          style={{
            height: `${stageHeight}px`,
            transform: `translateX(-50%) scale(${portfolioScale})`,
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 z-[100] flex items-center justify-center bg-black"
            style={{
              opacity: loading ? 1 : 0,
              visibility: loading
                ? "visible"
                : "hidden",
              transition:
                "opacity 180ms cubic-bezier(0.22, 1, 0.36, 1), visibility 0s linear 180ms",
            }}
          >
            <div
              style={{
                transform: loaderRingsVisible
                  ? "scale(1)"
                  : "scale(1.035)",
                opacity: loaderRingsVisible
                  ? 1
                  : 0,
                transition:
                  "transform 260ms cubic-bezier(0.22, 1, 0.36, 1), opacity 260ms ease",
              }}
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                src="/Sprites/BGAnim.webm"
                className="h-[320px] w-[320px] object-contain"
              />
            </div>
          </div>
          {revealed && (
            <>
              <div
  className={`pointer-events-none absolute inset-0 profile-orb-layer ${
    profileCollapsed ? "collapsed" : ""
  }`}
>
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  src="/Sprites/BGAnim.webm"
                  className="profile-orb-video"
                />
              </div>
              <div
                className={`absolute inset-0 ${
                  projectPreviewOpen ? "z-[100]" : "z-10"
                }`}
              >
                <canvas
                  ref={canvasRef}
                  className="absolute left-0 top-0"
                />
                {projectPreviewOpen && (
  <div
    className="pointer-events-none absolute inset-0"
    style={{
      zIndex: 9000,
      background: "rgba(0, 0, 0, 0.82)",
    }}
  />
)}
                <div
                  className="pointer-events-none absolute z-20"
                  style={{
                    left: `calc(50% + ${-camera.x * zoom}px)`,
                    top: `calc(50% + ${-camera.y * zoom}px)`,
                    transform: `translate(-50%, -50%) scale(${zoom})`,
                    transformOrigin: "center",
                  }}
                >
                  <div
                    className="grid-logo-shell"
                    style={{
                      opacity:
                        logoVisible ? 1 : 0,
                      transform:
                        logoVisible
                          ? "scale(1)"
                          : "scale(0.88)",
                      transition:
                        "opacity 220ms ease, transform 360ms cubic-bezier(0.16, 1.18, 0.3, 1)",
                    }}
                  >
                    <div className="grid-logo-mark">
                      <img
                        src="/Sprites/LOGOFH.webp"
                        alt=""
                        draggable={false}
                        className="grid-logo-image"
                      />
                    </div>
                  </div>
                </div>
<div
  className="pointer-events-none absolute z-[19]"
  style={{
    left: `calc(50% + ${-camera.x * zoom}px)`,
    top: `calc(50% + ${-camera.y * zoom}px)`,
    transform: `translate(-50%, -50%) scale(${zoom})`,
    transformOrigin: "center",
  }}
>
  <button
    className="archive-card"
    style={{
      left: `${ARCHIVE_X}px`,
      top: `${ARCHIVE_01_Y}px`,
      width: `${ARCHIVE_WIDTH}px`,
      height: `${ARCHIVE_HEIGHT}px`,
    }}
    onPointerDown={(e) => {
      e.stopPropagation();
    }}
    onClick={(e) => {
      e.stopPropagation();
      window.location.href = "/old";
    }}
    aria-label="View old portfolio"
  >
    <div className="archive-scanlines" />

    <div className="archive-content">
      <div className="archive-title">Archive 01</div>
      <div className="archive-subtitle">View old portfolio</div>
    </div>

    <span className="archive-arrow" aria-hidden="true">
      <span className="archive-arrow-line" />
    </span>
  </button>
</div>
<div
  className="pointer-events-none absolute z-[19]"
  style={{
    left: `calc(50% + ${-camera.x * zoom}px)`,
    top: `calc(50% + ${-camera.y * zoom}px)`,
    transform: `translate(-50%, -50%) scale(${zoom})`,
    transformOrigin: "center",
  }}
>
  <button
    className="archive-placeholder-card"
    style={{
      left: `${ARCHIVE_X}px`,
      top: `${ARCHIVE_02_Y}px`,
      width: `${ARCHIVE_WIDTH}px`,
      height: `${ARCHIVE_HEIGHT}px`,
    }}
    onPointerDown={(e) => e.stopPropagation()}
    onClick={(e) => {
      e.stopPropagation();
      window.location.href = "/universitywork";
    }}
    aria-label="University Projects"
  >
    <div className="archive-placeholder-content">
      <div className="archive-placeholder-title">Archive 02</div>
      <div className="archive-placeholder-subtitle">University Projects</div>
    </div>

    <span className="archive-arrow" aria-hidden="true">
  <span className="archive-arrow-line" />
</span>
  </button>
</div>

<div
  className="pointer-events-none absolute z-[19]"
  style={{
    left: `calc(50% + ${-camera.x * zoom}px)`,
    top: `calc(50% + ${-camera.y * zoom}px)`,
    transform: `translate(-50%, -50%) scale(${zoom})`,
    transformOrigin: "center",
  }}
>
  <button
    className="archive-placeholder-card"
    style={{
      left: `${ARCHIVE_X}px`,
      top: `${ARCHIVE_03_Y}px`,
      width: `${ARCHIVE_WIDTH}px`,
      height: `${ARCHIVE_HEIGHT}px`,
    }}
    onPointerDown={(e) => e.stopPropagation()}
    onClick={(e) => {
      e.stopPropagation();
      window.location.href = "/collegework";
    }}
    aria-label="College Work"
  >
    <div className="archive-placeholder-content">
      <div className="archive-placeholder-title">Archive 03</div>
      <div className="archive-placeholder-subtitle">College Work</div>
    </div>

    <span className="archive-arrow" aria-hidden="true">
  <span className="archive-arrow-line" />
</span>
  </button>
</div>
<div
  className="pointer-events-none absolute z-[19]"
  style={{
    left: `calc(50% + ${-camera.x * zoom}px)`,
    top: `calc(50% + ${-camera.y * zoom}px)`,
    transform: `translate(-50%, -50%) scale(${zoom})`,
    transformOrigin: "center",
  }}
>
  <button
    className="featured-project"
    style={{
      left: `${FEATURED_X}px`,
      top: `${FEATURED_Y}px`,
      width: `${FEATURED_SIZE}px`,
      height: `${FEATURED_SIZE}px`,
    }}
    onPointerDown={(e) => {
      e.stopPropagation();
    }}
    onClick={(e) => {
  e.stopPropagation();

  const featuredProject = portfolioEntries.find(
    (project) => project.id === 5  //project id bc its dumbAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
  );

  if (featuredProject) {
    void openProjectPreview(featuredProject);
  }
}}
    aria-label="Destiny 2 UI"
  >
    <span
      className="featured-corner featured-corner-tl"
      aria-hidden="true"
    />
    <span
      className="featured-corner featured-corner-tr"
      aria-hidden="true"
    />
    <span
      className="featured-corner featured-corner-bl"
      aria-hidden="true"
    />
    <span
      className="featured-corner featured-corner-br"
      aria-hidden="true"
    />

    <div className="featured-label">
      <span>Featured Project</span>
      <span
        className="featured-label-underline"
        aria-hidden="true"
      />
    </div>

    <div className="featured-preview">
  <img
    src="/foliowork/Slide%201.webp"
    alt="Destiny 2 UI Exploration"
  />
</div>

    <div
      className="featured-info"
      style={{
        height: `${FEATURED_INFO_HEIGHT}px`,
      }}
    >
      <div className="featured-copy">
        <h2>Destiny 2 UI</h2>
        <p>UI Design / Graphic Design</p>
      </div>

      <span className="featured-arrow" aria-hidden="true">
        <span className="featured-arrow-line" />
      </span>
    </div>
  </button>
</div>

 {portfolioEntries.filter((project) => {
                   if (activeProjectId === project.id) return true;
                   // Leave a generous buffer so projects don't pop in at the edges.
                   const margin = 1600;
                   const halfWidth = DESIGN_WIDTH / (2 * zoom);
                   const halfHeight = stageHeight / (2 * zoom);
                   const px = project.x * GRID_SIZE;
                   const py = project.y * GRID_SIZE;
                   return px >= camera.x - halfWidth - margin &&
                     px <= camera.x + halfWidth + margin &&
                     py >= camera.y - halfHeight - margin &&
                     py <= camera.y + halfHeight + margin;
                 }).map((project) => {
                  const isActiveProject = activeProjectId === project.id;

                  return (
                    <div
                      key={project.id}
                      className="pointer-events-none absolute"
                      style={{
                        left: `calc(50% + ${-camera.x * zoom}px)`,
                        top: `calc(50% + ${-camera.y * zoom}px)`,
                        transform: `translate(-50%, -50%) scale(${zoom})`,
                        transformOrigin: "center",
                        zIndex: isActiveProject ? 10000 : 19,
                      }}
                    >
                      <div
                        className="absolute"
                        style={{
                          left: `${project.x * GRID_SIZE}px`,
                          top: `${project.y * GRID_SIZE}px`,
                          pointerEvents: "auto",
                        }}
                        onPointerDown={(e) => {
                          e.stopPropagation();
                        }}
                        onPointerMove={(e) => {
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        {project.format === "ui" ? (
  <UIProject
    project={project}
    gridSize={GRID_SIZE}
    onOpen={openProjectPreview}
    onClose={closeProjectPreview}
  />
) : project.format === "typography" ? (
  <TypographyProject
    project={project}
    gridSize={GRID_SIZE}
    onOpen={openProjectPreview}
    onClose={closeProjectPreview}
  />
  ) : project.format === "graphic" ? (
  <GraphicDesignProject
    project={project}
    gridSize={GRID_SIZE}
    onOpen={openProjectPreview}
    onClose={closeProjectPreview}
  />
  ) : project.format === "branding" ? (
  <BrandingProject
    project={project}
    gridSize={GRID_SIZE}
    onOpen={openProjectPreview}
    onClose={closeProjectPreview}
  />
) : (
  <ProjectCard
    project={project}
    gridSize={GRID_SIZE}
  />
)}
                      </div>
                    </div>
                  );
                })}

                {aboutPhase !== "hidden" && (
                  <div
                    className="pointer-events-none absolute z-[18]"
                    style={{
                      left: `calc(50% + ${-camera.x * zoom}px)`,
                      top: `calc(50% + ${-camera.y * zoom}px)`,
                      transform: `translate(-50%, -50%) scale(${zoom})`,
                      transformOrigin: "center",
                    }}
                  >
                    <section
                      ref={aboutPanelRef}
                      className={`about-world-panel about-${aboutPhase}`}
                      style={{
                        left: `${ABOUT_X}px`,
                        top: `${ABOUT_Y}px`,
                        width: `${ABOUT_WIDTH}px`,
                        height: `${ABOUT_HEIGHT}px`,
                      }}
                      aria-label="About Me"
                    >
                      <div className="about-black-fill" />
                      <svg
                        className="about-line-layer"
                        viewBox={`0 0 ${ABOUT_WIDTH} ${ABOUT_HEIGHT}`}
                        aria-hidden="true"
                      >
                        <rect
                          className="about-draw-line about-frame-line"
                          x="0.5"
                          y="0.5"
                          width={ABOUT_WIDTH - 1}
                          height={ABOUT_HEIGHT - 1}
                          rx="0"
                          pathLength="1"
                        />
                        <rect
                          className="about-draw-line about-image-line"
                          x={GRID_SIZE * 1.5}
                          y={GRID_SIZE * 1.5}
                          width={GRID_SIZE * 12}
                          height={GRID_SIZE * 12}
                          pathLength="1"
                        />
                        <line
                          className="about-draw-line about-divider-line"
                          x1={GRID_SIZE * 1.5}
                          y1={GRID_SIZE * 15}
                          x2={ABOUT_WIDTH - GRID_SIZE * 1.5}
                          y2={GRID_SIZE * 15}
                          pathLength="1"
                        />
                        <line
                          className="about-draw-line about-heading-line about-heading-line-1"
                          x1={GRID_SIZE * 3}
                          y1={GRID_SIZE * 18.2}
                          x2={GRID_SIZE * 7}
                          y2={GRID_SIZE * 18.2}
                          pathLength="1"
                        />
                        <line
                          className="about-draw-line about-heading-line about-heading-line-2"
                          x1={GRID_SIZE * 16}
                          y1={GRID_SIZE * 18.2}
                          x2={GRID_SIZE * 20}
                          y2={GRID_SIZE * 18.2}
                          pathLength="1"
                        />
                        <line
                          className="about-draw-line about-heading-line about-heading-line-3"
                          x1={GRID_SIZE * 29}
                          y1={GRID_SIZE * 18.2}
                          x2={GRID_SIZE * 33}
                          y2={GRID_SIZE * 18.2}
                          pathLength="1"
                        />
                      </svg>
                      <div className="about-content-layer">
                        <div
                          className="about-logo-wrap about-reveal"
                          style={{ animationDelay: "0ms" }}
                        >
                          <img
                            src="/Sprites/LOGOFH.webp"
                            alt="FH"
                            draggable={false}
                            className="about-logo-image"
                          />
                        </div>
                        <div
                          className="about-copy about-reveal"
                          style={{ animationDelay: "55ms" }}
                        >
                          <h2>About Me</h2>
                          <p>
                            A creative and versatile graphic designer with a strong
                            foundation in digital design, a broad technical skill set
                            and proficiency across various design software. I bring
                            valuable experience from social work environments,
                            excelling in both team collaboration and solo projects with
                            confident communication in social settings.
                          </p>
                          <p>
                            Outside of design, I am a dedicated mixed martial artist
                            with a background in dance and four years of experience
                            in acting, singing and stage performance, showcasing
                            my creativity, discipline and ability to perform under
                            pressure. I also have years of experience in catering and
                            customer service.
                          </p>
                        </div>
                        <div
                          className="about-info about-info-focus about-reveal"
                          style={{ animationDelay: "115ms" }}
                        >
                          <h3>Focus</h3>
                          <div className="about-info-rule" />
                          <p>UI / UX Design</p>
                          <p>Graphic Design</p>
                          <p>Visual Identity</p>
                        </div>
                        <div
                          className="about-info about-info-experience about-reveal"
                          style={{ animationDelay: "170ms" }}
                        >
                          <h3>Experience</h3>
                          <div className="about-info-rule" />
                          <p>3+ Years</p>
                          <p>Freelance + Personal</p>
                          <p>Academic Projects</p>
                        </div>
                        <div
                          className="about-info about-info-location about-reveal"
                          style={{ animationDelay: "225ms" }}
                        >
                          <h3>Location</h3>
                          <div className="about-info-rule" />
                          <p>Coventry</p>
                          <p>United Kingdom</p>
                          <p>Available Globally</p>
                        </div>
                      </div>
                    </section>
                  </div>
                )}
                {activeSection === "experience" && (
                  <div
                    className="pointer-events-none absolute z-[18]"
                    style={{
                      left: `calc(50% + ${-camera.x * zoom}px)`,
                      top: `calc(50% + ${-camera.y * zoom}px)`,
                      transform: `translate(-50%, -50%) scale(${zoom})`,
                      transformOrigin: "center",
                    }}
                  >
                    <section
                      ref={experiencePanelRef}
                      className={`experience-world-panel experience-${experiencePhase}`}
                      style={{
                        left: `${ABOUT_X}px`,
                        top: `${ABOUT_Y}px`,
                        width: `${ABOUT_WIDTH}px`,
                        height: `${ABOUT_HEIGHT}px`,
                      }}
                      aria-label="Design Experience"
                    >
                      <div className="experience-black-fill" />
                      <svg
                        className="experience-line-layer"
                        viewBox={`0 0 ${ABOUT_WIDTH} ${ABOUT_HEIGHT}`}
                        aria-hidden="true"
                      >
                        <rect className="experience-draw-line experience-frame-line" x="0.5" y="0.5" width={ABOUT_WIDTH - 1} height={ABOUT_HEIGHT - 1} pathLength="1" />
                        <line className="experience-draw-line experience-title-line" x1={GRID_SIZE * 1.6} y1={GRID_SIZE * 4} x2={GRID_SIZE * 7} y2={GRID_SIZE * 4} pathLength="1" />
<line
  className="experience-draw-line experience-timeline-line"
  x1={GRID_SIZE * 2.45}
  y1={GRID_SIZE * 6.73}
  x2={GRID_SIZE * 2.45}
  y2={GRID_SIZE * 11}
  pathLength="1"
/>
<line
  className="experience-draw-line experience-timeline-line"
  x1={GRID_SIZE * 2.45}
  y1={GRID_SIZE * 12.1}
  x2={GRID_SIZE * 2.45}
  y2={GRID_SIZE * 16.37}
  pathLength="1"
/>
<line
  className="experience-draw-line experience-timeline-line"
  x1={GRID_SIZE * 2.45}
  y1={GRID_SIZE * 17.50}
  x2={GRID_SIZE * 2.45}
  y2={GRID_SIZE * 22.4}
  pathLength="1"
/>
                        {[6.15, 11.55, 16.95].map((y, index) => (
                          <g key={index}>
                            <circle className={`experience-draw-line experience-node-ring experience-node-${index + 1}`} cx={GRID_SIZE * 2.45} cy={GRID_SIZE * y} r={GRID_SIZE * 0.55} pathLength="1" />
                            <circle className={`experience-node-fill experience-node-fill-${index + 1}`} cx={GRID_SIZE * 2.45} cy={GRID_SIZE * y} r={GRID_SIZE * 0.34} />
                          </g>
                        ))}
                      </svg>
                      <div className="experience-content-layer">
                        <h2 className="experience-title experience-reveal" style={{ animationDelay: "0ms" }}>Design Experience</h2>
                        <article className="experience-entry experience-entry-1 experience-reveal" style={{ animationDelay: "70ms" }}>
                          <h3>2022 - 2024 / Cirencester College</h3>
                          <p>I studied Graphic Communication at Cirencester College starting in 2022. This is where I took my first steps in Design, starting off with my love for Pixel art, inspired by my favourite game Terraria. I went on to finish college as the Graphic Design student of the year with a beautiful 200 page horror exploration booklet to show for it.</p>
                        </article>
                        <article className="experience-entry experience-entry-2 experience-reveal" style={{ animationDelay: "125ms" }}>
                          <h3>2024 - Present / Coventry University</h3>
                          <p>I’m currently in my final year of studies for Graphic Design at Coventry University. Here I’ve been able to really explore not only what I am best at, but new and various areas of design that I would not have had the opportunity to explore had I not attended Uni. Importantly, I’ve gained much more knowledge on the design industry overall.</p>
                        </article>
                        <article className="experience-entry experience-entry-3 experience-reveal" style={{ animationDelay: "180ms" }}>
                          <h3>2025 - Present / HardenedMMA</h3>
                          <p>HardenedMMA is my own personal fightwear and streetwear brand. As a long time fan of MMA, I originally set out to create clothing that captured both my love for design and fighting. Whilst this project is mostly a small side project, I did gain a lot of valuable knowledge and experience when it came to clothing design and business management.</p>
                        </article>
                        <p className="experience-searching experience-reveal" style={{ animationDelay: "235ms" }}>Currently searching for future design job opportunities!</p>
                      </div>
                    </section>
                  </div>
                )}
                {activeSection === "skills" && (
                  <div
                    className="pointer-events-none absolute z-[18]"
                    style={{
                      left: `calc(50% + ${-camera.x * zoom}px)`,
                      top: `calc(50% + ${-camera.y * zoom}px)`,
                      transform: `translate(-50%, -50%) scale(${zoom})`,
                      transformOrigin: "center",
                    }}
                  >
                    <section
                      ref={skillsPanelRef}
                      className={`skills-world-panel skills-${skillsPhase}`}
                      style={{
                        left: `${ABOUT_X}px`,
                        top: `${SKILLS_Y}px`,
                        width: `${ABOUT_WIDTH}px`,
                        height: `${SKILLS_HEIGHT}px`,
                      }}
                      aria-label="Skills"
                    >
                      <div className="skills-black-fill" />
                      <svg className="skills-line-layer" viewBox={`0 0 ${ABOUT_WIDTH} ${SKILLS_HEIGHT}`} aria-hidden="true">
                        <rect className="skills-draw-line skills-frame-line" x="0.5" y="0.5" width={ABOUT_WIDTH - 1} height={SKILLS_HEIGHT - 1} pathLength="1" />
                        <line className="skills-draw-line skills-title-line" x1={GRID_SIZE * 2} y1={GRID_SIZE * 4} x2={GRID_SIZE * 9} y2={GRID_SIZE * 4} pathLength="1" />
                        <rect className="skills-draw-line skills-inner-line" x={GRID_SIZE * 2} y={GRID_SIZE * 5.5} width={GRID_SIZE * 36} height={GRID_SIZE * 20} pathLength="1" />
                        <line className="skills-draw-line skills-divider-line" x1={GRID_SIZE * 14} y1={GRID_SIZE * 5.5} x2={GRID_SIZE * 14} y2={GRID_SIZE * 25.5} pathLength="1" />
                        <line className="skills-draw-line skills-divider-line" x1={GRID_SIZE * 26} y1={GRID_SIZE * 5.5} x2={GRID_SIZE * 26} y2={GRID_SIZE * 25.5} pathLength="1" />
                      </svg>
                      <div className="skills-content-layer">
                        <h2 className="skills-title skills-reveal">Skills</h2>
                        <div className="skills-groups">
                          {SKILL_GROUPS.map((group) => (
                            <div className="skills-group" key={group.title}>
                              <h3 className="skills-reveal">{group.title}</h3>
                              <div className="skills-list">
                                {group.skills.map((skill) => {
                                  const [name, score, note] = skill;
                                  return (
                                    <div className="skill-item" key={name}>
                                      <div className="skill-label skills-reveal">
                                        <span>{name}</span>
                                        {note && <small>({note})</small>}
                                      </div>
                                      <div className="skill-meter">
                                        {Array.from({ length: 10 }, (_, index) => (
                                          <span
                                            key={index}
                                            className={`skill-cell ${index < score ? "filled" : "empty"}`}
                                            style={{ "--cell-index": index } as React.CSSProperties}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  </div>
                )}

                {activeSection === "contact" && (
                  <div
                    className="pointer-events-none absolute z-[18]"
                    style={{
                      left: `calc(50% + ${-camera.x * zoom}px)`,
                      top: `calc(50% + ${-camera.y * zoom}px)`,
                      transform: `translate(-50%, -50%) scale(${zoom})`,
                      transformOrigin: "center",
                    }}
                  >
                    <section
                      ref={contactPanelRef}
                      className={`contact-world-panel contact-${contactPhase}`}
                      style={{
                        left: `${CONTACT_X}px`,
                        top: `${CONTACT_Y}px`,
                        width: `${CONTACT_WIDTH}px`,
                        height: `${CONTACT_HEIGHT}px`,
                      }}
                      aria-label="Contact Details"
                    >
                      <div className="contact-black-fill" />
                      <svg className="contact-line-layer" viewBox={`0 0 ${CONTACT_WIDTH} ${CONTACT_HEIGHT}`} aria-hidden="true">
                        <rect className="contact-draw-line contact-frame-line" x="0.5" y="0.5" width={CONTACT_WIDTH - 1} height={CONTACT_HEIGHT - 1} pathLength="1" />
                        <line className="contact-draw-line contact-title-line" x1={GRID_SIZE * 1.15} y1={GRID_SIZE * 3.1} x2={GRID_SIZE * 10.6} y2={GRID_SIZE * 3.1} pathLength="1" />
                        <rect className="contact-draw-line contact-info-line" x={GRID_SIZE * 1.15} y={GRID_SIZE * 3.55} width={GRID_SIZE * 15} height={GRID_SIZE * 5.15} pathLength="1" />
                        <rect className="contact-draw-line contact-download-line" x={GRID_SIZE * 1.15} y={GRID_SIZE * 9.45} width={GRID_SIZE * 27.7} height={GRID_SIZE * 4.15} pathLength="1" />
                      </svg>
                      <div className="contact-content-layer">
                        <h2 className="contact-title contact-reveal">Contact Details</h2>
                        <div className="contact-info contact-reveal">
                          <div>
                            <span>Email</span>
                            <strong>frederickhdesign@gmail.com</strong>
                          </div>
                          <div>
                            <span>Phone</span>
                            <strong>+44 07484 153810</strong>
                          </div>
                        </div>
                        <div className="contact-socials">
                          {CONTACT_LINKS.map((link, index) => (
                            <a
                              className="contact-social contact-reveal"
                              style={{ animationDelay: `${70 + index * 55}ms` }}
                              href={link.href}
                              key={link.name}
                              onClick={(e) => {
                              }}
                            >
                              <span className="contact-icon-box">
                                <img src={link.icon} alt="" draggable={false} />
                              </span>
                              <span>{link.name}</span>
                              <span className="contact-arrow">↗</span>
                            </a>
                          ))}
                        </div>
                        <a
                          className="contact-download contact-reveal"
                          style={{ animationDelay: "290ms" }}
                          href={CONTACT_ASSETS.download}
                          download="FrederickHDesignCV.pdf"
                        >
                          <span className="contact-pdf-box">
                            <img src={CONTACT_ASSETS.pdf} alt="" draggable={false} />
                          </span>
                          <strong>Download CV</strong>
                          <span className="contact-download-arrow">
                            <img src={CONTACT_ASSETS.download} alt="" draggable={false} />
                          </span>
                        </a>
                      </div>
                    </section>
                  </div>
                )}
              </div>
              <div
                className={`profile-ui ${
                  profileCollapsed
                    ? "collapsed"
                    : ""
                }`}
                onPointerDown={(e) =>
                  e.stopPropagation()
                }
                onPointerMove={(e) =>
                  e.stopPropagation()
                }
                onWheel={(e) =>
                  e.stopPropagation()
                }
              >
                <div className="profile-bar">
                  <img
                    src="/Sprites/profilebar.png"
                    alt=""
                    draggable={false}
                    className="profile-bar-image"
                  />
                  <div className="profile-text">
                    <div className="profile-name">
                      FREDERICK HARDEN
                    </div>
                    <div className="profile-role">
                      UI / GRAPHIC DESIGNER
                    </div>
                  </div>
                  <button
                    className={`profile-toggle ${
                      menuOpen
                        ? "open"
                        : ""
                    }`}
                    onClick={(e) => {e.stopPropagation();
                      setMenuOpen(
                        (prev) => !prev);
                    }}
                    aria-label={
                      menuOpen
                        ? "Close menu"
                        : "Open menu"
                    }
                  >
                    <span className="profile-chevron" />
                  </button>
                </div>
                <div
                  className={`profile-dropdown ${
                    menuOpen ? "open" : ""
                  }`}
                >
                  <div className="profile-dropdown-inner">
                    <button
                      className="profile-link"
                      onClick={(e) => {
                        e.stopPropagation();
                        void openAbout();
                      }}
                    >
                      <span className="profile-link-dot" />
                      <span>ABOUT ME</span>
                    </button>
                    <button
                      className="profile-link"
                      onClick={(e) => {
                        e.stopPropagation();
                        void openExperience();
                      }}
                    >
                      <span className="profile-link-dot" />
                      <span>EXPERIENCE</span>
                    </button>
                    <button
                      className="profile-link"
                      onClick={(e) => {
                        e.stopPropagation();
                        void openSkills();
                      }}
                    >
                      <span className="profile-link-dot" />
                      <span>SKILLS</span>
                    </button>
                    <button
                      className="profile-link"
                      onClick={(e) => {
                        e.stopPropagation();
                        void openContact();
                      }}
                    >
                      <span className="profile-link-dot" />
                      <span>CONTACT ME</span>
                    </button>
                  </div>
                </div>
              </div>
              <button
                className={`profile-collapse-toggle ${
                  menuOpen
                    ? "menu-open"
                    : ""
                } ${
                  profileCollapsed
                    ? "collapsed"
                    : ""
                }`}
                onPointerDown={(e) =>
                  e.stopPropagation()
                }
                onClick={(e) => {
                  e.stopPropagation();
                  if (menuOpen) return;
                  setProfileCollapsed(
                    (prev) => !prev
                  );
                }}
                aria-label={
                  profileCollapsed
                    ? "Show profile navigation"
                    : "Hide profile navigation"
                }
              >
                <span className="profile-collapse-chevron" />
              </button>
            </>
          )}
          {revealed && (
            <div
              className="view-controls"
              onPointerDown={(e) => e.stopPropagation()}
              onPointerMove={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
            >
              <button
                className="reset-view-button"
                onClick={(e) => {
                  e.stopPropagation();
                  resetView();
                }}
              >
                RESET
              </button>
              <div className="zoom-controls">
                <button
                  className="zoom-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    changeZoom(-0.1);
                  }}
                  disabled={zoom <= MIN_ZOOM}
                  aria-label="Zoom out"
                >
                  <span className="minus-icon" />
                </button>
                <div className="zoom-percentage">
                  {Math.round(zoom * 100)}%
                </div>
                <button
                  className="zoom-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    changeZoom(0.1);
                  }}
                  disabled={zoom >= MAX_ZOOM}
                  aria-label="Zoom in"
                >
                  <span className="plus-icon" />
                </button>
              </div>
            </div>
          )}
          {introVisible && (
            <div className="absolute inset-0 z-40">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="enter-square">
                  <img
                    src="/Sprites/LOGOFH.webp"
                    alt="FH Logo"
                    draggable={false}
                    className="fh-logo"
                  />
                </div>
              </div>
              {!entered && (
                <p className="absolute left-1/2 top-1/2 mt-[120px] -translate-x-1/2 whitespace-nowrap animate-pulse text-xs uppercase tracking-[0.45em] text-[#d9fff0]/75">
                  Click / Enter
                </p>
              )}
              
              {!entered && (
  <p
    className="absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap text-xs uppercase tracking-[0.45em] text-[#d9fff0]/75"
    style={{
      top: "auto",
      bottom: "64px",
    }}
  >
    Note: The canvas is optimised for closer viewing. If you experience reduced performance, zoom in for a smoother experience.
  </p>
)}
            </div>
          )}
        </div>
      </main>
      <style jsx>{`
        .portfolio-viewport {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100dvh;
          overflow: hidden;
          background: #000;
          color: #fff;
          touch-action: none;
          overscroll-behavior: none;
          cursor: ${interactive
            ? "grab"
            : entered
            ? "default"
            : "pointer"};
        }
        .portfolio-viewport:active {
          cursor: ${interactive
            ? "grabbing"
            : entered
            ? "default"
            : "pointer"};
        }
        .portfolio-stage {
          position: absolute;
          left: 50%;
          top: 0;
          width: ${DESIGN_WIDTH}px;
          transform-origin: top center;
          overflow: hidden;
        }
        .enter-square {
          position: relative;
          width: 160px;
          height: 160px;
          border: 1px solid rgba(235, 245, 245, 0.9);
          background: rgba(0, 0, 0, 0.84);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            -8px 0 22px rgba(80, 225, 235, 0.16),
            -18px 0 50px rgba(80, 225, 235, 0.07),
            8px 0 22px rgba(235, 75, 70, 0.14),
            18px 0 50px rgba(235, 75, 70, 0.06);
        }
        .fh-logo,
        .grid-logo-image {
          width: 80px;
          height: auto;
          object-fit: contain;
          user-select: none;
        }
        .fh-logo {
          pointer-events: none;
        }
        .grid-logo-shell {
          position: relative;
          width: 230px;
          height: 230px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .grid-logo-mark {
          position: relative;
          width: 160px;
          height: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(235, 245, 245, 0.8);
          background: rgba(0, 0, 0, 0.82);
          box-shadow:
            -8px 0 22px rgba(80, 225, 235, 0.16),
            -18px 0 50px rgba(80, 225, 235, 0.07),
            8px 0 22px rgba(235, 75, 70, 0.14),
            18px 0 50px rgba(235, 75, 70, 0.06);
        }
        .about-world-panel {
          position: absolute;
          overflow: visible;
          color: rgba(250, 252, 252, 0.98);
          font-family: inherit;
        }
        .about-black-fill {
          position: absolute;
          inset: 1px;
          z-index: 0;
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
  rgba(0, 0, 0, 0.9);
          opacity: 0;
          transition: opacity ${ABOUT_FILL_DURATION}ms ease;
        }
        .about-fill .about-black-fill,
        .about-content .about-black-fill {
          opacity: 0.8;
        }
        .about-line-layer {
          position: absolute;
          inset: 0;
          z-index: 2;
          width: 100%;
          height: 100%;
          overflow: visible;
          fill: none;
        }
        .about-draw-line {
          stroke: rgba(242, 249, 249, 0.94);
          stroke-width: 1.3;
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          stroke-linecap: square;
          shape-rendering: geometricPrecision;
        }
        .about-drawing .about-frame-line,
        .about-fill .about-frame-line,
        .about-content .about-frame-line {
          animation: aboutDraw 1550ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .about-drawing .about-image-line,
        .about-fill .about-image-line,
        .about-content .about-image-line {
          animation: aboutDraw 1180ms 180ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .about-drawing .about-divider-line,
        .about-fill .about-divider-line,
        .about-content .about-divider-line {
          animation: aboutDraw 980ms 420ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes aboutDraw {
          from {
            stroke-dashoffset: 1;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        .about-content-layer {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
        }
        .about-reveal {
          opacity: 0;
          transform: translateY(10px);
          filter: blur(4px);
        }
        .about-content .about-reveal {
          animation: aboutContentIn 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes aboutContentIn {
          from {
            opacity: 0;
            transform: translateY(10px);
            filter: blur(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
        .about-logo-wrap {
          position: absolute;
          left: ${GRID_SIZE * 1.5}px;
          top: ${GRID_SIZE * 1.5}px;
          width: ${GRID_SIZE * 12}px;
          height: ${GRID_SIZE * 12}px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .about-logo-image {
          width: 260px;
          height: auto;
          object-fit: contain;
          user-select: none;
        }
        .about-copy {
          position: absolute;
          left: ${GRID_SIZE * 15}px;
          top: ${GRID_SIZE * 1.25}px;
          width: ${GRID_SIZE * 22}px;
        }
        .about-copy h2 {
          margin: 0 0 29px;
          font-size: 55px;
          line-height: 1;
          font-weight: 700;
          letter-spacing: -0.045em;
        }
        .about-copy p {
          margin: 0 0 27px;
          font-size: 25px;
          line-height: 1.28;
          font-weight: 500;
          letter-spacing: -0.025em;
          color: rgba(250, 252, 252, 0.96);
        }
        .about-info {
          position: absolute;
          top: ${GRID_SIZE * 16.35}px;
        }
        .about-info-focus {
          left: ${GRID_SIZE * 3}px;
          width: ${GRID_SIZE * 9.5}px;
        }
        .about-info-experience {
          left: ${GRID_SIZE * 16.5}px;
          width: ${GRID_SIZE * 10.5}px;
        }
        .about-info-location {
          left: ${GRID_SIZE * 31.5}px;
          width: ${GRID_SIZE * 9.5}px;
        }
        .about-info h3 {
          margin: 0;
          font-size: 48px;
          line-height: 1;
          font-weight: 700;
          letter-spacing: -0.04em;
        }
        .about-info-rule {
          width: 150px;
          height: 1px;
          margin: 28px 0 30px;
          background: rgba(242, 249, 249, 0.9);
        }
        .about-info p {
          margin: 0 0 12px;
          font-size: 28px;
          line-height: 1.28;
          font-weight: 500;
          letter-spacing: -0.025em;
          white-space: nowrap;
        }

        .archive-placeholder-card {
  position: absolute;
  pointer-events: auto;

  display: flex;
  align-items: center;

  padding: 0 28px;

  background: #000;
  border: 1px solid rgba(255, 255, 255, 0.85);
  color: #fff;

  text-align: left;
  cursor: pointer;
}

.archive-placeholder-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.archive-placeholder-title {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.archive-placeholder-subtitle {
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.6;
}

        .experience-world-panel {
          position: absolute;
          overflow: visible;
          color: rgba(250, 252, 252, 0.98);
          font-family: inherit;
        }
        .experience-black-fill {
          position: absolute;
          inset: 1px;
          z-index: 0;
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
  rgba(0, 0, 0, 0.9);
          opacity: 0;
          transition: opacity ${EXPERIENCE_FILL_DURATION}ms ease;
        }
        .experience-fill .experience-black-fill,
        .experience-content .experience-black-fill {
          opacity: 0.8;
        }
        .experience-line-layer {
          position: absolute;
          inset: 0;
          z-index: 2;
          width: 100%;
          height: 100%;
          overflow: visible;
          fill: none;
        }
        .experience-draw-line {
          stroke: rgba(242, 249, 249, 0.94);
          stroke-width: 1.3;
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          stroke-linecap: square;
          shape-rendering: geometricPrecision;
        }
        .experience-drawing .experience-frame-line,
        .experience-fill .experience-frame-line,
        .experience-content .experience-frame-line {
          animation: experienceDraw 1550ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .experience-drawing .experience-title-line,
        .experience-fill .experience-title-line,
        .experience-content .experience-title-line {
          animation: experienceDraw 650ms 260ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .experience-drawing .experience-timeline-line,
        .experience-fill .experience-timeline-line,
        .experience-content .experience-timeline-line {
          animation: experienceDraw 1120ms 360ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .experience-drawing .experience-node-ring,
        .experience-fill .experience-node-ring,
        .experience-content .experience-node-ring {
          animation: experienceDraw 420ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .experience-node-1 { animation-delay: 500ms !important; }
        .experience-node-2 { animation-delay: 760ms !important; }
        .experience-node-3 { animation-delay: 1020ms !important; }
        @keyframes experienceDraw {
          from { stroke-dashoffset: 1; }
          to { stroke-dashoffset: 0; }
        }
        .experience-node-fill {
          fill: rgba(250, 252, 252, 0.98);
          opacity: 0;
          transform-box: fill-box;
          transform-origin: center;
          transform: scale(0.25);
        }
        .experience-content .experience-node-fill {
          animation: experienceNodeIn 260ms cubic-bezier(0.16, 1.25, 0.3, 1) forwards;
        }
        .experience-node-fill-1 { animation-delay: 30ms !important; }
        .experience-node-fill-2 { animation-delay: 85ms !important; }
        .experience-node-fill-3 { animation-delay: 140ms !important; }
        @keyframes experienceNodeIn {
          to { opacity: 1; transform: scale(1); }
        }
        .experience-content-layer {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
        }
        .experience-reveal {
          opacity: 0;
          transform: translateY(10px);
          filter: blur(4px);
        }
        .experience-content .experience-reveal {
          animation: experienceContentIn 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes experienceContentIn {
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .experience-title {
          position: absolute;
          left: ${GRID_SIZE * 1.6}px;
          top: ${GRID_SIZE * 1.15}px;
          margin: 0;
          font-size: 55px;
          line-height: 1;
          font-weight: 700;
          letter-spacing: -0.04em;
        }
        .experience-entry {
          position: absolute;
          left: ${GRID_SIZE * 4.45}px;
          width: ${GRID_SIZE * 32.8}px;
        }
        .experience-entry-1 { top: ${GRID_SIZE * 5.65}px; }
        .experience-entry-2 { top: ${GRID_SIZE * 11.05}px; }
        .experience-entry-3 { top: ${GRID_SIZE * 16.45}px; }
        .experience-entry h3 {
          margin: 0 0 20px;
          font-size: 31px;
          line-height: 1;
          font-weight: 600;
          letter-spacing: -0.03em;
        }
        .experience-entry p,
        .experience-searching {
          margin: 0;
          font-size: 24px;
          line-height: 1.28;
          font-weight: 500;
          letter-spacing: -0.025em;
          color: rgba(250, 252, 252, 0.96);
        }
        .experience-searching {
          position: absolute;
          left: ${GRID_SIZE * 2.3}px;
          bottom: ${GRID_SIZE * 0.8}px;
          font-size: 30px;
        }
        .skills-world-panel {
          position: absolute;
          overflow: visible;
          color: rgba(250, 252, 252, 0.98);
          font-family: inherit;
        }
        .skills-black-fill {
          position: absolute;
          inset: 1px;
          z-index: 0;
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
            rgba(0, 0, 0, 0.9);
          opacity: 0;
          transition: opacity ${SKILLS_FILL_DURATION}ms ease;
        }
        .skills-fill .skills-black-fill,
        .skills-content .skills-black-fill { opacity: 0.8; }
        .skills-line-layer {
          position: absolute;
          inset: 0;
          z-index: 2;
          width: 100%;
          height: 100%;
          overflow: visible;
          fill: none;
        }
        .skills-draw-line {
          stroke: rgba(242, 249, 249, 0.94);
          stroke-width: 1.3;
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          stroke-linecap: square;
          shape-rendering: geometricPrecision;
        }
        .skills-drawing .skills-frame-line,
        .skills-fill .skills-frame-line,
        .skills-content .skills-frame-line {
          animation: skillsDraw 1550ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .skills-drawing .skills-title-line,
        .skills-fill .skills-title-line,
        .skills-content .skills-title-line {
          animation: skillsDraw 650ms 240ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .skills-drawing .skills-inner-line,
        .skills-fill .skills-inner-line,
        .skills-content .skills-inner-line {
          animation: skillsDraw 1200ms 280ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .skills-drawing .skills-divider-line,
        .skills-fill .skills-divider-line,
        .skills-content .skills-divider-line {
          animation: skillsDraw 900ms 520ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes skillsDraw {
          from { stroke-dashoffset: 1; }
          to { stroke-dashoffset: 0; }
        }
        .skills-content-layer {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
        }
        .skills-title {
          position: absolute;
          left: ${GRID_SIZE * 2}px;
          top: ${GRID_SIZE * 1.35}px;
          margin: 0;
          font-size: 55px;
          line-height: 1;
          font-weight: 700;
          letter-spacing: -0.04em;
        }
        .skills-groups {
          position: absolute;
          left: ${GRID_SIZE * 2}px;
          top: ${GRID_SIZE * 5.5}px;
          width: ${GRID_SIZE * 36}px;
          height: ${GRID_SIZE * 26.2}px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
        }
        .skills-group {
          padding: ${GRID_SIZE * 0.9}px ${GRID_SIZE * 0.95}px;
          min-width: 0;
        }
        .skills-group h3 {
          margin: 0 0 ${GRID_SIZE * 1.35}px;
          text-align: center;
          font-size: 40px;
          line-height: 1;
          font-weight: 650;
          letter-spacing: -0.035em;
        }
        .skills-list {
          display: flex;
          flex-direction: column;
          gap: ${GRID_SIZE * 0.8}px;
        }
        .skill-label {
          height: 34px;
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 8px;
          font-size: 27px;
          line-height: 1;
          font-weight: 500;
          letter-spacing: -0.025em;
          white-space: nowrap;
        }
        .skill-label small {
          font-size: 16px;
          font-weight: 500;
        }
        .skill-meter {
          width: 100%;
          height: 36px;
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          gap: 3px;
        }
        .skill-cell {
          display: block;
          min-width: 0;
          border: 1px solid rgba(242, 249, 249, 0.94);
          opacity: 0;
          transform: scaleX(0);
          transform-origin: left center;
        }
        .skill-cell.filled { background: rgba(250, 252, 252, 0.98); }
        .skill-cell.empty { background: transparent; }
        .skills-reveal {
          opacity: 0;
          transform: translateY(10px);
          filter: blur(4px);
        }
        .skills-content .skills-reveal {
          animation: skillsContentIn 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .skills-content .skill-cell {
          animation: skillCellIn 100ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: calc(var(--cell-index) * 100ms);
        }
        @keyframes skillsContentIn {
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes skillCellIn {
          to { opacity: 1; transform: scaleX(1); }
        }

        .contact-world-panel {
          position: absolute;
          overflow: visible;
          color: rgba(250, 252, 252, 0.98);
          font-family: inherit;
          pointer-events: auto;
        }
        .contact-black-fill {
          position: absolute;
          inset: 1px;
          z-index: 0;
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
            rgba(0, 0, 0, 0.9);
          opacity: 0;
          transition: opacity ${CONTACT_FILL_DURATION}ms ease;
        }
        .contact-fill .contact-black-fill,
        .contact-content .contact-black-fill { opacity: 0.8; }
        .contact-line-layer {
          position: absolute;
          inset: 0;
          z-index: 2;
          width: 100%;
          height: 100%;
          overflow: visible;
          fill: none;
          pointer-events: none;
        }
        .contact-draw-line {
          stroke: rgba(242, 249, 249, 0.94);
          stroke-width: 1.3;
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          stroke-linecap: square;
          shape-rendering: geometricPrecision;
        }
        .contact-drawing .contact-frame-line,
        .contact-fill .contact-frame-line,
        .contact-content .contact-frame-line {
          animation: contactDraw 1350ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .contact-drawing .contact-title-line,
        .contact-fill .contact-title-line,
        .contact-content .contact-title-line {
          animation: contactDraw 560ms 220ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .contact-drawing .contact-info-line,
        .contact-fill .contact-info-line,
        .contact-content .contact-info-line {
          animation: contactDraw 900ms 300ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .contact-drawing .contact-download-line,
        .contact-fill .contact-download-line,
        .contact-content .contact-download-line {
          animation: contactDraw 960ms 420ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes contactDraw {
          from { stroke-dashoffset: 1; }
          to { stroke-dashoffset: 0; }
        }
        .contact-content-layer {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
        }
        .contact-title {
          position: absolute;
          left: ${GRID_SIZE * 1.15}px;
          top: ${GRID_SIZE * 0.75}px;
          margin: 0;
          font-size: 55px;
          line-height: 1;
          font-weight: 700;
          letter-spacing: -0.04em;
        }
        .contact-reveal {
          opacity: 0;
          transform: translateY(10px);
          filter: blur(4px);
        }
        .contact-content .contact-reveal {
          animation: contactContentIn 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes contactContentIn {
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .contact-info {
          position: absolute;
          left: ${GRID_SIZE * 1.85}px;
          top: ${GRID_SIZE * 4.15}px;
          width: ${GRID_SIZE * 13.7}px;
          display: flex;
          flex-direction: column;
          gap: ${GRID_SIZE * 0.72}px;
        }
        .contact-info div {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .contact-info span {
          font-size: 18px;
          line-height: 1;
          font-weight: 500;
          color: rgba(250, 252, 252, 0.65);
        }
        .contact-info strong {
          font-size: 27px;
          line-height: 1;
          font-weight: 550;
          letter-spacing: -0.025em;
        }
        .contact-socials {
          position: absolute;
          right: ${GRID_SIZE * 1.2}px;
          top: ${GRID_SIZE * 1.05}px;
          width: ${GRID_SIZE * 7.1}px;
          display: flex;
          flex-direction: column;
          gap: ${GRID_SIZE * 0.26}px;
          pointer-events: auto;
        }
        .contact-social {
          min-height: ${GRID_SIZE * 1.25}px;
          display: grid;
          grid-template-columns: ${GRID_SIZE * 1.12}px 1fr 28px;
          align-items: center;
          gap: 10px;
          color: rgba(250, 252, 252, 0.98);
          text-decoration: none;
          font-size: 24px;
          line-height: 1;
          font-weight: 600;
          letter-spacing: -0.025em;
          cursor: pointer;
          transition: opacity 160ms ease, transform 160ms ease;
        }
        .contact-social:hover {
          opacity: 0.72;
          transform: translateX(5px);
        }
        .contact-icon-box {
          width: ${GRID_SIZE * 1.05}px;
          height: ${GRID_SIZE * 1.05}px;
          border: 1px solid rgba(242, 249, 249, 0.82);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .contact-icon-box img {
          width: 60%;
          height: 60%;
          object-fit: contain;
        }
        .contact-arrow {
          font-size: 31px;
          line-height: 1;
          font-weight: 300;
          text-align: right;
        }
        .contact-download {
          position: absolute;
          left: ${GRID_SIZE * 1.75}px;
          top: ${GRID_SIZE * 9.92}px;
          width: ${GRID_SIZE * 26.5}px;
          height: ${GRID_SIZE * 3.2}px;
          display: grid;
          grid-template-columns: ${GRID_SIZE * 3}px 1fr 54px;
          align-items: center;
          gap: ${GRID_SIZE * 0.8}px;
          color: rgba(250, 252, 252, 0.98);
          text-decoration: none;
          pointer-events: auto;
          cursor: pointer;
          box-shadow: inset 0 0 0 0 rgba(242, 249, 249, 0);
          background: rgba(255, 255, 255, 0);
          transition:
            transform 220ms cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 220ms ease,
            background 220ms ease;
          transform-origin: center;
        }

        .contact-pdf-box {
          width: ${GRID_SIZE * 2.7}px;
          height: ${GRID_SIZE * 2.7}px;
          border: 1px solid rgba(242, 249, 249, 0.82);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .contact-pdf-box img {
          width: 58%;
          height: 58%;
          object-fit: contain;
        }
        .contact-download strong {
          position: relative;
          width: max-content;
          font-size: 44px;
          line-height: 1;
          font-weight: 700;
          letter-spacing: -0.04em;
        }
        .contact-download strong::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -8px;
          width: 100%;
          height: 1px;
          background: rgba(250, 252, 252, 0.96);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .contact-download:hover strong::after {
          transform: scaleX(1);
        }
        .contact-download-arrow {
          width: 54px;
          height: 54px;
          transform: translateX(-20px);
          display: flex;
          align-items: center;
          justify-content: center;
          justify-self: end;
          overflow: hidden;
          transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .contact-download-arrow img {
          width: 72%;
          height: 72%;
          object-fit: contain;
        }
        .contact-download:hover .contact-download-arrow {
          transform: translateX(-20) translateY(3px);
        }

        .profile-ui {
          position: absolute;
          z-index: 60;
          top: 36px;
          left: 190px;
          width: 760px;
          font-family: inherit;
          cursor: default;
          transform: translateX(0);
          opacity: 1;
          transition:
            transform 620ms cubic-bezier(0.16, 1, 0.3, 1),
            opacity 260ms ease;
        }

        .profile-orb-layer {
  transform: translateX(0);
  opacity: 1;
  z-index: 50;
  mix-blend-mode: screen;
  transition:
    transform 620ms cubic-bezier(0.16, 1, 0.3, 1),
    opacity 260ms ease;
}
}
        .profile-orb-layer.collapsed {
          transform: translateX(-1100px);
          opacity: 0;
        }

       .profile-orb-video {
  position: absolute;
  left: 10px;
  top: -5px;
  width: 200px;
  height: 200px;
  object-fit: contain;
}
        .profile-ui.collapsed {
          transform: translateX(-1100px);
          opacity: 0;
          pointer-events: none;
        }
        .profile-bar {
          position: relative;
          width: 100%;
          height: 122px;
        }
        .profile-bar-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: fill;
          user-select: none;
          pointer-events: none;
        }
        .profile-text {
          position: absolute;
          z-index: 5;
          left: 65px;
          top: 50%;
          transform: translateY(-50%);
          line-height: 0.8;
        }
        .profile-name {
          font-size: 50px;
          font-weight: 700;
          letter-spacing: -0.035em;
          white-space: nowrap;
        }
        .profile-role {
          margin-top: 11px;
          font-size: 28px;
          font-weight: 500;
          letter-spacing: -0.025em;
          white-space: nowrap;
        }
        .profile-toggle {
          position: absolute;
          z-index: 10;
          right: 25px;
          top: 24px;
          width: 74px;
          height: 74px;
          border: 1px solid rgba(245, 250, 250, 0.94);
          border-radius: 21px;
          background:
            radial-gradient(
              circle at 45% 28%,
              rgba(255, 255, 255, 0.07),
              transparent 55%
            ),
            rgba(3, 4, 4, 0.93);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow:
            0 0 2px rgba(255, 255, 255, 0.9),
            -4px 0 12px rgba(80, 225, 235, 0.08),
            4px 0 12px rgba(235, 75, 70, 0.07);
          transition:
            transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1),
            background 180ms ease;
        }
        .profile-toggle:hover {
          transform: scale(1.045);
          background:
            radial-gradient(
              circle at 45% 28%,
              rgba(255, 255, 255, 0.11),
              transparent 55%
            ),
            rgba(7, 8, 8, 0.97);
        }
        .profile-toggle:active {
          transform: scale(0.96);
        }
        .profile-chevron {
          width: 20px;
          height: 20px;
          border-right: 2px solid rgba(250, 255, 255, 0.95);
          border-bottom: 2px solid rgba(250, 255, 255, 0.95);
          transform: translateY(-5px) rotate(45deg);
          filter:
            drop-shadow(-2px 0 4px rgba(80, 225, 235, 0.18))
            drop-shadow(2px 0 4px rgba(235, 75, 70, 0.15));
          transition:
            transform 420ms cubic-bezier(0.34, 1.35, 0.64, 1);
        }
        .profile-toggle.open .profile-chevron {
          transform: translateY(5px) rotate(225deg);
        }
        .profile-dropdown {
          position: absolute;
          right: 25px;
          top: 97px;
          width: 250px;
          transform-origin: top right;
          opacity: 0;
          visibility: hidden;
          transform: translate(18px, -16px) scale(0.78, 0.5);
          transition:
            opacity 170ms ease,
            visibility 0s linear 330ms,
            transform 330ms cubic-bezier(0.55, -0.05, 0.75, 0.3);
        }
        .profile-dropdown.open {
          opacity: 1;
          visibility: visible;
          transform: translate(0, 0) scale(1);
          transition:
            opacity 170ms ease,
            visibility 0s linear 0s,
            transform 460ms cubic-bezier(0.18, 1.18, 0.3, 1);
        }
        .profile-dropdown-inner {
          position: relative;
          padding: 14px 22px;
          overflow: hidden;
          border: 1px solid rgba(240, 250, 250, 0.86);
          border-radius: 22px;
          background:
            radial-gradient(
              circle at 75% 78%,
              rgba(255, 255, 255, 0.065),
              rgba(255, 255, 255, 0.018) 33%,
              transparent 65%
            ),
            linear-gradient(
              135deg,
              rgba(2, 3, 3, 0.98),
              rgba(10, 11, 11, 0.96)
            );
          box-shadow:
            0 0 2px rgba(255, 255, 255, 0.8),
            -6px 0 20px rgba(80, 225, 235, 0.075),
            6px 0 20px rgba(235, 75, 70, 0.065),
            0 12px 40px rgba(0, 0, 0, 0.55);
        }
        .profile-dropdown-inner::after {
          content: "";
          position: absolute;
          right: -22px;
          bottom: -22px;
          width: 75px;
          height: 75px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(245, 255, 255, 0.08),
            rgba(80, 225, 235, 0.025) 38%,
            rgba(235, 75, 70, 0.018) 60%,
            transparent 72%
          );
          pointer-events: none;
        }
        .profile-link {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 49px;
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 0 10px;
          border: 0;
          background: transparent;
          color: rgba(250, 252, 252, 0.96);
          font: inherit;
          font-size: 23px;
          font-weight: 500;
          letter-spacing: -0.02em;
          text-align: left;
          cursor: pointer;
          transition:
            transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1),
            color 180ms ease;
        }
        .profile-link:hover {
          transform: translateX(6px);
          color: #fff;
        }
        .profile-link-dot {
          position: relative;
          flex: 0 0 auto;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(248, 255, 255, 1);
          box-shadow:
            -2px 0 6px rgba(80, 225, 235, 0.45),
            2px 0 6px rgba(235, 75, 70, 0.32),
            0 0 8px rgba(255, 255, 255, 0.22);
        }
        .profile-link-dot::before,
        .profile-link-dot::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          background: rgba(230, 255, 255, 0.34);
          transform: translate(-50%, -50%);
        }
        .profile-link-dot::before {
          width: 13px;
          height: 1px;
        }
        .profile-link-dot::after {
          width: 1px;
          height: 13px;
        }
        .profile-collapse-toggle {
          position: absolute;
          z-index: 29;
          left: 980px;
          top: 72px;
          width: 54px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(245, 250, 250, 0.94);
          border-radius: 14px;
          background:
            radial-gradient(
              circle at 45% 28%,
              rgba(255, 255, 255, 0.07),
              transparent 55%
            ),
            rgba(3, 4, 4, 0.93);
          cursor: pointer;
          opacity: 1;
          transform: translateX(0) scale(1);
          box-shadow:
            0 0 2px rgba(255, 255, 255, 0.9),
            -4px 0 12px rgba(80, 225, 235, 0.08),
            4px 0 12px rgba(235, 75, 70, 0.07);
          transition:
            left 620ms cubic-bezier(0.16, 1, 0.3, 1),
            transform 420ms cubic-bezier(0.16, 1.15, 0.3, 1),
            opacity 220ms ease,
            background 180ms ease;
        }
        .profile-collapse-toggle:hover {
          transform: translateX(0) scale(1.045);
          background:
            radial-gradient(
              circle at 45% 28%,
              rgba(255, 255, 255, 0.11),
              transparent 55%
            ),
            rgba(7, 8, 8, 0.97);
        }
        .profile-collapse-toggle:active {
          transform: translateX(0) scale(0.96);
        }
        .profile-collapse-toggle.menu-open {
          transform: translateX(-90px) scale(0.82);
          opacity: 0;
          pointer-events: none;
        }
        .profile-collapse-toggle.collapsed {
          left: 22px;
          opacity: 1;
          transform: translateX(0) scale(1);
        }
        .profile-collapse-toggle.collapsed:hover {
          transform: translateX(0) scale(1.045);
        }
        .profile-collapse-chevron {
          width: 15px;
          height: 15px;
          border-left: 2px solid rgba(250, 255, 255, 0.95);
          border-bottom: 2px solid rgba(250, 255, 255, 0.95);
          transform: translateX(3px) rotate(45deg);
          filter:
            drop-shadow(-2px 0 4px rgba(80, 225, 235, 0.18))
            drop-shadow(2px 0 4px rgba(235, 75, 70, 0.15));
          transition:
            transform 480ms cubic-bezier(0.34, 1.35, 0.64, 1);
        }
        .profile-collapse-toggle.collapsed
          .profile-collapse-chevron {
          transform: translateX(-3px) rotate(225deg);
        }
        .view-controls {
          position: absolute;
          z-index: 40;
          right: 42px;
          bottom: 42px;
          width: 430px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          font-family: inherit;
          cursor: default;
          transform: scale(0.5);
transform-origin: bottom right;
        }
        .reset-view-button {
          width: 230px;
          height: 92px;
          border: 1px solid rgba(245, 250, 250, 0.94);
          border-radius: 28px;
          background:
            radial-gradient(
              circle at 28% 12%,
              rgba(255, 255, 255, 0.07),
              transparent 58%
            ),
            linear-gradient(
              135deg,
              rgba(9, 10, 10, 0.97),
              rgba(1, 2, 2, 0.98)
            );
          color: rgba(250, 252, 252, 0.98);
          font: inherit;
          font-size: 43px;
          font-weight: 600;
          letter-spacing: -0.03em;
          cursor: pointer;
          box-shadow:
            0 0 2px rgba(255, 255, 255, 0.8),
            -5px 0 18px rgba(80, 225, 235, 0.07),
            5px 0 18px rgba(235, 75, 70, 0.06),
            0 12px 36px rgba(0, 0, 0, 0.42);
          transition:
            transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1),
            background 180ms ease;
        }

        .archive-card {
  position: absolute;
  pointer-events: auto;
  overflow: hidden;

  padding: 0;
  margin: 0;

  border: 1px solid rgba(245, 250, 245, 0.92);
  background: rgba(3, 8, 4, 0.96);

  color: #a8e9a1;

  cursor: pointer;
  text-align: left;

  transform-origin: center;
  transition:
    border-color 160ms ease,
    background 160ms ease,
    box-shadow 160ms ease;
}

.archive-card::after {
  content: "";
  position: absolute;
  inset: 0;

  background:
    linear-gradient(
      90deg,
      rgba(105, 210, 105, 0.025),
      rgba(0, 255, 0, 0.1),
      rgba(121, 105, 210, 0.03)
    );

  opacity: 1;
  transition: opacity 180ms ease;
  pointer-events: none;
}

.archive-scanlines {
  position: absolute;
  inset: 0;

  background:
    repeating-linear-gradient(
      to bottom,
      rgba(120, 220, 120, 0.12) 0px,
      rgba(120, 220, 120, 0.12) 1px,
      transparent 1px,
      transparent 5px
    );

  opacity: 0.72;
  pointer-events: none;
}

.archive-content {
  position: absolute;
  left: ${GRID_SIZE * 0.7}px;
  top: 60%;

  display: flex;
  flex-direction: column;
  justify-content: center;

  transform: translateY(-50%);

  z-index: 2;

  font-family: "Glixels", monospace;

  text-shadow:
    0 0 5px rgba(125, 235, 120, 0.18);
}

.archive-title {
  font-size: 75px;
  line-height: 0.2;
  font-weight: 400;
  letter-spacing: -0.035em;

  color: rgb(169, 233, 161);
}

.archive-subtitle {
  margin-top: 15px;
  font-size: 50px;
  line-height: 1;
  font-weight: 400;
  letter-spacing: -0.025em;

  color: rgb(169, 233, 161);
}

.archive-arrow {
  position: absolute;
  right: ${GRID_SIZE * 1.1}px;
  top: 50%;

  width: 43px;
  height: 43px;

  transform: translateY(-50%);

  z-index: 3;

  transition:
    transform 180ms cubic-bezier(0.16, 1, 0.3, 1),
    filter 180ms ease;
}

.archive-arrow-line {
  position: absolute;
  right: 0;
  top: 0;

  width: 40px;
  height: 40px;

  border-top: 2px solid rgba(245, 250, 245, 0.95);
  border-right: 2px solid rgba(245, 250, 245, 0.95);
}

.archive-arrow-line::after {
  content: "";
  position: absolute;

  width: 52px;
  height: 2px;

  right: -6px;
  top: 18px;

  background: rgba(245, 250, 245, 0.95);

  transform: rotate(-45deg);
  transform-origin: center;
}

.archive-card:hover {
  border-color: rgba(190, 255, 185, 1);

  background: rgba(5, 14, 7, 0.98);

  box-shadow:
    inset 0 0 30px rgba(105, 220, 105, 0.06),
    0 0 16px rgba(105, 220, 105, 0.08);
}

.archive-card:hover::after {
  opacity: 1;
}

.archive-card:hover .archive-arrow,
.archive-placeholder-card:hover .archive-arrow {
  transform: translate(6px, calc(-50% - 6px));
  filter: drop-shadow(0 0 4px rgba(160, 255, 155, 0.25));
}

.archive-card:active {
  background: rgba(10, 24, 12, 0.98);
}
  
        .reset-view-button:hover {
          transform: scale(1.035);
          background:
            radial-gradient(
              circle at 28% 12%,
              rgba(255, 255, 255, 0.11),
              transparent 58%
            ),
            linear-gradient(
              135deg,
              rgba(13, 14, 14, 0.98),
              rgba(3, 4, 4, 0.98)
            );
        }
        .reset-view-button:active {
          transform: scale(0.97);
        }
        .zoom-controls {
          width: 100%;
          display: grid;
          grid-template-columns: 82px 1fr 82px;
          align-items: center;
          gap: 20px;
        }
        .zoom-button {
          position: relative;
          width: 82px;
          height: 82px;
          border: 1px solid rgba(245, 250, 250, 0.94);
          border-radius: 24px;
          background:
            radial-gradient(
              circle at 35% 25%,
              rgba(255, 255, 255, 0.07),
              transparent 58%
            ),
            rgba(3, 4, 4, 0.95);
          cursor: pointer;
          box-shadow:
            0 0 2px rgba(255, 255, 255, 0.8),
            -4px 0 14px rgba(80, 225, 235, 0.06),
            4px 0 14px rgba(235, 75, 70, 0.05);
          transition:
            transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1),
            background 180ms ease,
            opacity 180ms ease;
        }
        .zoom-button:hover:not(:disabled) {
          transform: scale(1.045);
          background:
            radial-gradient(
              circle at 35% 25%,
              rgba(255, 255, 255, 0.11),
              transparent 58%
            ),
            rgba(7, 8, 8, 0.98);
        }
        .zoom-button:active:not(:disabled) {
          transform: scale(0.96);
        }
        .zoom-button:disabled {
          opacity: 0.28;
          cursor: default;
        }
        .zoom-percentage {
          height: 112px;
          border: 1px solid rgba(245, 250, 250, 0.94);
          border-radius: 28px;
          background:
            radial-gradient(
              circle at 70% 90%,
              rgba(255, 255, 255, 0.055),
              transparent 55%
            ),
            linear-gradient(
              145deg,
              rgba(5, 6, 6, 0.98),
              rgba(1, 2, 2, 0.98)
            );
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(250, 252, 252, 0.98);
          font-size: 44px;
          font-weight: 600;
          letter-spacing: -0.04em;
          user-select: none;
          box-shadow:
            0 0 2px rgba(255, 255, 255, 0.8),
            -5px 0 18px rgba(80, 225, 235, 0.06),
            5px 0 18px rgba(235, 75, 70, 0.055),
            0 12px 36px rgba(0, 0, 0, 0.42);
        }
        .minus-icon,
        .plus-icon {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 30px;
          height: 2px;
          transform: translate(-50%, -50%);
          background: rgba(250, 255, 255, 0.95);
          box-shadow:
            -2px 0 5px rgba(80, 225, 235, 0.16),
            2px 0 5px rgba(235, 75, 70, 0.12);
        }
        .plus-icon::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          width: 2px;
          height: 30px;
          transform: translate(-50%, -50%);
          background: rgba(250, 255, 255, 0.95);
        }
          .featured-project {
  position: absolute;
  pointer-events: auto;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  overflow: visible;
  border: 1px solid rgba(255, 255, 255, 0.82);
  background: transparent;
  color: #fff;
  cursor: pointer;
  text-align: left;
  transition:
    border-width 0ms cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0ms ease;
}

.featured-preview {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.03);
  pointer-events: none;
}

.featured-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.featured-label {
  position: absolute;
  left: 24px;
  top: -42px;
  z-index: 5;
  padding: 0;
  background: transparent;
  font-size: 26px;
  line-height: 1;
  font-weight: 700;
  letter-spacing: -0.035em;
  white-space: nowrap;
  pointer-events: none;
}

.featured-label-underline {
  position: absolute;
  left: 0;
  bottom: -10px;
  width: 150%;
  height: 2px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 1),
    rgba(255, 255, 255, 0)
  );
  transform: scaleX(0);
  transform-origin: left center;
  opacity: 0;
  transition:
    transform 310ms cubic-bezier(0.16, 1, 0.3, 1) 70ms,
    opacity 120ms ease 70ms;
  pointer-events: none;
}

.featured-info {
  position: absolute;
  left: -1px;
  right: -1px;
  bottom: -1px;
  z-index: 4;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border: 1px solid rgba(255, 255, 255, 0.82);
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
  pointer-events: none;
}

.featured-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.featured-copy h2 {
  margin: 0;
  color: #fff;
  font-size: 42px;
  line-height: 0.95;
  font-weight: 700;
  letter-spacing: -0.045em;
  white-space: nowrap;
}

.featured-copy p {
  margin: 0;
  color: rgba(255, 255, 255, 0.96);
  font-size: 23px;
  line-height: 1;
  font-weight: 650;
  letter-spacing: -0.025em;
  white-space: nowrap;
}

.featured-arrow {
  position: relative;
  flex: 0 0 auto;
  width: 64px;
  height: 64px;
  margin-left: 24px;
  transition:
    transform 300ms cubic-bezier(0.16, 1, 0.3, 1) 110ms;
  pointer-events: none;
}

.featured-arrow::before {
  content: "";
  position: absolute;
  right: 4px;
  top: 4px;
  width: 44px;
  height: 44px;
  border-top: 1px solid rgba(255, 255, 255, 0.95);
  border-right: 1px solid rgba(255, 255, 255, 0.95);
}

.featured-arrow-line {
  position: absolute;
  right: 4px;
  top: 4px;
  width: 62px;
  height: 1px;
  background: rgba(255, 255, 255, 0.95);
  transform-origin: right center;
  transform: rotate(-45deg);
}

.featured-corner {
  position: absolute;
  z-index: 6;
  width: 36px;
  height: 36px;
  opacity: 0;
  pointer-events: none;
  transition:
    transform 330ms cubic-bezier(0.16, 1, 0.3, 1) 35ms,
    opacity 120ms ease 35ms;
}

.featured-corner-tl {
  left: 0;
  top: 0;
  border-left: 1px solid rgba(255, 255, 255, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.95);
  transform: translate(0, 0);
}

.featured-corner-tr {
  right: 0;
  top: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.95);
  transform: translate(0, 0);
}

.featured-corner-bl {
  left: 0;
  bottom: 0;
  border-left: 1px solid rgba(255, 255, 255, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.95);
  transform: translate(0, 0);
}

.featured-corner-br {
  right: 0;
  bottom: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.95);
  transform: translate(0, 0);
}

.featured-project:hover {
  border-width: 2px;
  border-color: rgba(255, 255, 255, 1);
}

.featured-project:hover .featured-corner-tl {
  border-left-width: 2px;
  border-top-width: 2px;
}

.featured-project:hover .featured-corner-tr {
  border-right-width: 2px;
  border-top-width: 2px;
}

.featured-project:hover .featured-corner-bl {
  border-left-width: 2px;
  border-bottom-width: 2px;
}

.featured-project:hover .featured-corner-br {
  border-right-width: 2px;
  border-bottom-width: 2px;
}

.featured-project:hover .featured-info {
  border-width: 2px;
  border-color: rgba(255, 255, 255, 1);
}

.featured-project:hover .featured-label-underline {
  transform: scaleX(1);
  opacity: 1;
}

.featured-project:hover .featured-arrow {
  transform: translate(5px, -5px);
}

.featured-project:hover .featured-corner {
  opacity: 1;
}

.featured-project:hover .featured-corner-tl {
  transform: translate(-36px, -36px);
}

.featured-project:hover .featured-corner-tr {
  transform: translate(36px, -36px);
}

.featured-project:hover .featured-corner-bl {
  transform: translate(-36px, 36px);
}

.featured-project:hover .featured-corner-br {
  transform: translate(36px, 36px);
}

.featured-project:focus-visible {
  outline: none;
  border-width: 2px;
  border-color: rgba(255, 255, 255, 1);
}

.featured-project:focus-visible .featured-info {
  border-width: 2px;
  border-color: rgba(255, 255, 255, 1);
}

.featured-project:focus-visible .featured-label-underline {
  transform: scaleX(1);
  opacity: 1;
}

.featured-project:focus-visible .featured-arrow {
  transform: translate(5px, -5px);
}

.featured-project:focus-visible .featured-corner {
  opacity: 1;
}

.featured-project:focus-visible .featured-corner-tl {
  transform: translate(-36px, -36px);
}

.featured-project:focus-visible .featured-corner-tr {
  transform: translate(36px, -36px);
}

.featured-project:focus-visible .featured-corner-bl {
  transform: translate(-36px, 36px);
}

.featured-project:focus-visible .featured-corner-br {
  transform: translate(36px, 36px);
}
      `}</style>
      <style jsx global>{`
        html,
        body {
          margin: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        body {
          overscroll-behavior: none;
        }
      `}</style>
    </>
  );
}