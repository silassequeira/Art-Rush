import "../App.css";
import PropTypes from "prop-types";

function Heart({ filled }) {
  const heart = (
    <svg
      width="16"
      height="16"
      viewBox="0 0 46 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.5504 20.6933L22.8571 40L42.164 20.6933C44.4371 18.42 45.7143 15.3367 45.7143 12.1218V11.5781C45.7143 5.18371 40.5306 0 34.1363 0C30.6189 0 27.2924 1.59883 25.0952 4.34531L22.8571 7.14286L20.6191 4.34531C18.4219 1.59883 15.0954 0 11.5781 0C5.18371 0 0 5.18371 0 11.5781V12.1218C0 15.3367 1.27711 18.42 3.5504 20.6933Z"
        fill="#D9D9D9"
      />
    </svg>
  );

  const heartFill = (
    <svg
      width="16"
      height="16"
      viewBox="0 0 46 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.5504 20.6933L22.8571 40L42.164 20.6933C44.4371 18.42 45.7143 15.3367 45.7143 12.1218V11.5781C45.7143 5.18371 40.5306 0 34.1363 0C30.6189 0 27.2924 1.59883 25.0952 4.34531L22.8571 7.14286L20.6191 4.34531C18.4219 1.59883 15.0954 0 11.5781 0C5.18371 0 0 5.18371 0 11.5781V12.1218C0 15.3367 1.27711 18.42 3.5504 20.6933Z"
        fill="url(#paint0_linear_25_955)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_25_955"
          x1="0.980392"
          y1="-3.51016"
          x2="54.6278"
          y2="15.3153"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.1" stopColor="#792BBA" />
          <stop offset="0.5" stopColor="#7F00FF" />
        </linearGradient>
      </defs>
    </svg>
  );

  return <div className="Heart">{filled ? heartFill : heart}</div>;
}
Heart.propTypes = {
  filled: PropTypes.bool.isRequired,
};

export default Heart;
