import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext"; // Corrected import path
import AuthService from "../services/authService";
import "../App.css";
import "../index.css";

function EditProfile() {
  const navigate = useNavigate();

  const { logout } = useAuth(); // Destructure user and logout from useAuth

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
        fullname: formData.fullName, // Note: fullname (lowercase)
      };

      const response = await AuthService.signup(userData);

      if (response.success) {
        alert("Registro bem-sucedido!");
        navigate("/login");
      } else {
        // Handle unsuccessful signup
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
      <div className="close-container" onClick={() => navigate("/profile")}>
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

      <h2>Edit Profile</h2>
      <form className="flex alignItemsLeft column" onSubmit={handleSignup}>
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

        <div className="form-buttons centeredMarginTop spaceEvenly fullWidth">
          <a
            onClick={() => {
              logout(); // Use logout from context
            }}
            className="button buttonBorder"
          >
            Delete Account
          </a>
          <button className="buttonGrey" type="submit" id="SaveSubmit">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
