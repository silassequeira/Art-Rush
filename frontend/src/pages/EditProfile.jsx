import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/authService";
import { useAuth } from "../services/AuthContext";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();
  const { logout } = useAuth();

  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    password: "",
    fullName: currentUser?.fullName || "",
  });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const updateData = {
        username: formData.username,
        fullName: formData.fullName,
      };

      if (formData.password.trim()) {
        updateData.password = formData.password;
      }

      await AuthService.updateProfile(updateData);
      navigate("/profile");
      window.location.reload();
    } catch (err) {
      setError(err.error || "Error updating profile");
      console.error("Profile update error:", err);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await AuthService.deleteAccount(currentUser.username);
    } catch (err) {
      setError(err.error || "Error deleting account");
      console.error("Account deletion error:", err);
    }
  };

  return (
    <div className="modal flex spaceEvenly column padding" id="SignupForm">
      <div
        className="close-container"
        onClick={() => {
          navigate("/profile");
        }}
      >
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
        onSubmit={handleSaveProfile}
      >
        <h2>Edit Profile</h2>
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
          placeholder="Leave blank to keep current password..."
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
          <button
            type="button"
            className="button buttonBorder greyDark"
            onClick={() => {
              handleDeleteAccount();
              logout();
              navigate("/");
              window.location.reload();
            }}
          >
            Delete Account
          </button>
          <button className="button buttonGrey" type="submit" id="SaveSubmit">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
