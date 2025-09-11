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
      .map((lyric, i) => (
        <div
          key={lyric._id}
          className="border-b border-gray-200 last:border-0 border-dashed flex"
        >
          <span className="py-5 px-2 w-2 mr-2 font-semibold">{i + 1}.</span>
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
              className="absolute inset-0 sm:h-full md:w-full object-cover object-top"
              alt="Cover Background"
            />

            <div className="animate-down-start relative z-10 w-full md:w-96 p-4 bg-white rounded-md shadow-md flex flex-col gap-4 md:translate-y-12">
              <div className="flex items-center gap-4 md:hidden">
                <p className="font-bold text-sm italic text-blue-500 text-nowrap">
                  NT Lyric & Chord
                  <span
                    className={`animate-down-start text-xs font-normal px-3 py-0.5 ml-2 rounded-full ${
                      user?.role === "premium-user"
                        ? "bg-amber-200 text-gray-800"
                        : "hidden"
                    }`}
                  >
                    premium
                  </span>
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

          <div className="flex flex-col items-center  p-4 py-0 md:px-24 mt-4 gap-4">
            {/* Announcement Board */}
            <AnnouncementBoard />

            {/* Support Us */}
            {user?.role === "free-user" && (
              <div className="relative w-full">
                <div className="relative flex justify-between border py-4 border-gray-200 rounded-md px-4 bg-linear-to-br from-blue-400 to-blue-200 mx-auto overflow-hidden">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1440 320"
                    className="absolute bottom-0 left-0"
                  >
                    <path
                      fill="#ffffff50"
                      d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    ></path>
                  </svg>

                  <p className="z-2 text-xl font-bold w-1/2 text-white">
                    Support us by buying the Premium version
                  </p>
                  <button
                    className="border border-white px-4 py-2 rounded-md text-sm font-semibold bg-white text-blue-500 hover:bg-blue-200 self-center"
                    onClick={() => navigate("/NT_Lyrics/premium")}
                  >
                    {t("upgradeNow")}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Featured Lyrics */}
          <div className="relative p-4 pb-0 md:px-24">
            <div className="flex justify-between border-b py-4 border-gray-200 border-dashed gradientTitle">
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
            <div className="flex justify-between border-b py-4 border-gray-200 border-dashed  gradientTitle">
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
                loading || popularLyrics.length > 0 ? "" : "grid-cols-1"
              }`}
            >
              {popularArtists.slice(0, 5).map((artist, i) => (
                <div
                  key={artist.name}
                  className="border-b border-gray-200 last:border-0 border-dashed flex items-center gap-4 p-2 md:px-4 md:w-full md:rounded-md hover:bg-gray-50 cursor-pointer md:bg-white"
                  onClick={() => navigate(`/NT_Lyrics/artist/${artist.id}`)}
                >
                  <span className="py-5 w-2 font-semibold">{i + 1}.</span>
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
