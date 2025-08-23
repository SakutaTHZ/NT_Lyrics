import React, { useEffect } from "react";
import PropTypes from "prop-types";
import ModalPortal from "../../components/special/ModalPortal";
import useModalEscClose from "../../components/hooks/useModalEscClose";
import { BiX } from "react-icons/bi";
import { AnimatePresence, motion } from "framer-motion";
import InputField from "./InputField";
import DropdownField from "./DropdownField";
import imageCompression from "browser-image-compression";

const UpgradeToPremium = ({ onClose }) => {
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

  const [selectedDuration, setSelectedDuration] = React.useState("6");
  const durationOptions = [
    { name: "6 Months", value: "6" },
    { name: "12 Months", value: "12" },
  ];
  
const [uploadedFile, setUploadedFile] = React.useState(null);

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
                <h2 className="text-xl font-semibold">Upgrade to Premium</h2>
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
                <InputField
                  label="Phone Number"
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  placeholder="Enter Your Payment Phone Number"
                  required={true}
                />

                <DropdownField
                  label="Select Premium Duration"
                  value={selectedDuration}
                  options={durationOptions}
                  onChange={setSelectedDuration}
                  required={true}
                />

                <DropdownField
                  label="Payment Method"
                  value={selectedpayment}
                  options={paymentOptions}
                  onChange={setSelectedPayment}
                  required={true}
                />

                <div className="w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Upload Lyric File
                    <span className="pl-1 text-red-500">*</span>
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
                </div>
                <button
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-4"
                  onClick={() => {
                    console.log("Upgrade Clicked");
                  }}
                >
                  Upgrade Now
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
