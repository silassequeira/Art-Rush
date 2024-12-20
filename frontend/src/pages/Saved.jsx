import "../App.css";
import { NavLink } from "react-router-dom";
import Star from "../components/Star";
import { useAuth } from "../services/AuthContext";
import SavedPaintings from "../components/SavedPaintings";

function Saved() {
  const { user } = useAuth();
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
