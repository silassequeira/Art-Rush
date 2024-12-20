import Router, { Route, Routes } from "react-router-dom";
import { AuthProvider } from "../services/AuthContext";
import PaintingDetail from "../pages/PaintingDetail";
import EditProfile from "../pages/EditProfile";
import Favorites from "../pages/Favorites";
import NotFound from "../pages/NotFound";
import Profile from "../pages/Profile";
import Signup from "../pages/Signup";
import Saved from "../pages/Saved";
import Login from "../pages/Login";
import Home from "../pages/Home";

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
