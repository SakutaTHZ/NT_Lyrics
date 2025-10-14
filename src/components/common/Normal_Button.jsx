import PropTypes from "prop-types";
import { BsHeartFill } from "react-icons/bs";

const Normal_Button = ({
  custom_class,
  onClick,
  text = "button",
  icon: Icon,
}) => {
  return (
    <>
      <button
        className={`w-fit flex gap-2 items-center justify-center p-2 rounded-md cursor-pointer border text-nowrap ${custom_class}`}
        onClick={onClick}
      >
        {Icon && (
          <Icon
            className={`w-fit ${
              Icon === BsHeartFill ? "animate-heart-pop" : ""
            }`}
          />
        )}
        {text != "" && <p className="w-full truncate">{text}</p>}
      </button>
    </>
  );
};

Normal_Button.propTypes = {
  custom_class: PropTypes.string,
  onClick: PropTypes.func,
  text: PropTypes.string,
  icon: PropTypes.elementType,
};

export default Normal_Button;
