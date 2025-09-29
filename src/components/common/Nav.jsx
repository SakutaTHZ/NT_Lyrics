import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BiMenu } from "react-icons/bi";
import { GoHome } from "react-icons/go";
import { MdOutlineLyrics } from "react-icons/md";
import { GrInfo } from "react-icons/gr";
import { CgProfile } from "react-icons/cg";
import { LuLogIn } from "react-icons/lu";
import { BsPeople } from "react-icons/bs";
import useIsMobile from "../hooks/useIsMobile";
import { AuthContext } from "../hooks/AuthProvider";
import { useVibration } from "../hooks/useVibration";

const HIDDEN_PATHS = [
  "/NT_Lyrics/login",
  "/NT_Lyrics/signup",
  "/NT_Lyrics/admin",
  "/NT_Lyrics/reset-password",
];

const NAV_LINKS = [
  {
    path: "/",
    label: "Home",
    icon: <GoHome size={18} />,
  },
  {
    path: "/NT_Lyrics/artists",
    label: "Artists",
    icon: <BsPeople size={18} />,
  },
  {
    path: "/NT_Lyrics/lyrics",
    label: "Lyrics",
    icon: <MdOutlineLyrics size={18} />,
  },
  {
    path: "/NT_Lyrics/about",
    label: "About",
    icon: <GrInfo size={18} />,
  },
];

const Nav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { vibratePattern } = useVibration();
  const isMobile = useIsMobile();
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const { user } = useContext(AuthContext);

  const isLoggedIn = user !== null && typeof user === "object";
  const isHidden = HIDDEN_PATHS.some((path) =>
    location.pathname.startsWith(path)
  );

  const handleNav = (path, pattern = "short") => {
    vibratePattern(pattern);
    setTimeout(() => navigate(path), 80); // slight delay for haptic to register
  };

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
        <nav className="animate-down-start w-screen h-12 shadow-sm fixed top-0 flex justify-between items-center px-4 md:px-20 meshBg z-[1000]">
          <button
            onClick={() => handleNav("/")}
            className="font-bold text-lg italic text-left w-full overflow-hidden text-ellipsis whitespace-nowrap"
          >
            NT Lyric & Chord
          </button>

          <button
            className="md:hidden"
            onClick={() => setIsHamburgerOpen((prev) => !prev)}
          >
            <BiMenu size={24} />
          </button>

          <div className="md:flex hidden items-center gap-2">
            {NAV_LINKS.map(({ path, label, icon }) => (
              <button
                key={path}
                onClick={() => handleNav(path)}
                className={`${mobileNavStyle} ${isActive(path)}`}
              >
                {icon}
                {label}
              </button>
            ))}
            {isLoggedIn ? (
              <button
                onClick={() => handleNav("/NT_Lyrics/profile")}
                className={`${mobileNavStyle} ${isActive(
                  "/NT_Lyrics/profile"
                )}`}
              >
                <CgProfile size={18} />
                Profile
              </button>
            ) : (
              <button
                onClick={() => handleNav("/NT_Lyrics/login", "dandadan")}
                className={`${mobileNavStyle} ${isActive("/NT_Lyrics/login")}`}
              >
                <LuLogIn size={18} />
                Login
              </button>
            )}
            {user?.role === "admin" && (
              <button
                onClick={() => handleNav("/NT_Lyrics/admin")}
                className={`${mobileNavStyle} ${isActive(
                  "/NT_Lyrics/admin"
                )} hover:bg-red-100`}
              >
                <span className="text-red-500">Admin</span>
              </button>
            )}
          </div>

          {isHamburgerOpen && (
            <div className="animate-down flex flex-col absolute top-12 shadow-sm w-full left-0 z-[99] c-bg">
              {[...NAV_LINKS].map(({ path, label, icon }) => (
                <button
                  key={path}
                  onClick={() => handleNav(path)}
                  className={`${mobileNavStyle} ${isActive(path)}`}
                >
                  {icon}
                  {label}
                </button>
              ))}
              {isLoggedIn ? (
                <button
                  onClick={() => handleNav("/NT_Lyrics/profile")}
                  className={`${mobileNavStyle} ${isActive(
                    "/NT_Lyrics/profile"
                  )}`}
                >
                  <CgProfile size={18} />
                  Profile
                </button>
              ) : (
                <button
                  onClick={() => handleNav("/NT_Lyrics/login", "dandadan")}
                  className={`${mobileNavStyle} ${isActive(
                    "/NT_Lyrics/login"
                  )}`}
                >
                  <LuLogIn size={18} />
                  Login
                </button>
              )}
            </div>
          )}
        </nav>
      ) : (
        // Mobile Bottom Nav
        <div className="fixed bottom-0 w-11/12 h-16 translate-y-2 meshBg shadow-sm rounded-t-4xl flex justify-center items-center z-[999] md:hidden">
          <div className="flex items-center w-full">
            {NAV_LINKS.map(({ path, label, icon }) => (
              <button
                key={path}
                onClick={() => handleNav(path)}
                className={`${isActive(
                  path
                )} w-full p-2 flex items-center justify-center flex-col`}
              >
                <div className={`absolute p-2 ${isActiveIcon(path)}`}>
                  {icon}
                </div>
                <p className="text-white drop-shadow-sm text-sm translate-y-2">
                  {label}
                </p>
              </button>
            ))}
            {isLoggedIn ? (
              <button
                onClick={() => handleNav("/NT_Lyrics/profile")}
                className={`${isActive(
                  "/NT_Lyrics/profile"
                )} w-full p-2 flex items-center justify-center flex-col`}
              >
                <div
                  className={`absolute flex-shrink-0 p-2 ${isActiveIcon(
                    "/NT_Lyrics/profile"
                  )}`}
                >
                  <CgProfile
                    size={20}
                    className={
                      location.pathname === "/NT_Lyrics/profile"
                        ? "text-blue-500"
                        : "text-white"
                    }
                  />
                </div>
                <p className="text-white drop-shadow-sm text-sm translate-y-2">
                  Profile
                </p>
              </button>
            ) : (
              <button
                onClick={() => handleNav("/NT_Lyrics/login", "dandadan")}
                className={`${isActive(
                  "/NT_Lyrics/login"
                )} w-full p-2 flex items-center justify-center flex-col`}
              >
                <div
                  className={`absolute flex-shrink-0 p-2 ${isActiveIcon(
                    "/NT_Lyrics/login"
                  )}`}
                >
                  <LuLogIn size={20} className="text-white" />
                </div>
                <p className="text-white drop-shadow-sm text-sm translate-y-2">
                  Login
                </p>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Nav;
