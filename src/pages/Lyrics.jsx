import Nav from "../components/common/Nav";
import Footer from "../components/common/Footer";
import {
  // BiCaretDown,
  BiSearch,
} from "react-icons/bi";
import { useSearchParams } from "react-router-dom";
import LyricsGrid from "../components/special/LyricsGrid";
import mockData from "../assets/data/mockSongs.json";
import { useState } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { RadioButton } from "primereact/radiobutton";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";

const fetchFromAPI = async (page, itemsPerBatch) => {
  // const response = await fetch(`/api/lyrics?page=${page}&limit=${itemsPerBatch}`);
  // const data = await response.json();
  // return data.lyrics;
  const startIndex = (page - 1) * itemsPerBatch;
  return Promise.resolve(
    mockData.slice(startIndex, startIndex + itemsPerBatch)
  );
};

const Lyrics = () => {
  const [searchParams] = useSearchParams();

  const [items, setItems] = useState([]);
  const [value, setValue] = useState(searchParams.get("query") || "");

  const search = (event) => {
    const filteredTitles = mockData.lyrics
      .filter((item) =>
        item.title.toLowerCase().includes(event.query.toLowerCase())
      )
      .map((item) => item.title);

    console.log(filteredTitles);
    setItems(filteredTitles);
  };

  // Music Major Keys Array
  const keys = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];

  const [selectedKey, setSelectedKey] = useState(keys[0]);
  const [selectedWriters, setSelectedWriters] = useState([]);
  const writers = [
    { Writer: "Writer 1" },
    { Writer: "Writer 2" },
    { Writer: "Writer 3" },
  ];

  const [searchMethod, setSearchMethod] = useState("Song");

  

  return (
    <>
      <div className="w-screen h-screen overflow-hidden overflow-y-auto">
        <Nav />
        {/* Lyrics */}
        <div className="relative flex flex-col w-screen min-h-screen pt-16">
          <div className="flex justify-between px-4 md:px-24">
            <p className="font-bold text-lg italic">Song List</p>
          </div>
          {/* FilterBox */}
          <div className="py-4 px-4 md:px-24 sticky top-12 bg-white shadow-2xs z-10">
            {/* Filter Options */}
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
            {/* Search Area */}
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
                    root: "lyrics-searchBox border-gray-300 rounded-md w-full relative", // Root wrapper
                    input: "text-gray-900", // Input field
                    panel: "shadow-lg border border-gray-200 bg-white", // Suggestion panel
                    item: "px-4 py-2 hover:bg-gray-200 cursor-pointer", // Suggestion items
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
                  value={selectedWriters}
                  onChange={(e) => setSelectedWriters(e.value)}
                  options={writers}
                  optionLabel="Writer"
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
            <LyricsGrid fetchLyrics={fetchFromAPI} />
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Lyrics;
