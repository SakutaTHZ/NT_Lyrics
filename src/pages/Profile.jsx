import { useEffect, useState, useCallback, useRef } from "react";
import Footer from "../components/common/Footer";
import { IoInformationCircleOutline, IoSettingsOutline } from "react-icons/io5";
import ProfileEdit from "../components/common/ProfileEdit";
import {
  checkIfPaymentRequested,
  fetchCollectionOverview,
  validateUser,
} from "../assets/util/api";
import LoadingBox from "../components/common/LoadingBox";
import EmptyData from "../assets/images/Collection list is empty.jpg";
import LyricsRow from "../components/special/LyricsRow";
import axios from "axios";
import { apiUrl } from "../assets/util/api";
import EditGroup from "../components/common/EditGroup";
import LyricsRowPremium from "../components/special/LyricRowPremium";
import { Link } from "react-router-dom";
import { Dialog } from "primereact/dialog";

const Profile = () => {
  const [page, setPage] = useState(1);
  const observer = useRef(null);

  // Separate loading states
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingLyrics, setLoadingLyrics] = useState(false);

  const [totalPages, setTotalPages] = useState(0);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const lastUserRef = useCallback(
    (node) => {
      if (loadingLyrics || page >= totalPages) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loadingLyrics, totalPages, page]
  );

  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("free-user");
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const id = JSON.parse(localStorage.getItem("user") || "{}")?.id;
    if (!id) {
      setUserLoaded(true);
      return;
    }

    const getUser = async () => {
      setLoadingProfile(true);
      try {
        const userData = await validateUser(id, token);
        if (!userData) throw new Error("No user returned");
        setUser(userData.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setUserLoaded(true);
        setLoadingProfile(false);
      }
    };

    getUser();
  }, []);

  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const checkPayment = async () => {
      try {
        const paymentData = await checkIfPaymentRequested(token);
        if (!paymentData) throw new Error("No payment returned");
        const exists = paymentData.isExist;
        setIsPaymentProcessing(exists);
        setPayment(paymentData.payment || null);
      } catch (err) {
        console.error("Failed to fetch payment:", err);
      }
    };

    checkPayment();
  }, []);

  const [username, setUsername] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!user) return;
    setUsername(user.name);
    setEmail(user.email);
    setUserRole(user.role);
  }, [user]);

  const [showEdit, setShowEdit] = useState(false);
  const [collection, setCollection] = useState(null);

  const token = localStorage.getItem("token");

  const getCollection = useCallback(async () => {
    setLoadingProfile(true);
    try {
      const collections = await fetchCollectionOverview(token);
      const sortedCollections = [...collections.collections].sort((a, b) => {
        if (a.group === "Default") return -1;
        if (b.group === "Default") return 1;
        return 0;
      });
      setCollection({ ...collections, collections: sortedCollections });
    } catch (err) {
      console.error("Error fetching user overview:", err);
    } finally {
      setLoadingProfile(false);
    }
  }, [token]);

  const defaultGroup = collection?.collections?.find(
    (item) => item.group === "Default"
  );
  const defaultGroupCount = defaultGroup?.count ?? 0;

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedGroupLyrics, setSelectedGroupLyrics] = useState([]);

  const tierMap = {
    guest: 0,
    free: 1,
    premium: 2,
  };

  const getUserType = () => {
    if (!user) return "guest";
    if (userRole === "premium-user") return "premium";
    return "free";
  };

  const userType = getUserType(); // "guest", "free", or "premium"
  const userTier = tierMap[userType]; // 0, 1, or 2

  const shouldHideCollection = (lyricTier = 0) => userTier >= lyricTier;

  const getLyricsByGroup = useCallback(
    async (group, pageNum, override = false) => {
      setLoadingLyrics(true);

      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${apiUrl}/collections/getLyricsByGroup?group=${group}`,
          {
            params: {
              page: pageNum,
              limit: 20,
            },
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );

        const data = res.data.lyrics;

        if (!Array.isArray(data)) {
          console.error("Expected array, got:", data);
          return [];
        }

        setSelectedGroupLyrics((prev) => {
          const merged = override || pageNum === 1 ? data : [...prev, ...data];
          const unique = Array.from(
            new Map(merged.map((item) => [item._id, item])).values()
          );
          return unique;
        });

        setTotalPages(res.data.totalPages);
        if (override) setPage(1);
        setInitialLoadDone(true);
      } catch (error) {
        console.error("Failed to fetch lyrics:", error);
        return [];
      } finally {
        setLoadingLyrics(false);
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

    const defaultCol = collection.collections.find(
      (c) => c.group === "Default"
    );
    const firstGroup = defaultCol
      ? defaultCol.group
      : collection.collections[0].group;

    setSelectedGroup(firstGroup);
    getLyricsByGroup(firstGroup, 1, true);
  }, [collection, getLyricsByGroup]);

  const handleGroupChange = (group) => {
    if (!group || group === selectedGroup) return;
    setSelectedGroup(group);
    getLyricsByGroup(group, 1, true);
  };

  const [showGroupEdit, setShowGroupEdit] = useState(false);

  const handleCollectionStatusChange = useCallback(() => {
    if (selectedGroup) {
      getLyricsByGroup(selectedGroup, 1, true); // refresh lyrics
      getCollection(); // refresh counts
    }
  }, [selectedGroup, getLyricsByGroup, getCollection]);

  if (loadingProfile) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <p className="text-xl font-semibold">Loading profile...</p>
      </div>
    );
  }

  if (!userLoaded) return null;

  return (
    <div className="w-screen h-screen overflow-hidden overflow-y-auto">
      <div className="relative flex flex-col gap-2 min-h-screen md:pt-12">
        <div className="w-full flex flex-col items-center justify-center customBackground rounded-b-4xl py-8 pb-4">
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
                  userRole === "premium-user"
                    ? "bg-amber-200 text-gray-600"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {userRole === "premium-user" ? "premium" : "free"}
              </span>
            </div>

            <div className="relative profileInfo shadow-md text-center">
              <p className="font-bold text-2xl text-white">{username}</p>
              <p className="text-white">{email}</p>
            </div>

            <div className="relative w-full flex items-center justify-center md:gap-4 border p-2 rounded-full border-gray-300 bg-white">
              <div className="flex items-center gap-2">
                <p className=" text-lg">Collected -</p>
                <p className="pr-4">
                  <span
                    className={`${
                      userRole !== "premium-user" &&
                      defaultGroupCount >= 20 &&
                      "text-red-500"
                    } font-semibold mr-1`}
                  >
                    {defaultGroupCount}
                  </span>
                  {userRole !== "premium-user" && (
                    <>
                      <span className="font-normal mr-1">/</span>
                      <span className="font-normal">20</span>
                    </>
                  )}
                </p>
              </div>
              {userRole === "premium-user" && (
                <div className="flex items-center gap-2 px-4 border-l border-gray-300">
                  <p className=" text-lg">Groups -</p>
                  <span
                    className={`font-semibold ${
                      collection?.collections?.length >= 20
                        ? "text-red-500"
                        : ""
                    }`}
                  >
                    {collection?.collections?.length ?? 0}
                  </span>
                </div>
              )}
            </div>

            {/* Premium request Status */}
            {isPaymentProcessing && (
              <div
                className="relative w-full bg-blue-50 p-2 rounded-full text-center text-blue-700 font-semibold flex items-center justify-center gap-2 border border-blue-200"
                onClick={() => setVisible(true)}
              >
                Premium request Pending
                <IoInformationCircleOutline size={18} fontWeight={900} />
              </div>
            )}
            <Dialog
              header="Payment Status"
              visible={visible}
              className="w-[90vw] md:w-[40vw] rounded-xl shadow-lg paymentStatusDialog"
              onHide={() => {
                if (!visible) return;
                setVisible(false);
              }}
            >
              <div className="p-2">
                {payment ? (
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                      <span className="font-medium text-gray-600">
                        Requested At:
                      </span>
                      <span className="text-gray-900"> 
                        {new Date(payment.requestedAt).toISOString().slice(0, 10)}
                      </span>

                      <span className="font-medium text-gray-600">Phone:</span>
                      <span className="text-gray-900">{payment.phone}</span>

                      <span className="font-medium text-gray-600">
                        Payment Type:
                      </span>
                      <span className="capitalize text-gray-900">
                        {payment.paymentType}
                      </span>

                      <span className="font-medium text-gray-600">
                        Payment Plan:
                      </span>
                      <span className="text-gray-900">
                        {payment.durationInMonths} months
                      </span>

                      <span className="font-medium text-gray-600">Total:</span>
                      <span className="text-gray-900 font-semibold">
                        {payment.durationInMonths === 6
                          ? "10,000 Ks"
                          : payment.durationInMonths === 12
                          ? "18,000 Ks"
                          : "???"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-6">
                    No payment information available.
                  </div>
                )}
              </div>
            </Dialog>

            <div className="relative">
              {userRole !== "premium-user" && defaultGroupCount >= 20 && (
                <button className="bg-amber-200 px-5 py-1 rounded-full w-full">
                  More features in Premium{" "}
                  <Link
                    to="/NT_Lyrics/premium"
                    className="text-blue-700 animate-pulse"
                  >
                    Learn more ...
                  </Link>
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

        {userRole === "premium-user" ? (
          collection?.collections?.length > 0 && (
            <div className="flex flex-col py-2 px-4 md:px-24">
              <div className="flex flex-col items-center justify-between md:gap-4 sticky top-0 z-20">
                {/* Groups */}
                <div className="w-full flex items-center justify-between gap-2 bg-white">
                  <div className="w-full bg-white sticky top-0 overflow-auto flex gap-2 py-3">
                    {(collection?.collections || []).map((col, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-1 rounded-md border border-gray-300 font-semibold cursor-pointer text-nowrap ${
                          selectedGroup === col.group
                            ? "bg-blue-500 text-white"
                            : ""
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
                </div>
              </div>

              <div
                className={`grid ${
                  loadingLyrics || selectedGroupLyrics.length > 0
                    ? "md:gap-6"
                    : "grid-cols-1 md:gap-12"
                } p-2 py-4 gap-0 border border-gray-200 rounded-b-md`}
              >
                {loadingLyrics && !initialLoadDone ? (
                  Array.from({ length: 12 }).map((_, index) => (
                    <LoadingBox key={index} />
                  ))
                ) : selectedGroupLyrics.length === 0 ? (
                  <div className="w-full flex flex-col items-center justify-center gap-4 text-center py-6 text-gray-400">
                    <img
                      src={EmptyData}
                      alt="No data Found"
                      className="w-full md:w-96 opacity-50"
                    />
                  </div>
                ) : (
                  selectedGroupLyrics.map((lyric, index) => {
                    const isLast = index === selectedGroupLyrics.length - 1;
                    return (
                      <div
                        key={lyric._id}
                        className="border-b border-gray-200 last:border-0 border-dashed"
                      >
                        <LyricsRowPremium
                          id={lyric._id}
                          lyric={lyric}
                          isLast={isLast}
                          lastUserRef={lastUserRef}
                        />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )
        ) : (
          <div
            className={`grid ${
              loadingLyrics || selectedGroupLyrics.length > 0
                ? "md:gap-6"
                : "grid-cols-1 md:gap-12"
            } p-2 py-4 gap-0 px-4 md:px-24`}
          >
            {loadingLyrics && !initialLoadDone ? (
              Array.from({ length: 12 }).map((_, index) => (
                <LoadingBox key={index} />
              ))
            ) : selectedGroupLyrics.length === 0 ? (
              <div className="w-full flex flex-col items-center justify-center gap-4 text-center py-6 text-gray-400">
                <img
                  src={EmptyData}
                  alt="No data Found"
                  className="w-full md:w-96 opacity-50"
                />
              </div>
            ) : (
              selectedGroupLyrics.map((lyric, index) => {
                const isLast = index === selectedGroupLyrics.length - 1;
                return (
                  <div
                    key={lyric._id}
                    className="border-b border-gray-200 last:border-0 border-dashed"
                  >
                    <LyricsRow
                      id={lyric._id}
                      lyric={lyric}
                      isLast={isLast}
                      lastUserRef={lastUserRef}
                      onCollectionStatusChange={handleCollectionStatusChange}
                      access={shouldHideCollection(lyric.tier)}
                    />
                  </div>
                );
              })
            )}
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
          userData={user}
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
