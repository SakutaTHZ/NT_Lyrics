import Footer from "../components/common/Footer";
import { BiArrowBack } from "react-icons/bi";
import { useState } from "react";

import { getChordData } from "../assets/js/chordLoader";

import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

const Chords = ({ chordKey, onClose }) => {
  const { t } = useTranslation();

  const chords = getChordData();

  const [isVisible, setIsVisible] = useState(true);

  const chordNames = Object.keys(chords);
  const initialChord = chordNames.includes(chordKey) ? chordKey : chordNames[0];

  const [activeChord, setActiveChord] = useState(initialChord);

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
              <h1 className="text-lg font-semibold">{t("chordsList")}</h1>
              <button onClick={handleClose} className="text-blue-500">
                <BiArrowBack size={20} />
              </button>
            </div>

            <div className="p-4">
              <div className="space-y-6">
                {/* Top row of chord buttons */}
                <div className="flex flex-wrap gap-2">
                  {Object.keys(chords).map((chord) => (
                    <button
                      key={chord}
                      onClick={() => setActiveChord(chord)}
                      className={`px-4 py-1 rounded border  border-gray-200
                        ${
                          activeChord === chord
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 hover:bg-gray-300"
                        }`}
                    >
                      {chord}
                    </button>
                  ))}
                </div>

                {/* Display chord variants if one is active */}
                <div>
                  {activeChord && chords[activeChord] && (
                    <div className="grid grid-cols-2 md:grid-cols-8 gap-4">
                      {chords[activeChord].map((img) => (
                        <div key={img.name} className="text-center">
                          <p className="text-sm text-left">{img.name}</p>
                          <img
                            src={img.src}
                            alt={img.name}
                            className="w-full h-auto border border-gray-200 rounded object-contain aspect-square"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
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
