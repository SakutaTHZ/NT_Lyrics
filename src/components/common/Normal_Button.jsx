import PropTypes from "prop-types";

const Normal_Button = ({
  custom_class,
  onClick,
  text = "button",
  icon: Icon,
}) => {
  return (
    <>
      <button
        className={`flex gap-2 items-center justify-center p-2 rounded-md cursor-pointer border ${custom_class}`}
        onClick={onClick}
      >
        {Icon && <Icon />} {text}
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
