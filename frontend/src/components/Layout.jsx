import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../services/AuthContext";
import NavMenu from "./NavMenu";
import "../index.css";
import "../App.css";

function Layout() {
  const { user } = useAuth();
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
            {user ? (
              <>
                <NavMenu />
              </>
            ) : (
              // Not-logged-in user view
              <>
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
                    isActive
                      ? "active signup button buttonBorder"
                      : "signup button buttonBorder"
                  }
                >
                  Signup
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
