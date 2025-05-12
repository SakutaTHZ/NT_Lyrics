// components/UserRow.jsx
import { MdEdit } from "react-icons/md";
import PropTypes from "prop-types";
import { disableLyricById, enableLyricById } from "../../../assets/util/api";

const LyricRow = ({ lyric, idx, isLast, lastUserRef, onEdit, isDisabled }) => {
  const ref = isLast ? lastUserRef : null;

  return (
    <tr
      key={lyric._id || idx}
      ref={ref}
      className="hover:bg-gray-50 transition"
    >
      <td className="px-4 py-3">{idx + 1}</td>
      <td className="px-4 py-3" title={lyric._id}>
        <p className="w-16 truncate">{lyric._id}</p>
      </td>
      <td className="px-4 py-3">
        <img
          src={lyric.lyricsPhoto}
          alt="Lyric"
          className="w-16 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
          }}
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col gap-2">
          <p className="text-base font-semibold">{lyric.title}</p>
          <p className="">{lyric.albumName}</p>
          <div className="flex flex-wrap gap-2 items-center">
            {lyric.genre.map((genre_name, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded-full font-semibold bg-gray-50 text-gray-600 border border-gray-200"
              >
                {genre_name}
              </span>
            ))}
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        {lyric.singers.map((singer, index) => (
          <span key={index}>
            {singer.name}
            {index < lyric.singers.length - 1 ? ", " : ""}
          </span>
        ))}
      </td>
      <td className="px-4 py-3">
        {lyric.featureArtists.map((featureArtist, index) => (
          <span key={index}>
            {featureArtist.name}
            {index < lyric.singers.length - 1 ? ", " : ""}
          </span>
        ))}
      </td>
      <td className="px-4 py-3">
        {lyric.writers.map((writer, index) => (
          <span key={index}>
            {writer.name}
            {index < lyric.singers.length - 1 ? ", " : ""}
          </span>
        ))}
      </td>
      <td className="px-4 py-3 font-semibold">{lyric.majorKey}</td>
      <td className="px-4 py-3">{lyric.viewCount}</td>
      {/* <td className="px-4 py-3">
        {lyric.isEnable ? (
          <span className="border px-2 py-1 rounded-md bg-green-50 border-green-500 text-green-500">
            Enabled
          </span>
        ) : (
          <span className="border px-2 py-1 rounded-md bg-red-50 border-red-500 text-red-500">
            Disabled
          </span>
        )}
      </td> */}
      <td className="px-4 py-3">
        <button
          onClick={() => {
            const confirmMsg = lyric.isEnable
              ? "Are you sure you want to disable this lyric?"
              : "Are you sure you want to enable this lyric?";

            const confirmed = window.confirm(confirmMsg);
            if (!confirmed) return;

            const token = localStorage.getItem("token");

            const apiCall = lyric.isEnable
              ? disableLyricById(lyric._id, token)
              : enableLyricById(lyric._id, token);

            apiCall
              .then((res) => {
                console.log("Lyric status updated:", res);
                isDisabled(); // ✅ Call this *after* success
              })
              .catch((err) => {
                console.error("Failed to update lyric status:", err);
              });
          }}
          className={`border px-2 py-1 rounded-md font-semibold text-sm ${
            lyric.isEnable
              ? "bg-green-50 border-green-500 text-green-500"
              : "bg-red-50 border-red-500 text-red-500"
          } hover:underline cursor-pointer`}
        >
          {lyric.isEnable ? "Enabled" : "Disabled"}
        </button>
      </td>
      <td className="px-4 py-3">
        <button
          className="w-full flex items-center justify-center p-2 rounded-md text-blue-600 bg-blue-50 hover:underline text-sm cursor-pointer"
          onClick={() => onEdit(lyric)}
        >
          <MdEdit size={16} />
        </button>
      </td>
    </tr>
  );
};

LyricRow.propTypes = {
  lyric: PropTypes.object.isRequired,
  idx: PropTypes.number.isRequired,
  isLast: PropTypes.bool,
  lastUserRef: PropTypes.any,
  onEdit: PropTypes.func.isRequired,
  isDisabled: PropTypes.func.isRequired,
};

export default LyricRow;
