import React from "react";
import { BiSearch } from "react-icons/bi";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState, Suspense } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { RadioButton } from "primereact/radiobutton";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import artistsData from "../assets/data/artists.json";
import mockData from "../assets/data/mockSongs.json";
import EmptyData from "../assets/images/Collection list is empty.jpg";

const Nav = React.lazy(() => import("../components/common/Nav"));
const Footer = React.lazy(() => import("../components/common/Footer"));
const LyricsGrid = React.lazy(() => import("../components/special/LyricsGrid"));

function getArtistsByType(artists) {
  if (!artists) return [];
  return artists
    .filter((artist) => artist.type === "artist" || artist.type === "both")
    .map((artist) => ({
      Artist: artist.name,
    }));
}

function getWritersByType(artists) {
  if (!artists) return [];
  return artists
    .filter((artist) => artist.type === "writer" || artist.type === "both")
    .map((artist) => ({
      Writer: artist.name,
    }));
}

const fetchFromAPI = async (page, itemsPerBatch) => {
  const startIndex = (page - 1) * itemsPerBatch;
  return Promise.resolve(mockData.slice(startIndex, startIndex + itemsPerBatch));
};

const Lyrics = () => {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [value, setValue] = useState(searchParams.get("query") || "");

  const [selectedKey, setSelectedKey] = useState("C");
  const [selectedWriters, setSelectedWriters] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState([]);

  const [searchMethod, setSearchMethod] = useState("Song");

  const keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

  const [writers, setWriters] = useState([]);
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const artistsList = getArtistsByType(artistsData);
    const writersList = getWritersByType(artistsData);

    setArtists(artistsList);
    setWriters(writersList);
  }, []);
  const search = (event) => {
    const filteredTitles = mockData // Use the correct data (no `.lyrics` property)
      .filter((item) =>
        item.title.toLowerCase().includes(event.query.toLowerCase()) // Search by title
      )
      .map((item) => item.title); // Return titles
    setItems(filteredTitles); // Set filtered titles
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-screen h-screen overflow-hidden overflow-y-auto">
        <Nav />
        <div className="relative flex flex-col w-screen min-h-screen pt-16">
          <div className="flex justify-between px-4 md:px-24">
            <p className="font-bold text-lg italic">Song List</p>
          </div>
          {}
          <div className="py-4 px-4 md:px-24 sticky top-12 bg-white shadow-2xs z-10">
            {}
            <div className="flex flex-wrap gap-3">
              <div className="flex align-items-center">
                <RadioButton
                  inputId="searchMethod"
                  name="searchMethod"
                  value="Song"
                  onChange={(e) => setSearchMethod(e.value)}
                  checked={searchMethod === "Song"}
                />
                <label htmlFor="searchMethod" className="ml-2">
                  သီချင်း
                </label>
              </div>
              <div className="flex align-items-center">
                <RadioButton
                  inputId="searchMethod"
                  name="searchMethod"
                  value="Writer"
                  onChange={(e) => setSearchMethod(e.value)}
                  checked={searchMethod === "Writer"}
                />
                <label htmlFor="searchMethod" className="ml-2">
                  တေးရေး
                </label>
              </div>
              <div className="flex align-items-center">
                <RadioButton
                  inputId="searchMethod"
                  name="searchMethod"
                  value="Artist"
                  onChange={(e) => setSearchMethod(e.value)}
                  checked={searchMethod === "Artist"}
                />
                <label htmlFor="searchMethod" className="ml-2">
                  တေးဆို
                </label>
              </div>
              <div className="flex align-items-center">
                <RadioButton
                  inputId="searchMethod"
                  name="searchMethod"
                  value="Key"
                  onChange={(e) => setSearchMethod(e.value)}
                  checked={searchMethod === "Key"}
                />
                <label htmlFor="searchMethod" className="ml-2">
                  Key
                </label>
              </div>
            </div>
            {}
            <div className="flex justify-between gap-2 mt-4">
              {searchMethod === "Song" ? (
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
              ) : searchMethod === "Writer" ? (
                <MultiSelect
                  value={selectedWriters}
                  onChange={(e) => setSelectedWriters(e.value)}
                  options={writers}
                  optionLabel="Writer"
                  filter
                  placeholder="တေးရေးရှာကြမယ်"
                  maxSelectedLabels={3}
                  className="w-full md:w-20rem"
                  showSelectAll={false}
                  panelClassName="w-screen md:w-auto"
                />
              ) : searchMethod === "Artist" ? (
                <MultiSelect
                  value={selectedArtist}
                  onChange={(e) => setSelectedArtist(e.value)}
                  options={artists}
                  optionLabel="Artist"
                  filter
                  placeholder="တေးဆိုရှာကြမယ်"
                  maxSelectedLabels={3}
                  className="w-full md:w-20rem"
                  showSelectAll={false}
                  panelClassName="w-screen md:w-auto"
                />
              ) : searchMethod === "Key" ? (
                <Dropdown
                  value={selectedKey}
                  onChange={(e) => setSelectedKey(e.value)}
                  options={keys}
                  optionLabel="name"
                  placeholder="Select a Key"
                  className="w-full"
                />
              ) : (
                <Dropdown
                  value={selectedKey}
                  onChange={(e) => setSelectedKey(e.value)}
                  options={keys}
                  optionLabel="name"
                  placeholder="Select a Key"
                  className="w-full"
                />
              )}

              <button className=" p-2 bg-blue-500 rounded-md cursor-pointer">
                <BiSearch size={20} className="text-white" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 p-2 pb-4 gap-4 md:gap-12 px-4 md:px-24">
            {mockData.length === 0 ? (
              <div className="w-full">
                <img
                  src={EmptyData}
                  alt="No data Found"
                  className="w-full opacity-50"
                />
              </div>
            ) : (
            <LyricsGrid fetchLyrics={fetchFromAPI} />)}
          </div>
        </div>

        <Footer />
      </div>
    </Suspense>
  );
};

export default Lyrics;
