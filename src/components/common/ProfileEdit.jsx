import { useState, useEffect } from "react";

import PropTypes from "prop-types";
import PasswordInput from "./Password_Input";
import { BiCheck, BiInfoCircle } from "react-icons/bi";
import { useAuth } from "../../components/hooks/authContext";
import { apiUrl } from "../../assets/util/api"; // Adjust the import path as necessary
import { useVibration } from "./../hooks/useVibration";
import { RadioButton } from "primereact/radiobutton";

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const ProfileEdit = ({ userData, usernameChange, emailChange, closeBox, onUpdate }) => {

  const localStorageUser = JSON.parse(localStorage.getItem("user") || "{}");

  const { t, i18n } = useTranslation();
  const { vibratePattern } = useVibration();

  const { logOut } = useAuth();
  const labelClass = "text-gray-700 font-semibold pb-2";
  const inputClass = "p-2 border border-gray-400 rounded-md";

  const [user, setUser] = useState(userData || null);

  const [passwordChange, setPasswordChange] = useState(false);

  const [name, setUsername] = useState("");
  const [isUsernameCorrect, setIsUsernameCorrect] = useState(true);
  const checkUsername = (input) => {
    setUsername(input);
    if (input.length < 3 || input.length > 20) {
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
    if (!user || !user._id) {
      alert(t("userDataMissing"));
      return;
    }

    if (name.trim() === "") {
      alert(t("nameRequired"));
      return;
    } else if (email.trim() === "") {
      alert(t("emailRequired"));
      return;
    }

    let updatedUser = {
      name,
      email,
    };

    if (passwordChange && newPassword !== "") {
      updatedUser.oldPassword = currentPassword;
      updatedUser.newPassword = newPassword;
    } else if (passwordChange) {
      alert(t("passwordRequired"));
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) throw new Error("Update failed");

      const result = await response.json();
      setUser(result);
      usernameChange(result.user.name);
      emailChange(result.user.email);

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: result.user._id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
          isOAuth: localStorageUser.isOAuth,
        })
      );
      localStorage.setItem("language", language);
      localStorage.setItem("theme", theme);

      i18n.changeLanguage(language);
    } catch (error) {
      console.error("Error updating user:", error);
      alert(t("updateFailed"));
    }
  };

  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "my"
  );

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    setUsername(user?.name || "");
    setEmail(user?.email || "");
  }, [user]);

  return (
    <div className="absolute flex justify-center items-center top-0 left-0 w-screen h-screen bg-[#00000080] z-50">
      <div className="fixed inset-0 animate-down-start w-screen h-screen md:h-fit min-h-screen py-6 md:px-18 bg-gray-100 flex flex-col">
        <div className="w-full flex items-center justify-center md:mt-12 pb-2 mb-2">
          {/* <div className="profileImageBox w-24 aspect-square rounded-full overflow-hidden border-8 border-white">
            
            <img
              src="https://i.pinimg.com/736x/c8/69/8a/c8698a586eb96d0ec43fbb712dcf668d.jpg"
              className="object-cover w-full h-full"
            />
          </div> */}
          <p className="w-full px-6 font-bold text-lg italic">{t("setting")}</p>
        </div>
        <div className="w-full px-6 flex flex-col items-center justify-center gap-4">
          <div className="w-full flex flex-col items-center gap-2 border-t border-gray-300 pt-2 border-dashed">
            {/* Premium Info */}

            {user.role === "premium-user" ? (
              <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 w-full p-5 rounded-xl shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <p className="text-gray-700 font-medium">
                    {t("yourAccountIs")}
                  </p>
                  <span className="text-sm bg-yellow-100 text-yellow-800 py-1 px-2 rounded-md border border-yellow-300 font-semibold">
                    Premium
                  </span>
                  <Link to={"/NT_Lyrics/premium"} title="See Features" className="ml-auto text-blue-500 font-semibold underline">
                    <BiInfoCircle size={24}/>
                  </Link>
                </div>

                <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-md">
                  <p className="text-gray-700 font-medium">
                    {t("subscriptionEndson")}
                    <span className="text-sm text-blue-600 font-semibold pl-2 text-nowrap">
                      {user?.premiumEndDate
                        ? new Intl.DateTimeFormat("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }).format(new Date(user.premiumEndDate))
                        : "Unknown"}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white w-full p-4 rounded-md flex flex-col gap-2">
                <p>
                  {t("yourAccountIs")}
                  <span className="text-blue-500 font-semibold pl-2">Free</span>{" "}
                </p>
                <p className="text-gray-500">[{t("tryPremium")}]</p>
                <Link to={"/NT_Lyrics/premium"} className="bg-blue-100 px-2 py-2 rounded-md text-center">
                  {t("learnMore")}...
                </Link>
              </div>
            )}

            {/* Profile Datas */}
            <div className="w-full flex flex-col items-center pb-2 gap-2">
              <p className="w-full font-semibold text-md italic text-gray-500">
                {t("info")}
              </p>
              <div className="bg-white w-full p-4 rounded-md flex flex-col gap-4">
                {/* name */}
                <div className="flex flex-col w-full">
                  <label htmlFor="name" className={`${labelClass}`}>
                    {t("name")}{" "}
                    {!isUsernameCorrect && (
                      <span className="text-red-500 font-bold">*</span>
                    )}
                  </label>
                  <input
                    type="text"
                    id="name"
                    className={inputClass}
                    placeholder={t("enterName")}
                    value={name}
                    onChange={(e) => checkUsername(e.target.value)}
                  />
                  {!isUsernameCorrect && (
                    <p className={`text-sm text-red-400 mt-1`}>
                      {t("invalidName")}
                    </p>
                  )}
                </div>
                {/* Email */}
                <div className="flex flex-col w-full">
                  <label htmlFor="email" className={`${labelClass}`}>
                    {t("email")}{" "}
                    {!isEmailCorrect && (
                      <span className="text-red-500 font-bold">*</span>
                    )}
                  </label>
                  <input
                    type="text"
                    id="email"
                    className={
                      `${localStorageUser.isOAuth && "bg-gray-100"} ` + inputClass
                    }
                    placeholder={t("enterEmail")}
                    value={email}
                    onChange={(e) => checkEmail(e.target.value)}
                    disabled={localStorageUser.isOAuth}
                  />
                  {!isEmailCorrect && (
                    <p className={`text-sm text-red-400 mt-1`}>
                      {t("invalidEmail")}
                    </p>
                  )}
                </div>
                {/* Password */}
                <div className={`w-full ${localStorageUser.isOAuth && "hidden"} `}>
                  <label
                    htmlFor="Change Password"
                    className={`${labelClass} flex justify-between items-center`}
                  >
                    <p>
                      {passwordChange ? t("password") : t("changePassword")}{" "}
                      {!isCurrentPasswordCorrect && (
                        <span className="text-red-500 font-bold">*</span>
                      )}
                    </p>
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
                        placeholder={t("enterPassword")}
                      />
                      {!isCurrentPasswordCorrect && (
                        <p className={`text-sm text-red-400 my-1 mb-2`}>
                          {t("passwordMustBeAtLeast8Chars")}
                        </p>
                      )}

                      <PasswordInput
                        value={newPassword}
                        onChange={checkNewPassword}
                        placeholder={t("enterPasswordAgain")}
                      />

                      {!isNewPasswordCorrect && (
                        <p className={`text-sm text-red-400 mt-1`}>
                          {t("passwordMustBeAtLeast8Chars")}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* App Data */}
            <div className="w-full flex flex-col items-center pb-2 gap-2 border-t border-dashed border-gray-300 pt-2">
              <p className="w-full font-semibold text-md italic text-gray-500">
                {t("app")}
              </p>
              <div className="bg-white w-full p-4 rounded-md flex flex-col gap-4">
                {/* Language */}
                <div className="flex flex-col w-full py-1">
                  <label htmlFor="language" className={`${labelClass}`}>
                    {t("language")}
                  </label>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <div className="flex align-items-center">
                      <RadioButton
                        inputId="language"
                        name="language"
                        value="my"
                        onChange={(e) => setLanguage(e.value)}
                        checked={language === "my"}
                      />
                      <label htmlFor="language" className="ml-2">
                        {t("myanmar")}
                      </label>
                    </div>
                    <div className="flex align-items-center">
                      <RadioButton
                        inputId="language"
                        name="language"
                        value="en"
                        onChange={(e) => setLanguage(e.value)}
                        checked={language === "en"}
                      />
                      <label htmlFor="language" className="ml-2">
                        {t("english")}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Theme */}
                <div className="flex flex-col w-full">
                  <label htmlFor="theme" className={`${labelClass}`}>
                    {t("theme")}
                  </label>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <div className="flex align-items-center">
                      <RadioButton
                        inputId="theme"
                        name="theme"
                        value="light"
                        onChange={(e) => setTheme(e.value)}
                        checked={theme === "light"}
                      />
                      <label htmlFor="theme" className="ml-2">
                        Light
                      </label>
                    </div>
                    <div className="flex align-items-center">
                      <RadioButton
                        inputId="theme"
                        name="theme"
                        value="dark"
                        onChange={(e) => setTheme(e.value)}
                        checked={theme === "dark"}
                      />
                      <label htmlFor="theme" className="ml-2">
                        Dark
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col items-center gap-2 border-t border-dashed border-gray-300 pt-2 pb-12 md:pb-0">
              <div className="w-full flex items-center gap-2 mt-2">
                <button
                  className="w-full bg-blue-500 px-4 text-white font-semibold p-2 rounded-md"
                  onClick={() => {
                    vibratePattern("doubleTap");
                    updateUser();
                    closeBox();
                    onUpdate();
                  }}
                >
                  {t("save")}
                </button>
                <button
                  onClick={closeBox}
                  className="w-full bg-gray-200 px-4 text-black font-semibold p-2 rounded-md"
                >
                  {t("cancel")}
                </button>
              </div>
              <hr className="w-full border-dashed border-gray-300" />
              {/* Log Out */}
              <button
                className="w-full bg-red-500 px-4 text-white font-semibold p-2 rounded-md mb-8"
                onClick={() => {
                  logOut();
                  vibratePattern("long");
                }}
              >
                {t("logOut")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
ProfileEdit.propTypes = {
  userData: PropTypes.object.isRequired,
  usernameChange: PropTypes.func.isRequired,
  emailChange: PropTypes.func.isRequired,
  closeBox: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default ProfileEdit;
