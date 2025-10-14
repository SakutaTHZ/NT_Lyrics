import { CgClose } from "react-icons/cg";
import PropTypes from "prop-types";

const ImageGallery = ({ lyric, setShowGallery, setImageError }) => {
  console.log(lyric);
  return (
    <div className="animate-appear fixed inset-0 bg-[#00000090] backdrop-blur-md flex flex-col items-center justify-center z-[10000] p-2">

      {/* Close Button */}
      <button
        className="absolute flex justify-center items-center top-2 right-2 text-white bg-[#ffffff20] rounded-full p-2 hover:bg-red-600 transition-all"
        onClick={() => setShowGallery(false)}
      >
        <CgClose size={24} />
      </button>

      {/* Image Preview */}
      <img
        src={lyric}
        alt="Lyrics"
        onError={() => setImageError(true)}
        onContextMenu={(e) => e.preventDefault()}
        draggable={false}
        loading="lazy"
        style={{ pointerEvents: "none", userSelect: "none" }}
        className="w-full max-w-3xl h-auto object-contain rounded-lg shadow-md"
      />

    </div>
  );
};

ImageGallery.propTypes = {
  lyric: PropTypes.shape({
    lyricsPhoto: PropTypes.string.isRequired,
  }).isRequired,
  setShowGallery: PropTypes.func.isRequired,
  setImageError: PropTypes.func.isRequired,
};

export default ImageGallery;
