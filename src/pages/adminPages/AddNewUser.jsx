import PropTypes from "prop-types";
import { useEffect } from "react";
import { RadioButton } from "primereact/radiobutton";
import { useState } from "react";

const AddNewUser = ({ onClose, user }) => {
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

  const [role, setRole] = useState(user.role || "free-user");

  const updateUser = async () => {
    const updatedUser = {
      ...user,
      role: role,
    };

    console.log("Updated User:", updatedUser); // Debugging line

    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Modify as needed
          },
          body: JSON.stringify(updatedUser),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("An error occurred while updating the profile.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-center">
      <div className="absolute inset-0 bg-[#00000050]" onClick={onClose} />
      <div className="bg-white p-6 rounded-lg shadow-lg relative z-[101] w-[400px]">
        <h2 className="text-xl font-bold">Edit User</h2>

        <div className="flex flex-col mt-2">
          <div className="row">
            <label className="block my-2 text-sm font-medium text-gray-700">
              User ID
            </label>
            <input
              type="text"
              value={user._id}
              readOnly
              className="w-full p-2 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="row">
            <label className="block my-2 text-sm font-medium text-gray-700">
              User Name
            </label>
            <input
              type="text"
              value={user.name}
              readOnly
              className="w-full p-2 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="row">
            <label className="block my-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              value={user.email}
              readOnly
              className="w-full p-2 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="row">
            <label className="block my-2 text-sm font-medium text-gray-700">
              Role
            </label>
            <div className="flex flex-wrap gap-2 py-1">
              {["admin", "free-user", "premium-user"].map((option) => (
                <div key={option} className="flex items-center gap-2">
                  <RadioButton
                    inputId={option}
                    name="role"
                    value={option}
                    onChange={(e) => setRole(e.value)}
                    checked={role === option}
                  />
                  <label htmlFor={option} className="text-sm capitalize">
                    {option.replace("-", " ")}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

              <div className="flex justify-end gap-2 mt-4">
        <button
        onClick={() => {
                  updateUser();
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
    </div>
  );
};

AddNewUser.propTypes = {
  onClose: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default AddNewUser;
