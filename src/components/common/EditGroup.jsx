import PropTypes from "prop-types";

const EditGroup = ({ groupName, onClose }) => {
  return (
    <div className="fixed flex justify-center items-center top-0 left-0 w-full h-full bg-[#00000080] z-50">
      <div className="animate-down-start w-full h-full py-4 md:pt-16 px-4 md:px-24 c-bg rounded-md">
        <div className="flex items-center w-full justify-between mb-4">
          <h2>Edit Group: {groupName}</h2>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};
EditGroup.propTypes = {
  groupName: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default EditGroup;
