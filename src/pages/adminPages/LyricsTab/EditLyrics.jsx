import { useState, useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import PropTypes from "prop-types";
import InputField from "../../../components/common/InputField";
import DropdownField from "../../../components/common/DropdownField";
import MultiSelectField from "../../../components/common/MultiSelectField";
import ModalPortal from "../../../components/special/ModalPortal";
import useModalEscClose from "../../../components/hooks/useModalEscClose";
import { ConfirmPopup } from "primereact/confirmpopup";
import { confirmPopup } from "primereact/confirmpopup";

import {
  genreOptions,
  keyOptions,
} from "../../../../src/assets/js/constantDatas";
import { apiUrl, fetchSingers } from "../../../assets/util/api";

const EditLyric = ({ lyric, onClose, onUpdate, showNewMessage }) => {
  console.log("EditLyric component rendered with lyric:", lyric);
  useModalEscClose(onClose);

  const token = localStorage.getItem("token");

  const [title, setTitle] = useState(lyric.title || "");
  const [albumName, setAlbumName] = useState(lyric.albumName || "");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedMajorKey, setSelectedMajorKey] = useState(null);
  const [youtubeLink, setYoutubeLink] = useState(lyric.youTubeLink);
  const [singers, setSingers] = useState([]);
  const [writers, setWriters] = useState([]);
  const [features, setFeatures] = useState([]);
  const [selectedSingers, setSelectedSingers] = useState([]);
  const [selectedWriters, setSelectedWriters] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  const tiers = ["guest", "free", "premium"];
  const [tier, setSelectedTier] = useState(lyric.tier); // Default to "premium"

  const [previewUrl, setPreviewUrl] = useState(lyric.lyricsPhoto);
  const [uploadedFile, setUploadedFile] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (Array.isArray(lyric.genre)) {
      const mapped = genreOptions.filter((opt) =>
        lyric.genre.includes(opt.name)
      );
      setSelectedGenres(mapped);
    }

    if (lyric.majorKey) {
      const match = keyOptions.find((opt) => opt.name === lyric.majorKey);
      setSelectedMajorKey(match || null);
    }
  }, [lyric]);

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

  useEffect(() => {
    if (Array.isArray(lyric.singers) && singers.length > 0) {
      setSelectedSingers(
        singers.filter((s) => lyric.singers.some((sel) => sel._id === s._id))
      );
    }
  }, [lyric.singers, singers]);

  useEffect(() => {
    if (Array.isArray(lyric.writers) && writers.length > 0) {
      setSelectedWriters(
        writers.filter((w) => lyric.writers.some((sel) => sel._id === w._id))
      );
    }
  }, [lyric.writers, writers]);

  useEffect(() => {
    if (Array.isArray(lyric.featureArtists) && features.length > 0) {
      setSelectedFeatures(
        features.filter((f) =>
          lyric.featureArtists.some((sel) => sel._id === f._id)
        )
      );
    }
  }, [lyric.featureArtists, features]);

  const deleteLyric = async () => {
    if (!lyric?._id) {
      console.error("Missing lyric ID");
      return;
    }

    if (!token) {
      console.error("Missing auth token");
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(
        `${apiUrl}/lyrics/deleteLyrics/${lyric._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        showNewMessage(
          "error",
          errorData.errors?.[0]?.message || "Delete failed"
        );
        throw new Error(errorData.message || "Failed to delete lyric");
      }

      showNewMessage("success", "Lyric deleted successfully");
      onClose();
      onUpdate();
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDelete = (e) => {
    confirmPopup({
      target: e.currentTarget,
      message: "Are you sure you want to delete this lyric?",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      acceptLabel: "Yes",
      rejectLabel: "No",
      accept: async () => {
        await deleteLyric();
        onUpdate();
        onClose();
      },
    });
  };

  const validateForm = () => {
    if (!title.trim()) return "Title is required.";
    if (!selectedGenres.length) return "Select at least one genre.";
    if (!selectedMajorKey) return "Please choose a major key.";
    if (!selectedSingers.length) return "Select at least one singer.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMessage = validateForm();
    if (errorMessage) return showNewMessage("error", errorMessage);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("albumName", albumName);
    formData.append("majorKey", selectedMajorKey?.name || selectedMajorKey);
    selectedGenres.forEach((genre) => formData.append("genre[]", genre.name));
    selectedSingers.forEach((s) => formData.append("singers[]", s._id));
    selectedWriters.forEach((w) => formData.append("writers[]", w._id));
    selectedFeatures.forEach((f) => formData.append("featureArtists[]", f._id));
    formData.append("youTubeLink", youtubeLink);
    formData.append("tier", tier);

    if (uploadedFile) {
      formData.append("lyricsPhoto", uploadedFile);
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${apiUrl}/lyrics/updateLyrics/${lyric._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const contentType = res.headers.get("content-type");
      const data = contentType?.includes("application/json")
        ? await res.json()
        : null;

      if (!res.ok || !data)
        throw new Error(data?.message || "Unexpected error.");

      showNewMessage("success", `${title} updated successfully.`);
      onUpdate();
      onClose();
    } catch (err) {
      console.error("Submit error:", err);
      showNewMessage("error", err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalPortal>
      <div className="fixed bottom-0 left-0 w-screen h-screen z-[110] flex justify-center items-center">
        <div className="absolute inset-0 bg-[#00000050]" onClick={onClose} />
        <div className="bg-white p-6 rounded-lg shadow-lg relative z-[101] w-[1000px]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Edit Lyric</h2>
            <p className="text-sm border px-2 py-1 rounded-full border-gray-300">
              {lyric._id}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
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

            <div className="mt-6 flex gap-4 items-center w-full relative">
              <img
                className="w-12 hover:w-72 transition-all absolute bottom-0 shadow-md"
                src={previewUrl}
                alt=""
              />
              <div className="w-full ml-16">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Upload Lyric File<span className="pl-1 text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    setUploadedFile(file); // for uploading
                    setPreviewUrl(URL.createObjectURL(file)); // for previewing
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
          </form>

          <div className="flex justify-end gap-2 mt-4">
            <button
              className={`w-full font-semibold px-4 py-2 rounded cursor-pointer hover:bg-red-300 hover:text-red-900 ${
                isDeleting
                  ? "bg-red-100 text-red-500 cursor-not-allowed"
                  : "bg-red-200 text-red-700"
              }`}
              onClick={handleDelete}
            >
              {isDeleting ? (
                <div className="flex justify-center items-center gap-2">
                  <AiOutlineLoading3Quarters
                    size={16}
                    className="animate-spin text-2xl text-red-800"
                  />
                  Deleting...
                </div>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </div>

      <ConfirmPopup />
    </ModalPortal>
  );
};

EditLyric.propTypes = {
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  showNewMessage: PropTypes.func.isRequired,
  lyric: PropTypes.object.isRequired,
};

export default EditLyric;
