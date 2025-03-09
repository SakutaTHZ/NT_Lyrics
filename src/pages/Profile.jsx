import Nav from "../components/common/Nav";
import LyricsCard from "../components/special/LyricsCard";
import Footer from "../components/common/Footer";

const Profile = () => {

  return (
    <>
      
      <div className="w-screen h-screen overflow-hidden overflow-y-auto">
        <Nav />
        {/* Lyrics */}
        <div className="relative flex flex-col  min-h-screen pt-16">
            
          <div className="flex justify-between px-4 md:px-24">
            <p className="font-bold text-lg italic">Profile</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 py-4 gap-4 md:gap-12 px-4 md:px-24">
            {Array.from({ length: 20 }).map((_, index) => (
              <LyricsCard key={index} />
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Profile;
