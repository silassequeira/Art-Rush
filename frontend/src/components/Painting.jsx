import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PaintingService from "../services/paintingService";
import PaintingItem from "./PaintingItem";
import PropTypes from "prop-types";

const PaintingsGrid = ({ maxPaintings }) => {
  const [paintings, setPaintings] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const observerRef = useRef();

  useEffect(() => {
    async function fetchPaintings() {
      try {
        const limit = maxPaintings || 10;

        const result = await PaintingService.getPaintings({
          page: 1,
          limit: limit,
        });

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

  const lastPaintingElementRef = useCallback(
    (node) => {
      if (maxPaintings || loading) return;

      if (observerRef.current) observerRef.current.disconnect();

      // Create new intersection observer
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMorePaintings();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, loadMorePaintings, maxPaintings]
  );

  // Handle painting click navigation
  const handlePaintingClick = (painting) => {
    navigate(`/painting/${painting._id}`, {
      state: { painting },
    });
  };

  if (loading) return <div>Loading Paintings...</div>;
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
