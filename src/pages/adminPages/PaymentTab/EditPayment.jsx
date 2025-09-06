import PropTypes from "prop-types";
import { useEffect } from "react";
import { useState } from "react";
import ModalPortal from "../../../components/special/ModalPortal";
import useModalEscClose from "../../../components/hooks/useModalEscClose";
import { apiUrl } from "../../../assets/util/api";

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

  return (
    <>
      <ModalPortal>
        <div className="fixed inset-0 z-[100] flex justify-center items-center">
          <div
            className="absolute inset-0 bg-[#00000050]"
            // onClick={onClose}
          />
          <div className="bg-white p-6 rounded-lg shadow-lg relative z-[101] w-[800px]">
            <h2 className="text-xl font-bold flex items-center justify-between">
              Payment
              <p className="flex items-center px-2 py-1 border border-gray-300 rounded-full">
                <span className="text-xs font-normal text-gray-700">
                  {request._id}
                </span>
              </p>
            </h2>

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
