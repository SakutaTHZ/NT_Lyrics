import Nav from "../components/common/Nav";
import cover from "../assets/images/cover_bg.png";
import { BiSearch } from "react-icons/bi";
import { Link } from "react-router-dom";
import LyricsCard from "../components/special/LyricsCard";
import Footer from "../components/common/Footer";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Landing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/NT_Lyrics/lyrics?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <div className="w-screen h-screen overflow-hidden overflow-y-auto">
        <Nav />
        {/* Hero Section */}
        <div className="relative hero h-2/5 overflow-hidden w-screen bg-red-100 flex justify-center items-center px-6">
          <img
            src={cover}
            loading="lazy"
            className="absolute inset-0 sm:h-full md:w-full object-fill"
          />

          <div className="bg-white z-10 w-full md:w-96 p-4 rounded-md shadow-md flex flex-col gap-3  translate-y-12">
            <p className="text-lg font-semibold">သီချင်းရှာကြမယ် ...</p>
            <div className="border border-gray-300 rounded-md p-2 flex items-center gap-2">
              <input
                type="text"
                placeholder="Search Musician or Lyrics"
                className="w-full outline-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Allow "Enter" to trigger search
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
        <div className="relative p-4 md:px-24">
          <div className="flex justify-between">
            <p className="font-bold text-lg italic">Featured Lyrics</p>
            <Link to={"*"} className="text-blue-500">
              See All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 py-4 gap-4 md:gap-12">
            {Array.from({ length: 4 }).map((_, index) => (
              <LyricsCard key={index} />
            ))}
          </div>
        </div>

        {/* featured Videos */}
        <div className="relative p-4 md:px-24">
          <div className="flex justify-between">
            <p className="font-bold text-lg italic">Featured Videos</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 py-4 gap-4 md:gap-12">
            {/* Video Box */}
            <div className="w-full aspect-video bg-gray-300 rounded-md">
              <iframe
                className="w-full h-full rounded-md"
                src="https://www.youtube.com/embed/VSrQi92AvF8?si=yjEmYeIRU9PET0kP"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
            {/* Video Box */}
            <div className="w-full aspect-video bg-gray-300 rounded-md">
              <iframe
                className="w-full h-full rounded-md"
                src="https://www.youtube.com/embed/Tg9yLrJTmTc"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            {/* Video Box */}
            <div className="w-full aspect-video bg-gray-300 rounded-md">
              <iframe
                className="w-full h-full rounded-md"
                src="https://www.youtube.com/embed/rhTZTy1rZhw?si=P7LfdH2chUvsPFX3"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Landing;
