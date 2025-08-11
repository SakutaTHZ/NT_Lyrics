import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Footer from "../components/common/Footer";
import { BiArrowBack, BiSearch } from "react-icons/bi";
import { AutoComplete } from "primereact/autocomplete";
import { useState, useEffect } from "react";
import EmptyData from "../assets/images/Collection list is empty.jpg";
import { useCallback } from "react";
import axios from "axios";
import { apiUrl, fetchArtistById, validateUser } from "../assets/util/api";
import useDebounce from "../components/hooks/useDebounce";
import { useRef } from "react";
import { useSearchParams } from "react-router-dom";
import LyricsRow from "../components/special/LyricsRow";
import LyricsRowPremium from "../components/special/LyricRowPremium";

import { useTranslation } from "react-i18next";

const Artist = () => {
  const { t } = useTranslation();
  const AUTH_TOKEN = useRef(localStorage.getItem("token"));
  const { name } = useParams();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  const debouncedSearchTerm = useDebounce(searchTerm);

  const [artist, setArtist] = useState();
  const [lyrics, setLyrics] = useState([]);

  const [page, setPage] = useState(1);
  const observer = useRef(null);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const [items, setItems] = useState([]);

  const search = (event) => {
    const filteredTitles = lyrics
      .filter(
        (item) => item.title.toLowerCase().includes(event.query.toLowerCase()) // Search by title
      )
      .map((item) => item.title); // Return titles
    setItems(filteredTitles); // Set filtered titles
  };

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
      <div className="w-screen h-screen overflow-hidden overflow-y-auto">
        <div className="relative p-4 py-2 md:px-24 pt-4 md:pt-16 border-b border-dashed border-gray-300">
          <div className="flex items-center justify-between gap-4">
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
            <Link to="/" className="text-blue-500">
              <BiArrowBack size={20} />
            </Link>
          </div>
        </div>

        <div className="flex justify-between gap-2 py-4 px-4 md:px-24 sticky top-0 md:top-12 bg-white  z-10">
          <AutoComplete
            value={searchTerm}
            suggestions={items}
            completeMethod={search}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            placeholder="သီချင်းရှာကြမယ်"
            pt={{
              root: "lyrics-searchBox border-gray-300 rounded-md w-full relative",
              input: "text-gray-900",
              panel: "shadow-lg border border-gray-200 bg-white",
              item: "px-4 py-2 hover:bg-gray-200 cursor-pointer",
            }}
          />
        </div>
        {/* Featured Lyrics */}
        <div className="min-h-5/6 relative p-4 py-0 md:py-2 pt-0 md:px-24">
          <div className="grid grid-cols-1 py-0 gap-0">
            {lyrics.length === 0 ? (
              <div className="w-full">
                <img
                  src={EmptyData}
                  alt="No data Found"
                  className="w-full opacity-50"
                />
              </div>
            ) : (
              <>
                {userLoaded &&
                  lyrics.map((lyric, index) => {
                    const isLast = index === lyrics.length - 1;
                    return (
                      <div key={index} className="m-0 p-0">
                        {user?.role === "premium-user" ? (
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
                        )}
                      </div>
                    );
                  })}
                {loading && (
                  <div className="text-center py-4 text-gray-500 flex items-center justify-center gap-2">
                    <BiSearch
                      style={{
                        display: "inline-block",
                        animation: "wave 3s infinite",
                      }}
                    />
                    Searching more lyrics...
                  </div>
                )}
                {!loading && lyrics.length === 0 && initialLoadDone && (
                  <div className="text-center py-4 text-gray-400 italic">
                    No lyrics found.
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Artist;
