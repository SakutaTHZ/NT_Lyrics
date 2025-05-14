import { useState, useEffect, useRef } from "react";
import useIsMobile from "../hooks/useIsMobile";
import LyricsCard from "./LyricsCard";
import LyricsRow from "./LyricsRow";
import PropTypes from 'prop-types';

const LyricsGrid = ({ fetchLyrics }) => {

  const [lyrics, setLyrics] = useState([]); // Loaded lyrics
  const [page, setPage] = useState(1); // Track pagination
  const [hasMore, setHasMore] = useState(true); // Track if there's more data
  const observerRef = useRef(null); // Intersection observer reference
  const isMobile = useIsMobile();
  const itemsPerBatch = 20;
  const [isLoading, setIsLoading] = useState(false);

  // Fetch lyrics with pagination
  useEffect(() => {
    const loadLyrics = async () => {
      if (isLoading || !hasMore) return;
      setIsLoading(true);

      const newLyrics = await fetchLyrics(page, itemsPerBatch);

      if (!Array.isArray(newLyrics) || newLyrics.length === 0) {
        setHasMore(false);
      } else {
        setLyrics((prevLyrics) => [...prevLyrics, ...newLyrics]);
      }

      setIsLoading(false);
    };

    loadLyrics();
  }, [page, fetchLyrics, hasMore]); // Adding isLoading in the deps ensures it's managed well

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!hasMore || !observerRef.current || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          setPage((prevPage) => prevPage + 1);  // Increment page only when not loading
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasMore, isLoading]); // No need for lyrics.length dependency anymore

  return (
    <>
      {lyrics.map((lyric, index) => {
        return (
          <div key={index} className="m-0 p-0">
            {isMobile ? <LyricsRow id={index} lyric={lyric} /> : <LyricsCard id={index} lyric={lyric} />}
          </div>
        );
      })}
      <div ref={observerRef}></div>
      {isLoading && <p>Loading more...</p>} {/* This is more accurate than showing "Loading more" on `hasMore` */}
    </>
  );
};

LyricsGrid.propTypes = {
  fetchLyrics: PropTypes.func.isRequired,
};

export default LyricsGrid;
