import Normal_Button from "../components/common/Normal_Button";
import { Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import Preview from "../assets/images/Landing_Page.png";
import { useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import PasswordInput from "../components/common/Password_Input";
import { useAuth } from "../components/hooks/authContext";
import { apiUrl, siteUrl } from "../assets/util/api";
import MessagePopup from "../components/common/MessagePopup";

const SignUp = () => {
  const labelClass = "text-gray-700 font-semibold";
  const inputClass = "p-2 border border-gray-300 rounded-md";
  const { loginAction } = useAuth();

  //Set Error for the textboxes and labels
  const [isNameCorrect, setIsNameCorrect] = useState(true);
  const [isEmailCorrect, setIsEmailCorrect] = useState(true);
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(true);

  //Check Errors for textboxes
  //Check Name
  const [name, setName] = useState("");
  const nameInDatabase = ["JohnDoe", "JaneSmith", "User123"];

  const checkName = (input) => {
    setName(input);
    if (nameInDatabase.includes(input.trim())) {
      setIsNameCorrect(false);
    } else {
      setIsNameCorrect(true);
    }
  };

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
    if (input.length < 8 && input.length > 4) {
      setIsPasswordCorrect(false); // Error if password is too short
    } else {
      setIsPasswordCorrect(true); // Valid password
    }
  };

  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState("success");
  const showNewMessage = (type, message) => {
    setMessageText(message);
    setMessageType(type);
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 10000);
  };

  const signUp = async () => {
    const userData = {
      name: name,
      email: email,
      password: password,
    };

    try {
      const response = await fetch(
        `${apiUrl}/users/registerUser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        showNewMessage("error", errorData.errors[0].message);
        throw new Error(
          `Signup failed: ${response.statusText}, ${JSON.stringify(errorData)}`
        );
      }
      loginAction({ email, password });
    } catch (error) {
      console.error(error.message.errors);
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
        <Link to={"/NT_Lyrics"}>
          <BiArrowBack
            className="absolute bottom-2 right-2 rounded-full shadow-md p-2 w-10 h-10"
            size={20}
          />
        </Link>
        {/* Image Holder */}
        <div className="imageContainer items-center justify-end h-full hidden md:flex md:w-1/2 bg-gray-100">
          <img
            src={Preview}
            className="h-3/5 rounded-lg -translate-x-44 shadow-2xl animate-left"
            alt=""
          />
        </div>

        {/* SignUp Box */}
        <div className="animate-appear loginContainer flex flex-col gap-5 w-full md:w-1/2 px-5 md:px-40 text-base">
          <h1 className="text-blue-500 font-bold text-3xl italic">
            NT Lyrics & Chords
          </h1>
          <p className="text-gray-500">Join our musician community today</p>
          <hr className="border-dashed border-gray-300" />
          <div className="flex flex-col">
            <label htmlFor="name" className={`${labelClass}`}>
              Name{" "}
              {!isNameCorrect && (
                <span className="text-red-500 font-bold">*</span>
              )}
            </label>
            <input
              type="text"
              id="name"
              className={`${inputClass} ${!isNameCorrect && "border-red-400"}`}
              placeholder="Enter your Name"
              value={name}
              onChange={(e) => checkName(e.target.value)}
            />
            {!isNameCorrect && (
              <p className={`text-sm text-red-400 mt-1`}>
                Name is already taken.
              </p>
            )}
          </div>
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
              className={`${inputClass} ${!isEmailCorrect && "border-red-400"}`}
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
            <p
              className={`text-sm mt-1 ${
                !isPasswordCorrect ? "text-red-400" : "text-gray-400"
              }`}
            >
              Password must be greater than 4 characters and less than 8
              characters.
            </p>
          </div>
          <Normal_Button
            custom_class={
              "w-full bg-blue-500 border-transparent text-white font-medium"
            }
            text="Get Started"
            onClick={signUp}
          />
          <Normal_Button
            custom_class={`${inputClass} w-full font-semibold`}
            icon={FaGoogle}
            text="Sign Up With Google"
            onClick={() => {
              window.location.href = `${siteUrl}/auth/google`;
            }}
          />
          <p>
            Already have an Account?{" "}
            <Link
              to={"/NT_Lyrics/login"}
              className={`font-semibold text-blue-500`}
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUp;
