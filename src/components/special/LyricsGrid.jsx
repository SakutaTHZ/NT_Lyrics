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
  const itemsPerBatch = 7;

  // Fetch lyrics with pagination
  useEffect(() => {
    const loadLyrics = async () => {
      const newLyrics = await fetchLyrics(page, itemsPerBatch);
      if (newLyrics.length === 0) {
        setHasMore(false);
        return;
      }
      setLyrics((prevLyrics) => [...prevLyrics, ...newLyrics]);
    };

    loadLyrics();
  }, [page, fetchLyrics]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!hasMore || !observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, lyrics.length]);

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

LyricsGrid.propTypes = {
  fetchLyrics: PropTypes.func.isRequired,
};

export default LyricsGrid;
