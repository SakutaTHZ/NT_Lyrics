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
import { apiUrl, validateUser } from "../assets/util/api";
import LoadingBox from "../components/common/LoadingBox";
import EmptyData from "../assets/images/Collection list is empty.jpg";
import LyricsRow from "../components/special/LyricsRow";
import LyricsRowPremium from "../components/special/LyricRowPremium";
import { useTranslation } from "react-i18next";

const Footer = React.lazy(() => import("../components/common/Footer"));

const Lyrics = () => {
  const { t } = useTranslation();

  // Search params
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  const debouncedSearchTerm = useDebounce(searchTerm);

  // State
  const [lyrics, setLyrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const [user, setUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [page, setPage] = useState(1);

  const observer = useRef(null);

  // Intersection Observer for infinite scroll
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

  // User authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setHasToken(true);

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

  // Fetch function
  const fetchLyrics = useCallback(
    async (pageNum, override = false) => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${apiUrl}/lyrics/searchLyrics`, {
          params: {
            page: pageNum,
            limit: 30,
            keyword: debouncedSearchTerm,
          },
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        const data = res.data.lyrics || [];
        if (!Array.isArray(data)) {
          console.error("Expected array, got:", data);
          return [];
        }

        setLyrics((prev) => {
          const merged =
            override || pageNum === 1 ? data : [...prev, ...data];
          return Array.from(
            new Map(merged.map((item) => [item._id, item])).values()
          );
        });

        setTotalPages(res.data.totalPages);
        setInitialLoadDone(true);
      } catch (err) {
        console.error("Failed to fetch lyrics:", err);
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearchTerm]
  );

  // Initial fetch
  useEffect(() => {
    setLyrics([]);
    setPage(1);
    fetchLyrics(1, true).then(() => {
      // Prefetch page 2 in background if more pages exist
      if (totalPages > 1) {
        fetchLyrics(2);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, fetchLyrics]);

  // Fetch when page changes (after prefetch, will be instant if cached)
  useEffect(() => {
    if (page > 1) fetchLyrics(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Access control logic
  const tierMap = { guest: 0, free: 1, premium: 2 };
  const userType = !user
    ? "guest"
    : user.role === "premium-user"
    ? "premium"
    : "free";
  const userTier = tierMap[userType];
  const shouldHideCollection = (lyricTier = 0) => userTier >= lyricTier;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-screen h-screen">
        <div className="relative flex flex-col w-screen min-h-screen pt-4 md:pt-16">
          <div className="flex justify-between px-4 md:px-24">
            <p className="font-bold text-xl italic text-blue-500 pb-2">
              {t("songLyrics")}
            </p>
          </div>

          {/* Search */}
          <div className="py-2 px-4 md:px-24 sticky md:top-12 top-0 bg-white z-10">
            <input
              type="text"
              placeholder={t("searchSongs")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Lyrics List */}
          {userLoaded && (
            <div
              className={`grid ${
                loading || lyrics.length > 0 ? "" : "grid-cols-1"
              } pb-16 gap-0 px-4 md:px-24`}
            >
              {(() => {
                if (loading && !initialLoadDone) {
                  return Array.from({ length: 12 }).map((_, i) => (
                    <LoadingBox key={i} />
                  ));
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

                return lyrics.map((lyric, index) => {
                  // Trigger earlier — 10 from the end
                  const isLast = index === lyrics.length - 20;
                  return (
                    <div
                      key={lyric._id}
                      className="border-b border-gray-200 last:border-0 border-dashed"
                    >
                      {user?.role === "premium-user" ? (
                        <LyricsRowPremium
                          id={lyric._id}
                          lyric={lyric}
                          isLast={isLast}
                          lastUserRef={lastUserRef}
                          hideCollection={!hasToken}
                        />
                      ) : (
                        <LyricsRow
                          id={lyric._id}
                          lyric={lyric}
                          isLast={isLast}
                          lastUserRef={lastUserRef}
                          hideCollection={!hasToken}
                          access={shouldHideCollection(lyric.tier)}
                        />
                      )}
                    </div>
                  );
                });
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
