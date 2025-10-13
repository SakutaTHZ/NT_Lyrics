import { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { IoInformationCircleOutline, IoSettingsOutline } from "react-icons/io5";
import { CgTrash } from "react-icons/cg";
import { Dialog } from "primereact/dialog";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { useTranslation } from "react-i18next";
import axios from "axios";

import Footer from "../components/common/Footer";
import ProfileEdit from "../components/common/ProfileEdit";
import LoadingBox from "../components/common/LoadingBox";
import LyricsRow from "../components/special/LyricsRow";
import LyricsRowPremium from "../components/special/LyricRowPremium";
import MessagePopup from "../components/common/MessagePopup";

import {
  checkIfPaymentRequested,
  fetchCollectionOverview,
  apiUrl,
} from "../assets/util/api";
import { useAuth } from "../components/hooks/authContext";

const Profile = () => {
  const { t } = useTranslation();

  const { user, token, isLoading } = useAuth();

  // Loading states
  const [loadingLyrics, setLoadingLyrics] = useState(false);

  // Pagination & intersection observer
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const observer = useRef(null);

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

  // User state
  const [userRole, setUserRole] = useState("free-user");

  // Payment state
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [payment, setPayment] = useState(null);
  const [visible, setVisible] = useState(false);

  // Profile info
  const [username, setUsername] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);

  // UI state
  const [showEdit, setShowEdit] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState("success");

  // Collections & Lyrics
  const [collection, setCollection] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedGroupLyrics, setSelectedGroupLyrics] = useState([]);

  const storedUser = localStorage.getItem("user");
  const id = JSON.parse(storedUser || "{}")?.id;

  if (!id || !token) {
    setMessageText("ID and token are missing! Please Log in again");
    setMessageType("error");
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 5000);
  }

  /** ===================
   * USER FETCH & VALIDATION
   * =================== */

  /** ===================
   * PAYMENT CHECK
   * =================== */
  useEffect(() => {
    if (!user) return;
    const checkPayment = async () => {
      try {
        const paymentData = await checkIfPaymentRequested(token);
        if (!paymentData) throw new Error("No payment returned");
        setIsPaymentProcessing(paymentData.isExist);
        setPayment(paymentData.payment || null);
      } catch (err) {
        console.error("Failed to fetch payment:", err);
      }
    };

    checkPayment();
  }, [user, token]);

  /** ===================
   * SYNC USER INFO
   * =================== */
  useEffect(() => {
    if (!user) return;
    setUsername(user.name);
    setEmail(user.email);
    setUserRole(user.role);
  }, [user]);

  /** ===================
   * COLLECTION FETCH
   * =================== */
  const getCollection = useCallback(async () => {
    try {
      const collections = await fetchCollectionOverview(token);
      let userCollections = collections.collections || [];

      userCollections = userCollections.map((col) =>
        typeof col === "string" ? { group: col } : col
      );

      if (!userCollections.some((c) => c.group === "Default")) {
        userCollections = [{ group: "Default" }, ...userCollections];
      }

      const sortedCollections = [...userCollections].sort((a, b) => {
        if (a.group === "Default") return -1;
        if (b.group === "Default") return 1;
        return a.group.localeCompare(b.group);
      });

      setCollection({ ...collections, collections: sortedCollections });
    } catch (err) {
      console.error("Error fetching user overview:", err);
    }
  }, [token]);

  useEffect(() => {
    if (!user) return;
    getCollection();
  }, [user, getCollection]);

  /** ===================
   * LYRICS FETCH
   * =================== */
  const getLyricsByGroup = useCallback(
    async (group, pageNum, override = false) => {
      setLoadingLyrics(true);

      if (userRole !== "premium-user") group = "Default";

      try {
        const res = await axios.get(
          `${apiUrl}/collections/getLyricsByGroup?group=${group}`,
          {
            params: { page: pageNum, limit: 20 },
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
          return Array.from(new Map(merged.map((i) => [i._id, i])).values());
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
    [userRole, token]
  );

  useEffect(() => {
    if (!user) return;
    if (!collection?.collections?.length) return;
    const defaultCol = collection.collections.find(
      (c) => c.group === "Default"
    );
    const firstGroup = defaultCol
      ? defaultCol.group
      : collection.collections[0].group;
    setSelectedGroup(firstGroup);
    getLyricsByGroup(firstGroup, 1, true);
  }, [user, collection, getLyricsByGroup]);

  /** ===================
   * GROUP HANDLERS
   * =================== */
  const handleGroupChange = (group) => {
    if (!group || group === selectedGroup) return;
    setSelectedGroup(group);
    getLyricsByGroup(group, 1, true);
  };

  const handleCollectionStatusChange = useCallback(
    (lyricId, isFavourite) => {
      setSelectedGroupLyrics((prev) =>
        prev.map((l) => (l._id === lyricId ? { ...l, isFavourite } : l))
      );
      // Then re-fetch to sync with backend
      if (selectedGroup) {
        getLyricsByGroup(selectedGroup, 1, true);
        getCollection();
      }
    },
    [selectedGroup, getLyricsByGroup, getCollection]
  );

  const deleteGroup = async () => {
    if (!selectedGroup) return;

    if (selectedGroup === "Default") {
      setMessageText("Default group cannot be deleted.");
      setMessageType("error");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 5000);
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/collections/removeCollection`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ collectionName: selectedGroup }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete Group");

      setMessageText("Group Deleted successfully");
      setMessageType("success");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 5000);

      await getCollection();
      setSelectedGroup((prev) => {
        const remaining = collection?.collections
          ?.map((col) => col.group)
          .filter((g) => g !== prev);
        return remaining?.[0] || null;
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = (e) => {
    confirmPopup({
      target: e.currentTarget,
      message: "Are you sure you want to delete this Group?",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      acceptLabel: "Yes",
      rejectLabel: "No",
      accept: deleteGroup,
    });
  };

  /** ===================
   * UTILS
   * =================== */
  const tierMap = { guest: 0, free: 1, premium: 2 };
  const getUserType = () => {
    if (!user) return "guest";
    return userRole === "premium-user" ? "premium" : "free";
  };

  const userType = getUserType();
  const userTier = tierMap[userType];
  const shouldHideCollection = (lyricTier = 0) => userTier >= lyricTier;

  const defaultGroup = collection?.collections?.find(
    (c) => c.group === "Default"
  );
  const defaultGroupCount = defaultGroup?.count ?? 0;

  /** ===================
   * RENDER
   * =================== */
  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <p className="text-xl font-semibold">Loading profile...</p>
      </div>
    );
  }

  if (isLoading) return null;

  return (
    <>
      {showMessage && (
        <MessagePopup
          message_type={messageType}
          closePopup={() => setShowMessage(false)}
        >
          <div className="message_text text-pretty text-left flex flex-col gap-3">
            <p>
              {messageText.split("\n").map((line, index) => (
                <span key={index}>{line}</span>
              ))}
            </p>
          </div>
        </MessagePopup>
      )}
      <div className="w-screen h-screen overflow-hidden overflow-y-auto">
        <div className="relative flex flex-col gap-2 min-h-screen md:pt-12 pb-16">
          <div className="w-full flex flex-col items-center justify-center customBackground rounded-b-4xl py-8 pb-4">
            <div className="flex items-center flex-col gap-4 w-full px-8 md:px-24 z-[50]">
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
                      ? "c-premium-bg text-gray-600"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {userRole === "premium-user" ? "premium" : "free"}
                </span>
              </div>

              <div className="relative profileInfo shadow-md text-center text-white">
                <p className="font-bold text-2xl">{username}</p>
                <p>{email}</p>
              </div>

              <div className="relative w-full flex items-center justify-center md:gap-4 border p-2 rounded-full c-border c-bg">
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
                    <p className=" text-lg">Collections -</p>
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
                <div className="">
                  {payment ? (
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                        <span className="font-medium text-gray-600">
                          Requested At:
                        </span>
                        <span className="text-gray-900">
                          {new Date(payment.requestedAt)
                            .toISOString()
                            .slice(0, 10)}
                        </span>

                        <span className="font-medium text-gray-600">
                          Phone:
                        </span>
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

                        <span className="font-medium text-gray-600">
                          Total:
                        </span>
                        <span className="text-gray-900 font-semibold">
                          {payment.durationInMonths === 6
                            ? "10,000 Ks"
                            : payment.durationInMonths === 12
                            ? "18,000 Ks"
                            : "???"}
                        </span>
                      </div>
                      <div className="w-full bg-yellow-100 text-yellow-900 p-4 rounded-lg border border-yellow-500">
                        <p>
                          {t(
                            "upgradePremium.yourPaymentIsBeingProcessedPleaseWait"
                          )}
                        </p>
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
                  <button className="bg-amber-200 text-black px-5 py-1 rounded-full w-full">
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
                className="ml-4 bg-gray-100 rounded-md cursor-pointer p-2 absolute right-4 top-4 z-50"
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
                  <div className="w-full flex items-center justify-between gap-2 c-bg">
                    <div className="w-full c-bg sticky top-0 overflow-auto flex gap-2 py-3">
                      {(collection?.collections || []).map((col, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-1 rounded-md border c-border font-semibold cursor-pointer text-nowrap ${
                            selectedGroup === col.group
                              ? "c-primary c-reverse"
                              : ""
                          }`}
                          onClick={() => handleGroupChange(col.group)}
                        >
                          {col.group}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="w-full border border-b-0 px-2 py-2 rounded-t-md c-bg c-border font-semibold flex items-center justify-between">
                    <p>
                      <span className="flex-shrink-0 border p-.5 rounded-md px-2 c-border c-bg font-semibold">
                        {collection?.collections?.find(
                          (item) => item.group === selectedGroup
                        )?.count || 0}
                        {selectedGroup === "Default" ? " / ∞ " : " / 20"}
                      </span>
                    </p>

                    {selectedGroup !== "Default" && (
                      <button
                        className="c-error-box rounded-md cursor-pointer px-3 py-1"
                        onClick={handleDelete}
                      >
                        <CgTrash size={18} className="text-red-500" />
                      </button>
                    )}
                  </div>
                </div>

                <div
                  className={`grid ${
                    loadingLyrics || selectedGroupLyrics.length > 0
                      ? "md:gap-6"
                      : "grid-cols-1 md:gap-12"
                  } p-2 py-0 gap-0 border c-border rounded-b-md`}
                >
                  {loadingLyrics && !initialLoadDone ? (
                    Array.from({ length: 12 }).map((_, index) => (
                      <LoadingBox key={index} />
                    ))
                  ) : selectedGroupLyrics.length === 0 ? (
                    <div className="w-full py-4 flex flex-col items-center c-bg justify-center gap-4 text-center c-gray-text opacity-30">
                      No Lyrics Found in this Collection
                    </div>
                  ) : (
                    selectedGroupLyrics.map((lyric, index) => {
                      const isLast = index === selectedGroupLyrics.length - 1;
                      return (
                        <div
                          key={lyric._id}
                          className="border-b c-border last:border-0 border-dashed"
                        >
                          <LyricsRowPremium
                            id={lyric._id}
                            lyric={lyric}
                            isLast={isLast}
                            lastUserRef={lastUserRef}
                            onCollectionStatusChange={
                              handleCollectionStatusChange
                            }
                            refresh={true}
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
                <div className="w-full flex flex-col items-center c-bg justify-center gap-4 text-center py-0 c-gray-text opacity-30">
                  No Lyrics Found in Collection yet
                </div>
              ) : (
                selectedGroupLyrics.map((lyric, index) => {
                  const isLast = index === selectedGroupLyrics.length - 1;
                  return (
                    <div
                      key={lyric._id}
                      className="border-b c-border last:border-0 border-dashed"
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

        {showEdit && (
          <ProfileEdit
            userData={user}
            usernameChange={setUsername}
            emailChange={setEmail}
            closeBox={() => setShowEdit(false)}
            onUpdate={() => {
              // Show Message of success
              setMessageText(t("profileUpdatedSuccessfully"));
              setMessageType("success");
              setShowMessage(true);
              setTimeout(() => setShowMessage(false), 5000);
            }}
          />
        )}

        <Footer />
      </div>

      <ConfirmPopup className="w-10/12 md:w-auto" />
    </>
  );
};

export default Profile;
