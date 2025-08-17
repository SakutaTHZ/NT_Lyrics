import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { BiX } from "react-icons/bi";
import { CgCheck } from "react-icons/cg";

const Premium = () => {
  const { t } = useTranslation();
  const columnClass = "p-2"

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-screen min-h-screen overflow-hidden overflow-y-auto text-gray-800">
        <div className="flex w-full min-h-screen pt-4 md:pt-16 pb-16 px-4 md:px-24 gap-6">
          <div className="premium-page w-full flex flex-col gap-2">
            <div className="landingSpace overflow-hidden relative w-full h-24 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1440 320"
                className="absolute bottom-0"
              >
                <path
                  fill="#93c5fd"
                  d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                ></path>
              </svg>
              <h2 className="font-bold text-2xl italic text-white absolute top-4 left-4">
                {t("premiumFeatures")}
              </h2>
            </div>
            <p>{t("upgraedToGetTheseExclusiveFeaturesAndBenifits")}</p>

            {/* Features Comparison */}
            <div className="featuresTable w-full py-4">
              <table className="w-full">
                <tr>
                  <td className={`${columnClass}`}>
                    Features
                  </td>
                  <td className={`${columnClass} bg-gray-100 w-24`}>
                    Free
                  </td>
                  <td className={`${columnClass} bg-blue-100 w-24`}>
                    Premium
                  </td>
                </tr>

                <tr className="border border-gray-200 bg-gray-50">
                  <td className={`${columnClass}`}>
                    Unlock All Lyrics
                  </td>
                  <td className={`${columnClass} bg-gray-50 w-24`}>
                    <BiX size={20} className="text-red-500"/>
                  </td>
                  <td className={`${columnClass} bg-blue-50 w-24`}>
                    <CgCheck size={20} className="text-green-500"/>
                  </td>
                </tr>

                <tr className="border border-gray-200">
                  <td className={`${columnClass}`}>
                    Collections
                  </td>
                  <td className={`${columnClass} bg-gray-50 w-24`}>
                    <BiX size={20} className="text-red-500"/>
                  </td>
                  <td className={`${columnClass} bg-blue-50 w-24`}>
                    <CgCheck size={20} className="text-green-500"/>
                  </td>
                </tr>

                <tr className="border border-gray-200 bg-gray-50">
                  <td className={`${columnClass}`}>
                    Offline Collections
                  </td>
                  <td className={`${columnClass} bg-gray-50 w-24`}>
                    <BiX size={20} className="text-red-500"/>
                  </td>
                  <td className={`${columnClass} bg-blue-50 w-24`}>
                    <CgCheck size={20} className="text-green-500"/>
                  </td>
                </tr>

                <tr className="border border-gray-200">
                  <td className={`${columnClass}`}>
                    No Ads
                  </td>
                  <td className={`${columnClass} bg-gray-50 w-24`}>
                    <BiX size={20} className="text-red-500"/>
                  </td>
                  <td className={`${columnClass} bg-blue-50 w-24`}>
                    <CgCheck size={20} className="text-green-500"/>
                  </td>
                </tr>

                <tr className="border border-gray-200 bg-gray-50">
                  <td className={`${columnClass}`}>
                    Themes
                  </td>
                  <td className={`${columnClass} bg-gray-50 w-24`}>
                    <BiX size={20} className="text-red-500"/>
                  </td>
                  <td className={`${columnClass} bg-blue-50 w-24`}>
                    <CgCheck size={20} className="text-green-500"/>
                  </td>
                </tr>

                <tr className="border border-gray-200">
                  <td className={`${columnClass}`}>
                    Lyrics Requests
                  </td>
                  <td className={`${columnClass} bg-gray-50 w-24`}>
                    <BiX size={20} className="text-red-500"/>
                  </td>
                  <td className={`${columnClass} bg-blue-50 w-24`}>
                    <CgCheck size={20} className="text-green-500"/>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Premium;
