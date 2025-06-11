import { useState } from "react";
import PropTypes from "prop-types";
import { BsEye, BsEyeSlash } from "react-icons/bs";

const PasswordInput = ({
  value,
  onChange,
  disabled,
  placeholder = "Enter Password",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className={`w-full border p-2 rounded-md pr-10 my-1 
    ${
      disabled
        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
        : "border-gray-300 text-black"
    }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
      <button
        type="button"
        className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <BsEye size={20} /> : <BsEyeSlash size={20} />}
      </button>
    </div>
  );
};

PasswordInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};

export default PasswordInput;
