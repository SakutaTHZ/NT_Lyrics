import "react-medium-image-zoom/dist/styles.css";
import Normal_Button from "../components/common/Normal_Button";
import { CgClose, CgMaximize, CgRemove } from "react-icons/cg";
import { FaRegHeart, FaEye } from "react-icons/fa6";
import { LuLogIn } from "react-icons/lu";
import MessagePopup from "../components/common/MessagePopup";
import { useEffect, useState } from "react";
import { BiArrowBack, BiMusic } from "react-icons/bi";
import { Link } from "react-router-dom";
import { fetchLyricById } from "../assets/util/api";
import charcoal from "../assets/images/charcoal.jpg";
import loading from "../assets/images/playing.png";
import {
  addLyricsToCollection,
  removeLyricsFromCollection,
} from "../assets/util/api";
import { validateUser } from "../assets/util/api";

import { useTranslation } from "react-i18next";
import AddToCollectionBox from "../components/special/AddToCollectionBox";
import Artist from "./Artist";
import PropTypes from "prop-types";
import ModalContainer from "../components/special/ModalContainer";
import { motion, AnimatePresence } from "framer-motion";
import Chords from "./Chords";

const LyricsDetails = ({ lyricsId, onClose }) => {
  const { t } = useTranslation();

  const [isVisible, setIsVisible] = useState(true);

  const [showChords, setShowChords] = useState(false);

  const handleClose = () => {
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

  const id = lyricsId;

  const [lyric, setLyrics] = useState(null);
  const [isInCollection, setIsInCollection] = useState(false);

  useEffect(() => {
    const getLyric = async () => {
      try {
        const { lyrics } = await fetchLyricById(
          id,
          localStorage.getItem("token")
        );
        setLyrics(lyrics); // only the actual lyrics object
        setIsInCollection(lyrics.isFavourite);
      } catch (err) {
        console.error("Error fetching lyric:", err);
      }
    };

    getLyric();
  }, [id]);

  const [addToCollection, setAddToCollection] = useState(false);

  const [hasToken, setHasToken] = useState(false);
  const [user, setUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);

  const [showArtistDetails, setShowArtistDetails] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setHasToken(true);

    const id = JSON.parse(localStorage.getItem("user") || "{}")?.id;
    if (!id) return setUserLoaded(true);

    const getUser = async () => {
      try {
        const userData = await validateUser(id, token);
        if (!userData) throw new Error("No user returned");
        setUser(userData.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setUserLoaded(true);
      }
    };
    getUser();
  }, []);

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
      <div className="w-screen h-screen flex items-center justify-center">
        <img src={loading} alt="Loading..." className="w-1/2 mx-auto" />
      </div>
    );
  }

  const genreTagClass =
    "text-xs border border-dashed c-border c-text px-2 py-1 rounded-full  ";

  const changeLyricsStatus = async (shouldAdd) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessageText("Please login to add to collection");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
      return;
    }

    const successMessage = shouldAdd
      ? "Lyrics has been added to the collection"
      : "Lyrics has been removed from the collection";

    try {
      let res = null;
      if (shouldAdd) {
        // Add lyrics to collection
        res = await addLyricsToCollection(id, token);
      } else {
        // Remove lyrics from collection
        res = await removeLyricsFromCollection(id, "Default", token);
      }

      setIsInCollection(shouldAdd);
      setMessageText(successMessage);

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
      <AnimatePresence>
        {isVisible && userLoaded && (
          <motion.div
            className="w-screen h-screen absolute inset-0 z-20 c-bg overflow-hidden overflow-y-auto pb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {showMessage && (
              <MessagePopup
                message_type={"success"}
                closePopup={() => setShowMessage(false)}
              >
                <div className="message_text text-pretty text-left">
                  {messageText.split("\n").map((line, index) => (
                    <span key={index}>{line}</span>
                  ))}
                </div>
              </MessagePopup>
            )}

            {showGallery && (
              <div className="animate-appear fixed inset-0 bg-[#00000090] backdrop-blur-md bg-opacity-50 flex items-center justify-center z-[10000] p-2">
                <button
                  className="absolute flex justify-center items-center top-2 right-2 text-white bg-[#ffffff20] rounded-full p-2 hover:bg-red-600 transition-all"
                  onClick={() => setShowGallery(false)}
                >
                  <CgClose size={24} />
                </button>

                <img
                  src={lyric.lyricsPhoto}
                  alt="Lyrics"
                  onError={() => setImageError(true)}
                  onContextMenu={(e) => e.preventDefault()}
                  draggable={false}
                  loading="lazy"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                  className="w-full h-auto object-cover animate-down"
                />
              </div>
            )}

            <div className="lyrics-wrapper">
              <div className="flex items-center w-full">
                <p className="w-full font-medium"></p>
                <button
                  className="flex gap-2 items-center lyrics-width cursor-pointer text-right"
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
                    className={`absolute md:hidden bottom-2 right-2 z-10 p-3 bg-gray-500 text-white rounded-full shadow-md hover:bg-gray-100 transition-all opacity-40 ${
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
              {lyric.youTubeLink && user?.role == "premium-user" && (
                <div className="w-full md:w-122 aspect-video bg-gray-300 rounded-md lyrics-width">
                  <iframe
                    className="w-full h-full rounded-md"
                    src={lyric.youTubeLink}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              {/* Details Section */}
              <div className="lyrics-width animate-down-start w-full md:w-122 h-full c-bg-2 rounded-lg shadow-lg p-4 md:p-8 border c-border">
                <div className="flex flex-col justify-center items-start ml-4 gap-2">
                  {/* Title and Album */}
                  <div className="flex items-center justify-between gap-2 w-full">
                    <p className="text-lg font-semibold flex items-center">
                      {lyric.title}{" "}
                    </p>
                    <button
                      className="bg-blue-500 p-2 rounded-full hover:bg-blue-600 text-white flex items-center justify-center opacity-75"
                      onClick={() => setShowChords(true)}
                    >
                      <BiMusic size={18} />
                    </button>
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
                        <p className={`text-sm   min-w-16 max-w-24 p-1`}>
                          {t("singer")}:
                        </p>

                        <div className="w-1/2 flex flex-wrap gap-2">
                          {lyric.singers.map((artistData, index) => (
                            <div
                              key={index}
                              className={`flex items-center gap-2 border c-border p-1 px-2 pr-3 rounded-full cursor-pointer text-nowrap`}
                              onClick={() => {
                                //navigate(`/NT_Lyrics/artist/${artist._id}`);
                                setSelectedArtist(artistData._id);
                                setShowArtistDetails(true);
                                console.log(
                                  "Selected artist ID:",
                                  artistData._id
                                );
                              }}
                            >
                              <img
                                src={artistData.photoLink}
                                alt="Lyrics"
                                className="w-6 h-6 object-cover rounded-full"
                              />
                              <p>{artistData.name}</p>{" "}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Feature Artist name */}
                    {lyric.featureArtists.length > 0 && (
                      <div className="flex flex-wrap items-start gap-2">
                        <p className={`text-sm  min-w-16 max-w-24 p-1`}>
                          {t("featuring")}:
                        </p>

                        <div className="w-1/2 flex flex-wrap gap-2">
                          {lyric.featureArtists.map((featuringData, index) => (
                            <div
                              key={index}
                              className={`flex items-center gap-2 border c-border p-1 px-2 pr-3 rounded-full cursor-pointer text-nowrap`}
                              onClick={() => {
                                //navigate(`/NT_Lyrics/artist/${artist._id}`);
                                setSelectedArtist(featuringData._id);
                                setShowArtistDetails(true);
                                console.log(
                                  "Selected artist ID:",
                                  featuringData._id
                                );
                              }}
                            >
                              <img
                                src={featuringData.photoLink}
                                alt="Lyrics"
                                className="w-6 h-6 object-cover rounded-full"
                              />
                              <p>{featuringData.name}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Writer name */}
                    {lyric.writers.length > 0 && (
                      <div className="flex items-start gap-2">
                        <p className={`text-sm  min-w-16 max-w-24 p-1`}>
                          {t("wrtier")}:
                        </p>
                        <div className="w-1/2 flex flex-wrap gap-2">
                          {lyric.writers.map((writerData, index) => (
                            <div
                              key={index}
                              className={`flex items-center gap-2 border c-border p-1 px-2 pr-3 rounded-full cursor-pointer text-nowrap`}
                              onClick={() => {
                                //navigate(`/NT_Lyrics/artist/${artist._id}`);
                                setSelectedArtist(writerData._id);
                                setShowArtistDetails(true);
                                console.log(
                                  "Selected artist ID:",
                                  writerData._id
                                );
                              }}
                            >
                              <img
                                src={writerData.photoLink}
                                alt="Lyrics"
                                className="w-6 h-6 object-cover rounded-full"
                              />
                              <p className="text-nowrap">{writerData.name}</p>
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

                    {hasToken ? (
                      isInCollection ? (
                        <Normal_Button
                          icon={CgRemove}
                          text={t("removeFromCollection")}
                          custom_class={`w-8 h-8 border-transparent shadow-sm bg-red-50 text-red-500 transition-all`}
                          onClick={(e) => {
                            e.stopPropagation();
                            user?.role === "premium-user"
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
                            user?.role === "premium-user"
                              ? setAddToCollection(true)
                              : changeLyricsStatus(true);
                          }}
                        />
                      )
                    ) : (
                      <>
                        <Link
                          to="/NT_Lyrics/login"
                          className={` flex items-center gap-2 border px-2 py-1 rounded-xl c-border`}
                        >
                          <LuLogIn size={18} />
                          {t("loginToTryCollection")}
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                className="w-full md:w-122 border p-2 flex gap-2 items-center meshBg rounded-md c-border shadow-2xl"
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
              chordKey={lyric.majorKey}
              onClose={() => setShowChords(false)}
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
};

export default LyricsDetails;
