import PasswordInput from "../components/common/Password_Input";
import { useState } from "react";

const labelClass = "text-gray-700 mb-2 font-semibold";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(true);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [isConfirmPasswordCorrect, setIsConfirmPasswordCorrect] = useState(0);

  const checkPassword = (input) => {
    setPassword(input);
    setIsPasswordCorrect(input.length >= 2);
  };
  const checkConfirmPassword = (input) => {
    setConfirmPassword(input);
    if (input.length > 0 && input.length < 8) {
      setIsConfirmPasswordCorrect(2);
    } else if (password !== input) {
      setIsConfirmPasswordCorrect(1);
    } else {
      setIsConfirmPasswordCorrect(0);
    }
  };

  return (
    <div
      className="flex w-screen h-screen justify-center items-center overflow-hidden"
      id="main-content"
    >
      <div className="animate-appear loginContainer flex flex-col gap-5 w-full md:w-1/2 px-5 md:px-40 text-base">
        <h1 className="text-blue-500 font-bold text-3xl italic">
          Reset Password
        </h1>
        <p className=" text-gray-500">Please enter your new password below.</p>

        <form className="w-full  py-6 border-t border-gray-300 border-dashed">
          {/* Password Input */}
          <div className="flex flex-col">
            <label htmlFor="password" className={labelClass}>
              Password{" "}
              {!isPasswordCorrect && (
                <span className="text-red-500 font-bold">*</span>
              )}
            </label>
            <PasswordInput value={password} onChange={checkPassword} />
            {!isPasswordCorrect && (
              <p className="text-sm text-red-400 mt-1">
                Password must be at least 8 characters.
              </p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="flex flex-col mt-2">
            <label htmlFor="confirmPassword" className={labelClass}>
              Confirm Password{" "}
              {!isPasswordCorrect && (
                <span className="text-red-500 font-bold">*</span>
              )}
            </label>
            <PasswordInput
              value={confirmPassword}
              onChange={checkConfirmPassword}
            />
            {isConfirmPasswordCorrect == 2 ? (
              <p className="text-sm text-red-400 mt-1">
                Password must be at least 8 characters.
              </p>
            ) : isConfirmPasswordCorrect == 1 ? (
              <p className="text-sm text-red-400 mt-1">
                Passwords do not match.
              </p>
            ) : null}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200 mt-4"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
