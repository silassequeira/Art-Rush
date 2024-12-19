import { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import InteractionService from "../services/interactionService";
import PaintingService from "../services/paintingService";
import PaintingItem from "./PaintingItem";

// Define a type for fetch strategies
const PaintingsGrid = ({ fetchStrategy, maxPaintings, userId }) => {
  const [paintings, setPaintings] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const observerRef = useRef(null);

  // Centralized fetch method that supports different strategies
  const fetchPaintings = useCallback(
    async (currentPage) => {
      try {
        setLoading(true);

        const limit = maxPaintings || 10;
        let result;

        switch (fetchStrategy) {
          case "savedPaintings":
            if (!userId)
              throw new Error("User ID required for savedPaintings paintings");
            result = await InteractionService.getInteractions(userId, {
              page: currentPage,
              limit,
            });
            break;

          case "allPaintings":
          default:
            result = await PaintingService.getPaintings({
              page: currentPage,
              limit,
            });
            break;
        }

        if (result.success) {
          const newPaintings = maxPaintings
            ? result.data.slice(0, maxPaintings)
            : result.data;

          setPaintings((prev) =>
            currentPage === 1 ? newPaintings : [...prev, ...newPaintings]
          );

          setHasMore(result.data.length === limit);
          return newPaintings;
        } else {
          throw new Error(result.error || "Failed to fetch paintings");
        }
      } catch (err) {
        setError(err.message);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [fetchStrategy, maxPaintings, userId]
  );

  useEffect(() => {
    if (fetchStrategy === "savedPaintings" && !userId) {
      navigate("/login", { state: { error: "You haven't logged in yet" } });
      return;
    }

    fetchPaintings(1);

    // Handle scroll-to-painting logic if needed
    const scrollToPaintingId = location.state?.scrollToPaintingId;
    if (scrollToPaintingId) {
      setTimeout(() => {
        const element = document.getElementById(
          `painting-${scrollToPaintingId}`
        );
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, [
    fetchStrategy,
    userId,
    fetchPaintings,
    location.state?.scrollToPaintingId,
    navigate,
  ]);

  // Load more paintings for infinite scroll
  const loadMorePaintings = useCallback(() => {
    if (maxPaintings || loading || !hasMore) return;
    fetchPaintings(page + 1);
    setPage((prev) => prev + 1);
  }, [page, loading, hasMore, maxPaintings, fetchPaintings]);

  // Intersection observer ref for infinite scroll
  const lastPaintingElementRef = useCallback(
    (node) => {
      if (maxPaintings || loading) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMorePaintings();
        }
      });

      if (node) observerRef.current.observe(node);

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    },
    [loading, hasMore, loadMorePaintings, maxPaintings]
  );

  const handlePaintingClick = (painting) => {
    navigate(`/painting/${painting._id}`, {
      state: { painting },
    });
  };

  if (loading && paintings.length === 0) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="paintings-grid">
      {paintings.map((painting, index) => {
        const isLastPainting = !maxPaintings && paintings.length === index + 1;

        return (
          <PaintingItem
            key={painting._id}
            painting={painting}
            isLastPainting={isLastPainting}
            lastPaintingElementRef={
              isLastPainting ? lastPaintingElementRef : null
            }
            handlePaintingClick={() => handlePaintingClick(painting)}
            fetchStrategy={fetchStrategy}
          />
        );
      })}
      {loading && <div>Loading more...</div>}
    </div>
  );
};

PaintingsGrid.propTypes = {
  fetchStrategy: PropTypes.oneOf(["allPaintings", "savedPaintings"]),
  maxPaintings: PropTypes.number,
  userId: PropTypes.string,
};

export default PaintingsGrid;
