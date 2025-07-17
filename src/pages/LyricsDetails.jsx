import Footer from "../components/common/Footer";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import Normal_Button from "../components/common/Normal_Button";
import { CgRemove } from "react-icons/cg";
import { FaRegHeart, FaEye } from "react-icons/fa6";
import { LuLogIn } from "react-icons/lu";
import MessagePopup from "../components/common/MessagePopup";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { useParams, Link } from "react-router-dom";
import { fetchLyricById } from "../assets/util/api";
import charcoal from '../assets/images/charcoal.jpg';
import {
  addLyricsToCollection,
  removeLyricsFromCollection,
} from "../assets/util/api";
import { validateUser } from "../assets/util/api";

const LyricsDetails = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

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

  const [hasToken, setHasToken] = useState(false);
  const [user, setUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);

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
    console.log("User");
    console.log(user);
  }, [user]);

  if (!lyric) {
    return <p>Lyrics data not found.</p>;
  }

  const goToArtist = (id) => {
    navigate(`/NT_Lyrics/artist/${id}`);
  };

  const genreTagClass =
    "text-xs border border-dashed border-gray-300 text-gray-600 px-2 py-1 rounded-full  ";

  const goBack = () => {
    navigate(-1);
  };

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
    userLoaded && (
      <div className="w-screen min-h-screen">
        {showMessage && (
          <MessagePopup message_type={"success"} message_text={messageText} />
        )}

        <div className="min-h-screen flex flex-col items-center justify-center gap-4 md:gap-8 md:pt-16 pt-4 px-6 md:px-24">
          <button className="w-full" onClick={goBack}>
            <BiArrowBack size={20} />
          </button>
          {/* Image Section */}
          <div className="flex justify-center items-center w-full">
            <Zoom
              overlayBgColorEnd="rgba(0, 0, 0, 0.8)"
              transitionDuration={400}
              zoomMargin={20}
            >
              <div
                className={`relative w-full max-w-md rounded-lg shadow-lg overflow-hidden ${
                  user?.role === "free-user" ? "watermark-wrapper" : ""
                }`}
              > <img
                  src={charcoal}
                  alt="Lyrics"
                  className="absolute h-full object-cover opacity-0"
                  onContextMenu={(e) => e.preventDefault()}
                  draggable={false}
                  loading="lazy"
                  style={{pointerEvents: "none",userSelect: "none"}}
                />
                <img
                  src={lyric.lyricsPhoto}
                  alt="Lyrics"
                  onContextMenu={(e) => e.preventDefault()}
                  draggable={false}
                  loading="lazy"
                  style={{pointerEvents: "none",userSelect: "none"}}
                  className="w-full h-auto object-cover"
                />
                {user?.role === "free-user" && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <span className="text-white text-3xl md:text-4xl font-bold opacity-30 rotate-[-20deg] select-none">
                      FREE USER
                    </span>
                  </div>
                )}
              </div>
            </Zoom>
          </div>

          {/* Video Box */}
          {(lyric.youTubeLink && user.role == "premium-user") && (
            <div className="w-full md:w-122 aspect-video bg-gray-300 rounded-md">
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
          <div className="animate-down-start w-full md:w-122 h-full bg-white rounded-lg shadow-lg p-4 md:p-8 border border-gray-200">
            <div className="flex flex-col justify-center items-start ml-4 gap-2">
              <p className="text-lg font-semibold flex items-center">
                {lyric.title}{" "}
              </p>
              {(lyric.albumName != "?" || lyric.albumName != "") && (
                <p className="text-sm text-gray-600 pb-2">
                  Album - {lyric.albumName}
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
              <hr className="w-full border border-dashed border-gray-200 my-1" />
              <div className="flex flex-col gap-2">
                {/* Artist name */}
                {lyric.singers.length > 0 && (
                  <div className="flex items-start gap-2">
                    <p className={`text-sm text-gray-600 w-16 p-1`}>Artist:</p>

                    <div className="w-1/2 flex flex-wrap gap-2">
                      {lyric.singers.map((artistData, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-2 border border-gray-200 p-1 px-2 pr-3 rounded-full cursor-pointer text-nowrap`}
                          onClick={() => goToArtist(artistData._id)}
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
                  <div className="flex items-start gap-2">
                    <p className={`text-sm text-gray-600 w-16 p-1`}>
                      Featuring:
                    </p>

                    <div className="w-1/2 flex flex-wrap gap-2">
                      {lyric.featureArtists.map((featuringData, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-2 border border-gray-200 p-1 px-2 pr-3 rounded-full cursor-pointer text-nowrap`}
                          onClick={() => goToArtist(featuringData._id)}
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
                    <p className={`text-sm text-gray-600 w-16 p-1`}>Writer:</p>
                    <div className="w-1/2 flex flex-wrap gap-2">
                      {lyric.writers.map((writerData, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-2 border border-gray-200 p-1 px-2 pr-3 rounded-full cursor-pointer text-nowrap`}
                          onClick={() => goToArtist(writerData._id)}
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

              <hr className="w-full border border-dashed border-gray-200 my-1" />
              <div className="flex justify-between w-full">
                <div className="flex items-center gap-1 font-semibold">
                  <FaEye size={16} className="translate-y-[1px]" />{" "}
                  <span className="viewCount">{lyric.viewCount}</span>
                </div>

                {hasToken ? (
                  isInCollection ? (
                    <Normal_Button
                      icon={CgRemove}
                      text="Remove from Collection"
                      custom_class={`w-8 h-8 border-transparent shadow-sm bg-red-50 text-red-500 transition-all`}
                      onClick={(e) => {
                        e.stopPropagation();
                        changeLyricsStatus(false);
                      }}
                    />
                  ) : (
                    <Normal_Button
                      icon={FaRegHeart}
                      text="Add to Collection"
                      custom_class={`w-8 h-8 border-transparent shadow-sm bg-white transition-all`}
                      onClick={(e) => {
                        e.stopPropagation();
                        changeLyricsStatus(true);
                      }}
                    />
                  )
                ) : (
                  <>
                    <Link
                      to="/NT_Lyrics/login"
                      className={` flex items-center gap-2 border px-2 py-1 rounded-xl border-gray-300`}
                    >
                      <LuLogIn size={18} />
                      Login to try Collections
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    )
  );
};

export default LyricsDetails;
