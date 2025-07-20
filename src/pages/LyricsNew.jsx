import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";
import useDebounce from "../components/hooks/useDebounce";
import axios from "axios";
import { apiUrl } from "../assets/util/api";
import { validateUser } from "../assets/util/api";
import LoadingBox from "../components/common/LoadingBox";
import useIsMobile from "../components/hooks/useIsMobile";
import EmptyData from "../assets/images/Collection list is empty.jpg";
import LyricsCard from "../components/special/LyricsCard";
import LyricsRow from "../components/special/LyricsRow";
import LyricsRowPremium from "../components/special/LyricRowPremium";

const Footer = React.lazy(() => import("../components/common/Footer"));

const Lyrics = () => {
  // Get parameters from the URL
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  const debouncedSearchTerm = useDebounce(searchTerm);

  const [lyrics, setLyrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const [user, setUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [page, setPage] = useState(1);

  const isMobile = useIsMobile();
  const observer = useRef(null);

  const lastUserRef = useCallback(
    (node) => {
      if (loading || page >= totalPages) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, totalPages, page]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setHasToken(true);
    }

    const id = JSON.parse(localStorage.getItem("user") || "{}")?.id;
    if (!id) {
      setUserLoaded(true);
      return;
    }

    const getUser = async () => {
      try {
        const userData = await validateUser(id, token);
        if (!userData) throw new Error("No user returned");
        setUser(userData.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setUserLoaded(true);
      }
    };

    getUser();
  }, []);

  const fetchLyrics = useCallback(
    async (pageNum, override = false) => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${apiUrl}/lyrics/searchLyrics`, {
          params: {
            page: pageNum,
            limit: 20,
            keyword: debouncedSearchTerm,
          },
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        const data = res.data.lyrics;

        if (!Array.isArray(data)) {
          console.error("Expected array, got:", data);
          return [];
        }

        const newData = data;

        setLyrics((prev) => {
          const merged =
            override || pageNum === 1 ? newData : [...prev, ...newData];
          const unique = Array.from(
            new Map(merged.map((item) => [item._id, item])).values()
          );
          return unique;
        });

        setTotalPages(res.data.totalPages);
        setInitialLoadDone(true);
      } catch (err) {
        console.error("Failed to fetch lyrics:", err);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearchTerm]
  );

  useEffect(() => {
    setLyrics([]);
    setPage(1);
    fetchLyrics(1, true);
  }, [debouncedSearchTerm, fetchLyrics]);

  useEffect(() => {
    if (page > 1) fetchLyrics(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const tierMap = {
    guest: 0,
    free: 1,
    premium: 2,
  };

  const getUserType = () => {
    if (!user) return "guest";
    if (user.role === "premium-user") return "premium";
    return "free";
  };

  const userType = getUserType(); // "guest", "free", or "premium"
  const userTier = tierMap[userType]; // 0, 1, or 2

  const shouldHideCollection = (lyricTier = 0) => {
    console.log(`User Tier: ${userTier}, Lyric Tier: ${lyricTier}`);
    return userTier > lyricTier; // hide if user tier is lower
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-screen h-screen">
        <div className="relative flex flex-col w-screen min-h-screen pt-4 md:pt-16">
          <div className="flex justify-between px-4 md:px-24">
            <p className="font-bold text-lg italic">Song List</p>
          </div>

          {/* Search input for lyrics */}
          <div className="py-4 px-4 md:px-24 sticky md:top-12 top-0 bg-white z-10">
            <div className="flex justify-between gap-2">
              <input
                type="text"
                placeholder="သီချင်းရှာကြမယ်..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          {/* Lyrics list */}
          {userLoaded && (
            <div
              className={`grid ${
                loading || lyrics.length > 0
                  ? "md:grid-cols-5 md:place-items-center md:gap-6"
                  : "grid-cols-1 md:gap-12"
              } p-2 pb-16 gap-0 px-4 md:px-24`}
            >
              {(() => {
                if (loading && !initialLoadDone) {
                  return (
                    <>
                      {Array.from({ length: 12 }).map((_, index) => (
                        <LoadingBox key={index} />
                      ))}
                    </>
                  );
                }

                if (lyrics.length === 0) {
                  return (
                    <div className="w-full flex flex-col items-center justify-center gap-4 text-center py-6 text-gray-400">
                      <img
                        src={EmptyData}
                        alt="No data Found"
                        className="w-full md:w-96 opacity-50"
                      />
                    </div>
                  );
                }

                return (
                  <>
                    {userLoaded &&
                      lyrics.map((lyric, index) => {
                        const isLast = index === lyrics.length - 5;
                        return (
                          <div
                            key={lyric._id}
                            className="border-b border-gray-200 last:border-0 border-dashed"
                          >
                            {isMobile ? (
                              user?.role === "premium-user" ? (
                                <>
                                  <LyricsRowPremium
                                    id={lyric._id}
                                    lyric={lyric}
                                    isLast={isLast}
                                    lastUserRef={lastUserRef}
                                    hideCollection={!hasToken}
                                  />
                                </>
                              ) : (
                                <LyricsRow
                                  id={lyric._id}
                                  lyric={lyric}
                                  isLast={isLast}
                                  lastUserRef={lastUserRef}
                                  hideCollection={!hasToken}
                                  access={shouldHideCollection(lyric.tier)}
                                />
                              )
                            ) : (
                              <LyricsCard
                                id={lyric._id}
                                lyric={lyric}
                                lastUserRef={lastUserRef}
                                isLast={isLast}
                                hideCollection={!hasToken}
                              />
                            )}
                          </div>
                        );
                      })}
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </Suspense>
  );
};

export default Lyrics;
