import { useParams } from "react-router-dom";
import Nav from "../components/common/Nav";
import Footer from "../components/common/Footer";
import sampleImage from "../assets/images/Lyrics_sample.png";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css'; // Required for styles

const LyricsDetails = () => {
  const { id } = useParams();

  return (
    <>
      <div className="w-screen h-screen overflow-hidden overflow-y-auto">
        <Nav />
        {/* Lyrics */}
        <div className="relative flex flex-col min-h-screen pt-16 px-4 md:px-24">
          <p className="font-bold text-lg italic">Lyric: {id}</p>

          {/* Wrap the image with the Zoom component */}
          <Zoom>
            <img src={sampleImage} className="w-full" alt="Lyrics" />
          </Zoom>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default LyricsDetails;
