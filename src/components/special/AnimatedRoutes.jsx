import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import Landing from "../../../src/pages/Landing";
import Lyrics from "../../../src/pages/Lyrics";
import Login from "../../../src/pages/login";
import Not_Found from "../../../src/pages/Not_Found";
import SignUp from "../../../src/pages/SignUp";
import "../../../src/App.css";

// Animations to randomly pick from
const animations = [
  {
    initial: { opacity: 0, scale: 0.95, transition: { duration: 0.3, ease: "easeOut" } },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3, ease: "easeIn" } },
  }, // Zoom-In

  {
    initial: { opacity: 0, x: -100, transition: { duration: 0.3, ease: "easeOut" } },
    animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, x: -100, transition: { duration: 0.3, ease: "easeIn" } },
  }, // Slide from Left

  {
    initial: { opacity: 0, x: 100, transition: { duration: 0.3, ease: "easeOut" } },
    animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, x: 100, transition: { duration: 0.3, ease: "easeIn" } },
  }, // Slide from Right

  {
    initial: { opacity: 0, y: -100, transition: { duration: 0.3, ease: "easeOut" } },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, y: -100, transition: { duration: 0.3, ease: "easeIn" } },
  }, // Slide from Top

  {
    initial: { opacity: 0, y: 100, transition: { duration: 0.3, ease: "easeOut" } },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, y: 100, transition: { duration: 0.3, ease: "easeIn" } },
  }, // Slide from Bottom

  {
    initial: { opacity: 0, scale: 0.8, transition: { duration: 0.2, ease: "easeOut" } },
    animate: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 120 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2, ease: "easeIn" } },
  }, // Bounce

  {
    initial: { opacity: 0, filter: "blur(10px)", transition: { duration: 0.3, ease: "easeOut" } },
    animate: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, filter: "blur(10px)", transition: { duration: 0.3, ease: "easeIn" } },
  }, // Blur-In
];


// Slide for Auth pages (Login, Signup)
const slideVariants = {
  initial: { opacity: 0, y: 500, transition: { duration: 0.25, ease: "easeOut" } },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
  exit: { opacity: 0.2, y: -500, transition: { duration: 0.5, ease: "easeIn" } },
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const isAuthPage = ["/NT_Lyrics/login", "/NT_Lyrics/signup"].includes(location.pathname);

  // Pick a random animation for non-auth pages, memoized so it doesn’t change mid-session
  const randomAnimation = useMemo(() => animations[Math.floor(Math.random() * animations.length)], []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={isAuthPage ? slideVariants : randomAnimation}
        initial="initial"
        animate="animate"
        exit="exit"
        className="page-container"
      >
        <Routes location={location}>
          <Route path="/NT_Lyrics/" element={<Landing />} />
          <Route path="/NT_Lyrics/lyrics" element={<Lyrics />} />
          <Route path="/NT_Lyrics/login" element={<Login />} />
          <Route path="/NT_Lyrics/signup" element={<SignUp />} />
          <Route path="*" element={<Not_Found />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
