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

// Payment Icons
import kpay from "../../assets/images/Payments/KpayLogo.png";
import ayapay from "../../assets/images/Payments/AyaPay.jpg";
import wavemoney from "../../assets/images/Payments/WavePay.jpg";
import { useTranslation } from "react-i18next";

const UpgradeToPremium = ({ onClose }) => {
  const { t } = useTranslation();
  useModalEscClose(onClose);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.height = "100vh";
    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
      document.documentElement.style.height = "auto";
    };
  }, []);

  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [selectedpayment, setSelectedPayment] = React.useState("KPay");
  const paymentOptions = [
    { name: "KPay", value: "KPay" },
    { name: "AYAPay", value: "AYAPay" },
    { name: "WaveMoney", value: "WaveMoney" },
  ];

  const paymentinfo = ({ selectedpayment }) => {
    if (selectedpayment === "KPay") {
      return (
        <div className="checkbox-fade p-4 bg-gray-100 rounded-md flex gap-4 items-start">
          <img
            src={kpay}
            alt="Payment"
            className="h-12 aspect-square object-center rounded-md"
          />
          <div className="">
            <div className="w-auto flex items-center gap-2">
              <BiPhone size={20} className="text-gray-500" />
              <span>09-123456789</span>
              {/* Copy button to copy the phone number */}
              <button
                className="ml-2 -translate-y-1 text-blue-600 hover:underline"
                onClick={() => {
                  navigator.clipboard.writeText("09123456789");
                  alert("Phone number copied to clipboard!");
                }}
              >
                <BiCopy />
              </button>
            </div>
            <div className="w-auto flex items-center gap-2">
              <CgProfile size={20} className="text-gray-500" />
              <span>NT Lyrics</span>
            </div>
          </div>
        </div>
      );
    } else if (selectedpayment === "AYAPay") {
      return (
        <div className="checkbox-fade p-4 bg-gray-100 rounded-md flex gap-4 items-start">
          <img
            src={ayapay}
            alt="Payment"
            className="h-12 aspect-square object-center rounded-md"
          />
          <div className="">
            <div className="w-auto flex items-center gap-2">
              <BiPhone size={20} className="text-gray-500" />
              <span>09-123456789</span>
              {/* Copy button to copy the phone number */}
              <button
                className="ml-2 -translate-y-1 text-blue-600 hover:underline"
                onClick={() => {
                  navigator.clipboard.writeText("09123456789");
                  alert("Phone number copied to clipboard!");
                }}
              >
                <BiCopy />
              </button>
            </div>
            <div className="w-auto flex items-center gap-2">
              <CgProfile size={20} className="text-gray-500" />
              <span>NT Lyrics</span>
            </div>
          </div>
        </div>
      );
    } else if (selectedpayment === "WaveMoney") {
      return (
        <div className="checkbox-fade p-4 bg-gray-100 rounded-md flex gap-4 items-start">
          <img
            src={wavemoney}
            alt="Payment"
            className="h-12 aspect-square object-center rounded-md"
          />
          <div className="">
            <div className="w-auto flex items-center gap-2">
              <BiPhone size={20} className="text-gray-500" />
              <span>09-123456789</span>
              {/* Copy button to copy the phone number */}
              <button
                className="ml-2 -translate-y-1 text-blue-600 hover:underline"
                onClick={() => {
                  navigator.clipboard.writeText("09123456789");
                  alert("Phone number copied to clipboard!");
                }}
              >
                <BiCopy />
              </button>
            </div>
            <div className="w-auto flex items-center gap-2">
              <CgProfile size={20} className="text-gray-500" />
              <span>NT Lyrics</span>
            </div>
          </div>
        </div>
      );
    }
  };

  const [selectedDuration, setSelectedDuration] = React.useState("6");
  const durationOptions = [
    { name: "6 Months", value: "6" },
    { name: "12 Months", value: "12" },
  ];

  const [uploadedFile, setUploadedFile] = React.useState(null);

  console.log("Uploaded File:", uploadedFile);

  const [errorMessage, setErrorMessage] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState(""); 

  const validateForm = () => {
    if (!phoneNumber) {
      setErrorMessage(t("upgradePremium.validation.phoneRequired"));
      return false;
    }
    const phoneRegex = /^(09|\+?959)\d{7,9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setErrorMessage(t("upgradePremium.validation.phoneInvalid"));
      return false;
    }
    if (!selectedpayment) {
      setErrorMessage(t("upgradePremium.validation.paymentRequired"));
      return false;
    }
    if (!selectedDuration) {
      setErrorMessage(t("upgradePremium.validation.durationRequired"));
      return false;
    }
    if (!uploadedFile) {
      setErrorMessage(t("upgradePremium.validation.fileRequired"));
      return false;
    }
    setErrorMessage("");
    return true;
  };

  return (
    <>
      <ModalPortal>
        <AnimatePresence>
          <motion.div
            key="modal-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex justify-center items-center p-4"
            // 👆 changed to items-end so modal is aligned to bottom
          >
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-[#00000050]"
              onClick={onClose}
            />

            {/* Modal Box */}
            <motion.div
              key="box"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-white p-6 rounded-lg shadow-lg relative z-[101] w-full max-w-md"
            >
              <div className="header flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {t("upgradePremium.title")}
                </h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={onClose}
                >
                  <BiX size={24} />
                </button>
              </div>
              {/* Body content */}
              <div className="flex flex-col gap-2">
                <hr className="border-gray-300 border-dashed" />

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

                <InputField
                  label={t("upgradePremium.phoneNumber")}
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  placeholder={t("upgradePremium.phoneNumberPlaceholder")}
                  required={true}
                />

                <DropdownField
                  label={t("upgradePremium.duration")}
                  value={selectedDuration}
                  options={durationOptions}
                  onChange={setSelectedDuration}
                  required={true}
                />

                <DropdownField
                  label={t("upgradePremium.paymentMethod")}
                  value={selectedpayment}
                  options={paymentOptions}
                  onChange={setSelectedPayment}
                  required={true}
                />

                <div className="w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    {t("upgradePremium.uploadAValidPaymentProof")}
                    <span className="pl-1 text-red-500">
                      {t("upgradePremium.uploadFileRequired")}
                    </span>
                  </label>
                  <input
                    type="file"
                    // onChange={(e) => setUploadedFile(e.target.files[0])}
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;

                      const fileSizeMB = file.size / 1024 / 1024;

                      // If already less than or equal to 3MB, skip compression
                      if (fileSizeMB <= 3) {
                        setUploadedFile(file);
                        return;
                      }

                      const options = {
                        maxSizeMB: 3,
                        maxWidthOrHeight: 1920, // Optional: Resize large images
                        useWebWorker: true,
                      };

                      try {
                        const compressedFile = await imageCompression(
                          file,
                          options
                        );
                        setUploadedFile(compressedFile);
                      } catch (error) {
                        console.error("Image compression failed:", error);
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  {/* Notice */}
                  <p className="mt-1 text-sm text-gray-500">
                    {t("upgradePremium.uploadNotice")}
                  </p>
                </div>

                {paymentinfo({ selectedpayment })}

                <button
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-4"
                  onClick={() => {
                    if (validateForm()) {
                      // Form is valid, proceed with submission logic
                      setSuccessMessage(
                        "Your upgrade request has been submitted!"
                      );
                      setErrorMessage("");
                      // Clear form fields
                      setPhoneNumber("");
                      setSelectedPayment("KPay");
                      setSelectedDuration("6");
                      setUploadedFile(null);

                      // Optionally close the modal 3 seconds after submission
                      setTimeout(() => {
                        onClose();
                      }, 3000);
                    }
                  }}
                >
                  {t("upgradePremium.upgradeButton")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </ModalPortal>
    </>
  );
};

UpgradeToPremium.propTypes = {
  onClose: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  showNewMessage: PropTypes.func.isRequired,
};

export default UpgradeToPremium;
