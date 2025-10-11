import Footer from "../components/common/Footer";
import { BiArrowBack, BiSearch } from "react-icons/bi";
//import { AutoComplete } from "primereact/autocomplete";
import { useState, useEffect } from "react";
import { useCallback } from "react";
import axios from "axios";
import { apiUrl, fetchArtistById, validateUser } from "../assets/util/api";
import useDebounce from "../components/hooks/useDebounce";
import { useRef } from "react";
import { useSearchParams } from "react-router-dom";
import LyricsRow from "../components/special/LyricsRow";
import LyricsRowPremium from "../components/special/LyricRowPremium";

import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

const Artist = ({ artistId, onClose }) => {
  const { t } = useTranslation();
  const AUTH_TOKEN = useRef(localStorage.getItem("token"));
  const name = artistId;
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  const debouncedSearchTerm = useDebounce(searchTerm);

  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    // after animation duration, call the parent onClose
    setTimeout(() => {
      onClose();
    }, 300); // match your transition duration
  };

  const [artist, setArtist] = useState();
  const [lyrics, setLyrics] = useState([]);

  const [page, setPage] = useState(1);
  const observer = useRef(null);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  //const [items, setItems] = useState([]);

  /*const search = (event) => {
    const filteredTitles = lyrics
      .filter(
        (item) => item.title.toLowerCase().includes(event.query.toLowerCase()) // Search by title
      )
      .map((item) => item.title); // Return titles
    setItems(filteredTitles); // Set filtered titles
  };*/

  const lastUserRef = useCallback(
    (node) => {
      if (loading || page >= totalPages) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, totalPages, page]
  );

  const getArtist = useCallback(async () => {
    try {
      const artist = await fetchArtistById(localStorage.getItem("token"), name);
      setArtist(artist);
    } catch (err) {
      console.error("Error fetching user overview:", err);
    }
  }, [name]);

  const [lyricsCount, setLyricsCount] = useState(0);

  const getLyricsCountByArtist = useCallback(async () => {
    try {
      const res = await axios.get(
        `${apiUrl}/lyrics/getLyricsCountByArtist?artistId=${name}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AUTH_TOKEN.current}`,
          },
        }
      );
      setLyricsCount(res.data.lyricsCount);
    } catch (err) {
      console.error("Error fetching user overview:", err);
    }
  }, [name]);

  useEffect(() => {
    getLyricsCountByArtist();
  }, [getLyricsCountByArtist]);

  const fetchLyrics = useCallback(
    async (pageNum, override = false) => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${apiUrl}/lyrics/getLyricsByArtist?artistId=${name}`,
          {
            params: {
              page: pageNum,
              limit: 20,
              keyword: debouncedSearchTerm,
            },
          }
        );

        const data = res.data.lyrics;

        if (!Array.isArray(data)) {
          console.error("Expected array, got:", data);
          return [];
        }

        setLyrics((prev) =>
          override || pageNum === 1
            ? res.data.lyrics
            : [...prev, ...res.data.lyrics]
        );
        setTotalPages(res.data.totalPages);
        setInitialLoadDone(true);
      } catch (error) {
        console.error("Failed to fetch lyrics:", error);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearchTerm, name]
  );

  const [hasToken, setHasToken] = useState(false);
  const [user, setUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);

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

  useEffect(() => {
    fetchLyrics(1, true);
    getArtist();
  }, [fetchLyrics, getArtist]);

  useEffect(() => {
    if (page > 1) {
      fetchLyrics(page, false); // append mode
    }
  }, [page, fetchLyrics]);

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
    return userTier >= lyricTier;
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && artistId && (
          <motion.div
            className="w-screen h-screen absolute inset-0 z-20 c-bg overflow-hidden overflow-y-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* ...all your modal content here... */}
            <div className="relative p-4 py-4 md:px-24 md:pt-16">
              <div className="flex items-center justify-between gap-4">
                {/* header content */}

                <div className="flex items-center gap-4">
                  <img
                    src={artist?.photoLink || "https://via.placeholder.com/150"}
                    loading="lazy"
                    alt="Lyrics"
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    {artist ? (
                      <p className="font-bold text-xl italic flex items-center gap-2">
                        {artist.name}
                        <span className="text-sm text-gray-500 font-normal">
                          {" "}
                          [
                          {artist.type === "singer"
                            ? t("singer")
                            : artist.type === "writer"
                            ? t("writer")
                            : `${t("singer")} / ${t("writer")}`}{" "}
                          ]
                        </span>
                      </p>
                    ) : (
                      <p className="text-gray-400 italic">Loading artist...</p>
                    )}
                    <div className="flex items-center gap-4">
                      <p className="text-gray-500">
                        {lyricsCount} {lyrics.length > 1 ? "songs" : "song"}
                      </p>
                    </div>
                  </div>
                </div>
                <button onClick={handleClose} className="text-blue-500">
                  <BiArrowBack size={20} />
                </button>
              </div>
            </div>

            <div className="flex justify-between gap-2  px-4 md:px-24 sticky top-0 md:top-12 c-bg z-10">
              {/*<AutoComplete
                value={searchTerm}
                suggestions={items}
                completeMethod={search}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                placeholder="သီချင်းရှာကြမယ်"
                pt={{
                  root: "lyrics-searchBox border-gray-300 rounded-md w-full relative",
                  input: "text-gray-900 c-bg",
                  panel: "shadow-lg border c-border",
                  item: "px-4 py-2 hover:bg-gray-200 cursor-pointer",
                }}
              />*/}
            </div>
            
            <StickySearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} title={t("searchSongs")} redirectTo={handleClose}/>
            {/* Featured Lyrics */}
            <div className="min-h-5/6 relative p-4 py-0 md:py-2 pt-0 md:px-24">
              <div className="grid grid-cols-1 py-0 gap-0">
                {loading && !initialLoadDone ? (
                  Array.from({ length: 12 }).map((_, i) => (
                    <LoadingBox key={i} />
                  ))
                ) : (
                  <>
                    {userLoaded &&
                      lyrics.map((lyric, index) => {
                        const isLast = index === lyrics.length - 1;
                        return (
                          <div key={index} className="border-b c-border last:border-0 border-dashed">
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
                      })}
                    {loading && (
                      <div className="text-center  c-gray-text flex items-center justify-center gap-2 opacity-30">
                        <BiSearch
                          style={{
                            display: "inline-block",
                            animation: "wave 3s infinite",
                          }}
                        />
                        Searching for lyrics...
                      </div>
                    )}
                    {!loading && lyrics.length === 0 && initialLoadDone && (
                      <div className="w-full flex flex-col items-center md:items-start c-bg justify-center gap-4 text-center c-gray-text opacity-30">
                        No Lyrics Found
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

import PropTypes from "prop-types";
import LoadingBox from "../components/common/LoadingBox";
import StickySearch from "../components/common/StickySearch";

Artist.propTypes = {
  artistId: PropTypes.string,
  onClose: PropTypes.func,
};

export default Artist;
