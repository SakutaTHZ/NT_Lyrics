import "react-medium-image-zoom/dist/styles.css";
import Normal_Button from "../components/common/Normal_Button";
import { CgMaximize, CgRemove } from "react-icons/cg";
import { FaRegHeart, FaEye } from "react-icons/fa6";
//import { LuLogIn } from "react-icons/lu";
import MessagePopup from "../components/common/MessagePopup";
import { useEffect, useState } from "react";
import { BiArrowBack, BiMusic } from "react-icons/bi";
import googleLogo from "../assets/images/svgs/google.svg";
//import { fetchLyricById } from "../assets/util/api";
import charcoal from "../assets/images/charcoal.jpg";
import {
  addLyricsToCollection,
  fetchLyricById,
  removeLyricsFromCollection,
  siteUrl,
} from "../assets/util/api";

import { useTranslation } from "react-i18next";
import AddToCollectionBox from "../components/special/AddToCollectionBox";
import Artist from "./Artist";
import PropTypes from "prop-types";
import ModalContainer from "../components/special/ModalContainer";
import { motion, AnimatePresence } from "framer-motion";
import Chords from "./Chords";
import Metronome from "../components/common/Metronome";
import ImageGallery from "../components/common/ImageGallery";
import { useAuth } from "../components/hooks/authContext";
import { Navigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const LyricsDetails = ({
  access,
  lyricsId,
  lyricData,
  isInCollection,
  onClose,
  onCollectionStatusChange,
}) => {
  const { t } = useTranslation();

  const { user, token, isLoading } = useAuth();

  const [isVisible, setIsVisible] = useState(true);

  const [showChords, setShowChords] = useState(false);

  const [lyric, setLyric] = useState(lyricData);

  const isPremiumUser = user?.role === "premium-user";

  // Fetch lyric details if not provided via props
  useEffect(() => {
    const getLyric = async () => {
      try {
        const { lyrics } = await fetchLyricById(lyricsId, token);
        setLyric(lyrics);
      } catch (err) {
        console.error("Error fetching lyric:", err);
      }
    };

    getLyric();
  }, [lyricsId, token]);

  const getEmbedUrl = (url) => {
    if (!url) return "";
    const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
  };

  const handleClose = () => {
    onCollectionStatusChange && onCollectionStatusChange(isInCollection);
    setIsVisible(false);
    // after animation duration, call the parent onClose
    setTimeout(() => {
      onClose();
    }, 300); // match your transition duration
  };

  const [imageError, setImageError] = useState(false);

  const [showGallery, setShowGallery] = useState(false);

  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState("success");

  const id = lyricsId;

  const [isInCollectionNow, setIsInCollection] = useState(isInCollection);

  const [addToCollection, setAddToCollection] = useState(false);

  const [showArtistDetails, setShowArtistDetails] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);

  useEffect(() => {
    if (showChords || showArtistDetails || addToCollection) {
      const iframe = document.getElementById("lyrics-player");
      if (iframe) {
        const src = iframe.src;
        iframe.src = src; // stops video by resetting
      }
    }
  }, [showChords, showArtistDetails, addToCollection]);

  useEffect(() => {
    if (showGallery) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showGallery]);

  if (!lyric) {
    return (
      <div className="w-screen h-screen fixed z-[100000] bg-[#00000040] backdrop-blur-xs flex items-center justify-center gap-3 text-white">
        <AiOutlineLoading3Quarters className="animate-spin" size={20} />
      </div>
    );
  }

  const genreTagClass =
    "text-xs border border-dashed c-border c-text px-2 py-1 rounded-full  ";

  const changeLyricsStatus = async (shouldAdd) => {
    if (!token) {
      setMessageText("Please login to add to collection");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
      return;
    }

    const successMessage = shouldAdd
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
      if (onCollectionStatusChange) onCollectionStatusChange(shouldAdd);
      setMessageText(successMessage);

      return res;
    } catch (err) {
      console.error("Error changing lyrics status:", err);
      setMessageType("error");
      if (err.message === "You can only add 20 collections") {
        setMessageText(t("youCanOnlyAddUpTo20SongsToEachCollection"));
      } else {
        setMessageText(t("somethingWentWrongPleaseTryAgainLater"));
      }
    } finally {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 5000);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && !isLoading && (
          <motion.div
            className="w-screen h-screen absolute inset-0 z-20 c-bg overflow-hidden overflow-y-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
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
                      onClick={() => Navigate("/NT_Lyrics/premium")}
                    >
                      {t("upgraedToGetTheseExclusiveFeaturesAndBenifits")}
                    </button>
                  )}
                </div>
              </MessagePopup>
            )}

            {showGallery && (
              <ImageGallery
                lyric={lyric.lyricsPhoto}
                setShowGallery={setShowGallery}
                setImageError={setImageError}
              />
            )}

            <div className="lyrics-wrapper pb-24">
              <div className="flex items-end w-full md:w-122 lyrics-width md:hidden">
                <p className="w-full font-medium"></p>
                <button
                  className="flex cursor-pointer text-right items-end  p-1 c-bg hover:c-bg-2 transition-all"
                  onClick={handleClose}
                >
                  <BiArrowBack size={20} />
                </button>
              </div>

              {/* Image Section */}
              <div className="flex justify-center items-center w-full">
                <div
                  className={`relative w-full lyrics-width rounded-lg shadow-lg overflow-hidden ${
                    user?.role === "free-user" ? "watermark-wrapper" : ""
                  }`}
                >
                  <button
                    className="absolute right-4 top-4 md:flex gap-2 cursor-pointer text-right items-end shadow-md p-2 rounded-md c-primary hover:c-bg-2 transition-all text-white z-10 hidden border-2"
                    onClick={handleClose}
                  >
                    <BiArrowBack size={20} />
                  </button>
                  <button
                    className={`absolute  bottom-2 right-2 z-10 p-3 bg-gray-500 text-white rounded-full shadow-md hover:bg-gray-100 transition-all opacity-40 ${
                      imageError && "hidden"
                    }`}
                    onClick={() => setShowGallery(true)}
                  >
                    <CgMaximize size={20} />
                  </button>{" "}
                  <img
                    src={charcoal}
                    alt="Lyrics"
                    className="absolute h-full object-cover opacity-0"
                    onContextMenu={(e) => e.preventDefault()}
                    draggable={false}
                    loading="lazy"
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  />
                  {!imageError ? (
                    <img
                      src={lyric.lyricsPhoto}
                      alt="Lyrics"
                      onError={() => setImageError(true)}
                      onContextMenu={(e) => e.preventDefault()}
                      draggable={false}
                      loading="lazy"
                      style={{ pointerEvents: "none", userSelect: "none" }}
                      className="w-full h-auto object-cover"
                    />
                  ) : (
                    <div className="flex p-4 w-full md:w-122  c-error-box rounded border border-red-300 text-left">
                      🎶 The lyric image hit a wrong note and vanished! <br />
                      Our backstage crew is tuning things up.
                    </div>
                  )}
                </div>
              </div>

              {/* Video Box */}
              {lyric.youTubeLink && user?.role === "premium-user" && (
                <div className="w-full md:w-122 aspect-video bg-gray-300 rounded-md lyrics-width">
                  <iframe
                    id="lyrics-player"
                    className="w-full h-full rounded-md"
                    src={getEmbedUrl(lyric.youTubeLink)}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              {/* Details Section */}
              <div className="lyrics-width animate-down-start w-full md:w-122 h-full c-bg-2 rounded-lg shadow-lg p-4 md:p-8 border c-border">
                <div className="flex flex-col justify-center items-start gap-2">
                  {/* Title and Album */}
                  <div className="flex items-center justify-between gap-2 w-full">
                    <p className="text-lg font-semibold flex items-center">
                      {lyric.title}{" "}
                    </p>
                    {isPremiumUser ? (
                      <button
                        className="bg-blue-500 p-2 rounded-full hover:bg-blue-600 text-white flex items-center justify-center"
                        onClick={() => setShowChords(true)}
                      >
                        <BiMusic size={18} />
                      </button>
                    ) : (
                      <button
                        className="bg-amber-200 p-2 rounded-full hover:bg-amber-300 text-black flex items-center justify-center"
                        onClick={() => {
                          setMessageType("error");
                          setMessageText(
                            t("chordReadingAvailableForPremiumUsers")
                          );
                          setShowMessage(true);
                          setTimeout(() => setShowMessage(false), 10000);
                        }}
                      >
                        <BiMusic size={18} />
                      </button>
                    )}
                  </div>
                  {lyric.albumName && lyric.albumName !== "?" && (
                    <p className="text-sm text-gray-600 pb-2">
                      {t("album")} - {lyric.albumName}
                    </p>
                  )}

                  {/* Genres */}
                  <div className="genres flex flex-wrap gap-2">
                    <span
                      className={`text-xs border border-red-300 px-2 py-1 rounded-full bg-red-100 text-red-700 font-semibold`}
                    >
                      Key-{lyric.majorKey}
                    </span>
                    {lyric.genre.map((genreData, index) => (
                      <span key={index} className={`${genreTagClass}`}>
                        {genreData}
                      </span>
                    ))}
                  </div>
                  <hr className="w-full border border-dashed c-border my-1" />
                  <div className="flex flex-col gap-2">
                    {/* Artist name */}
                    {lyric.singers.length > 0 && (
                      <div className="flex items-start gap-2">
                        <p className={`text-sm min-w-20 max-w-20 p-1`}>
                          {t("singer")}
                        </p>

                        <div className="w-1/2 flex flex-wrap gap-2">
                          {lyric.singers.map((artistData, index) => (
                            <div
                              key={index}
                              className={`max-w-42 flex items-center gap-2 border c-border p-1 px-2 pr-3 rounded-full cursor-pointer text-nowrap`}
                              onClick={() => {
                                setSelectedArtist(artistData._id);
                                setShowArtistDetails(true);
                              }}
                            >
                              <img
                                src={artistData.photoLink}
                                alt="Lyrics"
                                className="w-6 h-6 aspect-square object-cover rounded-full"
                              />
                              <p
                                className="truncate text-ellipsis overflow-hidden whitespace-nowrap flex-1 text-sm text-gray-800"
                                title={artistData.name} // shows full name on hover
                              >
                                {artistData.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Writer name */}
                    {lyric.writers.length > 0 && (
                      <div className="flex items-start gap-2">
                        <p className={`text-sm  min-w-20 max-w-20 p-1`}>
                          {t("writer")}
                        </p>
                        <div className="w-1/2 flex flex-wrap gap-2">
                          {lyric.writers.map((writerData, index) => (
                            <div
                              key={index}
                              className={`max-w-42 flex items-center gap-2 border c-border p-1 px-2 pr-3 rounded-full cursor-pointer text-nowrap`}
                              onClick={() => {
                                //navigate(`/NT_Lyrics/artist/${artist._id}`);
                                setSelectedArtist(writerData._id);
                                setShowArtistDetails(true);
                              }}
                            >
                              <img
                                src={writerData.photoLink}
                                alt="Lyrics"
                                className="w-6 h-6 aspect-square object-cover rounded-full"
                              />
                              <p
                                className="truncate text-ellipsis overflow-hidden whitespace-nowrap flex-1 text-sm text-gray-800"
                                title={writerData.name}
                              >
                                {writerData.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Feature Artist name */}
                    {lyric.featureArtists.length > 0 && (
                      <div className="flex flex-wrap items-start gap-2">
                        <p className={`text-sm  min-w-16 max-w-20 p-1`}>
                          {t("featuring")}
                        </p>

                        <div className="w-1/2 flex flex-wrap gap-2">
                          {lyric.featureArtists.map((featuringData, index) => (
                            <div
                              key={index}
                              className={`max-w-42 flex items-center gap-2 border c-border p-1 px-2 pr-3 rounded-full cursor-pointer text-nowrap`}
                              onClick={() => {
                                //navigate(`/NT_Lyrics/artist/${artist._id}`);
                                setSelectedArtist(featuringData._id);
                                setShowArtistDetails(true);
                              }}
                            >
                              <img
                                src={featuringData.photoLink}
                                alt="Lyrics"
                                className="w-6 h-6 aspect-square object-cover rounded-full"
                              />
                              <p
                                className="truncate text-ellipsis overflow-hidden whitespace-nowrap flex-1 text-sm text-gray-800"
                                title={featuringData.name}
                              >
                                {featuringData.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <hr className="w-full border border-dashed c-border my-1" />
                  <div className="flex justify-between w-full">
                    <div className="flex items-center gap-1 font-semibold">
                      <FaEye size={16} className="translate-y-[1px]" />{" "}
                      <span className="viewCount">{lyric.viewCount}</span>
                    </div>

                    {token ? (
                      isInCollectionNow ? (
                        <Normal_Button
                          icon={CgRemove}
                          text={t("removeFromCollection")}
                          custom_class={`w-8 h-8 border-transparent shadow-sm bg-red-50 text-red-500 transition-all`}
                          onClick={(e) => {
                            e.stopPropagation();
                            isPremiumUser
                              ? setAddToCollection(true)
                              : changeLyricsStatus(false);
                          }}
                        />
                      ) : (
                        <Normal_Button
                          icon={FaRegHeart}
                          text={t("addToCollection")}
                          custom_class={`w-8 h-8 border-transparent shadow-sm c-primary c-reverse transition-all`}
                          onClick={(e) => {
                            e.stopPropagation();
                            isPremiumUser
                              ? setAddToCollection(true)
                              : changeLyricsStatus(true);
                          }}
                        />
                      )
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            window.location.href = `${siteUrl}/auth/google`;
                          }}
                          className={`max-w-60 flex items-center gap-4 text-left border px-4 py-1 rounded-xl c-border`}
                        >
                          {/* <LuLogIn size={18} /> */}
                          <img
                            src={googleLogo}
                            alt="Google Logo"
                            className="w-4 h-4 inline-block"
                            style={{
                              animation: "wave 3s infinite",
                            }}
                          />
                          {t("loginToTryCollection")}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Metronome */}
              <Metronome />

              <button
                className=" lyrics-width w-full md:w-122 border p-2 flex gap-2 items-center meshBg rounded-md c-border shadow-2xl"
                onClick={handleClose}
              >
                <BiArrowBack size={20} /> <p>{t("backtoLyrics")}</p>
              </button>
            </div>

            {addToCollection && (
              <AddToCollectionBox
                id={id}
                addToCollection={addToCollection}
                close={() => setAddToCollection(false)}
                onCollectionsUpdated={(updatedCollections) => {
                  setIsInCollection(updatedCollections.length > 0);
                }}
              />
            )}
          </motion.div>
        )}

        {/* Artist Details Modal */}
        {showArtistDetails && selectedArtist && (
          <ModalContainer
            isOpen={showArtistDetails}
            onClose={() => setShowArtistDetails(false)}
          >
            <Artist
              artistId={selectedArtist}
              onClose={() => setShowArtistDetails(false)}
            />
          </ModalContainer>
        )}

        {/* Chords Modal */}
        {showChords && (
          <ModalContainer
            isOpen={showChords}
            onClose={() => setShowChords(false)}
          >
            <Chords
              imageLink={lyric.lyricsPhoto}
              chordKey={lyric.majorKey}
              onClose={() => setShowChords(false)}
              isPremium={isPremiumUser}
            />
          </ModalContainer>
        )}
      </AnimatePresence>
    </>
  );
};

LyricsDetails.propTypes = {
  lyricsId: PropTypes.string,
  onClose: PropTypes.func,
  onCollectionStatusChange: PropTypes.func,
  lyricData: PropTypes.object,
  isInCollection: PropTypes.bool,
  access: PropTypes.bool,
};

export default LyricsDetails;
