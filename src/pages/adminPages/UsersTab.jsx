import { Chart } from "primereact/chart";
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { SelectButton } from "primereact/selectbutton";
import useDebounce from "../../components/hooks/useDebounce";
import UserRow from "./UserRow";
import AddNewUser from "./AddNewUser";

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [usersCount, setUsersCount] = useState({
    totalCount: 0,
    totalAdminUsersCount: 0,
    totalFreeUsersCount: 0,
    totalPremiumUsersCount: 0,
    countDiff: 0,
    totalValidCount: 0,
    totalInvalidCount: 0,
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const [roleFilter, setRoleFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm);

  const AUTH_TOKEN = useRef(localStorage.getItem("token"));
  const observer = useRef();

  const getUserOverview = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/users/getUserOverview",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AUTH_TOKEN.current}`,
          },
        }
      );
      setUsersCount(res.data);
      console.log("User Overview:", res.data);
    } catch (err) {
      console.error("Error fetching user overview:", err);
    }
  };

  // Fetch users function
  const fetchUsers = async (pageNum = 1, override = false) => {
    getUserOverview();
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/users/search", {
        params: {
          page: pageNum,
          limit: 20,
          role: roleFilter,
          keyword: debouncedSearchTerm,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN.current}`,
        },
      });

      setUsers((prev) =>
        override || pageNum === 1
          ? res.data.users
          : [...prev, ...res.data.users]
      );
      setTotalPages(res.data.totalPages);
      setInitialLoadDone(true);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Infinite scroll observer
  const lastUserRef = useCallback(
    (node) => {
      if (loading || page >= totalPages) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, totalPages, page]
  );

  // Reset data when filter or search term changes
  useEffect(() => {
    setUsers([]);
    setPage(1);
    setTotalPages(null);
    setInitialLoadDone(false);
  }, [roleFilter, debouncedSearchTerm]);

  // Fetch users when page changes or filters update
  useEffect(() => {
    fetchUsers(page);
  }, [page, roleFilter, debouncedSearchTerm]);

  const chartData = {
    labels: [`Free Users`, `Premium Users`, `Admin`],
    datasets: [
      {
        data: [
          usersCount.totalFreeUsersCount,
          usersCount.totalPremiumUsersCount,
          usersCount.totalAdminUsersCount,
        ],
        backgroundColor: ["#42A5F5", "#66BB6A", "#e7000b"],
        hoverBackgroundColor: ["#64B5F6", "#81C784", "#e7000b"],
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

  const roles = [
    { name: `All (${usersCount.totalCount})`, value: "all" },
    { name: `Free (${usersCount.totalFreeUsersCount})`, value: "free-user" },
    { name: `Premium (${usersCount.totalPremiumUsersCount})`, value: "premium-user" },
  ];

  const [selectedUser, setSelectedUser] = useState(null);
  const handleEdit = (user) => {
    setSelectedUser(user);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  return (
    <div>
      {/* Stats */}
      <div className="w-full flex flex-col md:flex-row gap-2 md:gap-4">
        <div className="relative border border-gray-200 rounded-lg shadow-sm w-full bg-white">
          <p className="p-3 bg-gray-100 text-gray-600 font-medium rounded-t-lg">
            Total Users
          </p>
          <div className="p-5 h-fit flex flex-col md:flex-row gap-2 items-center justify-between">
            <div className="flex flex-wrap h-full w-full">
              <div>
                <p className="font-extrabold text-3xl text-gray-800">
                  {usersCount.totalCount}
                </p>
                <p className="mt-2 text-sm text-green-600 flex flex-wrap items-center">
                  <span className="font-medium">+{usersCount.countDiff}</span>
                  <span className="ml-1 text-gray-500">
                    users vs last month
                  </span>
                </p>
              </div>
              <div className="md:ml-4 flex flex-wrap gap-2 p-2 rounded-md md:border-l-2 border-gray-200">
                <div className="flex items-center md:px-4 gap-3">
                  <p className="min-w-16 text-center text-blue-500 text-2xl font-bold bg-blue-50 p-3 rounded-md">
                    {usersCount.totalFreeUsersCount}
                  </p>
                  <div className="flex items-center">Free Users</div>
                </div>

                <div className="flex items-center md:px-4 gap-3">
                  <p className="min-w-16 text-center text-green-500 text-2xl font-bold bg-green-50 p-3 rounded-md">
                    {usersCount.totalPremiumUsersCount}
                  </p>
                  <div className="flex items-center">Premium Users</div>
                </div>

                <div className="flex items-center md:px-4 gap-3">
                  <p className="min-w-16 text-center text-red-500 text-2xl font-bold bg-red-50 p-3 rounded-md">
                    {usersCount.totalAdminUsersCount}
                  </p>
                  <div className="flex items-center">Admin Users</div>
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
      <div className="filters">
        <div className="flex items-center justify-between mt-4">
          <p className="text-gray-600 font-semibold">Filters</p>
        </div>
        <div className="flex gap-4 mt-2 items-center">
          <div className="flex-shrink-0">
            <SelectButton
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.value || "admin")}
              optionLabel="name"
              options={roles}
            />
          </div>
          <input
            type="text"
            placeholder="Search by name or email"
            className="border border-gray-300 rounded-md px-3 py-2 w-full h-[42px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="tableContainer border border-gray-200 rounded-md shadow-sm w-full h-[calc(100vh-180px)] mt-4 overflow-x-auto sticky top-12">
        <table className="min-w-full bg-white text-sm text-left">
          <thead className="thead-shadow text-xs text-gray-600 uppercase">
            <tr className="sticky top-0 bg-gray-100 z-10">
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
                <UserRow
                  key={user._id || idx}
                  user={user}
                  idx={idx}
                  isLast={isLast}
                  lastUserRef={lastUserRef}
                  onEdit={handleEdit}
                />
              );
            })}
            {loading && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  Loading more users...
                </td>
              </tr>
            )}
            {!loading && users.length === 0 && initialLoadDone && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-4 text-gray-400 italic"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {selectedUser && (
        <AddNewUser
          onClose={closeModal}
          user={selectedUser}
          onUpdate={() => fetchUsers(1, true)} // reset to page 1 and override
        />
      )}
    </div>
  );
};

export default UsersTab;
