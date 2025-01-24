import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const SelectFilter = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="custom-select" ref={dropdownRef}>
      <div
        className={`select-header ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => !isOpen && setHoverIndex(null)}
      >
        <span className="textTruncateLong">{value || "Select an option"}</span>
        <svg
          className={`select-arrow ${isOpen ? "open" : ""}`}
          width="14"
          height="8"
          viewBox="0 0 14 8"
        >
          <path
            d="M1 1L7 7L13 1"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      <div className={`select-dropdown ${isOpen ? "open" : ""}`}>
        {options.map((option, index) => (
          <div
            key={option}
            className={`select-option textTruncateLong ${
              hoverIndex === index ? "hover" : ""
            } ${value === option ? "selected" : ""}`}
            onClick={() => {
              onChange(option);
              setIsOpen(false);
            }}
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
};
SelectFilter.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

export default SelectFilter;
