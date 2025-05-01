import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { RadioButton } from "primereact/radiobutton";
import { ConfirmPopup } from "primereact/confirmpopup";
import { confirmPopup } from "primereact/confirmpopup";

const EditArtist = ({ onClose, artist, onUpdate, showNewMessage }) => {
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

  const [name, setName] = useState(artist.name || "");
  const [bio, setBio] = useState(artist.bio || "");
  const [photoLink, setPhotoLink] = useState(artist.photoLink || "");
  const [type, setType] = useState(artist.type || "both");

  const token = localStorage.getItem("token");

  const updateArtist = async () => {
    const response = await fetch(
      `http://localhost:3000/api/artists/updateArtist/${artist._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name,
          bio: bio,
          photoLink: photoLink,
          type: type,
        }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      showNewMessage("error", errorData.message);
      throw new Error(errorData.message || "Failed to update artist");
    } else {
      showNewMessage("success", "Artist updated successfully");
    }
    const data = await response.json();
    return data;
  };

  const deleteArtist = async () => {
    if (!artist?._id) {
        console.error("Missing artist ID");
        return;
      }
      
      if (!token) {
        console.error("Missing auth token");
        return;
      }
    const response = await fetch(
      `http://localhost:3000/api/artists/deleteArtist/${artist._id}`,
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
      showNewMessage("error", errorData.errors[0].message);
      throw new Error(errorData.message || "Failed to delete artist");
    } else {
      showNewMessage("success", "Artist deleted successfully");
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-[100] flex justify-center items-center">
        <div className="absolute inset-0 bg-[#00000050]" onClick={onClose} />
        <div className="bg-white p-6 rounded-lg shadow-lg relative z-[101] w-[600px]">
          <h2 className="text-xl font-bold flex items-center justify-between">
            Edit Artist
            <p className="flex items-center px-2 py-1 border border-gray-300 rounded-full">
              <span className="text-xs font-normal text-gray-700">
                {artist._id}
              </span>
            </p>
          </h2>

          <div className="flex flex-col mt-2">
            <div className="row">
              <label className="block my-2 text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={name}
                className="w-full p-2 py-2 border border-gray-300 rounded-md"
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter artist name"
              />
            </div>

            <div className="row">
              <label className="block my-2 text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                rows={5}
                type="text"
                value={bio}
                className="w-full resize-none p-2 py-2 border border-gray-300 rounded-md"
                onChange={(e) => setBio(e.target.value)}
                placeholder="Enter artist bio"
              />
            </div>

            <div className="row">
              <label className="block my-2 text-sm font-medium text-gray-700">
                Photo Link
              </label>
              <div className="flex items-center gap-2 py-1">
                <img
                  src={photoLink}
                  alt="Artist Photo"
                  className="w-12 h-12 object-cover rounded-full mb-2"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
                  }}
                />
                <input
                  type="text"
                  value={photoLink}
                  className="w-full p-2 py-2 border border-gray-300 rounded-md"
                  onChange={(e) => setPhotoLink(e.target.value)}
                  placeholder="Enter artist photo link"
                />
              </div>
            </div>

            <div className="row">
              <label className="block my-2 text-sm font-medium text-gray-700">
                Role
              </label>
              <div className="flex flex-wrap gap-2 py-1">
                {["singer", "writer", "both"].map((option) => (
                  <div key={option} className="flex items-center gap-2">
                    <RadioButton
                      inputId={option}
                      name="role"
                      value={option}
                      onChange={(e) => setType(e.value)}
                      checked={type === option}
                    />
                    <label htmlFor={option} className="text-sm capitalize">
                      {option.replace("-", " ")}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={async () => {
                await updateArtist();
                onUpdate();
                onClose();
              }}
              className="w-full cursor-pointer mt-4 bg-green-200 text-green-700 font-semibold px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="w-full cursor-pointer mt-4 bg-gray-200 text-gray-500 font-semibold px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={(e) => {
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
              }}
              className="w-full cursor-pointer mt-4 bg-red-200 text-red-700 font-semibold px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <ConfirmPopup />
    </>
  );
};

EditArtist.propTypes = {
  onClose: PropTypes.func.isRequired,
  artist: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  showNewMessage: PropTypes.func.isRequired,
};

export default EditArtist;
