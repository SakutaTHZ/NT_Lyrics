import { useParams } from "react-router-dom";
import Nav from "../components/common/Nav";
import { Link } from "react-router-dom";
import LyricsCard from "../components/special/LyricsCard";
import Footer from "../components/common/Footer";
import { BiArrowBack, BiSearch } from "react-icons/bi";

const Artist = () => {
  const { name } = useParams();
  console.log("Artist Name: ", name);

  return (
    <>
      <div className="w-screen h-screen overflow-hidden overflow-y-auto">
        <Nav />

        <div className="relative p-4 py-2 md:px-24 pt-16 border-b border-dashed border-gray-300">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZwqXtyBSujH-HlZpZgeBViGQ_MLhG2I5FPQ&s`}
                alt="Lyrics"
                className="w-16 h-16 rounded-full"
              />
              <div>
                <p className="font-bold text-xl italic">{name}&apos;s</p>
                <div className="flex items-center gap-4">
                  <p className="text-gray-500">Collection [20]</p>
                </div>
              </div>
            </div>
            <Link to="/NT_Lyrics" className="text-blue-500">
              <BiArrowBack size={20} />
            </Link>
          </div>
        </div>

        <div className="flex justify-between gap-2 py-4 px-4 md:px-24 sticky top-12 bg-white  z-10">
          <input
            type="text"
            placeholder="Search"
            className="w-full p-2 border border-gray-300 rounded-md"
            value=""
          />
          <button className="p-2 bg-blue-500 rounded-md cursor-pointer">
            <BiSearch size={20} className="text-white" />
          </button>
        </div>
        {/* Featured Lyrics */}
        <div className="relative p-4 py-2 pt-0 md:px-24">
          <div className="grid grid-cols-1 md:grid-cols-4 py-4 gap-4 md:gap-12">
            {Array.from({ length: 20 }).map((_, index) => (
              <LyricsCard key={index} id={index} />
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Artist;
