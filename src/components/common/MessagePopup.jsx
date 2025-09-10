import { BiCheckCircle, BiErrorCircle } from "react-icons/bi";
import PropTypes from "prop-types";
import { FiAlertCircle } from "react-icons/fi";
import { BsQuestionCircle } from "react-icons/bs";
import { createPortal } from "react-dom";

const portalRoot = document.getElementById("modal-root");

const MessagePopup = ({
  custom_class = "",
  message_type = "",
  children,
  closePopup = () => {},
}) => {
  if (!portalRoot) return null;

  return createPortal(
    <>
      <div className="animate-down fixed top-4 z-[1000] water-drop w-full h-12 rounded-full py-4 flex items-center justify-center" onClick={closePopup}>
        <div className={`waterDrop w-8 h-8  rounded-full shadow-lg mx-auto border ${
            message_type === "error"
              ? "bg-red-200 border-red-200"
              : message_type === "alert"
              ? "bg-yellow-200 border-yellow-200"
              : message_type === "success"
              ? "bg-green-200 border-green-200"
              : "bg-blue-200 border-blue-200"
          }`}></div>

        <div
          className={`expandBox absolute w-[90vw] md:w-[400px] top-0 flex justify-center items-start rounded-2xl border p-2 px-4 shadow-lg gap-4 md:gap-2 ${custom_class} ${
            message_type === "error"
              ? "bg-gradient-to-br from-white to-red-50 border-red-200"
              : message_type === "alert"
              ? "bg-gradient-to-br from-white to-yellow-50 border-yellow-200"
              : message_type === "success"
              ? "bg-gradient-to-br from-white to-green-50 border-green-200"
              : "bg-gradient-to-br from-white to-blue-50 border-blue-200"
          }`}
        >
          <div className="icon h-full flex items-center justify-center">
            {message_type === "error" ? (
              <BiErrorCircle className="flex-shrink-0 text-red-500" size={32} />
            ) : message_type === "alert" ? (
              <FiAlertCircle
                className="flex-shrink-0 text-yellow-500"
                size={32}
              />
            ) : message_type === "success" ? (
              <BiCheckCircle
                className="flex-shrink-0 text-green-500"
                size={32}
              />
            ) : (
              <BsQuestionCircle
                className="flex-shrink-0 text-blue-400"
                size={32}
              />
            )}
          </div>
          <div className="message_text flex-1">{children}</div>
        </div>
      </div>
    </>,
    portalRoot
  );
};

MessagePopup.propTypes = {
  custom_class: PropTypes.string,
  message_type: PropTypes.string,
  children: PropTypes.node,
  closePopup: PropTypes.func,
};

export default MessagePopup;
