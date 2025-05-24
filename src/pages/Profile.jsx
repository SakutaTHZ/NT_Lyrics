import { useEffect, useState, Suspense } from "react";
import Nav from "../components/common/Nav";
import Footer from "../components/common/Footer";
import { IoSettingsOutline } from "react-icons/io5";
import ProfileEdit from "../components/common/ProfileEdit";
import mockData from "../assets/data/mockSongs.json";
import EmptyData from "../assets/images/Collection list is empty.jpg";
import { fetchCollectionOverview } from "../assets/util/api";
import { useCallback } from "react";

const Profile = () => {
  //const [myCollection, setMyCollection] = useState(8);
  const [showEdit, setShowEdit] = useState(false);

  const [collection, setCollection] = useState([]);

  const getCollection = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const collections = await fetchCollectionOverview(token);

      setCollection(collections);
      console.log("Fetched:", collections);
    } catch (err) {
      console.error("Error fetching user overview:", err);
    }
  }, []);

  useEffect(() => {
    getCollection();
  }, [getCollection]);

  useEffect(() => {
    console.log("Collection state updated:", collection);
    console.log(
      "Collection state length:",
      collection.collections?.[0]?.count ?? "N/A"
    );
  }, [collection]);

  // Get User data here
  const getUser = () => {
    let user = localStorage.getItem("user");
    if (user) {
      return JSON.parse(user);
    } else {
      // For sample data
      return {
        username: "John Doe",
        email: "johndoe@gmail.com",
        profileImage:
          "https://i.pinimg.com/736x/c8/69/8a/c8698a586eb96d0ec43fbb712dcf668d.jpg",
        password: "password",
      };
    }
  };
  let user = getUser();

  const [username, setUsername] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-screen h-screen overflow-hidden overflow-y-auto">
        <Nav />
        {/* Lyrics */}
        <div className="relative flex flex-col gap-2 min-h-screen pt-12">
          <div className="animate-down-start w-full flex flex-col items-center justify-center customBackground rounded-b-4xl py-8">
            <div className="flex items-center flex-col gap-4 w-full px-8 md:px-24">
              <div className="relative profileImageBox flex items-center justify-center">
                <img
                  src="https://i.pinimg.com/736x/c8/69/8a/c8698a586eb96d0ec43fbb712dcf668d.jpg"
                  className="object-cover w-24 md:w-32 aspect-square rounded-full border-2 border-white"
                />
                {user.role === "premium-user" ? (
                  <span className="text-xs font-normal absolute bg-amber-200 px-2 py-0.5 -bottom-2.5 rounded-full text-gray-600">
                    premium
                  </span>
                ) : (
                  <span className="text-xs font-normal absolute bg-gray-200 px-2 py-0.5 -bottom-2.5 rounded-full text-gray-600">
                    free
                  </span>
                )}
              </div>
              <div className="profileInfo shadow-md">
                <p className="relative font-bold text-2xl text-white w-full text-center">
                  {username}
                </p>
                <p className="relative text-white text-center">{email}</p>
              </div>

              <div className="relative w-full flex items-center justify-center md:gap-4 border p-2 rounded-full border-gray-300 bg-white px-4">
                <div className="flex items-center gap-2 px-4">
                  <p className="font-bold text-lg italic">Collected - {collection.collections?.length} </p>
                </div>
                <div className="flex items-center gap-2 px-4 border-l border-gray-300">
                  <p className="font-bold text-lg italic">Groups - {collection.collections?.length}</p>
                </div>
              </div>

              <button
                className="ml-4 bg-gray-100 rounded-md cursor-pointer p-2 absolute right-4 top-4"
                onClick={() => setShowEdit(true)}
              >
                <IoSettingsOutline
                  size={20}
                  fontStyle={"bold"}
                  className="text-gray-500"
                />
              </button>
            </div>
          </div>

          <div className="flex gap-2 flex-col py-2  px-4 md:px-24">
            <div className="flex gap-1 items-center justify-between md:gap-4">
              <div className="w-full max-w-36 border border-b-0 px-2 py-2 rounded-t-md border-gray-300 font-semibold flex items-center justify-between">
                <p className="truncate text-nowrap overflow-hidden text-ellipsis pr-2 ">
                  Collections
                </p>
                <p className="flex-shrink-0 border p-.5 rounded-md px-2 border-gray-100 bg-gray-100 font-semibold">
                  2
                </p>
              </div>
              <div className="px-3 w-full overflow-auto flex gap-2 py-1">
                <span className="px-2 py-1 rounded-md border border-gray-300 font-semibold">
                  Test
                </span>
                <span className="px-2 py-1 rounded-md border border-gray-300 font-semibold">
                  Test
                </span>
                <span className="px-2 py-1 rounded-md border border-gray-300 font-semibold">
                  Test
                </span>

                <span className="px-2 py-1 rounded-md border border-gray-300 font-semibold">
                  Test
                </span>
                <span className="px-2 py-1 rounded-md border border-gray-300 font-semibold">
                  Test
                </span>
                <span className="px-2 py-1 rounded-md border border-gray-300 font-semibold">
                  Test
                </span>
                <span className="px-2 py-1 rounded-md border border-gray-300 font-semibold">
                  Test
                </span>
                <span className="px-2 py-1 rounded-md border border-gray-300 font-semibold">
                  Test
                </span>
                <span className="px-2 py-1 rounded-md border border-gray-300 font-semibold">
                  Test
                </span>
                <span className="px-2 py-1 rounded-md border border-gray-300 font-semibold">
                  Test
                </span>
                <span className="px-2 py-1 rounded-md border border-gray-300 font-semibold">
                  Test
                </span>
              </div>
            </div>

            {/*<div className="flex gap-1 items-center justify-between md:gap-4 px-4 md:px-24">
              <p className="font-bold text-lg italic">My Collection</p>
              <div className="border p-1 rounded-md px-3 border-gray-300 font-semibold">
                {collection.collections?.[0]?.count ?? "N/A"}{" "}
                <span className="text-gray-400">
                  / {user.role === "premium-user" ? "∞" : "20"}
                </span>
              </div>
            </div>*/}

            <div className="grid grid-cols-1 md:grid-cols-4 py-4 gap-4 md:gap-12 border border-gray-300 border-dashed rounded-md rounded-tl-none -translate-y-2">
              {mockData.length === 0 ? (
                <div className="w-full">
                  <img
                    src={EmptyData}
                    alt="No data Found"
                    className="w-full opacity-50"
                  />
                </div>
              ) : (
                <div className="w-full">
                  <img
                    src={EmptyData}
                    alt="No data Found"
                    className="w-full opacity-50"
                  />
                </div>
              )}
            </div>
          </div>
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
    </Suspense>
  );
};

export default Profile;
