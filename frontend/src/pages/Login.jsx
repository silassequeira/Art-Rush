import AuthService from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../index.css";
import "../App.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await AuthService.login(
        formData.username,
        formData.password
      );

      if (response.success) {
        // Force a page reload to update the layout
        window.location.href = "/";
      } else {
        setError(response.error);
      }
    } catch {
      setError("Erro no login");
    }
  };

  const handleNavigation = () => {
    navigate("/signup");
  };

  return (
    <div className="modal flex spaceEvenly column padding" id="loginForm">
      <div className="close-container" onClick={() => navigate("/")}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="close-svg"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </div>

      <form
        className="column centeredMarginTop justifyStart padding"
        onSubmit={handleLogin}
      >
        <h2>Welcome to Art Rush</h2>
        <div className="flex column centered ">
          <label htmlFor="username">Username or E-mail</label>
          <input
            type="text"
            id="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />

          {error && <p className="error">{error}</p>}

          <div className="form-buttons inlineFlex marginTop">
            <a
              className="underline greyDark"
              id="goToSignup"
              onClick={handleNavigation}
            >
              Don&apos;t have an account? - Sign up
            </a>
            <button type="submit" id="loginSubmit">
              Log in
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
