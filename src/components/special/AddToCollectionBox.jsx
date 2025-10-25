import PropTypes from "prop-types";
import { useState, useCallback, useEffect } from "react";
import {
  addLyricToGroups,
  fetchCollectionOverview,
  removeLyricFromGroups,
  lookForGroups,
} from "../../assets/util/api";
import { Checkbox } from "primereact/checkbox";
import { CgAdd, CgClose } from "react-icons/cg";

import { useTranslation } from "react-i18next";
import { useVibration } from "../hooks/useVibration";
import { AnimatePresence, motion } from "framer-motion";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const AddToCollectionBox = ({
  id,
  addToCollection,
  close,
  onCollectionsUpdated,
}) => {
  const { vibratePattern } = useVibration();
  const { t } = useTranslation();

  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    // after animation duration, call the parent onClose
    setTimeout(() => {
      close();
    }, 300); // match your transition duration
  };

  const token = localStorage.getItem("token");
  const [collection, setCollection] = useState([]);
  const [newCollectionName, setNewCollectionName] = useState("");

  const [currentCollections, setCurrentCollections] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // 👈 NEW LOADING STATE

  // 🚀 OPTIMIZATION: Combine both API calls and state setting into one function
  const fetchAllCollectionsData = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      // Fetch both user collections and current groups simultaneously
      const [collectionsResponse, currentGroups] = await Promise.all([
        fetchCollectionOverview(token),
        lookForGroups(id, token),
      ]);

      // --- Process User Collections ---
      let userCollections = collectionsResponse.collections || [];

      // Ensure everything is in { group: "name" } format
      userCollections = userCollections.map((col) =>
        typeof col === "string" ? { group: col } : col
      );

      // Ensure "Default" is always included
      if (!userCollections.some((c) => c.group.toLowerCase() === "default")) {
        userCollections = [{ group: "Default" }, ...userCollections];
      }

      // --- Process Current Collections (Groups the lyric is already in) ---
      const currentGroupsArray = currentGroups || [];

      // --- Set Initial Selected State ---
      const initialSelected = userCollections
        .map((col) => col.group)
        .filter((group) => currentGroupsArray.includes(group));

      // Update all necessary states in one go
      setCollection(userCollections);
      setCurrentCollections(currentGroupsArray);
      setSelectedCollections(initialSelected);

    } catch (err) {
      console.error("Error fetching collections data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [id, token]);

  // 🧹 CLEANUP: Use a single useEffect to initiate the combined fetch
  useEffect(() => {
    if (addToCollection) {
      fetchAllCollectionsData();
    }
  }, [addToCollection, fetchAllCollectionsData]);

  // 🗑️ DELETED: The two original separate useEffects and the third effect for
  //             setting selectedCollections are no longer needed.

  const handleCheckboxChange = (group) => {
    setSelectedCollections((prev) => {
      vibratePattern("tick"); // Small vibration feedback for interaction
      return prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group];
    });
  };

  const handleAddNewCollection = () => {
    if (!newCollectionName.trim()) return;

    // return if collections length is 20
    if (collection.length >= 20) {
      vibratePattern("long");
      handleMessageTimer(t("maxCollectionsReached"), "error");
      return;
    }

    const newGroup = newCollectionName.trim();

    // Prevent duplicates
    const trimmedGroup = newGroup.trim();
    if (!trimmedGroup) {
      handleMessageTimer(t("invalidGroupName"), "error");
      return;
    }

    if (
      collection.some(
        (col) => col.group.toLowerCase() === trimmedGroup.toLowerCase()
      )
    ) {
      vibratePattern("short");
      handleMessageTimer(t("collectionAlreadyExists"), "error");
      return;
    }

    const updated = [...collection, { group: newGroup }];
    setCollection(updated);
    setSelectedCollections((prev) => [...prev, newGroup]); // auto-check new
    setNewCollectionName("");
  };

  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const handleMessageTimer = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 5000);
  };

  const [saving, setSaving] = useState(false);

  const handleCollectionsEdit = async () => {
    const currentSet = new Set(currentCollections);
    const selectedSet = new Set(selectedCollections);

    const toAdd = selectedCollections.filter((group) => !currentSet.has(group));
    const toRemove = currentCollections.filter(
      (group) => !selectedSet.has(group)
    );

    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const lyricId = id;

      if (toAdd.length > 0) {
        await addLyricToGroups(lyricId, toAdd, token);
      }

      if (toRemove.length > 0) {
        await removeLyricFromGroups(lyricId, toRemove, token);
      }

      handleMessageTimer(t("lyricHasBeenAddedToCollection"), "success");

      onCollectionsUpdated?.(Array.from(selectedCollections));

      handleClose();
    } catch (err) {
      console.error("Error updating lyric collections:", err);
      console.log(err);
      if (String(err.message).startsWith("Collection Limit Reached")) { // Check err.message as a string
        handleMessageTimer(t("collectionLimitReached"), "error");
      } else {
        handleMessageTimer(err.message, "error");
      }
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (addToCollection && isVisible) {
      // lock scroll
      document.body.style.overflow = "hidden";
    } else {
      // restore scroll
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [addToCollection, isVisible]);

  const sortedCollections = [...collection].sort((a, b) => {
    if (a.group.toLowerCase() === "default") return -1;
    if (b.group.toLowerCase() === "default") return 1;
    return a.group.localeCompare(b.group); // optional: alphabetical sort
  });

  const segmenter = new Intl.Segmenter("my", { granularity: "grapheme" });

  const toGraphemes = (str) =>
    [...segmenter.segment(str)].map((seg) => seg.segment);

  const isSaveDisabled = saving || isLoading; // Disable save while loading or saving

  return (
    <>
      <AnimatePresence>
        {addToCollection && isVisible && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black z-[1999]"
              onClick={handleClose} // click outside closes
            />

            {/* Modal */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
              c-bg rounded-xl shadow-lg p-4 w-[90vw] max-w-md z-[2000]"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4 border-b border-dashed c-border pb-2">
                <h2 className="text-lg font-bold">{t("addToCollection")}</h2>
                <button
                  onClick={() => {
                    vibratePattern("short");
                    handleClose();
                  }}
                  disabled={saving}
                >
                  <CgClose size={24} />
                </button>
              </div>

              {/* Body */}
              <div className="flex flex-col gap-3">
                {showMessage && (
                  <small
                    className={`flex justify-between items-center p-2 rounded-md ${
                      messageType === "success"
                        ? "bg-green-200 text-green-600"
                        : "bg-red-200 text-red-600"
                    }`}
                  >
                    {message}
                  </small>
                )}

                {/* Create new collection */}
                <div className="flex flex-col items-start gap-2 c-bg-2 border c-border rounded-md p-2">
                  <p className="font-semibold">{t("createNewCollection")}</p>
                  <div className="flex items-center gap-2 w-full">
                    <input
                      type="text"
                      placeholder={t("name")}
                      className="border c-border p-2 rounded w-full c-bg"
                      value={newCollectionName}
                      onChange={(e) => {
                        const graphemes = toGraphemes(e.target.value);
                        if (graphemes.length > 20) {
                          handleMessageTimer(
                            "You’ve reached the 20-character limit.",
                            "warning"
                          );
                        }
                        setNewCollectionName(graphemes.slice(0, 20).join(""));
                      }}
                      disabled={isLoading} // Disable input while loading
                    />
                    <button
                      onClick={handleAddNewCollection}
                      className="p-2 bg-blue-500 text-white rounded"
                      disabled={isLoading} // Disable button while loading
                    >
                      <CgAdd size={24} />
                    </button>
                  </div>
                </div>

                {/* Collections list */}
                <div className="flex flex-col gap-3 max-h-60 overflow-y-auto p-2">
                  <p className="font-semibold pb-4 border-b border-dashed c-border">
                    {t("collections")}
                  </p>
                  {isLoading ? ( // 👈 RENDER LOADING MESSAGE
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                      <AiOutlineLoading3Quarters className="animate-spin" size={16} />
                      {t("loadingCollections") || "Loading Collections..."}
                    </p>
                  ) : (
                    !sortedCollections.length ? (
                      <p className="text-sm text-gray-400">
                        {t("noCollections") || "No collections found."}
                      </p>
                    ) : (
                      sortedCollections.map((col, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between"
                        >
                          {i + 1}. {col.group}
                          <Checkbox
                            checked={selectedCollections.includes(col.group)}
                            onChange={() => handleCheckboxChange(col.group)}
                            className="checkbox-fade"
                            disabled={isLoading} // 👈 DISABLE WHILE LOADING
                          />
                        </div>
                      ))
                    )
                  )}
                </div>

                {/* Save button */}
                <button
                  onClick={handleCollectionsEdit}
                  className="mt-2 p-2 bg-blue-500 text-white rounded flex items-center justify-center gap-2"
                  disabled={isSaveDisabled} // 👈 DISABLE WHILE LOADING OR SAVING
                >
                  {saving && (
                    <AiOutlineLoading3Quarters
                      className="animate-spin text-2xl"
                      size={16}
                    />
                  )}
                  {saving ? t("saving") : t("saveSelections")}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

AddToCollectionBox.propTypes = {
  id: PropTypes.string.isRequired,
  addToCollection: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  currentCollections: PropTypes.arrayOf(PropTypes.string),
  onCollectionsUpdated: PropTypes.func,
};

export default AddToCollectionBox;