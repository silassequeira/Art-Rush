import SavedPaintings from "../components/SavedPaintings";
import { useAuth } from "../services/AuthContext";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Star from "../components/Star";
import { useEffect } from "react";
import "../App.css";

function Saved() {
  const { user } = useAuth();

  const navigate = useNavigate();

  //Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);
  return (
    <>
      <div className="hideElements favorite padding">
        <NavLink className="greyColor margin" to="/profile">
          &lt; Back
        </NavLink>

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
            {user && user._id && <SavedPaintings userId={user._id} />}
          </div>
        </div>
      </div>
    </>
  );
}

export default Saved;
