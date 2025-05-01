import { useState } from "react";
import {
  Link,
  //  useNavigate
} from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { BiArrowBack } from "react-icons/bi";
import Normal_Button from "../components/common/Normal_Button";
import PasswordInput from "../components/common/Password_Input";
import Preview from "../assets/images/Landing_Page.png";
import { useAuth } from "../components/hooks/authContext";

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
  const handleRemember = () => {
    setIsRemember(!isRemember);
  };

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
      setErrorMessage(response.message || "Login failed. Try again.");
    }
  };

  return (
    <div
      className="flex w-screen h-screen justify-center items-center overflow-hidden"
      id="main-content"
    >
      <Link to={"/NT_Lyrics"}>
        <BiArrowBack
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
          <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
        )}

        {/* Remember Me & Forgot Password */}
        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            <input
              type="checkbox"
              id="remember"
              className="cursor-pointer"
              onChange={handleRemember}
            />
            <label htmlFor="remember" className={labelClass}>
              Remember for 30 days
            </label>
          </div>
          <a href="*" className="font-semibold text-blue-500">
            Forgot password
          </a>
        </div>

        {/* Login Button */}
        <Normal_Button
          custom_class="w-full bg-blue-500 border-transparent text-white font-medium"
          text="Get Started"
          onClick={handleLogin} // ✅ Call handleLogin
        />

        {/* Google Login */}
        <Normal_Button
          custom_class={`${inputClass} font-semibold`}
          icon={FaGoogle}
          text="Sign In With Google"
          onClick={() => {
            window.location.href = "http://localhost:3000/auth/google";
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
    </div>
  );
};

export default Login;
