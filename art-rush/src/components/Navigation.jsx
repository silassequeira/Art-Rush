import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "../App.css";
import "../index.css";

import Modal from "./Modal";
import Layout from "./Layout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import NotFound from "../pages/NotFound";

function Navigation() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          <Route
            path="login"
            element={
              <Modal>
                <Login />
              </Modal>
            }
          />
          <Route
            path="signup"
            element={
              <Modal>
                <Signup />
              </Modal>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default Navigation;
