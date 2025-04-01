import { useState, useEffect } from "react";

import PropTypes from "prop-types";
import PasswordInput from "./Password_Input";
import { BiCheck } from "react-icons/bi";
import { useAuth } from "../../components/hooks/authContext";

const ProfileEdit = ({ usernameChange, emailChange, closeBox }) => {
  const { logOut } = useAuth();
  const labelClass = "text-gray-700 font-semibold";
  const inputClass = "p-2 border border-gray-400 rounded-md";

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const [passwordChange, setPasswordChange] = useState(false);

  const [name, setUsername] = useState("");
  const [isUsernameCorrect, setIsUsernameCorrect] = useState(true);
  const checkUsername = (input) => {
    setUsername(input);
    if (input.length < 3) {
      setIsUsernameCorrect(false);
    } else {
      setIsUsernameCorrect(true);
    }
  };

  const [email, setEmail] = useState("");
  const [isEmailCorrect, setIsEmailCorrect] = useState(true);
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const checkEmail = (input) => {
    setEmail(input);
    setIsEmailCorrect(isValidEmail(input));
  };

  const [currentPassword, setCurrentPassword] = useState("");
  const [isCurrentPasswordCorrect, setIsCurrentPasswordCorrect] =
    useState(true);
  const checkCurrentPassword = (input) => {
    setCurrentPassword(input);
    input.length > 8
      ? setIsCurrentPasswordCorrect(false)
      : setIsCurrentPasswordCorrect(true);
  };

  const [newPassword, setNewPassword] = useState("");
  const [isNewPasswordCorrect, setIsNewPasswordCorrect] = useState(true);
  const checkNewPassword = (input) => {
    setNewPassword(input);
    input.length > 8
      ? setIsNewPasswordCorrect(false)
      : setIsNewPasswordCorrect(true);
  };

  const updateUser = async () => {
    if (!user || !user.id) {
      alert("User data is missing.");
      return;
    }

    if (name.trim() === "") {
      alert("Name cannot be empty");
      return;
    } else if (email.trim() === "") {
      alert("Email cannot be empty");
      return;
    }

    // Prepare the updated user data
    let updatedUser = {
      name,
      email,
    };

    // Include new password if applicable
    if (passwordChange && newPassword !== "") {
      updatedUser.oldPassword = currentPassword;
      updatedUser.newPassword = newPassword;
    } else if (passwordChange) {
      alert("New Password cannot be empty");
      return;
    }

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

      const result = await response.json();

      // Update local state and localStorage
      setUser(result);
      console.log(result);
      const userDetails = {
        id: result.user._id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      };
      usernameChange(result.user.name);
      emailChange(result.user.email);

      localStorage.setItem("user", JSON.stringify(userDetails));
    } catch (error) {
      console.error("Error updating user:", error);
      alert("An error occurred while updating the profile.");
    }
  };

  useEffect(() => {
    setUsername(user?.name || "");
    setEmail(user?.email || "");
  }, [user]);

  return (
    <div className="fixed flex justify-center items-center px-4 top-0 left-0 w-full h-full bg-[#00000080] z-50">
      <div className="animate-down-start w-full md:w-96 h-fit py-8 bg-white rounded-md">
        <div className="w-full h-1/2 flex items-center justify-center">
          <div className="profileImageBox w-24 aspect-square rounded-full overflow-hidden border-8 border-white">
            {/* Current Image */}
            <img
              src="https://i.pinimg.com/736x/c8/69/8a/c8698a586eb96d0ec43fbb712dcf668d.jpg"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        <div className="w-full h-1/2 px-8 flex flex-col items-center justify-center gap-4">
          <div className="w-full flex flex-col items-center gap-2">
            {/* name */}
            <div className="flex flex-col w-full">
              <label htmlFor="name" className={`${labelClass}`}>
                Nme{" "}
                {!isUsernameCorrect && (
                  <span className="text-red-500 font-bold">*</span>
                )}
              </label>
              <input
                type="text"
                id="name"
                className={inputClass}
                placeholder="Enter your name"
                value={name}
                onChange={(e) => checkUsername(e.target.value)}
              />
              {!isUsernameCorrect && (
                <p className={`text-sm text-red-400 mt-1`}>
                  Invalid User Name.
                </p>
              )}
            </div>
            {/* Email */}
            <div className="flex flex-col w-full">
              <label htmlFor="email" className={`${labelClass}`}>
                Email{" "}
                {!isEmailCorrect && (
                  <span className="text-red-500 font-bold">*</span>
                )}
              </label>
              <input
                type="text"
                id="email"
                className={inputClass}
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => checkEmail(e.target.value)}
              />
              {!isEmailCorrect && (
                <p className={`text-sm text-red-400 mt-1`}>Invalid Email.</p>
              )}
            </div>
            {/* Password */}

            <div className="w-full">
              <label
                htmlFor="email"
                className={`${labelClass} flex justify-between items-center`}
              >
                {passwordChange ? "Password" : "Change Password?"}
                {!isCurrentPasswordCorrect && (
                  <span className="text-red-500 font-bold">*</span>
                )}
                <input
                  type="checkbox"
                  id="password-toggle"
                  className="hidden peer"
                  onChange={() => setPasswordChange(!passwordChange)}
                />
                <label
                  htmlFor="password-toggle"
                  className="w-5 h-5 border border-gray-400 rounded-md flex items-center justify-center cursor-pointer peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all"
                >
                  <BiCheck className="text-white text-lg peer-checked:text-black " />
                </label>
              </label>
              {passwordChange && (
                <>
                  <PasswordInput
                    value={currentPassword}
                    onChange={checkCurrentPassword}
                  />
                  {!isCurrentPasswordCorrect && (
                    <p className={`text-sm text-red-400 mt-1`}>
                      Password must be less than 8 characters.
                    </p>
                  )}

                  <PasswordInput
                    value={newPassword}
                    onChange={checkNewPassword}
                  />

                  {!isNewPasswordCorrect && (
                    <p className={`text-sm text-red-400 mt-1`}>
                      Password must be less than 8 characters.
                    </p>
                  )}
                </>
              )}
            </div>
            {/* Action Buttons */}
            <div className="w-full flex items-center gap-2 mt-2">
              <button
                className="w-full bg-blue-500 px-4 text-white font-semibold p-2 rounded-md"
                onClick={() => {
                  updateUser();
                  closeBox();
                }}
              >
                Save
              </button>
              <button
                onClick={closeBox}
                className="w-full bg-gray-200 px-4 text-black font-semibold p-2 rounded-md"
              >
                Cancel
              </button>
            </div>
            <hr className="w-full border-dashed border-gray-300" />
            {/* Log Out */}
            <button
              className="w-full bg-red-500 px-4 text-white font-semibold p-2 rounded-md"
              onClick={logOut}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
ProfileEdit.propTypes = {
  usernameChange: PropTypes.func.isRequired,
  emailChange: PropTypes.func.isRequired,
  closeBox: PropTypes.func.isRequired,
};

export default ProfileEdit;
