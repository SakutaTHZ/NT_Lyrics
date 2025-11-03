import { useTranslation } from "react-i18next";

const PaymentGuide = () => {
  const { t } = useTranslation();
  return (
    <>
          <p className="m-0">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
            {t("")}
          </p>
    </>
  );
};

export default PaymentGuide;
