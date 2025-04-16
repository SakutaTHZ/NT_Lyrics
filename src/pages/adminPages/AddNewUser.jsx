import PropTypes from "prop-types";
import { useEffect } from "react";
import { RadioButton } from "primereact/radiobutton";
import { InputSwitch } from "primereact/inputswitch";
import { useState } from "react";

const AddNewUser = ({ onClose, user, onUpdate, showNewMessage }) => {
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
  const [isValid, setIsValid] = useState(user.isValid || false);

  const changeUserRole = async (userId, role, token) => {
    const response = await fetch(
      `http://localhost:3000/api/users/changeUserRole`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userId,
          userRole: role,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update user role");
    }
  };

  const changeUserValidity = async (userId, isValid, token) => {
    const response = await fetch(`http://localhost:3000/api/users/${userId}?type=${isValid?"activate":"deactivate"}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update user validity");
    }
  };


  const updateUser = async () => {
    const updatedUser = {
      userId: user._id || user.id,
      userRole: role,
    };
    const token = localStorage.getItem("token");

    try {
      await changeUserValidity(updatedUser.userId, isValid, token);
      await changeUserRole(updatedUser.userId, role, token);

      showNewMessage("success","User updated successfully!");
    } catch (error) {
      showNewMessage("error", error.message);
    }
  };

  return (
    <>
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
              <div className="row">
                <label className="block my-2 text-sm font-medium text-gray-700">
                  IsValid?{" "}
                  <span className="text-xs text-gray-400">
                    (This is for banning users)
                  </span>
                </label>
                <InputSwitch
                  checked={isValid}
                  onChange={(e) => setIsValid(e.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={async () => {
                await updateUser();
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
      </div>
    </>
  );
};

AddNewUser.propTypes = {
  onClose: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  showNewMessage: PropTypes.func.isRequired,
};

export default AddNewUser;
