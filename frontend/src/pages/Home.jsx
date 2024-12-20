import PaintingsGrid from "../components/Painting";
import "../index.css";
import "../App.css";

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
