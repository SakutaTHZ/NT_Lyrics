import { useState, useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import PropTypes from "prop-types";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import ModalPortal from "../../../components/special/ModalPortal";
import useModalEscClose from "../../../components/hooks/useModalEscClose";
import { ConfirmPopup } from "primereact/confirmpopup";
import { confirmPopup } from "primereact/confirmpopup";

import {
  genreOptions,
  keyOptions,
} from "../../../../src/assets/js/constantDatas";
import { fetchSingers } from "../../../assets/util/api";

const EditLyric = ({ lyric, onClose, onUpdate, showNewMessage }) => {
  useModalEscClose(onClose);

  const token = localStorage.getItem("token");

  const [title, setTitle] = useState(lyric.title || "");
  const [albumName, setAlbumName] = useState(lyric.albumName || "");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedMajorKey, setSelectedMajorKey] = useState(null);
  const [singers, setSingers] = useState([]);
  const [writers, setWriters] = useState([]);
  const [features, setFeatures] = useState([]);
  const [selectedSingers, setSelectedSingers] = useState([]);
  const [selectedWriters, setSelectedWriters] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  const [previewUrl, setPreviewUrl] = useState(lyric.lyricsPhoto);
  const [uploadedFile, setUploadedFile] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

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
          fetchSingers("singer"),
          fetchSingers("writer"),
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
  
    try {
  
      const response = await fetch(
        `http://localhost:3000/api/lyrics/deleteLyrics/${lyric._id}`,
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
        showNewMessage("error", errorData.errors?.[0]?.message || "Delete failed");
        throw new Error(errorData.message || "Failed to delete lyric");
      }
  
      showNewMessage("success", "Lyric deleted successfully");
      onClose();
      onUpdate();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleDelete = (e) => {
    confirmPopup({
      target: e.currentTarget,
      message: "Are you sure you want to delete this artist?",
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
    if (!albumName.trim()) return "Album name is required.";
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
    formData.append(
      "genre[]",
      selectedGenres.map((s) => s.name)
    );
    selectedSingers.forEach((s) => formData.append("singers[]", s._id));
    selectedWriters.forEach((w) => formData.append("writers[]", w._id));
    selectedFeatures.forEach((f) => formData.append("featureArtists[]", f._id));

    if (uploadedFile) {
      formData.append("lyricsPhoto", uploadedFile);
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        `http://localhost:3000/api/lyrics/updateLyrics/${lyric._id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

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
      <div className="fixed bottom-0 left-0 w-screen h-screen z-[100] flex justify-center items-center">
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

            <div className="mt-6 flex gap-4 items-center w-full relative">
              <img
                className="h-16 hover:h-128 transition-all absolute bottom-0 shadow-md"
                src={previewUrl}
                alt=""
              />
              <div className="w-full ml-16">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Upload Lyric File
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
              className={`w-full font-semibold px-4 py-2 rounded bg-red-200 text-red-700 cursor-pointer hover:bg-red-300 hover:text-red-900`}
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      
      <ConfirmPopup />
    </ModalPortal>
  );
};

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
    <label className="block mb-1 text-sm font-medium text-gray-700">
      {label}
    </label>
    <MultiSelect
      value={value}
      options={options}
      onChange={(e) => onChange(e.value)}
      optionLabel="name"
      placeholder={`Select ${label}`}
      className="w-full"
      maxSelectedLabels={3}
      filter
      filterPlaceholder="Choose one..."
    />
  </div>
);

export const DropdownField = ({ label, value, options, onChange }) => (
  <div className="w-full">
    <label className="block mb-1 text-sm font-medium text-gray-700">
      {label}
    </label>
    <Dropdown
      value={value}
      options={options}
      onChange={(e) => onChange(e.value)}
      optionLabel="name"
      placeholder="Choose one ..."
      className="w-full"
    />
  </div>
);

EditLyric.propTypes = {
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  showNewMessage: PropTypes.func.isRequired,
  lyric: PropTypes.object.isRequired,
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

export default EditLyric;
