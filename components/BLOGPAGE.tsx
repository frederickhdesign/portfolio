import { useState, useEffect, useRef } from "react";
import { blogEntries } from "./BLOGDATA";

export default function BLOGPAGE() {
  const [readingMode, setReadingMode] = useState(false);
  const [selectedId, setSelectedId] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [bootComplete, setBootComplete] = useState(false);
  const [typedUsername, setTypedUsername] = useState("");
  const [typedPassword, setTypedPassword] = useState("");
  const [loginStage, setLoginStage] = useState<
    "username" | "password" | "verifying" | "granted"
  >("username");

  const clickAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const click = new Audio("/audio/BUTTON CLICK.mp3");
    click.volume = 0.35;
    click.preload = "auto";

    clickAudioRef.current = click;

    return () => {
      click.pause();
      click.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    const username = "hardenf";
    const password = "********";

    let usernameIndex = 0;
    let passwordIndex = 0;

    let usernameInterval: ReturnType<typeof setInterval> | null = null;
    let passwordInterval: ReturnType<typeof setInterval> | null = null;
    let verifyTimeout: ReturnType<typeof setTimeout> | null = null;
    let grantedTimeout: ReturnType<typeof setTimeout> | null = null;

    usernameInterval = setInterval(() => {
      usernameIndex += 1;
      setTypedUsername(username.slice(0, usernameIndex));

      if (usernameIndex >= username.length) {
        if (usernameInterval) clearInterval(usernameInterval);

        setTimeout(() => {
          setLoginStage("password");

          passwordInterval = setInterval(() => {
            passwordIndex += 1;
            setTypedPassword(password.slice(0, passwordIndex));

            if (passwordIndex >= password.length) {
              if (passwordInterval) clearInterval(passwordInterval);

              verifyTimeout = setTimeout(() => {
                setLoginStage("verifying");

                grantedTimeout = setTimeout(() => {
                  setLoginStage("granted");

                  setTimeout(() => {
                    setBootComplete(true);
                  }, 450);
                }, 500);
              }, 250);
            }
          }, 90);
        }, 180);
      }
    }, 110);

    return () => {
      if (usernameInterval) clearInterval(usernameInterval);
      if (passwordInterval) clearInterval(passwordInterval);
      if (verifyTimeout) clearTimeout(verifyTimeout);
      if (grantedTimeout) clearTimeout(grantedTimeout);
    };
  }, []);

  const playPostClickSound = () => {
    const click = clickAudioRef.current;
    if (!click) return;

    click.pause();
    click.currentTime = 0;
    click.play().catch(() => {});
  };

  const sortedEntries = [...blogEntries].sort((a, b) => {
    if (sortOrder === "asc") return a.id - b.id;
    return b.id - a.id;
  });

  const selectedEntry =
    blogEntries.find((entry) => entry.id === selectedId) ?? blogEntries[0];

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
          overflow: hidden;
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

            {!bootComplete ? (
              <div className="bootOverlay">
                <div className="loginTerminal">
                  <div className="loginHeader">
                    <span className="windowDot" />
                    <span>HARDENF_PERSONAL_TERMINAL</span>
                  </div>

                  <div className="loginBody">
                    <div className="loginLine systemLine">
                      INITIALISING SECURE PERSONAL TERMINAL...
                    </div>
                    <div className="loginLine systemLine">
                      AUTH LAYER v2.3 READY
                    </div>

                    <div className="loginSpacer" />

                    <div className="loginRow">
                      <span className="loginLabel">USERNAME:</span>
                      <span className="loginValue">
                        {typedUsername}
                        {loginStage === "username" && (
                          <span className="cursor">█</span>
                        )}
                      </span>
                    </div>

                    <div className="loginRow">
                      <span className="loginLabel">PASSWORD:</span>
                      <span className="loginValue">
                        {typedPassword}
                        {loginStage === "password" && (
                          <span className="cursor">█</span>
                        )}
                      </span>
                    </div>

                    <div className="loginSpacer" />

                    {loginStage === "verifying" && (
                      <div className="loginLine accentLine">VERIFYING...</div>
                    )}

                    {loginStage === "granted" && (
                      <div className="loginLine grantedLine">
                        ACCESS GRANTED
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className={`appWindow ${readingMode ? "reading" : ""}`}>
                <header className="topBar">
                  <div className="titleCluster">
                    <span className="windowDot" />
                    <span className="windowLabel">
                      HARDENF_PERSONAL_TERMINAL
                    </span>
                  </div>
                  <div className="pageTitle">BLOG_ARCHIVE</div>
                </header>

                <main className="contentArea">
                  <aside className="panel entriesPanel">
                    <div className="panelLabel panelLabelWithButton">
                      <span>ALL POSTS</span>

                      <button
                        className="sortToggle"
                        onClick={() =>
                          setSortOrder((prev) =>
                            prev === "asc" ? "desc" : "asc"
                          )
                        }
                        aria-label="Toggle post sort order"
                      >
                        {sortOrder === "asc" ? "OLDEST" : "NEWEST"}
                      </button>
                    </div>

                    <div className="entriesColumn">
                      {sortedEntries.map((entry) => (
                        <button
                          key={entry.id}
                          className={`entryCard ${
                            selectedId === entry.id ? "active" : ""
                          }`}
                          onClick={() => {
                            setSelectedId(entry.id);
                            playPostClickSound();
                          }}
                        >
                          <span className="entryNumber">
                            {String(entry.id).padStart(2, "0")}
                          </span>

                          <div className="entryText">
                            <span className="entryTitle">{entry.title}</span>
                            <span className="entryMeta">
                              {entry.date} / {entry.type}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </aside>

                  <section className="panel postPanel">
                    <div className="panelLabel">BLOG VIEW</div>

                    <div className="postColumn">
                      <div className="postInner">
                        <div className="postContent">
                          <div className="postHeaderBlock">
                            <h1>{selectedEntry.title}</h1>

                            <div className="postMetaGrid">
                              <span>POSTED: {selectedEntry.date}</span>
                              <span>UPDATED: {selectedEntry.updated}</span>
                              <span>TYPE: {selectedEntry.type}</span>
                              <span>
                                ID: {String(selectedEntry.id).padStart(2, "0")}
                              </span>
                            </div>
                          </div>

                          <article className="postBody">
                            {selectedEntry.content
                              .trim()
                              .split("\n")
                              .map((line, index) => {
                                const trimmed = line.trim();

                                if (!trimmed) {
                                  return <div key={index} className="spacer" />;
                                }

                                const isHeading =
                                  trimmed === trimmed.toUpperCase() &&
                                  trimmed.length < 60;

                                if (isHeading) {
                                  return (
                                    <h2 key={index} className="postHeading">
                                      {trimmed}
                                    </h2>
                                  );
                                }

                                return <p key={index}>{trimmed}</p>;
                              })}
                          </article>
                        </div>
                      </div>
                    </div>
                  </section>
                </main>

                <footer className="bottomBar">
                  <div className="statusGroup">
                    <span>POSTS: {blogEntries.length}</span>
                    <span>LAST UPDATED: {selectedEntry.updated}</span>
                  </div>

                  <button
                    className="modeToggle"
                    onClick={() => setReadingMode((prev) => !prev)}
                    aria-label="Toggle reading mode"
                  >
                    <span>READING MODE</span>
                    <span className={`toggleBox ${readingMode ? "on" : ""}`}>
                      <span className="toggleKnob" />
                    </span>
                  </button>
                </footer>
              </div>
            )}
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
          background: linear-gradient(
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
          height: min(65vh, 900px);
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
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
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

        .bootOverlay {
          position: relative;
          z-index: 3;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .loginTerminal {
          width: min(92%, 560px);
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
        }

        .loginHeader {
          height: 2.4rem;
          display: flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0 0.7rem;
          background: rgba(114, 255, 159, 0.045);
          border-bottom: 1px solid rgba(114, 255, 159, 0.35);
          color: #85ffaf;
          font-size: clamp(0.7rem, 1vw, 0.95rem);
          letter-spacing: 0.05em;
          text-shadow:
            0 0 5px rgba(114, 255, 159, 0.45),
            0 0 10px rgba(114, 255, 159, 0.12);
        }

        .loginBody {
          padding: 1rem;
          min-height: 220px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background:
            linear-gradient(
              to bottom,
              rgba(8, 22, 11, 0.96),
              rgba(3, 12, 6, 0.98)
            );
        }

        .loginLine,
        .loginRow {
          font-size: clamp(0.8rem, 1vw, 1rem);
          line-height: 1.5;
          letter-spacing: 0.05em;
          text-shadow:
            0 0 5px rgba(114, 255, 159, 0.42),
            0 0 10px rgba(114, 255, 159, 0.08);
        }

        .systemLine {
          color: #9effbe;
        }

        .accentLine {
          color: #ffe08a;
        }

        .grantedLine {
          color: #72ff9f;
        }

        .loginSpacer {
          height: 0.9rem;
        }

        .loginRow {
          display: grid;
          grid-template-columns: 130px 1fr;
          gap: 0.8rem;
          align-items: center;
          min-height: 1.8rem;
        }

        .loginLabel {
          color: #85ffaf;
        }

        .loginValue {
          color: #d8ffe6;
          min-height: 1.2rem;
        }

        .cursor {
          display: inline-block;
          margin-left: 0.08rem;
          animation: blink 0.8s steps(1) infinite;
        }

        @keyframes blink {
          0%,
          49% {
            opacity: 1;
          }
          50%,
          100% {
            opacity: 0;
          }
        }

        .appWindow {
          --bg: rgba(4, 16, 8, 0.92);
          --panel: rgba(7, 22, 11, 0.92);
          --panelInset: rgba(10, 28, 15, 0.96);
          --text: #85ffaf;
          --borderDark: rgba(3, 10, 5, 0.95);
          --borderMid: rgba(114, 255, 159, 0.18);
          --borderLight: rgba(114, 255, 159, 0.36);
          --muted: #a8e6bc;
          --accent: #72ff9f;
          --active: rgba(114, 255, 159, 0.12);
          --activeText: #d8ffe6;
          --statusBg: rgba(3, 12, 6, 0.96);
          --scrollbarThumbBorder: rgba(114, 255, 159, 0.34);
          --scrollbarThumbHoverFill: rgba(114, 255, 159, 0.08);

          position: relative;
          z-index: 3;
          width: 100%;
          height: 100%;
          background: var(--bg);
          color: var(--text);
          border: 1px solid var(--borderLight);
          box-shadow:
            0 0 18px rgba(114, 255, 159, 0.08),
            inset 0 0 18px rgba(114, 255, 159, 0.04);
          display: grid;
          grid-template-rows: auto 1fr auto;
          overflow: hidden;
          text-shadow:
            0 0 5px rgba(114, 255, 159, 0.42),
            0 0 10px rgba(114, 255, 159, 0.08);
        }

        .appWindow.reading {
          --bg: rgba(24, 13, 5, 0.94);
          --panel: rgba(32, 17, 7, 0.94);
          --panelInset: rgba(42, 22, 9, 0.96);
          --text: #ffc978;
          --borderDark: rgba(12, 6, 2, 0.96);
          --borderMid: rgba(255, 190, 110, 0.18);
          --borderLight: rgba(255, 190, 110, 0.34);
          --muted: #f0c892;
          --accent: #ffb964;
          --active: rgba(255, 185, 100, 0.13);
          --activeText: #fff0d7;
          --statusBg: rgba(20, 11, 4, 0.97);
          --scrollbarThumbBorder: rgba(255, 190, 110, 0.34);
          --scrollbarThumbHoverFill: rgba(255, 185, 100, 0.08);
        }

        .topBar,
        .bottomBar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 0.6rem;
          z-index: 2;
        }

        .topBar {
          min-height: 3rem;
          background: rgba(114, 255, 159, 0.045);
          border-bottom: 1px solid var(--borderLight);
          box-shadow: inset 0 1px 0 rgba(114, 255, 159, 0.04);
        }

        .appWindow.reading .topBar {
          background: rgba(255, 185, 100, 0.045);
          box-shadow: inset 0 1px 0 rgba(255, 185, 100, 0.04);
        }

        .bottomBar {
          min-height: 2.3rem;
          background: var(--statusBg);
          border-top: 1px solid var(--borderLight);
          box-shadow: inset 0 1px 0 rgba(114, 255, 159, 0.04);
          font-size: clamp(0.55rem, 0.8vw, 0.8rem);
          gap: 1rem;
        }

        .appWindow.reading .bottomBar {
          box-shadow: inset 0 1px 0 rgba(255, 185, 100, 0.04);
        }

        .titleCluster {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          min-width: 0;
        }

        .windowDot {
          width: 0.55rem;
          height: 0.55rem;
          background: var(--accent, #72ff9f);
          border: 1px solid var(--borderLight);
          flex-shrink: 0;
          box-shadow: 0 0 8px color-mix(in srgb, var(--accent) 45%, transparent);
        }

        .windowLabel,
        .pageTitle {
          line-height: 1;
          letter-spacing: 0.04em;
          font-size: clamp(0.8rem, 1.2vw, 1.15rem);
        }

        .pageTitle {
          color: var(--accent);
        }

        .contentArea {
          display: grid;
          grid-template-columns: 31% 1fr;
          gap: 0;
          min-height: 0;
          padding: 0.35rem;
          background: transparent;
        }

        .panel {
          min-height: 0;
          display: grid;
          grid-template-rows: auto 1fr;
          background: var(--panel);
          border: 1px solid var(--borderLight);
          box-shadow:
            0 0 14px rgba(114, 255, 159, 0.04),
            inset 0 0 14px rgba(114, 255, 159, 0.03);
        }

        .appWindow.reading .panel {
          box-shadow:
            0 0 14px rgba(255, 185, 100, 0.04),
            inset 0 0 14px rgba(255, 185, 100, 0.03);
        }

        .entriesPanel {
          margin-right: 0.35rem;
        }

        .panelLabel {
          height: 1.8rem;
          display: flex;
          align-items: center;
          padding: 0 0.55rem;
          background: rgba(114, 255, 159, 0.045);
          border-bottom: 1px solid var(--borderLight);
          color: var(--accent);
          font-size: clamp(0.58rem, 0.85vw, 0.82rem);
          letter-spacing: 0.06em;
        }

        .appWindow.reading .panelLabel {
          background: rgba(255, 185, 100, 0.045);
        }

        .panelLabelWithButton {
          justify-content: space-between;
          gap: 0.5rem;
        }

        .sortToggle {
          border: 1px solid var(--borderLight);
          background: transparent;
          color: var(--accent);
          font-family: "Glixels", sans-serif;
          font-size: clamp(0.75rem, 0.7vw, 0.68rem);
          line-height: 1;
          padding: 0.2rem 0.45rem;
          cursor: pointer;
          text-shadow:
            0 0 5px color-mix(in srgb, var(--accent) 45%, transparent),
            0 0 10px color-mix(in srgb, var(--accent) 12%, transparent);
        }

        .sortToggle:hover {
          background: color-mix(in srgb, var(--accent) 8%, transparent);
        }

        .entriesColumn,
        .postColumn {
          min-height: 0;
          overflow-y: auto;
          background: var(--panel);
        }

        .entryCard {
          width: 100%;
          min-height: 4.2rem;
          border: 0;
          border-bottom: 1px solid var(--borderLight);
          background: transparent;
          color: var(--text);
          text-align: left;
          padding: 0.5rem 0.55rem;
          cursor: pointer;
          font-family: "Glixels", sans-serif;
          display: grid;
          grid-template-columns: 2rem 1fr;
          gap: 0.45rem;
          text-shadow:
            0 0 5px color-mix(in srgb, var(--accent) 40%, transparent),
            0 0 10px color-mix(in srgb, var(--accent) 8%, transparent);
        }

        .entryCard:hover {
          background: color-mix(in srgb, var(--accent) 6%, transparent);
        }

        .entryCard.active {
          background: var(--active);
          color: var(--activeText);
          box-shadow: inset 0 0 8px color-mix(in srgb, var(--accent) 10%, transparent);
        }

        .entryNumber {
          font-size: clamp(2rem, 0.9vw, 0.8rem);
          line-height: 1.4;
          opacity: 0.85;
          padding-top: 0.1rem;
        }

        .entryText {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          min-width: 0;
        }

        .entryTitle {
          font-size: clamp(1.5rem, 1vw, 0.95rem);
          line-height: 1.15;
          word-break: break-word;
        }

        .entryMeta {
          font-size: clamp(1rem, 0.75vw, 0.68rem);
          line-height: 1.2;
          opacity: 0.9;
        }

        .postInner {
          min-height: 100%;
          background: var(--panelInset);
          margin: 0.45rem;
          border: 1px solid var(--borderLight);
          box-shadow:
            0 0 12px rgba(114, 255, 159, 0.03),
            inset 0 0 12px rgba(114, 255, 159, 0.03);
        }

        .appWindow.reading .postInner {
          box-shadow:
            0 0 12px rgba(255, 185, 100, 0.03),
            inset 0 0 12px rgba(255, 185, 100, 0.03);
        }

        .postContent {
          padding: 0.9rem 1rem 1rem;
        }

        .postHeading {
          margin: 1.2rem 0 0.4rem;
          font-size: clamp(1.6rem, 1.2vw, 1.1rem);
          letter-spacing: 0.08em;
          color: var(--accent);
          padding-bottom: 0.2rem;
        }

        .postHeaderBlock {
          margin-bottom: 1rem;
        }

        .postContent h1 {
          margin: 0 0 0.7rem;
          font-size: clamp(1.8rem, 3vw, 3rem);
          font-weight: normal;
          line-height: 1;
          letter-spacing: 0.03em;
        }

        .postMetaGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.35rem 1rem;
          font-size: clamp(1.5rem, 0.82vw, 0.78rem);
          color: var(--muted);
          line-height: 1.2;
          text-transform: uppercase;
        }

        .postBody {
          display: flex;
          flex-direction: column;
        }

        .postBody p {
          margin: 0;
          font-size: clamp(1.4rem, 0.95vw, 0.9rem);
          line-height: 0.8;
          letter-spacing: 1;
          white-space: pre-wrap;
          max-width: 100ch;
        }

        .spacer {
          height: 1rem;
          flex-shrink: 0;
        }

        .statusGroup {
          display: flex;
          align-items: center;
          gap: 1rem;
          min-width: 0;
          overflow: hidden;
          white-space: pre-wrap;
        }

        .modeToggle {
          border: 0;
          background: transparent;
          color: var(--text);
          font-family: "Glixels", sans-serif;
          font-size: inherit;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          padding: 0;
          flex-shrink: 0;
          text-shadow:
            0 0 5px color-mix(in srgb, var(--accent) 45%, transparent),
            0 0 10px color-mix(in srgb, var(--accent) 10%, transparent);
        }

        .toggleBox {
          width: 3.2rem;
          height: 1rem;
          border: 1px solid var(--borderLight);
          background: var(--panelInset);
          display: flex;
          align-items: center;
          padding: 1px;
          box-shadow: inset 0 0 8px color-mix(in srgb, var(--accent) 6%, transparent);
        }

        .toggleKnob {
          width: 1.2rem;
          height: 100%;
          background: var(--accent);
          border: 1px solid var(--borderDark);
          transform: translateX(0);
          box-shadow: 0 0 8px color-mix(in srgb, var(--accent) 35%, transparent);
        }

        .toggleBox.on .toggleKnob {
          transform: translateX(1.65rem);
        }

        .entriesColumn::-webkit-scrollbar,
        .postColumn::-webkit-scrollbar {
          width: 20px;
        }

        .entriesColumn::-webkit-scrollbar-track,
        .postColumn::-webkit-scrollbar-track {
          background: var(--panelInset);
        }

        .entriesColumn::-webkit-scrollbar-thumb,
        .postColumn::-webkit-scrollbar-thumb {
          border: 1px solid var(--scrollbarThumbBorder);
          background:
            linear-gradient(var(--muted), var(--muted)) center calc(50% - 4px) /
              8px 2px no-repeat,
            linear-gradient(var(--muted), var(--muted)) center 50% / 8px 2px
              no-repeat,
            linear-gradient(var(--muted), var(--muted)) center calc(50% + 4px) /
              8px 2px no-repeat;
          min-height: 34px;
        }

        .entriesColumn::-webkit-scrollbar-thumb:hover,
        .postColumn::-webkit-scrollbar-thumb:hover {
          box-shadow: inset 0 0 0 999px var(--scrollbarThumbHoverFill);
        }

        .entriesColumn::-webkit-scrollbar-corner,
        .postColumn::-webkit-scrollbar-corner {
          background: var(--panelInset);
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
          .crt-screen {
            padding: 0.6rem;
          }

          .contentArea {
            grid-template-columns: 1fr;
            grid-template-rows: 34% 1fr;
          }

          .entriesPanel {
            margin-right: 0;
            margin-bottom: 0.35rem;
          }

          .postMetaGrid {
            grid-template-columns: 1fr;
          }

          .bottomBar {
            padding: 0.35rem 0.5rem;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            gap: 0.35rem;
          }

          .windowLabel,
          .pageTitle {
            font-size: clamp(0.65rem, 3vw, 0.95rem);
          }

          .postContent h1 {
            font-size: clamp(1.35rem, 7vw, 2rem);
          }

          .sortToggle {
            font-size: clamp(0.48rem, 2.1vw, 0.62rem);
            padding: 0.18rem 0.35rem;
          }

          .loginRow {
            grid-template-columns: 1fr;
            gap: 0.2rem;
          }

          .loginBody {
            min-height: 200px;
          }
        }
      `}</style>
    </>
  );
}
