import { useNavigate, useParams, useLocation } from "react-router-dom";
import PaintingService from "../services/paintingService";
import { useAuth } from "../services/AuthContext";
import { useState, useEffect } from "react";

const PaintingDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [painting, setPainting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  //Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const passedPainting = location.state?.painting;

    if (passedPainting) {
      setPainting(passedPainting);
      setLoading(false);
      return;
    }

    // If no painting in state, fetch from service
    async function fetchPaintingDetails() {
      try {
        const result = await PaintingService.getPaintingById(id);

        if (result.success) {
          setPainting(result.painting);
        } else {
          setError(result.error);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPaintingDetails();
  }, [id, location.state]);

  const handleClose = () => {
    navigate("/", {
      state: {
        scrollToPaintingId: id, // Pass the painting ID back for scroll position
      },
    });
  };

  if (loading) return <div>Loading Painting Details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!painting) return <div>No painting found</div>;

  return (
    <div className="padding absolute marginTop">
      <div className="relative padding">
        <div className="close-containerPainting" onClick={handleClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="close-svg"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
        <div className="layoutGrid">
          <img
            src={painting.primaryImage}
            alt={painting.title}
            className="full-image"
          />
          <div className="flex column alignItemsLeft">
            <div>
              <h3>{painting.title}</h3>
              <span className="greyLight centeredMarginTop fullWidth">
                {painting?.artistDisplayName}
              </span>
            </div>
            <div>
              <div className="inlineFlex marginTop">
                <div className="marginRight">
                  <span className="greyColor">Date: </span>
                  <span>{painting?.objectDate || "Unknown"}</span>
                </div>
                <div>
                  <span className="greyColor">Medium:</span>{" "}
                  <span>{painting?.medium}</span>
                </div>
              </div>

              <div>
                <span className="greyColor">Artist Nationality: </span>
                <span>{painting?.artistNationality}</span>
              </div>
              <div>
                <span className="greyColor">Artist Bio: </span>
                <span>{painting?.artistDisplayBio}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaintingDetail;
