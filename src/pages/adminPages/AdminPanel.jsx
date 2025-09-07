import React from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { useState, useEffect, useCallback } from "react";
import { CgArrowTopRight } from "react-icons/cg";
import UsersTab from "./UsersTab/UsersTab";
import ArtistsTab from "./ArtistTab/ArtistsTab";
import LyricsTab from "./LyricsTab/LyricsTab";
import PaymentTab from "./PaymentTab/PaymentsTab";
import {
  fetchTop10Artists,
  fetchArtistOverview,
  fetchUserOverview,
  fetchLyricOverview,
  fetchPopularLyrics,
  fetchPaymentOverview,
} from "../../assets/util/api";

const Nav = React.lazy(() => import("../../components/adminComponents/Nav"));

const LyricsList = () => {
  const [popularLyrics, setPopularLyrics] = useState([]);
  const getPopularLyrics = useCallback(async () => {
    try {
      const lyrics = await fetchPopularLyrics(localStorage.getItem("token"));
      setPopularLyrics(lyrics);
    } catch (err) {
      console.error("Error fetching user overview:", err);
    }
  }, []);

  useEffect(() => {
    getPopularLyrics();
  }, [getPopularLyrics]);

  return (
    <div>
      {popularLyrics.map((lyric, index) => (
        <div
          key={index}
          className="relative flex items-center justify-between w-full border-b last:border-0  border-dashed border-gray-200 px-3"
        >
          <div className="flex items-center gap-1">
            <p className="mr-4 font-semibold">{index + 1}.</p>
            <img src={lyric.lyricsPhoto} className="w-12 h-12 object-contain" />
            <div className="flex justify-between items-center w-full p-2 pl-4">
              <div className="flex flex-col gap-2">
                <p className="font-semibold">
                  {lyric?.title ?? "Sample Title"}
                </p>
                <p className="text-sm text-gray-500">
                  {lyric.singers.map((singer, index) => (
                    <span key={index}>
                      {singer.name}
                      {index < lyric.singers.length - 1 && ", "}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>

          <p className="text-gray-500 text-base font-semibold bg-gray-100 p-1 px-2 rounded-full">
            {lyric.viewCount}
          </p>
        </div>
      ))}
    </div>
  );
};

const ArtistList = () => {
  const [toptenArtists, setToptenArtists] = useState([]);

  const getTop10Artists = useCallback(async () => {
    try {
      const artists = await fetchTop10Artists(localStorage.getItem("token"));
      setToptenArtists(artists);
    } catch (err) {
      console.error("Error fetching user overview:", err);
    }
  }, []);

  useEffect(() => {
    getTop10Artists();
  }, [getTop10Artists]);

  return (
    <div>
      {(toptenArtists || []).map((artist, index) => (
        <div
          key={index}
          className="p-4 px-4 border-b last-of-type:border-0 border-gray-200 border-dashed flex items-center justify-between"
        >
          <p className="mr-4 font-semibold">{index + 1}.</p>
          <div className="w-full flex justify-start items-center gap-2">
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

            <p>{artist.name}</p>
          </div>
          <p className="text-gray-500 text-base font-semibold bg-gray-100 p-1 px-2 rounded-full">
            {artist.searchCount}
          </p>
        </div>
      ))}
    </div>
  );
};

const AdminPanel = () => {
  // Accessing environment variables

  const [activeIndex, setActiveIndex] = useState(0);

  const [artistCounts, setArtistCounts] = useState({
    countDiff: 100,
    totalCount: 0,
    totalSingerCount: 0,
    totalWrtierCount: 0,
    totalBothCount: 0,
  });

  const getArtistOverview = async () => {
    try {
      const artistOverView = await fetchArtistOverview(
        localStorage.getItem("token")
      );
      setArtistCounts(artistOverView);
    } catch (err) {
      console.error("Error fetching user overview:", err);
    }
  };

  const [usersCount, setUsersCount] = useState({
    totalCount: 0,
    totalAdminUsersCount: 0,
    totalFreeUsersCount: 0,
    totalPremiumUsersCount: 0,
    countDiff: 0,
    totalValidCount: 0,
    totalInvalidCount: 0,
  });
  const getUserOverview = async () => {
    try {
      const counts = await fetchUserOverview(localStorage.getItem("token"));
      setUsersCount(counts);
    } catch (err) {
      console.error("Error fetching user overview:", err);
    }
  };

  const [paymentCount, setPaymentCount] = useState({
    totalCount: 0,
    requestCount: 0,
    approveCount: 0,
    rejectCount: 0,
  });

  const getPaymentOverview = async () => {
    try {
      const counts = await fetchPaymentOverview(localStorage.getItem("token"));
      setPaymentCount(counts);
    } catch (err) {
      console.error("Error fetching user overview:", err);
    }
  };

  const [lyricsCount, setLyricsCount] = useState({
    totalCount: 0,
    countDiff: 0,
    enabledCount: 0,
    disabledCount: 0,
  });

  const getLyricOverview = async () => {
    try {
      const counts = await fetchLyricOverview(localStorage.getItem("token"));
      setLyricsCount(counts);
    } catch (err) {
      console.error("Error fetching user overview:", err);
    }
  };

  useEffect(() => {
    getArtistOverview();
    getLyricOverview();
    getUserOverview();
    getPaymentOverview();
  }, []);

  return (
    <>
      <Nav />
      <div className="relative flex flex-col w-screen min-h-screen pt-12">
        <div className="flex justify-between px-4 md:px-24 w-screen">
          <TabView
            className="w-full"
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
          >
            {/* All Data Panel */}
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
                        <p className="font-bold text-2xl">
                          {lyricsCount.totalCount}
                        </p>
                        <p className="text-sm text-green-500 mt-2">
                          +<span>{lyricsCount.countDiff}</span> songs vs last
                          month
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
                        <p className="font-bold text-2xl">
                          {artistCounts.totalCount}
                        </p>
                        <p className="text-sm text-green-500 mt-2">
                          +<span>{artistCounts.countDiff}</span> artists vs last
                          month
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
                        <p className="font-bold text-2xl">
                          {usersCount.totalCount}
                        </p>
                        <p className="text-sm text-green-500 mt-2">
                          +<span>{usersCount.countDiff}</span> users vs last
                          month
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
                  <div
                    className={`${
                      paymentCount.requestCount > 0 ? "rotatingBorder" : ""
                    } p-2 border border-gray-200 rounded-md shadow-sm w-full h-fit`}
                  >
                    <p className="p-2 px-4 bg-blue-50 text-gray-700 font-semibold mb-2">
                      Premium Requests
                    </p>
                    <p className="p-4 text-2xl font-bold flex items-center justify-between gap-2">
                    <div className="flex gap-6 items-center">
                      <div className="relative border border-blue-200 w-12 h-12 rounded-full flex items-center justify-center">
                        <span>{paymentCount.requestCount}</span>
                      </div>{" "}
                      <div className="flex flex-col">
                        <div className="font-normal text-sm text-gray-500">
                          <p className="text-sm text-green-500">
                            <span className="min-w-[20px] font-semibold">{paymentCount.approveCount}</span> Approved
                          </p>
                          <p className="text-sm text-red-500">
                            <span className="min-w-[20px] font-semibold">{paymentCount.rejectCount}</span> Rejected
                          </p>
                        </div>
                      </div>
                    </div>

                      <button
                        className={`${
                          paymentCount.requestCount > 0 ? "rotatingBorder" : ""
                        } bg-blue-100 hover:bg-blue-200 transition-colors h-full aspect-square p-2 rounded-md cursor-pointer`}
                        onClick={() => setActiveIndex(4)}
                      >
                        <CgArrowTopRight size={20} />
                      </button>
                    </p>
                  </div>

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
            {/* Artists Panel */}
            <TabPanel header="Artists">
              <ArtistsTab />
            </TabPanel>
            {/* Lyrics Panel */}
            <TabPanel header="Lyrics">
              <LyricsTab />
            </TabPanel>
            {/* Users Panel */}
            <TabPanel header="Users">
              <UsersTab />
            </TabPanel>
            {/* Payments Panel */}
            <TabPanel header="Payments">
              <PaymentTab />
            </TabPanel>
          </TabView>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
