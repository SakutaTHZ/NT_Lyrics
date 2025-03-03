import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Landing from "../../../src/pages/Landing";
import Login from "../../../src/pages/login";
import Not_Found from "../../../src/pages/Not_Found";
import SignUp from "../../../src/pages/SignUp";
import "../../../src/App.css"; // Import your CSS file for the animations

// Define the variants for Framer Motion with the appropriate transitions
const pageVariants = {
  initial: {
    opacity: 0,
    y: 50, // New page starts below
    transition: { duration: .5, ease: "easeOut" },
  },
  animate: {
    opacity: 1,
    y: 0, // Moves into place
    transition: { duration: .5, ease: "easeOut" },
  },
  exit: {
    opacity: 0.5,
    y: -50, // Old page moves up
    transition: { duration: .5, ease: "easeIn" },
  },
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="page-container" // Use CSS classes for the page container
      >
        <Routes location={location}>
          <Route path="/NT_Lyrics/" element={<Landing />} />
          <Route path="/NT_Lyrics/login" element={<Login />} />
          <Route path="/NT_Lyrics/signup" element={<SignUp />} />
          <Route path="*" element={<Not_Found />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
