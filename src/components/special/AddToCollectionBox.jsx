import { Dialog } from "primereact/dialog";
import PropTypes from "prop-types";
import { useState, useCallback, useEffect } from "react";
import {
  addLyricToGroups,
  fetchCollectionOverview,
  removeLyricFromGroups,
  lookForGroups,
} from "../../assets/util/api";
import { Checkbox } from "primereact/checkbox";
import { CgAdd } from "react-icons/cg";

const AddToCollectionBox = ({ id, addToCollection, close }) => {
  const token = localStorage.getItem("token");
  const [collection, setCollection] = useState([]);
  const [newCollectionName, setNewCollectionName] = useState("");

  const [currentCollections, setCurrentCollections] = useState([]);

  const getCurrentCollections = useCallback(async () => {
    try {
      const groups = await lookForGroups(id, token);
      setCurrentCollections(groups || []);
    } catch (err) {
      console.error("Error fetching current collections:", err);
    }
  }, [id, token]);
  useEffect(() => {
    if (addToCollection) {
      getCurrentCollections();
    }
  }, [addToCollection, getCurrentCollections]);

  // Fetch user's collections from API
  const getCollection = useCallback(async () => {
    try {
      const collections = await fetchCollectionOverview(token);
      setCollection(collections.collections || []);
    } catch (err) {
      console.error("Error fetching user overview:", err);
    }
  }, [token]);

  const [selectedCollections, setSelectedCollections] = useState([]);

  useEffect(() => {
    if (addToCollection) {
      getCollection();
    }
  }, [addToCollection, getCollection]);

  const [hasInitializedSelection, setHasInitializedSelection] = useState(false);

  useEffect(() => {
    if (
      !hasInitializedSelection &&
      collection.length > 0 &&
      currentCollections.length > 0
    ) {
      const currentSet = collection
        .map((col) => col.group)
        .filter((group) => currentCollections.includes(group));
      setSelectedCollections(currentSet);
      setHasInitializedSelection(true);
    }
  }, [collection, currentCollections, hasInitializedSelection]);

  const handleCheckboxChange = (group) => {
    setSelectedCollections((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  const handleAddNewCollection = () => {
    if (!newCollectionName.trim()) return;

    const newGroup = newCollectionName.trim();

    // Prevent duplicates
    if (collection.some((col) => col.group === newGroup)) return;

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

  const handleCollectionsEdit = async () => {
  const currentSet = new Set(currentCollections);
  const selectedSet = new Set(selectedCollections);

  const toAdd = selectedCollections.filter((group) => !currentSet.has(group));
  const toRemove = currentCollections.filter(
    (group) => !selectedSet.has(group)
  );

  try {
    const token = localStorage.getItem("token");
    const lyricId = id;

    if (toAdd.length > 0) {
      await addLyricToGroups(lyricId, toAdd, token);
    }

    if (toRemove.length > 0) {
      await removeLyricFromGroups(lyricId, toRemove, token);
    }

    handleMessageTimer("Lyric collections updated successfully", "success");

    // Delay a bit to let the user see the message, then reload
    setTimeout(() => {
      window.location.reload();
    }, 1000); // 1 second delay to show success message

  } catch (err) {
    console.error("Error updating lyric collections:", err);
    handleMessageTimer("Failed to update collections", "error");
  }
};

  return (
    <Dialog
      header="Add to Collection"
      visible={addToCollection}
      style={{ width: "90vw", maxWidth: "400px" }}
      onHide={close}
      position="bottom"
      onClick={(e) => e.stopPropagation()}
      pt={{
        header: {
          className: "customHeader h-fit border-none flex items-center",
        },
        content: { className: "customContent p-4" },
      }}
    >
      <div className="flex flex-col gap-3">
        {showMessage && (
          <small
            className={`flex justify-between  items-center p-2 rounded-md ${
              messageType === "success"
                ? "bg-green-200 text-green-600"
                : "bg-red-200 text-red-600"
            }`}
          >
            {message}
          </small>
        )}
        <div className="flex items-center justify-between gap-2">
          <input
            type="text"
            placeholder="Enter New Collection"
            className="border border-gray-300 p-2 rounded w-full"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
          />
          <button onClick={handleAddNewCollection}>
            <CgAdd size={24} />
          </button>
        </div>

        <div className="flex flex-col gap-3 max-h-60 overflow-y-auto">
          {collection.map((col, i) => (
            <div key={i} className="flex items-center justify-between">
              {col.group}
              <Checkbox
                onChange={() => handleCheckboxChange(col.group)}
                checked={selectedCollections.includes(col.group)}
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => handleCollectionsEdit()}
          className="mt-2 p-2 bg-blue-500 text-white rounded"
        >
          Save Selections
        </button>
      </div>
    </Dialog>
  );
};

AddToCollectionBox.propTypes = {
  id: PropTypes.string.isRequired,
  addToCollection: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  currentCollections: PropTypes.arrayOf(PropTypes.string), // new prop
};

export default AddToCollectionBox;
