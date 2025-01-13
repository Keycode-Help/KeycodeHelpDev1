import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/kchlp.css";

function Home() {
  const navigate = useNavigate();

  const handleGetStarted = () => navigate("/register");
  const handleRequestKeycode = () => navigate("/vehicle-keycode-request");
  const handleSubscription = () => navigate("/subscriptions");

  return (
    <div>
      {/* Navbar */}
      <nav>
        <p className="sitename">Keycode Help</p>
        <p className="menu" onClick={() => navigate("/services")}>
          Services
        </p>
        <p className="menu" onClick={() => navigate("/pricing")}>
          Pricing
        </p>
        <p className="menu" onClick={() => navigate("/features")}>
          Features
        </p>
        <p className="menu" onClick={() => navigate("/about")}>
          About Us
        </p>
        <svg
          className="material-icons"
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 0 24 24"
          width="24px"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M19 9H5c-.55 0-1 .45-1 1s.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1zM5 15h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1s.45 1 1 1z" />
        </svg>
      </nav>

      {/* Grid Background */}
      <div className="grid">
        <svg
          className="grid-svg"
          xmlns="http://www.w3.org/2000/svg"
          width="982"
          height="786"
          viewBox="0 0 982 786"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M490 401V537H348.5V401H490ZM490 785.5V676H348.5V785.5H347.5V676H206V785.5H205V676H63.5V785.5H62.5V676H0V675H62.5V538H0V537H62.5V401H0V400H62.5V258H0V257H62.5V116H0V115H62.5V0H63.5V115L205 115V0H206V115L347.5 115V0H348.5V115H490V0H491V115L627.5 115V0H628.5V115H765V0H766V115L902.5 115V0H903.5V115H982V116H903.5V257H982V258H903.5V400H982V401H903.5V537H982V538H903.5V675H982V676H903.5V785.5H902.5V676H766V785.5H765V676H628.5V785.5H627.5V676H491V785.5H490Z"
            fill="url(#paint0_radial_1_8)"
          />
          <defs>
            <radialGradient
              id="paint0_radial_1_8"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(491 392.75) rotate(90) scale(513.25 679.989)"
            >
              <stop stopColor="white" stopOpacity="0.2" />
              <stop offset="1" stopColor="#000" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
        <div className="blur"></div>
      </div>

      {/* Title */}
      <div className="title">
        <p>Keycode</p>
        <p>Help</p>
      </div>

      {/* Buttons */}
      <a className="button first" onClick={handleGetStarted}>
        <button>Get Started</button>
        <span></span>
      </a>

      <a className="button sec" onClick={handleRequestKeycode}>
        <button>Request Keycode</button>
        <span></span>
      </a>

      <a className="button third" onClick={handleSubscription}>
        <button>Become Member</button>
        <span></span>
      </a>

      {/* Decorative SVGs */}
      <svg
        className="top-right"
        width="219"
        height="147"
        viewBox="0 0 219 147"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          opacity="0.18"
          x="10.4252"
          y="75.8326"
          width="7.50168"
          height="7.50168"
          transform="rotate(110.283 10.4252 75.8326)"
          fill="#686868"
          stroke="white"
          strokeWidth="1.22683"
        />
      </svg>

      <svg
        className="bottom-left"
        width="232"
        height="191"
        viewBox="0 0 232 191"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="50.5685"
          cy="172.432"
          r="112.068"
          stroke="white"
          strokeOpacity="0.09"
        />
      </svg>
    </div>
  );
}

export default Home;
