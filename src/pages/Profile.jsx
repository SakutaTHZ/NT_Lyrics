import { useEffect, useState, useCallback, useRef } from "react";
import Footer from "../components/common/Footer";
import { IoSettingsOutline } from "react-icons/io5";
import ProfileEdit from "../components/common/ProfileEdit";
import { fetchCollectionOverview } from "../assets/util/api";
import LoadingBox from "../components/common/LoadingBox";
import EmptyData from "../assets/images/Collection list is empty.jpg";
import LyricsRow from "../components/special/LyricsRow";
import axios from "axios";
import { apiUrl } from "../assets/util/api";
import { BiEdit } from "react-icons/bi";
import { CgAdd } from "react-icons/cg";
import EditGroup from "../components/common/EditGroup";
import LyricsRowPremium from "../components/special/LyricRowPremium";

const Profile = () => {
  const [page, setPage] = useState(1);
  const observer = useRef(null);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

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

  // Fallback or mock user
  const getUser = () => {
    const user = localStorage.getItem("user");
    return user
      ? JSON.parse(user)
      : {
          username: "John Doe",
          email: "johndoe@gmail.com",
          profileImage:
            "https://i.pinimg.com/736x/c8/69/8a/c8698a586eb96d0ec43fbb712dcf668d.jpg",
          password: "password",
        };
  };

  const user = getUser();
  const [username, setUsername] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const [showEdit, setShowEdit] = useState(false);
  const [collection, setCollection] = useState(null);

  const token = localStorage.getItem("token");

  const getCollection = useCallback(async () => {
    try {
      const collections = await fetchCollectionOverview(token);
      setCollection(collections);
    } catch (err) {
      console.error("Error fetching user overview:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const defaultGroup = collection?.collections?.find(
    (item) => item.group === "Default"
  );
  const defaultGroupCount = defaultGroup?.count ?? 0;

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedGroupLyrics, setSelectedGroupLyrics] = useState([]);

  const handleGroupChange = (group) => {
    if (!group) return;
    setSelectedGroup(group);
    getLyricsByGroup(group, 1, true);
  };

  const tierMap = {
    guest: 0,
    free: 1,
    premium: 2,
  };

  const getUserType = () => {
    if (!user) return "guest";
    if (user.role === "premium-user") return "premium";
    return "free";
  };

  const userType = getUserType(); // "guest", "free", or "premium"
  const userTier = tierMap[userType]; // 0, 1, or 2

  const shouldHideCollection = (lyricTier = 0) => {
    console.log(`User Tier: ${userTier}, Lyric Tier: ${lyricTier}`);
    return userTier >= lyricTier; // hide if user tier is lower
  };

  const getLyricsByGroup = useCallback(
    async (group, pageNum, override = false) => {
      setLoading(true);

      try {
        const token = localStorage.getItem("token"); // or however you're storing it

        const res = await axios.get(
          `${apiUrl}/collections/getLyricsByGroup?group=${group}`,
          {
            params: {
              page: pageNum,
              limit: 20,
            },
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }), // 🔐 Include the token
            },
          }
        );

        const data = res.data.lyrics;
        console.log("Fetched lyrics:", data);

        if (!Array.isArray(data)) {
          console.error("Expected array, got:", data);
          return [];
        }

        const newData = data;

        setSelectedGroupLyrics((prev) => {
          const merged =
            override || pageNum === 1 ? newData : [...prev, ...newData];
          const unique = Array.from(
            new Map(merged.map((item) => [item._id, item])).values()
          );
          return unique;
        });

        setTotalPages(res.data.totalPages);
        setInitialLoadDone(true);
      } catch (error) {
        console.error("Failed to fetch lyrics:", error);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    getCollection();
  }, [getCollection]);

  // Trigger lyrics fetch once collection is ready and group is determined
  useEffect(() => {
    if (!collection?.collections || collection.collections.length === 0) return;

    // Set default group only once when collections arrive
    const defaultGroup = collection.collections[0].group;
    setSelectedGroup(defaultGroup);
    getLyricsByGroup(defaultGroup);
  }, [collection, getLyricsByGroup]);

  const [showGroupEdit, setShowGroupEdit] = useState(false);

  const handleCollectionStatusChange = useCallback(() => {
    if (selectedGroup) {
      getLyricsByGroup(selectedGroup, 1, true); // refresh lyrics
      getCollection(); // refresh counts
    }
  }, [selectedGroup, getLyricsByGroup, getCollection]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <p className="text-xl font-semibold"></p>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden overflow-y-auto">
      <div className="relative flex flex-col gap-2 min-h-screen md:pt-12">
        <div className="w-full flex flex-col items-center justify-center customBackground rounded-b-4xl py-8">
          <div className="flex items-center flex-col gap-4 w-full px-8 md:px-24">
            <div className="relative profileImageBox flex items-center justify-center">
              <img
                src={
                  "https://i.pinimg.com/736x/81/ec/02/81ec02c841e7aa13d0f099b5df02b25c.jpg"
                }
                alt="Profile"
                className="object-cover w-24 md:w-32 aspect-square rounded-full border-2 border-white"
              />
              <span
                className={`text-xs font-normal absolute px-2 py-0.5 -bottom-2.5 rounded-full ${
                  user.role === "premium-user"
                    ? "bg-amber-200 text-gray-600"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {user.role === "premium-user" ? "premium" : "free"}
              </span>
            </div>

            <div className="relative profileInfo shadow-md text-center">
              <p className="font-bold text-2xl text-white">{username}</p>
              <p className="text-white">{email}</p>
            </div>

            <div className="relative w-full flex items-center justify-center md:gap-4 border p-2 rounded-full border-gray-300 bg-white px-4">
              <div className="flex items-center gap-2 px-4">
                <p className=" text-lg">Collected -</p>
                <p>
                  <span
                    className={`${
                      user.role != "premium-user" &&
                      defaultGroupCount === 20 &&
                      "text-red-500"
                    } font-semibold mr-1`}
                  >
                    {defaultGroupCount}
                  </span>
                  {user.role != "premium-user" && (
                    <span>
                      <span className="font-normal mr-1">/</span>
                      <span className="font-normal">20</span>
                    </span>
                  )}
                </p>
              </div>
              {user.role === "premium-user" && (
                <div className="flex items-center gap-2 px-4 border-l border-gray-300">
                  <p className=" text-lg">Groups -</p>
                  <span className="font-semibold">
                    {collection?.collections?.length ?? 0}
                  </span>
                </div>
              )}
            </div>

            <div className="relative">
              {user.role != "premium-user" && defaultGroupCount === 20 && (
                <button className="bg-amber-200 px-5 py-1 rounded-full w-full">
                  More features in Premium{" "}
                  <span className="text-blue-700 animate-pulse">
                    Learn more ...
                  </span>
                </button>
              )}
            </div>

            <button
              className="ml-4 bg-gray-100 rounded-md cursor-pointer p-2 absolute right-4 top-4"
              onClick={() => setShowEdit(true)}
            >
              <IoSettingsOutline size={20} className="text-gray-500" />
            </button>
          </div>
        </div>
        {user.role === "premium-user" ? (
          collection?.collections?.length > 0 && (
            <div className="flex flex-col py-2 px-4 md:px-24">
              <div className="flex flex-col items-center justify-between md:gap-4  sticky top-0  z-20">
                {/* Groups */}
                <div className="w-full flex items-center justify-between gap-2 bg-white">
                  <button
                    className=" bg-gray-100 rounded-md cursor-pointer p-2 flex items-center gap-2"
                    onClick={() => console.log("Create Group")}
                  >
                    <CgAdd size={20} className="text-gray-500" />
                  </button>
                  <div className="w-full bg-white sticky top-0 overflow-auto flex gap-2 py-3">
                    {(collection?.collections || []).map((col, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-1 rounded-md border border-gray-300 font-semibold cursor-pointer ${
                          selectedGroup === col.group ? "bg-gray-200" : ""
                        }`}
                        onClick={() => handleGroupChange(col.group)}
                      >
                        {col.group}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="w-full border border-b-0 px-2 py-2 rounded-t-md bg-white border-gray-300 font-semibold flex items-center justify-between">
                  <p>
                    <span className="truncate text-nowrap overflow-hidden text-ellipsis pr-2">
                      {selectedGroup}
                    </span>
                    <span className="flex-shrink-0 border p-.5 rounded-md px-2 border-gray-100 bg-gray-100 font-semibold">
                      {collection?.collections?.find(
                        (item) => item.group === selectedGroup
                      )?.count || 0}
                    </span>
                  </p>

                  <button
                    className="ml-4 bg-gray-100 rounded-md cursor-pointer p-2 flex items-center gap-2"
                    onClick={() => setShowGroupEdit(true)}
                  >
                    <BiEdit size={20} className="text-gray-500" />
                  </button>
                </div>
              </div>

              <div
                className={`grid ${
                  loading || selectedGroupLyrics.length > 0
                    ? "md:grid-cols-5 md:place-items-center md:gap-6"
                    : "grid-cols-1 md:gap-12"
                } p-2 py-4 gap-0 px-4 md:px-24 border border-gray-200 rounded-b-md`}
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

                  if (selectedGroupLyrics.length === 0) {
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
                      {selectedGroupLyrics.map((lyric, index) => {
                        const isLast = index === selectedGroupLyrics.length - 1;
                        return (
                          <div
                            key={lyric._id}
                            className="border-b border-gray-200 last:border-0 border-dashed"
                          >
                            {
                              
                                                                <LyricsRowPremium
                                                                  id={lyric._id}
                                                                  lyric={lyric}
                                                                  isLast={isLast}
                                                                  lastUserRef={lastUserRef}
                                                                />
                            }
                          </div>
                        );
                      })}
                    </>
                  );
                })()}
              </div>
            </div>
          )
        ) : (
          <div
            className={`grid ${
              loading || selectedGroupLyrics.length > 0
                ? "md:grid-cols-5 md:place-items-center md:gap-6"
                : "grid-cols-1 md:gap-12"
            } p-2 py-4 gap-0 px-4 md:px-24`}
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

              if (selectedGroupLyrics.length === 0) {
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
                  {selectedGroupLyrics.map((lyric, index) => {
                    const isLast = index === selectedGroupLyrics.length - 1;
                    return (
                      <div
                        key={lyric._id}
                        className="border-b border-gray-200 last:border-0 border-dashed"
                      >
                        {
                          <LyricsRow
                            id={lyric._id}
                            lyric={lyric}
                            isLast={isLast}
                            lastUserRef={lastUserRef}
                            onCollectionStatusChange={
                              handleCollectionStatusChange
                            }
                            access={shouldHideCollection(lyric.tier)}
                          />
                        }
                      </div>
                    );
                  })}
                </>
              );
            })()}
          </div>
        )}
      </div>

      {showGroupEdit && (
        <EditGroup
          groupName={selectedGroup}
          onClose={() => setShowGroupEdit(false)}
        />
      )}

      {showEdit && (
        <ProfileEdit
          usernameChange={setUsername}
          emailChange={setEmail}
          closeBox={() => setShowEdit(false)}
        />
      )}

      <Footer />
    </div>
  );
};

export default Profile;
