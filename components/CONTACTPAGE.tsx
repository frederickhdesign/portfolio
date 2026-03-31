export default function CONTACTPAGE() {
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
      `}</style>

      <div className="wrapper">
        <div className="crt-frame">
          <div className="crt-screen">
            <h1>CONTACT DETAILS</h1>
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

        /* =========================
           CRT FRAME — retro low-poly plastic
        ========================= */
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
            inset 2px 2px 0 rgba(255,255,255,0.08),
            inset -3px -5px 0 rgba(0,0,0,0.5),
            0 18px 30px rgba(0,0,0,0.38);
        }

        /* angular outer lighting */
        .crt-frame::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;

          background:
            linear-gradient(
              135deg,
              rgba(255,255,255,0.14) 0%,
              rgba(255,255,255,0.08) 10%,
              transparent 22%
            ),
            linear-gradient(
              to right,
              rgba(255,255,255,0.04) 0%,
              transparent 12%,
              transparent 88%,
              rgba(0,0,0,0.22) 100%
            ),
            linear-gradient(
              to bottom,
              rgba(255,255,255,0.05) 0%,
              transparent 16%,
              transparent 84%,
              rgba(0,0,0,0.35) 100%
            ),
            repeating-linear-gradient(
              45deg,
              rgba(255,255,255,0.012) 0px,
              rgba(255,255,255,0.012) 2px,
              rgba(0,0,0,0.012) 2px,
              rgba(0,0,0,0.012) 4px
            );

          mix-blend-mode: screen;
        }

        /* chunky inner bezel / inset shell */
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
              rgba(255,255,255,0.08) 0%,
              rgba(255,255,255,0.025) 18%,
              transparent 30%
            );

          box-shadow:
            inset 6px 6px 10px rgba(0,0,0,0.55),
            inset -2px -2px 4px rgba(255,255,255,0.03),
            inset 0 0 0 2px rgba(0,0,0,0.35);
        }

        /* =========================
           CRT SCREEN
        ========================= */
        .crt-screen {
          width: min(80vw, 1000px);
          height: min(65vh, 900px);

          background: radial-gradient(
            ellipse at center,
            #2a2a2a 0%,
            #1a1a1a 70%,
            #0d0d0d 100%
          );

          display: flex;
          justify-content: center;
          align-items: center;

          position: relative;
          overflow: hidden;

          font-family: "Glixels", sans-serif;

          box-shadow:
            inset 0 0 60px rgba(0,0,0,0.9),
            inset 0 0 20px rgba(255,255,255,0.05);
        }

        h1 {
          position: relative;
          z-index: 2;
          margin: 0;
          font-family: "Glixels", sans-serif;
          font-size: clamp(4rem, 10vw, 9rem);
          color: #e8e8e8;
          letter-spacing: 0.05em;

          text-shadow:
            0 0 6px rgba(255,255,255,0.2),
            0 0 20px rgba(255,255,255,0.1);
        }

        .crt-screen::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;

          background: radial-gradient(
            ellipse at center,
            transparent 62%,
            rgba(0,0,0,0.18) 82%,
            rgba(0,0,0,0.42) 100%
          );
        }

        .crt-screen::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;

          background: repeating-linear-gradient(
            to bottom,
            rgba(255,255,255,0.03) 0px,
            rgba(255,255,255,0.03) 1px,
            transparent 2px,
            transparent 4px
          );
        }
      `}</style>
    </>
  );
}