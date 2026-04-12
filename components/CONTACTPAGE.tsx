"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type MessageOption = {
  id: string;
  prompt: string;
  reply: string;
};

type ChatMessage = {
  id: string;
  side: "sent" | "received";
  text: string;
};

type Personality = "default" | "pirate" | "alien" | "patrickstar";

const MESSAGE_OPTIONS: MessageOption[] = [
  {
    id: "instagram",
    prompt: "What's your Instagram?",
    reply: "You can find me on Instagram at fredz.exe",
  },
  {
    id: "phone",
    prompt: "What's your phone number?",
    reply: "My phone number is +44 07484 153810",
  },
  {
    id: "cv",
    prompt: "Where can I find your CV?",
    reply:
      "You can find a copy of my CV in the about section, you can also download a print version in the start menu.",
  },
  {
    id: "email",
    prompt: "What's your contact email?",
    reply: "Send me an email at frederickhdesign@gmail.com",
  },
];

const PERSONALITIES: Record<Personality, { label: string }> = {
  default: { label: "DEFAULT MODE" },
  pirate: { label: "PIRATE MODE" },
  alien: { label: "ALIEN MODE" },
  patrickstar: { label: "ASK PATRICK STAR" },
};

const PERSONALITY_REPLIES: Record<Personality, Record<string, string>> = {
  default: {
    instagram: "type here",
    phone: "type here",
    cv: "type here",
    email: "type here",
  },
  pirate: {
    instagram: "Arr! Search for me on the seas of Instagram at fredz.exe",
    phone: "Use yer speaking device and dial +44 07484 153810",
    cv: "Me credentials be stored in the about section, or you can retrieve a copy from the start menu",
    email: "Send word to frederickhdesign@gmail.com and I shall answer",
  },
  alien: {
    instagram: "zhar… kree vokta lin… fredz.exe",
    phone: "vok vok— traa kesh lin… +44 07484 153810",
    cv: "kree lin… vokta archive… “about section”…",
    email: "zhek traa vok… message route… frederickhdesign@gmail.com",
  },
  patrickstar: {
    instagram:
      "uhh i think it's fredz.exe, unless i forgot. squidward told me but i can only think about his big nose thing",
    phone:
      "OH I KNOW THIS ONE IT'S 07484 153... wait wait. ITS +44 07484 153810 THATS THE ONE",
    cv: "whats a cv? i think spongebob has one, i think it's in the about me thing",
    email:
      "i think it's frederickhdesign@gmail.com, mr krabs said all his girlfriends always email that guy he must be awesome!",
  },
};

export default function CONTACTPAGE() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "intro-received",
      side: "received",
      text: "CONTACT TERMINAL READY // Select a question below.",
    },
  ]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [personality, setPersonality] = useState<Personality>("default");
  const [personalityMenuOpen, setPersonalityMenuOpen] = useState(false);

  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const personalityRef = useRef<HTMLDivElement | null>(null);
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);

  const usedPrompts = useMemo(
    () => new Set(messages.filter((m) => m.side === "sent").map((m) => m.text)),
    [messages]
  );

  useEffect(() => {
    clickAudioRef.current = new Audio("/audio/BUTTON%20CLICK.mp3");
    clickAudioRef.current.volume = 0.35;
  }, []);

  useEffect(() => {
    const el = chatScrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (menuRef.current && !menuRef.current.contains(target)) {
        setMenuOpen(false);
      }

      if (personalityRef.current && !personalityRef.current.contains(target)) {
        setPersonalityMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const playClickSound = () => {
    const audio = clickAudioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    audio.play().catch(() => {
      // Ignore autoplay/user gesture edge cases
    });
  };

  const getReplyForPersonality = (option: MessageOption) => {
    const customReply = PERSONALITY_REPLIES[personality][option.id];

    if (customReply && customReply !== "type here") {
      return customReply;
    }

    return option.reply;
  };

  const handlePromptClick = (option: MessageOption) => {
    playClickSound();

    const now = Date.now();

    const sentMessage: ChatMessage = {
      id: `${option.id}-sent-${now}`,
      side: "sent",
      text: option.prompt,
    };

    const receivedMessage: ChatMessage = {
      id: `${option.id}-received-${now + 1}`,
      side: "received",
      text: getReplyForPersonality(option),
    };

    setMessages((prev) => [...prev, sentMessage, receivedMessage]);
    setMenuOpen(false);
  };

  const handleTypeHereClick = () => {
    playClickSound();
    setMenuOpen((prev) => !prev);
  };

  const handlePersonalityButtonClick = () => {
    playClickSound();
    setPersonalityMenuOpen((prev) => !prev);
  };

  const handlePersonalitySelect = (mode: Personality) => {
    playClickSound();
    setPersonality(mode);
    setPersonalityMenuOpen(false);
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

            <div className="contact-ui">
              <div className="topbar">
                <div className="topbar-title">CONTACT_DETAILS</div>
                <div className="topbar-clock" />
              </div>

              <div className="content-grid">
                <div className="chat-panel">
                  <div className="chat-panel-header">
                    <span>FREDERICK HARDEN</span>
                  </div>

                  <div className="chat-scroll" ref={chatScrollRef}>
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`message-row ${
                          message.side === "sent" ? "sent-row" : "received-row"
                        }`}
                      >
                        <div
                          className={`message-bubble ${
                            message.side === "sent"
                              ? "sent-bubble"
                              : "received-bubble"
                          }`}
                        >
                          {message.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="input-bar-area" ref={menuRef}>
                    <button className="fake-input" onClick={handleTypeHereClick}>
                      Type here
                    </button>

                    {menuOpen && (
                      <div className="prompt-menu">
                        {MESSAGE_OPTIONS.map((option) => {
                          const alreadyUsed = usedPrompts.has(option.prompt);

                          return (
                            <button
                              key={option.id}
                              className={`prompt-option ${
                                alreadyUsed ? "used-option" : ""
                              }`}
                              onClick={() => handlePromptClick(option)}
                            >
                              {option.prompt}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <aside className="side-panel">
                  <div className="personality-box">
                    <span>CHAT OPTIONS</span>
                  </div>

                  <div className="side-panel-content">
                    <p className="side-title">AVAILABLE PROMPTS</p>

                    {MESSAGE_OPTIONS.map((option) => (
                      <div key={option.id} className="side-prompt">
                        {option.prompt}
                      </div>
                    ))}
                  </div>

                  <div className="personality-selector" ref={personalityRef}>
                    {personalityMenuOpen && (
                      <div className="personality-menu">
                        {(Object.keys(PERSONALITIES) as Personality[]).map(
                          (mode) => (
                            <button
                              key={mode}
                              className={`personality-option ${
                                personality === mode ? "active-personality" : ""
                              }`}
                              onClick={() => handlePersonalitySelect(mode)}
                            >
                              {PERSONALITIES[mode].label}
                            </button>
                          )
                        )}
                      </div>
                    )}

                    <button
                      className="personality-button"
                      onClick={handlePersonalityButtonClick}
                    >
                      {PERSONALITIES[personality].label}
                    </button>
                  </div>
                </aside>
              </div>

              <div className="bottom-strip">
                <div className="bottom-left">Frederick Harden - Details</div>
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
  width: min(88vw, 1180px, calc(78vh * 10 / 9));
  aspect-ratio: 10 / 9;
  height: auto;
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

        .contact-ui {
          position: relative;
          z-index: 3;
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          padding: 0.8rem;
          gap: 0.7rem;
        }

        .topbar {
          min-height: 58px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.2rem 0.45rem 0.45rem;
          border-bottom: 1px solid rgba(114, 255, 159, 0.18);
        }

        .topbar-title {
          font-size: 1.5rem;
          letter-spacing: 0.12em;
          text-shadow:
            0 0 5px rgba(114, 255, 159, 0.5),
            0 0 12px rgba(114, 255, 159, 0.16);
        }

        .topbar-clock {
          font-size: 2.4rem;
          line-height: 1;
          letter-spacing: 0.05em;
          opacity: 0.92;
          text-shadow:
            0 0 8px rgba(114, 255, 159, 0.5),
            0 0 18px rgba(114, 255, 159, 0.14);
        }

        .content-grid {
          flex: 1;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 150px;
          gap: 0.9rem;
          min-height: 0;
        }

        .chat-panel,
        .side-panel {
          border: 1px solid rgba(114, 255, 159, 0.4);
          background:
            linear-gradient(
              to bottom,
              rgba(10, 28, 15, 0.6),
              rgba(4, 16, 8, 0.7)
            );
          box-shadow:
            0 0 18px rgba(114, 255, 159, 0.05),
            inset 0 0 18px rgba(114, 255, 159, 0.035);
          min-height: 0;
        }

        .chat-panel {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .chat-panel-header {
          padding: 0.8rem 1rem;
          border-bottom: 1px solid rgba(114, 255, 159, 0.28);
          font-size: 1.25rem;
          letter-spacing: 0.08em;
          text-align: center;
          text-shadow:
            0 0 5px rgba(114, 255, 159, 0.45),
            0 0 10px rgba(114, 255, 159, 0.12);
        }

        .chat-scroll {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          padding: 1rem 0.9rem;
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
          scrollbar-width: thin;
          scrollbar-color: rgba(114, 255, 159, 0.4) rgba(0, 0, 0, 0.15);
        }

        .chat-scroll::-webkit-scrollbar {
          width: 8px;
        }

        .chat-scroll::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.18);
        }

        .chat-scroll::-webkit-scrollbar-thumb {
          background: rgba(114, 255, 159, 0.25);
          border: 1px solid rgba(114, 255, 159, 0.25);
        }

        .message-row {
          display: flex;
          width: 100%;
        }

        .received-row {
          justify-content: flex-start;
        }

        .sent-row {
          justify-content: flex-end;
        }

        .message-bubble {
          max-width: min(72%, 420px);
          padding: 0.7rem 0.8rem;
          border: 1px solid rgba(114, 255, 159, 0.34);
          font-size: 1.25rem;
          line-height: 1.6;
          letter-spacing: 0.06em;
          text-shadow:
            0 0 5px rgba(114, 255, 159, 0.38),
            0 0 10px rgba(114, 255, 159, 0.08);
          word-break: break-word;
        }

        .received-bubble {
          background: rgba(114, 255, 159, 0.05);
          box-shadow: inset 0 0 12px rgba(114, 255, 159, 0.025);
        }

        .sent-bubble {
          background: rgba(114, 255, 159, 0.1);
          box-shadow:
            0 0 12px rgba(114, 255, 159, 0.04),
            inset 0 0 12px rgba(114, 255, 159, 0.04);
          text-align: left;
        }

        .input-bar-area {
          position: relative;
          display: grid;
          grid-template-columns: 780px 1fr;
          gap: 0.85rem;
          align-items: center;
          padding: 0.8rem;
          border-top: 1px solid rgba(114, 255, 159, 0.28);
          background: rgba(0, 0, 0, 0.12);
        }

        .fake-input {
          height: 42px;
          border: 1px solid rgba(114, 255, 159, 0.38);
          background: rgba(114, 255, 159, 0.05);
          color: #85ffaf;
          font-family: "Glixels", sans-serif;
          font-size: 1.25rem;
          letter-spacing: 0.06em;
          cursor: pointer;
          text-shadow:
            0 0 5px rgba(114, 255, 159, 0.42),
            0 0 10px rgba(114, 255, 159, 0.08);
        }

        .fake-input:hover {
          background: rgba(114, 255, 159, 0.085);
        }

        .prompt-menu {
          position: absolute;
          left: 0.8rem;
          bottom: calc(100% + 8px);
          width: min(420px, calc(100% - 1.6rem));
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
          z-index: 20;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .prompt-option {
          width: 100%;
          border: 1px solid transparent;
          background: transparent;
          color: #85ffaf;
          font-family: "Glixels", sans-serif;
          font-size: 1.1rem;
          text-align: left;
          padding: 0.7rem;
          cursor: pointer;
          letter-spacing: 0.04em;
          text-shadow:
            0 0 5px rgba(114, 255, 159, 0.42),
            0 0 10px rgba(114, 255, 159, 0.08);
        }

        .prompt-option:hover {
          border-color: rgba(114, 255, 159, 0.3);
          background: rgba(114, 255, 159, 0.06);
        }

        .used-option {
          opacity: 0.72;
        }

        .side-panel {
          display: flex;
          flex-direction: column;
          overflow: visible;
          position: relative;
        }

        .personality-box {
          min-height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.8rem;
          border-bottom: 1px solid rgba(114, 255, 159, 0.28);
          text-align: center;
          font-size: 1.5rem;
          letter-spacing: 0.05em;
          text-shadow:
            0 0 5px rgba(114, 255, 159, 0.42),
            0 0 10px rgba(114, 255, 159, 0.08);
        }

        .side-panel-content {
          flex: 1;
          overflow-y: auto;
          padding: 0.9rem 0.8rem;
          font-size: 0.78rem;
          line-height: 1.5;
          letter-spacing: 0.04em;
          text-shadow:
            0 0 5px rgba(114, 255, 159, 0.38),
            0 0 10px rgba(114, 255, 159, 0.06);
        }

        .side-panel-content p {
          margin: 0 0 0.8rem;
        }

        .side-title {
          opacity: 0.85;
        }

        .side-prompt {
          padding: 0.45rem 0;
          border-bottom: 1px solid rgba(114, 255, 159, 0.12);
          word-break: break-word;
        }

        .personality-selector {
          position: relative;
          padding: 0.8rem;
          border-top: 1px solid rgba(114, 255, 159, 0.18);
          background: rgba(0, 0, 0, 0.12);
        }

        .personality-button {
          width: 100%;
          min-height: 42px;
          border: 1px solid rgba(114, 255, 159, 0.38);
          background: rgba(114, 255, 159, 0.05);
          color: #85ffaf;
          font-family: "Glixels", sans-serif;
          font-size: 0.8rem;
          letter-spacing: 0.05em;
          cursor: pointer;
          text-align: center;
          text-shadow:
            0 0 5px rgba(114, 255, 159, 0.42),
            0 0 10px rgba(114, 255, 159, 0.08);
        }

        .personality-button:hover {
          background: rgba(114, 255, 159, 0.085);
        }

        .personality-menu {
          position: absolute;
          left: 0.8rem;
          right: 0.8rem;
          bottom: calc(100% + 8px);
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
          z-index: 25;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .personality-option {
          width: 100%;
          border: 1px solid transparent;
          background: transparent;
          color: #85ffaf;
          font-family: "Glixels", sans-serif;
          font-size: 0.76rem;
          text-align: left;
          padding: 0.65rem 0.55rem;
          cursor: pointer;
          letter-spacing: 0.04em;
          text-shadow:
            0 0 5px rgba(114, 255, 159, 0.42),
            0 0 10px rgba(114, 255, 159, 0.08);
        }

        .personality-option:hover {
          border-color: rgba(114, 255, 159, 0.3);
          background: rgba(114, 255, 159, 0.06);
        }

        .active-personality {
          background: rgba(114, 255, 159, 0.08);
          border-color: rgba(114, 255, 159, 0.24);
        }

        .bottom-strip {
          min-height: 42px;
          display: grid;
          grid-template-columns: 140px 1fr;
          gap: 0.85rem;
          align-items: center;
          padding: 0 0.55rem;
          border: 1px solid rgba(114, 255, 159, 0.35);
          background: rgba(114, 255, 159, 0.035);
        }

        .bottom-left,
        .bottom-right {
          font-size: 0.82rem;
          letter-spacing: 0.04em;
          text-shadow:
            0 0 5px rgba(114, 255, 159, 0.38),
            0 0 10px rgba(114, 255, 159, 0.06);
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

          .content-grid {
            grid-template-columns: 1fr;
          }

          .side-panel {
            display: none;
          }

          .topbar-clock {
            font-size: 2rem;
          }
        }

        @media (max-width: 560px) {
          .topbar {
            padding: 0.15rem 0.35rem 0.4rem;
          }

          .topbar-title {
            font-size: 0.9rem;
          }

          .topbar-clock {
            font-size: 1.4rem;
          }

          .message-bubble {
            max-width: 85%;
            font-size: 0.8rem;
          }

          .input-bar-area,
          .bottom-strip {
            grid-template-columns: 1fr;
          }

          .fake-input {
            width: 100%;
          }

          .prompt-menu {
            left: 0.5rem;
            width: calc(100% - 1rem);
          }
        }
      `}</style>
    </>
  );
}