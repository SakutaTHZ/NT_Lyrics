import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  Suspense,
} from "react";
import { useSearchParams } from "react-router-dom";
import { AutoComplete } from "primereact/autocomplete";
import { RadioButton } from "primereact/radiobutton";
import { Dropdown } from "primereact/dropdown";
import EmptyData from "../assets/images/Collection list is empty.jpg";
import { fetchSingers, validateUser } from "../assets/util/api";
import { majorkeys } from "../assets/js/constantDatas";
import { apiUrl } from "../assets/util/api";
import axios from "axios";
import useDebounce from "../components/hooks/useDebounce";
import useIsMobile from "../components/hooks/useIsMobile";
import LyricsCard from "../components/special/LyricsCard";
import LyricsRow from "../components/special/LyricsRow";
import LyricsRowPremium from "../components/special/LyricRowPremium";
import LoadingBox from "../components/common/LoadingBox";
import { useTranslation } from "react-i18next";

const Footer = React.lazy(() => import("../components/common/Footer"));

const Lyrics = () => {
  const { t } = useTranslation();

  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  const debouncedSearchTerm = useDebounce(searchTerm);

  const [lyrics, setLyrics] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const [searchMethod, setSearchMethod] = useState("all");
  const [selectedKey, setSelectedKey] = useState("C");
  const [selectedWriters, setSelectedWriters] = useState("");
  const [selectedArtist, setSelectedArtist] = useState("");
  const [items, setItems] = useState([]);

  const [singers, setSingers] = useState([]);
  const [writers, setWriters] = useState([]);

  const [hasToken, setHasToken] = useState(false);
  const [user, setUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);

  const isMobile = useIsMobile();
  const observer = useRef(null);

  const lastUserRef = useCallback((node) => {
    if (loading || page >= totalPages) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, totalPages, page]);

  const fetchLyrics = useCallback(
    async (pageNum, override = false) => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${apiUrl}/lyrics/searchLyrics`, {
          params: {
            page: pageNum,
            limit: 10,
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
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        const data = res.data.lyrics;

        if (!Array.isArray(data)) {
          console.error("Expected array, got:", data);
          return [];
        }

        const newData = data;

        setLyrics((prev) => {
          const merged = override || pageNum === 1 ? newData : [...prev, ...newData];
          const unique = Array.from(
            new Map(merged.map((item) => [item._id, item])).values()
          );
          return unique;
        });

        setTotalPages(res.data.totalPages);
        setInitialLoadDone(true);
      } catch (err) {
        console.error("Failed to fetch lyrics:", err);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [searchMethod, debouncedSearchTerm, selectedArtist, selectedWriters, selectedKey]
  );

  // 🔄 Reset lyrics when search method changes
  useEffect(() => {
    setLyrics([]);
    setPage(1);
    fetchLyrics(1, true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchMethod]);

  useEffect(() => {
    fetchLyrics(1, true);
  }, [fetchLyrics]);

  useEffect(() => {
    if (page > 1) fetchLyrics(page);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    const getArtists = async () => {
      try {
        const [singerData, writerData] = await Promise.all([
          fetchSingers("both"),
          fetchSingers("both"),
        ]);
        setSingers(singerData);
        setWriters(writerData);
      } catch (err) {
        console.error("Error fetching artists:", err);
      }
    };
    getArtists();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setHasToken(true);

    const id = JSON.parse(localStorage.getItem("user") || "{}")?.id;
    if (!id) return setUserLoaded(true);

    const getUser = async () => {
      try {
        const userData = await validateUser(id, token);
        if (!userData) throw new Error("No user returned");
        setUser(userData.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setUserLoaded(true);
      }
    };
    getUser();
  }, []);

  const search = (event) => {
    const filtered = lyrics
      .filter((item) => item.title.toLowerCase().includes(event.query.toLowerCase()))
      .map((item) => item.title);
    setItems(filtered);
  };

  const valueTemplate = (option) => <span>{option?.name || "Unknown"}</span>;
  const itemTemplate = (option) => <div className="p-2">{option?.name || "Unknown"}</div>;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setHasToken(true);
    }

    const id = JSON.parse(localStorage.getItem("user") || "{}")?.id;
    if (!id) {
      setUserLoaded(true);
      return;
    }

    const getUser = async () => {
      try {
        const userData = await validateUser(id, token);
        if (!userData) throw new Error("No user returned");
        setUser(userData.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setUserLoaded(true);
      }
    };

    getUser();
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-screen h-screen overflow-hidden overflow-y-auto">
        <div className="relative flex flex-col w-screen min-h-screen pt-4 md:pt-16">
          <div className="flex justify-between px-4 md:px-24">
            <p className="font-bold text-lg italic">{t("songLyrics")}</p>
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

          {userLoaded && (
            <div
              className={`grid ${
                loading || lyrics.length > 0
                  ? "md:grid-cols-5 md:place-items-center md:gap-6"
                  : "grid-cols-1 md:gap-12"
              } pb-4 gap-0 px-4 md:px-24`}
            >
              {(() => {
                if (loading && !initialLoadDone) {
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
                    {userLoaded &&
                      lyrics.map((lyric, index) => {
                        const isLast = index === lyrics.length - 3;
                        return (
                          <div
                            key={lyric._id}
                            className="border-b border-gray-200 last:border-0 border-dashed"
                          >
                            {isMobile ? (
                              user?.role === "premium-user" ? (
                                <>
                                  <LyricsRowPremium
                                    id={lyric._id}
                                    lyric={lyric}
                                    isLast={isLast}
                                    lastUserRef={lastUserRef}
                                    hideCollection={!hasToken}
                                  />
                                </>
                              ) : (
                                <LyricsRow
                                  id={lyric._id}
                                  lyric={lyric}
                                  isLast={isLast}
                                  lastUserRef={lastUserRef}
                                  hideCollection={!hasToken}
                                />
                              )
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
          )}
        </div>

        <Footer />
      </div>
    </Suspense>
  );
};

export default Lyrics;
