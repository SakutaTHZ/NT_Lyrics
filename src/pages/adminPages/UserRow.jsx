// components/UserRow.jsx
import { MdEdit } from "react-icons/md";
import PropTypes from "prop-types";

const UserRow = ({ user, idx, isLast, lastUserRef, onEdit }) => {
  const ref = isLast ? lastUserRef : null;

  return (
    <tr
      key={user._id || idx}
      ref={ref}
      className="hover:bg-gray-50 transition"
    >
      <td className="px-4 py-3">{idx + 1}</td>
      <td className="px-4 py-3">{user._id}</td>
      <td className="px-4 py-3">{user.name}</td>
      <td className="px-4 py-3">{user.email}</td>
      <td className="px-4 py-3 capitalize">{user.role}</td>
      <td className="px-4 py-3">
        <span
          className={`px-2 py-1 text-xs rounded-full font-semibold ${
            user.isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {user.isActive ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="px-4 py-3">
        <button
          className="w-full flex items-center justify-center p-2 rounded-md text-blue-600 bg-blue-50 hover:underline text-sm cursor-pointer"
          onClick={() => onEdit(user)}
        >
          <MdEdit size={16} />
        </button>
      </td>
    </tr>
  );
};

UserRow.propTypes = {
  user: PropTypes.object.isRequired,
  idx: PropTypes.number.isRequired,
  isLast: PropTypes.bool,
  lastUserRef: PropTypes.any,
  onEdit: PropTypes.func.isRequired,
};

export default UserRow;
