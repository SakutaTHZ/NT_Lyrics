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
  const itemsPerBatch = 7;

  // Fetch lyrics with pagination
  const fetchLyrics = useCallback(() => {
    const startIndex = (page - 1) * itemsPerBatch;
    const newLyrics = mockData.lyrics.slice(startIndex, startIndex + itemsPerBatch);

    if (newLyrics.length === 0) {
      setHasMore(false);
      return;
    }

    setLyrics((prevLyrics) => [...prevLyrics, ...newLyrics]);
  }, [page]);

  // Load first batch on mount
  useEffect(() => {
    fetchLyrics();
  }, [fetchLyrics]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!hasMore || !observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1); // Move page update to useEffect
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, lyrics.length]); // Only re-trigger when lyrics list grows

  return (
    <>
      {lyrics.map((lyric, index) => {
        const isLastItem = index === lyrics.length - 1;
        return (
          <div key={index} ref={isLastItem ? observerRef : null} className="m-0 p-0">
            {isMobile ? <LyricsRow id={index} lyric={lyric} /> : <LyricsCard id={index} lyric={lyric} />}
          </div>
        );
      })}
      {hasMore && <p>Loading more...</p>}
    </>
  );
};

export default LyricsGrid;
