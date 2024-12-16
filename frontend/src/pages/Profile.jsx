import "../App.css";
import { NavLink } from "react-router-dom";
import PaintingsGrid from "../components/Painting";
import Star from "../components/Star";
import Heart from "../components/Heart";

function Profile() {
  return (
    <div className="profile padding">
      <div className="layoutGrid marginBottomBig">
        <div className="flex spaceEvenly alignItemsLeft marginTop">
          <div className="imageContainer imgRound marginRight">
            <img src="/images/image1.jpeg" alt="Image 1" />
          </div>
          <div className="flex column">
            <h3 className="marginBottom">username</h3>
            <NavLink className="button buttonGrey" to="/editprofile">
              Edit Profile
            </NavLink>
          </div>
        </div>

        <div className="flex spaceEvenly borderAround paddingLeftRightSmall">
          <div className="flex column">
            <span className="greyColor">Art Liked</span>
            <h4>25</h4>
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

      <div className="flex column borderTop marginTop">
        <div className="flex fullWidth paddingRight marginBottom marginTop">
          <div className="flex">
            <h3>Favorite Artworks</h3>
            <Star filled={false} />
          </div>
          <NavLink className="button buttonBorder" to="/favorites">
            View All
          </NavLink>
        </div>

        <div className="favorite restrictiveGrid">
          <PaintingsGrid />
        </div>
      </div>

      <div className="flex column">
        <div className="flex fullWidth paddingRight marginBottom">
          <div className="flex">
            <h3>All Saved Artworks</h3>
            <Heart filled={false} />
          </div>
          <NavLink className="button buttonBorder" to="/saved">
            View All
          </NavLink>
        </div>
        <div className="columnResponsive">
          <PaintingsGrid />
        </div>
      </div>
    </div>
  );
}

export default Profile;
