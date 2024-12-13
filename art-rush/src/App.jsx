import { useState } from "react";
import "./App.css";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home />;
      case "login":
        return <Login />;
      case "Signup":
        return <Signup />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="app-container">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="page-content">{renderPage()}</main>
      <div className="home columnResponsive">
        <img
          src="/images/image1.jpeg"
          alt="Image 1"
          style={{ width: "300px" }}
        />
        <img
          src="/images/image2.jpg"
          alt="Image 2"
          style={{ width: "300px" }}
        />
        <img
          src="/images/image3.jpg"
          alt="Image 3"
          style={{ width: "300px" }}
        />
        <img
          src="/images/image4.jpg"
          alt="Image 4"
          style={{ width: "300px" }}
        />
      </div>
    </div>
  );
}

export default App;
