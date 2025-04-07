import { Chart } from "primereact/chart";
import artists from "../../assets/data/artists.json";
import { useState} from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { CgAdd } from "react-icons/cg";
import AddNewArtist from "./AddNewArtist";

const ArtistsTab = () => {
  const uniqueNames = new Set();
  let singersCount = 0,
    writerCount = 0;

  artists.forEach(({ name, type }) => {
    console.log(name);
    if (!uniqueNames.has(name)) {
      uniqueNames.add(name);

      if (type === "singer") {
        singersCount += 1;
      } else if (type === "writer") {
        writerCount += 1;
      } else if (type === "both") {
        singersCount += 1; // Split evenly
        writerCount += 1;
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
      className="w-12 h-12 rounded-md"
    />
  );

  const [showEditBox,setShowEditBox] = useState(false);

  return (
    <>
      <div className="w-full">
        {/* Data preview */}
        <div className="w-full flex flex-col md:flex-row gap-2 md:gap-4">
          {/* Total Artists */}
          <div className="relative border border-gray-200 rounded-lg shadow-sm w-full bg-white">
            {/* Header */}
            <p className="p-3 bg-gray-100 text-gray-600 font-medium rounded-t-lg">
              Total Artists
            </p>

            {/* Content Area */}
            <div className="p-5 flex flex-col md:flex-row gap-2 items-start justify-between">
              {/* Text Section */}
              <div>
                <p className="font-extrabold text-3xl text-gray-800">
                  {artists.length.toLocaleString()}
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
          <div className="border border-gray-200 rounded-lg shadow-sm w-full md:w-2/5 bg-white">
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
          <div className="border border-gray-200 rounded-lg shadow-sm w-full md:w-2/5 bg-white">
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
      <div className="w-full p-5 mt-4 bg-white shadow-md rounded-lg">
        {/* Search & Filter Controls */}
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <InputText
              type="text"
              placeholder="Search by name..."
              className="w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="flex gap-4">
              {["all", "singer", "writer", "both"].map((type) => (
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
          <button className="bg-gradient-to-r from-blue-200 hover:from-green-300 to-green-200 hover:to-blue-300 flex items-center transition-all cursor-pointer p-2 px-4 rounded-md shadow-sm gap-2 text-black"
          onClick={()=>setShowEditBox(true)}>
            <CgAdd />
            Add New Artists
          </button>
        </div>

        <DataTable
          value={filteredArtists}
          tableStyle={{ minWidth: "100%" }} // Fix invalid Tailwind class
          emptyMessage="No matching artists found."
          stripedRows 
          removableSort
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} artists"
        >
          <Column header="#" field="id" style={{ width: "5%" }} sortable />
          <Column header="Photo" body={imageTemplate} />
          <Column field="name" header="Name" sortable />
          <Column field="searchCount" header="Search Count" sortable />
          <Column field="type" header="Type" sortable />
          <Column field={"1:33pm 4/2/2025"} header="Created At" />
        </DataTable>
      </div>

      {showEditBox && <AddNewArtist onClose={()=>setShowEditBox(false)}/>}
    </>
  );
};

export default ArtistsTab;