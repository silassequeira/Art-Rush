import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../services/AuthContext"; // Corrected import path

const NavMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth(); // Destructure user and logout from useAuth

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // If no user, return null or handle accordingly
  if (!user) return null;

  return (
    <div className="hamburger-menu">
      <input
        id="burger"
        type="checkbox"
        checked={isOpen}
        onChange={handleToggle}
        className="burger-checkbox"
      />
      <label
        htmlFor="burger"
        className={`burger-label ${isOpen ? "active" : ""}`}
      >
        {user.fullName.split(" ")[0]} {/* Use user from context */}
      </label>

      {isOpen && <div className="nav-menu-overlay" onClick={handleClose} />}

      <div className={`nav-menu ${isOpen ? "open" : ""}`}>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={handleClose}
        >
          Home
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={handleClose}
        >
          Profile
        </NavLink>
        <a
          onClick={() => {
            logout(); // Use logout from context
            handleClose();
          }}
          className="purple logout"
        >
          Logout
        </a>
      </div>
    </div>
  );
};

export default NavMenu;
