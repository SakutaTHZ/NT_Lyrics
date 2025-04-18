import { useEffect, useState, Suspense } from "react";
import Nav from "../components/common/Nav";
import Footer from "../components/common/Footer";
import bgcover from "../assets/images/cover_bg.png";
import { IoSettingsOutline } from "react-icons/io5";
import ProfileEdit from "../components/common/ProfileEdit";
import LyricsGrid from "../components/special/LyricsGrid";
import mockData from "../assets/data/mockSongs.json"
import EmptyData from "../assets/images/Collection list is empty.jpg";

const fetchUserLyrics = async (page, itemsPerBatch) => {
  // const response = await fetch(`/api/user/saved-lyrics?page=${page}&limit=${itemsPerBatch}`);
  // const data = await response.json();
  // return data.lyrics;
  const startIndex = (page - 1) * itemsPerBatch;
  return Promise.resolve(mockData.slice(startIndex, startIndex + itemsPerBatch));
};

const Profile = () => {
  const [myCollection, setMyCollection] = useState(8);
  const [showEdit, setShowEdit] = useState(false);

  const getCollection = () => {
    let collection = localStorage.getItem("collection");
    if (collection) {
      setMyCollection(collection);
    }
  };

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

  useEffect(() => {
    getCollection;
  }, []);

  const [username,setUsername] = useState(user.name)
  const [email,setEmail] = useState(user.email)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-screen h-screen overflow-hidden overflow-y-auto">
        <Nav />
        {/* Lyrics */}
        <div className="relative flex flex-col gap-2 min-h-screen pt-12">
          <div className="profileBanner animate-down-start w-full h-64 flex flex-col items-start justify-center px-4 md:px-24">
            <div className="bannerImage w-full h-1/2 flex bg-amber-200 overflow-hidden">
              <img
                src={bgcover}
                alt="Profile Banner"
                className="object-cover w-full"
              />
            </div>
            <div className="w-full h-1/2 border-b border-gray-300 py-18 pb-12 -translate-y-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="profileImageBox w-24 md:w-32 aspect-square rounded-full overflow-hidden border-8 border-white">
                  <img
                    src="https://i.pinimg.com/736x/c8/69/8a/c8698a586eb96d0ec43fbb712dcf668d.jpg"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="profileInfo">
                  <p className="font-bold text-2xl">{username}</p>
                  <p className="text-gray-600">{email}</p>
                </div>
              </div>
              <button
                className="ml-4 bg-gray-100 rounded-md cursor-pointer p-2"
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

          <div className="flex gap-4 flex-col -translate-y-6">
            <div className="flex gap-1 items-center md:gap-4 px-4 md:px-24">
              <p className="font-bold text-lg italic">My Collection</p>
              <div className="border p-1 rounded-md px-3 border-gray-300 font-semibold">
                {myCollection} <span className="text-gray-400">/ 20</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 py-4 gap-4 md:gap-12 px-4 md:px-24">
            {mockData.length === 0 ? (
              <div className="w-full">
                <img
                  src={EmptyData}
                  alt="No data Found"
                  className="w-full opacity-50"
                />
              </div>
            ) : (
              <LyricsGrid fetchLyrics={fetchUserLyrics} />)}
            </div>
          </div>
        </div>

        {showEdit && <ProfileEdit usernameChange={setUsername} emailChange={setEmail} closeBox={() => setShowEdit(false)} />}

        <Footer />
      </div>
    </Suspense>
  );
};

export default Profile;
