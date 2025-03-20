import sampleImage from "../../assets/images/Lyrics_sample.png";
import PropTypes from 'prop-types';
import { FaEye, FaRegHeart } from "react-icons/fa6";
import Normal_Button from "../../components/common/Normal_Button"; // Adjust the path as necessary
import { useState, useEffect } from "react";
import { CgRemove } from "react-icons/cg";
import MessagePopup from "../common/MessagePopup";
import { useNavigate } from "react-router-dom";

const LyricsCard = ({ id,lyric }) => {
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [isInCollection, setIsInCollection] = useState(false);

  const checkIfInCollection = () => {
    // Check if the lyrics is in User's Collection
    return setIsInCollection(false);
  };

  useEffect(() => {
    checkIfInCollection();
  }, []);

  const navigate = useNavigate();

  const goToLyricsDetails = () => {
    console.log("Go to Lyrics Details");
    // Pass the id dynamically in the URL
    navigate(`/NT_Lyrics/lyricsdetail/${id}`, { state: { lyric } });
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
      </div>
    </>
  );
};
LyricsCard.propTypes = {
  id: PropTypes.string.isRequired,
  lyric: PropTypes.object,
};

export default LyricsCard;