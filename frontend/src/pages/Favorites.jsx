import SavedPaintings from "../components/SavedPaintings";
import { useAuth } from "../services/AuthContext";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import "../App.css";

function Favorites() {
  const { user } = useAuth();
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

  const heart = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="12"
      viewBox="0 0 31 28"
      fill="none"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <path
        d="M8.74617 2C6.93697 2 5.27342 2.6901 4.07751 3.93994C2.72061 5.35847 2 7.42875 2 9.94377C2 11.9681 2.71295 14.0767 4.11584 16.2006C5.21976 17.8799 6.76065 19.5744 8.68484 21.2383C11.9506 24.0677 15.2624 25.8696 15.293 25.885L15.5 26L15.707 25.885C15.707 25.885 19.0571 24.0677 22.3152 21.2383C24.2394 19.5668 25.7802 17.8722 26.8842 16.2006C28.2871 14.0767 29 11.9681 29 9.94377C29 7.43642 28.2794 5.35847 26.9225 3.93994C25.7189 2.6901 24.063 2 22.2462 2C20.6516 2 19.0571 2.53674 17.7768 3.51821C16.7572 4.29265 15.983 5.29712 15.4923 6.47029C15.0017 5.30479 14.2274 4.30032 13.2078 3.51821C11.9276 2.53674 10.333 2 8.7385 2H8.74617Z"
        fill="#C6C6C6"
        stroke="#C6C6C6"
        strokeWidth="3"
        strokeMiterlimit="10"
      />
    </svg>
  );

  if (loading) return <div className="loader"></div>;

  return (
    <>
      <div className="hideElements favorite padding">
        <NavLink className="greyColor margin" to="/profile">
          &lt; Back
        </NavLink>

        <div className="flex column marginTop">
          <div className="inlineFlex fullWidth marginTop">
            <h3>Favorite Artworks</h3>
            <div className="flex button greyColor buttonBorder borderHover">
              <NavLink className="greyLight" to="/saved">
                <span className="lessPaddingRight">Saved</span>
                {heart}
              </NavLink>
            </div>
          </div>
          <div className="marginTop">
            <SavedPaintings
              userId={user._id}
              interactionType={"favorite"}
              layout={"columns"}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Favorites;
