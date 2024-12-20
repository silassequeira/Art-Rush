import PaintingsGrid from "../components/Painting";
import { useAuth } from "../services/AuthContext";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Heart from "../components/Heart";
import { useEffect } from "react";
import "../App.css";

function Favorites() {
  const { user } = useAuth();
  const navigate = useNavigate();

  //Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const expandArrow = (
    <svg
      width="12"
      height="12"
      viewBox="0 0 100 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M50.0499 36.4401C54.2299 32.2701 58.1799 28.3301 62.1299 24.3901C68.9099 17.6301 75.6599 10.8301 82.4799 4.11008C86.99 -0.339916 92.5399 -0.709916 96.4399 3.04008C100.42 6.87008 100.19 12.6701 95.6499 17.2201C82.8299 30.0701 69.9599 42.8801 57.0599 55.6401C52.2499 60.4001 47.5099 60.3801 42.7199 55.6401C29.8199 42.8701 16.9599 30.0601 4.12994 17.2201C-0.410057 12.6801 -0.660056 6.89008 3.31994 3.05008C7.21994 -0.709918 12.7799 -0.349917 17.2799 4.10008C27.5299 14.2401 37.7099 24.4401 47.9299 34.6101C48.4499 35.1301 49.0399 35.5701 50.0499 36.4501V36.4401Z"
        fill="#D9D9D9"
      />
    </svg>
  );

  return (
    <>
      <div className="hideElements favorite padding">
        <NavLink className="greyColor margin" to="/profile">
          &lt; Back
        </NavLink>

        <div className="flex spaceEvenly borderAround lessPadding marginTopBig">
          <div className="flex">
            <span className="greyLight">Rating</span>
            <span className="arrowMargin">{expandArrow}</span>
          </div>
          <div className="flex">
            <span className="greyLight">Century</span>
            <span className="arrowMargin">{expandArrow}</span>
          </div>
          <div className="flex">
            <span className="greyLight">Location</span>
            <span className="arrowMargin">{expandArrow}</span>
          </div>
        </div>

        <div className="flex column marginTop">
          <div className="inlineFlex fullWidth marginTop">
            <h3>Favorite Artworks</h3>
            <div className="flex button greyColor buttonBorder borderHover">
              <NavLink className="greyLight lessMarginRight" to="/saved">
                Saved
              </NavLink>
              <Heart filled={false} />
            </div>
          </div>
          <div className="columnResponsive marginTop">
            <PaintingsGrid />
          </div>
        </div>
      </div>
    </>
  );
}

export default Favorites;
