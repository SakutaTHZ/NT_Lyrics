import { useEffect, useState } from "react";
import MessagePopup from "../../../components/common/MessagePopup";
import { Chart } from "primereact/chart";
import { SelectButton } from "primereact/selectbutton";
import { fetchLyricOverview } from "../../../assets/util/api";
import AddLyric from "./AddLyric";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import { useCallback } from "react";
import { useRef } from "react";
import useDebounce from "../../../components/hooks/useDebounce";
import LyricRow from "./LyricRow";
import { keyOptions } from "../../../../src/assets/js/constantDatas";
import { DropdownField} from "./AddLyric";
import { fetchSingers } from "../../../assets/util/api";

const LyricsTab = () => {
  const AUTH_TOKEN = useRef(localStorage.getItem("token"));
  const [lyrics, setLyrics] = useState([]);
  const [lyricsCount, setLyricsCount] = useState({
    totalCount: 0,
    countDiff: 0,
    enabledCount: 0,
    disabledCount: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedType, setSelectedType] = useState("all");

  const [selectedMajorKey, setSelectedMajorKey] = useState("all");

  const typeOptions = [
    { name: "All", value: "all" },
    { name: "Singer", value: "singer" },
    { name: "Writer", value: "writer" },
    { name: "Lyrics", value: "lyrics" },
    { name: "Key", value: "key" },
  ];

  const [loading, setLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm);
  const [totalPages, setTotalPages] = useState(0);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const [isEnabled, setIsEnabled] = useState("");

  const [singers, setSingers] = useState([]);
  const [writers, setWriters] = useState([]);

  const [selectedSingers, setSelectedSingers] = useState();
  const [selectedWriters, setSelectedWriters] = useState();

  const fetchLyrics = useCallback(
    async (pageNum = 1, override = false) => {
      setLoading(true);
      try {
        const res = await axios.get(
          "http://localhost:3000/api/lyrics/searchLyricsByAdmin",
          {
            params: {
              page: pageNum,
              limit: 20,
              type: selectedType,
              keyword:
                selectedType == "all" || selectedType === "lyrics"
                  ? debouncedSearchTerm
                  : selectedType === "key"
                  ? selectedMajorKey
                  : selectedType === "singer"
                  ? selectedSingers
                  : selectedWriters,
              isEnable: isEnabled,
            },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${AUTH_TOKEN.current}`,
            },
          }
        );

        setLyrics((prev) =>
          override || pageNum === 1
            ? res.data.lyrics
            : [...prev, ...res.data.lyrics]
        );
        setTotalPages(res.data.totalPages);
        setInitialLoadDone(true);
        getLyricOverview();
      } catch (err) {
        console.error("Error fetching users:", err);
        console.log(err.response.data);
      } finally {
        setLoading(false);
      }
    },
    [
      selectedType,
      debouncedSearchTerm,
      selectedMajorKey,
      selectedSingers,
      selectedWriters,
      isEnabled,
    ]
  );

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
  const [page, setPage] = useState(1);
  const observer = useRef(null);

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

  // For Error Messages
  const [showMessage, setShowMessage] = useState(false);
  const [messageType, setMessageType] = useState("success");
  const [messageText, setMessageText] = useState("");

  const showNewMessage = (type, message) => {
    setMessageText(message);
    setMessageType(type);
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 10000);
  };

  //   Chart Data
  const chartData = {
    labels: ["Disabled", "Enabled"],
    datasets: [
      {
        data: [lyricsCount.disabledCount, lyricsCount.enabledCount],
        backgroundColor: ["#eab308", "#66BB6A"],
        hoverBackgroundColor: ["#eab308", "#81C784"],
      },
    ],
  };

  const isEnable = [
    { name: `Disabled (${lyricsCount.disabledCount})`, value: false },
    { name: `Enabled (${lyricsCount.enabledCount})`, value: true },
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
      },
    },
  };
  const getLyricOverview = async () => {
    try {
      const counts = await fetchLyricOverview(localStorage.getItem("token"));
      setLyricsCount(counts);
    } catch (err) {
      console.error("Error fetching user overview:", err);
    }
  };

  const [openAddLyricsModal, setOpenAddLyricsModal] = useState(false);
  const closeAddLyricsModal = () => {
    setOpenAddLyricsModal(false);
  };

  useEffect(() => {
    showNewMessage("success", "Lyrics Tab Loaded Successfully!");
    getArtists();
    getLyricOverview();
    fetchLyrics();
  }, [fetchLyrics]);

  return (
    <>
      {showMessage && (
        <MessagePopup message_type={messageType} message_text={messageText} />
      )}

      {/* Stats */}
      <div className="w-full flex flex-col md:flex-row gap-2 md:gap-4">
        <div className="relative border border-gray-200 rounded-lg shadow-sm w-full bg-white">
          <p className="p-3 bg-gray-100 text-gray-600 font-medium rounded-t-lg">
            Total Lyrics
          </p>
          <div className="p-5 h-fit flex flex-col md:flex-row gap-2 items-center justify-between">
            <div className="flex flex-wrap h-full w-full">
              <div>
                <p className="font-extrabold text-3xl text-gray-800">
                  {lyricsCount.totalCount}
                </p>
                <p className="mt-2 text-sm text-green-600 flex items-center">
                  <span className="font-medium">+{lyricsCount.countDiff}</span>
                  <span className="ml-1 text-gray-500">
                    lyrics vs last month
                  </span>
                </p>
              </div>
              <div className="md:ml-4 flex flex-wrap gap-2 p-2 rounded-md md:border-l-2 border-gray-200">
                <div className="flex items-center md:px-4 gap-3">
                  <p className="min-w-16 text-center text-green-500 text-2xl font-bold bg-green-50 p-3 rounded-md">
                    {lyricsCount.enabledCount}
                  </p>
                  <div className="flex items-center">Enabled</div>
                </div>

                <div className="flex items-center md:px-4 gap-3">
                  <p className="min-w-16 text-center text-yellow-500 text-2xl font-bold bg-yellow-50 p-3 rounded-md">
                    {lyricsCount.disabledCount}
                  </p>
                  <div className="flex items-center">Disabled</div>
                </div>
              </div>
            </div>
            <Chart
              type="pie"
              data={chartData}
              options={chartOptions}
              style={{ width: "300px", height: "100px" }}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters mt-4">
        <p className="text-gray-600 font-semibold mb-2">Filters</p>
        <div className="flex flex-wrap md:flex-nowrap gap-4 mt-2 items-center ">
          <div className="flex-shrink-0">
            <SelectButton
              value={isEnabled}
              onChange={(e) => setIsEnabled(e.value)}
              optionLabel="name"
              options={isEnable}
              className="w-full md:w-auto"
              itemTemplate={(option) => (
                <div
                  className={`flex items-center gap-2 px-2 py-1 rounded ${option.color}`}
                >
                  <span className="text-sm font-semibold">{option.name}</span>
                </div>
              )}
            />
          </div>

          <Dropdown
            value={selectedType}
            onChange={(e) => setSelectedType(e.value)}
            options={typeOptions}
            optionLabel="name"
            placeholder="Search by Type"
            className="w-fit min-w-42 md:w-12rem"
          />

          {selectedType === "all" ? (
            <input
              type="text"
              placeholder="Search by Lyrics Name"
              className="border border-gray-300 rounded-md px-3 py-2 w-full h-[50px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          ) : selectedType === "lyrics" ? (
            <input
              type="text"
              placeholder="Search by Lyrics title"
              className="border border-gray-300 rounded-md px-3 py-2 w-full h-[50px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          ) : selectedType === "singer" ? (
            <Dropdown
              value={selectedSingers}
              onChange={(e) => {
                setSelectedSingers(e.value?._id || ""); // Only store the ID
                console.log(e.value?._id || "");
              }}
              options={singers}
              optionLabel="name"
              placeholder="Select a singer"
              filter
              className="w-full md:w-14rem"
            />
          ) : selectedType === "writer" ? (
            <Dropdown
              value={selectedWriters}
              onChange={(e) => {
                setSelectedWriters(e.value?._id || ""); // Only store the ID
                console.log(e.value?._id || "");
              }}
              options={writers}
              optionLabel="name"
              placeholder="Select a writer"
              filter
              className="w-full md:w-14rem"
            />
          ) : selectedType === "key" ? (
            <DropdownField
              value={selectedMajorKey}
              options={keyOptions}
              onChange={setSelectedMajorKey}
            />
          ) : null}
          <button
            className="w-full md:w-auto text-nowrap bg-blue-500 text-white p-3 rounded-md cursor-pointer"
            onClick={() => {
              setOpenAddLyricsModal(true);
            }}
          >
            Add New Lyrics
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="tableContainer border border-gray-200 rounded-md shadow-sm w-full h-[calc(100vh-180px)] mt-4 overflow-x-auto sticky top-12">
        <table className="min-w-full bg-white text-sm text-left">
          <thead className="thead-shadow text-xs text-gray-600 uppercase sticky top-0 bg-gray-100 z-10">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3 w-16">ID</th>
              <th className="px-4 py-3">Photo</th>
              <th className="px-4 py-3">Title / Album / Genres</th>
              <th className="px-4 py-3">Singers</th>
              <th className="px-4 py-3">Features</th>
              <th className="px-4 py-3">Writers</th>
              <th className="px-4 py-3">Key</th>
              <th className="px-4 py-3">View Count</th>
              <th className="px-4 py-3">isEnabled</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {lyrics.map((lyric, idx) => {
              const isLast = idx === lyrics.length - 1;
              return (
                <LyricRow
                  key={lyric._id || idx}
                  lyric={lyric}
                  idx={idx}
                  isLast={isLast}
                  lastUserRef={lastUserRef}
                  onEdit={() => {
                    console.log("Edit clicked");
                  }}
                />
              );
            })}
            {loading && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  Loading more artists...
                </td>
              </tr>
            )}
            {!loading && lyrics.length === 0 && initialLoadDone && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-4 text-gray-400 italic"
                >
                  No artists found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {openAddLyricsModal && (
        <AddLyric
          onClose={closeAddLyricsModal}
          onUpdate={() => {
            getLyricOverview();
            showNewMessage("success", "Lyric Added Successfully!");
            setPage(1);
            fetchLyrics(1, true);
          }}
          showNewMessage={showNewMessage}
        />
      )}
    </>
  );
};

export default LyricsTab;
