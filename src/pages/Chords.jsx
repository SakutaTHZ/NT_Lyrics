import Footer from "../components/common/Footer";
import { BiArrowBack } from "react-icons/bi";
import { useState, useMemo, useEffect } from "react";

import { getChordData } from "../assets/js/chordLoader";

import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import ChordsDisplay from "../components/common/ChordsDisplay";
import { extractChordsFromImage } from "../assets/util/ocrChords";

const Chords = ({ imageLink, chordKey, onClose }) => {
  const { t } = useTranslation();

  const chords = getChordData();

  const [reading, setReading] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState(null);

  const handleReadImage = async (link) => {
    setReading(true);
    setError(null);
    setText("");

    try {
      const chords = await extractChordsFromImage(link);
      setText(chords.length ? chords.join(" ") : "No valid chords detected.");
    } catch (err) {
      console.error(err);
      setError("Failed to read chords from image.");
    } finally {
      setReading(false);
    }
  };

  useEffect(() => {
    handleReadImage(imageLink); // Sample image path
  }, [imageLink]);

  const [isVisible, setIsVisible] = useState(true);

  const chordNames = Object.keys(chords);
  const initialChord = chordNames.includes(chordKey) ? chordKey : chordNames[0];

  const [activeChord, setActiveChord] = useState(initialChord);
  const [activeVariant, setActiveVariant] = useState(null);

  // Group chord variants by base name (e.g., Cm7, C, Cdim)
  const groupedVariants = useMemo(() => {
    if (!activeChord || !chords[activeChord]) return {};

    return chords[activeChord].reduce((acc, chordObj) => {
      const baseName = chordObj.name.split("-")[0].trim(); // e.g., "Cm7-3" -> "Cm7"
      if (!acc[baseName]) acc[baseName] = [];
      acc[baseName].push(chordObj);
      return acc;
    }, {});
  }, [activeChord, chords]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="w-screen h-screen absolute inset-0 z-20 c-bg overflow-hidden overflow-y-auto px-4 md:px-24"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between py-4 ">
            <h1 className="text-lg font-semibold">{t("chordsList")}</h1>
            <button onClick={handleClose} className="text-blue-500">
              <BiArrowBack size={20} />
            </button>
          </div>

          {/* Chords Display */}
          <ChordsDisplay
            originalChords={text.split(" ")} // pass chords as an array
            error={error}
            reading={reading}
          />

          <div className="py-4 space-y-4">
            {/* Top row of chord buttons (C, Db, D...) */}
            <div className="flex flex-wrap gap-2">
              {Object.keys(chords).map((chord) => (
                <button
                  key={chord}
                  onClick={() => {
                    setActiveChord(chord);
                    setActiveVariant(null); // reset sub-variant
                  }}
                  className={`px-4 py-1 rounded border c-border ${
                    activeChord === chord ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  {chord}
                </button>
              ))}
            </div>

            {/* Sub-buttons for chord variants (C, Cm, Cm7, etc.) */}
            {activeChord && (
              <div className="flex flex-wrap gap-2 border c-border p-2 rounded-md border-dashed c-announcement-bg text-sm">
                {Object.keys(groupedVariants).map((variant) => (
                  <button
                    key={variant}
                    onClick={() => setActiveVariant(variant)}
                    className={`px-3 py-1 rounded border c-border ${
                      activeVariant === variant ? "c-primary c-reverse" : "c-bg"
                    }`}
                  >
                    {variant}
                  </button>
                ))}
              </div>
            )}

            {/* Display chord images */}
            {activeVariant && groupedVariants[activeVariant] && (
              <div className="grid grid-cols-2 md:grid-cols-8 gap-4">
                {groupedVariants[activeVariant].map((img) => (
                  <div key={img.name} className="text-center">
                    <p className="text-sm text-left mb-2">{img.name}</p>
                    <div className="bg-white opacity-75">
                      <img
                        src={img.src}
                        alt={img.name}
                        className="w-full h-auto border c-border rounded object-contain aspect-square"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Footer />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

Chords.propTypes = {
  imageLink: PropTypes.string,
  chordKey: PropTypes.string,
  onClose: PropTypes.func,
};

export default Chords;
