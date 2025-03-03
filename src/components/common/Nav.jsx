import { useState } from "react";
import { BiMenu } from "react-icons/bi";
import { Link } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { MdOutlineLyrics } from "react-icons/md";
import { GrInfo } from "react-icons/gr";
import { CgProfile } from "react-icons/cg";
import { LuLogIn } from "react-icons/lu";

const Nav = () => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  const mobileNavStyle =
    "p-2 px-4 border-b border-gray-200 flex items-center gap-4";

  return (
    <>
      <nav className="w-screen h-12 shadow-sm fixed top-0 flex justify-between items-center px-4 bg-white z-[100]">
        <p className="font-bold text-lg italic">NT Lyrics & Chords</p>

        <button onClick={() => setIsHamburgerOpen(!isHamburgerOpen)}>
          <BiMenu size={24} />
        </button>

        {isHamburgerOpen && (
          <div className="flex flex-col py-2 absolute top-12 shadow-sm w-full left-0">
            <Link to={"/NT_Lyrics/"} className={`${mobileNavStyle}`}>
              <GoHome className="flex-shrink-0" size={18}/>
              Home
            </Link>
            <Link to={"/NT_Lyrics/"} className={`${mobileNavStyle}`}>
              <MdOutlineLyrics  className="flex-shrink-0" size={18}/>
              Lyrics
            </Link>
            <Link to={"/NT_Lyrics/"} className={`${mobileNavStyle}`}>
              <GrInfo className="flex-shrink-0" size={18} />
              About
            </Link>
            <Link to={"/NT_Lyrics/"} className={`${mobileNavStyle}`}>
              <CgProfile  className="flex-shrink-0" size={18}/>
              Profile
            </Link>
            <Link
              to={"/NT_Lyrics/Login"}
              className={`${mobileNavStyle} border-transparent`}
            >
              <LuLogIn  className="flex-shrink-0" size={18}/>
              Login
            </Link>
          </div>
        )}
      </nav>
    </>
  );
};

export default Nav;
