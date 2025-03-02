import Normal_Button from "../components/common/Normal_Button";
import { FaGoogle } from "react-icons/fa";

const Login = () => {
  return (
    <>
      <div className="flex w-screen h-screen justify-center items-center">
        <div className="loginContainer">
          <h1>Welcome to <span>NT Lyrics & Chords</span></h1>
          <p>Please Enter your Login details!</p>
          <div className="flex flex-col">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              className="border"
              placeholder="Enter your Email"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">Password</label>
            <input
              type="text"
              id="password"
              className="border"
              placeholder="Enter your Password"
            />
          </div>
          <div className="flex justify-between">
            <div className="flex">
              <input type="checkbox" id="remember" className="border" />
              <label htmlFor="remember">Remember for 30 days</label>
            </div>
            <a href="*">Forgot password</a>
          </div>
          <Normal_Button custom_class={"w-full"} text="Get Started" />
          <Normal_Button
            custom_class={"w-full"}
            icon={FaGoogle}
            text="Sign In With Google"
          />
          <p>Don&apos;t have an Account? <a href="*">Sign up</a></p>
        </div>
      </div>
    </>
  );
};

export default Login;
