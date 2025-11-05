import { useTranslation } from "react-i18next";
import step1 from "../../assets/images/Payment Guide/01.jpg";
import step2 from "../../assets/images/Payment Guide/02.jpg";
import step3 from "../../assets/images/Payment Guide/03.jpg";
import step4 from "../../assets/images/Payment Guide/04.jpg";
import step5 from "../../assets/images/Payment Guide/05.jpg";
import step6 from "../../assets/images/Payment Guide/06.jpg";
import step7 from "../../assets/images/Payment Guide/07.jpg";
import step8 from "../../assets/images/Payment Guide/08.jpg";
import step9 from "../../assets/images/Payment Guide/09.jpg";
import step10 from "../../assets/images/Payment Guide/10.jpg";

const PaymentGuide = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="space-y-4 leading-relaxed p-4 pt-0">
        <p>{t("paymentGuide.guideIntro")}</p>

        <h2 className="text-lg font-semibold border-b pb-2">
          {t("paymentGuide.topay")}
        </h2>

        <ol className="payment-list space-y-2">
          <li>
            <span>{t("paymentGuide.step1")}</span>
            <img src={step1} className="w-full mt-4 border-2 c-border border-dashed" />
          </li>
          <li>
            <span>{t("paymentGuide.step2")}</span>
            <img src={step2} className="w-full mt-4 border-2 c-border border-dashed" />
          </li>
          <li>
            <span>{t("paymentGuide.step3")}</span>
            <img src={step3} className="w-full mt-4 border-2 c-border border-dashed" />
          </li>
          <li>
            <span>{t("paymentGuide.step3extra")}</span>
            <img src={step4} className="w-full mt-4 border-2 c-border border-dashed" />
          </li>
          <li>
            <span>{t("paymentGuide.step4")}</span>
          </li>
          <li>
            <span>{t("paymentGuide.step5")}</span>
            <img src={step5} className="w-full mt-4 border-2 c-border border-dashed" />
          </li>
          <li>
            <span>{t("paymentGuide.step5extra")}</span>
            <img src={step6} className="w-full mt-4 border-2 c-border border-dashed" />
            <img src={step7} className="w-full mt-4 border-2 c-border border-dashed" />
          </li>
          <li>
            <span>{t("paymentGuide.step6")}</span>
            <img src={step8} className="w-full mt-4 border-2 c-border border-dashed" />
          </li>
          <li>
            <span>{t("paymentGuide.step6extra")}</span>
          </li>
          <li>
            <span>{t("paymentGuide.step6extra")}</span>
            <img src={step9} className="w-full mt-4 border-2 c-border border-dashed" />
          </li>
          <li>
            <span>{t("paymentGuide.step8")}</span>
            <img src={step10} className="w-full mt-4 border-2 c-border border-dashed" />
          </li>
          <li>{t("paymentGuide.step8extra")}</li>
        </ol>

        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-semibold">
            {t("paymentGuide.withoutPremium.intro")}
          </h2>

          <ul className="list-disc list-inside space-y-1">
            <li>{t("paymentGuide.withoutPremium.step1")}</li>
            <li>{t("paymentGuide.withoutPremium.step2")}</li>
            <li>{t("paymentGuide.withoutPremium.step3")}</li>
            <li>{t("paymentGuide.withoutPremium.step4")}</li>
            <li>{t("paymentGuide.withoutPremium.step5")}</li>
          </ul>

          <p className="mt-2">{t("paymentGuide.withoutPremium.outro")}</p>
        </div>
      </div>
    </>
  );
};

export default PaymentGuide;
