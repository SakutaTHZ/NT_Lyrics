import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { MultiStateCheckbox } from "primereact/multistatecheckbox";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
// import axios from "axios";

const UserTable = () => {
  const [users, setUsers] = useState([
    {
      User_Id: 1,
      Email: "user1@example.com",
      Name: "John Doe",
      Profile_Pic: "https://randomuser.me/api/portraits/men/1.jpg",
      Role: "Admin",
      isActive: true,
      Collection_Cnt: 5,
    },
    {
      User_Id: 2,
      Email: "user2@example.com",
      Name: "Jane Smith",
      Profile_Pic: "https://randomuser.me/api/portraits/women/2.jpg",
      Role: "Free",
      isActive: false,
      Collection_Cnt: 8,
    },
    {
      User_Id: 3,
      Email: "user3@example.com",
      Name: "Alice Brown",
      Profile_Pic: "https://randomuser.me/api/portraits/women/3.jpg",
      Role: "Premium",
      isActive: true,
      Collection_Cnt: 12,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [emailSearch, setEmailSearch] = useState("");
  const [editModes, setEditModes] = useState({}); // Tracks which rows are being edited

  const updateUser = async (user) => {
    console.log(user);
    //   try {
    //     const response = await axios.put(`/api/users/${user.User_Id}`, user);
    //     console.log("Updated successfully:", response.data);
    //   } catch (error) {
    //     console.error("Error updating user:", error);
    //   }
  };

  const toggleEdit = (userId) => {
    setEditModes((prev) => {
      const isEditing = prev[userId];

      if (!isEditing) {
        const originalUser = users.find((user) => user.User_Id === userId);
        // Make a shallow copy of users and update the specific user
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.User_Id === userId ? { ...user, ...originalUser } : user
          )
        );
      }

      return {
        ...prev,
        [userId]: !isEditing, // Toggle edit mode
      };
    });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.Name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      user.Email.toLowerCase().includes(emailSearch.toLowerCase())
  );

  const profilePicTemplate = (rowData) => (
    <img
      src={rowData.Profile_Pic}
      alt="Profile"
      className="w-10 h-10 rounded-full"
    />
  );

  const nameTemplate = (rowData) => {
    if (editModes[rowData.User_Id]) {
      return (
        <InputText
          value={rowData.Name}
          onChange={(e) => {
            setUsers((prevUsers) =>
              prevUsers.map((user) =>
                user.User_Id === rowData.User_Id
                  ? { ...user, Name: e.target.value }
                  : user
              )
            );
          }}
        />
      );
    }
    return <span>{rowData.Name}</span>;
  };

  const emailTemplate = (rowData) => {
    if (editModes[rowData.User_Id]) {
      return (
        <InputText
          value={rowData.Email}
          onChange={(e) => {
            setUsers((prevUsers) =>
              prevUsers.map((user) =>
                user.User_Id === rowData.User_Id
                  ? { ...user, Email: e.target.value }
                  : user
              )
            );
          }}
        />
      );
    }
    return <span>{rowData.Email}</span>;
  };

  const isActiveTemplate = (rowData) => {
    return <Checkbox checked={rowData.isActive} disabled />;
  };

  const roleTemplate = (rowData) => {
    const roleOptions = [
      { value: "Admin", icon: "pi pi-lock", label: "Admin" },
      { value: "Free", icon: "pi pi-user", label: "Free" },
      { value: "Premium", icon: "pi pi-star", label: "Premium" },
    ];

    if (!editModes[rowData.User_Id]) {
      return <span className="font-bold">{rowData.Role}</span>;
    }

    return (
      <div className="flex items-center gap-2">
        <MultiStateCheckbox
          value={rowData.Role}
          options={roleOptions}
          optionValue="value"
          onChange={(e) => {
            setUsers((prevUsers) =>
              prevUsers.map((user) =>
                user.User_Id === rowData.User_Id
                  ? { ...user, Role: e.value }
                  : user
              )
            );
          }}
          className="custom-checkbox"
        />
      </div>
    );
  };

  const actionTemplate = (rowData) => {
    const isEditing = editModes[rowData.User_Id];
  
    return isEditing ? (
      <div className="flex gap-2">
        <Button
          icon="pi pi-check"
          className="p-button-sm p-button-success p-button-text" // Green color for save
          onClick={() => {
            updateUser(rowData);
            toggleEdit(rowData.User_Id);
          }}
        />
        <Button
          icon="pi pi-times"
          className="p-button-sm p-button-danger p-button-text" // Red color for cancel
          onClick={() => {
            setUsers((prevUsers) =>
              prevUsers.map((user) =>
                user.User_Id === rowData.User_Id
                  ? { ...user, ...rowData }
                  : user
              )
            );
            toggleEdit(rowData.User_Id);
          }}
        />
      </div>
    ) : (
      <Button
        icon="pi pi-pencil"
        className="p-button-sm p-button-text p-button-black" // Black color for edit
        onClick={() => toggleEdit(rowData.User_Id)}
      />
    );
  };  

  return (
    <div className="card">
      {/* Search Inputs */}
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

      {/* DataTable */}
      <DataTable
        value={filteredUsers}
        paginator
        rows={5}
        sortField="Name"
        sortOrder={1}
        responsiveLayout="scroll"
      >
        <Column field="User_Id" header="ID" sortable style={{ width: "5%" }} />
        <Column field="Email" header="Email" body={emailTemplate} sortable />
        <Column field="Name" header="Name" body={nameTemplate} sortable />
        <Column
          field="Profile_Pic"
          header="Profile"
          body={profilePicTemplate}
        />
        <Column field="Role" header="Role" body={roleTemplate} />
        <Column field="isActive" header="Active" body={isActiveTemplate} />
        <Column field="Collection_Cnt" header="Collections" sortable />
        <Column header="Actions" body={actionTemplate} />
      </DataTable>
    </div>
  );
};

export default UserTable;
