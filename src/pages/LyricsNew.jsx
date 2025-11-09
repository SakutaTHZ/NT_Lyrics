import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import useDebounce from "../components/hooks/useDebounce";
import axios from "axios";
import { apiUrl } from "../assets/util/api";
import LoadingBox from "../components/common/LoadingBox";
import LyricsRow from "../components/special/LyricsRow";
import LyricsRowPremium from "../components/special/LyricRowPremium";
import { useTranslation } from "react-i18next";
import { BiArrowBack } from "react-icons/bi";
import StickySearch from "../components/common/StickySearch";
import { useAuth } from "../components/hooks/authContext";

// Lazy load Footer
const Footer = React.lazy(() => import("../components/common/Footer"));

// Constants for pagination and API
const LYRICS_PER_PAGE = 50;
const DEBOUNCE_DELAY = 2000;
const LAST_ITEM_OFFSET = 30;

const Lyrics = () => {
  const { t } = useTranslation();
  const { user, isLoading: isAuthLoading } = useAuth(); // Renamed isLoading to isAuthLoading for clarity
  const navigate = useNavigate();

  // Search and Debounce
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCE_DELAY);

  // State for lyrics and pagination
  const [lyrics, setLyrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [initialLoadDone, setInitialLoadDone] = useState(false); // To distinguish initial load from subsequent loads

  // Intersection Observer setup
  const observer = useRef(null);

  /**
   * Memoized access control logic.
   * Calculates user's access tier once on component load or user change.
   */
  const { userTier, isPremium } = useMemo(() => {
    const tierMap = { guest: 0, free: 1, premium: 2 };
    const role = user?.role;
    const isUserPremium = role === "premium-user";
    const userType = !user
      ? "guest"
      : isUserPremium
      ? "premium"
      : "free";
    const tier = tierMap[userType];

    // This function checks if the user has sufficient access for a given lyric tier.
    const shouldHideCollection = (lyricTier = 0) => tier >= lyricTier;
    
    return {
      userTier: tier,
      isPremium: isUserPremium,
      shouldHideCollection, // Passed directly to the component render for clarity
    };
  }, [user]);

  /**
   * Fetch function using `page` as the source of truth for the API call.
   * Use a ref for `totalPages` to ensure the intersection observer callback
   * has the latest value without making `lastUserRef` depend on it,
   * which would cause unnecessary re-creation.
   */
  const totalPagesRef = useRef(totalPages);
  useEffect(() => {
    totalPagesRef.current = totalPages;
  }, [totalPages]);

  const fetchLyrics = useCallback(
    async (pageNum, isNewSearch = false) => {
      // Prevents fetching beyond total pages, only applies to non-initial pages
      if (pageNum > 1 && pageNum > totalPagesRef.current) return;

      setLoading(true);
      
      try {
        const token = localStorage.getItem("token"); // Use local storage token here as fallback/direct access
        
        const res = await axios.get(
          `${apiUrl}/lyrics/searchLyricsByTitleAndAlbum`,
          {
            params: {
              page: pageNum,
              limit: LYRICS_PER_PAGE,
              keyword: debouncedSearchTerm,
            },
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );

        const newLyricsData = res.data.lyrics || [];
        
        setLyrics((prev) => {
          // If it's a new search (page 1) or an explicit override, replace the list.
          // Otherwise, append.
          const merged = isNewSearch ? newLyricsData : [...prev, ...newLyricsData];
          
          // Use a Map to deduplicate by `_id`. This is robust.
          return Array.from(
            new Map(merged.map((item) => [item._id, item])).values()
          );
        });

        setTotalPages(res.data.totalPages);
        
      } catch (err) {
        console.error("Failed to fetch lyrics:", err);
      } finally {
        setLoading(false);
        // Only set initialLoadDone after the very first data fetch attempt finishes.
        if (pageNum === 1) {
          setInitialLoadDone(true);
        }
      }
    },
    [debouncedSearchTerm] // Only re-create when search term changes
  );

  /**
   * Effect for handling new search or initial load.
   * Resets pagination and triggers the first fetch.
   */
  useEffect(() => {
    // Reset state for new search
    setLyrics([]);
    setPage(1);
    setInitialLoadDone(false); // Reset initial load status

    // Trigger the first fetch (page 1)
    fetchLyrics(1, true);

    // No need for a separate prefetch for page 2.
    // Let the infinite scroll handler (lastUserRef/useEffect[page]) handle subsequent pages.
  }, [debouncedSearchTerm, fetchLyrics]);

  /**
   * Effect for fetching next pages triggered by the Intersection Observer.
   */
  useEffect(() => {
    // Only fetch if page is greater than 1 (which means it's triggered by the observer)
    // and if it's within bounds (checked inside fetchLyrics).
    if (page > 1) {
      fetchLyrics(page);
    }
  }, [page, fetchLyrics]);

  /**
   * Intersection Observer callback for infinite scroll.
   * Only depends on `loading` to prevent multiple page increment calls
   * and `totalPagesRef` (which is a mutable ref and doesn't trigger effect/callback re-creation).
   */
  const lastUserRef = useCallback(
    (node) => {
      // Check for loading state and if we've reached the last page
      if (loading || page >= totalPagesRef.current) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, page] // Changed dependency: removed totalPages and uses page for current state check
  );

  // Helper to determine when to show loading skeletons
  const showSkeletons = loading && !initialLoadDone;
  // Helper to determine if we should show "No Lyrics Found"
  const showNoResults = !loading && initialLoadDone && lyrics.length === 0;
  // Helper for conditional rendering within the list
  const shouldRenderLyrics = !isAuthLoading && (showSkeletons || lyrics.length > 0 || showNoResults);


  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-screen h-screen">
        <div className="relative flex flex-col w-screen min-h-screen pt-4 md:pt-16">
          <div className="flex items-center justify-between pb-2 c-text-primary px-4 md:px-24">
            <p className="font-bold text-xl italic flex gap-2 items-center md:gap-4">
              {t("songLyrics")}
            </p>
            <Link to={"/"} className="sticky md:top-12 top-0">
              <BiArrowBack size={24} />
            </Link>
          </div>

          {/* Search */}
          <StickySearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            title={t("searchSongs")}
            redirectTo={() => navigate("/")}
          />

          {/* Lyrics List */}
          {shouldRenderLyrics && (
            <div
              className={`grid ${
                showSkeletons || lyrics.length > 0 ? "" : "grid-cols-1"
              } pb-16 gap-0 px-4 md:px-24`}
            >
              {/* Conditional Rendering Logic (Skeletons, No Results, List) */}
              {showSkeletons ? (
                // Show Skeletons on initial load
                Array.from({ length: 20 }).map((_, i) => <LoadingBox key={i} />)
              ) : showNoResults ? (
                // Show No Results message
                <div className="w-full flex flex-col items-center md:items-start c-bg justify-center gap-4 text-center py-4 c-gray-text opacity-30">
                  No Lyrics Found with &lsquo;{debouncedSearchTerm}&lsquo;
                </div>
              ) : (
                // Render Lyrics List
                lyrics.map((lyric, index) => {
                  // Reference the second-to-last item to trigger fetching the next page 
                  // to give the Intersection Observer a good target.
                  const isLast = index === lyrics.length - LAST_ITEM_OFFSET; 

                  // Determine which component to render based on premium status
                  const LyricComponent = isPremium ? LyricsRowPremium : LyricsRow;

                  return (
                    <div
                      key={lyric._id}
                      className="border-b c-border last:border-0 border-dashed"
                      // Use the ref only on the designated 'last' element
                      ref={isLast ? lastUserRef : null}
                    >
                      <LyricComponent
                        id={lyric._id}
                        lyric={lyric}
                        // isLast prop is redundant if the ref is only on the element above
                        lastUserRef={null} // Pass null as the ref is on the wrapping div
                        hideCollection={!user} // Check if user object exists
                        // Access check only for non-premium component
                        {...(!isPremium && { access: userTier >= lyric.tier })} 
                      />
                    </div>
                  );
                })
              )}
              
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

      <Footer />
    </Suspense>
  );
};

export default Lyrics;