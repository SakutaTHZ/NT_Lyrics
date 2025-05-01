import PropTypes from "prop-types";
import { useEffect } from "react";

const AddNewArtist = ({ onClose, artist, onUpdate}) => {
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

  return (
    <>
      <div className="fixed inset-0 z-[100] flex justify-center items-center">
        <div className="absolute inset-0 bg-[#00000050]" onClick={onClose} />
        <div className="bg-white p-6 rounded-lg shadow-lg relative z-[101] w-[400px]">
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
                User ID
              </label>
              <input
                type="text"
                value={artist._id}
                readOnly
                className="w-full p-2 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={async () => {
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
      </div>
    </>
  );
};

AddNewArtist.propTypes = {
  onClose: PropTypes.func.isRequired,
  artist: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  showNewMessage: PropTypes.func.isRequired,
};

export default AddNewArtist;
