// utils/ocrChords.js
import Tesseract from "tesseract.js";

/**
 * Reads chords from an image URL using Tesseract OCR.
 * Applies optional handwriting cleanup for faint or broken letters.
 * @param {string} imageUrl - The URL of the image.
 * @returns {Promise<string[]>} - Sorted and deduplicated chord list.
 */
export const extractChordsFromImage = async (imageUrl) => {
  const preprocessImage = async (src) =>
    new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = src;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const width = canvas.width;
        const height = canvas.height;
        const copy = new Uint8ClampedArray(data);

        // Step 1: Grayscale + contrast + threshold
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          const contrast = Math.min(255, Math.max(0, (avg - 110) * 1.5 + 128));
          const bw = contrast > 140 ? 255 : 0;
          data[i] = data[i + 1] = data[i + 2] = bw;
        }

        // Step 2: Simple 1px dilation to fill faint letters
        for (let y = 1; y < height - 1; y++) {
          for (let x = 1; x < width - 1; x++) {
            const idx = (y * width + x) * 4;
            if (
              copy[idx] === 0 ||
              copy[idx - 4] === 0 ||
              copy[idx + 4] === 0 ||
              copy[idx - width * 4] === 0 ||
              copy[idx + width * 4] === 0
            ) {
              data[idx] = data[idx + 1] = data[idx + 2] = 0;
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL());
      };
    });

  const processedImage = await preprocessImage(imageUrl);

  const result = await Tesseract.recognize(processedImage, "eng", {
    tessedit_char_whitelist: "ABCDEFGabcdefg#bmijsu0123456789/()",
  });

  const raw = result.data.text.toUpperCase();

  const roughMatches = raw.match(
    /[A-G](#|B)?(M|MAJ|MIN|SUS|DIM|AUG|ADD|M7|7|9|11|13)?/g
  ) || [];

  const allowedTypes = new Set([
    "",
    "M",
    "MIN",
    "MAJ",
    "SUS",
    "DIM",
    "AUG",
    "ADD",
    "7",
    "9",
    "11",
    "13",
    "M7",
  ]);

  const validChords = roughMatches
    .map((c) => c.trim())
    .filter((c) => {
      if (c.length > 7) return false;
      const match = c.match(/^([A-G](#|B)?)(.*)$/);
      if (!match) return false;
      const type = match[3].toUpperCase();
      return allowedTypes.has(type);
    })
    .map((c) => {
      const first = c[0].toUpperCase();
      const rest = c.slice(1).toLowerCase();
      return first + rest;
    });

  return [...new Set(validChords)].sort();
};
