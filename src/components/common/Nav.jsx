import {  useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BiMenu } from "react-icons/bi";
import { GoHome } from "react-icons/go";
import { MdOutlineLyrics } from "react-icons/md";
import { GrInfo } from "react-icons/gr";
import { CgProfile } from "react-icons/cg";
import { LuLogIn } from "react-icons/lu";

const Nav = () => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  // Check if Logged In
  const checkUser = () => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) !== null : false;
  };

  const [isLoggedIn, ] = useState(() => checkUser());

  const location = useLocation();

  

  const mobileNavStyle =
    "p-2 px-4 hover:bg-blue-100 h-fit border-b border-gray-200 md:rounded-md transition-all flex items-center gap-4 md:gap-2";

  // Function to check if link is active
  const isActive = (path) => location.pathname === path ? "bg-blue-500 hover:bg-blue-600 font-bold text-white" : "text-gray-700";

  return (
    <>
      <nav className="animate-down-start w-screen h-12 shadow-sm fixed top-0 flex justify-between items-center px-4 md:px-24 bg-white z-[100]">
        <p className="font-bold text-lg italic">NT Lyrics & Chords</p>

        <button
          className="md:hidden"
          onClick={() => setIsHamburgerOpen(!isHamburgerOpen)}
        >
          <BiMenu size={24} />
        </button>

        <div className="md:flex hidden items-center gap-2">
          <Link to="/NT_Lyrics/" className={`${mobileNavStyle} border-transparent ${isActive("/NT_Lyrics/")}`}>
            <GoHome className="flex-shrink-0" size={18} />
            Home
          </Link>
          <Link to="/NT_Lyrics/lyrics" className={`${mobileNavStyle} border-transparent ${isActive("/NT_Lyrics/lyrics")}`}>
            <MdOutlineLyrics className="flex-shrink-0" size={18} />
            Lyrics
          </Link>
          <Link to="/NT_Lyrics/about" className={`${mobileNavStyle} border-transparent ${isActive("/NT_Lyrics/about")}`}>
            <GrInfo className="flex-shrink-0" size={18} />
            About
          </Link>
          {isLoggedIn ? (
            <Link to="/NT_Lyrics/profile" className={`${mobileNavStyle} border-transparent ${isActive("/NT_Lyrics/profile")}`}>
              <CgProfile className="flex-shrink-0" size={18} />
              Profile
            </Link>
          ) : (
            <Link to="/NT_Lyrics/login" className={`${mobileNavStyle} border-transparent ${isActive("/NT_Lyrics/login")}`}>
              <LuLogIn className="flex-shrink-0" size={18} />
              Login
            </Link>
          )}
        </div>

        {isHamburgerOpen && (
          <div className="animate-down flex flex-col absolute top-12 shadow-sm w-full left-0 z-[99] bg-white">
            <Link to="/NT_Lyrics/" className={`${mobileNavStyle} ${isActive("/NT_Lyrics/")}`}>
              <GoHome className="flex-shrink-0" size={18} />
              Home
            </Link>
            <Link to="/NT_Lyrics/lyrics" className={`${mobileNavStyle} ${isActive("/NT_Lyrics/lyrics")}`}>
              <MdOutlineLyrics className="flex-shrink-0" size={18} />
              Lyrics
            </Link>
            <Link to="/NT_Lyrics/about" className={`${mobileNavStyle} ${isActive("/NT_Lyrics/about")}`}>
              <GrInfo className="flex-shrink-0" size={18} />
              About
            </Link>
            {isLoggedIn ? (
              <Link to="/NT_Lyrics/profile" className={`${mobileNavStyle} border-transparent ${isActive("/NT_Lyrics/profile")}`}>
                <CgProfile className="flex-shrink-0" size={18} />
                Profile
              </Link>
            ) : (
              <Link to="/NT_Lyrics/login" className={`${mobileNavStyle} border-transparent ${isActive("/NT_Lyrics/login")}`}>
                <LuLogIn className="flex-shrink-0" size={18} />
                Login
              </Link>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Nav;
