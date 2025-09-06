// components/UserRow.jsx
import { MdEdit } from "react-icons/md";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { validateUser } from "../../../assets/util/api";
import { RoleTab } from "../UsersTab/UserRow";
import kpay from "../../../assets/images/Payments/KpayLogo.png";
import ayapay from "../../../assets/images/Payments/AyaPay.jpg";
import wavemoney from "../../../assets/images/Payments/WavePay.jpg";

export const PaymentTab = ({ payment }) => {
  switch (payment) {
    case "KPay":
      return (
        <span
          className={`flex gap-2 items-center w-fit p-2 pr-3 text-xs rounded-full font-semibold bg-blue-100 text-blue-600`}
        >
          <img
            src={kpay}
            alt="Payment"
            className="h-4.5 aspect-square object-center rounded-full"
          />
          KPay
        </span>
      );
    case "AYAPay":
      return (
        <span
          className={`flex gap-2 items-center w-fit p-2 pr-3 text-xs rounded-full font-semibold bg-red-100 text-red-600`}
        >
          <img
            src={ayapay}
            alt="Payment"
            className="h-4.5 aspect-square object-center rounded-full"
          />
          AYAPay
        </span>
      );
    case "WaveMoney":
      return (
        <span
          className={`flex gap-2 items-center w-fit p-2 pr-3 text-xs rounded-full font-semibold bg-yellow-100 text-yellow-600`}
        >
          <img
            src={wavemoney}
            alt="Payment"
            className="h-4.5 aspect-square object-center rounded-full"
          />
          WaveMoney
        </span>
      );
    default:
      <span
        className={`px-2 py-1 text-xs rounded-full font-semibold bg-gray-100 text-gray-600`}
      >
        Unknown
      </span>;
  }
};

PaymentTab.propTypes = {
  payment: PropTypes.string.isRequired,
};

const PaymentRow = ({ request, idx, isLast, lastPaymentRef, onEdit }) => {
  const ref = isLast ? lastPaymentRef : null;
  // Fetch user details based on request.userId
  const [user, setUser] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");

    const getUser = async () => {
      try {
        const userData = await validateUser(request.userId, token);
        if (!userData) throw new Error("No user returned");
        setUser(userData.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    getUser();
  }, [request.userId]);

  return (
    <tr key={idx} ref={ref} className="hover:bg-gray-50 transition">
      <td className="px-4 py-3">{idx + 1}</td>
      <td className="px-4 py-3" title={request._id}>
        <p className="w-16 truncate">{request._id}</p>
      </td>
      <td className="px-4 py-3" title={request.userId}>
        <p className="w-16 truncate">{request.userId}</p>
      </td>
      <td className="px-4 py-3">{user.name}</td>
      <td className="px-4 py-3">{user.email}</td>
      <td className="px-4 py-3">{request.phone}</td>
      <td className="px-4 py-3">
        <RoleTab role={user.role} />
      </td>
      <td className="px-4 py-3">{request.durationInMonths}</td>
      <td className="px-4 py-3">
        <PaymentTab payment={request.paymentType} />
      </td>
      <td className="px-4 py-3">
        <img
          src={request.paymentImage}
          alt="Payment"
          className="w-12 h-12 object-cover"
        />
      </td>
      <td className="px-4 py-3">
        {request.requestedAt
          ? new Date(request.requestedAt).toISOString().slice(0, 10)
          : "-"}
          <br/>
        <span className="text-xs">
          {new Date(request.requestedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
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
