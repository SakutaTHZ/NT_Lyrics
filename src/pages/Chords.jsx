import Footer from "../components/common/Footer";
import { BiArrowBack } from "react-icons/bi";
import { useState } from "react";

import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

const Chords = ({ chordKey, onClose }) => {
  const { t } = useTranslation();

  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    // after animation duration, call the parent onClose
    setTimeout(() => {
      onClose();
    }, 300); // match your transition duration
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="w-screen h-screen absolute inset-0 z-20 bg-white overflow-hidden overflow-y-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h1 className="text-lg font-semibold">
                {t("chordsList")}
              </h1>
              <button onClick={handleClose} className="text-blue-500">
                <BiArrowBack size={20} />
              </button>
            </div>
            
            <div>
                {/* Chords content goes here */}
                <p className="p-4">Chords content for <b>{chordKey}</b> will be displayed here.</p>
            </div>

            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

import PropTypes from "prop-types";

Chords.propTypes = {
  chordKey: PropTypes.string,
  onClose: PropTypes.func,
};

export default Chords;
