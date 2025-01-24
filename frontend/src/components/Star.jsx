import PropTypes from "prop-types";
import "../App.css";
import { useState, useEffect } from "react";

function Star({ initialFilled, onToggle, disabled = false }) {
  const [filled, setFilled] = useState(initialFilled);

  useEffect(() => {
    setFilled(initialFilled);
  }, [initialFilled]);

  const toggleStar = () => {
    if (disabled) return;

    setFilled((prevFilled) => !prevFilled);
    onToggle();
  };

  const star = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="31"
      height="30"
      viewBox="0 0 31 30"
      fill="black"
      style={{
        opacity: disabled ? 0.3 : 0.5,
        transition: "opacity 0.2s ease",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <path
        d="M19.0747 9.26036L19.075 9.26082C19.4494 10.0155 20.1705 10.5344 21.0002 10.6548L21.0009 10.655L28.9808 11.8092L23.2112 17.4069L23.211 17.4071C22.6077 17.9927 22.3297 18.8389 22.473 19.6707C22.473 19.6707 22.473 19.6707 22.473 19.6707L23.8364 27.5837L16.6886 23.8432C16.6884 23.8431 16.6882 23.843 16.688 23.8429C15.9441 23.4534 15.0559 23.4534 14.312 23.8429C14.3118 23.843 14.3116 23.8431 14.3114 23.8432L7.16326 27.5837L8.52664 19.6707C8.52664 19.6707 8.52665 19.6707 8.52665 19.6707C8.66997 18.8389 8.39199 17.9927 7.78869 17.4071L7.7885 17.4069L2.01916 11.8089L9.9984 10.6547C9.99862 10.6547 9.99884 10.6546 9.99906 10.6546C10.8305 10.5345 11.5511 10.014 11.925 9.26048L11.9253 9.26004L15.5 2.05021L19.0747 9.26036ZM29.878 11.939C29.8778 11.9389 29.8775 11.9389 29.8773 11.9389L29.8779 11.939L29.878 11.939ZM24.6266 27.9972C24.6269 27.9974 24.6272 27.9975 24.6274 27.9976L24.6266 27.9972ZM7.01036 28.4711L7.01041 28.4708L7.01036 28.4711ZM1.12199 11.9386L1.1221 11.9386L1.12199 11.9386ZM15.105 1.25352L15.105 1.25361L15.105 1.25352Z"
        stroke="white"
        strokeWidth="3"
        strokeMiterlimit="10"
      />
    </svg>
  );

  const starFill = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="31"
      height="30"
      viewBox="0 0 31 30"
      fill="none"
      style={{
        opacity: disabled ? 0.5 : 1,
        transition: "opacity 0.2s ease",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <path
        d="M19.0747 9.26036L19.075 9.26082C19.4494 10.0155 20.1705 10.5344 21.0002 10.6548L21.0009 10.655L28.9808 11.8092L23.2112 17.4069L23.211 17.4071C22.6077 17.9927 22.3297 18.8389 22.473 19.6707C22.473 19.6707 22.473 19.6707 22.473 19.6707L23.8364 27.5837L16.6886 23.8432C16.6884 23.8431 16.6882 23.843 16.688 23.8429C15.9441 23.4534 15.0559 23.4534 14.312 23.8429C14.3118 23.843 14.3116 23.8431 14.3114 23.8432L7.16326 27.5837L8.52664 19.6707C8.52664 19.6707 8.52665 19.6707 8.52665 19.6707C8.66997 18.8389 8.39199 17.9927 7.78869 17.4071L7.7885 17.4069L2.01916 11.8089L9.9984 10.6547C9.99862 10.6547 9.99884 10.6546 9.99906 10.6546C10.8305 10.5345 11.5511 10.014 11.925 9.26048L11.9253 9.26004L15.5 2.05021L19.0747 9.26036ZM29.878 11.939C29.8778 11.9389 29.8775 11.9389 29.8773 11.9389L29.8779 11.939L29.878 11.939ZM24.6266 27.9972C24.6269 27.9974 24.6272 27.9975 24.6274 27.9976L24.6266 27.9972ZM7.01036 28.4711L7.01041 28.4708L7.01036 28.4711ZM1.12199 11.9386L1.1221 11.9386L1.12199 11.9386ZM15.105 1.25352L15.105 1.25361L15.105 1.25352Z"
        fill="#FFCC00"
        stroke="#FFCC00"
        strokeWidth="1"
        strokeMiterlimit="10"
      />
    </svg>
  );

  return (
    <div
      className="Star"
      onClick={toggleStar}
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
      {filled ? starFill : star}
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

Star.propTypes = {
  initialFilled: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default Star;
