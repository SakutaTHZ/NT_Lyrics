import Nav from "../components/common/Nav";
import LyricsCard from "../components/special/LyricsCard";
import Footer from "../components/common/Footer";

const Lyrics = () => {
  return (
    <>
      <div className="w-screen h-screen overflow-hidden overflow-y-auto">
        <Nav />
        {/* Lyrics */}
        <div className="relative flex flex-col  min-h-screen pt-16">
            
          <div className="flex justify-between px-4 md:px-24">
            <p className="font-bold text-lg italic">Song List</p>
          </div>
          <div className="flex justify-between gap-2 py-4 px-4 md:px-24 sticky top-12 bg-white z-10">
            <select
              name="categories"
              id="categories"
              className="w-2/5 md:w-32 p-2 pr-8 border border-gray-300 rounded-md appearance-none bg-gray-50 relative"
            >
              <option value="song">Song</option>
              <option value="artist">Artist</option>
              <option value="key">Key</option>
              <option value="writer">Writer</option>
            </select>
            <input
              type="text"
              placeholder="Search"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 py-4 gap-4 md:gap-12 px-4 md:px-24">
            {Array.from({ length: 4 }).map((_, index) => (
              <LyricsCard key={index} />
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Lyrics;
