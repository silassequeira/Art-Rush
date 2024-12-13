import { NavLink, Outlet } from "react-router-dom";
import "../App.css";
import "../index.css";

function Layout() {
  return (
    <>
      <header>
        <nav className="flex padding">
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
                isActive
                  ? "active button buttonPurple marginRight"
                  : "button buttonPurple marginRight"
              }
            >
              Log In
            </NavLink>
            <NavLink
              to="/signup"
              className={({ isActive }) =>
                isActive ? "active button buttonBorder" : "button buttonBorder"
              }
            >
              signup
            </NavLink>
          </div>
        </nav>
      </header>

      <Outlet />
    </>
  );
}

export default Layout;
