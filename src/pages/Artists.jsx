import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Footer from "../components/common/Footer";
import useDebounce from "../components/hooks/useDebounce";
import { useNavigate, Link } from "react-router-dom";
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
// CRITICAL FIX: The offset was too large. Using 5 or 10 is better for a page size of 50.
const LAST_ITEM_OFFSET = 20;

const Artists = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Search State
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCE_DELAY); // Data & Pagination State

  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [initialLoadDone, setInitialLoadDone] = useState(false); // Auth and Refs

  const AUTH_TOKEN_REF = useRef(localStorage.getItem("token"));
  const observer = useRef(null); // 1. CRITICAL: Ref to hold the totalPages state (stable access for callback)
  const totalPagesRef = useRef(1); // 2. CRITICAL: Ref to hold the current page state (stable access for callback)
  const pageRef = useRef(1); // Update totalPagesRef when totalPages state changes

  useEffect(() => {
    totalPagesRef.current = totalPages;
  }, [totalPages]); // Update pageRef when page state changes
  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  const fetchArtists = useCallback(
    async (pageNum, isNewSearch = false) => {
      // Prevent fetching beyond total pages, only applies to non-initial pages
      if (pageNum > 1 && pageNum > totalPagesRef.current) return;

      setLoading(true);

      try {
        const token = AUTH_TOKEN_REF.current;

        const res = await axios.get(`${apiUrl}/artists/search`, {
          params: {
            page: pageNum,
            limit: ARTISTS_PER_PAGE,
            keyword: debouncedSearchTerm,
          },
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        const fetchedArtists = res.data.artists || [];

        setArtists((prev) => {
          const merged = isNewSearch
            ? fetchedArtists
            : [...prev, ...fetchedArtists];

          return Array.from(
            new Map(merged.map((item) => [item._id || item.id, item])).values()
          );
        });

        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Error fetching artists:", err);
      } finally {
        setLoading(false);
        if (pageNum === 1) {
          setInitialLoadDone(true);
        }
      }
    },
    [debouncedSearchTerm]
  ); // CRITICAL FIX: Stabilize Intersection Observer callback

  const lastArtistRef = useCallback(
    (node) => {
      // Use refs for stable access to page and totalPages
      if (loading || pageRef.current >= totalPagesRef.current) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          // Use functional update for setPage
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading] // Dependency ONLY on loading state (and not page)
  ); // Effect 1: Triggered by new search term (debounced)

  useEffect(() => {
    // Reset state for new search
    setArtists([]);
    setPage(1);
    setInitialLoadDone(false); // Fetch page 1 (isNewSearch = true)

    fetchArtists(1, true);
  }, [debouncedSearchTerm, fetchArtists]); // Effect 2: Triggered by page state change (from observer)

  useEffect(() => {
    if (page > 1) {
      fetchArtists(page, false);
    }
  }, [page, fetchArtists]); // Modal State

  const [showArtistDetails, setShowArtistDetails] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null); // Helper variables for cleaner rendering

  const showSkeletons = loading && !initialLoadDone;
  const showNoResults = !loading && initialLoadDone && artists.length === 0;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {" "}
      <div className="w-screen min-h-screen overflow-x-hidden">
        {" "}
        <div className="relative flex flex-col w-screen min-h-screen pt-4 md:pt-16 pb-20 md:pb-8">
          {" "}
          <div className="flex items-center justify-between c-text-primary px-4 md:px-24 pb-2">
            {" "}
            <p className="font-bold text-xl italic flex gap-2 items-center md:gap-4">
              {t("artistsList")}
            </p>
            <Link to={"/"}>
              <BiArrowBack size={24} />
            </Link>
            {" "}
          </div>
         {/* Search */}
          {" "}
          <StickySearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            title={t("searchforArtists")}
            redirectTo={() => navigate("/")}
          />
          {" "}
          <div className="pb-16 px-4 md:px-24">
            {" "}
            {showSkeletons ? (
              // Initial loading skeletons
              <div className="grid grid-cols-1 gap-2">
                {" "}
                {Array.from({ length: 12 }).map((_, i) => (
                  <LoadingBox key={i} />
                ))}
                {" "}
              </div>
            ) : showNoResults ? (
              // Empty state
              <div className="w-full flex flex-col items-center md:items-start c-bg justify-center gap-4 text-center py-4 c-gray-text opacity-30">
                No Artists Found with &lsquo;
                {debouncedSearchTerm}&rsquo;
              </div>
            ) : (
              // Artists list
              <div className="grid gap-0 c-border">
                
                {artists.map((artist, index) => {
                  // Determine the target index for the observer
                  const isLastElement = index === artists.length - 1;
                  const targetIndex = artists.length - LAST_ITEM_OFFSET;
                  const isTarget =
                    artists.length > LAST_ITEM_OFFSET && index === targetIndex;
                  const useLastItem =
                    artists.length <= LAST_ITEM_OFFSET && isLastElement; // Apply ref only to the target item
                  const setRef = isTarget || useLastItem ? lastArtistRef : null;

                  const key = artist._id || artist.id || index;

                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="relative w-full border-b last:border-0 border-dashed c-border py-3 cursor-pointer" // Apply the observer ref to the wrapping element
                      ref={setRef}
                      onClick={() => {
                        setSelectedArtist(artist._id || artist.id);
                        setShowArtistDetails(true);
                      }}
                    >
                      {" "}
                      <div className="flex items-center gap-4">
                       {" "}
                        <img
                          src={
                            artist?.photoLink ||
                            "https://i.pinimg.com/736x/54/75/6c/54756cbcfb2051c46f350ea33a0b78ef.jpg"
                          }
                          alt={artist.name}
                          className="w-14 aspect-square object-contain rounded-full"
                        />
                        {artist.name}
                        {" "}
                      </div>
                      {" "}
                    </motion.div>
                  );
                })}
                {/* Loading spinner for subsequent pages */}
                {" "}
                {loading && page > 1 && (
                  <div className="w-full py-4 flex justify-center">
                   <LoadingBox isSpinner={true} />
                    {" "}
                  </div>
                )}
                {" "}
              </div>
            )}
            {" "}
          </div>
          {" "}
        </div>
        {" "}
      </div>
      <Footer /> {/* Artist Details Modal */}{" "}
      {showArtistDetails && selectedArtist && (
        <ModalContainer
          isOpen={showArtistDetails}
          onClose={() => setShowArtistDetails(false)}
        >
          {" "}
          <Artist
            artistId={selectedArtist}
            onClose={() => setShowArtistDetails(false)}
          />
          {" "}
        </ModalContainer>
      )}
      {" "}
    </Suspense>
  );
};

export default Artists;
