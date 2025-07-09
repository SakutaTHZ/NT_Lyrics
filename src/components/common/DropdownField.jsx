import PropTypes from 'prop-types';
import { Dropdown } from 'primereact/dropdown';

export const DropdownField = ({ label, value, options, onChange,required  }) => (
  <div className="w-full">
    <label className="block mb-1 text-sm font-medium text-gray-700">{label}{required && (<span className="pl-1 text-red-500">*</span>)}</label>
    <Dropdown
      value={value}
      options={options}
      onChange={(e) => onChange(e.value)}
      optionLabel="name"
      placeholder="Choose one ..."
      className="w-full capitalize-first-letter"
      showClear
    />
  </div>
);

DropdownField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
};

export default DropdownField;