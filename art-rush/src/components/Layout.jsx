import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "../index.css";

function Layout() {
  return (
    <>
      <header>
        <nav className="main-navigation">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active logo" : "logo")}
          >
            Art Rush
          </NavLink>
          <div className="auth-links">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "active button buttonPurple" : "button buttonPurple"
              }
            >
              Log In
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                isActive ? "active button buttonBorder" : "button buttonBorder"
              }
            >
              Register
            </NavLink>
          </div>
        </nav>
      </header>

      <Outlet />
    </>
  );
}

export default Layout;
