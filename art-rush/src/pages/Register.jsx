import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/authService";
import "../index.css";

function Register() {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/login");
  };

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await AuthService.signup(formData);
      // Show success message
      alert("Registro bem-sucedido!");
      // Redirect to login
      navigate("/login");
    } catch (error) {
      // Handle signup error
      setError(error.error || "Erro no registro");
    }
  };

  return (
    <div className="modal spaceBetweenFlex column" id="signupForm">
      <h2>Create your account</h2>
      <form>
        <label htmlFor="signupUser">Username or Email</label>
        <input type="text" id="signupUser" required />

        <label htmlFor="signupPassword">Password</label>
        <input type="password" id="signupPassword" required />

        <label>First and Last Name</label>
        <div>
          <input
            type="text"
            id="firstName"
            placeholder="e.g: John Doe..."
            required
          />
        </div>

        <div>
          <a
            className="underline greyDark"
            id="goToLogin"
            onClick={handleNavigation}
          >
            I already have an account - Log in
          </a>
          <button type="button" id="signupSubmit">
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
