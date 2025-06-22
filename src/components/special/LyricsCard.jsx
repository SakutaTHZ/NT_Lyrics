import PropTypes from "prop-types";
import { FaEye, FaRegHeart } from "react-icons/fa6";
import Normal_Button from "../../components/common/Normal_Button"; // Adjust the path as necessary
import { useState } from "react";
import { BsHeartFill } from "react-icons/bs";
import MessagePopup from "../common/MessagePopup";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  addLyricsToCollection,
  removeLyricsFromCollection,
} from "../../assets/util/api";

const LyricsCard = ({
  id,
  lyric,
  isLast,
  lastUserRef,
  hideCollection = false,
  // variable pass to parent if collection status is changed
  onCollectionStatusChange = () => {},
}) => {
  const ref = isLast ? lastUserRef : null;
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [isInCollection, setIsInCollection] = useState(lyric.isFavourite);

  // IntersectionObserver hook
  const { ref: inViewRef} = useInView({
    triggerOnce: true, // Trigger only once when it first comes into view
    threshold: 0.5, // 50% of the element should be in view
  });

  const navigate = useNavigate();

  const goToLyricsDetails = () => {
    // Pass the id dynamically in the URL
    navigate(`/NT_Lyrics/lyricsdetail/${id}`);
  };

  const changeLyricsStatus = async (shouldAdd) => {
    const token = localStorage.getItem("token");
    const message = shouldAdd
      ? "Lyrics has been added to the collection"
      : "Lyrics has been removed from the collection";

    try {
      let res = null;
      if (shouldAdd) {
        // Add lyrics to collection
        res = await addLyricsToCollection(id, token);
        setMessageType("success");
      } else {
        // Remove lyrics from collection
        res = await removeLyricsFromCollection(id, "Default", token);
        setMessageType("error");
      }

      setIsInCollection(shouldAdd);
      setMessageText(message);
      onCollectionStatusChange(); // Notify parent about the change

      return res;
    } catch (err) {
      console.log(err.message);
      setMessageType('error')
      setMessageText(err.message + "\nTry Premium for more features.");
    } finally {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 4000);
    }
  };

  return (
    <>
      {showMessage && (
        <MessagePopup message_type={messageType} message_text={messageText} />
      )}
      <motion.div
        className="relative cursor-pointer flex items-center w-full border-b last:border-0  border-dashed border-gray-50 hover:border-blue-300 hover:border-2 transition-all rounded-md"
        onClick={goToLyricsDetails}
        ref={(node) => {
          // Combine refs for IntersectionObserver and lastUserRef
          if (ref) ref(node);
          inViewRef(node);
        }}
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
        viewport={{ once: true }}
      >
        <div
          className="relative card w-full min-h-32 aspect-[4/5] rounded-md shadow-md overflow-hidden"
          onClick={goToLyricsDetails}
        >
          <div className="flex items-center gap-1 font-semibold absolute top-0 left-0 bg-white rounded-br-2xl p-3 py-1 shadow-md text-gray-800">
            <FaEye size={16} className="translate-y-[1px]" />{" "}
            <span className="viewCount">{lyric?.viewCount ?? "1"}</span>
          </div>
          <img src={lyric.lyricsPhoto} className="w-full" />
          <div className="gradient-overlay w-full h-full absolute bottom-0"></div>
          <div className="flex justify-between w-full absolute bottom-0 p-2 px-4">
            {!hideCollection &&
              (isInCollection ? (
                <Normal_Button
                  icon={BsHeartFill}
                  text="Remove From Collection"
                  custom_class={`w-full h-8 border-transparent shadow-md bg-red-50 text-red-500 transition-all`}
                  onClick={(e) => {
                    e.stopPropagation();
                    changeLyricsStatus(false);
                  }}
                />
              ) : (
                <Normal_Button
                  icon={FaRegHeart}
                  text="Add To Collection"
                  custom_class={`w-full h-8 border-transparent shadow-md bg-white transition-all`}
                  onClick={(e) => {
                    e.stopPropagation();
                    changeLyricsStatus(true);
                  }}
                />
              ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};
LyricsCard.propTypes = {
  id: PropTypes.string.isRequired,
  lyric: PropTypes.object,
  lastUserRef: PropTypes.object,
  isLast: PropTypes.bool,
  hideCollection: PropTypes.bool,
  onCollectionStatusChange: PropTypes.func,
};

export default LyricsCard;
