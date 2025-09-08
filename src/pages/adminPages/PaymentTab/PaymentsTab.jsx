import { useCallback, useEffect, useRef, useState } from "react";
import MessagePopup from "../../../components/common/MessagePopup";
import { Chart } from "primereact/chart";
import useDebounce from "../../../components/hooks/useDebounce";
import axios from "axios";
import { apiUrl, fetchPaymentOverview } from "../../../assets/util/api";
import { BiSearch } from "react-icons/bi";
import PaymentRow from "./PaymentRow";
import EditPayment from "./EditPayment";

const PaymentsTab = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState("success");

  const [requests, setRequests] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm);

  const AUTH_TOKEN = useRef(localStorage.getItem("token"));
  const observer = useRef(null);

  const [paymentCount, setPaymentCount] = useState({
    totalCount: 0,
    requestCount: 0,
    approveCount: 0,
    rejectCount: 0,
  });

  const getPaymentOverview = async () => {
    try {
      const counts = await fetchPaymentOverview(localStorage.getItem("token"));
      setPaymentCount(counts);
    } catch (err) {
      console.error("Error fetching user overview:", err);
    }
  };

  const showNewMessage = (type, message) => {
    setMessageText(message);
    setMessageType(type);
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 10000);
  };

  const [selectedRequest, setSelectedRequest] = useState(null);
  const handleEdit = (request) => setSelectedRequest(request);
  const closeModal = () => setSelectedRequest(null);

  const fetchRequests = async (pageNum = 1, override = false) => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/paymentRequests/getAll`, {
        params: {
          page: pageNum,
          limit: 20,
          // keyword: debouncedSearchTerm,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN.current}`,
        },
      });

      const fetchedRequests = res.data.paymentRequests;
      setRequests((prev) =>
        override || pageNum === 1
          ? fetchedRequests
          : [...prev, ...fetchedRequests]
      );
      setTotalPages(res.data.totalPages);
      setInitialLoadDone(true);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const lastPaymentRef = useCallback(
    (node) => {
      if (loading || page >= totalPages) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, totalPages, page]
  );

  // Reset on filter or search
  useEffect(() => {
    getPaymentOverview();
    setRequests([]);
    setPage(1);
    setTotalPages(null);
    setInitialLoadDone(false);
  }, [debouncedSearchTerm]);

  // Fetch data
  useEffect(() => {
    getPaymentOverview();
    fetchRequests(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearchTerm]);

  const chartData = {
    labels: ["Rejected", "Approved"],
    datasets: [
      {
        data: [paymentCount?.rejectCount, paymentCount?.approveCount],
        backgroundColor: ["#ef4444", "#66BB6A"],
        hoverBackgroundColor: ["#dc2626", "#81C784"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
      },
    },
  };

  return (
    <div>
      {showMessage && (
        <MessagePopup
          message_type={messageType}
          isVisible={showMessage}
          closePopup={() => setShowMessage(false)}
        >
          <div className="message_text text-pretty text-left">
            {messageText.split("\n").map((line, index) => (
              <span key={index}>{line}</span>
            ))}
          </div>
        </MessagePopup>
      )}

      {/* Stats */}
      <div className="w-full flex flex-col md:flex-row gap-2 md:gap-4">
        <div className="relative border border-gray-200 rounded-lg shadow-sm w-full bg-white">
          <p className="p-3 bg-gray-100 text-gray-600 font-medium rounded-t-lg">
            Total Requests
          </p>
          <div className="p-5 h-fit flex flex-col md:flex-row gap-2 items-center justify-between">
            <div className="flex flex-wrap h-full w-full">
              <div className="md:ml-4 flex flex-wrap gap-2 p-2 ">
                <div className="flex items-center md:px-4 gap-3">
                  <p className="min-w-16 text-center text-blue-500 text-2xl font-bold bg-blue-50 p-3 rounded-md">
                    {paymentCount?.requestCount}
                  </p>
                  <div className="flex items-center">Requests</div>
                </div>

                <div className="flex items-center md:px-4 gap-3">
                  <p className="min-w-16 text-center text-green-500 text-2xl font-bold bg-green-50 p-3 rounded-md">
                    {paymentCount?.approveCount}
                  </p>
                  <div className="flex items-center">Approved</div>
                </div>

                <div className="flex items-center md:px-4 gap-3">
                  <p className="min-w-16 text-center text-red-500 text-2xl font-bold bg-red-50 p-3 rounded-md">
                    {paymentCount?.rejectCount}
                  </p>
                  <div className="flex items-center">Rejected</div>
                </div>
              </div>
            </div>
            <Chart
              type="pie"
              data={chartData}
              options={chartOptions}
              style={{ width: "300px", height: "100px" }}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters mt-4">
        <p className="text-gray-600 font-semibold mb-2">Filters</p>
        <div className="flex flex-wrap md:flex-nowrap gap-4 mt-2 items-center">
          <input
            type="text"
            placeholder="Search by name"
            className="border border-gray-300 rounded-md px-3 py-2 w-full h-[42px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="tableContainer border border-gray-200 rounded-md shadow-sm w-full h-[calc(100vh-180px)] mt-4 overflow-x-auto sticky top-12">
        <table className="min-w-full bg-white text-sm text-left">
          <thead className="thead-shadow text-xs text-gray-600 uppercase sticky top-0 bg-gray-100 z-10">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">PaymentID</th>
              <th className="px-4 py-3">UserID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Tier</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Payment Type</th>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Requested At</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requests.map((request, idx) => {
              const isLast = idx === requests.length - 1;
              return (
                <PaymentRow
                  key={idx}
                  request={request}
                  idx={idx}
                  isLast={isLast}
                  lastPaymentRef={lastPaymentRef}
                  onEdit={handleEdit}
                />
              );
            })}
            {loading && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  <div className="text-center py-4 text-gray-500 flex items-center justify-center gap-2">
                    <BiSearch
                      style={{
                        display: "inline-block",
                        animation: "wave 3s infinite",
                      }}
                    />
                    Searching more users...
                  </div>
                </td>
              </tr>
            )}
            {!loading && requests.length === 0 && initialLoadDone && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-4 text-gray-400 italic"
                >
                  No Requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {selectedRequest && (
        <EditPayment
          onClose={closeModal}
          request={selectedRequest}
          onUpdate={() => {
            setRequests([]);
            setPage(1);
            fetchRequests(1, true); // force reload page 1
            getPaymentOverview(); // also refresh stats
          }}
          showNewMessage={showNewMessage}
        />
      )}
    </div>
  );
};
export default PaymentsTab;
