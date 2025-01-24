import interactionService from "../services/interactionService";
import SavedPaintings from "../components/SavedPaintings";
import { useAuth } from "../services/AuthContext";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "../index.css";
import "../App.css";

function Profile() {
  const { user } = useAuth();
  const [savedCount, setSavedCount] = useState(0);
  const [favoriteCount, setfavoriteCount] = useState(0);
  const [savedCountArtists, setSavedCountArtists] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      if (!user) {
        setLoading(true);
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, [user]);

  useEffect(() => {
    if (user && user._id) {
      const fetchCounts = async () => {
        try {
          // Fetch saved artworks count
          const [savedArtworksCount, favoriteArtworksCount, savedArtistsCount] =
            await Promise.all([
              interactionService.countSaved(user._id),
              interactionService.countFavorite(user._id),
              interactionService.countSavedArtists(user._id),
            ]);

          // Update state
          setSavedCount(savedArtworksCount);
          setfavoriteCount(favoriteArtworksCount);
          setSavedCountArtists(savedArtistsCount);
        } catch (error) {
          console.error("Error fetching saved counts:", error);
        }
      };

      fetchCounts();
    }
  }, [user]);

  if (loading) return <div className="loader"></div>;

  return (
    <div className="hideElements padding">
      <div className="sixColumns marginBottomBig fullWidth">
        <div className="portrait spaceEvenly marginTop">
          <div className="favorite imgRound marginRight">
            <SavedPaintings
              userId={user._id}
              maxPaintings={1}
              interactionType={"favorite"}
              layout={"flex"}
            />
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
<<<<<<< HEAD
            <h4>{savedCountArtists}</h4>
          </div>
          <div className="flex column">
            <span className="greyColor">Favorite Art</span>
            <h4>{favoriteCount}</h4>
=======
            <h4>{savedCount}</h4>
          </div>
          <div className="flex column">
            <span className="greyColor">Favorite Art</span>
            <h4>5</h4>
>>>>>>> ee560a8a51bd9282775030c074ea90406d35bfc6
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

        <div className="favorite marginTop">
          <SavedPaintings
            userId={user._id}
            maxPaintings={6}
            interactionType={"favorite"}
            layout={"restrictive"}
          />
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
        <SavedPaintings
          userId={user._id}
          maxPaintings={14}
          interactionType={"saved"}
          layout={"columns"}
        />
      </div>
    </div>
  );
}

export default Profile;
