import PropTypes from 'prop-types';

const InputField = ({ label, value, onChange, placeholder, required, disabled ,customClass="c-border" }) => (
    <div>
      <label className="block mb-2 text-sm font-medium opacity-80">{label}{required && (<span className="pl-1 text-red-500">*</span>)}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full p-2 border rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed ${customClass}`}
        disabled={disabled}
      />
    </div>
  );

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
    customClass: PropTypes.string,
};

export default InputField;