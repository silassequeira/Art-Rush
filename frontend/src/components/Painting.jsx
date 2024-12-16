import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PaintingService from "../services/paintingService";

const PaintingsGrid = () => {
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function fetchPaintings() {
      try {
        const result = await PaintingService.getPaintings({
          page: 1,
          limit: 10,
        });

        if (result.success) {
          setPaintings(result.paintings);

          // Check for scrollToPaintingId in location.state
          const scrollToPaintingId = location.state?.scrollToPaintingId;

          if (scrollToPaintingId) {
            setTimeout(() => {
              const element = document.getElementById(
                `painting-${scrollToPaintingId}`
              );
              if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            }, 100); // Delay for smooth rendering
          }
        } else {
          setError(result.error || "Failed to fetch paintings.");
        }
      } catch {
        setError("An unexpected error occurred while fetching paintings.");
      } finally {
        setLoading(false);
      }
    }

    fetchPaintings();
  }, [location.state]); // Re-run when location.state changes

  const handlePaintingClick = (painting) => {
    navigate(`/painting/${painting.ObjectId}`, {
      state: { painting }, // Pass painting details to detail page
    });
  };

  if (loading) return <div>Loading Paintings...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {paintings.map((painting) => (
        <div
          id={`painting-${painting.ObjectId}`}
          className="imageContainer"
          key={painting.ObjectId}
          onClick={() => handlePaintingClick(painting)}
          style={{ cursor: "pointer" }}
        >
          <div className="text flex paddingLeftRightSmall">
            <h6>{painting.artistDisplayName}</h6>
            <div className="flex">
              <h6 className="greyColor lessMarginRight">
                {painting.objectDate}
              </h6>
              <h6 className="greyColor">{painting.medium}</h6>
            </div>
          </div>
          <div className="imageContainer relative">
            <img src={painting.primaryImageSmall} alt={painting.title} />
            <div className="title-container">
              <h5 className="text textShadow">{painting.title}</h5>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default PaintingsGrid;
