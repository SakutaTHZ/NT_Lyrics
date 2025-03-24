import React from "react";
import { ScrollTop } from "primereact/scrolltop";
import { TabView, TabPanel } from "primereact/tabview";
import mockData from "../../assets/data/mockSongs.json";
import mockArtists from "../../assets/data/artists.json";
import { useState, useEffect } from "react";
import sampleImage from "../../assets/images/Lyrics_sample.png";
import { CgArrowTopRight } from "react-icons/cg";
import UserTable from "../../components/adminComponents/UserTable";

const Nav = React.lazy(() => import("../../components/adminComponents/Nav"));

const LyricsList = () => {
  const [lyrics, setLyrics] = useState([]);

  useEffect(() => {
    // Sort by view_count in descending order and take top 10
    const topSongs = [...mockData] // Create a copy to avoid modifying original data
      .sort((a, b) => b.view_count - a.view_count)
      .slice(0, 10);

    setLyrics(topSongs);
  }, []);

  return (
    <div>
      {lyrics.map((lyric, index) => (
        <div
          key={index}
          className="relative flex items-center justify-between w-full border-b last:border-0  border-dashed border-gray-200 px-3"
        >
          <div className="flex items-center gap-1">
            <span className="mr-2">{index + 1}.</span>
            <img src={sampleImage} className="w-12 h-12 object-contain" />
            <div className="flex justify-between items-center w-full p-2 pl-4">
              <div className="flex flex-col gap-2">
                <p className="font-semibold">
                  {lyric?.title ?? "Sample Title"}
                </p>
                <p className="text-sm text-gray-500">
                  {lyric?.artist?.join(", ") ?? "Sample Artist"}
                </p>
              </div>
            </div>
          </div>

          <p className="text-lg">{lyric.view_count}</p>
        </div>
      ))}
    </div>
  );
};

const ArtistList = () => {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    // Sort by view_count in descending order and take top 10
    const topArtists = [...mockArtists] // Create a copy to avoid modifying original data
      .sort((a, b) => b.searchCount - a.searchCount)
      .slice(0, 10);

    setArtists(topArtists);
  }, []);

  return (
    <div>
      {artists.map((artist, index) => (
        <div
          key={index}
          className="p-4 px-4 border-b last-of-type:border-0 border-gray-200 border-dashed flex items-center justify-between"
        >
          <p>
            {index + 1}. {artist.name}
          </p>
          <p className="text-lg">{artist.searchCount}</p>
        </div>
      ))}
    </div>
  );
};

const AdminPanel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <Nav />
      <ScrollTop />
      <div className="relative flex flex-col w-screen min-h-screen pt-12">
        <div className="flex justify-between px-4 md:px-24 w-screen">
          <TabView
            className="w-full"
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
          >
            <TabPanel header="All Data">
              <div className="w-full">
                {/* Data preview */}
                <div className="w-full flex flex-col md:flex-row gap-2 md:gap-4">
                  {/* Lyrics Tab */}
                  <div className="border border-gray-200 rounded-md shadow-sm w-full">
                    <p className="p-2 px-4 bg-gray-50 text-gray-400 font-semibold">
                      Total lyrics
                    </p>
                    <div className="p-4 flex justify-between">
                      <div>
                        <p className="font-bold text-2xl">{"10,000"}</p>
                        <p className="text-sm text-green-500 mt-2">
                          +<span>200</span> songs vs last month
                        </p>
                      </div>

                      <button
                        className="bg-blue-100 hover:bg-blue-200 transition-colors h-full aspect-square p-2 rounded-md cursor-pointer"
                        onClick={() => setActiveIndex(2)}
                      >
                        <CgArrowTopRight size={20} />
                      </button>
                    </div>
                  </div>
                  {/* Artists Tab */}
                  <div className="border border-gray-200 rounded-md shadow-sm w-full">
                    <p className="p-2 px-4 bg-gray-50 text-gray-400 font-semibold">
                      Total Artists
                    </p>
                    <div className="p-4 flex justify-between">
                      <div>
                        <p className="font-bold text-2xl">{"1,000"}</p>
                        <p className="text-sm text-green-500 mt-2">
                          +<span>200</span> artists vs last month
                        </p>
                      </div>
                      <button
                        className="bg-blue-100 hover:bg-blue-200 transition-colors h-full aspect-square p-2 rounded-md cursor-pointer"
                        onClick={() => setActiveIndex(1)}
                      >
                        <CgArrowTopRight size={20} />
                      </button>
                    </div>
                  </div>
                  {/* Users Tab */}
                  <div className="border border-gray-200 rounded-md shadow-sm w-full">
                    <p className="p-2 px-4 bg-gray-50 text-gray-400 font-semibold">
                      Total Users
                    </p>
                    <div className="p-4 flex justify-between">
                      <div>
                        <p className="font-bold text-2xl">{"10,000"}</p>
                        <p className="text-sm text-green-500 mt-2">
                          +<span>200</span> users vs last month
                        </p>
                      </div>

                      <button
                        className="bg-blue-100 hover:bg-blue-200 transition-colors h-full aspect-square p-2 rounded-md cursor-pointer"
                        onClick={() => setActiveIndex(3)}
                      >
                        <CgArrowTopRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* more Data */}
              <div className="grid grid-cols-1 md:grid-cols-3 mt-4 gap-2 md:gap-4">
                {/* Column 1 */}
                <div className="p-2 border border-gray-200 rounded-md shadow-sm w-full">
                  <p className="p-2 px-4 bg-gray-50 text-gray-700 font-semibold mb-2">
                    Popular Lyrics
                  </p>
                  <LyricsList />
                </div>
                {/* Column 2 */}
                <div className="p-2 border border-gray-200 rounded-md shadow-sm w-full h-fit">
                  <p className="p-2 px-4 bg-gray-50 text-gray-700 font-semibold mb-2">
                    Popular Artists
                  </p>
                  <ArtistList />
                </div>
                {/* Column 3 */}
                <div className="flex flex-col gap-4">
                  <div className="p-2 border border-gray-200 rounded-md shadow-sm w-full h-fit">
                    <p className="p-2 px-4 bg-gray-50 text-gray-700 font-semibold mb-2">
                      Accumulated Balance
                    </p>
                    <p className="p-4 text-2xl font-bold flex items-center gap-2">
                      $ <span>100,000</span>{" "}
                      <span className="text-xs font-normal bg-green-100 text-green-600 p-2 py-1 rounded-full">
                        10% more than target
                      </span>
                    </p>
                  </div>

                  <div className="p-2 border border-gray-200 rounded-md shadow-sm w-full h-fit">
                    <p className="p-2 px-4 bg-gray-50 text-gray-700 font-semibold mb-2">
                      Estimated Balance for this month
                    </p>
                    <p className="p-4 text-2xl font-bold flex items-center gap-2">
                      $ <span>100,000</span>{" "}
                      <span className="text-xs font-normal bg-green-100 text-green-600 p-2 py-1 rounded-full">
                        10% more than target
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel header="Artists">
              <p className="m-0">Artist Data Here</p>
            </TabPanel>
            <TabPanel header="Lyrics">
              <p className="m-0">Lyrics data here</p>
            </TabPanel>
            <TabPanel header="Users">
              <UserTable/>
            </TabPanel>
          </TabView>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
