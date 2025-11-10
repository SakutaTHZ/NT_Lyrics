import { CgClose } from "react-icons/cg";
import PropTypes from "prop-types";
import { LuBookText } from "react-icons/lu";
import { BiClipboard, BiLoader, BiScan } from "react-icons/bi";
import { useCallback, useState } from "react";

const NotificationToast = ({ message, type, visible, onClose }) => {
  let bgColor = 'bg-blue-500';
  if (type === 'success') bgColor = 'bg-green-500';
  if (type === 'error') bgColor = 'bg-red-500';
  if (type === 'warning') bgColor = 'bg-yellow-500';

  return (
    <div 
      className={`fixed top-4 right-4 p-4 rounded-xl shadow-lg text-white transition-opacity duration-300 z-50 flex items-center space-x-3
        ${bgColor} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'}`}
    >
      <p className="font-medium">{message}</p>
      <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition">
        <CgClose className="w-4 h-4" />
      </button>
    </div>
  );
};

NotificationToast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.string,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};


const LyricsGallery = ({ setShowGallery, setImageError, lyric }) => {
  const [ocrText, setOcrText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ status: 'Ready', progress: 0 });
  const [showTextPanel, setShowTextPanel] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '', visible: false });

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  // Function to copy text to clipboard
  const copyToClipboard = () => {
    if (!ocrText) return;
    const textArea = document.createElement("textarea");
    textArea.value = ocrText;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showNotification("Text copied to clipboard!", 'success'); 
    } catch (err) {
      console.error('Failed to copy text: ', err);
      showNotification("Failed to copy text.", 'error'); 
    }
    document.body.removeChild(textArea);
  };

  // Main OCR function
  const runOcr = useCallback(async () => {
    // 🛑 FIX: Removed the dynamic import which caused resolution issues.
    // Tesseract MUST be loaded globally via a script tag in the main HTML file.
    const Tesseract = window.Tesseract; 

    if (!lyric.lyricsPhoto) {
      showNotification("No image source found for OCR.", 'warning'); 
      return;
    }

    if (!Tesseract) {
        console.error("Tesseract library is not available globally.");
        showNotification("OCR Engine failed to load. Ensure Tesseract.js is loaded.", 'error');
        return;
    }

    // Ensure the text panel is visible when starting OCR
    setShowTextPanel(true);
    setLoading(true);
    setOcrText("Analyzing image...");

    try {
      const result = await Tesseract.recognize(
        lyric.lyricsPhoto, // Use the image URL as the source
        'eng', 
        { 
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setProgress({ 
                status: 'Processing...', 
                progress: Math.round(m.progress * 100) 
              });
            } else {
              setProgress({ status: m.status, progress: m.progress });
            }
          }
        }
      );
      setOcrText(result.data.text);
      setProgress({ status: 'Complete', progress: 100 });
      showNotification("OCR complete!", 'success');

    } catch (error) {
      console.error("OCR Error:", error);
      setOcrText("Error performing OCR. Check console for details.");
      setProgress({ status: 'Error', progress: 0 });
      showNotification("An error occurred during OCR.", 'error');
    } finally {
      setLoading(false);
    }
  }, [lyric.lyricsPhoto]);

  return (
    <div className="animate-appear fixed inset-0 bg-[#00000090] backdrop-blur-md bg-opacity-50 flex items-center justify-center z-[10000] p-2">
      <NotificationToast 
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
        onClose={() => setNotification(prev => ({ ...prev, visible: false }))}
      />

      {/* Close Button */}
      <button
        className="absolute flex justify-center items-center top-2 right-2 text-white bg-[#ffffff20] rounded-full p-2 hover:bg-red-600 transition-all"
        onClick={() => setShowGallery(false)}
      >
        {/* 🛑 FIX: Using 'X' icon from lucide-react */}
        <CgClose size={24} />
      </button>

      {/* OCR Button (top left) */}
      <button
        className={`absolute flex justify-center items-center top-2 left-2 rounded-full p-2 transition-all shadow-lg 
            ${loading ? 'bg-blue-400 text-white cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        onClick={runOcr}
        disabled={loading}
        title={loading ? "OCR in progress" : "Run OCR on Lyrics Image"}
      >
        {loading ? <BiLoader size={24} className="animate-spin" /> : <BiScan size={24} />}
      </button>

      {/* Main Image View Area */}
      <div className="flex flex-col h-full w-full max-w-5xl justify-center items-center">
        <div className={`relative flex justify-center items-center max-h-full transition-all duration-500 
            ${showTextPanel ? 'md:h-2/3 h-1/2' : 'h-full'}`}>
          <img
            src={lyric.lyricsPhoto}
            alt="Lyrics"
            onError={() => setImageError(true)}
            onContextMenu={(e) => e.preventDefault()}
            draggable={false}
            loading="lazy"
            style={{ pointerEvents: "none", userSelect: "none" }}
            className="w-auto max-h-full object-contain animate-down rounded-lg shadow-2xl"
          />
        </div>

        {/* Extracted Text Panel (Slides up from the bottom) */}
        <div 
          className={`w-full bg-white rounded-t-xl shadow-2xl transition-all duration-500 overflow-hidden 
            ${showTextPanel ? 'md:h-1/3 h-1/2 p-4' : 'h-0 p-0'}`}
        >
          <div className="flex flex-col h-full space-y-2">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                <LuBookText className="w-5 h-5" />
                <span>Extracted Text</span>
              </h3>
              <div className='flex items-center space-x-2'>
                  <button
                      onClick={copyToClipboard}
                      disabled={!ocrText || loading}
                      className="p-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 disabled:opacity-50 transition shadow-sm"
                      title="Copy Text"
                  >
                      <BiClipboard className="w-5 h-5" />
                  </button>
                  <button
                      onClick={() => setShowTextPanel(false)}
                      className="p-2 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 transition shadow-sm"
                      title="Close Text Panel"
                  >
                      <CgClose className="w-5 h-5" />
                  </button>
              </div>
            </div>
            
            {/* Progress Bar */}
            {loading && (
                <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-600 flex justify-between">
                        <span>{progress.status}</span>
                        <span>{progress.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progress.progress}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {/* Text Output */}
            <textarea
              readOnly
              value={ocrText}
              placeholder="Click 'Run OCR' (top left icon) to extract text from the image..."
              className="w-full flex-grow p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none text-sm leading-relaxed"
            />
          </div>
        </div>

        {/* Button to toggle the text panel if text is already present */}
        {ocrText && !showTextPanel && (
             <button
                className="absolute bottom-4 z-10 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition flex items-center space-x-2"
                onClick={() => setShowTextPanel(true)}
            >
                <LuBookText size={20} />
                <span>View Extracted Text</span>
            </button>
        )}
        
      </div>
    </div>
  );
};

LyricsGallery.propTypes = {
  setShowGallery: PropTypes.func.isRequired,
  setImageError: PropTypes.func.isRequired,
  lyric: PropTypes.shape({
    lyricsPhoto: PropTypes.string.isRequired,
  }).isRequired,
};

export default LyricsGallery;
