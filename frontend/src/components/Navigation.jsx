import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../services/AuthContext";
import "../index.css";
import "../App.css";

import Layout from "./Layout";
import Modal from "./Modal";

import PaintingDetail from "../pages/PaintingDetail";
import EditProfile from "../pages/EditProfile";
import Favorites from "../pages/Favorites";
import NotFound from "../pages/NotFound";
import Profile from "../pages/Profile";
import Signup from "../pages/Signup";
import Saved from "../pages/Saved";
import Login from "../pages/Login";
import Home from "../pages/Home";

function Navigation() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route
              path="login"
              element={
                <Modal>
                  <Home />
                  <Login />
                </Modal>
              }
            />
            <Route
              path="signup"
              element={
                <Modal>
                  <Home />
                  <Signup />
                </Modal>
              }
            />
            <Route path="profile" element={<Profile />} />
            <Route
              path="editprofile"
              element={
                <Modal>
                  <Profile />
                  <EditProfile />
                </Modal>
              }
            />
            <Route path="favorites" element={<Favorites />} />
            <Route path="saved" element={<Saved />} />
            <Route path="painting/:id" element={<PaintingDetail />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default Navigation;
