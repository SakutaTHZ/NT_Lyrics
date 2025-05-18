import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { RadioButton } from "primereact/radiobutton";
import { ConfirmPopup } from "primereact/confirmpopup";
import { confirmPopup } from "primereact/confirmpopup";
import ModalPortal from "../../../components/special/ModalPortal";
import useModalEscClose from "../../../components/hooks/useModalEscClose";
import { apiUrl } from "../../../assets/util/api";

const fallbackImg =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

const EditArtist = ({ onClose, artist, onUpdate, showNewMessage }) => {
  useModalEscClose(onClose);

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

  const [name, setName] = useState(artist?.name || "");
  const [bio, setBio] = useState(artist?.bio || "");
  const [photoLink, setPhotoLink] = useState(artist?.photoLink || "");
  const [type, setType] = useState(artist?.type || "both");

  const token = localStorage.getItem("token");

  const showMessage = (type, msg) => showNewMessage(type, msg);

  const updateArtist = async () => {
    try {
      const res = await fetch(
        `${apiUrl}/artists/updateArtist/${artist._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, bio, photoLink, type }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        showMessage("error", data.message);
        throw new Error(data.message || "Failed to update artist");
      }

      showMessage("success", "Artist updated successfully");
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  const deleteArtist = async () => {
    try {
      const res = await fetch(
        `${apiUrl}/artists/deleteArtist/${artist._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        showMessage("error", data.errors?.[0]?.message || data.message);
        throw new Error(data.message || "Failed to delete artist");
      }

      showMessage("success", "Artist deleted successfully");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    await updateArtist();
    onUpdate();
    onClose();
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
        await deleteArtist();
        onUpdate();
        onClose();
      },
    });
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30" onClick={onClose} />
        <div className="bg-white p-6 rounded-lg shadow-lg relative z-[101] w-[600px] max-w-[90vw]">
          <h2 className="text-xl font-bold flex justify-between items-center">
            Edit Artist
            <span className="px-2 py-1 border border-gray-300 rounded-full text-xs text-gray-700">
              {artist._id}
            </span>
          </h2>

          <div className="flex flex-col gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter artist name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full resize-none p-2 border border-gray-300 rounded-md"
                placeholder="Enter artist bio"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Photo Link
              </label>
              <div className="flex items-center gap-3">
                <img
                  src={photoLink}
                  alt="Artist"
                  onError={(e) => {
                    e.currentTarget.src = fallbackImg;
                  }}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <input
                  type="text"
                  value={photoLink}
                  onChange={(e) => setPhotoLink(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter photo link"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <div className="flex gap-4 flex-wrap">
                {["singer", "writer", "both"].map((option) => (
                  <div key={option} className="flex items-center gap-2">
                    <RadioButton
                      inputId={option}
                      name="role"
                      value={option}
                      onChange={(e) => setType(e.value)}
                      checked={type === option}
                    />
                    <label htmlFor={option} className="capitalize text-sm">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleSave}
                className="w-full bg-green-200 text-green-700 font-semibold px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={onClose}
                className="w-full bg-gray-200 text-gray-600 font-semibold px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
            <div className="flex">
              <button
                onClick={handleDelete}
                className="w-full mt-2 bg-red-200 text-red-700 font-semibold px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      <ConfirmPopup />
    </ModalPortal>
  );
};

EditArtist.propTypes = {
  onClose: PropTypes.func.isRequired,
  artist: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  showNewMessage: PropTypes.func.isRequired,
};

export default EditArtist;
