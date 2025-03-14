import { useParams } from "react-router-dom";
import Nav from "../components/common/Nav";
import Footer from "../components/common/Footer";
import sampleImage from "../assets/images/Lyrics_sample.png";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import Normal_Button from "../components/common/Normal_Button";
import { CgRemove } from "react-icons/cg";
import { FaRegHeart, FaEye } from "react-icons/fa6";
import MessagePopup from "../components/common/MessagePopup";
import { useEffect, useState } from "react";

const LyricsDetails = () => {
  const { id } = useParams();
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [isInCollection, setIsInCollection] = useState(false);

  // Get Lyrics Details from the API
  const getLyricsDetails = async () => {
    try {
      console.log("Lyrics Details: ", id);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getLyricsDetails();
  }, []);

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

  const genreTagClass =
    "text-xs border border-dashed border-gray-300 text-gray-600 px-2 py-1 rounded-full  ";

  return (
    <div className="w-screen min-h-screen">
      {showMessage && (
        <MessagePopup message_type={"success"} message_text={messageText} />
      )}
      <Nav />

      <div className="min-h-screen flex flex-col items-center justify-center gap-8 pt-16 px-6 md:px-24">
        {/* Details Section */}
        <div className="animate-down-start w-full md:w-1/2 h-full bg-white rounded-lg shadow-lg p-4 md:p-8 border border-gray-200">
          <div className="flex flex-col justify-center items-start ml-4 gap-2">
            <p className="text-lg font-semibold flex items-center">
              ကျေးဇူးပါကွယ်{" "}
              <span className="text-sm font-normal ml-2 text-blue-500">
                (Trending #3)
              </span>
            </p>
            <p className="text-sm text-gray-600">Album - ?</p>

            {/* Genres */}
            <div className="genres flex flex-wrap gap-2">
              <span
                className={`text-xs border border-red-300 px-2 py-1 rounded-full bg-red-100 text-red-700 font-semibold`}
              >
                Key-A
              </span>
              <span className={`${genreTagClass}`}>Pop</span>
              <span className={`${genreTagClass}`}>Hip-Hop</span>
              <span className={`${genreTagClass}`}>R&B</span>
            </div>
            <hr className="w-full border border-dashed border-gray-200 my-1" />
            <div className="flex flex-col gap-2">
              {/* Artist name */}
              <div className="flex items-center gap-2">
                <p className={`text-sm text-gray-600 w-16`}>Artist:</p>
                <div
                  className={`flex items-center gap-2 border border-gray-200 p-1 px-2 rounded-full`}
                >
                  <img
                    src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZwqXtyBSujH-HlZpZgeBViGQ_MLhG2I5FPQ&s`}
                    alt="Lyrics"
                    className="w-6 h-6 rounded-full"
                  />
                  <p>SHINE</p>
                </div>
              </div>
              {/* Feature Artist name */}
              <div className="flex items-center gap-2">
                <p className={`text-sm text-gray-600 w-16`}>Featuring:</p>
                <div
                  className={`flex items-center gap-2 border border-gray-200 p-1 px-2 rounded-full`}
                >
                  <img
                    src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZwqXtyBSujH-HlZpZgeBViGQ_MLhG2I5FPQ&s`}
                    alt="Lyrics"
                    className="w-6 h-6 rounded-full"
                  />
                  <p>SHINE</p>
                </div>
              </div>
              {/* Writer name */}
              <div className="flex items-center gap-2">
                <p className={`text-sm text-gray-600 w-16`}>Writer:</p>
                <div
                  className={`flex items-center gap-2 border border-gray-200 p-1 px-2 rounded-full`}
                >
                  <img
                    src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZwqXtyBSujH-HlZpZgeBViGQ_MLhG2I5FPQ&s`}
                    alt="Lyrics"
                    className="w-6 h-6 rounded-full"
                  />
                  <p>SHINE</p>
                </div>
              </div>
            </div>
            
            <hr className="w-full border border-dashed border-gray-200 my-1" />
            <div className="flex justify-between w-full">
                      <div className="flex items-center gap-1 font-semibold">
                        <FaEye size={16} className="translate-y-[1px]" />{" "}
                        <span className="viewCount">1.2k</span>
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
          </div>
        </div>

        {/* Image Section */}
        <div className="flex justify-center items-center w-full">
          <Zoom
            overlayBgColorEnd="rgba(0, 0, 0, 0.8)"
            transitionDuration={400}
            zoomMargin={20}
          >
            <img
              src={sampleImage}
              className="w-full max-w-md rounded-lg shadow-lg"
              alt="Lyrics"
            />
          </Zoom>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LyricsDetails;
