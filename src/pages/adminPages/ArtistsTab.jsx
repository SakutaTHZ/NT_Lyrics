import { CgArrowTopRight } from "react-icons/cg";
import { Chart } from "primereact/chart";
import artists from "../../assets/data/artists.json";

const ArtistsTab = () => {
  let singersCount = 0,
    writerCount = 0;

  artists.forEach(({ searchCount, type }) => {
    if (type === "artist") singersCount += searchCount;
    if (type === "writer") writerCount += searchCount;
    if (type === "both") {
      singersCount += 1; // Split evenly
      writerCount += 1;
    }
  });
  const chartData = {
    labels: ["Artist", "Writer"],
    datasets: [
      {
        data: [singersCount, writerCount],
        backgroundColor: ["#42A5F5", "#66BB6A"],
        hoverBackgroundColor: ["#64B5F6", "#81C784"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right", // Moves labels to the right side
      },
    },
  };
  return (
    <div className="w-full">
      {/* Data preview */}
      <div className="w-full flex flex-col md:flex-row gap-2 md:gap-4">
        {/* Total Artists */}
        <div className="relative border border-gray-200 rounded-lg shadow-md w-full bg-white">
          {/* Header */}
          <p className="p-3 bg-gray-100 text-gray-600 font-medium rounded-t-lg">
            Total Artists
          </p>

          {/* Content Area */}
          <div className="p-5 flex flex-col md:flex-row gap-2 items-start justify-between">
            {/* Text Section */}
            <div>
              <p className="font-extrabold text-3xl text-gray-800">
                {(singersCount + writerCount).toLocaleString()}
              </p>
              <p className="mt-2 text-sm text-green-600 flex flex-wrap items-center">
                <span className="font-medium">+200</span>
                <span className="ml-1 text-gray-500">
                  artists vs last month
                </span>
              </p>
            </div>

            {/* Chart Section */}
            <Chart
              type="pie"
              data={chartData}
              options={chartOptions}
              style={{ width: "200px", height: "100px" }}
            />
          </div>
        </div>
        {/* Total Singers */}
        <div className="border border-gray-200 rounded-lg shadow-md w-full md:w-2/5 bg-white">
          {/* Header */}
          <p className="p-3 bg-gray-100 text-gray-600 font-medium rounded-t-lg">
            Total Singers
          </p>

          {/* Content Area */}
          <div className="p-5 flex flex-col gap-2 md:gap-4 items-start justify-between">
            {/* Text Section */}
            <div className="w-full h-full">
              <p className="font-extrabold text-3xl text-gray-800">
                {singersCount.toLocaleString()}{" "}
                <span className="text-sm font-normal text-[#42A5F5]">
                  Singers
                </span>
              </p>
            </div>

            <div className="w-full h-full">
              <div className="flex font-medium items-center gap-2 border-1 border-blue-300 bg-blue-50 w-fit p-1.5 px-4 rounded-full">
                <p>Rဇာနည်</p>
                <span>#1</span>
              </div>
            </div>
          </div>
        </div>
        {/* Total Writers */}
        <div className="border border-gray-200 rounded-lg shadow-md w-full md:w-2/5 bg-white">
          {/* Header */}
          <p className="p-3 bg-gray-100 text-gray-600 font-medium rounded-t-lg">
            Total Writers
          </p>

          {/* Content Area */}
          <div className="p-5 flex flex-col gap-2 md:gap-4 items-start justify-between">
            {/* Text Section */}
            <div>
              <p className="font-extrabold text-3xl text-gray-800">
                {writerCount.toLocaleString()}{" "}
                <span className="text-sm font-normal text-[#66BB6A]">
                  Writers
                </span>
              </p>
            </div>
            <div className="w-full h-full">
              <div className="flex font-medium items-center gap-2 border-1 border-green-300 bg-green-50 w-fit p-1.5 px-4 rounded-full">
                <p>Rဇာနည်</p>
                <span>#1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Create New Artists */}
        <div className="border border-gray-200 rounded-md shadow-sm w-full md:w-2/5">
          <p className="p-2 px-4 bg-gray-50 text-gray-400 font-semibold">
            Create New Artists
          </p>
          <div className="p-4 flex justify-between">
            <div>
              <p className="font-bold text-2xl">{"10,000"}</p>
              <p className="text-sm text-green-500 mt-2">
                +<span>200</span> songs vs last month
              </p>
            </div>

            <button className="bg-blue-100 hover:bg-blue-200 transition-colors h-full aspect-square p-2 rounded-md cursor-pointer">
              <CgArrowTopRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistsTab;
