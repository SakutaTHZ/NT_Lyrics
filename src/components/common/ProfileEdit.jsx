import { useEffect, useState } from "react";

import PropTypes from "prop-types";

const ProfileEdit = ({ closeBox }) => {
  const labelClass = "text-gray-700 font-semibold";
  const inputClass = "p-2 border border-gray-400 rounded-md";
  // Get User data here
  const getUser = () => {
    let user = localStorage.getItem("user");
    if (user) {
      return JSON.parse(user);
    } else {
      // For sample data
      return {
        name: "John Doe",
        email: "johndoe@gmail.com",
        profileImage:
          "https://i.pinimg.com/736x/c8/69/8a/c8698a586eb96d0ec43fbb712dcf668d.jpg",
        password: "password",
      };
    }
  };
  const [user, setUser] = useState(getUser);

  const [username, setUsername] = useState(user.name);
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
    if (currentPassword !== user.password) {
      alert("Current Password is incorrect");
      return;
    } else if (newPassword === "") {
      alert("New Password cannot be empty");
      return;
    } else if (username === "") {
      alert("Name cannot be empty");
      return;
    } else if (email === "") {
      alert("Email cannot be empty");
      return;
    } else {
      let updatedUser = {
        name: username,
        email: email,
        password: newPassword,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  useEffect(() => {
    getUser;
  }, []);

  return (
    <div className="fixed flex justify-center items-center px-4 top-0 left-0 w-full h-full bg-[#00000080] z-50">
      <div className="animate-down-start w-full h-fit py-4 bg-white rounded-md">
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
            {/* Username */}
            <div className="flex flex-col w-full">
              <label htmlFor="username" className={`${labelClass}`}>
                Nme{" "}
                {!isUsernameCorrect && (
                  <span className="text-red-500 font-bold">*</span>
                )}
              </label>
              <input
                type="text"
                id="username"
                className={inputClass}
                placeholder="Enter your Username"
                value={username}
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
              <label htmlFor="email" className={`${labelClass}`}>
                Password{" "}
                {!isCurrentPasswordCorrect && (
                  <span className="text-red-500 font-bold">*</span>
                )}
              </label>
              <input
                type="text"
                placeholder="Current Password"
                className="w-full border border-gray-300 p-2 rounded-md"
                onChange={(e) => checkCurrentPassword(e.target.value)}
              />
              {!isCurrentPasswordCorrect && (
                <p className={`text-sm text-red-400 mt-1`}>
                  Password must be less than 8 characters.
                </p>
              )}
              <input
                type="text"
                placeholder="New Password"
                className="w-full mt-2 border border-gray-300 p-2 rounded-md"
                onChange={(e) => checkNewPassword(e.target.value)}
              />

              {!isNewPasswordCorrect && (
                <p className={`text-sm text-red-400 mt-1`}>
                  Password must be less than 8 characters.
                </p>
              )}
            </div>
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
