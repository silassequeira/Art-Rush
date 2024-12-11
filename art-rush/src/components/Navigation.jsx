import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "../index.css";

import Modal from "./Modal";
import Layout from "./Layout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
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
            path="register"
            element={
              <Modal>
                <Register />
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
