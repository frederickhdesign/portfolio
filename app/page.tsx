"use client";

import {
  Canvas,
  useFrame,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import ABOUTPAGE from "@/components/ABOUTPAGE";
import PORTFOLIOPAGE from "@/components/PORTFOLIOPAGE";
import BLOGPAGE from "@/components/BLOGPAGE";
import CONTACTPAGE from "@/components/CONTACTPAGE";
import NOTEBOOKPAGE from "@/components/NOTEBOOKPAGE";

if (typeof window !== "undefined") {
  const originalWarn = console.warn;

  console.warn = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes(
        "THREE.WebGLShadowMap: PCFSoftShadowMap has been deprecated"
      )
    ) {
      return;
    }

    originalWarn(...args);
  };
}

type HoverLightData = {
  position: THREE.Vector3;
  target: THREE.Vector3;
} | null;

type ScreenName =
  | "SCREEN-ABOUT"
  | "SCREEN-BLOG"
  | "SCREEN-PORTFOLIO"
  | "SCREEN-CONTACT";

type ActiveView =
  | { type: "screen"; name: ScreenName }
  | { type: "notebook" }
  | { type: "cv" }
  | null;

type ScreenPoint = {
  x: number;
  y: number;
} | null;

type TVsProps = {
  onHoverLightChange: (data: HoverLightData) => void;
  onHoveredScreenChange: (screenName: string | null) => void;
  onScreenHoverStart: () => void;
  onScreenClick: (screenName: ScreenName) => void;
  onNotebookHoverChange: (hovered: boolean) => void;
  onNotebookClick: () => void;
  onPrinterPaperHoverChange: (hovered: boolean) => void;
  onPrinterPaperClick: () => void;
  onBulbWorldPositionChange: (position: THREE.Vector3 | null) => void;
  interactionsEnabled: boolean;
  revealStrength: number;
};

type IntroOverlayProps = {
  introPhase: "title" | "message" | "enter" | "revealing" | "done";
  overlayOpacity: number;
  logoSrc?: string;
  onEnter: () => void;
};

const NOTEBOOK_MESH_NAMES = [
  "BOTTOMCOVER",
  "LOCKRING",
  "PAPERSTACK",
  "TOPCOVER",
] as const;

const BULB_MESH_NAME = "BULB";
const PRINTER_PAPER_MESH_NAME = "PRINTERPAPER";
const TITLE_WORLD_OFFSET_Y = 0.45;

function isNotebookMeshName(name: string) {
  return NOTEBOOK_MESH_NAMES.includes(
    name as (typeof NOTEBOOK_MESH_NAMES)[number]
  );
}

function useOccasionalFlicker(baseIntensity: number, enabled = true) {
  const currentIntensity = useRef(baseIntensity);
  const nextFlickerAt = useRef(0);
  const flickerEndAt = useRef(0);

  useFrame((state) => {
    if (!enabled) {
      currentIntensity.current = baseIntensity;
      return;
    }

    const t = state.clock.getElapsedTime();

    if (nextFlickerAt.current === 0) {
      nextFlickerAt.current = t + 5 + Math.random() * 5;
    }

    if (t >= nextFlickerAt.current && t >= flickerEndAt.current) {
      flickerEndAt.current = t + (0.08 + Math.random() * 0.2);
      nextFlickerAt.current = t + 5 + Math.random() * 5;
    }

    if (t < flickerEndAt.current) {
      const chanceOfDipOut = 0.12;
      if (Math.random() < chanceOfDipOut) {
        currentIntensity.current = baseIntensity * 0.15;
      } else {
        currentIntensity.current = baseIntensity * (0.3 + Math.random() * 0.9);
      }
    } else {
      currentIntensity.current = baseIntensity;
    }
  });

  return currentIntensity;
}

function SceneExposure() {
  const { gl } = useThree();

  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.35;
  }, [gl]);

  return null;
}

function BulbEmitter({
  model,
  onBulbWorldPositionChange,
  revealStrength,
}: {
  model: THREE.Object3D;
  onBulbWorldPositionChange: (position: THREE.Vector3 | null) => void;
  revealStrength: number;
}) {
  const bulbLightRef = useRef<THREE.PointLight>(null);
  const bulbMeshRef = useRef<THREE.Mesh | null>(null);
  const bulbGlow = useOccasionalFlicker(2.05, revealStrength > 0.95);
  const bulbLight = useOccasionalFlicker(1.25, revealStrength > 0.95);

  const tempWorldPos = useRef(new THREE.Vector3());

  useEffect(() => {
    const bulb = model.getObjectByName(BULB_MESH_NAME) as THREE.Mesh | null;
    bulbMeshRef.current = bulb;

    if (!bulb?.isMesh) {
      onBulbWorldPositionChange(null);
      return;
    }

    const materials = Array.isArray(bulb.material)
      ? bulb.material
      : [bulb.material];

    materials.forEach((mat) => {
      const material = mat as THREE.MeshStandardMaterial;
      material.emissive.set("#fff4dc");
      material.emissiveIntensity = 0;
      material.toneMapped = false;
      material.needsUpdate = true;
    });

    return () => {
      onBulbWorldPositionChange(null);
    };
  }, [model, onBulbWorldPositionChange]);

  useFrame(() => {
    const bulb = bulbMeshRef.current;
    const light = bulbLightRef.current;
    if (!bulb || !light) return;

    bulb.getWorldPosition(tempWorldPos.current);
    light.position.copy(tempWorldPos.current);
    light.intensity = bulbLight.current * revealStrength;

    onBulbWorldPositionChange(
      revealStrength > 0.02 ? tempWorldPos.current.clone() : null
    );

    const materials = Array.isArray(bulb.material)
      ? bulb.material
      : [bulb.material];

    materials.forEach((mat) => {
      const material = mat as THREE.MeshStandardMaterial;
      material.emissiveIntensity = bulbGlow.current * revealStrength;
    });
  });

  return (
    <pointLight
      ref={bulbLightRef}
      color="#ffedc2"
      intensity={0}
      distance={14}
      decay={1.6}
      castShadow
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
      shadow-bias={-0.0001}
    />
  );
}

function TVs({
  onHoverLightChange,
  onHoveredScreenChange,
  onScreenHoverStart,
  onScreenClick,
  onNotebookHoverChange,
  onNotebookClick,
  onPrinterPaperHoverChange,
  onPrinterPaperClick,
  onBulbWorldPositionChange,
  interactionsEnabled,
  revealStrength,
}: TVsProps) {
  const { scene } = useGLTF("/models/tvs.glb");
  const model = useMemo(() => scene.clone(), [scene]);

  const [hoveredScreenName, setHoveredScreenName] = useState<string | null>(
    null
  );
  const [hoveredNotebook, setHoveredNotebook] = useState(false);

  useEffect(() => {
    const screenOffColor = new THREE.Color("#000000");
    const notebookOffColor = new THREE.Color("#1b1b1b");

    model.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map((mat) => mat.clone());
      } else if (mesh.material) {
        mesh.material = mesh.material.clone();
      }

      const materials = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];

      materials.forEach((mat) => {
        const material = mat as THREE.MeshStandardMaterial;
        material.aoMap = null;
        material.lightMap = null;
        material.needsUpdate = true;
      });

      if (mesh.name.startsWith("SCREEN-")) {
        const material = mesh.material as THREE.MeshStandardMaterial;
        material.color.copy(screenOffColor);
        material.emissive.set("#000000");
        material.emissiveIntensity = 0;
      }

      if (isNotebookMeshName(mesh.name)) {
        const material = mesh.material as THREE.MeshStandardMaterial;
        material.color.copy(notebookOffColor);
        material.emissive.set("#000000");
        material.emissiveIntensity = 0;
      }

      if (mesh.name === BULB_MESH_NAME) {
        const material = mesh.material as THREE.MeshStandardMaterial;
        material.emissive.set("#fff4dc");
        material.emissiveIntensity = 0;
        material.toneMapped = false;
      }
    });
  }, [model]);

  useEffect(() => {
    const offColor = new THREE.Color("#1b1b1b");
    const onColor = new THREE.Color("#ededed");

    onHoveredScreenChange(interactionsEnabled ? hoveredScreenName : null);

    model.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      if (!mesh.name.startsWith("SCREEN-")) return;

      const material = mesh.material as THREE.MeshStandardMaterial;

      if (interactionsEnabled && mesh.name === hoveredScreenName) {
        material.color.copy(onColor);
        material.emissive.set("#f2f2f2");
        material.emissiveIntensity = 0.65;
        material.toneMapped = false;
      } else {
        material.color.copy(offColor);
        material.emissive.set("#000000");
        material.emissiveIntensity = 0;
      }
    });

    if (!interactionsEnabled || !hoveredScreenName) {
      onHoverLightChange(null);
      return;
    }

    const hovered = model.getObjectByName(hoveredScreenName) as THREE.Mesh | null;
    if (!hovered || !hovered.isMesh) {
      onHoverLightChange(null);
      return;
    }

    const screenPos = new THREE.Vector3();
    hovered.getWorldPosition(screenPos);

    const screenQuat = new THREE.Quaternion();
    hovered.getWorldQuaternion(screenQuat);

    const forward = new THREE.Vector3(0, 0, 1)
      .applyQuaternion(screenQuat)
      .normalize();

    const lightPos = screenPos
      .clone()
      .add(forward.clone().multiplyScalar(-1.2))
      .add(new THREE.Vector3(0, 1.2, 0));

    const targetPos = screenPos
      .clone()
      .add(forward.clone().multiplyScalar(1.2))
      .add(new THREE.Vector3(0, -0.9, 0));

    onHoverLightChange({
      position: lightPos,
      target: targetPos,
    });
  }, [
    hoveredScreenName,
    interactionsEnabled,
    model,
    onHoverLightChange,
    onHoveredScreenChange,
  ]);

  useEffect(() => {
    const notebookOffColor = new THREE.Color("#1b1b1b");
    const notebookOnColor = new THREE.Color("#3a3a3a");

    model.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      if (!isNotebookMeshName(mesh.name)) return;

      const material = mesh.material as THREE.MeshStandardMaterial;

      if (interactionsEnabled && hoveredNotebook) {
        material.color.copy(notebookOnColor);
        material.emissive.set("#555555");
        material.emissiveIntensity = 0.2;
      } else {
        material.color.copy(notebookOffColor);
        material.emissive.set("#000000");
        material.emissiveIntensity = 0;
      }
    });
  }, [hoveredNotebook, interactionsEnabled, model]);

  useEffect(() => {
    model.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;

      const materials = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];

      materials.forEach((mat) => {
        const material = mat as THREE.MeshStandardMaterial;

        if (!mesh.name.startsWith("SCREEN-") && !isNotebookMeshName(mesh.name)) {
          material.opacity = THREE.MathUtils.lerp(0.25, 1, revealStrength);
          material.transparent = material.opacity < 0.999;
          material.needsUpdate = true;
        }
      });
    });
  }, [model, revealStrength]);

  return (
    <group>
      <primitive
        object={model}
        onPointerMove={(e: ThreeEvent<PointerEvent>) => {
          if (!interactionsEnabled) return;

          e.stopPropagation();

          const hit = e.object as THREE.Mesh;
          const hitName = hit.name ?? "";

          if (hitName.startsWith("SCREEN-")) {
            setHoveredNotebook(false);
            onNotebookHoverChange(false);
            onPrinterPaperHoverChange(false);

            setHoveredScreenName((prev) => {
              if (prev !== hitName) {
                onScreenHoverStart();
              }
              return hitName;
            });

            return;
          }

          if (isNotebookMeshName(hitName)) {
            setHoveredScreenName(null);
            setHoveredNotebook(true);
            onNotebookHoverChange(true);
            onPrinterPaperHoverChange(false);
            return;
          }

          if (hitName === PRINTER_PAPER_MESH_NAME) {
            setHoveredScreenName(null);
            setHoveredNotebook(false);
            onNotebookHoverChange(false);
            onPrinterPaperHoverChange(true);
            return;
          }

          setHoveredScreenName(null);
          setHoveredNotebook(false);
          onNotebookHoverChange(false);
          onPrinterPaperHoverChange(false);
        }}
        onPointerOut={() => {
          setHoveredScreenName(null);
          setHoveredNotebook(false);
          onNotebookHoverChange(false);
          onPrinterPaperHoverChange(false);
        }}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          if (!interactionsEnabled) return;

          e.stopPropagation();

          const hit = e.object as THREE.Mesh;
          const hitName = hit.name ?? "";

          if (hitName.startsWith("SCREEN-")) {
            onScreenClick(hitName as ScreenName);
            return;
          }

          if (isNotebookMeshName(hitName)) {
            onNotebookClick();
            return;
          }

          if (hitName === PRINTER_PAPER_MESH_NAME) {
            onPrinterPaperClick();
          }
        }}
      />

      <BulbEmitter
        model={model}
        onBulbWorldPositionChange={onBulbWorldPositionChange}
        revealStrength={revealStrength}
      />
    </group>
  );
}

function HoverTableLight({
  hoverLight,
  revealStrength,
}: {
  hoverLight: HoverLightData;
  revealStrength: number;
}) {
  const { scene } = useThree();
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const targetRef = useRef<THREE.Object3D | null>(null);
  const flicker = useOccasionalFlicker(1, !!hoverLight && revealStrength > 0.95);

  useEffect(() => {
    const target = new THREE.Object3D();
    scene.add(target);
    targetRef.current = target;

    return () => {
      scene.remove(target);
    };
  }, [scene]);

  useFrame(() => {
    if (!lightRef.current || !targetRef.current) return;

    if (!hoverLight || revealStrength < 0.95) {
      lightRef.current.intensity = 0;
      return;
    }

    lightRef.current.intensity = flicker.current;
    lightRef.current.position.copy(hoverLight.position);

    targetRef.current.position.copy(hoverLight.target);
    targetRef.current.updateMatrixWorld();

    lightRef.current.target = targetRef.current;
  });

  return (
    <directionalLight
      ref={lightRef}
      intensity={0}
      color="#f3e4cf"
      castShadow
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
      shadow-camera-near={0.5}
      shadow-camera-far={20}
      shadow-camera-left={-4}
      shadow-camera-right={4}
      shadow-camera-top={4}
      shadow-camera-bottom={-4}
    />
  );
}

function TitleAnchorTracker({
  bulbWorldPosition,
  onScreenPointChange,
  enabled,
}: {
  bulbWorldPosition: THREE.Vector3 | null;
  onScreenPointChange: (point: ScreenPoint) => void;
  enabled: boolean;
}) {
  const { camera, size } = useThree();
  const lastPointRef = useRef<ScreenPoint>(null);

  useFrame(() => {
    if (!enabled || !bulbWorldPosition) {
      if (lastPointRef.current !== null) {
        lastPointRef.current = null;
        onScreenPointChange(null);
      }
      return;
    }

    const anchorWorld = bulbWorldPosition
      .clone()
      .add(new THREE.Vector3(0, TITLE_WORLD_OFFSET_Y, 0));

    const projected = anchorWorld.project(camera);
    const isBehindCamera = projected.z > 1;

    if (isBehindCamera) {
      if (lastPointRef.current !== null) {
        lastPointRef.current = null;
        onScreenPointChange(null);
      }
      return;
    }

    const x = (projected.x * 0.5 + 0.5) * size.width;
    const y = (-projected.y * 0.5 + 0.5) * size.height;

    const prev = lastPointRef.current;
    const changed =
      !prev || Math.abs(prev.x - x) > 0.5 || Math.abs(prev.y - y) > 0.5;

    if (changed) {
      const nextPoint = { x, y };
      lastPointRef.current = nextPoint;
      onScreenPointChange(nextPoint);
    }
  });

  return null;
}

function TitleOverlay({
  hoveredScreenName,
  titleScreenPoint,
}: {
  hoveredScreenName: string | null;
  titleScreenPoint: ScreenPoint;
}) {
  const titleMap: Record<string, string> = {
    "SCREEN-ABOUT": "/titles/TITLE-ABOUT.webp",
    "SCREEN-BLOG": "/titles/TITLE-BLOG.webp",
    "SCREEN-PORTFOLIO": "/titles/TITLE-PORTFOLIO.webp",
    "SCREEN-CONTACT": "/titles/TITLE-CONTACT.webp",
  };

  const activeTitleSrc = hoveredScreenName ? titleMap[hoveredScreenName] : null;
  const [displayedTitleSrc, setDisplayedTitleSrc] = useState<string | null>(null);

  useEffect(() => {
    if (activeTitleSrc) {
      setDisplayedTitleSrc(activeTitleSrc);
    }
  }, [activeTitleSrc]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      {displayedTitleSrc && titleScreenPoint && (
        <img
          src={displayedTitleSrc}
          alt=""
          draggable={false}
          style={{
            position: "absolute",
            left: `${titleScreenPoint.x}px`,
            top: `${titleScreenPoint.y}px`,
            width: "min(70vw, 900px)",
            height: "auto",
            opacity: activeTitleSrc ? 1 : 0,
            imageRendering: "pixelated",
            transition: "opacity 0.25s ease",
            userSelect: "none",
            transform: "translate(-50%, -50%)",
            willChange: "transform, opacity, left, top",
          }}
        />
      )}
    </div>
  );
}

  function ExitButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Close"
      style={{
        position: "fixed",
        top: "18px",
        right: "18px",
        zIndex: 45,
        width: "48px",
        height: "48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(90, 90, 90, 0.82)",
        border: "2px solid rgba(255, 255, 255, 0.9)",
        color: "#ffffff",
        cursor: "pointer",
        boxSizing: "border-box",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        transition: "background 180ms ease, transform 180ms ease, border-color 180ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(120, 120, 120, 0.92)";
        e.currentTarget.style.borderColor = "#ffffff";
        e.currentTarget.style.transform = "scale(1.04)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(90, 90, 90, 0.82)";
        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.9)";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <span
        style={{
          fontFamily: "Glixels, regular",
          fontSize: "24px",
          lineHeight: 1,
          transform: "translateY(-1px)",
          userSelect: "none",
        }}
      >
        ×
      </span>
    </button>
  );
}

function CVOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 30,
        background: "rgba(0, 0, 0, 0.88)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "min(92vw, 900px)",
          aspectRatio: "1137 / 1600",
          background: "#f3f0e8",
          boxShadow: "0 20px 80px rgba(0,0,0,0.55)",
          overflow: "hidden",
        }}
      >
        <img
          src="/sprites/CV.webp"
          alt="Frederick Harden CV"
          draggable={false}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            userSelect: "none",
          }}
        />

        <img
          src="/sprites/PAPERSTAIN.webp"
          alt=""
          draggable={false}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.15,
            pointerEvents: "none",
            userSelect: "none",
            mixBlendMode: "multiply",
          }}
        />
      </div>
    </div>
  );
}

function ActiveOverlay({
  activeView,
  onClose,
}: {
  activeView: ActiveView;
  onClose: () => void;
}) {
  if (!activeView) return null;

  if (activeView.type === "cv") {
    return <CVOverlay onClose={onClose} />;
  }

  const pageMap: Record<ScreenName, React.ReactNode> = {
    "SCREEN-ABOUT": <ABOUTPAGE />,
    "SCREEN-BLOG": <BLOGPAGE />,
    "SCREEN-PORTFOLIO": <PORTFOLIOPAGE />,
    "SCREEN-CONTACT": <CONTACTPAGE />,
  };

  let content: React.ReactNode = null;

  if (activeView.type === "screen") {
    content = pageMap[activeView.name];
  } else if (activeView.type === "notebook") {
    content = <NOTEBOOKPAGE />;
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 30,
        background: "rgba(0, 0, 0, 0.82)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        overflowY: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          minHeight: "100vh",
          width: "100%",
          padding: "10px 10px 10px",
          boxSizing: "border-box",
        }}
      >
        {content}
      </div>
    </div>
  );
}

function IntroOverlay({
  introPhase,
  overlayOpacity,
  logoSrc = "/sprites/LOGOFH.webp",
  onEnter,
}: IntroOverlayProps) {
  const showTitle =
    introPhase === "title" || introPhase === "message" || introPhase === "enter";
  const showMessage = introPhase === "message" || introPhase === "enter";
  const showEnter = introPhase === "enter";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 50,
        background: `rgba(0,0,0,${overlayOpacity})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: introPhase === "done" ? "none" : "auto",
        transition: "background 500ms ease",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1100px",
          padding: "40px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1px",
          textAlign: "center",
        }}
      >
        <img
          src={logoSrc}
          alt=""
          style={{
            width: "100px",
            height: "100px",
            objectFit: "contain",
            imageRendering: "pixelated",
            opacity: showTitle ? 1 : 0,
            transform: showTitle ? "translateY(0px)" : "translateY(10px)",
            transition: "opacity 500ms ease, transform 500ms ease",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />

        <div
          style={{
            fontFamily: "Glixels, monospace",
            fontSize: "clamp(50px, 5vw, 75px)",
            letterSpacing: "0.08em",
            color: "#f3eee2",
            opacity: showTitle ? 1 : 0,
            transform: showTitle ? "translateY(0px)" : "translateY(10px)",
            transition: "opacity 500ms ease, transform 500ms ease",
            textTransform: "uppercase",
          }}
        >
          FREDERICK HARDEN
        </div>

        <div
          style={{
            marginTop: "-30px",
            fontFamily: "Glixels, monospace",
            fontSize: "clamp(30px, 3vw, 58px)",
            letterSpacing: "0.22em",
            color: "rgba(243, 238, 226, 0.8)",
            opacity: showTitle ? 1 : 0,
            transition: "opacity 500ms ease",
            textTransform: "uppercase",
          }}
        >
          Graphic - UI Designer
        </div>

        <div
          style={{
            marginTop: "1px",
            fontFamily: "Glixels, monospace",
            fontSize: "clamp(12px, 1vw, 18px)",
            letterSpacing: "0.08em",
            lineHeight: 1.6,
            color: "rgba(243, 238, 226, 0.82)",
            maxWidth: "740px",
            opacity: showMessage ? 1 : 0,
            transform: showMessage ? "translateY(0px)" : "translateY(10px)",
            transition: "opacity 500ms ease, transform 500ms ease",
          }}
        >
          This portfolio is optimised for 1080p and 1440p displays as to preserve the layout and visual intent.
          Mobile support is limited, this site is asset-heavy and so it may load slower on lower connection speeds.
        </div>

        <button
          onClick={onEnter}
          style={{
            marginTop: "22px",
            fontFamily: "Glixels, monospace",
            fontSize: "clamp(14px, 1vw, 20px)",
            letterSpacing: "0.16em",
            color: "#f3eee2",
            background: "transparent",
            border: "3px solid rgba(243, 238, 226, 0.45)",
            padding: "14px 26px",
            cursor: showEnter ? "pointer" : "default",
            opacity: showEnter ? 1 : 0,
            transform: showEnter ? "translateY(0px)" : "translateY(10px)",
            transition:
              "opacity 500ms ease, transform 500ms ease, border-color 200ms ease, background 200ms ease",
            pointerEvents: showEnter ? "auto" : "none",
            textTransform: "uppercase",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(243, 238, 226, 0.9)";
            e.currentTarget.style.background = "rgba(243, 238, 226, 0.06)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(243, 238, 226, 0.45)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          ENTER
        </button>
      </div>
    </div>
  );
}

export default function Page() {
  const [hoverLight, setHoverLight] = useState<HoverLightData>(null);
  const [hoveredScreenName, setHoveredScreenName] = useState<string | null>(null);
  const [notebookHovered, setNotebookHovered] = useState(false);
  const [printerPaperHovered, setPrinterPaperHovered] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>(null);

  const [bulbWorldPosition, setBulbWorldPosition] = useState<THREE.Vector3 | null>(
    null
  );
  const [titleScreenPoint, setTitleScreenPoint] = useState<ScreenPoint>(null);

  const [introPhase, setIntroPhase] = useState<
    "title" | "message" | "enter" | "revealing" | "done"
  >("title");

  const [overlayOpacity, setOverlayOpacity] = useState(1);
  const [revealStrength, setRevealStrength] = useState(0);

  const hoverTickRef = useRef<HTMLAudioElement | null>(null);
  const ambientRef = useRef<HTMLAudioElement | null>(null);
  const menuOpenRef = useRef<HTMLAudioElement | null>(null);
  const notebookOpenRef = useRef<HTMLAudioElement | null>(null);
  const powerOnRef = useRef<HTMLAudioElement | null>(null);
  const fanRef = useRef<HTMLAudioElement | null>(null);
  const portfolioAmbienceRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const timers: number[] = [];

    timers.push(
      window.setTimeout(() => {
        setIntroPhase("message");
      }, 900)
    );

    timers.push(
      window.setTimeout(() => {
        setIntroPhase("enter");
      }, 1900)
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  useEffect(() => {
    const hoverAudio = new Audio("/audio/HOVERTICK.mp3");
    hoverAudio.volume = 0.5;
    hoverAudio.preload = "auto";
    hoverTickRef.current = hoverAudio;

    const ambientAudio = new Audio("/audio/ELECTRICHUM.mp3");
    ambientAudio.loop = true;
    ambientAudio.volume = 0.3;
    ambientAudio.preload = "auto";
    ambientRef.current = ambientAudio;

    const menuOpenAudio = new Audio("/audio/MENUOPEN.mp3");
    menuOpenAudio.volume = 0.6;
    menuOpenAudio.preload = "auto";
    menuOpenRef.current = menuOpenAudio;

    const notebookOpenAudio = new Audio("/audio/NOTEBOOKOPEN.mp3");
    notebookOpenAudio.volume = 0.65;
    notebookOpenAudio.preload = "auto";
    notebookOpenRef.current = notebookOpenAudio;

    const powerOnAudio = new Audio("/audio/MENUOPEN.mp3");
    powerOnAudio.volume = 0.45;
    powerOnAudio.preload = "auto";
    powerOnRef.current = powerOnAudio;

    const fanAudio = new Audio("/audio/FAN.mp3");
    fanAudio.loop = true;
    fanAudio.volume = 0.05;
    fanAudio.preload = "auto";
    fanRef.current = fanAudio;

    const portfolioAmbienceAudio = new Audio("/audio/PORTFOLIOAMBIANCE.mp3");
    portfolioAmbienceAudio.loop = true;
    portfolioAmbienceAudio.volume = 0.5;
    portfolioAmbienceAudio.preload = "auto";
    portfolioAmbienceRef.current = portfolioAmbienceAudio;

    return () => {
      hoverAudio.pause();
      hoverAudio.currentTime = 0;

      ambientAudio.pause();
      ambientAudio.currentTime = 0;

      menuOpenAudio.pause();
      menuOpenAudio.currentTime = 0;

      notebookOpenAudio.pause();
      notebookOpenAudio.currentTime = 0;

      powerOnAudio.pause();
      powerOnAudio.currentTime = 0;

      fanAudio.pause();
      fanAudio.currentTime = 0;

      portfolioAmbienceAudio.pause();
      portfolioAmbienceAudio.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    const canInteractWithScene = introPhase === "done" && !activeView;
    document.body.style.cursor =
      canInteractWithScene && (notebookHovered || printerPaperHovered)
        ? "pointer"
        : "default";

    return () => {
      document.body.style.cursor = "default";
    };
  }, [notebookHovered, printerPaperHovered, introPhase, activeView]);

  useEffect(() => {
    const ambientAudio = ambientRef.current;
    if (!ambientAudio) return;

    if (activeView?.type === "screen") {
      ambientAudio.volume = 0.02;
    } else {
      ambientAudio.volume = 0.3;
    }
  }, [activeView]);

  const stopOverlayAmbience = useCallback(() => {
    const fan = fanRef.current;
    const portfolioAmbience = portfolioAmbienceRef.current;

    if (fan) {
      fan.pause();
      fan.currentTime = 0;
    }

    if (portfolioAmbience) {
      portfolioAmbience.pause();
      portfolioAmbience.currentTime = 0;
    }
  }, []);

  const startOverlayAmbience = useCallback((screenName: ScreenName) => {
    const fan = fanRef.current;
    const portfolioAmbience = portfolioAmbienceRef.current;

    if (fan) {
      fan.pause();
      fan.currentTime = 0;
    }

    if (portfolioAmbience) {
      portfolioAmbience.pause();
      portfolioAmbience.currentTime = 0;
    }

    if (screenName === "SCREEN-PORTFOLIO") {
      if (!portfolioAmbience) return;
      portfolioAmbience.volume = 0.5;
      portfolioAmbience.play().catch(() => {});
      return;
    }

    if (!fan) return;
    fan.volume = 0.05;
    fan.play().catch(() => {});
  }, []);

  const closeActiveView = useCallback(() => {
    stopOverlayAmbience();
    setActiveView(null);
  }, [stopOverlayAmbience]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeActiveView();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeActiveView]);

  const playHoverTick = () => {
    const audio = hoverTickRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  const playMenuOpen = () => {
    const audio = menuOpenRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  const playNotebookOpen = () => {
    const audio = notebookOpenRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  const handleEnter = () => {
    if (introPhase !== "enter") return;

    setIntroPhase("revealing");

    const ambientAudio = ambientRef.current;
    if (ambientAudio) {
      ambientAudio.currentTime = 0;
      ambientAudio.play().catch(() => {});
    }

    const powerOnAudio = powerOnRef.current;
    if (powerOnAudio) {
      powerOnAudio.currentTime = 0;
      powerOnAudio.play().catch(() => {});
    }

    setOverlayOpacity(0);

    const sequence = [
      { at: 80, value: 0.18 },
      { at: 150, value: 0.02 },
      { at: 240, value: 0.36 },
      { at: 340, value: 0.08 },
      { at: 470, value: 0.68 },
      { at: 620, value: 0.32 },
      { at: 780, value: 1 },
    ];

    sequence.forEach((step) => {
      window.setTimeout(() => {
        setRevealStrength(step.value);
      }, step.at);
    });

    window.setTimeout(() => {
      setIntroPhase("done");
      setRevealStrength(1);
    }, 950);
  };

  const sceneInteractionsEnabled = introPhase === "done" && !activeView;

  return (
    <main
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        background: "black",
        overflow: "hidden",
      }}
    >
      <style jsx global>{`
  @font-face {
    font-family: "Glixels";
    src: url("/Fonts/Glixels-Regular.woff2") format("woff2");
    font-display: swap;
  }
`}</style>

      {!activeView && introPhase === "done" && (
        <TitleOverlay
          hoveredScreenName={hoveredScreenName}
          titleScreenPoint={titleScreenPoint}
        />
      )}

      <Canvas
        shadows="soft"
        camera={{ position: [0, 1.6, -5.6], fov: 32 }}
        style={{
          opacity:
            introPhase === "title" ||
            introPhase === "message" ||
            introPhase === "enter"
              ? 0
              : 1,
          transition: "opacity 180ms ease",
        }}
      >
        <SceneExposure />

        <TitleAnchorTracker
          bulbWorldPosition={bulbWorldPosition}
          onScreenPointChange={setTitleScreenPoint}
          enabled={introPhase === "done"}
        />

        <hemisphereLight
          intensity={0.18 * revealStrength}
          color="#6e7c8f"
          groundColor="#161616"
        />

        <directionalLight
          position={[2, 2, 4]}
          intensity={0.35 * revealStrength}
          color="#f4d2b8"
        />

        <HoverTableLight
          hoverLight={hoverLight}
          revealStrength={revealStrength}
        />

        <TVs
          onHoverLightChange={setHoverLight}
          onHoveredScreenChange={setHoveredScreenName}
          onScreenHoverStart={playHoverTick}
          onScreenClick={(screenName) => {
            playMenuOpen();
            startOverlayAmbience(screenName);
            setActiveView({ type: "screen", name: screenName });
          }}
          onNotebookHoverChange={setNotebookHovered}
          onNotebookClick={() => {
            stopOverlayAmbience();
            playNotebookOpen();
            setActiveView({ type: "notebook" });
          }}
          onPrinterPaperHoverChange={setPrinterPaperHovered}
          onPrinterPaperClick={() => {
            stopOverlayAmbience();
            playNotebookOpen();
            setActiveView({ type: "cv" });
          }}
          onBulbWorldPositionChange={setBulbWorldPosition}
          interactionsEnabled={sceneInteractionsEnabled}
          revealStrength={revealStrength}
        />

        <OrbitControls
          target={[0, 1, 0]}
          enablePan={false}
          enableZoom={false}
          enableDamping
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>

      {introPhase !== "done" && (
        <IntroOverlay
          introPhase={introPhase}
          overlayOpacity={overlayOpacity}
          onEnter={handleEnter}
        />
      )}

      {activeView && <ExitButton onClick={closeActiveView} />}

      <ActiveOverlay activeView={activeView} onClose={closeActiveView} />
    </main>
  );
}