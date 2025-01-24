import InteractionService from "../services/interactionService";
import AuthService from "../services/authService";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import Heart from "./Heart";
import Star from "./Star";

const PaintingItem = ({
  painting,
  isLastPainting,
  lastPaintingElementRef,
  handlePaintingClick,
  onImageLoad,
  interactionType,
}) => {
  const [saved, setSaved] = useState(null); // Initialize as null to indicate loading state
  const [favorite, setFavorite] = useState(null); // Store favorite states for each painting

  useEffect(() => {
    const fetchSavedState = async () => {
      try {
        const currentUser = AuthService.getCurrentUser();
        console.log("Current user:", currentUser);
        const userId = currentUser?._id;
        if (!userId) {
          throw new Error(
            "User ID is undefined. Ensure the user is logged in."
          );
        }

        const paintingId = painting._id;
        console.log("Fetching saved state for paintingId:", paintingId); // Debugging log
        const savedState = await InteractionService.checkSavedState(
          userId,
          paintingId
        );
        console.log("Fetched saved state:", savedState); // Debugging log
        setSaved(savedState);
      } catch (error) {
        console.error("Error fetching saved state:", error);
      }
    };

    const fetchFavoriteStates = async () => {
      try {
        const currentUser = AuthService.getCurrentUser();
        console.log("Current user:", currentUser);
        const userId = currentUser?._id;
        if (!userId) {
          throw new Error(
            "User ID is undefined. Ensure the user is logged in."
          );
        }

        const paintingId = painting._id;
        console.log("Fetching saved state for paintingId:", paintingId); // Debugging log
        const favoriteState = await InteractionService.checkFavoriteState(
          userId,
          paintingId
        );
        console.log("Fetched saved state:", favoriteState); // Debugging log
        setFavorite(favoriteState);
      } catch (error) {
        console.error("Error fetching saved state:", error);
      }
    };

    if (interactionType === "saved") {
      fetchSavedState();
    } else if (interactionType === "favorite") {
      fetchFavoriteStates();
    } else if (interactionType === "both") {
      fetchFavoriteStates();
      fetchSavedState();
    }
  }, [painting._id, interactionType]);

  const handleToggleHeart = async () => {
    try {
      const currentUser = AuthService.getCurrentUser();
      console.log("Current user:", currentUser);
      const userId = currentUser?._id;
      if (!userId) {
        throw new Error("User ID is undefined. Ensure the user is logged in.");
      }

      const paintingId = painting._id;
      console.log(
        "Toggling heart for paintingId:",
        paintingId,
        "saved:",
        saved
      ); // Debugging log

      let result;
      if (saved) {
        result = await AuthService.updateInteraction(userId, paintingId, false);
        console.log("Interaction updated:", result);
      } else {
        result = await AuthService.addInteraction(userId, paintingId, true);
        console.log("Interaction added:", result);
      }

      setSaved(!saved); // Toggle the saved state
    } catch (error) {
      console.error("Error updating interaction:", error);
    }
  };

  const handleToggleStar = async () => {
    try {
      const currentUser = AuthService.getCurrentUser();
      console.log("Current user:", currentUser);
      const userId = currentUser?._id;
      if (!userId) {
        throw new Error("User ID is undefined. Ensure the user is logged in.");
      }

      const paintingId = painting._id;
      console.log(
        "Toggling heart for paintingId:",
        paintingId,
        "favorite:",
        favorite
      ); // Debugging log

      let result;
      if (favorite) {
        result = await AuthService.addInteraction(userId, paintingId, true);

        console.log("Interaction updated:", result);
      } else {
        result = await AuthService.addFavoriteInteraction(
          userId,
          paintingId,
          true
        );
        console.log("Interaction added:", result);
      }

      setFavorite(!favorite); // Toggle the favorite state
    } catch (error) {
      console.error("Error updating interaction:", error);
    }
  };

  const handleImageLoad = (event) => {
    const img = event.target;
    img.classList.add("loaded");
    if (onImageLoad) onImageLoad();
  };

  if (interactionType === "saved") {
    return (
      <div
        ref={isLastPainting ? lastPaintingElementRef : null}
        id={`painting-${painting._id}`}
        key={painting._id}
        style={{ height: "100%" }}
      >
        <div className="text flex paddingLeftRightSmall">
          <h6 className="textTruncateLong">{painting.artistDisplayName}</h6>
          <div className="flex maxWidth">
            <h6 className="greyColor textTruncate lessMarginRight">
              {painting.objectDate}
            </h6>
            <h6 className="textTruncate hide greyColor">{painting.medium}</h6>
          </div>
        </div>
        <div className="imageContainer relative">
          <img
            src={painting.primaryImageSmall}
            alt={painting.title}
            loading="lazy"
            onLoad={handleImageLoad}
            onClick={() => handlePaintingClick(painting)}
            style={{ cursor: "pointer" }}
          />
          <div className="text heart-container">
            <Heart initialFilled={saved} onToggle={handleToggleHeart} />
          </div>
          <div className="text title-container">
            <h5 className="text textTruncateLong textShadow">
              {painting.title}
            </h5>
          </div>
        </div>
      </div>
    );
  } else if (interactionType === "favorite") {
    return (
      <div
        ref={isLastPainting ? lastPaintingElementRef : null}
        id={`painting-${painting._id}`}
        key={painting._id}
      >
        <div className="imageContainer relative">
          <img
            src={painting.primaryImageSmall}
            alt={painting.title}
            loading="lazy"
            onLoad={handleImageLoad}
            onClick={() => handlePaintingClick(painting)}
            style={{ cursor: "pointer" }}
          />
          <div className="star-container">
            <Star initialFilled={favorite} onToggle={handleToggleStar} />
          </div>
        </div>
      </div>
    );
  } else if (interactionType === "none") {
    return (
      <div
        ref={isLastPainting ? lastPaintingElementRef : null}
        id={`painting-${painting._id}`}
        key={painting._id}
        style={{ height: "100%" }}
      >
        <div className="text flex paddingLeftRightSmall">
          <h6 className="textTruncateLong">{painting.artistDisplayName}</h6>
          <div className="flex maxWidth">
            <h6 className="greyColor textTruncate lessMarginRight">
              {painting.objectDate}
            </h6>
            <h6 className="textTruncate hide greyColor">{painting.medium}</h6>
          </div>
        </div>
        <div className="imageContainer relative">
          <img
            src={painting.primaryImageSmall}
            alt={painting.title}
            loading="lazy"
            onLoad={handleImageLoad}
          />
          <div className="text title-container">
            <h5 className="text textTruncateLong textShadow">
              {painting.title}
            </h5>
          </div>
        </div>
      </div>
    );
  } else if (interactionType === "both") {
    return (
      <div
        ref={isLastPainting ? lastPaintingElementRef : null}
        id={`painting-${painting._id}`}
        key={painting._id}
        className="layoutGrid"
      >
        <div className="imageContainer relative">
          <img
            src={painting.primaryImageSmall}
            alt={painting.title}
            loading="lazy"
            onLoad={handleImageLoad}
            onClick={() => handlePaintingClick(painting)}
          />
        </div>

        <div className="flex column alignItemsLeft">
          <div className="centeredMarginTop column marginBottom">
            <h1>{painting.title}</h1>
            <h5 className="greyColor">
              {painting?.artistDisplayName}, {painting?.artistNationality}
            </h5>
          </div>
          <div style={{ width: "70%" }}>
            <div className="flexWrap marginBottom marginTop">
              <div className="paddingRight lessPaddingBottom">
                <span className="greyColor">Biography: </span>
                <span>{painting?.artistDisplayBio}</span>
              </div>
              <div className="paddingRight lessPaddingBottom">
                <span className="greyColor">Date: </span>
                <span>{painting?.objectDate || "Unknown"}</span>
              </div>
              <div className="paddingRight lessPaddingBottom">
                <span className="greyColor">Medium:</span>{" "}
                <span>{painting?.medium}</span>
              </div>
              <div className="paddingRight lessPaddingBottom">
                <span className="greyColor">Dimensions: </span>
                <span>{painting?.dimensions || "Unknown"}</span>
              </div>
            </div>
            <div className="flex spaceEvenly borderAround fullWidth lessPaddingBottom marginTop">
              <div className="centeredMarginTop column heartScale marginSides">
                <span className="greyColor marginBottomSmall">Like: </span>
                <Heart initialFilled={saved} onToggle={handleToggleHeart} />
              </div>
              <div className="centeredMarginTop column starScale marginSides">
                <span className="greyColor marginBottomSmall">Favorite: </span>
                <Star initialFilled={favorite} onToggle={handleToggleStar} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

PaintingItem.propTypes = {
  painting: PropTypes.shape({
    _id: PropTypes.string,
    artistDisplayName: PropTypes.string,
    objectDate: PropTypes.string,
    medium: PropTypes.string,
    primaryImageSmall: PropTypes.string,
    title: PropTypes.string,
    artistDisplayBio: PropTypes.string,
    artistNationality: PropTypes.string,
    dimensions: PropTypes.string,
    saved: PropTypes.bool, // Make `saved` optional
    favorite: PropTypes.bool, // Make `saved` optional
  }),
  isLastPainting: PropTypes.bool,
  lastPaintingElementRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  handlePaintingClick: PropTypes.func,
  onImageLoad: PropTypes.func,
  interactionType: PropTypes.string.isRequired,
};

export default PaintingItem;
