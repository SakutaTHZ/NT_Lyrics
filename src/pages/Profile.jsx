import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
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

// Constants
const LYRICS_PER_PAGE = 20;

const Profile = () => {
  const { t } = useTranslation();
  // Destructure and rename user properties for stability
  const { user, token, isLoading: isAuthLoading} = useAuth();
  
  // --- UI and State Management ---
  const [loadingLyrics, setLoadingLyrics] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState("success");

  // Payment state
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [payment, setPayment] = useState(null);
  const [visible, setVisible] = useState(false); // Dialog visibility

  // Collection State
  const [collection, setCollection] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedGroupLyrics, setSelectedGroupLyrics] = useState([]);

  // --- Pagination & Intersection Observer ---
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const observer = useRef(null);
  const totalPagesRef = useRef(1); // To stabilize observer

  useEffect(() => {
    totalPagesRef.current = totalPages;
  }, [totalPages]);

  // Use local state only for display/edit fields, synced from user object
  const [username, setUsername] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  
  // Memoize user-related data for cleaner access
  const { isPremium, defaultGroupCount, userTier } = useMemo(() => {
    const role = user?.role || "free-user";
    const premium = role === "premium-user";
    const defaultCol = collection?.collections?.find(
      (c) => c.group === "Default"
    );
    const tierMap = { guest: 0, "free-user": 1, "premium-user": 2 };

    return {
        userRole: role,
        isPremium: premium,
        defaultGroupCount: defaultCol?.count ?? 0,
        userTier: tierMap[role] || 0,
        tierMap: tierMap,
    };
  }, [user, collection]);
  
  // Utility for access control (moved out of render logic)
  const shouldHideCollection = useCallback((lyricTier = 0) => userTier >= lyricTier, [userTier]);

  /**
   * Effect 1: Sync local display state with auth context user and check for token/ID
   */
  useEffect(() => {
    if (user) {
        setUsername(user.name);
        setEmail(user.email);
    } else {
        // Validation logic for missing ID/token
        const storedUser = localStorage.getItem("user");
        const id = JSON.parse(storedUser || "{}")?.id;
        if (!id || !token) {
            setMessageText(t("ID and token are missing! Please Log in again"));
            setMessageType("error");
            setShowMessage(true);
            const timer = setTimeout(() => setShowMessage(false), 5000);
            return () => clearTimeout(timer); // Cleanup
        }
    }
  }, [user, token, t]);
  
  /**
   * Effect 2: Payment Check
   */
  useEffect(() => {
    if (!user) return;
    const checkPayment = async () => {
      try {
        const paymentData = await checkIfPaymentRequested(token);
        setIsPaymentProcessing(paymentData?.isExist || false);
        setPayment(paymentData?.payment || null);
      } catch (err) {
        console.error("Failed to fetch payment:", err);
      }
    };
    checkPayment();
  }, [user, token]);

  /** ===================
   * COLLECTION FETCH
   * =================== */
  const getCollection = useCallback(async () => {
    if (!token) return;

    try {
      const collections = await fetchCollectionOverview(token);
      let userCollections = collections.collections || [];

      // Map collections to ensure they are objects and add default if missing
      userCollections = userCollections.map((col) =>
        typeof col === "string" ? { group: col, count: 0 } : col // Default count added
      );

      if (!userCollections.some((c) => c.group === "Default")) {
        userCollections = [{ group: "Default", count: 0 }, ...userCollections];
      }

      // Sort with "Default" first
      const sortedCollections = [...userCollections].sort((a, b) => {
        if (a.group === "Default") return -1;
        if (b.group === "Default") return 1;
        return a.group.localeCompare(b.group);
      });

      setCollection({ ...collections, collections: sortedCollections });
      return sortedCollections; // Return sorted collections for immediate use
    } catch (err) {
      console.error("Error fetching user overview:", err);
      return [];
    }
  }, [token]);

  /** ===================
   * LYRICS FETCH
   * =================== */
  const getLyricsByGroup = useCallback(
    async (group, pageNum, isNewGroup = false) => {
      // Prevent subsequent fetches if we are on the last page
      if (pageNum > 1 && pageNum > totalPagesRef.current) return;
      setLoadingLyrics(true);

      const groupName = isPremium ? group : "Default"; // Free users only see 'Default'

      try {
        const res = await axios.get(
          `${apiUrl}/collections/getLyricsByGroup?group=${groupName}`,
          {
            params: { page: pageNum, limit: LYRICS_PER_PAGE },
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );

        const data = res.data.lyrics;
        if (!Array.isArray(data)) {
          console.error("Expected array, got:", data);
          return;
        }

        setSelectedGroupLyrics((prev) => {
          // Replace for a new group/page 1, or append for pagination
          const merged = isNewGroup ? data : [...prev, ...data];
          return Array.from(new Map(merged.map((i) => [i._id, i])).values());
        });

        setTotalPages(res.data.totalPages);
        if (isNewGroup) setPage(1);
        
      } catch (error) {
        console.error("Failed to fetch lyrics:", error);
      } finally {
        setLoadingLyrics(false);
        if (pageNum === 1) setInitialLoadDone(true);
      }
    },
    [isPremium, token]
  );
  
  /**
   * Effect 3: Initial Collection and Lyrics Load (Run after user and collection are ready)
   */
  useEffect(() => {
    if (!user) return;

    const initializeData = async () => {
      // 1. Fetch collections first
      const sortedCollections = await getCollection(); 
      
      if (!sortedCollections.length) return;

      // 2. Determine initial group
      const defaultCol = sortedCollections.find((c) => c.group === "Default");
      const firstGroup = defaultCol
        ? defaultCol.group
        : sortedCollections[0].group;
      
      // 3. Set the first group and fetch lyrics for it (Page 1, New Group)
      setSelectedGroup(firstGroup);
      getLyricsByGroup(firstGroup, 1, true);
    };

    if (!collection) {
        initializeData();
    } else if (selectedGroup) {
        // This handles subsequent page loads correctly if collection is already fetched
        getLyricsByGroup(selectedGroup, page);
    }

  }, [user, collection, getCollection, getLyricsByGroup, page, selectedGroup]);


  /** ===================
   * INFINITE SCROLL HANDLER
   * =================== */
  const lastUserRef = useCallback(
    (node) => {
      // Use ref for total pages check
      if (loadingLyrics || page >= totalPagesRef.current) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loadingLyrics, page] // Dependencies: loading state and current page
  );

  /** ===================
   * GROUP HANDLERS
   * =================== */
  const handleGroupChange = (group) => {
    if (!group || group === selectedGroup) return;
    // Reset page to 1 and fetch new group lyrics
    setPage(1); 
    setSelectedGroup(group);
    getLyricsByGroup(group, 1, true); 
  };
  
  // This function is now simplified and more focused
  const handleCollectionStatusChange = useCallback(
    (lyricId, isFavourite) => {
      // Optimistically update the UI by removing the lyric if it's no longer a favorite
      // or updating its favorite status.
      setSelectedGroupLyrics((prev) => 
        prev
          .map((l) => (l._id === lyricId ? { ...l, isFavourite } : l))
          .filter(l => l.isFavourite) // Optionally filter out removed items instantly
      );
      
      // Since collection count has changed, re-fetch overview and current lyrics list 
      // to synchronize with the backend counts and list state.
      getCollection().then(() => {
          if (selectedGroup) {
              // Re-fetch the current group from page 1 to refresh the list and count
              setPage(1);
              getLyricsByGroup(selectedGroup, 1, true);
          }
      });
    },
    [selectedGroup, getLyricsByGroup, getCollection]
  );
  
  const deleteGroup = async () => {
    if (!selectedGroup || selectedGroup === "Default") {
      setMessageText(t("defaultCollectionCannotBeDeleted"));
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

      setMessageText(
        `'${selectedGroup}' ${t("collectiondeletedSuccessfully")}`
      );
      setMessageType("success");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 5000);

      // 1. Re-fetch collection to get updated list
      const updatedCollections = await getCollection();

      // 2. Select a new default group
      const remainingCollections = updatedCollections
          .map((col) => col.group)
          .filter((g) => g !== selectedGroup);
      const newGroup = remainingCollections[0] || "Default"; // Fallback to Default

      // 3. Update state and trigger lyrics fetch for the new group
      setSelectedGroup(newGroup);
      setPage(1);
      getLyricsByGroup(newGroup, 1, true);

    } catch (err) {
      console.error(err);
      setMessageText(t("failedToDeleteCollection"));
      setMessageType("error");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 5000);
    }
  };

  const handleDelete = (e) => {
    confirmPopup({
      target: e.currentTarget,
      message: t("areYouSureYouWantToDeleteThisCollection"),
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      acceptLabel: "Yes",
      rejectLabel: "No",
      accept: deleteGroup,
    });
  };
  
  /**
   * Helper function for payment dialog text based on plan
   */
  const getPaymentTotal = (duration) => {
    switch (duration) {
      case 6: return "10,000 Ks";
      case 12: return "18,000 Ks";
      default: return "???";
    }
  };

  /** ===================
   * RENDER
   * =================== */
  const showLyricsList = !loadingLyrics || initialLoadDone;
  const showSkeletons = loadingLyrics && !initialLoadDone;

  if (isAuthLoading) {
    // Keep auth loading state check
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <p className="text-xl font-semibold">Loading profile...</p>
      </div>
    );
  }

  // We only render the profile content if a user exists after loading
  if (!user && !isAuthLoading) {
    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center gap-4">
            <p className="text-xl font-semibold text-red-500">Error: Not logged in.</p>
            <Link to="/" className="text-blue-500 underline">Go to Home</Link>
        </div>
    );
  }

  const LyricComponent = isPremium ? LyricsRowPremium : LyricsRow;

  return (
    <>
      {showMessage && (
        <MessagePopup
          message_type={messageType}
          closePopup={() => setShowMessage(false)}
        >
          <div className="message_text text-pretty text-left flex flex-col gap-3">
            <p>{messageText}</p> 
            {/* Removed the map for split/span since the text is simple string */}
          </div>
        </MessagePopup>
      )}
      <div className="w-screen h-screen overflow-hidden overflow-y-auto">
        <div className="relative flex flex-col gap-2 min-h-screen md:pt-12 pb-16">
          
          {/* --- Profile Header --- */}
          <div className="w-full flex flex-col items-center justify-center customBackground rounded-b-4xl py-8 pb-4">
            <div className="flex items-center flex-col gap-4 w-full px-8 md:px-24 z-[50]">
              <div className="relative profileImageBox flex items-center justify-center">
                <img
                  src={
                    user?.profilePicture ||
                    "https://i.pinimg.com/736x/81/ec/02/81ec02c841e7aa13d0f099b5df02b25c.jpg"
                  }
                  alt="Profile"
                  className="object-cover w-24 md:w-32 aspect-square rounded-full border-2 border-white"
                />
                <span
                  className={`text-xs font-normal absolute px-2 py-0.5 -bottom-2.5 rounded-full ${
                    isPremium ? "c-premium-bg text-gray-600" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {isPremium ? "premium" : "free"}
                </span>
              </div>

              <div className="relative profileInfo shadow-md text-center text-white">
                <p className="font-bold text-2xl">{username}</p>
                <p>{email}</p>
              </div>

              {/* Stats Bar */}
              <div className="relative w-full flex items-center justify-center md:gap-4 border p-2 rounded-full c-border c-bg">
                <div className="flex items-center gap-2">
                  <p>{t("lyrics")}</p>
                  <p className="pr-4">
                    <span
                      className={`${
                        !isPremium && defaultGroupCount >= 20 ? "text-red-500" : ""
                      } font-semibold mr-1`}
                    >
                      {defaultGroupCount}
                    </span>
                    {!isPremium && (
                      <>
                        <span className="font-normal mr-1">/</span>
                        <span className="font-normal">20</span>
                      </>
                    )}
                  </p>
                </div>
                {isPremium && (
                  <div className="flex items-center gap-2 px-4 border-l border-gray-300">
                    <p>{t("collections")}</p>
                    <span
                      className={`font-semibold ${
                        collection?.collections?.length >= 20 ? "text-red-500" : ""
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
                  className="relative w-full bg-blue-50 p-2 py-1 rounded-2xl text-center text-blue-700 border border-blue-200 text-sm cursor-pointer"
                  onClick={() => setVisible(true)}
                >
                  {t("upgradePremium.yourPaymentIsBeingProcessedPleaseWait")}
                </div>
              )}
              
              {/* Payment Dialog */}
              <Dialog
                header="Payment Status"
                visible={visible}
                className="w-[90vw] md:w-[40vw] rounded-xl shadow-lg paymentStatusDialog"
                onHide={() => setVisible(false)} // Simplified onHide
              >
                <div>
                  {payment ? (
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                        <span className="font-medium text-gray-600">Requested At:</span>
                        <span className="text-gray-900">
                          {new Date(payment.requestedAt).toISOString().slice(0, 10)}
                        </span>
                        <span className="font-medium text-gray-600">Phone:</span>
                        <span className="text-gray-900">{payment.phone}</span>
                        <span className="font-medium text-gray-600">Payment Type:</span>
                        <span className="capitalize text-gray-900">
                          {payment.paymentType}
                        </span>
                        <span className="font-medium text-gray-600">Payment Plan:</span>
                        <span className="text-gray-900">
                          {payment.durationInMonths} {t("months")}
                        </span>
                        <span className="font-medium text-gray-600">Total:</span>
                        <span className="text-gray-900 font-semibold">
                          {getPaymentTotal(payment.durationInMonths)}
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

              {/* Premium CTA */}
              {!isPaymentProcessing && !isPremium && defaultGroupCount >= 20 && (
                <div className="relative w-full">
                  <button className="bg-amber-200 text-black px-5 py-1 rounded-full w-full">
                    More features in Premium{" "}
                    <Link
                      to="/NT_Lyrics/premium"
                      className="text-blue-700 animate-pulse"
                    >
                      {t("learnMore")}
                    </Link>
                  </button>
                </div>
              )}

              {/* Settings Button */}
              <button
                className="ml-4 bg-gray-100 rounded-md cursor-pointer p-2 absolute right-4 top-4 z-50"
                onClick={() => setShowEdit(true)}
              >
                <IoSettingsOutline size={20} className="text-gray-500" />
              </button>
            </div>
          </div>
          
          {/* --- Collections and Lyrics --- */}
          <div className="flex flex-col py-2 px-4 md:px-24">
            
            {/* Group Selection (Premium Only) */}
            {isPremium && collection?.collections?.length > 0 && (
              <div className="flex flex-col items-center justify-between sticky top-0 z-20">
                <div className="w-full flex items-center justify-between gap-2 c-bg">
                  <div className="w-full c-bg sticky top-0 overflow-x-auto flex gap-2 py-3">
                    {(collection?.collections || []).map((col) => (
                      <span
                        key={col.group}
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
                
                {/* Collection Stats and Delete Button */}
                <div className="w-full border border-b-0 px-2 py-2 rounded-t-md c-bg c-border font-semibold flex items-center justify-between">
                    <p>
                        <span className={`flex-shrink-0 border p-.5 rounded-md px-2 c-border c-bg font-semibold`}>
                            <span className={`${
                                isPremium && selectedGroup !== "Default" &&
                                (collection?.collections?.find((item) => item.group === selectedGroup)?.count >= 20)
                                ? "text-red-500" : ""
                            }`}>
                                {collection?.collections?.find((item) => item.group === selectedGroup)?.count || 0}
                            </span>
                            {selectedGroup === "Default" && isPremium ? " / ∞ " : " / 20"}
                        </span>
                    </p>
                    
                    {selectedGroup !== "Default" && isPremium && (
                        <button
                            className="c-error-box rounded-md cursor-pointer px-3 py-1"
                            onClick={handleDelete}
                        >
                            <CgTrash size={18} className="text-red-500" />
                        </button>
                    )}
                </div>
              </div>
            )}

            {/* Lyrics List */}
            <div className={`grid ${showLyricsList ? "" : "grid-cols-1"} 
                            ${isPremium ? "p-2 py-0 border c-border rounded-b-md" : "p-2 py-0 gap-0"}`}>
                
                {showSkeletons ? (
                    Array.from({ length: 12 }).map((_, index) => (
                        <LoadingBox key={index} />
                    ))
                ) : selectedGroupLyrics.length === 0 ? (
                    <div className="w-full py-4 flex flex-col items-center c-bg justify-center gap-4 text-center c-gray-text opacity-30">
                        {isPremium && selectedGroup ? `No Lyrics Found in '${selectedGroup}'` : "No Lyrics Found in Collection yet"}
                    </div>
                ) : (
                    selectedGroupLyrics.map((lyric, index) => {
                        // Trigger infinite scroll slightly before the end
                        const isLast = index === selectedGroupLyrics.length - 2; 
                        
                        return (
                            <div
                                key={lyric._id}
                                className="border-b c-border last:border-0 border-dashed"
                                ref={isLast ? lastUserRef : null} // Apply ref here
                            >
                                <LyricComponent
                                    id={lyric._id}
                                    lyric={lyric}
                                    // isLast prop is redundant if the ref is on the wrapper
                                    lastUserRef={null} 
                                    onCollectionStatusChange={handleCollectionStatusChange}
                                    // Only pass access check to LyricsRow (Free user view)
                                    {...(!isPremium && { access: shouldHideCollection(lyric.tier) })}
                                />
                            </div>
                        );
                    })
                )}
                
                {/* Loading spinner for subsequent pages */}
                {loadingLyrics && page > 1 && (
                    <div className="w-full py-4 flex justify-center">
                        <LoadingBox isSpinner={true} />
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
            onUpdate={() => {
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