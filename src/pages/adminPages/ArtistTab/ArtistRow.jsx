// components/UserRow.jsx
import { MdEdit } from "react-icons/md";
import PropTypes from "prop-types";

const ArtistRow = ({ artist, idx, isLast, lastUserRef, onEdit }) => {
  const ref = isLast ? lastUserRef : null;

  return (
    <tr
      key={artist._id || idx}
      ref={ref}
      className="hover:bg-gray-50 transition"
    >
      <td className="px-4 py-3">{idx + 1}</td>
      <td className="px-4 py-3" title={artist._id}>
        <p className="w-16 truncate">{artist._id}</p>
      </td>
      <td className="px-4 py-3">{artist.name}</td>
      <td className="px-4 py-3">{artist.bio}</td>
      <td className="px-4 py-3">{artist.photoLink}</td>
      <td className="px-4 py-3">{artist.searchCount}</td>
      <td className="px-4 py-3">{artist.type}</td>
      <td className="px-4 py-3">{artist.createdAt}</td>
      <td className="px-4 py-3">
        <button
          className="w-full flex items-center justify-center p-2 rounded-md text-blue-600 bg-blue-50 hover:underline text-sm cursor-pointer"
          onClick={() => onEdit(artist)}
        >
          <MdEdit size={16} />
        </button>
      </td>
    </tr>
  );
};

ArtistRow.propTypes = {
  artist: PropTypes.object.isRequired,
  idx: PropTypes.number.isRequired,
  isLast: PropTypes.bool,
  lastUserRef: PropTypes.any,
  onEdit: PropTypes.func.isRequired,
};

export default ArtistRow;
