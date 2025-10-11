import PropTypes from 'prop-types';
import { MultiSelect } from 'primereact/multiselect';

export const MultiSelectField = ({ label, value, options, onChange, required }) => (
  <div className="w-full relative overflow-visible">
    <label className="block mb-1 text-sm font-medium text-gray-700">
      {label}
      {required && <span className="pl-1 text-red-500">*</span>}
    </label>
    <div className="relative">
      <MultiSelect
        value={value}
        options={options}
        onChange={(e) => onChange(e.value)}
        optionLabel="name"
        placeholder={`Select ${label}`}
        className="w-full"
        maxSelectedLabels={3}
        filter
        filterPlaceholder="Choose one..."
        appendTo="self"
        panelStyle={{  marginTop: "0.25rem" }} // 👈 ensures dropdown stays below input
      />
    </div>
  </div>
);

MultiSelectField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.array.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
};

export default MultiSelectField;