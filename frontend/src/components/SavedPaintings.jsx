import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import InteractionService from "../services/interactionService";

const SavedPaintings = ({ userId }) => {
  const [SavedPaintings, setSavedPaintings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedPaintings = async () => {
      try {
        console.log(`Fetching saved paintings for userId: ${userId}`);
        const response = await InteractionService.getSavedPaintings(userId);
        console.log("Fetched saved paintings:", response);

        // Ensure response.data is an array
        if (response.success && Array.isArray(response.data)) {
          setSavedPaintings(response.data);
        } else {
          console.error("Expected an array but got:", response);
          setError("Unexpected response format");
        }
      } catch (err) {
        console.error("Error fetching saved paintings:", err);
        setError(err.message || "Error fetching saved paintings");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchSavedPaintings();
    }
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!userId) {
    return <div>No user ID provided</div>;
  }

  return (
    <div className="columnResponsive marginTop">
      {SavedPaintings.map((painting) => (
        <img
          key={painting._id}
          src={painting.primaryImageSmall}
          alt={painting.title}
          loading="lazy"
        />
      ))}
    </div>
  );
};

SavedPaintings.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default SavedPaintings;
