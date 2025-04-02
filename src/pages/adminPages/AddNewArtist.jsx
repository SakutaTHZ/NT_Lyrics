import PropTypes from "prop-types";
import { useEffect } from "react";

const AddNewArtist = ({ onClose }) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden"; // Also stop HTML from scrolling
    document.documentElement.style.height = "100vh"; // Force full height
  
    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
      document.documentElement.style.height = "auto";
    };
  }, []);

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-center">
      {/* Dark Background */}
      <div
        className="absolute inset-0 bg-[#00000050] bg-opacity-50"
        onClick={handleBackgroundClick}
      />
      
      {/* Modal Box */}
      <div className="bg-white p-6 rounded-lg shadow-lg relative z-[101]">
        <h2 className="text-xl font-bold">Add New Artist</h2>
        <p className="mt-2">This is an overlay box.</p>
        <button onClick={onClose} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

AddNewArtist.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default AddNewArtist;