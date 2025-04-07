import { Chart } from "primereact/chart";
import { useEffect, useState , useRef, useCallback } from "react";
import axios from "axios";

const UsersTab = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    const [loading, setLoading] = useState(false);
    const observer = useRef();
    const AUTH_TOKEN = localStorage.getItem("token");
  const lastUserRef = useCallback(
    (node) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          page < totalPages // 👈 only fetch if there's more
        ) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, totalPages, page]
  );

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:3000/api/users/search", {
          params: { page, limit: 10 },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
        });

        setUsers((prev) => [...prev, ...(res.data.users || [])]);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, AUTH_TOKEN]);

  const chartData = {
    labels: ["Free Users", "Premium Users"],
    datasets: [
      {
        data: [200, 100],
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
        position: "right", // Moves labels to the right side
      },
    },
  };

  return (
    <div>
      {/* Data preview */}
      <div className="w-full flex flex-col md:flex-row gap-2 md:gap-4">
        {/* Total Artists */}
        <div className="relative border border-gray-200 rounded-lg shadow-sm w-full bg-white">
          {/* Header */}
          <p className="p-3 bg-gray-100 text-gray-600 font-medium rounded-t-lg">
            Total Users
          </p>

          {/* Content Area */}
          <div className="p-5 h-fit flex flex-col md:flex-row gap-2 items-center justify-between">
            {/* Text Section */}
            <div className="flex h-full">
              <div>
                <p className="font-extrabold text-3xl text-gray-800">300</p>
                <p className="mt-2 text-sm text-green-600 flex flex-wrap items-center">
                  <span className="font-medium">+200</span>
                  <span className="ml-1 text-gray-500">
                    users vs last month
                  </span>
                </p>
              </div>
              {/* detail Users Counts */}
              <div className="ml-4 grid grid-cols-2 gap-2 p-2 rounded-md border-l-2 border-gray-200">
                <p className="text-right text-[#64B5F6] text-2xl font-bold pr-2">
                  200
                </p>{" "}
                <div className="flex items-center">Free Users</div>
                <p className="text-right text-[#81C784] text-2xl font-bold pr-2">
                  100
                </p>{" "}
                <div className="flex items-center">Premium Users</div>
              </div>
            </div>

            {/* Chart Section */}
            <Chart
              type="pie"
              data={chartData}
              options={chartOptions}
              style={{ width: "200px", height: "100px" }}
            />
          </div>
        </div>
      </div>

      <div className="tableContainer border border-gray-200 rounded-md shadow-sm w-full h-fit mt-4 p-4 overflow-x-auto">
        <table className="min-w-full bg-white text-sm text-left">
          <thead className="bg-gray-100 text-xs text-gray-600 uppercase">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Is Active</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user, idx) => {
              const isLast = idx === users.length - 1;
              return (
                <tr
                  key={user._id}
                  ref={isLast ? lastUserRef : null}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">{idx + 1}</td>
                  <td className="px-4 py-3">{user._id}</td>
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3 capitalize">{user.role}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-semibold ${
                        user.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-blue-600 hover:underline text-sm">
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
            {loading && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  Loading more users...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTab;
