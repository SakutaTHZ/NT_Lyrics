import { BiCheckCircle, BiErrorCircle } from "react-icons/bi";
import PropTypes from "prop-types";
import { FiAlertCircle } from "react-icons/fi";
import { BsQuestionCircle } from "react-icons/bs";
import { createPortal } from "react-dom";

const portalRoot = document.getElementById("modal-root");

const MessagePopup = ({ custom_class = "", message_type = "", message_text = "There should be a message!" }) => {
  if (!portalRoot) return null;

  return createPortal(
    <>
      <div
        className={`animate-right-normal fixed top-16 right-0 shadow-sm flex items-start gap-4 md:gap-2 p-2 px-2 rounded-l-lg ${
          message_type === "error"
            ? "bg-red-50 "
            : message_type === "alert"
            ? "bg-yellow-50 "
            : message_type === "success"
            ? "bg-green-50 "
            : "bg-blue-50 "
        } z-50 w-fit max-w-3/4 ${custom_class}`}
      >
        {message_type === "error" ? (
          <BiErrorCircle className="flex-shrink-0 text-red-500" size={20} />
        ) : message_type === "alert" ? (
          <FiAlertCircle className="flex-shrink-0 text-yellow-500" size={20} />
        ) : message_type === "success" ? (
          <BiCheckCircle className="flex-shrink-0 text-green-500" size={20} />
        ) : (
          <BsQuestionCircle className="flex-shrink-0 text-blue-400" size={20} />
        )}
        <p className="text-pretty">{message_text}</p>
      </div>
    </>,
    portalRoot
  );
};

MessagePopup.propTypes = {
  custom_class: PropTypes.string,
  message_type: PropTypes.string,
  message_text: PropTypes.string,
};

export default MessagePopup;
