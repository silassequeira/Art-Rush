import "../App.css";
import "../index.css";
import { NavLink } from "react-router-dom";
import SavedPaintings from "../components/SavedPaintings";
import PaintingsGrid from "../components/Painting";
import { useAuth } from "../services/AuthContext";
import { useEffect, useState } from "react";
import interactionService from "../services/interactionService";

function Profile() {
  const { user } = useAuth(); // Destructure user and logout from useAuth
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    if (user && user._id) {
      const fetchSavedCount = async () => {
        try {
          const count = await interactionService.countSaved(user._id);
          setSavedCount(count);
          console.log(`Count of saved artworks: ${count}`);
        } catch (error) {
          console.error("Error fetching saved artworks count:", error);
        }
      };

      fetchSavedCount();
    }
  }, [user]);

  return (
    <div className="hideElements padding">
      <div className="sixColumns marginBottomBig fullWidth">
        <div className="portrait spaceEvenly marginTop">
          <div className="imageContainer imgRound marginRight">
            <PaintingsGrid maxPaintings={1} />
          </div>
          <div className="flex column marginTop">
            <h3 className="marginBottom"> {user?.fullName || "Guest"} </h3>
            <NavLink className="button buttonGrey" to="/editprofile">
              Edit Profile
            </NavLink>
          </div>
        </div>

        <div className="flex spaceEvenly borderAround stats fullWidth marginTop">
          <div className="flex column">
            <span className="greyColor">Art Liked</span>
            <h4>{savedCount}</h4>
          </div>
          <div className="flex column">
            <span className="greyColor">Artists</span>
            <h4>25</h4>
          </div>
          <div className="flex column">
            <span className="greyColor">Favorite Art</span>
            <h4>25</h4>
          </div>
        </div>
      </div>

      <div className="flex column borderTop paddingTop">
        <div className="inlineFlex fullWidth marginTop">
          <div className="flex marginRight">
            <h3>Favorite Artworks</h3>
          </div>
          <NavLink className="button buttonBorder" to="/favorites">
            View All
          </NavLink>
        </div>

        <div className="favorite restrictiveGrid marginTop">
          <PaintingsGrid maxPaintings={6} />
        </div>
      </div>

      <div className="flex column marginTopBig">
        <div className="flex fullWidth paddingRight">
          <div className="flex">
            <h3>All Saved Artworks</h3>
          </div>
          <NavLink className="button buttonBorder" to="/saved">
            View All
          </NavLink>
        </div>
      </div>
      <div className="marginTop">
        {user && user._id && (
          <SavedPaintings userId={user._id} /> // Pass the user ID as a prop
        )}
        {/* <PaintingsGrid maxPaintings={12} /> */}
      </div>
    </div>
  );
}

export default Profile;
