import { useState } from "react";
import PropTypes from "prop-types";

const FilterMenu = ({ onApplyFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    artistDisplayName: "",
    artistNationality: "",
    objectDate: "",
    medium: "",
  });

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    handleClose();
  };

  return (
    <div
      className={`hamburger-menu ${
        isOpen ? "active hamburger-menu" : "hamburger-menu"
      }`}
    >
      <div className="flex borderAround borderHover">
        <input
          id="filter-burger"
          type="checkbox"
          checked={isOpen}
          onChange={handleToggle}
          className="burger-checkbox"
        />
        <label
          htmlFor="filter-burger"
          className={`burger-label ${
            isOpen ? "active burgerContainer" : "burgerContainer"
          }`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 684 484"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M42 42.031H642M42 242.03H642M42 442.03H642"
              stroke="#5A5A5A"
              strokeWidth="83.3333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>{" "}
        </label>
      </div>
      {isOpen && <div className="nav-menu-overlay" onClick={handleClose} />}

      <div className={`nav-menu ${isOpen ? "open" : ""}`}>
        <div className="filter-menu">
          <label>
            Artist Name:
            <input
              type="text"
              name="artistDisplayName"
              value={filters.artistDisplayName}
              onChange={handleChange}
            />
          </label>
          <label>
            Nationality:
            <input
              type="text"
              name="artistNationality"
              value={filters.artistNationality}
              onChange={handleChange}
            />
          </label>
          <label>
            Date:
            <input
              type="text"
              name="objectDate"
              value={filters.objectDate}
              onChange={handleChange}
            />
          </label>
          <label>
            Medium:
            <input
              type="text"
              name="medium"
              value={filters.medium}
              onChange={handleChange}
            />
          </label>
          <button onClick={handleApplyFilters}>Apply Filters</button>
        </div>
      </div>
    </div>
  );
};

FilterMenu.propTypes = {
  onApplyFilters: PropTypes.func.isRequired,
};

export default FilterMenu;
