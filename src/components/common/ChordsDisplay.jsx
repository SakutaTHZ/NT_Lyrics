import { useState, useMemo } from "react";
import { BiMinusCircle, BiPlusCircle } from "react-icons/bi";
// 🚨 FIX 1: Ensure you import the utility for transposing a SINGLE chord
import { transposeChord } from "../../assets/util/transpose";
import PropTypes from "prop-types";

// Assume 'originalChords' is the array of chords returned from your OCR function
const ChordsDisplay = ({ originalChords, error, reading }) => {
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
    <div className="flex justify-center items-center w-full">
      {/* 1. Show Error State */}
      {error && <div className="text-red-500">{error}</div>}

      {/* 2. Show Loading/Reading State (PRIORITY) */}
      {!error && reading && (
        <div className="text-center c-text italic p-4 py-2 lyrics-width">
          Reading chords from image...
        </div>
      )}

      {!error && !reading && chordDataForGrid.length > 0 && (
        <div className="lyrics-width animate-down-start w-full h-full c-bg-2 rounded-lg p-4 md:p-8 border c-border">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-lg font-semibold">Possible Chords</h1>
            <div className="flex items-center gap-2 text-sm c-text opacity-75">
              {/* Minus Button: Decrease transpose (down) */}
              <button
                onClick={() => handleTranspose(-1)}
                aria-label="Transpose down"
                className="hover:opacity-100 transition duration-150"
              >
                <BiMinusCircle size={20} />
              </button>

              {/* Display Transpose Value */}
              <p>
                Transpose (
                {transposeValue > 0 ? `+${transposeValue}` : transposeValue})
              </p>

              {/* Plus Button: Increase transpose (up) */}
              <button
                onClick={() => handleTranspose(1)}
                aria-label="Transpose up"
                className="hover:opacity-100 transition duration-150"
              >
                <BiPlusCircle size={20} />
              </button>
            </div>
          </div>

          {/* 💡 Chords Extracted (List) */}
          <div className="c-announcement-bg c-border rounded-md p-2 mb-2 overflow-x-auto whitespace-nowrap">
            {chordDataForGrid.map((chordItem, index) => (
              <span
                key={index} // Use index as key if original isn't unique enough
                className="text-base font-mono font-medium c-text mr-2"
              >
                {chordItem.original}
              </span>
            ))}
          </div>

          {/* 💡 Grid Display Area */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 c-text-2 p-2">
            {chordDataForGrid.map((chordItem, index) => (
              // Outer div remains the grid item
              <div
                key={index}
                // Add Flexbox here to treat the content as a single row
                className="text-base font-medium whitespace-nowrap flex"
              >
                {/* 1. Original Chord Column (Fixed Width) */}
                <span
                  // Set a fixed width or maximum width for the original chord slot
                  // You may need to adjust 'w-1/2' or 'w-10' based on your font/longest chord
                  className="w-[20px] text-left"
                >
                  {chordItem.original}
                </span>

                {/* 2. Transposed Content Column (Flex to fill/Conditional Display) */}
                {chordItem.isTransposed ? (
                  <span className="flex items-center">
                    {/* Arrow (aligned with the middle of the cell) */}
                    <span className="text-gray-500 mx-1">
                      &nbsp; &rarr; &nbsp; {/* Unicode right arrow */}
                    </span>
                    {/* Transposed Chord (aligned right if necessary) */}
                    <span className="font-semibold text-yellow-600">
                      {chordItem.transposed}
                    </span>
                  </span>
                ) : (
                  // When not transposed, display an empty, fixed-width placeholder
                  // to maintain the layout integrity of the entire grid.
                  <span className="flex items-center">
                    {/* Arrow (aligned with the middle of the cell) */}
                    <span className="text-gray-500 mx-1">
                      &nbsp; &rarr; &nbsp; {/* Unicode right arrow */}
                    </span>
                    {/* Transposed Chord (aligned right if necessary) */}
                    <span className="font-semibold text-yellow-600">
                      {chordItem.transposed}
                    </span>
                  </span>
                )}
              </div>
            ))}
          </div>
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
