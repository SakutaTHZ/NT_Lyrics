// components/UserRow.jsx
import { MdEdit } from "react-icons/md";
import PropTypes from "prop-types";
import axios from "axios";
import {useEffect, useRef,useState,useCallback} from "react";
import { apiUrl } from "../../../assets/util/api";

const ArtistType = ({ type }) => {
  switch (type) {
    case "both":
      return (
        <span
          className={`px-2 py-1 text-xs rounded-full font-semibold bg-yellow-100 text-yellow-600`}
        >
          Both
        </span>
      );
    case "writer":
      return (
        <span
          className={`px-2 py-1 text-xs rounded-full font-semibold bg-green-100 text-green-600`}
        >
          Writer
        </span>
      );
    case "artist":
      return (
        <span
          className={`px-2 py-1 text-xs rounded-full font-semibold bg-blue-100 text-blue-600`}
        >
          Artist
        </span>
      );
    case "singer":
      return (
        <span
          className={`px-2 py-1 text-xs rounded-full font-semibold bg-blue-100 text-blue-600`}
        >
          Singer
        </span>
      );
    default:
      <span
        className={`px-2 py-1 text-xs rounded-full font-semibold bg-gray-100 text-gray-600`}
      >
        Unknown
      </span>;
  }
};

ArtistType.propTypes = {
  type: PropTypes.string,
};

const ArtistRow = ({ artist, idx, isLast, lastUserRef, onEdit }) => {
  const ref = isLast ? lastUserRef : null;
  const AUTH_TOKEN = useRef(localStorage.getItem("token"));

  const [lyricsCount, setLyricsCount] = useState(0);

  const getLyricsCountByArtist = useCallback(async () => {
    try {
      const res = await axios.get(
        `${apiUrl}/lyrics/getLyricsCountByArtist?artistId=${artist._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AUTH_TOKEN.current}`,
          },
        }
      );
      setLyricsCount(res.data.lyricsCount);
    } catch (err) {
      console.error("Error fetching user overview:", err);
    }
  }, [artist._id]);

  useEffect(() => {
      getLyricsCountByArtist();
  }, [getLyricsCountByArtist]);

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
      <td className="px-4 py-3">
        <img
          src={artist.photoLink}
          alt="Artist Photo"
          className="w-12 h-12 object-cover rounded-full"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
          }}
        />
      </td>
      <td className="px-4 py-3">{artist.name}</td>
      <td className="px-4 py-3">
        <p className="max-w-52 truncate">{artist.bio}</p>
      </td>
      <td className="px-4 py-3">
        <ArtistType type={artist.type} />
      </td>
      <td className="px-4 py-3">
        <span
          className={`px-2 py-1 text-xs rounded-full font-semibold bg-gray-5  bg-gray-50 text-gray-600`}
        >
          {lyricsCount}
        </span>
      </td>
      <td className="px-4 py-3">
        <span
          className={`px-2 py-1 text-xs rounded-full font-semibold bg-gray-5  bg-gray-50 text-gray-600`}
        >
          {artist.searchCount}
        </span>
      </td>
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
