import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const SearchableSelect = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [hoverIndex, setHoverIndex] = useState(null);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm(""); // Clear search when closing
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Open dropdown when search term is updated
  useEffect(() => {
    if (searchTerm) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [searchTerm]);

  return (
    <div className="custom-search" ref={dropdownRef}>
      <label>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search Artist..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={(e) => {
            e.stopPropagation(); // Prevent click from propagating to the parent element
          }}
        />
      </label>

      {isOpen && (
        <div className={`select-dropdown ${isOpen ? "open" : ""}`}>
          <div className="options-container">
            {filteredOptions.length === 0 ? (
              <div className="no-results">No matches found</div>
            ) : (
              filteredOptions.map((option, index) => (
                <div
                  key={option}
                  className={`select-option ${
                    hoverIndex === index ? "hover" : ""
                  } ${value === option ? "selected" : ""}`}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  {option}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

SearchableSelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default SearchableSelect;
