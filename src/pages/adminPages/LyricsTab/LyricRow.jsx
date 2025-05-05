// components/UserRow.jsx
import { MdEdit } from "react-icons/md";
import PropTypes from "prop-types";

const LyricRow = ({ lyric, idx, isLast, lastUserRef, onEdit }) => {
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
        {lyric.singers.map((name, index) => (
          <span key={index}>
            {name}
            {index < lyric.singers.length - 1 ? ", " : ""}
          </span>
        ))}
      </td>
      <td className="px-4 py-3">Features</td>
      <td className="px-4 py-3">Writers</td>
      <td className="px-4 py-3">Key</td>
      <td className="px-4 py-3">View Count</td>
      <td className="px-4 py-3">isEnabled</td>
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
};

export default LyricRow;
