import React, { useEffect } from "react";
import PropTypes from "prop-types";
import ModalPortal from "../../components/special/ModalPortal";
import useModalEscClose from "../../components/hooks/useModalEscClose";
import { BiCopy, BiPhone, BiX } from "react-icons/bi";
import { AnimatePresence, motion } from "framer-motion";
import InputField from "./InputField";
import DropdownField from "./DropdownField";
import imageCompression from "browser-image-compression";
import { CgProfile } from "react-icons/cg";
import kpay from "../../assets/images/Payments/KpayLogo.png";
import ayapay from "../../assets/images/Payments/AyaPay.jpg";
import wavemoney from "../../assets/images/Payments/WavePay.jpg";
import { useTranslation } from "react-i18next";
import { apiUrl } from "../../assets/util/api";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Accordion, AccordionTab } from "primereact/accordion";

const UpgradeToPremium = ({ onClose, onSuccess }) => {
  const { t } = useTranslation();
  useModalEscClose(onClose);
  const token = localStorage.getItem("token");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    };
  }, []);

  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [selectedpayment, setSelectedPayment] = React.useState("KPay");
  const [selectedDuration, setSelectedDuration] = React.useState("6");
  const [uploadedFile, setUploadedFile] = React.useState(null);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  // 🔴 Field-level error tracking
  const [fieldErrors, setFieldErrors] = React.useState({
    phone: false,
    payment: false,
    duration: false,
    file: false,
  });

  const paymentOptions = [
    { name: "KPay", value: "KPay" },
    { name: "AYAPay", value: "AYAPay" },
    { name: "WaveMoney", value: "WaveMoney" },
  ];

  const durationOptions = [
    { name: "6 Months", value: "6", price: "15000" },
    { name: "12 Months", value: "12", price: "30000" },
  ];

  const paymentinfo = ({ selectedpayment }) => {
    // Data for each payment provider: two entries per provider to match KPay
    const providers = {
      KPay: {
        img: kpay,
        entries: [
          { phone: "095127803", name: "U Saw Lwin" },
          { phone: "09423543293", name: "Paing Htet Myet" },
        ],
      },
      AYAPay: {
        img: ayapay,
        entries: [
          { phone: "095127803", name: "U Saw Lwin" },
          { phone: "09423543293", name: "Paing Htet Myet" },
        ],
      },
      WaveMoney: {
        img: wavemoney,
        entries: [
          { phone: "095127803", name: "U Saw Lwin" },
          { phone: "09423543293", name: "Paing Htet Myet" },
        ],
      },
    };

    const provider = providers[selectedpayment] || providers.KPay;

    return (
      <>
        {provider.entries.map((p, i) => (
          <div
            key={i}
            className="animate-down-start p-4 c-bg-2 rounded-md border c-border c-info-box c-text"
          >
            <div className="flex gap-3 items-start">
              <img
                src={provider.img}
                alt={`${selectedpayment} logo`}
                className="h-12 aspect-square object-center rounded-md"
              />
              <div className="flex flex-col gap-2 w-full">
                <div className="w-auto flex items-center justify-between gap-2">
                  <div className="w-auto flex items-center gap-2">
                    <BiPhone size={20} className="text-gray-500" />
                    <span>{p.phone}</span>
                  </div>
                  <button
                    type="button"
                    className="text-blue-600 hover:underline flex items-center gap-1 border px-1 rounded-full text-xs"
                    onClick={() => {
                      navigator.clipboard.writeText(p.phone);
                      alert("Phone number copied to clipboard!");
                    }}
                  >
                    <BiCopy /> Copy
                  </button>
                </div>
                <div className="w-auto flex items-center gap-2">
                  <CgProfile size={20} className="text-gray-500" />
                  <span>{p.name}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  };

  // ✅ Validation logic
  const validateForm = () => {
    const errors = {
      phone: false,
      payment: false,
      duration: false,
      file: false,
    };

    if (!phoneNumber) {
      errors.phone = true;
      setErrorMessage(t("upgradePremium.validation.phoneRequired"));
    } else if (!/^(09|\+?959)\d{7,9}$/.test(phoneNumber)) {
      errors.phone = true;
      setErrorMessage(t("upgradePremium.validation.phoneInvalid"));
    } else if (!selectedpayment) {
      errors.payment = true;
      setErrorMessage(t("upgradePremium.validation.paymentRequired"));
    } else if (!selectedDuration) {
      errors.duration = true;
      setErrorMessage(t("upgradePremium.validation.durationRequired"));
    } else if (!uploadedFile) {
      errors.file = true;
      setErrorMessage(t("upgradePremium.validation.fileRequired"));
    }

    setFieldErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  // 🧹 Clear field errors on change
  useEffect(() => {
    if (phoneNumber) setFieldErrors((p) => ({ ...p, phone: false }));
  }, [phoneNumber]);
  useEffect(() => {
    if (selectedpayment) setFieldErrors((p) => ({ ...p, payment: false }));
  }, [selectedpayment]);
  useEffect(() => {
    if (selectedDuration) setFieldErrors((p) => ({ ...p, duration: false }));
  }, [selectedDuration]);
  useEffect(() => {
    if (uploadedFile) setFieldErrors((p) => ({ ...p, file: false }));
  }, [uploadedFile]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (errorMessage === t("upgradePremium.validation.fileRequired")) {
      setErrorMessage("");
    }

    const fileSizeMB = file.size / 1024 / 1024;
    const MAX_SIZE_MB = 3;

    if (fileSizeMB <= MAX_SIZE_MB) {
      setUploadedFile(file);
      return;
    }

    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: MAX_SIZE_MB,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });
      setUploadedFile(compressedFile);
    } catch (error) {
      console.error("Image compression failed:", error);
      setErrorMessage(t("upgradePremium.compressionFailed"));
      setUploadedFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("paymentType", selectedpayment);
    formData.append("durationInMonths", selectedDuration);
    formData.append("paymentImage", uploadedFile);
    formData.append("phone", phoneNumber);

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${apiUrl}/paymentRequests/create`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errMsg =
          data?.message ||
          (Array.isArray(data?.errors) && data.errors[0]?.message) ||
          t("upgradePremium.genericSubmissionError");
        setErrorMessage(errMsg);
        return;
      }

      setSuccessMessage(t("upgradePremium.yourRequestIsBeingProcessed"));
      if (onSuccess) onSuccess();
      setTimeout(onClose, 1500);
    } catch (err) {
      console.error("❌ Failed to submit data:", err);
      setErrorMessage(err.message || t("upgradePremium.unknownError"));
    } finally {
      setIsLoading(false);
    }
  };

  /*const handleOpenAppWithFallback = (deepLink, androidPackageId) => {
    const androidFallbackUrl = `market://details?id=${androidPackageId}`;

    //const webFallbackUrl = `https://play.google.com/store/apps/details?id=${androidPackageId}`;

    window.location.href = deepLink;
    setTimeout(() => {
      window.location.href = androidFallbackUrl;
    }, 250);
  };*/

  return (
    <ModalPortal>
      <AnimatePresence>
        <motion.div
          key="modal-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100001] flex justify-center items-center"
        >
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-[#00000090]"
            onClick={!isLoading ? onClose : undefined}
          />

          {/* Modal Box */}
          <motion.div
            key="box"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="c-bg rounded-lg shadow-lg relative z-[101] w-screen h-screen md:pt-12 md:px-24 overflow-y-scroll"
          >
            <div className="header p-6 pb-0 flex justify-between items-center mb-4 sticky top-0 c-bg z-[102]">
              <h2 className="text-xl font-semibold">
                {t("upgradePremium.title")}
              </h2>
              <button
                className="disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onClose}
                disabled={isLoading}
              >
                <BiX size={30} />
              </button>
            </div>

            <div className="flex flex-col gap-6 p-6 pt-0">
              <div className="flex flex-col gap-2 pt-0">
                <Accordion activeIndex={1}>
                  <AccordionTab header={t("aboutPayment")}>
                    <p className="m-0">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                  </AccordionTab>
                </Accordion>

                <hr className="border border-dashed c-border" />

                <h2 className="text-lg font-semibold">{t("toPay")}</h2>
              </div>

              {/* Step 1 */}
              <div className="relative border p-4 rounded-md c-border payment-box space-y-2">
                <p className="font-semibold c-text-primary text-nowrap absolute -top-4 left-2 c-bg px-2">
                  Step - 1
                </p>
                <DropdownField
                  label={t("upgradePremium.duration")}
                  value={selectedDuration}
                  options={durationOptions}
                  onChange={setSelectedDuration}
                  required={true}
                  disabled={isLoading}
                  customClass={`!border-gray-500 mt-1 ${
                    fieldErrors.duration
                      ? "!border-red-500 !ring-1 !ring-red-400"
                      : ""
                  }`}
                />
                <div className="flex justify-between items-center rounded-md gap-4">
                  <span className="text-sm">{t("upgradePremium.total")}:</span>
                  <span className="text-lg font-bold text-blue-600">
                    {selectedDuration === "6"
                      ? "15,000 MMK"
                      : selectedDuration === "12"
                      ? "28,000 MMK"
                      : "0 MMK"}
                  </span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative border p-4 rounded-md c-border payment-box space-y-2">
                <p className="font-semibold c-text-primary text-nowrap absolute -top-4 left-2 c-bg px-2">
                  Step - 2
                </p>
                <p className="mt-1 text-sm p-2 rounded c-alert-box">
                  {t("toUpgradePremium")}
                </p>

                <div className="flex flex-col gap-2">
                  <DropdownField
                    label={t("upgradePremium.paymentMethod")}
                    value={selectedpayment}
                    options={paymentOptions}
                    onChange={setSelectedPayment}
                    required={true}
                    disabled={isLoading}
                    customClass={`!border-gray-500 mt-1 ${
                      fieldErrors.payment
                        ? "!border-red-500 !ring-1 !ring-red-400"
                        : ""
                    }`}
                  />

                  {paymentinfo({ selectedpayment })}

                  {/*<div className="app-buttons">
                    {selectedpayment === "KPay" ? (
                      <button
                        onClick={() => handleOpenAppWithFallback("kbzpay://", "com.kbzbank.kpaycustomer")}
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowe"
                      >
                        Open KBZPay
                      </button>
                    ) : selectedpayment === "AYAPay" ? (
                      <button
                        onClick={() => handleOpenAppWithFallback("ayapay://", "com.ayabank.ayapay")}
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowe"
                      >
                        Open AYA Pay
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenAppWithFallback("wavepay://", "mm.com.wavemoney.wavepay")}
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowe"
                      >
                        Open WavePay
                      </button>
                    )}
                  </div>*/}
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative border p-4 rounded-md c-border payment-box space-y-2">
                <p className="font-semibold c-text-primary text-nowrap absolute -top-4 left-2 c-bg px-2">
                  Step - 3
                </p>
                <InputField
                  label={t("upgradePremium.phoneNumberPlaceholder")}
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  placeholder={t("upgradePremium.phoneNumber")}
                  required={true}
                  disabled={isLoading}
                  customClass={`!border-gray-500 mt-1 ${
                    fieldErrors.phone
                      ? "!border-red-500 !ring-1 !ring-red-400"
                      : ""
                  }`}
                />

                <div className="w-full animate-left">
                  <label className="block mb-2 text-sm font-medium opacity-80">
                    {t("upgradePremium.uploadAValidPaymentProof")}
                    <span className="pl-1 text-red-500">
                      {t("upgradePremium.uploadFileRequired")}
                    </span>
                  </label>

                  <div className="relative">
                    <p
                      className={`text-sm opacity-80 w-full p-2 border mt-1 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed overflow-hidden text-ellipsis whitespace-nowrap ${
                        fieldErrors.file
                          ? "border-red-500 ring-1 ring-red-400"
                          : "!border-gray-500"
                      }`}
                    >
                      {uploadedFile
                        ? uploadedFile.name
                        : t("upgradePremium.screenshotHere")}
                    </p>
                    <input
                      type="file"
                      disabled={isLoading}
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                    />
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="p-2 bg-red-100 text-red-700 border border-red-300 rounded text-sm">
                  {errorMessage}
                </div>
              )}
              {successMessage && (
                <div className="p-2 bg-green-100 text-green-700 border border-green-300 rounded text-sm">
                  {successMessage}
                </div>
              )}

              <button
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 mb-24 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex justify-center items-center gap-2">
                    <AiOutlineLoading3Quarters
                      className="animate-spin text-2xl text-white"
                      size={16}
                    />
                    {t("upgradePremium.makingSureYourPaymentIsCorrect")}
                  </div>
                ) : (
                  t("upgradePremium.upgradeButton")
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </ModalPortal>
  );
};

UpgradeToPremium.propTypes = {
  onClose: PropTypes.func.isRequired,
  user: PropTypes.object,
  onUpdate: PropTypes.func,
  showNewMessage: PropTypes.func,
  onSuccess: PropTypes.func.isRequired,
};

export default UpgradeToPremium;
