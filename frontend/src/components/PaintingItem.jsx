import { useState } from "react";
import PropTypes from "prop-types";
import AuthService from "../services/authService";
import Heart from "./Heart";

const PaintingItem = ({
  painting,
  isLastPainting,
  lastPaintingElementRef,
  handleImageError,
  handlePaintingClick,
}) => {
  // Provide a default value for `saved` if it is undefined
  const [saved, setSaved] = useState(painting.saved || false);

  const handleToggleHeart = async () => {
    try {
      const currentUser = AuthService.getCurrentUser();
      console.log("Current user:", currentUser);
      const userId = currentUser?._id; // Use userId instead of username // Use userId instead of username
      if (!userId) {
        throw new Error("User ID is undefined. Ensure the user is logged in.");
      }

      const paintingId = painting._id;

      console.log(
        "Toggling heart for paintingId:",
        paintingId,
        "saved:",
        saved
      );

      if (!saved) {
        const result = await AuthService.addInteraction(
          userId,
          paintingId,
          true
        );
        console.log("Interaction added:", result);
      } else {
        const result = await AuthService.updateInteraction(
          userId,
          paintingId,
          false
        );
        console.log("Interaction updated:", result);
      }

      setSaved(!saved);
    } catch (error) {
      console.error("Error updating interaction:", error);
    }
  };

  return (
    <div
      ref={isLastPainting ? lastPaintingElementRef : null}
      id={`painting-${painting._id}`}
      key={painting._id}
      className="imageContainer"
      style={{ cursor: "pointer" }}
    >
      <div className="text flex paddingLeftRightSmall">
        <h6>{painting.artistDisplayName}</h6>
        <div className="flex">
          <h6 className="greyColor lessMarginRight">{painting.objectDate}</h6>
          <h6 className="greyColor">{painting.medium}</h6>
        </div>
      </div>
      <div className="imageContainer relative">
        <img
          src={painting.primaryImageSmall}
          alt={painting.title}
          loading="lazy"
          onClick={() => handlePaintingClick(painting)}
          onError={() =>
            handleImageError(painting._id, painting.primaryImageSmall)
          }
        />
        <div className="text title-container">
          <h5 className="text textShadow">{painting.title}</h5>
        </div>
        <div className="text heart-container">
          <Heart initialFilled={saved} onToggle={handleToggleHeart} />
        </div>
      </div>
    </div>
  );
};

PaintingItem.propTypes = {
  painting: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    artistDisplayName: PropTypes.string.isRequired,
    objectDate: PropTypes.string.isRequired,
    medium: PropTypes.string.isRequired,
    primaryImageSmall: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    saved: PropTypes.bool, // Make `saved` optional
  }).isRequired,
  isLastPainting: PropTypes.bool.isRequired,
  lastPaintingElementRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  handleImageError: PropTypes.func.isRequired,
  handlePaintingClick: PropTypes.func.isRequired,
};

export default PaintingItem;
