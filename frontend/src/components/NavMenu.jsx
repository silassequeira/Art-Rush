import { useAuth } from "../services/AuthContext";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import SavedPaintings from "./SavedPaintings";

const NavMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  let timeoutId;

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setIsOpen(false);
    }, 300); // Adjust the timeout duration as needed
  };

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setIsOpen(true);
  };

  if (!user) return null;

  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        className={`hamburger-menu ${
          isOpen ? "active hamburger-menu" : "hamburger-menu"
        }`}
        style={{ cursor: "pointer" }}
      >
        <div
          className="flex borderAround borderHover"
          onMouseEnter={handleMouseEnter}
        >
          <input
            id="burger"
            type="checkbox"
            checked={isOpen}
            onChange={handleToggle}
            className="burger-checkbox"
          />
          <div className="imgRound favorite">
            <SavedPaintings
              userId={user._id}
              maxPaintings={1}
              interactionType={"favorite"}
              layout={"flex"}
            />
          </div>
          <label className="burger-username">
            {user.fullName.split(" ")[0]}
          </label>
          <label
            htmlFor="burger"
            className={`burgerContainer `}
            onMouseLeave={handleMouseLeave}
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

        <div
          className={`nav-menu ${isOpen ? "open" : ""}`}
          onMouseLeave={handleMouseLeave}
        >
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
            onClick={() => setIsOpen(false)}
          >
            Edit Profile
          </NavLink>
          <NavLink
            to="/"
            onClick={() => {
              logout();
              handleClose();
            }}
            className="purple logout"
          >
            Logout
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default NavMenu;
