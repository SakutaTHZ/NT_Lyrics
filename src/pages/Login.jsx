import Normal_Button from "../components/common/Normal_Button";
import { Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import Preview from "../assets/images/Landing_Page.png";
import { useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import PasswordInput from "../components/common/Password_Input";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const labelClass = "text-gray-700 font-semibold";
  const inputClass = "p-2 border border-gray-300 rounded-md";
  const [isEmailCorrect, setIsEmailCorrect] = useState(true);
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(true);
  const navigate = useNavigate();

  // Check for correct Login
  const [isLoginCorrect, setIsLoginCorrect] = useState(true);

  //Check Email
  const [email, setEmail] = useState("");
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const checkEmail = (input) => {
    setEmail(input);
    setIsEmailCorrect(isValidEmail(input));
  };

  //Check Password
  const [password, setPassword] = useState("");
  const checkPassword = (input) => {
    setPassword(input);
    input.length > 8 ? setIsPasswordCorrect(false) : setIsPasswordCorrect(true);
  };

  const checkCredentials = () => {
    if (email === "thz@gmail.com" && password === "1234") {
      // Go to landing page
      setIsLoginCorrect(true);
      let username = email.split("@")[0];
      localStorage.setItem("user", JSON.stringify({ username, email, password }));
      navigate(`/NT_Lyrics`);
    } else if (email === "admin@gmail.com" && password === "admin") { 
      setIsLoginCorrect(true);
      let username = email.split("@")[0];
      localStorage.setItem("user", JSON.stringify({ username, email, password }));
      navigate(`/NT_Lyrics/admin`);
    } else {
      setIsLoginCorrect(false);
    }
  };

  return (
    <>
      <div className="flex w-screen h-screen justify-center items-center overflow-hidden" id="main-content">
        <Link to={'/NT_Lyrics'}>
        <BiArrowBack className="absolute bottom-2 right-2 rounded-full shadow-md p-2 w-10 h-10" size={20}/>
        </Link>
        {/* Login Box */}
        <div className="animate-appear loginContainer flex flex-col gap-5 w-full md:w-1/2 px-5 md:px-40 text-base">
          <h1 className="text-blue-500 font-bold text-3xl italic">
            NT Lyrics & Chords
          </h1>
          <p className="text-gray-500">Please Enter your Login details!</p>
          <hr className="border-dashed border-gray-300" />
          <div className="flex flex-col">
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
          <div className="flex flex-col">
            <label htmlFor="password" className={`${labelClass}`}>
              Password{" "}
              {!isPasswordCorrect && (
                <span className="text-red-500 font-bold">*</span>
              )}
            </label>
            <PasswordInput value={password} onChange={checkPassword} />
            {!isPasswordCorrect && (
              <p className={`text-sm text-red-400 mt-1`}>
                Password must be less than 8 characters.
              </p>
            )}
            {!isLoginCorrect && (
              <p className={`text-sm text-red-400 mt-1`}>
                Username or Password is incorrect
              </p>
            )}
          </div>
          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <input type="checkbox" id="remember" className="cursor-pointer" />
              <label htmlFor="remember" className={`${labelClass}`}>
                Remember for 30 days
              </label>
            </div>
            <a href="*" className={`font-semibold text-blue-500`}>
              Forgot password
            </a>
          </div>
          <Normal_Button
            custom_class={
              "w-full bg-blue-500 border-transparent text-white font-medium"
            }
            text="Get Started"
            onClick={checkCredentials}
          />
          <Normal_Button
            custom_class={`${inputClass} font-semibold`}
            icon={FaGoogle}
            text="Sign In With Google"
          />
          <p>
            Don&apos;t have an Account?{" "}
            <Link
              to={"/NT_Lyrics/signup"}
              className={`font-semibold text-blue-500`}
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Image Holder */}
        <div className="imageContainer items-center justify-end h-full hidden md:flex md:w-1/2 bg-gray-100">
          <img
            src={Preview}
            className="h-3/5 rounded-lg animate-right translate-x-44 shadow-2xl"
            alt=""
          />
        </div>
      </div>
    </>
  );
};

export default Login;
