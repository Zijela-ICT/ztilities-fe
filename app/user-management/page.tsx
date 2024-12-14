"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout-component";
import TableComponent from "@/components/table-component";
import ModalCompoenent, {
  ActionModalCompoenent,
} from "@/components/modal-component";
import CreateUser from "@/components/create-user";
import CreateRole from "@/components/create-role";
import CreateBulkUser from "@/components/create-bulk-user";
import axiosInstance from "@/utils/api";
import ResetPassword from "@/components/reset-password";

export default function UserManagement() {
  const tabs = ["All Users", "Role", "Permissions"];

  const [activeRowId, setActiveRowId] = useState<string | null>(null); // Track active row
  const toggleActions = (rowId: string) => {
    if (selectedTab === "Role") {
      setActiveRowId(rowId);
      setDeleteActionModalStateRole(true);
    } else {
      setActiveRowId((prevId) => (prevId === rowId ? null : rowId));
    }
  };

  const [users, setUsers] = useState<User[]>();
  const getUsers = async () => {
    const response = await axiosInstance.get("/users");
    setUsers(response.data.data);
  };
  const deleteUser = async () => {
    const response = await axiosInstance.delete(`/users/${activeRowId}`);
    getUsers();
    setDeleteActionModalState(false);
  };

  const [roles, setRoles] = useState<Role[]>();
  const getRoles = async () => {
    const response = await axiosInstance.get("/roles");
    setRoles(response.data.data);
  };
  const deleteRole = async (id: number) => {
    const response = await axiosInstance.delete(`/roles/${activeRowId}`);
    getRoles();
    setDeleteActionModalStateRole(false);
  };

  const [userModalState, setModalStateUser] = useState<boolean>(false);
  const [passwordResetModalState, setModalStatePasswordReset] =
    useState<boolean>(false);
  const [bulkuserModalState, setModalStateBulkUser] = useState<boolean>(false);
  const [roleModalState, setModalStateRole] = useState<boolean>(false);
  const [deleteActionModalState, setDeleteActionModalState] =
    useState<boolean>(false);
  const [deleteActionModalStateRole, setDeleteActionModalStateRole] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([getUsers(), getRoles()]);
    };
    fetchData();
  }, [userModalState, bulkuserModalState, roleModalState]);

  const [selectedTab, setSelectedTab] = useState<string>("All Users");

  console.log(activeRowId);
  return (
    <DashboardLayout
      title="User Management"
      detail="Manage all users and their roles."
    >
      <ActionModalCompoenent
        title="Delete User"
        detail="Are you sure you want to delete this user"
        modalState={deleteActionModalState}
        setModalState={(state: boolean) => setDeleteActionModalState(state)}
        takeAction={deleteUser}
      ></ActionModalCompoenent>

      <ActionModalCompoenent
        title="Delete Role"
        detail="Are you sure you want to delete this role"
        modalState={deleteActionModalStateRole}
        setModalState={(state: boolean) => setDeleteActionModalStateRole(state)}
        takeAction={deleteRole}
      ></ActionModalCompoenent>

      <ModalCompoenent
        title={activeRowId ? "Edit User" : "Create User"}
        detail={
          activeRowId
            ? "You can edit user here"
            : "You can create and manage users access here "
        }
        modalState={userModalState}
        setModalState={(state: boolean) => setModalStateUser(state)}
      >
        <CreateUser
          roles={roles}
          setModalState={(state: boolean) => setModalStateUser(state)}
          activeRowId={activeRowId}
        />
      </ModalCompoenent>

      <ModalCompoenent
        title="Reset Password"
        detail="Change the password for this user"
        modalState={passwordResetModalState}
        setModalState={(state: boolean) => setModalStatePasswordReset(state)}
      >
        <ResetPassword
          roles={roles}
          setModalState={(state: boolean) => setModalStatePasswordReset(state)}
          activeRowId={activeRowId}
        />
      </ModalCompoenent>

      <ModalCompoenent
        title="Create Role"
        detail="You can manage user acess here"
        modalState={roleModalState}
        setModalState={(state: boolean) => setModalStateRole(state)}
      >
        <CreateRole
          setModalState={(state: boolean) => setModalStateRole(state)}
        />
      </ModalCompoenent>

      <ModalCompoenent
        title="Upload Bulk User"
        detail="Import CSV/Excel file"
        modalState={bulkuserModalState}
        setModalState={(state: boolean) => setModalStateBulkUser(state)}
        bulk
      >
        <CreateBulkUser />
      </ModalCompoenent>

      <div className="relative bg-white rounded-2xl p-4">
        <div className="flex space-x-4 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`relative text-gray-500 hover:text-gray-900 px-4 py-2 font-medium focus:outline-none group ${
                selectedTab === tab
                  ? "text-[#A8353A] font-semibold" // Active tab styles
                  : ""
              }`}
            >
              {tab}
              {selectedTab === tab && (
                <span className="absolute left-0 bottom-[-5px] w-full h-[2px] bg-[#A8353A]"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="relative bg-white rounded-2xl p-4 mt-4">
        {selectedTab === "All Users" && (
          <TableComponent
            data={users}
            type="users"
            setModalStateUser={(state: boolean) => {
              setModalStateUser(state);
            }}
            setModalStateResetPassword={(state: boolean) =>
              setModalStatePasswordReset(state)
            }
            setModalStateBulkUser={(state: boolean) =>
              setModalStateBulkUser(state)
            }
            toggleActions={toggleActions}
            activeRowId={activeRowId}
            setActiveRowId={(state: any) => setActiveRowId(state)}
            deleteAction={() => setDeleteActionModalState(true)}
          />
        )}
        {selectedTab === "Role" && (
          <TableComponent
            data={roles}
            type="roles"
            setModalStateRole={(state: boolean) => setModalStateRole(state)}
            toggleActions={toggleActions}
          />
        )}
        {selectedTab === "Permissions" && (
          <>
            <details className="border border-gray-200 rounded-lg px-4 py-5  relative group">
              <summary className="flex justify-between items-center text-base font-semibold cursor-pointer">
                Users
                <span className="transform transition-transform duration-100 group-open:rotate-180">
                  <svg
                    width="14"
                    height="8"
                    viewBox="0 0 14 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.7998 7.4998L13.3998 1.7998C13.7998 1.3998 13.7998 0.799804 13.3998 0.399804C12.9998 -0.00019598 12.3998 -0.00019598 11.9998 0.399804L6.9998 5.2998L1.9998 0.399804C1.5998 -0.00019598 0.999804 -0.00019598 0.599804 0.399804C0.399804 0.599804 0.299805 0.799805 0.299805 1.0998C0.299805 1.39981 0.399804 1.5998 0.599804 1.7998L6.1998 7.4998C6.6998 7.8998 7.2998 7.8998 7.7998 7.4998C7.6998 7.4998 7.6998 7.4998 7.7998 7.4998Z"
                      fill="#A8353A"
                    />
                  </svg>
                </span>
              </summary>
              <nav className="mt-4 pt-9 pb-6 border-t border-gray-300">
                <ul className="flex flex-wrap space-x-6 cursor-pointer">
                  <li className="ml-2 mb-2">View Users</li>
                  <li>Add Users</li>
                  <li>Delete Users</li>
                  <li>Manage Users</li>
                </ul>
              </nav>
            </details>
            <details className="border border-gray-200 rounded-lg px-4 py-5  relative group mt-4">
              <summary className="flex justify-between items-center text-base font-semibold cursor-pointer">
                Roles
                <span className="transform transition-transform duration-100 group-open:rotate-180">
                  <svg
                    width="14"
                    height="8"
                    viewBox="0 0 14 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.7998 7.4998L13.3998 1.7998C13.7998 1.3998 13.7998 0.799804 13.3998 0.399804C12.9998 -0.00019598 12.3998 -0.00019598 11.9998 0.399804L6.9998 5.2998L1.9998 0.399804C1.5998 -0.00019598 0.999804 -0.00019598 0.599804 0.399804C0.399804 0.599804 0.299805 0.799805 0.299805 1.0998C0.299805 1.39981 0.399804 1.5998 0.599804 1.7998L6.1998 7.4998C6.6998 7.8998 7.2998 7.8998 7.7998 7.4998C7.6998 7.4998 7.6998 7.4998 7.7998 7.4998Z"
                      fill="#A8353A"
                    />
                  </svg>
                </span>
              </summary>
              <nav className="mt-4 pt-9 pb-6 border-t border-gray-300">
                <ul className="flex flex-wrap space-x-6 cursor-pointer">
                  <li className="ml-2 mb-2">Add New Role</li>
                  <li>Assign Users to Roles</li>
                  <li>Delete Roles</li>
                  <li>Add Permission</li>
                </ul>
              </nav>
            </details>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
