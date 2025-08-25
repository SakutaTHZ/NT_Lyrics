import { useState } from "react";
import MessagePopup from "../../../components/common/MessagePopup";
import { Chart } from "primereact/chart";

const PaymentsTab = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState("success");

  const [requestCount, setRequestCount] = useState({
    totalCount: 30,
    countDiff: 5,
    totalPending: 10,
    totalApproved: 20,
  });

  const chartData = {
    labels: ["Pending", "Approved"],
    datasets: [
      {
        data: [
          10,
          20,
        ],
        backgroundColor: ["#42A5F5", "#66BB6A"],
        hoverBackgroundColor: ["#64B5F6", "#81C784"],
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
        <MessagePopup message_type={messageType} message_text={messageText} />
      )}

      {/* Stats */}
            <div className="w-full flex flex-col md:flex-row gap-2 md:gap-4">
              <div className="relative border border-gray-200 rounded-lg shadow-sm w-full bg-white">
                <p className="p-3 bg-gray-100 text-gray-600 font-medium rounded-t-lg">
                  Total Requests
                </p>
                <div className="p-5 h-fit flex flex-col md:flex-row gap-2 items-center justify-between">
                  <div className="flex flex-wrap h-full w-full">
                    <div>
                      <p className="font-extrabold text-3xl text-gray-800">
                        {requestCount.totalCount}
                      </p>
                      <p className="mt-2 text-sm text-green-600 flex items-center">
                        <span className="font-medium">+{requestCount.countDiff}</span>
                        <span className="ml-1 text-gray-500">
                          users vs last month
                        </span>
                      </p>
                    </div>
                    <div className="md:ml-4 flex flex-wrap gap-2 p-2 rounded-md md:border-l-2 border-gray-200">
                      <div className="flex items-center md:px-4 gap-3">
                        <p className="min-w-16 text-center text-blue-500 text-2xl font-bold bg-blue-50 p-3 rounded-md">
                          {requestCount.totalPending}
                        </p>
                        <div className="flex items-center">Pending</div>
                      </div>
      
                      <div className="flex items-center md:px-4 gap-3">
                        <p className="min-w-16 text-center text-green-500 text-2xl font-bold bg-green-50 p-3 rounded-md">
                          {requestCount.totalApproved}
                        </p>
                        <div className="flex items-center">Approved</div>
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
    </div>
  );
};
export default PaymentsTab;
