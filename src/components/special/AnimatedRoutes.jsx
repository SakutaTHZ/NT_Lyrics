import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Landing from "../../../src/pages/Landing";
import Login from "../../../src/pages/login";
import Not_Found from "../../../src/pages/Not_Found";
import SignUp from "../../../src/pages/SignUp";
import "../../../src/App.css"; 


const pageVariants = {
  initial: {
    opacity: 0,
    y: 500, 
    transition: { duration: .25, ease: "easeOut" },
  },
  animate: {
    opacity: 1,
    y: 0, 
    transition: { duration: .25, ease: "easeOut" },
  },
  exit: {
    opacity: 0.2,
    y: -500, 
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
        className="page-container" 
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
