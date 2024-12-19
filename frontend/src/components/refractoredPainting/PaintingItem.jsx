import { useState } from "react";
import PropTypes from "prop-types";
import AuthService from "../services/authService";
import Heart from "./Heart";

const PaintingItem = ({
  painting,
  isLastPainting,
  lastPaintingElementRef,
  handlePaintingClick,
  fetchStrategy,
}) => {
  const [saved, setSaved] = useState(
    fetchStrategy === "saved" ? true : painting.saved || false
  );

  const handleToggleHeart = async () => {
    try {
      const currentUser = AuthService.getCurrentUser();
      const userId = currentUser?._id;

      if (!userId) {
        throw new Error("User must be logged in to save paintings");
      }

      if (!saved) {
        await AuthService.addInteraction(userId, painting._id, true);
      } else {
        await AuthService.updateInteraction(userId, painting._id, false);
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
        />
        <div className="text title-container">
          <h5 className="text textShadow">{painting.title}</h5>
        </div>
        <div className="text heart-container">
          <Heart
            initialFilled={fetchStrategy === "saved" ? true : false}
            onToggle={handleToggleHeart}
          />
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
    saved: PropTypes.bool,
  }).isRequired,
  isLastPainting: PropTypes.bool,
  lastPaintingElementRef: PropTypes.func,
  handlePaintingClick: PropTypes.func.isRequired,
  fetchStrategy: PropTypes.oneOf(["all", "saved"]),
};

export default PaintingItem;
