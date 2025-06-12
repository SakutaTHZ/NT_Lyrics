import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BiMenu } from "react-icons/bi";
import { GoHome } from "react-icons/go";
import { MdOutlineLyrics } from "react-icons/md";
import { GrInfo } from "react-icons/gr";
import { CgProfile } from "react-icons/cg";
import { LuLogIn } from "react-icons/lu";
import useIsMobile from "../hooks/useIsMobile";
import { useContext } from "react";
import { AuthContext } from "../hooks/AuthProvider";

const HIDDEN_PATHS = [
  "/NT_Lyrics/login",
  "/NT_Lyrics/signup",
  "/NT_Lyrics/admin",
  "/NT_Lyrics/reset-password",
];

const NAV_LINKS = [
  {
    path: "/NT_Lyrics/",
    label: "Home",
    icon: <GoHome size={18} className="transition-all" />,
  },
  {
    path: "/NT_Lyrics/lyrics",
    label: "Lyrics",
    icon: <MdOutlineLyrics size={18} className="transition-all" />,
  },
  {
    path: "/NT_Lyrics/about",
    label: "About",
    icon: <GrInfo size={18} className="transition-all" />,
  },
];

const Nav = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  const isHidden = HIDDEN_PATHS.some((path) =>
    location.pathname.startsWith(path)
  );

  const { user } = useContext(AuthContext);
  const isLoggedIn = user !== null && typeof user === "object";

  const isActive = (path) =>
    location.pathname === path
      ? "md:bg-blue-500 hover:bg-blue-600 font-bold text-white"
      : "text-gray-700";

  const isActiveIcon = (path) =>
    location.pathname === path
      ? "transform -translate-y-6 scale-125 bg-white text-blue-500 rounded-full shadow-md transition-transform"
      : "-translate-y-3 text-white";

  const mobileNavStyle =
    "p-2 px-4 hover:bg-blue-100 h-fit border-b md:border-b-0 border-gray-200 md:rounded-md transition-all flex items-center gap-4 md:gap-2";

  if (isHidden) return null;

  return (
    <>
      {/* Desktop Nav */}
      {!isMobile ? (
        <nav className="animate-down-start w-screen h-12 shadow-sm fixed top-0 flex justify-between items-center px-4 md:px-24 bg-white z-[100]">
          <Link to="/NT_Lyrics/" className="font-bold text-lg italic">
            NT Lyrics & Chords
          </Link>

          <button
            className="md:hidden"
            onClick={() => setIsHamburgerOpen((prev) => !prev)}
          >
            <BiMenu size={24} />
          </button>

          <div className="md:flex hidden items-center gap-2">
            {NAV_LINKS.map(({ path, label, icon }) => (
              <Link
                key={path}
                to={path}
                className={`${mobileNavStyle} ${isActive(path)}`}
              >
                {icon}
                {label}
              </Link>
            ))}
            {isLoggedIn ? (
              <Link
                to="/NT_Lyrics/profile"
                className={`${mobileNavStyle} ${isActive(
                  "/NT_Lyrics/profile"
                )}`}
              >
                <CgProfile size={18} />
                Profile
              </Link>
            ) : (
              <Link
                to="/NT_Lyrics/login"
                className={`${mobileNavStyle} ${isActive("/NT_Lyrics/login")}`}
              >
                <LuLogIn size={18} />
                Login
              </Link>
            )}
          </div>

          {/* Mobile hamburger dropdown */}
          {isHamburgerOpen && (
            <div className="animate-down flex flex-col absolute top-12 shadow-sm w-full left-0 z-[99] bg-white">
              {[...NAV_LINKS].map(({ path, label, icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`${mobileNavStyle} ${isActive(path)}`}
                >
                  {icon}
                  {label}
                </Link>
              ))}
              {isLoggedIn ? (
                <Link
                  to="/NT_Lyrics/profile"
                  className={`${mobileNavStyle} ${isActive(
                    "/NT_Lyrics/profile"
                  )}`}
                >
                  <CgProfile size={18} />
                  Profile
                </Link>
              ) : (
                <Link
                  to="/NT_Lyrics/login"
                  className={`${mobileNavStyle} ${isActive(
                    "/NT_Lyrics/login"
                  )}`}
                >
                  <LuLogIn size={18} />
                  Login
                </Link>
              )}
            </div>
          )}
        </nav>
      ) : (
        // Mobile Bottom Nav
        <div className="fixed bottom-0 w-11/12 h-16 translate-y-2 meshBg shadow-sm rounded-t-4xl flex justify-center items-center z-[999] md:hidden">
          <div className="flex items-center w-full">
            {NAV_LINKS.map(({ path, label, icon }) => (
              <Link
                key={path}
                to={path}
                className={`${isActive(
                  path
                )} w-full p-2 flex items-center justify-center flex-col`}
              >
                <div
                  className={`absolute  flex-shrink-0 p-2 ${isActiveIcon(path)}`}
                >
                  {icon}
                </div>
                <p className="text-white drop-shadow-sm  text-sm translate-y-2">{label}</p>
              </Link>
            ))}
            {isLoggedIn ? (
              <Link
                to="/NT_Lyrics/profile"
                className={`${isActive(
                  "/NT_Lyrics/profile"
                )} w-full p-2 flex items-center justify-center flex-col`}
              >
                <div
                  className={`absolute flex-shrink-0 p-2 ${isActiveIcon(
                    "/NT_Lyrics/profile"
                  )}`}
                >
                  <CgProfile size={20} className={location.pathname === '/NT_Lyrics/profile' ? 'text-blue-500' : 'text-white'} />
                </div>
                <p className="text-white drop-shadow-sm  text-sm translate-y-2">Profile</p>
              </Link>
            ) : (
              <Link
                to="/NT_Lyrics/login"
                className={`${isActive(
                  "/NT_Lyrics/login"
                )} w-full p-2 flex items-center justify-center flex-col`}
              >
                <div
                  className={`absolute flex-shrink-0 p-2 ${isActiveIcon(
                    "/NT_Lyrics/login"
                  )}`}
                >
                  <LuLogIn size={20} className=" text-white "/>
                </div>
                <p className="text-white drop-shadow-sm text-sm translate-y-2">Login</p>
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Nav;
