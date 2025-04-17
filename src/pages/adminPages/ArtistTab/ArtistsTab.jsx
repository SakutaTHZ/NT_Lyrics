import { useEffect, useState, useRef, useCallback } from "react";
import MessagePopup from "../../../components/common/MessagePopup";
import axios from "axios";
import useDebounce from "../../../components/hooks/useDebounce";
import ArtistRow from "./ArtistRow";
import { Chart } from "primereact/chart";
import { SelectButton } from "primereact/selectbutton";

const ArtistsTab = () => {
  const [artists, setArtists] = useState([]);

  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState("success");

  const [artistCounts, setArtistCounts] = useState({
    countDiff: 100,
    totalCount: 0,
    totalArtistCount: 0,
    totalWrtierCount: 0,
    totalBothCount: 0,
  });

  const [loading, setLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm);
  const AUTH_TOKEN = useRef(localStorage.getItem("token"));

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const fetchArtists = useCallback(
    async (pageNum = 1, override = false) => {
      setLoading(true);
      try {
        const res = await axios.get(
          "http://localhost:3000/api/artists/search",
          {
            params: {
              page: pageNum,
              limit: 20,
              type: typeFilter,
              keyword: debouncedSearchTerm,
            },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${AUTH_TOKEN.current}`,
            },
          }
        );

        const fetchedArtists = res.data.artists;
        setArtistCounts({
          countDiff: res.data.totalCount,
          totalCount: res.data.totalCount,
          totalArtistCount: res.data.totalArtistCount,
          totalWrtierCount: res.data.totalWrtierCount,
          totalBothCount: res.data.totalBothCount,
        });
        setArtists((prev) =>
          override || pageNum === 1
            ? fetchedArtists
            : [...prev, ...fetchedArtists]
        );
        setTotalPages(res.data.totalPages);
        setInitialLoadDone(true);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    },
    [typeFilter, debouncedSearchTerm]
  );

  const [toptenArtists, setToptenArtists] = useState([]);

  const getTop10Artists = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/artists/getTopArtists",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AUTH_TOKEN.current}`,
          },
        }
      );

      const mappedArtists = res.data.topArtists.map((artist) => ({
        photoLink: artist.photoLink,
        name: artist.name,
        searchCount: artist.searchCount,
      }));

      setToptenArtists(mappedArtists);
    } catch (err) {
      console.error("Error fetching user overview:", err);
    }
  }, []);

  useEffect(() => {
    fetchArtists();
    getTop10Artists();
  }, [debouncedSearchTerm, typeFilter, fetchArtists, getTop10Artists]);

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

  const showNewMessage = (type, message) => {
    setMessageText(message);
    setMessageType(type);
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 10000);
  };

  useEffect(() => {
    // Example of showing a message when the component mounts
    showNewMessage("success", "Artists tab loaded successfully!");
  }, []);

  const chartData = {
    labels: ["Artists", "Writers", "Both"],
    datasets: [
      {
        data: [
          artistCounts.totalArtistCount,
          artistCounts.totalWrtierCount,
          artistCounts.totalBothCount,
        ],
        backgroundColor: ["#42A5F5", "#66BB6A", "#eab308"],
        hoverBackgroundColor: ["#64B5F6", "#81C784", "#eab308"],
      },
    ],
  };

  const types = [
    { name: `Both (${artistCounts.totalBothCount})`, value: "both" },
    { name: `Artists (${artistCounts.totalArtistCount})`, value: "artist" },
    { name: `Writers (${artistCounts.totalWrtierCount})`, value: "writer" },
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

  const [selectedArtist, setSelectedArtist] = useState(null);
  const handleEdit = (artist) => setSelectedArtist(artist);

  return (
    <>
      {showMessage && (
        <MessagePopup message_type={messageType} message_text={messageText} />
      )}

      {/* Stats */}
      <div className="w-full flex flex-col md:flex-row gap-2 md:gap-4">
        <div className="relative border border-gray-200 rounded-lg shadow-sm w-full bg-white">
          <p className="p-3 bg-gray-100 text-gray-600 font-medium rounded-t-lg">
            Total Artists
          </p>
          <div className="p-5 h-fit flex flex-col md:flex-row gap-2 items-center justify-between">
            <div className="flex flex-wrap h-full w-full">
              <div>
                <p className="font-extrabold text-3xl text-gray-800">
                  {artistCounts.totalCount}
                </p>
                <p className="mt-2 text-sm text-green-600 flex items-center">
                  <span className="font-medium">+{artistCounts.countDiff}</span>
                  <span className="ml-1 text-gray-500">
                    artists vs last month
                  </span>
                </p>
              </div>
              <div className="md:ml-4 flex flex-wrap gap-2 p-2 rounded-md md:border-l-2 border-gray-200">
                <div className="flex items-center md:px-4 gap-3">
                  <p className="min-w-16 text-center text-blue-500 text-2xl font-bold bg-blue-50 p-3 rounded-md">
                    {artistCounts.totalArtistCount}
                  </p>
                  <div className="flex items-center">Artists</div>
                </div>

                <div className="flex items-center md:px-4 gap-3">
                  <p className="min-w-16 text-center text-green-500 text-2xl font-bold bg-green-50 p-3 rounded-md">
                    {artistCounts.totalWrtierCount}
                  </p>
                  <div className="flex items-center">Writers</div>
                </div>

                <div className="flex items-center md:px-4 gap-3">
                  <p className="min-w-16 text-center text-yellow-500 text-2xl font-bold bg-yellow-50 p-3 rounded-md">
                    {artistCounts.totalBothCount}
                  </p>
                  <div className="flex items-center">Both</div>
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

      {/* Top 10 Artists */}
      <div className="mt-4 w-full flex flex-col md:flex-row gap-2 md:gap-4">
        <div className="relative border border-gray-200 rounded-lg shadow-sm w-full bg-white">
          <p className="p-3 bg-gray-100 text-gray-600 font-medium rounded-t-lg">
            Trending Artists
          </p>
          <div className="flex flex-wrap gap-2 p-4">
            {(toptenArtists || []).map((artist, idx) => (
              <div
                key={idx}
                className="relative flex items-center gap-3 p-2 px-4 border border-gray-300 rounded-full shadow-sm hover:shadow-md transition cursor-pointer"
              >
                <p
                  className={`absolute  border  w-6 h-6 -inset-2 rounded-full text-sm flex items-center justify-center ${
                    idx < 3
                      ? "bg-yellow-100 border-yellow-500 text-yellow-500 font-semibold"
                      : "bg-white border-gray-300 text-gray-600"
                  }`}
                >
                  {idx + 1}
                </p>
                <img
                  src={artist.photoLink}
                  alt="Artist Photo"
                  className="w-8 h-8 object-cover rounded-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
                  }}
                />
                <div className="flex items-center gap-2">
                  <p className="text-gray-800 font-semibold">{artist.name}</p>
                  <p className="text-gray-500 text-sm  bg-gray-100 p-1 px-2 rounded-full">
                    {artist.searchCount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters mt-4">
        <p className="text-gray-600 font-semibold mb-2">Filters</p>
        <div className="flex gap-4 mt-2 items-center">
          <div className="flex-shrink-0">
            <SelectButton
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.value || "")}
              optionLabel="name"
              options={types}
            />
          </div>
          <input
            type="text"
            placeholder="Search by Artist Name"
            className="border border-gray-300 rounded-md px-3 py-2 w-full h-[42px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="text-nowrap bg-blue-500 text-white p-3 rounded-md cursor-pointer">Add New Atists</button>
        </div>
      </div>

      {/* Table */}
      <div className="tableContainer border border-gray-200 rounded-md shadow-sm w-full h-[calc(100vh-180px)] mt-4 overflow-x-auto sticky top-12">
        <table className="min-w-full bg-white text-sm text-left">
          <thead className="thead-shadow text-xs text-gray-600 uppercase sticky top-0 bg-gray-100 z-10">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Photo</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Bio</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">search</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {artists.map((artist, idx) => {
              const isLast = idx === artists.length - 1;
              return (
                <>
                  <ArtistRow
                    key={artist._id || idx}
                    artist={artist}
                    idx={idx}
                    isLast={isLast}
                    lastUserRef={lastUserRef}
                    onEdit={handleEdit}
                  />
                </>
              );
            })}
            {loading && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  Loading more artists...
                </td>
              </tr>
            )}
            {!loading && artists.length === 0 && initialLoadDone && (
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

      {selectedArtist && <></>}
    </>
  );
};

export default ArtistsTab;
