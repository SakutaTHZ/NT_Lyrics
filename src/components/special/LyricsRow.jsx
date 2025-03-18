import sampleImage from "../../assets/images/Lyrics_sample.png";
import PropTypes from "prop-types";
import { FaRegHeart } from "react-icons/fa6";
import Normal_Button from "../../components/common/Normal_Button"; // Adjust the path as necessary
import { useState, useEffect } from "react";
import { CgRemove } from "react-icons/cg";
import MessagePopup from "../common/MessagePopup";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const LyricsRow = ({ id, lyric }) => {
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [isInCollection, setIsInCollection] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const checkIfInCollection = () => {
    // Check if the lyrics is in User's Collection
    return setIsInCollection(false);
  };

  useEffect(() => {
    checkIfInCollection();
  }, []);

  const navigate = useNavigate();

  const goToLyricsDetails = () => {
    console.log("Go to Lyrics Details");
    // Pass the id dynamically in the URL
    navigate(`/NT_Lyrics/lyricsdetail/${id}`);
  };

  const changeLyricsStatus = () => {
    if (isInCollection) {
      setMessageText("Lyrics has been removed from the collection");
    } else {
      setMessageText("Lyrics has been added to the collection");
    }

    setIsInCollection(!isInCollection);
    setShowMessage(true);

    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  };

  return (
    <>
      {showMessage && (
        <MessagePopup message_type={"success"} message_text={messageText} />
      )}
      <motion.div
        className="relative flex items-center w-full border-b last:border-0  border-dashed border-gray-200"
        onClick={goToLyricsDetails}
        ref={ref}
        initial={{ scale: 0, opacity: 0, x: 0 }}
        animate={inView ? { scale: 1, opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4 }}
      >
        <img src={sampleImage} className="w-12 h-12 object-contain" />
        <div className="flex justify-between items-center w-full p-2 pl-4">
          <div className="flex flex-col gap-2">
            <p className="font-semibold">{lyric?.title ?? "Sample Title"}</p>
            <p className="text-sm text-gray-500">
              {lyric?.artist?.join(", ") ?? "Sample Artist"}
            </p>
          </div>

          {isInCollection ? (
            <Normal_Button
              icon={CgRemove}
              text=""
              custom_class={`w-8 h-8 border-transparent shadow-sm bg-red-50 text-red-500`}
              onClick={(e) => {
                e.stopPropagation();
                changeLyricsStatus();
              }}
            />
          ) : (
            <Normal_Button
              icon={FaRegHeart}
              text=""
              custom_class={`w-8 h-8 border-transparent shadow-sm bg-white`}
              onClick={(e) => {
                e.stopPropagation();
                changeLyricsStatus();
              }}
            />
          )}
        </div>
      </motion.div>
    </>
  );
};
LyricsRow.propTypes = {
  id: PropTypes.string.isRequired,
  lyric: PropTypes.object,
};

export default LyricsRow;
