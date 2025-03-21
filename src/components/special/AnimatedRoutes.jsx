import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import React, { Suspense } from "react";
import "../../../src/App.css";

// Dynamically importing pages
const Landing = React.lazy(() => import("../../../src/pages/Landing"));
const Lyrics = React.lazy(() => import("../../../src/pages/Lyrics"));
const Profile = React.lazy(() => import("../../../src/pages/Profile"));
const Login = React.lazy(() => import("../../../src/pages/Login"));
const Not_Found = React.lazy(() => import("../../../src/pages/Not_Found"));
const SignUp = React.lazy(() => import("../../../src/pages/SignUp"));
const LyricsDetails = React.lazy(() => import("../../pages/LyricsDetails"));
const Artist = React.lazy(() => import("../../pages/Artist"));

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
    <Suspense fallback={<div></div>}>
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
          <Route path="/NT_Lyrics/lyricsdetail/:id" element={<LyricsDetails />} />
          <Route path="/NT_Lyrics/artist/:name" element={<Artist />} />
          <Route path="/NT_Lyrics/profile" element={<Profile />} />
          <Route path="/NT_Lyrics/login" element={<Login />} />
          <Route path="/NT_Lyrics/signup" element={<SignUp />} />
          <Route path="*" element={<Not_Found />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
    </Suspense>
  );
};

export default AnimatedRoutes;
