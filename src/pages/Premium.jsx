import { Suspense } from "react";
import { useTranslation } from "react-i18next";

const Premium = () => {
  const { t } = useTranslation();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-screen min-h-screen overflow-hidden overflow-y-auto text-gray-800">
        <div className="flex w-full min-h-screen pt-4 md:pt-16 pb-16 px-4 md:px-24 gap-6">
          <div className="premium-page">
            <h2 className="font-bold text-xl italic text-blue-500 pb-2">
                {t("premiumFeatures")}
              </h2>
            <p>{t("upgraedToGetTheseExclusiveFeaturesAndBenifits")}</p>
            {/* Add more content related to premium features here */}
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Premium;
