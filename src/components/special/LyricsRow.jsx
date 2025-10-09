import PropTypes from "prop-types";
import { FaRegHeart } from "react-icons/fa6";
import Normal_Button from "../../components/common/Normal_Button";
import { useState } from "react";
import MessagePopup from "../common/MessagePopup";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BsHeartFill } from "react-icons/bs";
import { useInView } from "react-intersection-observer";
import {
  addLyricsToCollection,
  removeLyricsFromCollection,
} from "../../assets/util/api";
import { useVibration } from "../hooks/useVibration";
// import { TbError404 } from "react-icons/tb";

import { useTranslation } from "react-i18next";
import LyricsDetails from "../../pages/LyricsDetails";
import ModalContainer from "./ModalContainer";

const LyricsRow = ({
  id,
  lyric,
  isLast,
  lastUserRef,
  hideCollection = false,
  access,
  // variable pass to parent if collection status is changed
  onCollectionStatusChange = () => {},
}) => {
  const { t } = useTranslation();

  const { vibrateOnce } = useVibration();
  const [imageError, setImageError] = useState(false);

  const ref = isLast ? lastUserRef : null;
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [isInCollection, setIsInCollection] = useState(lyric.isFavourite);

  const [showLyricDetails, setShowLyricDetails] = useState(false);
  const [selectedLyric, setSelectedLyric] = useState(null);

  // IntersectionObserver hook
  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true, // Trigger only once when it first comes into view
    threshold: 0.5, // 50% of the element should be in view
  });

  const navigate = useNavigate();

  /*const goToLyricsDetails = () => {
    navigate(`/NT_Lyrics/lyricsdetail/${id}`);
  };*/

  const changeLyricsStatus = async (shouldAdd) => {
    const token = localStorage.getItem("token");
    const message = shouldAdd
      ? t("lyricHasBeenAddedToCollection")
      : t("lyricHasBeenRemovedFromCollection");

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
      console.error(err.message);
      setMessageType("error");
      if (err.message === "You can only add 20 collections") {
        setMessageText(t("youCanOnlyAddUpTo20SongsToEachCollection"));
      } else {
        setMessageText(t("somethingWentWrongPleaseTryAgainLater"));
      }
    } finally {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 10000);
    }
  };

  return (
    <>
      {showMessage && (
        <MessagePopup
          message_type={messageType}
          closePopup={() => setShowMessage(false)}
        >
          <div className="message_text text-pretty text-left flex flex-col gap-3">
            <p>
              {messageText.split("\n").map((line, index) => (
                <span key={index}>{line}</span>
              ))}
            </p>
            {(access === 1 ||
              (messageType === "error" &&
                messageText ===
                  t("youCanOnlyAddUpTo20SongsToEachCollection"))) && (
              <button
                className="rotatingBorder w-full c-bg shadow-sm text-sm line-clamp-3 p-2 rounded-md text-left font-medium"
                onClick={() => navigate("/NT_Lyrics/premium")}
              >
                {t("upgraedToGetTheseExclusiveFeaturesAndBenifits")}
              </button>
            )}
          </div>
        </MessagePopup>
      )}
      <motion.div
        className={`relative flex items-center w-full border-b last:border-0 border-dashed c-border py-2 cursor-pointer ${
          access ? "opacity-100" : "opacity-50 text-gray-500"
        } ${imageError && "opacity-50 text-gray-500"}`}
        onClick={
          access
            ? () => {
                setSelectedLyric(id);
                setShowLyricDetails(true);
              }
            : () => {
                setMessageText(t("youHaveToBePremiumUserToAccessThisFeature"));
                setMessageType("error");
                setShowMessage(true);
                setTimeout(() => setShowMessage(false), 10000);
              }
        }
        ref={(node) => {
          // Combine your refs (still valid)
          if (ref) ref(node);
          inViewRef(node);
        }}
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={inView ? { scale: 1, opacity: 1, y: 0 } : false} // <- this is key
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {/* Invisible image just for checking if lyrics is ready */}
        <img
          src={lyric.lyricsPhoto}
          alt="lyrics hidden checker"
          onError={() => setImageError(true)}
          onLoad={() => setImageError(false)}
          className="hidden"
        />
        <div className="flex justify-between items-center w-full p-2">
          <div className={`flex flex-col gap-2 ${imageError && "glitching"}`}>
            <p className="font-semibold text-lg">
              {lyric?.title ?? "Sample Title"}
            </p>
            <p className="text-md text-gray-500 flex items-center gap-1 max-w-64 overflow-hidden text-ellipsis whitespace-nowrap">
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                {lyric.singers.map(
                  (singer, index) =>
                    `${singer.name}${
                      index < lyric.singers.length - 1 ? ", " : ""
                    }`
                )}
              </span>

              {imageError && (
                <span className="border px-1 py-0.5 text-xs rounded-md border-gray-300 bg-gray-100 shrink-0">
                  Coming Soon
                </span>
              )}
            </p>
          </div>

          {access &&
            !hideCollection &&
            (isInCollection ? (
              <Normal_Button
                icon={BsHeartFill}
                text=""
                custom_class={`w-8 h-8 border-transparent shadow-sm bg-red-50 text-red-500 transition-all`}
                onClick={(e) => {
                  e.stopPropagation();
                  vibrateOnce();
                  changeLyricsStatus(false);
                }}
              />
            ) : (
              <Normal_Button
                icon={FaRegHeart}
                text=""
                custom_class={`w-8 h-8 border-transparent shadow-sm bg-white text-black transition-all`}
                onClick={(e) => {
                  e.stopPropagation();
                  vibrateOnce();
                  changeLyricsStatus(true);
                }}
              />
            ))}
          {}
        </div>
      </motion.div>

      {showLyricDetails && (
        <ModalContainer
          isOpen={showLyricDetails}
          onClose={() => setShowLyricDetails(false)}
        >
          <LyricsDetails
            lyricsId={selectedLyric}
            onClose={() => setShowLyricDetails(false)}
            onCollectionStatusChange={(newStatus) => {
              setIsInCollection(newStatus);
              onCollectionStatusChange();
            }}
          />
        </ModalContainer>
      )}
    </>
  );
};

LyricsRow.propTypes = {
  id: PropTypes.string.isRequired,
  lyric: PropTypes.object,
  lastUserRef: PropTypes.object,
  isLast: PropTypes.bool,
  hideCollection: PropTypes.bool,
  onCollectionStatusChange: PropTypes.func,
  access: PropTypes.bool, // Access level for the lyrics
};

export default LyricsRow;
