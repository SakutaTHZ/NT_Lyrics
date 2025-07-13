import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import PasswordInput from "../components/common/Password_Input";
import MessagePopup from "../components/common/MessagePopup";
import { apiUrl } from "../assets/util/api";

const labelClass = "text-gray-700 mb-2 font-semibold";

const ResetPassword = () => {
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);
  const [confirmPasswordStatus, setConfirmPasswordStatus] = useState(0); // 0 = OK, 1 = mismatch, 2 = too short

  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [showMessage, setShowMessage] = useState(false);

  const [disableBoxes, setDisableBoxes] = useState(false);

  const checkPassword = (value) => {
    setPassword(value);
    setIsPasswordValid(value.length >= 8);
  };

  const checkConfirmPassword = (value) => {
    setConfirmPassword(value);

    if (value.length > 0 && value.length < 8) {
      setIsConfirmPasswordValid(false);
      setConfirmPasswordStatus(2);
    } else if (value !== password) {
      setIsConfirmPasswordValid(false);
      setConfirmPasswordStatus(1);
    } else {
      setIsConfirmPasswordValid(true);
      setConfirmPasswordStatus(0);
    }
  };

  const checkPasswords = () => {
    if (password.length < 8) {
      setIsPasswordValid(false);
      return false;
    }
    if (confirmPassword.length < 8) {
      setIsConfirmPasswordValid(false);
      setConfirmPasswordStatus(2);
      return false;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordStatus(1);
      return false;
    }
    return true;
  };

  const handleResetPassword = async () => {
    if (!checkPasswords()) {
      setMessageType("error");
      setMessageText("Please fix the errors before submitting.");
      setShowMessage(true);
      return;
    }

    try {
      const res = await fetch(
        `${apiUrl}/users/resetPassword/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newPassword: password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        const errorMsg =
          data.errors?.[0]?.message ||
          "An error occurred while resetting the password.";
        throw new Error(errorMsg);
      }

      setMessageType("success");
      setMessageText("Password reset successfully! You can now log in.");
    } catch (err) {
      console.error("Reset error:", err);
      setMessageType("error");
      setMessageText(err.message || "Unexpected error occurred.");
    } finally {
      setShowMessage(true);
      setDisableBoxes(true);
    }
  };

  return (
    <>
      {showMessage && (
        <MessagePopup message_type={messageType} message_text={messageText} />
      )}

      <div
        className="flex w-screen h-screen justify-center items-center overflow-hidden"
        id="main-content"
      >
        <div className="animate-appear loginContainer flex flex-col gap-5 w-full md:w-1/2 px-5 md:px-40 text-base">
          <h1 className="text-blue-500 font-bold text-3xl italic">
            Reset Password
          </h1>
          <p className="text-gray-500">Please enter your new password below.</p>

          <form className="w-full py-6 border-t border-gray-300 border-dashed">
            {/* Password */}
            <div className="flex flex-col">
              <label htmlFor="password" className={labelClass}>
                Password{" "}
                {!isPasswordValid && (
                  <span className="text-red-500 font-bold">*</span>
                )}
              </label>
              <PasswordInput
                value={password}
                onChange={checkPassword}
                disabled={disableBoxes}
              />
              {!isPasswordValid && (
                <p className="text-sm text-red-400 mt-1">
                  Password must be at least 8 characters.
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col mt-2">
              <label htmlFor="confirmPassword" className={labelClass}>
                Confirm Password{" "}
                {!isConfirmPasswordValid && (
                  <span className="text-red-500 font-bold">*</span>
                )}
              </label>
              <PasswordInput
                value={confirmPassword}
                onChange={checkConfirmPassword}
                disabled={disableBoxes}
              />
              {confirmPasswordStatus === 2 && (
                <p className="text-sm text-red-400 mt-1">
                  Password must be at least 8 characters.
                </p>
              )}
              {confirmPasswordStatus === 1 && (
                <p className="text-sm text-red-400 mt-1">
                  Passwords do not match.
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`w-full py-2 rounded mt-4 transition duration-200 bg-blue-500 text-white hover:bg-blue-600 ${
                disableBoxes && `bg-gray-300 text-gray-600 cursor-not-allowed`
              }`}
              onClick={(e) => {
                e.preventDefault();
                if (checkPasswords) handleResetPassword();
              }}
              disabled={disableBoxes}
            >
              Reset Password
            </button>
          </form>

          {disableBoxes && (
            <Link
                to="/NT_Lyrics/login"
              >
            <button
              type="button"
              className={`w-full py-2 rounded bg-green-400 transition-all duration-300 transform
                ${
                  disableBoxes
                    ? "-translate-y-6 opacity-100"
                    : "translate-y-0 opacity-0 pointer-events-none"
                } transition-all duration-300 ease-in-out
              `}
              disabled={!checkPasswords}
            >
              Go to Login
            </button>
              </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
