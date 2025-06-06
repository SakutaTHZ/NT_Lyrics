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
import useIsMobile from "../components/hooks/useIsMobile";
import LyricsCard from "../components/special/LyricsCard";
import LyricsRow from "../components/special/LyricsRow";

// Utils
import { fetchPopularLyrics } from "../assets/util/api";
import LoadingBox from "../components/common/LoadingBox";

const Landing = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [popularLyrics, setPopularLyrics] = useState([]);

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
      const token = localStorage.getItem("token");
      const lyrics = await fetchPopularLyrics(token);
      setPopularLyrics(lyrics);
    } catch (err) {
      console.error("Error fetching popular lyrics:", err);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    getPopularLyrics();
  }, [getPopularLyrics]);

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
          {isMobile ? (
            <LyricsRow id={lyric._id} lyric={lyric} hideCollection />
          ) : (
            <LyricsCard id={lyric._id} lyric={lyric} hideCollection />
          )}
        </div>
      ));
  };

  return (
    <div className="w-screen h-screen overflow-hidden overflow-y-auto">
      {/* Hero Section */}
      <div className="animate-down-start relative hero h-2/6 md:h-2/5 w-screen overflow-hidden flex justify-center items-center px-6">
        <img
          src={cover}
          loading="lazy"
          className="absolute inset-0 sm:h-full md:w-full object-fill"
          alt="Cover Background"
        />

        <div className="z-10 w-full md:w-96 p-4 bg-white rounded-md shadow-md flex flex-col gap-3 md:translate-y-12">
          <p className="text-lg font-semibold">သီချင်းရှာကြမယ် ...</p>
          <div className="border border-gray-300 rounded-md p-2 flex items-center gap-2">
            <input
              type="text"
              placeholder="Search Musician or Lyrics"
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

      {/* Featured Lyrics */}
      <div className="relative p-4 pb-0 md:px-24">
        <div className="flex justify-between">
          <p className="font-bold text-lg italic">Featured Lyrics</p>
          <Link
            to="/NT_Lyrics/lyrics"
            className="border border-gray-300 px-2 py-1 rounded-md text-sm text-gray-600 hover:bg-gray-100"
          >
            See All
          </Link>
        </div>

        <div
          className={`grid ${
            loading || popularLyrics.length > 0
              ? "md:grid-cols-5 md:place-items-center"
              : "grid-cols-1"
          } pt-4  pb-4 gap-0 md:gap-12`}
        >
          {renderLyrics()}
        </div>
      </div>

      {/* Featured Videos */}
      <div className="relative p-4 md:px-24">
        <div className="flex justify-between">
          <p className="font-bold text-lg italic">Featured Videos</p>
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
  );
};

export default Landing;
