import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../services/AuthContext";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Profile from "../pages/Profile";
import EditProfile from "../pages/EditProfile";
import NotFound from "../pages/NotFound";
import Favorites from "../pages/Favorites";
import Saved from "../pages/Saved";
import PaintingDetail from "../pages/PaintingDetail";

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="profile" element={<Profile />} />
          <Route path="editprofile" element={<EditProfile />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="saved" element={<Saved />} />
          <Route path="painting/:id" element={<PaintingDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRoutes;
