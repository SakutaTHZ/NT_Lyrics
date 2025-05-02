import { useEffect, useState } from "react";
import MessagePopup from "../../../components/common/MessagePopup";
import { Chart } from "primereact/chart";
import { SelectButton } from "primereact/selectbutton";
import { fetchLyricOverview } from "../../../assets/util/api"; // Adjust the import path as necessary

const LyricsTab = () => {
  const [lyricsCount, setLyricsCount] = useState({
    totalCount: 0,
    countDiff: 0,
    enabledCount: 0,
    disabledCount: 0,
  });
  const [typeFilter, setTypeFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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
        backgroundColor: ["#66BB6A", "#eab308"],
        hoverBackgroundColor: ["#81C784", "#eab308"],
      },
    ],
  };

  const types = [
    { name: `All (${lyricsCount.totalCount})`, value: "all" },
    { name: `Disabled (${lyricsCount.disabledCount})`, value: "disabled" },
    { name: `Enabled (${lyricsCount.enabledCount})`, value: "enabled" },
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
    console.log("Fetching lyric overview...");
    try {
      const counts = await fetchLyricOverview(localStorage.getItem("token"));
      console.log(counts);
      setLyricsCount(counts);
    } catch (err) {
      console.error("Error fetching user overview:", err);
    }
  };

  useEffect(() => {
    showNewMessage("success", "Lyrics Tab Loaded Successfully!");

    getLyricOverview();
  }, []);

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
                    {lyricsCount.disabledCount}
                  </p>
                  <div className="flex items-center">Disabled</div>
                </div>

                <div className="flex items-center md:px-4 gap-3">
                  <p className="min-w-16 text-center text-yellow-500 text-2xl font-bold bg-yellow-50 p-3 rounded-md">
                    {lyricsCount.enabledCount}
                  </p>
                  <div className="flex items-center">Enabled</div>
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
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.value || "")}
              optionLabel="name"
              options={types}
              className="w-full md:w-auto"
              itemTemplate={(option) => (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{option.name}</span>
                </div>
              )}
            />
          </div>
          <input
            type="text"
            placeholder="Search by Lyrics Name"
            className="border border-gray-300 rounded-md px-3 py-2 w-full h-[42px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="w-full md:w-auto text-nowrap bg-blue-500 text-white p-3 rounded-md cursor-pointer">
            Add New Lyrics
          </button>
        </div>
      </div>
    </>
  );
};

export default LyricsTab;
