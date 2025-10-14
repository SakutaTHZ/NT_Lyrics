// components/GlitchEffect.jsx
import { useEffect } from "react";
import PropTypes from "prop-types";

const GLITCH_CSS = `
.glitch-active {
  background-color: #000 !important;
  overflow: hidden;
  animation: glitch-anim 1.5s linear infinite;
  filter: url(#glitch-filter);
}
@keyframes glitch-anim {
  0%, 100% { transform: translate(0); }
  2% { transform: translate(-2px, 2px); }
  4% { transform: translate(-2px, -2px); }
  6% { transform: translate(2px, 2px); }
  8% { transform: translate(2px, -2px); }
  10% { transform: translate(0); }
  10.1% { opacity: 0.1; }
  10.2% { opacity: 1; }
  10.3% { transform: scale(1.02); }
  10.4% { transform: scale(1.0); }
  90%, 100% { transform: translate(0); }
}
.glitch-active button {
  pointer-events: none;
  box-shadow: 0 0 20px #ff00ff, inset 0 0 10px #00ffff;
}
`;

const GlitchEffect = ({ active }) => {
  useEffect(() => {
    const html = document.documentElement;
    if (active) html.classList.add("glitch-active");
    else html.classList.remove("glitch-active");

    return () => html.classList.remove("glitch-active");
  }, [active]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLITCH_CSS }} />
      <svg className="absolute w-0 h-0 pointer-events-none">
        <filter id="glitch-filter">
          <feOffset in="SourceGraphic" dx="1.5" dy="1.5" result="R" />
          <feOffset in="SourceGraphic" dx="-1.5" dy="-1.5" result="G" />
          <feOffset in="SourceGraphic" dx="0" dy="0" result="B" />
          <feColorMatrix
            in="R"
            mode="matrix"
            values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
            result="R_CH"
          />
          <feColorMatrix
            in="G"
            mode="matrix"
            values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0"
            result="G_CH"
          />
          <feColorMatrix
            in="B"
            mode="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0"
            result="B_CH"
          />
          <feBlend mode="screen" in="R_CH" in2="G_CH" result="RG_CH" />
          <feBlend mode="screen" in="RG_CH" in2="B_CH" result="final" />
        </filter>
      </svg>
    </>
  );
};

GlitchEffect.propTypes = {
  active: PropTypes.bool.isRequired,
};

export default GlitchEffect;
