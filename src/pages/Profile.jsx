import { useEffect, useState, useCallback } from "react";
import Footer from "../components/common/Footer";
import { IoSettingsOutline } from "react-icons/io5";
import ProfileEdit from "../components/common/ProfileEdit";
import {
  fetchCollectionOverview,
  fetchLyricsByGroup,
} from "../assets/util/api";

const Profile = () => {
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
  const [loading, setLoading] = useState(true);

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
    getLyricsByGroup(group);
  };

  const getLyricsByGroup = useCallback(
    async (group) => {
      console.log("Sending token:", token);
      try {
        const lyrics = await fetchLyricsByGroup(group, token);
        setSelectedGroupLyrics(lyrics);
      } catch (err) {
        console.error("Error fetching lyrics by group:", err);
      }
    },
    [token]
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

  if (loading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <p className="text-xl font-semibold">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden overflow-y-auto">
      <div className="relative flex flex-col gap-2 min-h-screen md:pt-12">
        <div className="animate-down-start w-full flex flex-col items-center justify-center customBackground rounded-b-4xl py-8">
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
                <p className="font-bold text-lg italic">Collected -</p>
                <span className="font-semibold">{defaultGroupCount}</span>
              </div>
              <div className="flex items-center gap-2 px-4 border-l border-gray-300">
                <p className="font-bold text-lg italic">Groups -</p>
                <span className="font-semibold">
                  {collection?.collections?.length ?? 0}
                </span>
              </div>
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
          <div className="flex gap-2 flex-col py-2 px-4 md:px-24">
            <div className="flex gap-1 items-center justify-between md:gap-4">
              <div className="w-full max-w-36 border border-b-0 px-2 py-2 rounded-t-md border-gray-300 font-semibold flex items-center justify-between">
                <p className="truncate text-nowrap overflow-hidden text-ellipsis pr-2">
                  {selectedGroup}
                </p>
                <p className="flex-shrink-0 border p-.5 rounded-md px-2 border-gray-100 bg-gray-100 font-semibold">
                  {collection?.collections?.find(
                    (item) => item.group === selectedGroup
                  )?.count || 0}
                </p>
              </div>

              <div className="px-3 w-full overflow-auto flex gap-2 py-1">
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

            <div className="grid grid-cols-1 md:grid-cols-4 py-4 gap-4 md:gap-12 border border-gray-300 border-dashed rounded-md rounded-tl-none -translate-y-2">
              {/* Display user’s collected lyrics, or empty state here */}
              {selectedGroupLyrics.length > 0 ? (
                selectedGroupLyrics.map((lyric, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center p-4 bg-white rounded-md shadow-sm"
                  >
                    <img
                      src={
                        lyric.coverImage || "https://via.placeholder.com/150"
                      }
                      alt={lyric.title}
                      className="w-24 h-24 object-cover rounded-md mb-2"
                    />
                    <p className="font-semibold text-center">{lyric.title}</p>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">
                  No lyrics found in this group.
                </p>
              )}
            </div>
          </div>
        ):(
          <div className="px-3 w-full overflow-auto flex gap-2 py-1">
          </div>
        )}
      </div>

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
