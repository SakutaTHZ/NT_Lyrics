import { useState } from "react";

import PropTypes from "prop-types";
import PasswordInput from "./Password_Input";
import { BiCheck } from "react-icons/bi";
import { useAuth } from "../../components/hooks/authContext";

const ProfileEdit = ({ closeBox }) => {
  const { logOut } = useAuth();
  const labelClass = "text-gray-700 font-semibold";
  const inputClass = "p-2 border border-gray-400 rounded-md";

  const [user, setUser] = useState(localStorage.getItem("user"));

  const [passwordChange, setPasswordChange] = useState(false);

  const [name, setUsername] = useState(user.name);
  const [isUsernameCorrect, setIsUsernameCorrect] = useState(true);
  const checkUsername = (input) => {
    setUsername(input);
    if (input.length < 3) {
      setIsUsernameCorrect(false);
    } else {
      setIsUsernameCorrect(true);
    }
  };

  const [email, setEmail] = useState(user.email);
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

  const updateUser = () => {
    // If the password is being updated, check if the current password is correct
    if (passwordChange && currentPassword !== user.password) {
      alert("Current Password is incorrect");
      return;
    } else if (name === "") {
      alert("Name cannot be empty");
      return;
    } else if (email === "") {
      alert("Email cannot be empty");
      return;
    } else {
      // Prepare the updated user data
      let updatedUser = {
        name: name,
        email: email,
      };

      // Include the new password if the checkbox is checked and new password is provided
      if (passwordChange && newPassword !== "") {
        updatedUser.password = newPassword;
      } else if (passwordChange) {
        alert("New Password cannot be empty");
        return;
      }

      // Store the updated user data
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

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
  closeBox: PropTypes.func.isRequired,
};

export default ProfileEdit;
