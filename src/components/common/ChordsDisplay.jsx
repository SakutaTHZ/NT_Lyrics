import { useState, useMemo } from "react";
import { BiMinusCircle, BiPlusCircle } from "react-icons/bi";
// 🚨 FIX 1: Ensure you import the utility for transposing a SINGLE chord
import { transposeChord } from "../../assets/util/transpose";
import PropTypes from "prop-types";
import { CgChevronLeft } from "react-icons/cg";
import { motion, AnimatePresence } from "framer-motion";

// Assume 'originalChords' is the array of chords returned from your OCR function
const ChordsDisplay = ({ originalChords, error, reading }) => {
  const [minimize, setMinimize] = useState(true);

  const [transposeValue, setTransposeValue] = useState(0);

  const handleTranspose = (amount) => {
    // Keep transpose value within +/- 11 semitones (full octave)
    setTransposeValue((prev) => (prev + amount + 12) % 12);
  };

  // 💡 Prepare data for the grid display
  const chordDataForGrid = useMemo(() => {
    // Ensure originalChords is a valid array
    if (!originalChords || originalChords.length === 0) return [];

    return originalChords.map((original) => {
      // 🚨 FIX 2: Use transposeChord (singular) for a single string 'original'
      const transposed = transposeChord(original, transposeValue);

      return {
        original: original,
        transposed: transposed,
        // Only show the arrow if transposition is active
        isTransposed: transposeValue !== 0,
      };
    });
  }, [originalChords, transposeValue]);

  return (
    <div className="flex justify-center items-center w-full transition-all">
      {/* 1. Show Error State */}
      {error && <div className="text-red-500">{error}</div>}

      {/* 2. Show Loading/Reading State (PRIORITY) */}
      {!error && reading && (
        <div className="text-center c-text italic p-4 py-2 lyrics-width border c-border">
          <span
            className={`text-xs font-normal px-2 rounded-full c-premium-bg text-gray-600`}
          >
            Beta
          </span>{" "}
          Reading chords from image...
        </div>
      )}

      {!error && !reading && chordDataForGrid.length > 0 && (
        <div
          className={`lyrics-width animate-down-start w-full h-full c-bg-2 rounded-lg ${
            minimize ? "p-2" : "p-4 md:p-8"
          } border c-border`}
        >
          <div
            className={`flex justify-between items-center ${
              !minimize && "mb-2"
            }`}
          >
            <div className="flex items-center gap-2">
              {minimize ? (
                <h1 className="text-lg font-semibold">
                  Tranpose{" "}
                  <span
                    className={` text-xs font-normal px-2 rounded-full c-premium-bg text-gray-600`}
                  >
                    Beta
                  </span>
                </h1>
              ) : (
                <div className="flex items-center gap-2 text-sm c-text">
                  {/* Minus Button: Decrease transpose (down) */}
                  <button
                    onClick={() => handleTranspose(-1)}
                    aria-label="Transpose down"
                    className="hover:opacity-100 transition duration-150"
                  >
                    <BiMinusCircle size={20} />
                  </button>

                  {/* Display Transpose Value */}
                  <p className="text-lg font-semibold">
                    Transpose (
                    {transposeValue > 0 ? `+${transposeValue}` : transposeValue}
                    )
                  </p>

                  {/* Plus Button: Increase transpose (up) */}
                  <button
                    onClick={() => handleTranspose(1)}
                    aria-label="Transpose up"
                    className="hover:opacity-100 transition duration-150"
                  >
                    <BiPlusCircle size={20} />
                  </button>

                  <span
                    className={` text-xs font-normal px-2 rounded-full c-premium-bg text-gray-600`}
                  >
                    Beta
                  </span>
                </div>
              )}
            </div>

            <CgChevronLeft
              size={20}
              onClick={() => setMinimize(!minimize)}
              className={`${
                minimize ? "-rotate-90" : "rotate-90"
              } transition-all`}
            />
          </div>

          <AnimatePresence initial={false}>
            {!minimize && (
              <motion.div
                key="expanded"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="c-announcement-bg c-border rounded-md p-2 mb-2 overflow-x-auto whitespace-nowrap border">
                  {chordDataForGrid.map((chordItem, index) => (
                    <span
                      key={index}
                      className="text-base font-mono font-medium c-text mr-2 "
                    >
                      {chordItem.original}
                    </span>
                  ))}
                </div>

                {/* 🎵 Animated transpose grid */}
                <AnimatePresence mode="wait">
                  {Number(transposeValue) !== 0 && (
                    <motion.div
                      key="transposed-grid"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 c-text-2 p-2"
                    >
                      {chordDataForGrid.map((chordItem, index) => (
                        <div
                          key={index}
                          className="text-base font-medium whitespace-nowrap flex"
                        >
                          <span className="w-[20px] text-left">
                            {chordItem.original}
                          </span>
                          {chordItem.isTransposed && (
                            <span className="flex items-center">
                              <span className="text-gray-500 mx-1">&rarr;</span>

                              <AnimatePresence mode="wait">
                                <motion.span
                                  key={chordItem.transposed} // 👈 triggers re-animation when transposed value changes
                                  initial={{ opacity: 0, x: -5, skewX: -10 }}
                                  animate={{ opacity: 1, x: 0, skewX: 0 }}
                                  exit={{ opacity: 0, x: 5, skewX: 10 }}
                                  transition={{ duration: 0.15 }}
                                  className="font-semibold text-yellow-600 relative glitch-text"
                                >
                                  {chordItem.transposed}
                                </motion.span>
                              </AnimatePresence>
                            </span>
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 4. Show Empty Result State (Only if NOT reading and no chords) */}
      {!error && !reading && chordDataForGrid.length === 0 && (
        <div className="text-center c-text italic p-4 lyrics-width">
          No chords found.
        </div>
      )}
    </div>
  );
};

ChordsDisplay.propTypes = {
  originalChords: PropTypes.arrayOf(PropTypes.string),
  error: PropTypes.string,
  reading: PropTypes.bool,
};

export default ChordsDisplay;
