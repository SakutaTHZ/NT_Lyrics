// Imports
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import { Link } from "react-router-dom";

// Assets
import cover from "../assets/images/cover_bg.png";
import EmptyData from "../assets/images/Collection list is empty.jpg";

// Components
import Footer from "../components/common/Footer";
import LyricsRow from "../components/special/LyricsRow";

// Utils
import {
  fetchPopularLyrics,
  fetchTop10Artists,
  validateUser,
} from "../assets/util/api";
import LoadingBox from "../components/common/LoadingBox";

import { useTranslation } from "react-i18next";
import AnnouncementBoard from "../components/common/AnnouncementBoard";

const Landing = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [searchQuery, setSearchQuery] = useState("");
  const [popularLyrics, setPopularLyrics] = useState([]);
  const [popularArtists, setPopularArtists] = useState([]);

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery !== "") {
      navigate(`/NT_Lyrics/lyrics?query=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  const [loading, setLoading] = useState(false);

  const getPopularLyrics = useCallback(async () => {
    try {
      setLoading(true);
      const lyrics = await fetchPopularLyrics(token);
      setPopularLyrics(lyrics);
    } catch (err) {
      console.error("Error fetching popular lyrics:", err);
    }

    setLoading(false);
  }, [token]);

  const getPopularArtists = useCallback(async () => {
    try {
      setLoading(true);
      const artists = await fetchTop10Artists(token);
      setPopularArtists(artists);
    } catch (err) {
      console.error("Error fetching popular lyrics:", err);
    }
  }, [token]);

  useEffect(() => {
    getPopularLyrics();
  }, [getPopularLyrics]);

  useEffect(() => {
    getPopularArtists();
  }, [getPopularArtists]);

  const [user, setUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

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
    return userTier >= lyricTier; // hide if user tier is lower
  };

  const renderLyrics = () => {
    if (loading) {
      return (
        <>
          {Array.from({ length: 5 }).map((_, index) => (
            <LoadingBox key={index} />
          ))}
        </>
      );
    }
    if (popularLyrics.length === 0) {
      return (
        <div className="w-full flex justify-center items-center">
          <img
            src={EmptyData}
            alt="No data Found"
            className="h-42 opacity-50"
          />
        </div>
      );
    }

    return popularLyrics
      .sort((a, b) => b.view_count - a.view_count)
      .slice(0, 5)
      .map((lyric) => (
        <div
          key={lyric._id}
          className="border-b border-gray-200 last:border-0 border-dashed"
        >
          <LyricsRow
            id={lyric._id}
            lyric={lyric}
            access={shouldHideCollection(lyric.tier)}
            hideCollection
          />
        </div>
      ));
  };

  return (
    <>
      {userLoaded && (
        <div className="w-screen h-screen overflow-hidden overflow-y-auto">
          {/* Hero Section */}
          <div className=" relative hero h-2/6 md:h-2/5 w-screen overflow-hidden flex justify-center items-center px-6 rounded-b-lg">
            <img
              src={cover}
              loading="lazy"
              className="absolute inset-0 sm:h-full md:w-full object-fill"
              alt="Cover Background"
            />

            <div className="animate-down-start z-10 w-full md:w-96 p-4 bg-white rounded-md shadow-md flex flex-col gap-4 md:translate-y-12">
              <div className="flex items-center gap-4 md:hidden">
                <p className="font-bold text-sm italic text-blue-500 text-nowrap">
                  NT Lyric & Chord
                </p>
                <span className="w-full h-[1px] bg-blue-100 "></span>
              </div>
              <p className="text-lg font-semibold">
                သီချင်းများနဲ့ ပျော်ရွှင်နိုင်ကြပါစေ ...
              </p>
              <div className="border border-gray-300 rounded-md p-2 flex items-center gap-2">
                <input
                  type="text"
                  placeholder={t("searchSongs")}
                  className="w-full outline-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                  className="p-2 bg-blue-500 rounded-md cursor-pointer"
                  onClick={handleSearch}
                >
                  <BiSearch size={20} className="text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Announcement Board */}
          <AnnouncementBoard/>

          {/* Featured Lyrics */}
          <div className="relative p-4 pb-0 md:px-24">
            <div className="flex justify-between border-b pb-4 border-gray-400 border-dashed">
              <p className="font-bold text-lg italic">{t("featureLyrics")}</p>
              <Link
                to="/NT_Lyrics/lyrics"
                className="border border-gray-300 px-2 py-1 rounded-md text-sm text-white bg-blue-500 hover:bg-blue-600"
              >
                {t("seeAll")}
              </Link>
            </div>

            <div
              className={`grid ${
                loading || popularLyrics.length > 0 ? "" : "grid-cols-1"
              }  pb-4 gap-0`}
            >
              {renderLyrics()}
            </div>
          </div>

          {/* Featured Songs */}
          <div className="relative p-4 pb-0 md:px-24">
            <div className="flex justify-between border-b pb-4 border-gray-400 border-dashed">
              <p className="font-bold text-lg italic">{t("popularArtists")}</p>
              <Link
                to="/NT_Lyrics/artists"
                className="border border-gray-300 px-2 py-1 rounded-md text-sm text-white bg-blue-500  hover:bg-blue-600 "
              >
                {t("seeAll")}
              </Link>
            </div>

            <div
              className={`grid ${
                loading || popularLyrics.length > 0
                  ? "md:grid-cols-5 md:place-items-center"
                  : "grid-cols-1"
              } pt-4  pb-4 gap-0 md:gap-12`}
            >
              {popularArtists.slice(0, 5).map((artist) => (
                <div
                  key={artist.name}
                  className="border-b md:border border-gray-200 last:border-0 border-dashed flex items-center gap-4 p-2 md:px-4 md:w-full md:rounded-md hover:bg-gray-50 cursor-pointer md:bg-white"
                  onClick={() => navigate(`/NT_Lyrics/artist/${artist.id}`)}
                >
                  <img
                    src={artist.photoLink}
                    className="w-12 h-12 object-contain rounded-full"
                  />
                  {artist.name}
                </div>
              ))}
            </div>
          </div>

          {/* Featured Videos */}
          <div className="relative p-4 md:px-24">
            <div className="flex justify-between">
              <p className="font-bold text-lg italic">{t("featureVideos")}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 py-4 gap-4 md:gap-12">
              <div className="w-full aspect-video bg-gray-300 rounded-md">
                <iframe
                  className="w-full h-full rounded-md"
                  src="https://www.youtube-nocookie.com/embed/n_XxP4K1iYA?si=Bo-75TdZD02fZtAf"
                  title="YouTube video player"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      )}
    </>
  );
};

export default Landing;
