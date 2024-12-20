import "../App.css";
import "../index.css";
import PaintingsGrid from "../components/Painting";

function Home() {
  return (
    <div className="home">
      <div className="columnResponsive">
        <PaintingsGrid />
      </div>
    </div>
  );
}

export default Home;
