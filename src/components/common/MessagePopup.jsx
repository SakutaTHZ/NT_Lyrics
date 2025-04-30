import { BiCheckCircle, BiErrorCircle } from "react-icons/bi";
import PropTypes from "prop-types";
import { FiAlertCircle } from "react-icons/fi";
import { BsQuestionCircle } from "react-icons/bs";

const MessagePopup = ({ custom_class = "", message_type = "", message_text = "There should be a message!" }) => {
  return (
    <>
      <div
        className={`animate-right-normal fixed top-16 right-0 shadow-sm flex items-center gap-4 md:gap-2 p-2 px-4 rounded-l-lg ${
          message_type === "error"
            ? "bg-red-50 "
            : message_type === "alert"
            ? "bg-yellow-50 "
            : message_type === "success"
            ? "bg-green-50 "
            : "bg-blue-50 "
        } z-[10000] w-fit max-w-3/4 ${custom_class}`}
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
    </>
  );
};

MessagePopup.propTypes = {
  custom_class: PropTypes.string,
  message_type: PropTypes.string,
  message_text: PropTypes.string,
};

export default MessagePopup;
