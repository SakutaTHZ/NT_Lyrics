import { useParams } from "react-router-dom";
import Nav from "../components/common/Nav";
import { Link } from "react-router-dom";
import LyricsGrid from "../components/special/LyricsGrid";
import Footer from "../components/common/Footer";
import { BiArrowBack, BiSearch } from "react-icons/bi";
import mockData from "../assets/data/mockSongs.json";
import { AutoComplete } from "primereact/autocomplete";
import { useState } from "react";
import EmptyData from "../assets/images/Collection list is empty.jpg";

const fetchArtistLyrics = async (page, itemsPerBatch) => {
  // const response = await fetch(`/api/user/saved-lyrics?page=${page}&limit=${itemsPerBatch}`);
  // const data = await response.json();
  // return data.lyrics;
  const startIndex = (page - 1) * itemsPerBatch;
  return Promise.resolve(
    mockData.slice(startIndex, startIndex + itemsPerBatch)
  );
};

const Artist = () => {
  const { name } = useParams();

  //For AutoComplete Search
  const [value, setValue] = useState("");
  const [items, setItems] = useState([]);
  const search = (event) => {
    const filteredTitles = mockData
      .filter(
        (item) => item.title.toLowerCase().includes(event.query.toLowerCase()) // Search by title
      )
      .map((item) => item.title); // Return titles
    setItems(filteredTitles); // Set filtered titles
  };

  return (
    <>
      <div className="w-screen h-screen overflow-hidden overflow-y-auto">
        <Nav />

        <div className="relative p-4 py-2 md:px-24 pt-16 border-b border-dashed border-gray-300">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZwqXtyBSujH-HlZpZgeBViGQ_MLhG2I5FPQ&s`} //Need to replace this after API
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
          <AutoComplete
            value={value}
            suggestions={items}
            completeMethod={search}
            onChange={(e) => setValue(e.value)}
            className="w-full"
            placeholder="သီချင်းရှာကြမယ်"
            pt={{
              root: "lyrics-searchBox border-gray-300 rounded-md w-full relative",
              input: "text-gray-900",
              panel: "shadow-lg border border-gray-200 bg-white",
              item: "px-4 py-2 hover:bg-gray-200 cursor-pointer",
            }}
          />
          <button className="p-2 bg-blue-500 rounded-md cursor-pointer">
            <BiSearch size={20} className="text-white" />
          </button>
        </div>
        {/* Featured Lyrics */}
        <div className="min-h-5/6 relative p-4 py-2 pt-0 md:px-24">
          <div className="grid grid-cols-1 md:grid-cols-4 py-4 gap-4 md:gap-12">
            {mockData.length === 0 ? (
              <div className="w-full">
                <img
                  src={EmptyData}
                  alt="No data Found"
                  className="w-full opacity-50"
                />
              </div>
            ) : (
              <LyricsGrid fetchLyrics={fetchArtistLyrics} />
            )}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Artist;
