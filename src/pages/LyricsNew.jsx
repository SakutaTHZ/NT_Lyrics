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
// CRITICAL FIX: LAST_ITEM_OFFSET should be a small positive number (e.g., 5 or 10)
// to trigger the fetch before the end, not 30 for a page size of 50.
const LAST_ITEM_OFFSET = 20;

const Lyrics = () => {
  const { t } = useTranslation();
  const { user, isLoading: isAuthLoading, token: authContextToken } = useAuth();
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
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Intersection Observer setup
  const observer = useRef(null);

  // CRITICAL FIX: Stabilize totalPages access for infinite scroll check
  const totalPagesRef = useRef(totalPages);
  useEffect(() => {
    totalPagesRef.current = totalPages;
  }, [totalPages]);

  // FIX: Stabilize 'page' state access for Intersection Observer logic
  const pageRef = useRef(page);
  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  /**
   * Memoized access control logic.
   * Moved the logic into a memo for clean access to user roles.
   */
  const { isPremium, shouldHideCollection } = useMemo(() => {
    const tierMap = { guest: 0, free: 1, premium: 2 };
    const role = user?.role;
    const isUserPremium = role === "premium-user";
    const userType = !user ? "guest" : isUserPremium ? "premium" : "free";
    const tier = tierMap[userType];

    const hideCollection = (lyricTier = 0) => tier >= lyricTier;

    return {
      userTier: tier,
      isPremium: isUserPremium,
      shouldHideCollection: hideCollection,
    };
  }, [user]);

  const fetchLyrics = useCallback(
    async (pageNum, isNewSearch = false) => {
      // Prevents fetching beyond total pages, uses the stable ref
      if (pageNum > 1 && pageNum > totalPagesRef.current) {
        setLoading(false); // Ensure loading is stopped if check fails
        return;
      }

      setLoading(true);

      try {
        // Use the token from the Auth context if available, or fall back to localStorage
        const token = authContextToken || localStorage.getItem("token");

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
          const merged = isNewSearch
            ? newLyricsData
            : [...prev, ...newLyricsData];

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
        if (pageNum === 1) {
          setInitialLoadDone(true);
        }
      }
    },
    [debouncedSearchTerm, authContextToken] // Added authContextToken as a dependency
  );

  /**
   * Effect 1: Handling new search or initial load.
   * Triggers when the DEBOUNCED search term changes.
   */
  useEffect(() => {
    // Reset state for new search
    setLyrics([]);
    setPage(1);
    setInitialLoadDone(false);

    // Trigger the first fetch (page 1)
    fetchLyrics(1, true);
  }, [debouncedSearchTerm, fetchLyrics]);

  /**
   * Effect 2: Fetching next pages triggered by the Intersection Observer.
   * Triggers when the `page` state increments.
   */
  useEffect(() => {
    // Only fetch if page is greater than 1 (which means it's triggered by the observer)
    if (page > 1) {
      fetchLyrics(page);
    }
  }, [page, fetchLyrics]);

  /**
   * CRITICAL FIX: Intersection Observer callback must be highly stable.
   * By removing 'page' from the dependency array and using 'pageRef.current',
   * we prevent the callback from being recreated on every page state change,
   * which can lead to the observer not re-connecting correctly in certain browser environments.
   */
  const lastUserRef = useCallback(
    (node) => {
      // Use the stable ref for totalPages check
      if (loading || pageRef.current >= totalPagesRef.current) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          // Use a functional update to ensure we get the latest state
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading] // Only depends on loading state
  );

  // Helper to determine when to show loading skeletons
  const showSkeletons = loading && !initialLoadDone;
  // Helper to determine if we should show "No Lyrics Found"
  const showNoResults = !loading && initialLoadDone && lyrics.length === 0;
  // Helper for conditional rendering within the list
  const shouldRenderLyrics =
    !isAuthLoading && (showSkeletons || lyrics.length > 0 || showNoResults);

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
                  // Determine where to place the Intersection Observer target
                  const isLastItem = index === lyrics.length - 1;
                  const targetIndex = lyrics.length - LAST_ITEM_OFFSET;
                  const isTarget =
                    lyrics.length > LAST_ITEM_OFFSET && index === targetIndex;
                  // If the list is short, target the last item instead of relying on offset
                  const useLastItem =
                    lyrics.length <= LAST_ITEM_OFFSET && isLastItem;

                  // Reference the target item
                  const setRef = isTarget || useLastItem ? lastUserRef : null;

                  // Determine which component to render based on premium status
                  const LyricComponent = isPremium
                    ? LyricsRowPremium
                    : LyricsRow;

                  return (
                    <div
                      key={lyric._id}
                      className="border-b c-border last:border-0 border-dashed"
                      // Use the ref only on the designated 'target' element
                      ref={setRef}
                    >
                      <LyricComponent
                        id={lyric._id}
                        lyric={lyric}
                        lastUserRef={null}
                        hideCollection={!user}
                        // Access check only for non-premium component
                        {...(!isPremium && {
                          access: shouldHideCollection(lyric.tier),
                        })}
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
