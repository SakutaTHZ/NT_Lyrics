import Footer from "../components/common/Footer";
import { BiArrowBack } from "react-icons/bi";
import { useState, useMemo, useEffect } from "react";
import { getChordData } from "../assets/js/chordLoader";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import ChordsDisplay from "../components/common/ChordsDisplay";
import { extractChordsFromImage } from "../assets/util/ocrChords";
import { Link } from "react-router-dom";
//import { Dropdown } from "primereact/dropdown";

const Chords = ({ imageLink, chordKey, onClose, isPremium }) => {
  const { t } = useTranslation();

  // Ensure chord data always defaults to an object
  const chords = useMemo(() => getChordData() || {}, []);

  const [reading, setReading] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState(null);

  const handleReadImage = async (link) => {
    setReading(true);
    setError(null);
    setText("");

    try {
      const chordsFromImage = await extractChordsFromImage(link);
      setText(
        chordsFromImage.length
          ? chordsFromImage.join(" ")
          : "No valid chords detected."
      );
    } catch (err) {
      console.error(err);
      setError("Failed to read chords from image.");
    } finally {
      setReading(false);
    }
  };

  useEffect(() => {
    if (imageLink) handleReadImage(imageLink);
  }, [imageLink]);

  const [isVisible, setIsVisible] = useState(true);

  const chordNames = Object.keys(chords);
  const initialChord = chordNames.includes(chordKey)
    ? chordKey
    : chordNames[0] || null;

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

  // ✅ Automatically select the first variant when none is active
  useEffect(() => {
    const keys = Object.keys(groupedVariants || {});
    if (!activeVariant && keys.length > 0) {
      setActiveVariant(keys[0]);
    }
  }, [groupedVariants, activeVariant]);

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
          className="w-screen h-screen absolute inset-0 z-20 c-bg overflow-hidden overflow-y-auto px-4 md:pt-12 md:px-24"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between py-4">
            <h1 className="text-lg font-semibold">{t("chordsList")}</h1>
            <button onClick={handleClose} className="text-blue-500">
              <BiArrowBack size={20} />
            </button>
          </div>

          {isPremium ? (
            <ChordsDisplay
              originalChords={text.split(" ")} // pass chords as an array
              error={error}
              reading={reading}
            />
          ) : (
            <button className="bg-amber-200 text-black px-5 py-1 rounded-lg w-full text-left space-y-1">
              <p>{t("chordReadingAvailableForPremiumUsers")}</p>
              <Link
                to="/NT_Lyrics/premium"
                className="text-blue-700 animate-pulse"
              >
                Learn more ...
              </Link>
            </button>
          )}

          <div className="py-4 pb-20">
            {/* Top row of chord buttons (C, Db, D...) */}
            <h1 className="text-lg font-semibold">Chords</h1>
            <div className="relative flex gap-2 w-full py-2 overflow-y-scroll">
              {Object.keys(chords).map((chord) => (
                <button
                  key={chord}
                  onClick={() => {
                    setActiveChord(chord);
                    setActiveVariant(null); // reset sub-variant
                  }}
                  className={`px-5 py-2 rounded-full border c-border ${
                    activeChord === chord
                      ? "bg-blue-500 text-white"
                      : "border-dashed"
                  }`}
                >
                  {chord}
                </button>
              ))}
            </div>

            {/* Sub-buttons for chord variants (C, Cm, Cm7, etc.) */}
            <div className="border c-border rounded-md p-4 space-y-2">
              <h1 className="font-semibold pb-2 border-b mb-2 c-border border-dashed">
                Chord Variants for{" "}
                <span className="text-lg text-blue-500 italic">
                  {activeChord}
                </span>
              </h1>

              <div className="flex gap-4 mt-4">
                <div className="grid gap-2">
                  {Object.keys(groupedVariants).map((chord) => (
                    <button
                      key={chord}
                      onClick={() => {
                        setActiveVariant(chord)
                      }}
                      className={`p-2 w-20 rounded-full border c-border ${
                        activeVariant === chord
                          ? "bg-blue-500 text-white"
                          : "border-dashed"
                      }`}
                    >
                      {chord}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  {/*<div className="rounded-md text-sm flex items-center gap-3 c-dd">
                    {Object.keys(groupedVariants || {}).length > 0 ? (
                      <Dropdown
                        value={activeVariant}
                        options={Object.keys(groupedVariants).map(
                          (variant) => ({
                            label: variant,
                            value: variant,
                          })
                        )}
                        onChange={(e) => setActiveVariant(e.value)}
                        placeholder="Select a variant"
                        className="w-full capitalize-first-letter c-bg c-border border-0"
                        panelClassName="text-sm"
                        appendTo="self"
                      />
                    ) : (
                      <p className="text-gray-400 text-sm">
                        No variants available for this chord.
                      </p>
                    )}
                  </div>*/}

                  {/* Display chord images */}
                  {activeVariant && groupedVariants[activeVariant] && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 py-0">
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
              </div>
            </div>
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
  isPremium: PropTypes.bool,
};

export default Chords;
