import { Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BiArrowBack, BiX } from "react-icons/bi";
import { CgCheck } from "react-icons/cg";
import UpgradeToPremium from "../components/common/UpgradeToPremium";
import { checkIfPaymentRequested, siteUrl } from "../assets/util/api";
import { useAuth } from "../components/hooks/authContext";
import googleLogo from "../assets/images/svgs/google.svg";

const Premium = () => {
  const { t } = useTranslation();
  const columnClass = "p-2 text-pretty";

  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  const { token } = useAuth();

  useEffect(() => {
    const checkPayment = async () => {
      try {
        const paymentData = await checkIfPaymentRequested(token);
        if (!paymentData) throw new Error("No payment returned");
        const exists = paymentData.isExist;
        setIsPaymentProcessing(exists);
      } catch (err) {
        console.error("Failed to fetch payment:", err);
      }
    };

    checkPayment();
  }, [token]);

  const openUpgradeModal = () => {
    setIsModalOpen(true);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-screen min-h-screen overflow-hidden overflow-y-auto c-text scroll-smooth">
        <div className="flex w-full min-h-screen pt-4 md:pt-16 pb-16 px-4 md:px-24 gap-6">
          <div className="premium-page w-full flex flex-col gap-2">
            {/* Premium Header */}
            <div className="landingSpace overflow-hidden relative w-full h-24 c-linear-bg rounded-lg">
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
                <p className="flex items-center gap-2">
                  <span
                    onClick={() => window.history.back()}
                    className="cursor-pointer"
                  >
                    <BiArrowBack />
                  </span>
                  {t("premiumFeatures")}
                </p>
              </h2>
            </div>

            {/* Flavour Text */}
            <p>{t("upgraedToGetTheseExclusiveFeaturesAndBenifits")}</p>

            {/* Features Comparison */}
            <div className="featuresTable w-full py-4 border-b c-border border-dashed">
              <table className="w-full">
                <thead>
                  <tr>
                    <td className={`${columnClass}`}>Features</td>
                    <td className={`${columnClass} c-bg w-24`}>Free</td>
                    <td className={`${columnClass} c-bg-2 w-24`}>Premium</td>
                  </tr>
                </thead>

                <tbody>
                  <tr className="border c-border">
                    <td className={`${columnClass}`}>
                      <a href="#unlockAllLyrics">{t("unlockAllLyrics")}</a>
                    </td>
                    <td className={`${columnClass} c-bg w-24`}>
                      <BiX size={20} className="text-red-500" />
                    </td>
                    <td className={`${columnClass} c-bg-2 w-24`}>
                      <CgCheck size={20} className="text-green-500" />
                    </td>
                  </tr>

                  <tr className="border c-border">
                    <td className={`${columnClass}`}>
                      <a href="#canWatchYoutube">{t("canWatchYoutube")}</a>
                    </td>
                    <td className={`${columnClass} c-bg w-24`}>
                      <BiX size={20} className="text-red-500" />
                    </td>
                    <td className={`${columnClass} c-bg-2 w-24`}>
                      <CgCheck size={20} className="text-green-500" />
                    </td>
                  </tr>

                  <tr className="border c-border">
                    <td className={`${columnClass}`}>
                      <a href="#collectionsexplained">
                        {t("collectionsexplained.title")}
                      </a>
                    </td>
                    <td className={`${columnClass} c-bg w-24`}>
                      <BiX size={20} className="text-red-500" />
                    </td>
                    <td className={`${columnClass} c-bg-2 w-24`}>
                      <CgCheck size={20} className="text-green-500" />
                    </td>
                  </tr>

                  <tr className="border c-border">
                    <td className={`${columnClass}`}>
                      <a href="#chordsExplained">{t("chordsExplained.title")}</a>
                    </td>
                    <td className={`${columnClass} c-bg w-24`}>
                      <BiX size={20} className="text-red-500" />
                    </td>
                    <td className={`${columnClass} c-bg-2 w-24`}>
                      <CgCheck size={20} className="text-green-500" />
                    </td>
                  </tr>

                  <tr className="border c-border">
                    <td className={`${columnClass}`}>
                      <a href="#metronomeExplained">{t("metronomeExplained.title")}</a>
                    </td>
                    <td className={`${columnClass} c-bg w-24`}>
                      <BiX size={20} className="text-red-500" />
                    </td>
                    <td className={`${columnClass} c-bg-2 w-24`}>
                      <CgCheck size={20} className="text-green-500" />
                    </td>
                  </tr>

                  <tr className="border c-border">
                    <td className={`${columnClass}`}>
                      <a href="#transposeExplained">{t("transposeExplained.title")}</a>
                    </td>
                    <td className={`${columnClass} c-bg w-24`}>
                      <BiX size={20} className="text-red-500" />
                    </td>
                    <td className={`${columnClass} c-bg-2 w-24`}>
                      <CgCheck size={20} className="text-green-500" />
                    </td>
                  </tr>

                  <tr className="border c-border">
                    <td className={`${columnClass}`}>{t("noAds")}</td>
                    <td className={`${columnClass} c-bg w-24`}>
                      <CgCheck size={20} className="text-green-500" />
                    </td>
                    <td className={`${columnClass} c-bg-2 w-24`}>
                      <CgCheck size={20} className="text-green-500" />
                    </td>
                  </tr>

                  {isPaymentProcessing ? (
                    <tr className="border c-border">
                      <td colSpan={3} className={`${columnClass} c-bg-2 w-24`}>
                        <div className="w-full bg-yellow-100 text-yellow-900 p-4 rounded-lg border border-yellow-500">
                          <p>
                            {t(
                              "upgradePremium.yourPaymentIsBeingProcessedPleaseWait"
                            )}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : !token ? (
                    <tr className="border c-border">
                      <td colSpan={3} className={`${columnClass} c-bg-2 w-24`}>
                        <button
                          onClick={() => {
                            window.location.href = `${siteUrl}/auth/google`;
                          }}
                          className={`w-full flex items-center gap-4 text-left border px-4 py-2 rounded-xl c-border`}
                        >
                          {/* <LuLogIn size={18} /> */}
                          <img
                            src={googleLogo}
                            alt="Google Logo"
                            className="w-4 h-4 inline-block"
                            style={{
                              animation: "wave 3s infinite",
                            }}
                          />
                          {t("loginToTryCollection")}
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr className="border c-border">
                      <td className={`${columnClass}`}></td>
                      <td colSpan={2} className={`${columnClass} c-bg-2 w-24`}>
                        <button
                          className="loading-animation w-full c-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                          onClick={openUpgradeModal}
                        >
                          {t("upgradeNow")}
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Unlock All Lyrics */}
            <div
              id="unlockAllLyrics"
              className="unlockAllLyrics w-full flex flex-col c-announcement-bg p-2 rounded-lg mt-4"
            >
              <div className="flex items-center gap-2">
                <CgCheck size={24} className="text-green-500" />
                <span className="text-md font-semibold">
                  {t("unlockAllLyrics")}
                </span>
              </div>

              <div className="c-bg p-2 rounded-lg mt-2">
                <p>{t("unlockAllLyricsExplained")}</p>
              </div>
            </div>

            {/* canWatchYoutube */}
            <div
              id="canWatchYoutube"
              className="unlockAllLyrics w-full flex flex-col c-announcement-bg p-2 rounded-lg mt-4"
            >
              <div className="flex items-center gap-2">
                <CgCheck size={24} className="text-green-500" />
                <span className="text-md font-semibold">
                  {t("canWatchYoutube")}
                </span>
              </div>

              <div className="c-bg p-2 rounded-lg mt-2">
                <p>{t("canWatchYoutubeExplained")}</p>
              </div>
            </div>

            <div
              id="collectionsexplained"
              className="unlockAllLyrics w-full flex flex-col c-announcement-bg p-2 rounded-lg mt-4"
            >
              <div className="flex items-center gap-2">
                <CgCheck size={24} className="text-green-500" />
                <span className="text-md font-semibold">
                  {t("collectionsexplained.title")}
                </span>
              </div>

              <div className="c-bg p-2 rounded-lg mt-2">
                <p>{t("collectionsexplained.explained")}</p>
              </div>
            </div>

            <div
              id="chordsExplained"
              className="unlockAllLyrics w-full flex flex-col c-announcement-bg p-2 rounded-lg mt-4"
            >
              <div className="flex items-center gap-2">
                <CgCheck size={24} className="text-green-500" />
                <span className="text-md font-semibold">
                  {t("chordsExplained.title")}
                </span>
              </div>

              <div className="c-bg p-2 rounded-lg mt-2">
                <p>{t("chordsExplained.explained")}</p>
              </div>
            </div>

            <div
              id="metronomeExplained"
              className="unlockAllLyrics w-full flex flex-col c-announcement-bg p-2 rounded-lg mt-4"
            >
              <div className="flex items-center gap-2">
                <CgCheck size={24} className="text-green-500" />
                <span className="text-md font-semibold">
                  {t("metronomeExplained.title")}
                </span>
              </div>

              <div className="c-bg p-2 rounded-lg mt-2">
                <p>{t("metronomeExplained.explained")}</p>
              </div>
            </div>

            <div
              id="transposeExplained"
              className="unlockAllLyrics w-full flex flex-col c-announcement-bg p-2 rounded-lg mt-4"
            >
              <div className="flex items-center gap-2">
                <CgCheck size={24} className="text-green-500" />
                <span className="text-md font-semibold">
                  {t("transposeExplained.title")}
                </span>
              </div>

              <div className="c-bg p-2 rounded-lg mt-2">
                <p>{t("transposeExplained.explained")}</p>
              </div>
            </div>
            

            {!isPaymentProcessing && (
              <button
                className="loading-animation w-full c-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 my-2 mb-8"
                onClick={openUpgradeModal}
              >
                {t("upgradeNow")}
              </button>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <UpgradeToPremium
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsPaymentProcessing(true);
          }}
        />
      )}
    </Suspense>
  );
};

export default Premium;
