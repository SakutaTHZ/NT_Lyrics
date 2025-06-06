import React, { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState, Suspense } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { RadioButton } from "primereact/radiobutton";
import { Dropdown } from "primereact/dropdown";
import EmptyData from "../assets/images/Collection list is empty.jpg";
import { fetchSingers } from "../assets/util/api";
import { majorkeys } from "../assets/js/constantDatas";
import { apiUrl } from "../assets/util/api";
import axios from "axios";
import useDebounce from "../components/hooks/useDebounce";
import useIsMobile from "../components/hooks/useIsMobile";
import LyricsCard from "../components/special/LyricsCard";
import LyricsRow from "../components/special/LyricsRow";
import { useRef } from "react";
import LoadingBox from "../components/common/LoadingBox";

const Footer = React.lazy(() => import("../components/common/Footer"));

const Lyrics = () => {
  const [searchParams] = useSearchParams();

  const [hasToken, setHasToken] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setHasToken(true);
    }
  }, []);

  const isMobile = useIsMobile();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  const debouncedSearchTerm = useDebounce(searchTerm);
  const [items, setItems] = useState([]);

  const [selectedKey, setSelectedKey] = useState("C");
  const [selectedWriters, setSelectedWriters] = useState("");
  const [selectedArtist, setSelectedArtist] = useState("");

  const [searchMethod, setSearchMethod] = useState("all");

  const [writers, setWriters] = useState([]);
  const [singers, setSingers] = useState([]);

  useEffect(() => {
    const getArtists = async () => {
      try {
        const [singerData, writerData] = await Promise.all([
          fetchSingers("singer"),
          fetchSingers("writer"),
        ]);

        setSingers(singerData);
        setWriters(writerData);
      } catch (err) {
        console.error("Error fetching artists:", err);
      }
    };

    getArtists();
  }, []);

  const search = (event) => {
    const filteredTitles = lyrics
      .filter(
        (item) => item.title.toLowerCase().includes(event.query.toLowerCase()) // Search by title
      )
      .map((item) => item.title); // Return titles
    setItems(filteredTitles); // Set filtered titles
  };

  const valueTemplate = (option) => {
    if (!option) return <span>Selected None</span>;
    const displayText = option.name || "Unknown"; // Handle both dropdowns
    return (
      <div className="flex items-center gap-2">
        <span>{displayText}</span>
      </div>
    );
  };

  const itemTemplate = (option) => {
    const displayText = option.name || "Unknown";
    return (
      <div className="flex items-center gap-2 p-2">
        <span>{displayText}</span>
      </div>
    );
  };

  const [lyrics, setLyrics] = useState([]);

  const [page, setPage] = useState(1);
  const observer = useRef(null);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const lastUserRef = useCallback(
    (node) => {
      if (loading || page >= totalPages) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, totalPages, page]
  );

  const fetchLyrics = useCallback(
    async (pageNum, override = false) => {
      setLoading(true);

      try {
        const token = localStorage.getItem("token"); // or however you're storing it

        const res = await axios.get(`${apiUrl}/lyrics/searchLyrics`, {
          params: {
            page,
            limit: 20,
            type: searchMethod,
            keyword:
              searchMethod === "all"
                ? debouncedSearchTerm
                : searchMethod === "singer"
                ? selectedArtist?._id
                : searchMethod === "writer"
                ? selectedWriters?._id
                : searchMethod === "key"
                ? selectedKey
                : debouncedSearchTerm,
          },
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }), // 🔐 Include the token
          },
        });

        const data = res.data.lyrics;

        if (!Array.isArray(data)) {
          console.error("Expected array, got:", data);
          return [];
        }

        setLyrics((prev) =>
          override || pageNum === 1 ? data : [...prev, ...data]
        );
        setTotalPages(res.data.totalPages);
        setInitialLoadDone(true);
      } catch (error) {
        console.error("Failed to fetch lyrics:", error);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [
      searchMethod,
      debouncedSearchTerm,
      selectedArtist,
      selectedWriters,
      selectedKey,
      page,
    ]
  );

  useEffect(() => {
    fetchLyrics(1, true);
  }, [fetchLyrics]);
  useEffect(() => {
    if (page > 1) {
      fetchLyrics(page, false); // append mode
    }
  }, [page, fetchLyrics]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-screen h-screen overflow-hidden overflow-y-auto">
        <div className="relative flex flex-col w-screen min-h-screen pt-4 md:pt-16">
          <div className="flex justify-between px-4 md:px-24">
            <p className="font-bold text-lg italic">Song List</p>
          </div>
          {}
          <div className="py-4 px-4 md:px-24 sticky md:top-12 top-0 bg-white shadow-2xs z-10">
            {}
            <div className="flex flex-wrap gap-3">
              <div className="flex align-items-center">
                <RadioButton
                  inputId="searchMethod"
                  name="searchMethod"
                  value="all"
                  onChange={(e) => setSearchMethod(e.value)}
                  checked={searchMethod === "all"}
                />
                <label htmlFor="searchMethod" className="ml-2">
                  သီချင်း
                </label>
              </div>
              <div className="flex align-items-center">
                <RadioButton
                  inputId="searchMethod"
                  name="searchMethod"
                  value="writer"
                  onChange={(e) => setSearchMethod(e.value)}
                  checked={searchMethod === "writer"}
                />
                <label htmlFor="searchMethod" className="ml-2">
                  တေးရေး
                </label>
              </div>
              <div className="flex align-items-center">
                <RadioButton
                  inputId="searchMethod"
                  name="searchMethod"
                  value="singer"
                  onChange={(e) => setSearchMethod(e.value)}
                  checked={searchMethod === "singer"}
                />
                <label htmlFor="searchMethod" className="ml-2">
                  တေးဆို
                </label>
              </div>
              <div className="flex align-items-center">
                <RadioButton
                  inputId="searchMethod"
                  name="searchMethod"
                  value="key"
                  onChange={(e) => setSearchMethod(e.value)}
                  checked={searchMethod === "key"}
                />
                <label htmlFor="searchMethod" className="ml-2">
                  Key
                </label>
              </div>
            </div>
            {}
            <div className="flex justify-between gap-2 mt-4">
              {searchMethod === "all" ? (
                <AutoComplete
                  value={searchTerm}
                  suggestions={items}
                  completeMethod={search}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                  placeholder="သီချင်းရှာကြမယ်"
                  pt={{
                    root: "lyrics-searchBox border-gray-300 rounded-md w-full relative",
                    input: "text-gray-900",
                    panel: "shadow-lg border border-gray-200 bg-white",
                    item: "px-4 py-2 hover:bg-gray-200 cursor-pointer",
                  }}
                />
              ) : searchMethod === "writer" ? (
                <>
                  <Dropdown
                    value={selectedWriters}
                    onChange={(e) => setSelectedWriters(e.value)}
                    options={writers}
                    optionLabel="name"
                    placeholder="တေးရေးရှာကြမယ်"
                    className="w-full"
                    showClear
                    filter
                    valueTemplate={valueTemplate}
                    itemTemplate={itemTemplate}
                  />
                </>
              ) : searchMethod === "singer" ? (
                <>
                  <Dropdown
                    value={selectedArtist}
                    onChange={(e) => {
                      setSelectedArtist(e.value);
                    }}
                    options={singers}
                    optionLabel="name"
                    placeholder="တေးဆိုရှာကြမယ်"
                    className="w-full"
                    showClear
                    filter
                    valueTemplate={valueTemplate}
                    itemTemplate={itemTemplate}
                  />
                </>
              ) : searchMethod === "key" ? (
                <Dropdown
                  value={selectedKey}
                  onChange={(e) => setSelectedKey(e.value)}
                  options={majorkeys}
                  optionLabel="name"
                  placeholder="Select a Key"
                  className="w-full"
                />
              ) : (
                <Dropdown
                  value={selectedKey}
                  onChange={(e) => setSelectedKey(e.value)}
                  options={majorkeys}
                  optionLabel="name"
                  placeholder="Select a Key"
                  className="w-full"
                />
              )}
            </div>
          </div>

          <div
            className={`grid ${
              loading || lyrics.length > 0
                ? "md:grid-cols-5 md:place-items-center"
                : "grid-cols-1"
            } p-2 pb-4 gap-0 md:gap-12 px-4 md:px-24`}
          >
            {(() => {
              if (loading) {
                return (
                  <>
                    {Array.from({ length: 12 }).map((_, index) => (
                      <LoadingBox key={index} />
                    ))}
                  </>
                );
              }

              if (lyrics.length === 0) {
                return (
                  <div className="w-full flex flex-col items-center justify-center gap-4 text-center py-6 text-gray-400">
                    {initialLoadDone && (
                      <p className="italic">No lyrics found.</p>
                    )}
                    <img
                      src={EmptyData}
                      alt="No data Found"
                      className="w-full md:w-96 opacity-50"
                    />
                  </div>
                );
              }

              return (
                <>
                  {lyrics.map((lyric, index) => {
                    const isLast = index === lyrics.length - 1;
                    return (
                      <div
                        key={lyric._id}
                        className="border-b border-gray-200 last:border-0 border-dashed"
                      >
                        {isMobile ? (
                          <LyricsRow
                            id={lyric._id}
                            lyric={lyric}
                            isLast={isLast}
                            lastUserRef={lastUserRef}
                            hideCollection={!hasToken}
                          />
                        ) : (
                          <LyricsCard
                            id={lyric._id}
                            lyric={lyric}
                            lastUserRef={lastUserRef}
                            isLast={isLast}
                            hideCollection={!hasToken}
                          />
                        )}
                      </div>
                    );
                  })}
                </>
              );
            })()}
          </div>
        </div>

        <Footer />
      </div>
    </Suspense>
  );
};

export default Lyrics;
