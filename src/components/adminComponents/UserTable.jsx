import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { MultiStateCheckbox } from "primereact/multistatecheckbox";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
// import axios from "axios";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const AUTH_TOKEN = localStorage.getItem("token"); // Replace with your actual token

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users/search", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AUTH_TOKEN}`, // Ensure proper auth header
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        setUsers(data); // Store fetched users in state
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, [AUTH_TOKEN]);
  const [searchTerm, setSearchTerm] = useState("");
  const [emailSearch, setEmailSearch] = useState("");
  const [editModes, setEditModes] = useState({});


  const toggleEdit = (userId) => {
    setEditModes((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      user.email.toLowerCase().includes(emailSearch.toLowerCase())
  );

  const profilePicTemplate = (rowData) => (
    <img
      src={rowData.profilePic}
      alt="Profile"
      className="w-10 h-10 rounded-full"
    />
  );

  const nameTemplate = (rowData) =>
    editModes[rowData._id] ? (
      <InputText
        value={rowData.name}
        onChange={(e) => {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user._id === rowData._id
                ? { ...user, name: e.target.value }
                : user
            )
          );
        }}
      />
    ) : (
      <span>{rowData.name}</span>
    );

  const emailTemplate = (rowData) =>
    editModes[rowData._id] ? (
      <InputText
        value={rowData.email}
        onChange={(e) => {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user._id === rowData._id
                ? { ...user, email: e.target.value }
                : user
            )
          );
        }}
      />
    ) : (
      <span>{rowData.email}</span>
    );

  const isActiveTemplate = (rowData) => (
    <Checkbox checked={rowData.isActive} disabled />
  );

  const roleTemplate = (rowData) =>
    editModes[rowData._id] ? (
      <MultiStateCheckbox
        value={rowData.role}
        options={[
          { value: "admin", icon: "pi pi-lock", label: "Admin" },
          { value: "free", icon: "pi pi-user", label: "Free" },
          { value: "premium", icon: "pi pi-star", label: "Premium" },
        ]}
        optionValue="value"
        onChange={(e) => {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user._id === rowData._id ? { ...user, role: e.value } : user
            )
          );
        }}
      />
    ) : (
      <span className="font-bold">{rowData.role}</span>
    );

  const actionTemplate = (rowData) =>
    editModes[rowData._id] ? (
      <div className="flex gap-2">
        <Button
          icon="pi pi-check"
          className="p-button-sm p-button-success p-button-text"
          onClick={() => {
            toggleEdit(rowData._id);
          }}
        />
        <Button
          icon="pi pi-times"
          className="p-button-sm p-button-danger p-button-text"
          onClick={() => toggleEdit(rowData._id)}
        />
      </div>
    ) : (
      <Button
        icon="pi pi-pencil"
        className="p-button-sm p-button-text p-button-black"
        onClick={() => toggleEdit(rowData._id)}
      />
    );

  return (
    <div className="card">
      <div className="flex gap-4 mb-3">
        <InputText
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Name"
          className="p-inputtext-sm"
        />
        <InputText
          value={emailSearch}
          onChange={(e) => setEmailSearch(e.target.value)}
          placeholder="Search by Email"
          className="p-inputtext-sm"
        />
      </div>

      <DataTable
        value={filteredUsers.map((user, index) => ({
          ...user,
          serialId: index + 1,
        }))}
        paginator
        rows={5}
        responsiveLayout="scroll"
      >
        <Column field="serialId" header="ID" sortable style={{ width: "5%" }} />
        <Column field="email" header="Email" body={emailTemplate} sortable />
        <Column field="name" header="Name" body={nameTemplate} sortable />
        <Column field="role" header="Role" body={roleTemplate} />
        <Column field="isActive" header="Active" body={isActiveTemplate} />
        <Column field="profilePic" header="Profile" body={profilePicTemplate} />
        <Column header="Actions" body={actionTemplate} />
      </DataTable>
    </div>
  );
};

export default UserTable;
