import sampleImage from "../../assets/images/Lyrics_sample.png";
import PropTypes from 'prop-types';
import { FaEye, FaRegHeart } from "react-icons/fa6";
import Normal_Button from "../../components/common/Normal_Button"; // Adjust the path as necessary
import { useState, useEffect } from "react";
import { CgRemove } from "react-icons/cg";
import MessagePopup from "../common/MessagePopup";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const LyricsCard = ({ id,lyric ,isLast, lastUserRef }) => {
  const ref = isLast ? lastUserRef : null;
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [isInCollection, setIsInCollection] = useState(false);

  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true, // Trigger only once when it first comes into view
    threshold: 0.5, // 50% of the element should be in view
  });

  const checkIfInCollection = () => {
    // Check if the lyrics is in User's Collection
    return setIsInCollection(false);
  };

  useEffect(() => {
    checkIfInCollection();
  }, []);

  const navigate = useNavigate();

  const goToLyricsDetails = () => {
    // Pass the id dynamically in the URL
    navigate(`/NT_Lyrics/lyricsdetail/${id}`);
  }

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
        ref={(node) => {
          // Combine refs for IntersectionObserver and lastUserRef
          if (ref) ref(node);
          inViewRef(node);
        }}
        initial={{ scale: 0, opacity: 0, x: 0 }}
        animate={inView ? { scale: 1, opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4 }}
      >
      <div className="relative card w-full min-h-32 aspect-[4/5] rounded-md shadow-md overflow-hidden" onClick={goToLyricsDetails}>
        <img src={sampleImage} className="w-full" />
        <div className="gradient-overlay w-full h-full absolute bottom-0"></div>
        <div className="flex justify-between w-full absolute bottom-0 p-2 px-4">
          <div className="flex items-center gap-1 font-semibold">
            <FaEye size={16} className="translate-y-[1px]" />{" "}
            <span className="viewCount">{lyric?.view_count ?? "1"}</span>
          </div>

          {isInCollection ? (
            <Normal_Button
              icon={CgRemove}
              text="Remove from Collection"
              custom_class={`py-1 px-3 border-transparent shadow-sm bg-red-50 text-red-500`}
              onClick={changeLyricsStatus}
            />
          ) : (
            <Normal_Button
              icon={FaRegHeart}
              text="Add to collection"
              custom_class={`py-1 px-3 border-transparent shadow-sm bg-white`}
              onClick={changeLyricsStatus}
            />
          )}
        </div>
      </div></motion.div>
    </>
  );
};
LyricsCard.propTypes = {
  id: PropTypes.string.isRequired,
  lyric: PropTypes.object,
    lastUserRef: PropTypes.object,
    isLast: PropTypes.bool,
};

export default LyricsCard;