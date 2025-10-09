import PropTypes from "prop-types";
import { Dropdown } from "primereact/dropdown";

export const DropdownField = ({
  label,
  value,
  options,
  onChange,
  required,
  disabled,
}) => (
  <div className="w-full c-dd">
    <label className="block mb-2 text-sm font-medium opacity-80">
      {label}
      {required && <span className="pl-1 text-red-500">*</span>}
    </label>
    <Dropdown
      value={value}
      options={options}
      onChange={(e) => onChange(e.value)}
      optionLabel="name"
      placeholder="Choose one ..."
      className="w-full capitalize-first-letter c-bg c-border"
      disabled={disabled}
      showClear
      appendTo="self"
    />
  </div>
);

DropdownField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default DropdownField;
