import { Dialog } from "primereact/dialog";
import PropTypes from "prop-types";
import { useState, useCallback, useEffect } from "react";
import { fetchCollectionOverview } from "../../assets/util/api";
import { Checkbox } from "primereact/checkbox";

const AddToCollectionBox = ({ addToCollection, close }) => {
  const token = localStorage.getItem("token");
  const [collection, setCollection] = useState([]);
  const getCollection = useCallback(async () => {
    try {
      const collections = await fetchCollectionOverview(token);
      setCollection(collections.collections || []);
    } catch (err) {
      console.error("Error fetching user overview:", err);
    }
  }, [token]);

  const [selectedCollections, setSelectedCollections] = useState(
    () => collection.map((col) => col.group) // Initially all selected
  );

  const handleCheckboxChange = (group) => {
    setSelectedCollections(
      (prev) =>
        prev.includes(group)
          ? prev.filter((g) => g !== group) // remove if unchecked
          : [...prev, group] // add if checked
    );
  };

  useEffect(() => {
    if (addToCollection) {
      getCollection();
    }
  }, [addToCollection, getCollection]);

  return (
    <>
      <Dialog
        header="Add to Collection"
        visible={addToCollection}
        style={{ width: "90vw", maxWidth: "400px" }}
        onHide={() => {
          if (!addToCollection) return;
          close();
        }}
        position="bottom"
        onClick={(e) => {
          e.stopPropagation();
        }}
        pt={{
          header: {
            className: "customHeader h-fit border-none flex items-center", // Small padding, short height, no border
          },
          content: {
            className: "customContent p-4",
          },
        }}
      >
        <div className="flex flex-col gap-3 ">
          <input
            type="text"
            placeholder="Enter New Collection"
            className="border border-gray-300 p-2 rounded"
          />
          {collection.map((col, i) => (
            <div key={i} className="flex items-center justify-between">
              {col.group}
              <Checkbox
                onChange={() => handleCheckboxChange(col.group)}
                checked={selectedCollections.includes(col.group)}
              />
            </div>
          ))}

          {/* <button className="border border-gray-300 border-dashed p-2 rounded w-full">
            +Add New Collection
          </button> */}
          <button
            onClick={() => console.log("Selected:", selectedCollections)}
            className="mt-2 p-2 bg-blue-500 text-white rounded"
          >
            Save Selections
          </button>
        </div>
      </Dialog>
    </>
  );
};

AddToCollectionBox.propTypes = {
  addToCollection: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};

export default AddToCollectionBox;
