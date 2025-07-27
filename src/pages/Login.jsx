import { useState } from "react";
import {
  Link,
  //  useNavigate
} from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { GoHome } from "react-icons/go";
import Normal_Button from "../components/common/Normal_Button";
import PasswordInput from "../components/common/Password_Input";
import Preview from "../assets/images/Landing_Page.png";
import { useAuth } from "../components/hooks/authContext";
import { siteUrl,apiUrl } from "../assets/util/api";

import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import EmailVerificationDialog from "../components/common/EmailVerificationDialog";

const Login = () => {
  const labelClass = "text-gray-700 font-semibold";
  const inputClass = "p-2 border border-gray-300 rounded-md";
  const { loginAction } = useAuth(); // ✅ Use loginAction from context
  // const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailCorrect, setIsEmailCorrect] = useState(true);
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(true);
  const [errorMessage, setErrorMessage] = useState(""); // Store API error messages

  const [isRemember, setIsRemember] = useState(true);

  // State for showing the resend email dialog
  const [showResendDialog, setShowResendDialog] = useState(false);

  // Validate Email
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const checkEmail = (input) => {
    setEmail(input);
    setIsEmailCorrect(isValidEmail(input));
  };

  // Validate Password (min length)
  const checkPassword = (input) => {
    setPassword(input);
    setIsPasswordCorrect(input.length >= 2);
  };

  // Handle Login API
  const handleLogin = async () => {
    if (!isEmailCorrect || !isPasswordCorrect) {
      setErrorMessage("Please enter valid credentials.");
      return;
    }

    const response = await loginAction({
      email,
      password,
      rememberMe: isRemember,
      isOAuth: false,
    });

    if (response?.success === false) {
      console.error("Login failed:", response.message);
      if(response.message === "Email not verified. Please verify first.") {
        setShowResendDialog(true); 
      }
      setErrorMessage("Login failed. Try again.");
    }
  };

  const [forgotDialogVisible, setForgotDialogVisible] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotEmailError, setForgotEmailError] = useState("");
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!isValidEmail(forgotEmail)) {
      setForgotEmailError("Please enter a valid email.");
      return;
    }

    setForgotLoading(true);
    try {
      const res = await fetch(
        `${apiUrl}/users/forgotPassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: forgotEmail }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send reset link.");
      }

      setForgotSuccessMsg("Reset link sent! Check your email.");
      setForgotEmailError("");
    } catch (err) {
      setForgotEmailError(err.message || "Something went wrong.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div
      className="flex w-screen h-screen justify-center items-center overflow-hidden"
      id="main-content"
    >
      <Link to={"/"}>
        <GoHome
          className="absolute bottom-2 right-2 rounded-full shadow-md p-2 w-10 h-10"
          size={20}
        />
      </Link>

      {/* Login Box */}
      <div className="animate-appear loginContainer flex flex-col gap-5 w-full md:w-1/2 px-5 md:px-40 text-base">
        <h1 className="text-blue-500 font-bold text-3xl italic">
          NT Lyrics & Chords
        </h1>
        <p className="text-gray-500">Please Enter your Login details!</p>
        <hr className="border-dashed border-gray-300" />

        {/* Email Input */}
        <div className="flex flex-col">
          <label htmlFor="email" className={labelClass}>
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
            <p className="text-sm text-red-400 mt-1">Invalid Email.</p>
          )}
        </div>

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

        {/* Show API Error */}
        {errorMessage && (
          <p className="text-sm bg-red-100 p-2 rounded-md text-red-500">{errorMessage}</p>
        )}

        {/* Remember Me & Forgot Password */}
        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            <input
              type="checkbox"
              id="remember"
              className="cursor-pointer"
              onChange={() => setIsRemember(!isRemember)}
              checked={isRemember}
            />
            <label htmlFor="remember" className={labelClass}>
              Remember for 30 days
            </label>
          </div>
          <button
            className="font-semibold text-blue-500"
            onClick={() => setForgotDialogVisible(true)}
          >
            Forgot password
          </button>
        </div>

        {/* Login Button */}
        <Normal_Button
          custom_class="w-full bg-blue-500 border-transparent text-white font-medium"
          text="Get Started"
          onClick={handleLogin} // ✅ Call handleLogin
        />

        {/* Google Login */}
        <Normal_Button
          custom_class={`${inputClass} font-semibold w-full`}
          icon={FaGoogle}
          text="Sign In With Google"
          onClick={() => {
            window.location.href = `${siteUrl}/auth/google`;
          }}
        />

        {/* Sign Up Link */}
        <p>
          Don&apos;t have an Account?
          <Link
            to={"/NT_Lyrics/signup"}
            className="font-semibold text-blue-500"
          >
            {" "}
            Sign up
          </Link>
        </p>
      </div>

      {/* Image Holder */}
      <div className="imageContainer items-center justify-end h-full hidden md:flex md:w-1/2 bg-gray-100">
        <img
          src={Preview}
          className="h-3/5 rounded-lg animate-right translate-x-44 shadow-2xl"
          alt="Preview"
        />
      </div>

      <Dialog
        header="Reset Password"
        visible={forgotDialogVisible}
        style={{ width: "90vw", maxWidth: "400px" }}
        onHide={() => {
          setForgotDialogVisible(false);
          setForgotEmail("");
          setForgotEmailError("");
          setForgotSuccessMsg("");
          setForgotLoading(false);
        }}
        // position="bottom"
        className="p-fluid"
        modal
      >
        <div className="flex flex-col gap-2 pt-4">
          <label htmlFor="forgotEmail" className="font-semibold">
            Enter your email
          </label>
          <input
            type="email"
            id="forgotEmail"
            value={forgotEmail}
            onChange={(e) => {
              setForgotEmail(e.target.value);
              setForgotEmailError("");
              setForgotSuccessMsg("");
            }}
            className="p-2 border border-gray-300 rounded-md"
            placeholder="user@example.com"
          />
          {forgotEmailError && (
            <small className="flex justify-between  items-center bg-red-200 p-2 rounded-md text-red-600">{forgotEmailError}</small>
          )}
          {forgotSuccessMsg && (
            <small className="flex justify-between  items-center bg-green-200 p-2 rounded-md text-green-600">
              {forgotSuccessMsg}
              <a
                href="https://mail.google.com"
                className="bg-white p-2 py-1 rounded-md text-nowrap"
                target="_blank"
              >
                Open Gmail
              </a>
            </small>
          )}
          <div className="flex justify-end mt-2 gap-2">
            <Button
              label="Send Reset Link"
              loading={forgotLoading}
              onClick={handleForgotPassword}
              className="h-10"
            />
          </div>
        </div>
      </Dialog>

      {/* Dialog rendered conditionally */}
      <EmailVerificationDialog
        visible={showResendDialog}
        onHide={() => setShowResendDialog(false)}
        userEmail={email}
      />
    </div>
  );
};

export default Login;
