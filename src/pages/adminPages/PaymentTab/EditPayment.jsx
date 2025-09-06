import PropTypes from "prop-types";
import { useEffect } from "react";
import { useState } from "react";
import ModalPortal from "../../../components/special/ModalPortal";
import useModalEscClose from "../../../components/hooks/useModalEscClose";
import { apiUrl, validateUser } from "../../../assets/util/api";
import { RoleTab } from "../UsersTab/UserRow";

const EditPayment = ({ onClose, request, onUpdate, showNewMessage }) => {
  useModalEscClose(onClose);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.height = "100vh";
    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
      document.documentElement.style.height = "auto";
    };
  }, []);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const getUser = async () => {
      try {
        const userData = await validateUser(request.userId, token);
        if (!userData) throw new Error("No user returned");
        console.log("Fetched user data:", userData);
        setUser(userData.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    getUser();
  }, [request.userId]);

  return (
    <>
      <ModalPortal>
        <div className="fixed inset-0 z-[100] flex justify-center items-center">
          <div
            className="absolute inset-0 bg-[#00000050]"
            // onClick={onClose}
          />
          <div className="bg-white p-6 rounded-lg shadow-lg relative z-[101] w-[1000px]">
            <h2 className="text-xl font-bold flex items-center justify-between">
              Payment
              <p className="flex items-center px-2 py-1 border border-gray-300 rounded-full">
                <span className="text-xs font-normal text-gray-700">
                  {request._id}
                </span>
              </p>
            </h2>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2">
                <img
                  src={request.paymentImage}
                  alt="Payment Proof"
                  className="w-full h-[500px] object-contain rounded-md mt-4"
                />
              </div>
              <div className="w-full md:w-1/2 flex flex-col gap-3 mt-4">
                <div className="p-4 border border-gray-200 rounded-md">
                  <h1 className="w-full pb-2 mb-2 text-lg font-semibold border-b border-dashed border-gray-300 flex items-center gap-2">
                    User Details
                  </h1>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                    <span className="font-medium text-gray-600">Name</span>
                    <span className="text-gray-900">{user?.name}</span>

                    <span className="font-medium text-gray-600">Email</span>
                    <span className="text-gray-900">{user?.email}</span>

                    <span className="font-medium text-gray-600">Role</span>
                    <span className="text-gray-900">
                      <RoleTab role={user?.role} />
                    </span>

                    {user?.role === "premium-user" && (
                      <>
                        <span className="font-medium text-gray-600">
                          Premium Start
                          </span>
                          <span className="text-gray-900">
                            {user?.premiumStartDate
                              ? new Date(user.premiumStartDate).toISOString().slice(0, 10)
                              : "-"}
                          </span>                                   
                        <span className="font-medium text-gray-600">
                          Premium End
                        </span>
                        <span className="text-gray-900">
                          {user?.premiumEndDate
                            ? new Date(user.premiumEndDate).toISOString().slice(0, 10)
                            : "-"}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-md">
                  <h1 className="pb-2 mb-2 text-lg font-semibold border-b border-dashed border-gray-300">
                    Payment Details
                  </h1>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                    <span className="font-medium text-gray-600">
                      Requested At
                    </span>
                    <span className="text-gray-900">
                      {new Date(request.requestedAt).toISOString().slice(0, 10)}
                      <span className="text-xs pl-2">
                        {new Date(request.requestedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </span>

                    <span className="font-medium text-gray-600">Phone</span>
                    <span className="text-gray-900">{request.phone}</span>

                    <span className="font-medium text-gray-600">
                      Payment Type
                    </span>
                    <span className="capitalize text-gray-900">
                      {request.paymentType}
                    </span>

                    <span className="font-medium text-gray-600">
                      Payment Plan
                    </span>
                    <span className="text-gray-900">
                      {request.durationInMonths} months
                    </span>

                    <span className="font-medium text-gray-600">Total</span>
                    <span className="text-gray-900 font-semibold">
                      {request.durationInMonths === 6
                        ? "10,000 Ks"
                        : request.durationInMonths === 12
                        ? "18,000 Ks"
                        : "???"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col mt-2">
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={async () => {
                    onUpdate();
                    onClose();
                  }}
                  className="w-full cursor-pointer mt-4 bg-red-200 text-red-700 font-semibold px-4 py-2 rounded"
                >
                  Reject
                </button>
                <button
                  onClick={async () => {
                    onUpdate();
                    onClose();
                  }}
                  className="w-full cursor-pointer mt-4 bg-green-200 text-green-700 font-semibold px-4 py-2 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={onClose}
                  className="w-full cursor-pointer mt-4 bg-gray-200 text-gray-500 font-semibold px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </ModalPortal>
    </>
  );
};

EditPayment.propTypes = {
  onClose: PropTypes.func.isRequired,
  request: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  showNewMessage: PropTypes.func.isRequired,
};

export default EditPayment;
