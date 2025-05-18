import { useParams } from "react-router-dom";
import Nav from "../components/common/Nav";
import { Link } from "react-router-dom";
import Footer from "../components/common/Footer";
import { BiArrowBack, BiSearch } from "react-icons/bi";
import mockData from "../assets/data/mockSongs.json";
import { AutoComplete } from "primereact/autocomplete";
import { useState, useEffect } from "react";
import EmptyData from "../assets/images/Collection list is empty.jpg";
import { useCallback } from "react";
import axios from "axios";
import useIsMobile from "../components/hooks/useIsMobile";
import { apiUrl, fetchArtistById } from "../assets/util/api";
import useDebounce from "../components/hooks/useDebounce";
import { useRef } from "react";
import { useSearchParams } from "react-router-dom";
import LyricsCard from "../components/special/LyricsCard";
import LyricsRow from "../components/special/LyricsRow";

const Artist = () => {
  const { name } = useParams();
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  const debouncedSearchTerm = useDebounce(searchTerm);

  const [artist, setArtist] = useState();
  const [lyrics, setLyrics] = useState([]);

  const [page, setPage] = useState(1);
  const observer = useRef(null);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const [items, setItems] = useState([]);
  const search = (event) => {
    const filteredTitles = mockData
      .filter(
        (item) => item.title.toLowerCase().includes(event.query.toLowerCase()) // Search by title
      )
      .map((item) => item.title); // Return titles
    setItems(filteredTitles); // Set filtered titles
  };

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

  const getArtist = useCallback(async () => {
    try {
      const artist = await fetchArtistById(localStorage.getItem("token"), name);
      setArtist(artist);
    } catch (err) {
      console.error("Error fetching user overview:", err);
    }
  }, [name]);

  const fetchLyrics = useCallback(
    async (pageNum, override = false) => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${apiUrl}/lyrics/getLyricsByArtist?artistId=${name}`,
          {
            params: {
              page,
              limit: 20,
              keyword: debouncedSearchTerm,
            },
          }
        );

        const data = res.data.lyrics;

        if (!Array.isArray(data)) {
          console.error("Expected array, got:", data);
          return [];
        }

        setLyrics((prev) =>
          override || pageNum === 1
            ? res.data.lyrics
            : [...prev, ...res.data.lyrics]
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
    [debouncedSearchTerm, name, page]
  );

  useEffect(() => {
    fetchLyrics(1, true);
    getArtist();
  }, [fetchLyrics, getArtist]);
  useEffect(() => {
    if (page > 1) {
      fetchLyrics(page, false); // append mode
    }
  }, [page, fetchLyrics]);
  return (
    <>
      <div className="w-screen h-screen overflow-hidden overflow-y-auto">
        <Nav />

        <div className="relative p-4 py-2 md:px-24 pt-16 border-b border-dashed border-gray-300">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={artist?.photoLink || "https://via.placeholder.com/150"}
                loading="lazy"
                alt="Lyrics"
                className="w-16 h-16 rounded-full"
              />
              <div>
                {artist ? (
                  <p className="font-bold text-xl italic">
                    {artist.name}&apos;s
                  </p>
                ) : (
                  <p className="text-gray-400 italic">Loading artist...</p>
                )}
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
              <>
                {lyrics.map((lyric, index) => {
                  const isLast = index === lyrics.length - 1;
                  return (
                    <div key={index} className="m-0 p-0">
                      {isMobile ? (
                        <LyricsRow
                          id={lyric._id}
                          lyric={lyric}
                          isLast={isLast}
                          lastUserRef={lastUserRef}
                        />
                      ) : (
                        <LyricsCard
                          id={lyric._id}
                          lyric={lyric}
                          lastUserRef={lastUserRef}
                          isLast={isLast}
                        />
                      )}
                    </div>
                  );
                })}
                {!loading && (
                  <div className="text-center py-4 text-gray-500 flex items-center justify-center gap-2">
                    <BiSearch
                      style={{
                        display: "inline-block",
                        animation: "wave 3s infinite",
                      }}
                    />
                    Searching more artists...
                  </div>
                )}
                {!loading && lyrics.length === 0 && initialLoadDone && (
                  <div className="text-center py-4 text-gray-400 italic">
                    No lyrics found.
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Artist;
