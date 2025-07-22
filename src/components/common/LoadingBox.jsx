import { FaEye } from "react-icons/fa";

const LoadingBox = () => {
  return (
    <>
      {/* <div className="relative loading-box w-full min-h-16 md:min-h-32 md:aspect-[4/5] rounded-md shadow-[0_0_20px_rgba(0,0,0,0.1)] p-2 md:p-0 flex gap-4">
        <div className="imageContainer w-8 md:w-full h-full rounded-sm bg-gradient-to-br from-gray-200 to-gray-50 loading-animation"></div>
        <div className="textContainer w-full h-full flex md:hidden flex-col gap-2">
          <div className="titleContainer h-full rounded-sm w-32 bg-gradient-to-br from-gray-200 to-gray-50 loading-animation"></div>
          <div className="nameContainer h-full rounded-sm w-24 bg-gradient-to-br from-gray-200 to-gray-50 loading-animation"></div>
        </div>

        <div className="hidden md:flex items-center gap-1 font-semibold absolute top-0 left-0 bg-transparent rounded-br-2xl p-3 py-1 shadow-md text-gray-800">
          <FaEye size={16} className="translate-y-[1px]" />{" "}
          <span className="viewCount">0</span>
        </div>
      </div> */}

      <div className="relative loading-box w-full min-h-16  rounded-md shadow-[0_0_20px_rgba(0,0,0,0.1)] p-2 flex gap-4">
        <div className="imageContainer w-8 h-full rounded-sm bg-gradient-to-br from-gray-200 to-gray-50 loading-animation"></div>
        <div className="textContainer w-full h-full flex flex-col gap-2">
          <div className="titleContainer h-full rounded-sm w-32 bg-gradient-to-br from-gray-200 to-gray-50 loading-animation"></div>
          <div className="nameContainer h-full rounded-sm w-24 bg-gradient-to-br from-gray-200 to-gray-50 loading-animation"></div>
        </div>

        <div className="hidden items-center gap-1 font-semibold absolute top-0 left-0 bg-transparent rounded-br-2xl p-3 py-1 shadow-md text-gray-800">
          <FaEye size={16} className="translate-y-[1px]" />{" "}
          <span className="viewCount">0</span>
        </div>
      </div>
    </>
  );
};

export default LoadingBox;
