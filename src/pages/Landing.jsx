import { Link } from "react-router-dom";
import Normal_Button from "../components/common/Normal_Button";const Landing = () => {
  return (
    <>
      <div className="flex w-screen h-screen justify-center items-center">
        <Link to={"/NT_Lyrics/Login"}>
          <Normal_Button
            custom_class={`bg-blue-200 border-transparent shadow-sm font-medium text-blue-900`}
            text="Go to Login"
          />
        </Link>
      </div>
    </>
  );
};

export default Landing;
