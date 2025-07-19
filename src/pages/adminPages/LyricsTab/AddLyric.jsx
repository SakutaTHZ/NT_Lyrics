import { useState, useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import PropTypes from "prop-types";
import InputField from "../../../components/common/InputField";
import DropdownField from "../../../components/common/DropdownField";
import MultiSelectField from "../../../components/common/MultiSelectField";
import ModalPortal from "../../../components/special/ModalPortal";
import imageCompression from "browser-image-compression";

import {
  genreOptions,
  keyOptions,
} from "../../../../src/assets/js/constantDatas";
import { apiUrl, fetchSingers } from "../../../assets/util/api";

const AddLyric = ({ onClose, onUpdate, showNewMessage }) => {
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [albumName, setAlbumName] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedMajorKey, setSelectedMajorKey] = useState(null);
  const [youtubeLink, setYoutubeLink] = useState("");

  const [singers, setSingers] = useState([]);
  const [writers, setWriters] = useState([]);
  const [features, setFeatures] = useState([]);

  const [selectedSingers, setSelectedSingers] = useState([]);
  const [selectedWriters, setSelectedWriters] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  const tiers = ["guest", "free", "premium"];
  const [tier, setSelectedTier] = useState(2); // Default to "premium"

  const [uploadedFile, setUploadedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    const getArtists = async () => {
      try {
        const [singerData, writerData] = await Promise.all([
          fetchSingers("both"),
          fetchSingers("both"),
        ]);
        setSingers(singerData);
        setWriters(writerData);

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
    if (!title.trim()) return "Title is required.";
    if (!selectedGenres.length) return "Select at least one genre.";
    if (!selectedMajorKey) return "Please choose a major key.";
    if (!selectedSingers.length) return "Select at least one singer.";
    if (!uploadedFile) return "You must upload a lyric file.";
    return null;
  };

  const appendArrayToFormData = (formData, key, items) => {
    items.forEach((item) => formData.append(key, item._id));
  };

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
    selectedGenres.forEach((genre) => formData.append("genre[]", genre.name));
    appendArrayToFormData(formData, "singers[]", selectedSingers);
    appendArrayToFormData(formData, "writers[]", selectedWriters);
    appendArrayToFormData(formData, "featureArtists[]", selectedFeatures);
    formData.append("youTubeLink", youtubeLink);
    formData.append("lyricsPhoto", uploadedFile);
    formData.append("tier", tier);

    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/lyrics/createLyrics`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const contentType = response.headers.get("content-type");
      const data = contentType?.includes("application/json")
        ? await response.json()
        : (async () => {
            const text = await response.text();
            throw new Error(`Unexpected non-JSON response:\n${text}`);
          })();

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
      setIsLoading(false);
    }
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[110] flex justify-center items-center">
        <div className="absolute inset-0 bg-[#00000050]" onClick={onClose} />
        <div className="bg-white p-6 rounded-lg shadow-lg relative z-[101] w-screen md:w-[1000px] max-h-screen md:h-auto overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Add New Lyric</h2>
          <form>
            <div className="flex flex-wrap md:flex-nowrap gap-4">
              <div className="flex flex-col w-full gap-4">
                <InputField
                  label="Title"
                  value={title}
                  onChange={setTitle}
                  placeholder="Enter lyric title"
                  required={true}
                />
                <InputField
                  label="Album Name"
                  value={albumName}
                  onChange={setAlbumName}
                  placeholder="Enter album name"
                />
                <div className="flex flex-col md:flex-row gap-4">
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

              <div className="flex flex-col w-full gap-4">
                <MultiSelectField
                  label="Singers"
                  value={selectedSingers}
                  options={singers}
                  onChange={setSelectedSingers}
                  required={true}
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

            <div className="mt-6">
              <InputField
                label="Youtube Link (in Embed code)"
                value={youtubeLink}
                onChange={setYoutubeLink}
                placeholder="Enter Youtube embed link"
              />
            </div>

            <div className="flex flex-col md:flex-row items-center mt-6 gap-4">
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Upload Lyric File<span className="pl-1 text-red-500">*</span>
                </label>
                <input
                  type="file"
                  // onChange={(e) => setUploadedFile(e.target.files[0])}
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const fileSizeMB = file.size / 1024 / 1024;
                    // console.log("Original file size:", fileSizeMB.toFixed(2), "MB");

                    // If already less than or equal to 3MB, skip compression
                    if (fileSizeMB <= 3) {
                      // console.log("File size under 3MB — skipping compression");
                      setUploadedFile(file);
                      return;
                    }

                    const options = {
                      maxSizeMB: 3,
                      maxWidthOrHeight: 1920, // Optional: Resize large images
                      useWebWorker: true,
                    };

                    try {
                      const compressedFile = await imageCompression(
                        file,
                        options
                      );
                      setUploadedFile(compressedFile);

                      // console.log(
                      //   "Original size:",
                      //   fileSizeMB.toFixed(2),
                      //   "MB"
                      // );
                      // console.log(
                      //   "Compressed size:",
                      //   (compressedFile.size / 1024 / 1024).toFixed(2),
                      //   "MB"
                      // );
                    } catch (error) {
                      console.error("Image compression failed:", error);
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <DropdownField
                required={true}
                label="Tier"
                value={tiers[tier]} // Show label
                options={tiers}
                onChange={(label) => {
                  const index = tiers.indexOf(label);
                  setSelectedTier(index);
                  console.log("Selected tier:", index);
                  console.log("Selected tier label:", label);
                }}
              />
            </div>

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
                      className="animate-spin text-2xl text-green-700"
                      size={16}
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
          </form>
        </div>
      </div>
    </ModalPortal>
  );
};

// 🧪 PropTypes
AddLyric.propTypes = {
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  showNewMessage: PropTypes.func.isRequired,
};

export default AddLyric;
