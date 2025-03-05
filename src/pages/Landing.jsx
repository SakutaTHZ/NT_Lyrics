import Nav from "../components/common/Nav";
import cover from '../assets/images/cover_bg.png'
import { BiSearch } from "react-icons/bi";

const Landing = () => {
  return (
    <>
      <div className="flex items-start w-screen h-screen justify-center">
        <Nav/>
        <div className="relative hero h-2/5 overflow-hidden w-screen bg-red-100 flex justify-center items-center px-6">
          <img src={cover} loading="lazy" className="absolute inset-0 sm:h-full md:w-full object-fill"/>

          <div className="bg-white z-10 w-full md:w-96 p-4 rounded-md shadow-md flex flex-col gap-3  translate-y-12">
            <p className="text-lg font-semibold">သီချင်းရှာကြမယ် ...</p>
            <div className="border border-gray-300 rounded-md p-2 flex items-center gap-2">
              <BiSearch size={20} className="flex-shrink-0 text-gray-400"/><input type="text" placeholder="Search Musician or Lyrics" className="w-full outline-0"/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing;
