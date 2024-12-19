import "../App.css";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Star from "../components/Star";
import { useAuth } from "../services/AuthContext";
import FilterMenu from "../components/FilterMenu";
import SavedPaintings from "../components/SavedPaintings";
import interactionService from "../services/interactionService";

function Saved() {
  const [savedPaintings, setSavedPaintings] = useState([]);
  const { user } = useAuth(); // Destructure user and logout from useAuth
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const fetchSavedPaintings = async () => {
      try {
        const paintings = await interactionService.getSavedPaintings(user._id);
        setSavedPaintings(paintings);
      } catch (error) {
        console.error("Error fetching saved paintings:", error);
      }
    };

    if (user && user._id) {
      fetchSavedPaintings();
    }
  }, [user]);

  const handleApplyFilters = async (newFilters) => {
    setFilters(newFilters);
    try {
      const filteredPaintings =
        await interactionService.getFilteredSavedPaintings(
          user._id,
          newFilters
        );
      setSavedPaintings(filteredPaintings);
    } catch (error) {
      console.error("Error fetching filtered paintings:", error);
    }
  };

  return (
    <>
      <div className="hideElements favorite padding">
        <NavLink className="greyColor margin" to="/profile">
          &lt; Back
        </NavLink>

        <FilterMenu onApplyFilters={handleApplyFilters} />

        <div className="flex column marginTop">
          <div className="inlineFlex fullWidth marginTop">
            <h3>All Saved Artworks</h3>
            <div className="flex button greyColor buttonBorder borderHover">
              <NavLink className="greyLight lessMarginRight" to="/favorites">
                Favorites
              </NavLink>
              <Star className="heart" filled={false} />
            </div>
          </div>
          <div className="marginTop">
            {user && user._id && (
              <SavedPaintings userId={user._id} /> // Pass the user ID as a prop
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Saved;
