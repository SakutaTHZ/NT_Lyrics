import mockData from "../../assets/data/mockData.json"; // Import mock data
import { useState, useEffect, useRef, useCallback } from "react";
import useIsMobile from "../hooks/useIsMobile";
import LyricsCard from "./LyricsCard";
import LyricsRow from "./LyricsRow";

const LyricsGrid = () => {
  const [lyrics, setLyrics] = useState([]); // Loaded lyrics
  const [page, setPage] = useState(1); // Track pagination
  const [hasMore, setHasMore] = useState(true); // Track if there's more data
  const observerRef = useRef(null); // Intersection observer reference
  const isMobile = useIsMobile();

  // Fetch lyrics with pagination
  const fetchLyrics = useCallback(
    (firstLoad = false) => {
      const itemsPerBatch = firstLoad ? 7 : 7; // First load gets 20, subsequent loads get 5
      const startIndex = (page - 1) * itemsPerBatch;
      const newLyrics = mockData.lyrics.slice(
        startIndex,
        startIndex + itemsPerBatch
      );

      if (newLyrics.length === 0) {
        setHasMore(false);
        return;
      }

      setLyrics((prevLyrics) => [...prevLyrics, ...newLyrics]);
      setPage((prevPage) => prevPage + 1); // Ensure page updates correctly
    },
    [page]
  ); // Dependency on page

  // Load first 20 lyrics on mount
  useEffect(() => {
    fetchLyrics(true);
  }, []);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!hasMore || !observerRef.current) return; // Stop if no more data

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchLyrics(); // Load more lyrics when last item is visible
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [lyrics.length]); // Ensure it re-triggers when lyrics list grows

  return (
    <>
      {lyrics.map((lyric, index) => {
        const isLastItem = index === lyrics.length - 1;
        return (
          <div
            key={index}
            ref={isLastItem ? observerRef : null}
            className="m-0 p-0"
          >
            {isMobile ? (
              <LyricsRow id={index} lyric={lyric} />
            ) : (
              <LyricsCard id={index} lyric={lyric} />
            )}
          </div>
        );
      })}
      {hasMore && <p>Loading more...</p>}
    </>
  );
};

export default LyricsGrid;
