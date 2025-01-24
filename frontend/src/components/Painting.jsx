import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PaintingService from "../services/paintingService";
import PaintingItem from "./PaintingItem";
import PropTypes from "prop-types";
import { useAuth } from "../services/AuthContext";

const PaintingsGrid = ({ maxPaintings }) => {
  const [paintings, setPaintings] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [columns, setColumns] = useState(3); // State for number of columns
  const { user } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const observerRef = useRef();

  useEffect(() => {
    // Function to update the number of columns based on window width
    const updateColumns = () => {
      if (window.innerWidth > 1199) {
        setColumns(3);
      } else if (window.innerWidth > 768) {
        setColumns(2);
      } else {
        setColumns(1);
      }
    };

    // Initial column update
    updateColumns();

    // Add event listener for window resize
    window.addEventListener("resize", updateColumns);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateColumns);
    };
  }, []);

  useEffect(() => {
    // Load cached paintings
    const cachedPaintings = PaintingService.getCachedPaintings();
    if (cachedPaintings.length > 0) {
      setPaintings(cachedPaintings);
      setLoading(false);
    }

    async function fetchPaintings(useCache = true) {
      try {
        const limit = maxPaintings || 4;

        const result = await PaintingService.getPaintings({
          page: 1,
          limit: limit,
          useCache: useCache,
        });

        if (result.success) {
          const displayPaintings = maxPaintings
            ? result.paintings.slice(0, maxPaintings)
            : result.paintings;

          setPaintings(displayPaintings);
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

  const handleImageLoad = () => {
    setImagesLoaded((prev) => prev + 1);
  };

  const loadMorePaintings = useCallback(async () => {
    if (maxPaintings) return; // Stop if maxPaintings is set

    if (loading || !hasMore) return;

    setImagesLoaded(0);

    try {
      setLoading(true); // Set loading to true before fetching

      const result = await PaintingService.getPaintings({
        page: page + 1,
        limit: 4,
        useCache: false,
      });

      if (result.success) {
        setPaintings((prev) => [...prev, ...result.paintings]);
        setPage((prev) => prev + 1);
        setHasMore(result.total > (page + 1) * 4);
      }
    } catch (err) {
      console.error("Error loading more paintings:", err);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  }, [page, loading, hasMore, maxPaintings]);

  const lastPaintingElementRef = useCallback(
    (node) => {
      if (maxPaintings || loading) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          if (imagesLoaded <= paintings.length) {
            loadMorePaintings();
          }
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [
      loading,
      hasMore,
      loadMorePaintings,
      maxPaintings,
      imagesLoaded,
      paintings.length,
    ]
  );

  // Handle painting click navigation
  const handlePaintingClick = (painting) => {
    navigate(`/painting/${painting._id}`, {
      state: { painting },
    });
  };

  if (loading && paintings.length === 0) return <div>Loading Paintings...</div>;
  if (error) return <div>Error: {error}</div>;

  // Function to filter out duplicate paintings
  const filterDuplicates = (paintings) => {
    const seen = new Set();
    return paintings.filter((painting) => {
      if (seen.has(painting._id)) {
        return false;
      } else {
        seen.add(painting._id);
        return true;
      }
    });
  };

  const uniquePaintings = filterDuplicates(paintings);

  const columnArray = Array.from({ length: columns }, () => []);

  uniquePaintings.forEach((painting, index) => {
    columnArray[index % columns].push(painting);
  });

  if (!user) {
    return (
      <div className="masonry-grid">
        {columnArray.map((column, columnIndex) => (
          <div key={columnIndex} className="masonry-column">
            {column.map((painting, index) => {
              const isLastPainting = !loading && column.length === index + 1;

              return (
                <PaintingItem
                  key={painting._id}
                  painting={painting}
                  isLastPainting={isLastPainting}
                  lastPaintingElementRef={
                    isLastPainting ? lastPaintingElementRef : null
                  }
                  onImageLoad={handleImageLoad}
                  interactionType={"none"}
                />
              );
            })}
          </div>
        ))}
        {loading && <div>Loading...</div>}
      </div>
    );
  } else {
    return (
      <div className="masonry-grid">
        {columnArray.map((column, columnIndex) => (
          <div key={columnIndex} className="masonry-column">
            {column.map((painting, index) => {
              const isLastPainting = !loading && column.length === index + 1;

              return (
                <PaintingItem
                  key={painting._id}
                  painting={painting}
                  isLastPainting={isLastPainting}
                  lastPaintingElementRef={
                    isLastPainting ? lastPaintingElementRef : null
                  }
                  handlePaintingClick={() => handlePaintingClick(painting)}
                  onImageLoad={handleImageLoad}
                  interactionType={"saved"}
                />
              );
            })}
          </div>
        ))}
        {loading && <div>Loading...</div>}
      </div>
    );
  }
};

PaintingsGrid.propTypes = {
  maxPaintings: PropTypes.number,
};

export default PaintingsGrid;
