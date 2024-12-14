import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../services/AuthContext";
import "../App.css";
import "../index.css";

import Modal from "./Modal";
import Layout from "./Layout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";

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
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default Navigation;
