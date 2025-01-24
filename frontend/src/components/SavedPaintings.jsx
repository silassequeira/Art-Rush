import InteractionService from "../services/interactionService";
import { useAuth } from "../services/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PaintingItem from "./PaintingItem";
import PropTypes from "prop-types";
import Filters from "../components/Filters";

const SavedPaintings = ({ userId, maxPaintings, interactionType, layout }) => {
  const [paintings, setPaintings] = useState([]);
  const [filteredPaintings, setFilteredPaintings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNationality, setSelectedNationality] = useState("");
  const [selectedMedium, setSelectedMedium] = useState("");
  const [selectedArtist, setSelectedArtist] = useState("");
  const { user } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedPaintings = async () => {
      try {
        if (!user) {
          setLoading(true);
        } else {
          const response = await new Promise((resolve, reject) => {
            InteractionService.getSavedPaintings(userId)
              .then(resolve)
              .catch(reject);
          });

          // Ensure response.data is an array
          if (response.success && Array.isArray(response.data)) {
            setPaintings(response.data);
            setFilteredPaintings(response.data);
          } else {
            console.error("Expected an array but got:", response);
            setError("Unexpected response format");
          }
        }
      } catch (error) {
        console.error("Error fetching saved paintings:", error);
        setError("Error fetching saved paintings");
      } finally {
        setLoading(false);
      }
    };

    const fetchFavoritePaintings = async () => {
      try {
        if (!user) {
          setLoading(true);
        } else {
          const response = await new Promise((resolve, reject) => {
            InteractionService.getFavoritePaintings(userId)
              .then(resolve)
              .catch(reject);
          });

          // Ensure response.data is an array
          if (response.success && Array.isArray(response.data)) {
            setPaintings(response.data);
          } else {
            console.error("Expected an array but got:", response);
            setError("Unexpected response format");
          }
        }
      } catch (error) {
        console.error("Error fetching saved paintings:", error);
        setError("Error fetching saved paintings");
      } finally {
        setLoading(false);
      }
    };

    if (userId && interactionType === "saved") {
      fetchSavedPaintings();
    } else if (userId && interactionType === "favorite") {
      fetchFavoritePaintings();
    } else {
      setLoading(true);
    }
  }, [userId, user, interactionType]);

  useEffect(() => {
    if (selectedNationality === "") {
      setFilteredPaintings(paintings);
    } else {
      const filtered = paintings.filter(
        (painting) => painting?.artistNationality === selectedNationality
      );
      setFilteredPaintings(filtered);
    }
  }, [selectedNationality, paintings]);

  useEffect(() => {
    if (selectedMedium === "") {
      setFilteredPaintings(paintings);
    } else {
      const filtered = paintings.filter(
        (painting) => painting?.medium === selectedMedium
      );
      setFilteredPaintings(filtered);
    }
  }, [selectedMedium, paintings]);

  useEffect(() => {
    console.log("Selected artist:", selectedArtist);
    if (selectedArtist === "") {
      setFilteredPaintings(paintings);
    } else {
      const filtered = paintings.filter(
        (painting) => painting?.artistDisplayName === selectedArtist
      );
      console.log("Filtered paintings by artist:", filtered);
      setFilteredPaintings(filtered);
    }
  }, [selectedArtist, paintings]);

  const handleNationalityChange = (nationality) => {
    setSelectedNationality(nationality);
  };

  const handleMediumChange = (medium) => {
    setSelectedMedium(medium);
  };

  const handleArtistChange = (artist) => {
    console.log("Artist changed to:", artist);
    setSelectedArtist(artist);
  };

  // Handle painting click navigation
  const handlePaintingClick = (painting) => {
    navigate(`/painting/${painting._id}`, {
      state: { painting },
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

  if (!userId) {
    return <div>No user ID provided</div>;
  }

  // Limit the number of paintings displayed based on maxPaintings
  const displayedPaintings = maxPaintings
    ? paintings.slice(0, maxPaintings)
    : paintings;

  if (layout === "columns") {
    return (
      <div className="columnResponsive marginTop">
        {displayedPaintings.map((painting) => (
          <PaintingItem
            key={painting._id}
            painting={painting}
            handlePaintingClick={() => handlePaintingClick(painting)}
            onImageLoad={handleImageLoad}
            interactionType={"favorite"}
          />
        ))}
      </div>
    );
  } else if (layout === "restrictive") {
    return (
      <div className="restrictiveGrid marginTop">
        {displayedPaintings.map((painting) => (
          <PaintingItem
            key={painting._id}
            painting={painting}
            handlePaintingClick={() => handlePaintingClick(painting)}
            onImageLoad={handleImageLoad}
            interactionType={"favorite"}
          />
        ))}
      </div>
    );
  } else if (layout === "flex") {
    return (
      <div className="flexCenter">
        {displayedPaintings.map((painting) => (
          <PaintingItem
            key={painting._id}
            painting={painting}
            handlePaintingClick={() => handlePaintingClick(painting)}
            onImageLoad={handleImageLoad}
            interactionType={"favorite"}
          />
        ))}
      </div>
    );
  } else if (layout === "saved") {
    return (
      <>
        <Filters
          userId={userId}
          onNationalityChange={handleNationalityChange}
          onMediumChange={handleMediumChange}
          onArtistChange={handleArtistChange}
        />
        <div className="columnResponsive marginTop">
          {filteredPaintings.map((painting) => (
            <PaintingItem
              key={painting._id}
              painting={painting}
              handlePaintingClick={() => handlePaintingClick(painting)}
              onImageLoad={handleImageLoad}
              interactionType={"favorite"}
            />
          ))}
        </div>
      </>
    );
  } else if (layout === "favorite") {
    return (
      <>
        <div className="columnResponsive marginTop">
          {filteredPaintings.map((painting) => (
            <PaintingItem
              key={painting._id}
              painting={painting}
              handlePaintingClick={() => handlePaintingClick(painting)}
              onImageLoad={handleImageLoad}
              interactionType={"favorite"}
            />
          ))}
        </div>
      </>
    );
  }
};

SavedPaintings.propTypes = {
  userId: PropTypes.string.isRequired,
  maxPaintings: PropTypes.number,
  interactionType: PropTypes.string.isRequired,
  layout: PropTypes.string.isRequired,
};

export default SavedPaintings;
