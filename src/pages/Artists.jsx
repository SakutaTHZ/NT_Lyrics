import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Footer from "../components/common/Footer";
import useDebounce from "../components/hooks/useDebounce";
import { useNavigate, Link } from "react-router-dom"; // Combine imports
import { BiArrowBack } from "react-icons/bi";
import { apiUrl } from "../assets/util/api";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Artist from "./Artist";
import ModalContainer from "../components/special/ModalContainer";
import StickySearch from "../components/common/StickySearch";
import LoadingBox from "../components/common/LoadingBox";
import { motion } from "framer-motion";

// Constants
const ARTISTS_PER_PAGE = 50;
const DEBOUNCE_DELAY = 2000;
const LAST_ITEM_OFFSET = 30; // Trigger infinite scroll on the 2nd to last item

const Artists = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Search State
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCE_DELAY);

  // Data & Pagination State
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Set initial to 1
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Auth and Refs
  // Note: Using useRef for token is good, but accessing localStorage directly
  // in the fetch function guarantees the latest value if token changes elsewhere.
  const AUTH_TOKEN_REF = useRef(localStorage.getItem("token"));
  const totalPagesRef = useRef(1); // For observer check
  const observer = useRef(null);

  // Update totalPagesRef when totalPages state changes
  useEffect(() => {
    totalPagesRef.current = totalPages;
  }, [totalPages]);

  const fetchArtists = useCallback(
    async (pageNum, isNewSearch = false) => {
      // Prevent fetching beyond total pages, only applies to non-initial pages
      if (pageNum > 1 && pageNum > totalPagesRef.current) return;

      setLoading(true);

      try {
        // Re-read token here for the most current value, or use the ref
        const token = AUTH_TOKEN_REF.current;

        const res = await axios.get(`${apiUrl}/artists/search`, {
          params: {
            page: pageNum,
            limit: ARTISTS_PER_PAGE,
            keyword: debouncedSearchTerm,
          },
          headers: {
            "Content-Type": "application/json",
            // Only add Authorization header if token exists
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        const fetchedArtists = res.data.artists || [];

        setArtists((prev) => {
          // If it's a new search, replace the list; otherwise, append
          const merged = isNewSearch
            ? fetchedArtists
            : [...prev, ...fetchedArtists];

          // Deduplication is crucial for infinite scroll, though less common
          // with artists than lyrics. Use Map based on unique ID if available.
          // Assuming `_id` or `id` is the unique key. Using `_id` based on JSX usage.
          return Array.from(
            new Map(merged.map((item) => [item._id || item.id, item])).values()
          );
        });

        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Error fetching artists:", err);
      } finally {
        setLoading(false);
        // Only mark initial load done after the first page fetch completes
        if (pageNum === 1) {
          setInitialLoadDone(true);
        }
      }
    },
    [debouncedSearchTerm] // Only recreate when search term changes
  );

  // Intersection Observer callback
  const lastArtistRef = useCallback(
    (node) => {
      // Check for loading state and if we've reached the last page (using ref)
      if (loading || page >= totalPagesRef.current) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, page] // Only depends on loading and current page
  );

  // Effect 1: Triggered by new search term (debounced)
  useEffect(() => {
    // Reset state for new search
    setArtists([]);
    setPage(1);
    setInitialLoadDone(false);

    // Fetch page 1 (isNewSearch = true)
    fetchArtists(1, true);

    // Removed the manual prefetch of page 2; the page useEffect handles subsequent fetches.
  }, [debouncedSearchTerm, fetchArtists]);

  // Effect 2: Triggered by page state change (from observer)
  useEffect(() => {
    if (page > 1) {
      fetchArtists(page, false);
    }
  }, [page, fetchArtists]);

  // Modal State
  const [showArtistDetails, setShowArtistDetails] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);

  // Helper variables for cleaner rendering
  const showSkeletons = loading && !initialLoadDone;
  const showNoResults = !loading && initialLoadDone && artists.length === 0;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* Moved overflow styles to a container that doesn't hide scrollbar */}
      <div className="w-screen min-h-screen overflow-x-hidden">
        <div className="relative flex flex-col w-screen min-h-screen pt-4 md:pt-16 pb-20 md:pb-8">
          <div className="flex items-center justify-between c-text-primary px-4 md:px-24 pb-2">
            <p className="font-bold text-xl italic flex gap-2 items-center md:gap-4">
              {t("artistsList")}
            </p>
            <Link to={"/"}>
              <BiArrowBack size={24} />
            </Link>
          </div>

          {/* Search */}
          <StickySearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            title={t("searchforArtists")}
            redirectTo={() => navigate("/")}
          />

          <div className="pb-16 px-4 md:px-24">
            {showSkeletons ? (
              // Initial loading skeletons
              <div className="grid grid-cols-1 gap-2">
                {Array.from({ length: 12 }).map((_, i) => (
                  <LoadingBox key={i} />
                ))}
              </div>
            ) : showNoResults ? (
              // Empty state
              <div className="w-full flex flex-col items-center md:items-start c-bg justify-center gap-4 text-center py-4 c-gray-text opacity-30">
                No Artists Found with &lsquo;{debouncedSearchTerm}&rsquo;
              </div>
            ) : (
              // Artists list
              <div className="grid gap-0 c-border">
                {artists.map((artist, index) => {
                  // Reference the item close to the bottom to trigger the next fetch
                  const isLastElement =
                    index === artists.length - LAST_ITEM_OFFSET;

                  // Use a stable key (e.g., _id)
                  const key = artist._id || artist.id || index;

                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="relative w-full border-b last:border-0 border-dashed c-border py-3 cursor-pointer"
                      // Apply the observer ref to the wrapping element
                      ref={isLastElement ? lastArtistRef : null}
                      onClick={() => {
                        setSelectedArtist(artist._id || artist.id);
                        setShowArtistDetails(true);
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            artist?.photoLink ||
                            "https://i.pinimg.com/736x/54/75/6c/54756cbcfb2051c46f350ea33a0b78ef.jpg"
                          }
                          alt={artist.name} // Added alt text for accessibility
                          className="w-14 aspect-square object-contain rounded-full"
                        />
                        {artist.name}
                      </div>
                    </motion.div>
                  );
                })}

                {/* Loading spinner for subsequent pages */}
                {loading && page > 1 && (
                  <div className="w-full py-4 flex justify-center">
                    <LoadingBox isSpinner={true} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />

      {/* Artist Details Modal */}
      {showArtistDetails && selectedArtist && (
        <ModalContainer
          isOpen={showArtistDetails}
          onClose={() => setShowArtistDetails(false)}
        >
          {/* Ensure Artist component receives a valid ID */}
          <Artist
            artistId={selectedArtist}
            onClose={() => setShowArtistDetails(false)}
          />
        </ModalContainer>
      )}
    </Suspense>
  );
};

export default Artists;
