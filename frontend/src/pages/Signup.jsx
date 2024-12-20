import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/authService";
import "../App.css";
import "../index.css";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
  });

  const [error, setError] = useState(null);

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
      const userData = {
        username: formData.username,
        password: formData.password,
        fullname: formData.fullName, 
      };

      const response = await AuthService.signup(userData);

      if (response.success) {
        navigate("/login");
      } else {
        setError(response.error || "Erro no registro");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError(
        error?.response?.data?.error || error.message || "Erro no registro"
      );
    }
  };

  return (
    <div className="modal flex spaceEvenly column padding" id="SignupForm">
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
        className="column centeredMarginTop padding"
        onSubmit={handleSignup}
      >
        <h2>Create your account</h2>
        <label htmlFor="username">Username or Email</label>
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

        <label htmlFor="fullName">First and Last Name</label>
        <input
          type="text"
          id="fullName"
          placeholder="e.g: John Doe..."
          value={formData.fullName}
          onChange={handleInputChange}
          required
        />

        {error && <p className="error">{error}</p>}

        <div className="form-buttons inlineFlex marginTop">
          <a
            className="underline greyDark"
            id="goToLogin"
            onClick={() => navigate("/login")}
          >
            I already have an account - Log in
          </a>
          <button className="button buttonGrey" type="submit" id="SignupSubmit">
            Signup
          </button>
        </div>
      </form>
    </div>
  );
}

export default Signup;
