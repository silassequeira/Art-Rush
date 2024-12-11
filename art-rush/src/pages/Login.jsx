import React from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

function Login() {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/register");
  };
  return (
    <div className="modal spaceBetweenFlex column" id="loginForm">
      <h2>Welcome to Art Rush</h2>
      <form>
        <label htmlFor="loginUser">Username or E-mail</label>
        <input type="text" id="loginUser" required />

        <label htmlFor="loginPassword">Password</label>
        <input type="password" id="loginPassword" required />

        <div className="form-buttons">
          <a
            className="underline greyDark"
            id="goToLogin"
            onClick={handleNavigation}
          >
            Don't have an Art Rush account? - Sign up 
          </a>
          <button type="button" id="loginSubmit">
            Log in
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
