import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Footer from "../components/common/Footer";
import useDebounce from "../components/hooks/useDebounce";
//import { useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import { apiUrl } from "../assets/util/api";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Artist from "./Artist";
import ModalContainer from "../components/special/ModalContainer";

const Artists = () => {
  const { t } = useTranslation();
  //const navigate = useNavigate();

  const [artists, setArtists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm);
  const [loading, setLoading] = useState(false);

  const AUTH_TOKEN = useRef(localStorage.getItem("token"));
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const observer = useRef(null);

  const fetchArtists = useCallback(
    async (pageNum = 1, override = false) => {
      setLoading(true);
      try {
        const res = await axios.get(`${apiUrl}/artists/search`, {
          params: {
            page: pageNum,
            limit: 40,
            keyword: debouncedSearchTerm,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AUTH_TOKEN.current}`,
          },
        });

        const fetchedArtists = res.data.artists || [];

        setArtists((prev) => {
          if (override || pageNum === 1) return fetchedArtists;
          return [...prev, ...fetchedArtists];
        });

        setTotalPages(res.data.totalPages);
        setInitialLoadDone(true);
      } catch (err) {
        console.error("Error fetching artists:", err);
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearchTerm]
  );

  const [showArtistDetails, setShowArtistDetails] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);

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

  // Initial fetch with prefetch of page 2
  useEffect(() => {
    setArtists([]);
    setPage(1);
    setInitialLoadDone(false);

    fetchArtists(1, true).then(() => {
      if (totalPages > 1) {
        fetchArtists(2); // Prefetch page 2
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, fetchArtists]);

  // Fetch on page change
  useEffect(() => {
    if (page > 1) {
      fetchArtists(page, false);
    }
  }, [page, fetchArtists]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-screen h-screen overflow-hidden overflow-y-auto">
        <div className="relative flex flex-col w-screen min-h-screen pt-4 md:pt-16">
          <div className="flex flex-col gap-2 px-4 md:px-24">
            <p className="font-bold text-xl italic flex gap-2 items-center md:gap-4 c-text-primary">
              {t("artistsList")}
            </p>

            {/* Search */}
            <div className="w-full py-2 sticky md:top-12 top-0 c-bg z-10">
              <input
                type="text"
                placeholder={t("searchforArtists")}
                className="border c-border rounded-md px-3 py-2 w-full h-[42px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Artists */}
            {artists.map((artist, idx) => {
              // Trigger earlier — 10 from the end
              const isLast = idx === artists.length - 25;
              return (
                <div
                  key={artist._id || idx}
                  className="relative flex items-center w-full border-b last:border-0 gap-4 border-dashed c-border py-2 cursor-pointer"
                  onClick={() => {
                    //navigate(`/NT_Lyrics/artist/${artist._id}`);
                    setSelectedArtist(artist._id);
                    setShowArtistDetails(true);
                  }}
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

      {/* Artist Details Modal */}
      {showArtistDetails && selectedArtist && (
        <ModalContainer
          isOpen={showArtistDetails}
          onClose={() => setShowArtistDetails(false)}
        >
          <Artist
            artistId={selectedArtist}
            onClose={() => setShowArtistDetails(false)}
          />
        </ModalContainer>
      )}
    </Suspense>
  );
};

export default Artists;
