import { Link } from "react-router-dom";
import Normal_Button from "../components/common/Normal_Button";
import Guitar_Outline from "../assets/images/guitar-outline.png";

const Not_Found = () => {
  // Remove the local storage data
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center flex-col gap-4">
        <img
          src={Guitar_Outline}
          className="absolute md:right-4 bottom-4 -z-10 h-2/5 md:h-3/4"
          alt=""
        />

        <p className="text-9xl font-extrabold">OOPs</p>
        <p>The Guitar String just Broke.</p>

        <Link to={"/NT_Lyrics"}>
          <Normal_Button
            custom_class={`bg-blue-200 border-transparent shadow-sm font-medium text-blue-900`}
            text="Go to Home Page"
          />
        </Link>
      </div>
    </>
  );
};

export default Not_Found;
