import Nav from "../components/common/Nav";
import cover from "../assets/images/cover_bg.png";
import { BiSearch } from "react-icons/bi";
import { Link } from "react-router-dom";
import LyricsCard from "../components/special/LyricsCard";

const Landing = () => {
  return (
    <>
      <div className="w-screen h-screen overflow-y-auto">
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
              <BiSearch size={20} className="flex-shrink-0 text-gray-400" />
              <input
                type="text"
                placeholder="Search Musician or Lyrics"
                className="w-full outline-0"
              />
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
            {Array.from({ length: 12 }).map((_, index) => (
              <LyricsCard key={index} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing;
