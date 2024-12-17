import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../services/AuthContext"; // Corrected import path
import PaintingsGrid from "./Painting";

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
    <div
      className={`hamburger-menu ${
        isOpen ? "active hamburger-menu" : "hamburger-menu"
      }`}
    >
      <div className="flex borderAround borderHover">
        <input
          id="burger"
          type="checkbox"
          checked={isOpen}
          onChange={handleToggle}
          className="burger-checkbox"
        />
        <div className="imageContainer imgRound">
          <PaintingsGrid maxPaintings={1} />
        </div>
        <label className="burger-username">
          {user.fullName.split(" ")[0]} {/* Use user from context */}
        </label>
        <label
          htmlFor="burger"
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
        <NavLink
          to="/favorites"
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={handleClose}
        >
          Favorite Artworks
        </NavLink>
        <NavLink
          to="/saved"
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={handleClose}
        >
          Saved Artworks
        </NavLink>
        <NavLink
          to="/editprofile"
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={handleClose}
        >
          Edit Profile
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
