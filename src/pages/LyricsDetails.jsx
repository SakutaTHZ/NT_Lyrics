import { useParams } from "react-router-dom";
import Nav from "../components/common/Nav";
import Footer from "../components/common/Footer";
import sampleImage from "../assets/images/Lyrics_sample.png";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css"; 
import Normal_Button from "../components/common/Normal_Button";
import { CgRemove } from "react-icons/cg";
import { FaRegHeart } from "react-icons/fa6";
import MessagePopup from "../components/common/MessagePopup";
import { useState} from "react";

const LyricsDetails = () => {
  const { id } = useParams();
    const [showMessage, setShowMessage] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [isInCollection, setIsInCollection] = useState(false);
  
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
    <div className="w-screen min-h-screen">
          {showMessage && (
            <MessagePopup message_type={"success"} message_text={messageText} />
          )}
      <Nav />

      {/* Lyrics Section */}
      <div className="flex flex-col md:flex-row items-start justify-center gap-8 pt-16 px-6 md:px-24">
        {/* Image Section */}
        <div className="flex justify-center items-center w-full md:w-1/2">
          <Zoom overlayBgColorEnd="rgba(0, 0, 0, 0.8)" transitionDuration={400} zoomMargin={20}>
            <img src={sampleImage} className="w-full max-w-md rounded-lg shadow-lg" alt="Lyrics" />
          </Zoom>
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 h-full bg-white shadow-lg rounded-lg p-6 md:p-8 pt-2 border border-gray-200">

          <div className="grid grid-cols-2 gap-4 text-gray-700 mt-4">
            <p className="font-semibold">Music Name:</p> <p>Kyay zu pr kwl</p>
            <p className="font-semibold">Artist:</p> <p>Artist Name</p>
            <p className="font-semibold">Album:</p> <p>Album Name</p>
            <p className="font-semibold">Genre:</p> <p>Genre Name</p>
            <p className="font-semibold">Featuring:</p> <p>Featuring Name</p>
            <p className="font-semibold">Key:</p> <p>Key Name</p>
          </div>

          {isInCollection ? (
                      <Normal_Button
                        icon={CgRemove}
                        text="Remove from Collection"
                        custom_class={`w-full mt-4 py-2 px-3 border-transparent shadow-sm bg-red-50 text-red-500`}
                        onClick={changeLyricsStatus}
                      />
                    ) : (
                      <Normal_Button
                        icon={FaRegHeart}
                        text="Add to collection"
                        custom_class={`w-full mt-4 py-2 px-3 border-transparent shadow-sm bg-white`}
                        onClick={changeLyricsStatus}
                      />
                    )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LyricsDetails;
