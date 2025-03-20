import Nav from "../components/common/Nav";
import Footer from "../components/common/Footer";
import { BiCaretDown, BiSearch } from "react-icons/bi";
import { useSearchParams } from "react-router-dom";
import LyricsGrid from "../components/special/LyricsGrid";
import mockData from "../assets/data/mockData.json";
import { useState } from "react";

const fetchFromAPI = async (page, itemsPerBatch) => {
  // const response = await fetch(`/api/lyrics?page=${page}&limit=${itemsPerBatch}`);
  // const data = await response.json();
  // return data.lyrics;
  const startIndex = (page - 1) * itemsPerBatch;
  return Promise.resolve(
    mockData.lyrics.slice(startIndex, startIndex + itemsPerBatch)
  );
};

const Lyrics = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") || "");

const handleQueryChange = (e) => {
  setQuery(e.target.value);
};

  // const isMobile = useIsMobile();
  return (
    <>
      <div className="w-screen h-screen overflow-hidden overflow-y-auto">
        <Nav />
        {/* Lyrics */}
        <div className="relative flex flex-col  min-h-screen pt-16">
          <div className="flex justify-between px-4 md:px-24">
            <p className="font-bold text-lg italic">Song List</p>
          </div>
          <div className="flex justify-between gap-2 py-4 px-4 md:px-24 sticky top-12 bg-white shadow-2xs z-10">
            <div className="relative flex items-center">
              <select
                name="categories"
                id="categories"
                className="cursor-pointer w-1.5/5 md:w-32 p-2 pr-8 border border-gray-300 rounded-md appearance-none bg-gray-50 relative"
              >
                <option value="song">သီချင်း</option>
                <option value="artist">တေးရေး</option>
                <option value="key">တေးဆို</option>
                <option value="writer">Key</option>
              </select>
              <BiCaretDown className="absolute right-2"/>
            </div>
            <input
              type="text"
              placeholder="Search"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={query}
              onChange={handleQueryChange}
            />
            <button className="p-2 bg-blue-500 rounded-md cursor-pointer">
              <BiSearch size={20} className="text-white" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 p-2 pb-4 gap-4 md:gap-12 px-4 md:px-24">
            <LyricsGrid fetchLyrics={fetchFromAPI} />
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Lyrics;
