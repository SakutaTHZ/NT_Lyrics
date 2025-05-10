import { useState, useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import PropTypes from "prop-types";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import ModalPortal from "../../../components/special/ModalPortal";

import {
  genreOptions,
  keyOptions,
} from "../../../../src/assets/js/constantDatas";
import { fetchSingers } from "../../../assets/util/api";

const AddLyric = ({ onClose, onUpdate, showNewMessage }) => {
  const token = localStorage.getItem("token");

  // Form States
  const [title, setTitle] = useState("");
  const [albumName, setAlbumName] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedMajorKey, setSelectedMajorKey] = useState(null);

  const [singers, setSingers] = useState([]);
  const [writers, setWriters] = useState([]);
  const [features, setFeatures] = useState([]);

  const [selectedSingers, setSelectedSingers] = useState([]);
  const [selectedWriters, setSelectedWriters] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  const [uploadedFile, setUploadedFile] = useState(null);

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.height = "100vh";
    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
      document.documentElement.style.height = "auto";
    };
  }, []);

  // Fetch artists
  useEffect(() => {
    const getArtists = async () => {
      try {
        const [singerData, writerData] = await Promise.all([
          fetchSingers("singer"),
          fetchSingers("writer"),
        ]);
        setSingers(singerData);
        setWriters(writerData);

        // Merge and dedupe for Features
        const deduped = Array.from(
          new Map(
            [...singerData, ...writerData].map((artist) => [artist._id, artist])
          ).values()
        );
        setFeatures(deduped);
      } catch (err) {
        console.error("Error fetching artists:", err);
      }
    };

    getArtists();
  }, []);

  const validateForm = () => {
    if (!title?.trim()) return "Title is required.";
    if (!albumName?.trim()) return "Album name is required.";
    if (!selectedGenres.length) return "Select at least one genre.";
    if (!selectedMajorKey) return "Please choose a major key.";
    if (!selectedSingers.length) return "Select at least one singer.";
    if (!uploadedFile) {
      console.log("No file uploaded:", uploadedFile); // Log the file for debugging
      return "You must upload a lyric file.";
    }
    return null; // No errors
  };
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorMessage = validateForm();
    if (errorMessage) {
      showNewMessage("error", errorMessage);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("albumName", albumName);
    formData.append("majorKey", selectedMajorKey?.name || selectedMajorKey);
    formData.append("genre[]", selectedGenres.map((s) => s.name));
    // formData.append(
    //   "singers[]",
    //   selectedSingers.map((s) => s._id)
    // );
    selectedSingers.map((singer) => {
      formData.append("singers[]", singer._id);
    })
    // formData.append(
    //   "writers[]",
    //   selectedWriters.map((w) => w._id)
    // );
    selectedWriters.map((writer) => {
      formData.append("writers[]", writer._id);
    })
    // formData.append(
    //   "featureArtists[]",
    //   selectedFeatures.map((f) => f._id)
    // );
    selectedFeatures.map((feature) => {
      formData.append("featureArtists[]", feature._id);
    })
    if (uploadedFile) {
      formData.append("lyricsPhoto", uploadedFile);
    } else {
      showNewMessage("error", "You must upload a lyric file.");
      return;
    }

    setIsLoading(true);

    console.log("Form data before submission:", {
      title,
      albumName,
      majorKey: selectedMajorKey?.name || selectedMajorKey,
      genre: selectedGenres,
      singers: selectedSingers.map((s) => s._id),
      writers: selectedWriters.map((w) => w._id),
      featureArtists: selectedFeatures.map((f) => f._id),
    });

    console.log("FormData contents:");
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/lyrics/createLyrics",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Unexpected non-JSON response:\n${text}`);
      }

      console.log("Response data:", data); // Log the response data for debugging

      if (!response.ok) {
        showNewMessage("error", data.message || "Failed to add lyric.");
        return;
      }

      showNewMessage("success", `${title} added successfully.`);
      onUpdate();
      onClose();
    } catch (err) {
      console.error("Failed to save lyric:", err.message || err);
      showNewMessage("error", err.message || "Something went wrong.");
    } finally {
      setIsLoading(false); // ✅ End loading
    }
  };

  return (
    <ModalPortal>
    <div className="fixed inset-0 z-[100] flex justify-center items-center">
      <div className="absolute inset-0 bg-[#00000050]" onClick={onClose} />
      <div className="bg-white p-6 rounded-lg shadow-lg relative z-[101] w-[1000px]">
        <h2 className="text-xl font-bold mb-4">Add New Lyric</h2>
        <form>
          {" "}
          {/* Wrap the form */}
          <div className="flex flex-wrap md:flex-nowrap gap-4">
            {/* Left Column */}
            <div className="flex flex-col w-full gap-4">
              <InputField
                label="Title"
                value={title}
                onChange={setTitle}
                placeholder="Enter lyric title"
              />
              <InputField
                label="Album Name"
                value={albumName}
                onChange={setAlbumName}
                placeholder="Enter album name"
              />

              <div className="flex gap-4">
                <MultiSelectField
                  label="Genres"
                  value={selectedGenres}
                  options={genreOptions}
                  onChange={setSelectedGenres}
                />
                <DropdownField
                  label="Key"
                  value={selectedMajorKey}
                  options={keyOptions}
                  onChange={setSelectedMajorKey}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col w-full gap-4">
              <MultiSelectField
                label="Singers"
                value={selectedSingers}
                options={singers}
                onChange={setSelectedSingers}
              />
              <MultiSelectField
                label="Writers"
                value={selectedWriters}
                options={writers}
                onChange={setSelectedWriters}
              />
              <MultiSelectField
                label="Features"
                value={selectedFeatures}
                options={features}
                onChange={setSelectedFeatures}
              />
            </div>
          </div>
          {/* File Upload */}
          <div className="mt-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Upload Lyric File
            </label>
            <input
              type="file"
              onChange={(e) => setUploadedFile(e.target.files[0])}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          {/* Actions */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full font-semibold px-4 py-2 rounded ${
                isLoading
                  ? "bg-green-100 text-green-500 cursor-not-allowed"
                  : "bg-green-200 text-green-700"
              }`}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <div className="flex justify-center items-center gap-2">
                  <AiOutlineLoading3Quarters
                    size={16}
                    className="animate-spin text-2xl text-green-700"
                  />
                  Saving...
                </div>
              ) : (
                "Save"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-gray-200 text-gray-500 font-semibold px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>{" "}
        {/* Close the form tag */}
      </div>
    </div>
    </ModalPortal>
  );
};

// 🔍 Modular Components
const InputField = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="block mb-1 text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full p-2 border border-gray-300 rounded-md"
    />
  </div>
);

export const MultiSelectField = ({ label, value, options, onChange }) => (
  <div className="w-full">
    {label && (
      <label className="block mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>
    )}
    <MultiSelect
      value={value}
      options={options}
      onChange={(e) => onChange(e.value)}
      optionLabel="name"
      placeholder={`Select ${label}`}
      className="w-full"
      maxSelectedLabels={3}
      filter
      filterPlaceholder={`Choose one...`}
    />
  </div>
);

export const DropdownField = ({ label, value, options, onChange }) => (
  <div className="w-full">
    {label && (
      <label className="block mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>
    )}
    <Dropdown
      value={value}
      options={options}
      onChange={(e) => onChange(e.value)}
      optionLabel="name"
      placeholder={`Choose one ...`}
      className="w-full"
      showClear
    />
  </div>
);

AddLyric.propTypes = {
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  showNewMessage: PropTypes.func.isRequired,
};

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

MultiSelectField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.array.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

DropdownField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default AddLyric;
