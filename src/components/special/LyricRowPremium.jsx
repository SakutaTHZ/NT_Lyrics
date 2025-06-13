import PropTypes from "prop-types";
import { useState } from "react";
import MessagePopup from "../common/MessagePopup";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BsHeartFill, BsThreeDotsVertical } from "react-icons/bs";
import { useInView } from "react-intersection-observer";
import {
  addLyricsToCollection,
  removeLyricsFromCollection,
} from "../../assets/util/api";
import { Dialog } from "primereact/dialog"; // Assuming you're using PrimeReact for Dialog

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
          <img src={lyric.lyricsPhoto} className="w-12 h-12 object-contain" />
          {isInCollection && (
            <BsHeartFill
              size={10}
              className="text-red-500 inline -translate-y-2 absolute left-0 top-0 translate-x-1/2 -rotate-45"
            />
          )}
        </div>
        <div className="flex justify-between items-center w-full p-2 pl-4">
          <div className="flex flex-col gap-2">
            <p className="font-semibold">{lyric?.title ?? "Sample Title"}</p>
            <p className="text-sm text-gray-500">
              {lyric.singers.map((singer, index) => (
                <span key={index}>
                  {singer.name}
                  {index < lyric.singers.length - 1 ? ", " : ""}
                </span>
              ))}
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

        <Dialog
        header="Add to Collection"
          visible={addToCollection}
          style={{ width: "90vw", maxWidth: "400px" }}
          onHide={() => {
            if (!addToCollection) return;
            setAddToCollection(false);
          }}
          position="bottom"
          onClick={(e) => {
            e.stopPropagation();
          }}
          pt={{
            header: {
              className: "customHeader h-fit border-none flex items-center", // Small padding, short height, no border
            },
            content: {
              className: "customContent p-4",
            },
          }}
        >
          <p className="m-0">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </Dialog>
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
