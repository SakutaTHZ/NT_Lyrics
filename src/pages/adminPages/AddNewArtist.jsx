import PropTypes from "prop-types";
import { useEffect } from "react";

const AddNewArtist = ({ onClose, user }) => {
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
    <div className="fixed inset-0 z-[100] flex justify-center items-center">
      <div className="absolute inset-0 bg-[#00000050]" onClick={onClose} />
      <div className="bg-white p-6 rounded-lg shadow-lg relative z-[101] w-[400px]">
        <h2 className="text-xl font-bold">Edit User</h2>
        <p className="mt-2 text-sm text-gray-600">Editing user: {user.name}</p>
        {/* Include your form here, pre-filled with user data */}

        <button onClick={onClose} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

AddNewArtist.propTypes = {
  onClose: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};


export default AddNewArtist;