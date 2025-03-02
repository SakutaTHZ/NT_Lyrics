import Normal_Button from "../components/common/Normal_Button";
import { FaGoogle } from "react-icons/fa";
import Preview from '../assets/images/Landing_Page.png'

const Login = () => {
const labelClass = 'text-gray-700 font-semibold'
const inputClass = 'p-2 border border-gray-400 rounded-md'
  return (
    <>
      <div className="flex w-screen h-screen justify-center items-center">
        <div className="loginContainer flex flex-col gap-5 w-full md:w-1/2 px-5 md:px-40 text-lg">
          <h1 className="text-blue-500 font-bold text-3xl italic">NT Lyrics & Chords</h1>
          <p className="text-gray-500">Please Enter your Login details!</p>
          <hr className="border-dashed border-gray-300"/>
          <div className="flex flex-col">
            <label htmlFor="email" className={`${labelClass}`}>Email</label>
            <input
              type="text"
              id="email"
              className={inputClass}
              placeholder="Enter your Email"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className={`${labelClass}`}>Password</label>
            <input
              type="text"
              id="password"
              className={inputClass}
              placeholder="Enter your Password"
            />
          </div>
          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <input type="checkbox" id="remember" className="cursor-pointer"/>
              <label htmlFor="remember"  className={`${labelClass}`}>Remember for 30 days</label>
            </div>
            <a href="*"  className={`font-semibold text-blue-500`}>Forgot password</a>
          </div>
          <Normal_Button custom_class={"w-full bg-blue-500 border-transparent text-white font-medium"} text="Get Started" />
          <Normal_Button
            custom_class={`${inputClass} font-semibold`}
            icon={FaGoogle}
            text="Sign In With Google"
          />
          <p>Don&apos;t have an Account? <a href="*"  className={`font-semibold text-blue-500`}>Sign up</a></p>
        </div>

        <div className="imageContainer items-center justify-end h-full hidden md:flex md:w-1/2 bg-gray-100">
            <img src={Preview} className="h-3/5 rounded-lg translate-x-44 shadow-2xl" alt="" />
        </div>
      </div>
    </>
  );
};

export default Login;
