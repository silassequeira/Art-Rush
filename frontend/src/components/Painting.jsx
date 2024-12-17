import { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import PaintingService from "../services/paintingService";
import PaintingItem from "./PaintingItem";

const PaintingsGrid = ({ maxPaintings }) => {
  const [paintings, setPaintings] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [failedImageIds, setFailedImageIds] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const observerRef = useRef();

  // Image error tracking function
  const handleImageError = useCallback((_id, imageUrl) => {
    console.error(`Image failed to load for _id: ${_id}`, {
      url: imageUrl,
      timestamp: new Date().toISOString(),
    });

    setFailedImageIds((prev) => {
      if (!prev.includes(_id)) {
        return [...prev, _id];
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    if (failedImageIds.length > 0) {
      console.log("Paintings with failed images:", failedImageIds);
    }
  }, [failedImageIds]);

  useEffect(() => {
    async function fetchPaintings() {
      try {
        const limit = maxPaintings || 10;

        const result = await PaintingService.getPaintings({
          page: 1,
          limit: limit,
        });

        // Slice paintings if maxPaintings is specified
        if (result.success) {
          const displayPaintings = maxPaintings
            ? result.paintings.slice(0, maxPaintings)
            : result.paintings;

          setPaintings(displayPaintings);

          const scrollToPaintingId = location.state?.scrollToPaintingId;
          if (scrollToPaintingId) {
            setTimeout(() => {
              const element = document.getElementById(
                `painting-${scrollToPaintingId}`
              );
              if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            }, 100);
          }
        } else {
          setError(result.error || "Failed to fetch paintings.");
        }
      } catch {
        setError("An unexpected error occurred while fetching paintings.");
      } finally {
        setLoading(false);
      }
    }

    fetchPaintings();
  }, [location.state, maxPaintings]);

  // Infinite scroll, disable infinite scroll if maxPaintings is set
  const loadMorePaintings = useCallback(async () => {
    if (maxPaintings) return;

    if (loading || !hasMore) return;
    try {
      const result = await PaintingService.getPaintings({
        page: page + 1,
        limit: 10,
      });

      if (result.success) {
        setPaintings((prev) => [...prev, ...result.paintings]);
        setPage((prev) => prev + 1);
        setHasMore(result.paintings.length === 10);
      }
    } catch (err) {
      console.error("Error loading more paintings:", err);
    }
  }, [page, loading, hasMore, maxPaintings]);

  // Disable intersection observer if maxPaintings is set
  const lastPaintingElementRef = useCallback(
    (node) => {
      if (maxPaintings || loading) return;

      // Disconnect previous observer
      if (observerRef.current) observerRef.current.disconnect();

      // Create new intersection observer
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMorePaintings();
        }
      });

      // Observe the last element
      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, loadMorePaintings, maxPaintings]
  );

  // Handle painting click navigation
  const handlePaintingClick = (painting) => {
    navigate(`/painting/${painting._id}`, {
      state: { painting }, // Pass painting details to detail page
    });
  };

  // Render loading state
  if (loading) return <div>Loading Paintings...</div>;

  // Render error state
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {paintings.map((painting, index) => {
        const isLastPainting = !maxPaintings && paintings.length === index + 1;

        return (
          <PaintingItem
            key={painting._id}
            painting={painting}
            isLastPainting={isLastPainting}
            lastPaintingElementRef={lastPaintingElementRef}
            handleImageError={handleImageError}
            handlePaintingClick={() => handlePaintingClick(painting)}
          />
        );
      })}
      {loading && <div>Loading...</div>}
    </>
  );
};
PaintingsGrid.propTypes = {
  maxPaintings: PropTypes.number,
};

export default PaintingsGrid;
