import "../App.css";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

function Heart({ initialFilled, onToggle, disabled = false }) {
  const [filled, setFilled] = useState(initialFilled);

  useEffect(() => {
    setFilled(initialFilled);
  }, [initialFilled]);

  const toggleHeart = () => {
    if (disabled) return;

    setFilled((prevFilled) => !prevFilled);
    onToggle();
  };

  const heart = (
    <svg
      width="31"
      height="28"
      viewBox="0 0 31 28"
      fill="black"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        opacity: disabled ? 0.3 : 0.5,
        transition: "opacity 0.2s ease",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <path
        d="M8.74617 2C6.93697 2 5.27342 2.6901 4.07751 3.93994C2.72061 5.35847 2 7.42875 2 9.94377C2 11.9681 2.71295 14.0767 4.11584 16.2006C5.21976 17.8799 6.76065 19.5744 8.68484 21.2383C11.9506 24.0677 15.2624 25.8696 15.293 25.885L15.5 26L15.707 25.885C15.707 25.885 19.0571 24.0677 22.3152 21.2383C24.2394 19.5668 25.7802 17.8722 26.8842 16.2006C28.2871 14.0767 29 11.9681 29 9.94377C29 7.43642 28.2794 5.35847 26.9225 3.93994C25.7189 2.6901 24.063 2 22.2462 2C20.6516 2 19.0571 2.53674 17.7768 3.51821C16.7572 4.29265 15.983 5.29712 15.4923 6.47029C15.0017 5.30479 14.2274 4.30032 13.2078 3.51821C11.9276 2.53674 10.333 2 8.7385 2H8.74617Z"
        stroke="white"
        strokeWidth="3"
        strokeMiterlimit="10"
      />
    </svg>
  );

  const heartFill = (
    <svg
      width="31"
      height="28"
      viewBox="0 0 31 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        opacity: disabled ? 0.5 : 1,
        transition: "opacity 0.2s ease",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <path
        d="M8.74617 2C6.93697 2 5.27342 2.6901 4.07751 3.93994C2.72061 5.35847 2 7.42875 2 9.94377C2 11.9681 2.71295 14.0767 4.11584 16.2006C5.21976 17.8799 6.76065 19.5744 8.68484 21.2383C11.9506 24.0677 15.2624 25.8696 15.293 25.885L15.5 26L15.707 25.885C15.707 25.885 19.0571 24.0677 22.3152 21.2383C24.2394 19.5668 25.7802 17.8722 26.8842 16.2006C28.2871 14.0767 29 11.9681 29 9.94377C29 7.43642 28.2794 5.35847 26.9225 3.93994C25.7189 2.6901 24.063 2 22.2462 2C20.6516 2 19.0571 2.53674 17.7768 3.51821C16.7572 4.29265 15.983 5.29712 15.4923 6.47029C15.0017 5.30479 14.2274 4.30032 13.2078 3.51821C11.9276 2.53674 10.333 2 8.7385 2H8.74617Z"
        fill="#792BBA"
        stroke="#792BBA"
        strokeWidth="1"
        strokeMiterlimit="10"
      />
    </svg>
  );

  return (
    <div
      className="Heart"
      onClick={toggleHeart}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4px",
        cursor: disabled ? "not-allowed" : "pointer",
        position: "relative",
      }}
      role="button"
      aria-pressed={filled}
      aria-disabled={disabled}
      title={filled ? "Remove from saved" : "Save painting"}
    >
      {filled ? heartFill : heart}
      {disabled && (
        <span
          className="loading-indicator"
          style={{
            position: "absolute",
            width: "20px",
            height: "20px",
            border: "2px solid transparent",
            borderTopColor: "#792BBA",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}

Heart.propTypes = {
  initialFilled: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default Heart;
