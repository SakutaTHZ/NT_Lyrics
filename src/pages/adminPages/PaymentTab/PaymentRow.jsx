// components/UserRow.jsx
import { MdEdit } from "react-icons/md";
import PropTypes from "prop-types";

const PaymentRow = ({ request, idx, isLast, lastPaymentRef, onEdit }) => {
  const ref = isLast ? lastPaymentRef : null;

  return (
    <tr key={idx} ref={ref} className="hover:bg-gray-50 transition">
      <td className="px-4 py-3">{idx + 1}</td>
      <td className="px-4 py-3">{request.userId}</td>
      <td className="px-4 py-3">{request.durationInMonths}</td>
      <td className="px-4 py-3">{request.paymentType}</td>
      <td className="px-4 py-3">{request.paymentImage}</td>
      <td className="px-4 py-3">
        {request.createdAt
          ? new Date(request.createdAt).toISOString().slice(0, 10)
          : "-"}
      </td>
      <td className="px-4 py-3">
        <button
          className="w-full flex items-center justify-center p-2 rounded-md text-blue-600 bg-blue-50 hover:underline text-sm cursor-pointer"
          onClick={() => onEdit(request)}
        >
          <MdEdit size={16} />
        </button>
      </td>
    </tr>
  );
};

PaymentRow.propTypes = {
  request: PropTypes.object.isRequired,
  idx: PropTypes.number.isRequired,
  isLast: PropTypes.bool,
  lastPaymentRef: PropTypes.any,
  onEdit: PropTypes.func.isRequired,
};

export default PaymentRow;
