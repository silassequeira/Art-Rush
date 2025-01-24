import { useNavigate, useParams, useLocation } from "react-router-dom";
import PaintingService from "../services/paintingService";
import { useAuth } from "../services/AuthContext";
import { useState, useEffect } from "react";
import PaintingItem from "../components/PaintingItem";

const PaintingDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const checkUser = async () => {
      if (!user) {
        setLoading(true);
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, [user, navigate]);

  useEffect(() => {
    const passedPainting = location.state?.painting;

    if (passedPainting) {
      setPaintings(passedPainting);
      setLoading(false);
      return;
    }

    // If no painting in state, fetch from service
    async function fetchPaintingDetails() {
      try {
        const result = await PaintingService.getPaintingById(id);

        if (result.success) {
          setPaintings(result.painting);
        } else {
          setError(result.error);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPaintingDetails();
  }, [id, location.state]);

  const goToLogin = () => {
    navigate("/login");
  };

  const handleClose = () => {
    navigate("/", {
      state: {
        scrollToPaintingId: id, // Pass the painting ID back for scroll position
      },
    });
  };

  const handleImageLoad = (event) => {
    if (!loading) {
      const img = event.target;
      img.classList.add("loaded");
    }
  };

  if (loading) return <div className="loader"></div>;
  if (error) return <div>Error: {error}</div>;
  if (!paintings) return <div>No painting found</div>;

  if (!user) {
    return (
      <>
        <div className="loader"></div>
        <h2
          className="centeredMarginTop greyDark marginTopBig"
          onClick={goToLogin}
        >
          You are not Logged In
        </h2>
      </>
    );
  }

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
        <PaintingItem
          key={paintings._id}
          painting={paintings}
          onImageLoad={handleImageLoad}
          handlePaintingClick={() => {}}
          interactionType={"both"}
        />
      </div>
    </div>
  );
};

export default PaintingDetail;
