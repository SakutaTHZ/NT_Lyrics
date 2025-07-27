import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import MessagePopup from "../common/MessagePopup";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BsHeartFill, BsThreeDotsVertical } from "react-icons/bs";
import { useInView } from "react-intersection-observer";
import {
  addLyricsToCollection,
  removeLyricsFromCollection,
} from "../../assets/util/api"; // Assuming you're using PrimeReact for Dialog
import AddToCollectionBox from "./AddToCollectionBox";

const LyricRowPremium = ({
  id,
  lyric,
  isLast,
  lastUserRef,
  hideCollection = false,
}) => {
  const ref = isLast ? lastUserRef : null;
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [isInCollection, setIsInCollection] = useState(lyric.isFavourite);

  const [addToCollection, setAddToCollection] = useState(false);

  // IntersectionObserver hook
  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true, // Trigger only once when it first comes into view
    threshold: 0.5, // 50% of the element should be in view
  });

  const navigate = useNavigate();

  const goToLyricsDetails = () => {
    // Pass the id dynamically in the URL
    navigate(`/NT_Lyrics/lyricsdetail/${id}`);
  };

  // eslint-disable-next-line no-unused-vars
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

      return res;
    } catch (err) {
      console.error("Error changing lyrics status:", err);
      setMessageText("Failed to change lyrics status");
    } finally {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
    }
  };

  const bustedImageUrl = useMemo(() => {
    return `${lyric.lyricsPhoto}?v=${Date.now()}`;
  }, [lyric.lyricsPhoto]);

  const [imageError, setImageError] = useState(false);

  return (
    <>
      {showMessage && (
        <MessagePopup message_type={messageType} message_text={messageText} />
      )}
      <motion.div
        className="relative flex items-center w-full border-b last:border-0 border-dashed border-gray-200 py-2"
        onClick={goToLyricsDetails}
        ref={(node) => {
          // Combine your refs (still valid)
          if (ref) ref(node);
          inViewRef(node);
        }}
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={inView ? { scale: 1, opacity: 1, y: 0 } : false} // <- this is key
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="relative flex items-center justify-center">
          <img
            src={bustedImageUrl}
            alt="lyrics hidden checker"
            onError={() => setImageError(true)}
            onLoad={() => setImageError(false)}
            className="hidden"
          />
        </div>
        <div className="flex justify-between items-center w-full p-2 pl-4">
          <div className="relative flex flex-col gap-2">
            <p className="font-semibold">
              {isInCollection && (
                <BsHeartFill
                  size={16}
                  className="text-red-500 inline mr-2"
                />
              )}
              {lyric?.title ?? "Sample Title"}{" "}
            </p>
            <p className="text-sm text-gray-500">
              {lyric.singers.map((singer, index) => (
                <span key={index}>
                  {singer.name}
                  {index < lyric.singers.length - 1 ? ", " : ""}
                </span>
              ))}

              {imageError && (
                <span className="border ml-2 px-1 py-0.5 text-xs rounded-md border-gray-300 bg-gray-100">
                  Coming Soon
                </span>
              )}
            </p>
          </div>

          {!hideCollection && (
            <>
              <button>
                <BsThreeDotsVertical
                  custom_class={`w-8 h-8 border-transparent shadow-sm bg-red-50 text-red-500 transition-all`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setAddToCollection(true);
                  }}
                />
              </button>
            </>
          )}
        </div>

        {addToCollection && (
          <AddToCollectionBox
            id={id}
            addToCollection={addToCollection}
            close={() => setAddToCollection(false)}
          />
        )}
      </motion.div>
    </>
  );
};

LyricRowPremium.propTypes = {
  id: PropTypes.string.isRequired,
  lyric: PropTypes.object,
  lastUserRef: PropTypes.object,
  isLast: PropTypes.bool,
  hideCollection: PropTypes.bool,
};

export default LyricRowPremium;
