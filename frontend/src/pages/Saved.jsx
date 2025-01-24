import SavedPaintings from "../components/SavedPaintings";
import { useEffect, useState } from "react";
import { useAuth } from "../services/AuthContext";
import { NavLink } from "react-router-dom";
import "../App.css";

function Saved() {
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

  const star = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="14"
      viewBox="0 0 31 30"
      fill="none"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <path
        d="M19.0747 9.26036L19.075 9.26082C19.4494 10.0155 20.1705 10.5344 21.0002 10.6548L21.0009 10.655L28.9808 11.8092L23.2112 17.4069L23.211 17.4071C22.6077 17.9927 22.3297 18.8389 22.473 19.6707C22.473 19.6707 22.473 19.6707 22.473 19.6707L23.8364 27.5837L16.6886 23.8432C16.6884 23.8431 16.6882 23.843 16.688 23.8429C15.9441 23.4534 15.0559 23.4534 14.312 23.8429C14.3118 23.843 14.3116 23.8431 14.3114 23.8432L7.16326 27.5837L8.52664 19.6707C8.52664 19.6707 8.52665 19.6707 8.52665 19.6707C8.66997 18.8389 8.39199 17.9927 7.78869 17.4071L7.7885 17.4069L2.01916 11.8089L9.9984 10.6547C9.99862 10.6547 9.99884 10.6546 9.99906 10.6546C10.8305 10.5345 11.5511 10.014 11.925 9.26048L11.9253 9.26004L15.5 2.05021L19.0747 9.26036ZM29.878 11.939C29.8778 11.9389 29.8775 11.9389 29.8773 11.9389L29.8779 11.939L29.878 11.939ZM24.6266 27.9972C24.6269 27.9974 24.6272 27.9975 24.6274 27.9976L24.6266 27.9972ZM7.01036 28.4711L7.01041 28.4708L7.01036 28.4711ZM1.12199 11.9386L1.1221 11.9386L1.12199 11.9386ZM15.105 1.25352L15.105 1.25361L15.105 1.25352Z"
        fill="#C6C6C6"
        stroke="#C6C6C6"
        strokeWidth="3"
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
            <h3>All Saved Artworks</h3>
            <div className="flex spaceEvenly button greyColor buttonBorder borderHover">
              <NavLink className="greyLight" to="/favorites">
                <span className="lessPaddingRight">Favorites</span>
                {star}
              </NavLink>
            </div>
          </div>
          <div className="marginTop">
            <SavedPaintings
              userId={user._id}
              interactionType={"saved"}
              layout={"saved"}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Saved;
