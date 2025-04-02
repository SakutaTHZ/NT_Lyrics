import { Chart } from "primereact/chart";
import artists from "../../assets/data/artists.json";
import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";

const ArtistsTab = () => {
  const uniqueNames = new Set();
  let singersCount = 0,
    writerCount = 0;

  artists.forEach(({ name, searchCount, type }) => {
    console.log(name)
    if (!uniqueNames.has(name)) {
      uniqueNames.add(name);

      if (type === "artist") {
        singersCount += searchCount;
      } else if (type === "writer") {
        writerCount += searchCount;
      } else if (type === "both") {
        singersCount += searchCount / 2; // Split evenly
        writerCount += searchCount / 2;
      }
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

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Filter logic
  const filteredArtists = artists.filter((artist) => {
    const matchesSearch = artist.name.includes(searchTerm);
    const matchesType = filterType === "all" || artist.type === filterType;
    return matchesSearch && matchesType;
  });

  // Custom image template for DataTable
  const imageTemplate = (rowData) => (
    <img
      //src={rowData.photoLink}
      src={
        "https://i.pinimg.com/736x/43/61/09/4361091dd491bacbbcdbaa0be7a2d2be.jpg"
      }
      alt={rowData.name}
      className="w-10 h-10 rounded-full"
    />
  );

  return (
    <>
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
        </div>
      </div>
      <div className="w-full p-5 bg-white shadow-md rounded-lg">
        {/* Search & Filter Controls */}
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <span className="p-input-icon-left">
            <InputText
              type="text"
              placeholder="Search by name..."
              className="w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </span>

          <div className="flex gap-4">
            {["all", "artist", "writer", "both"].map((type) => (
              <div key={type} className="flex items-center gap-2">
                <RadioButton
                  inputId={type}
                  name="type"
                  value={type}
                  checked={filterType === type}
                  onChange={(e) => setFilterType(e.value)}
                />
                <label htmlFor={type} className="capitalize">
                  {type}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* PrimeReact DataTable */}
        <DataTable
          value={filteredArtists}
          tableStyle={{ minWidth: "w-full" }}
          emptyMessage="No matching artists found."
          paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]}
        >
          <Column header="#" field="id" />
          <Column header="Photo" body={imageTemplate} />
          <Column field="name" header="Name" sortable />
          <Column field="searchCount" header="Search Count" sortable />
          <Column field="type" header="Type" sortable />
        </DataTable>
      </div>
    </>
  );
};

export default ArtistsTab;
