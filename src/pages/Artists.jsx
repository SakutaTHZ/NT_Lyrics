import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Footer from "../components/common/Footer";
import useDebounce from "../components/hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import { BiArrowBack, BiSearch } from "react-icons/bi";
import { apiUrl } from "../assets/util/api";
import axios from "axios";

const Artists = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  const [artists, setArtists] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm);

  const [loading, setLoading] = useState(false);
  const AUTH_TOKEN = useRef(localStorage.getItem("token"));

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const fetchArtists = useCallback(
    async (pageNum = 1, override = false) => {
      setLoading(true);
      try {
        const res = await axios.get(`${apiUrl}/artists/search`, {
          params: {
            page: pageNum,
            limit: 20,
            keyword: debouncedSearchTerm,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AUTH_TOKEN.current}`,
          },
        });

        setArtists((prev) =>
          override || pageNum === 1
            ? res.data.artists
            : [...prev, ...res.data.artists]
        );

        setTotalPages(res.data.totalPages);
        setInitialLoadDone(true);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearchTerm]
  );

  const observer = useRef(null);

  const lastUserRef = useCallback(
    (node) => {
      if (loading || page + 1 > totalPages) return;
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

  useEffect(() => {
    fetchArtists(1, true);
  }, [debouncedSearchTerm, fetchArtists]);

  useEffect(() => {
    setArtists([]);
    setPage(1);
    setTotalPages(null);
    setInitialLoadDone(false);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (page > 1) {
      fetchArtists(page, false); // append mode
    }
  }, [page, fetchArtists]);

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="w-screen h-screen overflow-hidden overflow-y-auto">
          <div className="relative flex flex-col w-screen min-h-screen pt-4 md:pt-16">
            <div className="flex flex-col gap-2 px-4 md:px-24">
              <p className="font-bold text-lg italic flex gap-2 items-center md:gap-4">
                <button onClick={goBack}>
                  <BiArrowBack size={20} />
                </button>
                Artists
              </p>

              {/* Search input for lyrics */}
              <div className="py-2 md:px-24 sticky md:top-12 top-0 bg-white z-10">
                <div className="flex justify-between gap-2">
                  <input
                    type="text"
                    placeholder="Search by Artist Name"
                    className="border border-gray-300 rounded-md px-3 py-2 w-full h-[42px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Artists */}
              {artists.map((artist, idx) => {
                const isLast = idx === artists.length - 5;
                return (
                  <div
                    key={idx}
                    className="border-b md:border border-gray-200 last:border-0 border-dashed flex items-center gap-4 p-2 md:px-4 md:w-full md:rounded-md hover:bg-gray-50 cursor-pointer md:bg-white"
                    onClick={() => navigate(`/NT_Lyrics/artist/${artist._id}`)}
                    ref={isLast ? lastUserRef : null}
                  >
                    <img
                      src={
                        artist?.photoLink ||
                        "https://i.pinimg.com/736x/54/75/6c/54756cbcfb2051c46f350ea33a0b78ef.jpg"
                      }
                      className="w-12 h-12 object-contain rounded-full"
                    />
                    {artist.name}
                  </div>
                );
              })}
              {loading && (
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
              {!loading && artists.length === 0 && initialLoadDone && (
                <p>No artists found.</p>
              )}
            </div>
          </div>

          <Footer />
        </div>
      </Suspense>
    </>
  );
};

export default Artists;
