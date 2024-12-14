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
import { DropDownArrow } from "@/utils/svg";

export default function UserManagement() {
  const tabs = ["All Users", "Role", "Permissions"];

  const [activeRowId, setActiveRowId] = useState<string | null>(null); // Track active row
  const [activeRowIdRole, setActiveRowIdRole] = useState<string | null>(null); // Track active row
  const toggleActions = (rowId: string) => {
    if (selectedTab === "Role") {
      setActiveRowIdRole(rowId);
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
    const response = await axiosInstance.delete(`/roles/${activeRowIdRole}`);
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

  const [permissions, setPermissions] = useState<Permission[]>([]);
  // Group permissions by their category
  const groupPermissions = (permissions: Permission[]) => {
    return permissions.reduce((groups, permission) => {
      // Get the part of the permission string after the underscore
      const category = permission.permissionString.split(":")[0].split("_")[1];
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(permission);
      return groups;
    }, {} as Record<string, Permission[]>);
  };

  const getPermissions = async () => {
    const response = await axiosInstance.get("/permissions");
    setPermissions(response.data.data);
  };

  useEffect(() => {
    getPermissions();
  }, []);

  const groupedPermissions = groupPermissions(permissions);

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
            {Object.keys(groupedPermissions).map((category) => (
              <details
                key={category}
                className="border border-gray-200 rounded-lg px-4 py-5 relative group mt-4"
              >
                <summary className="flex justify-between items-center text-base font-semibold cursor-pointer">
                  {category.charAt(0).toUpperCase() + category.slice(1)}{" "}
                  {/* Capitalize category name */}
                  <span className="transform transition-transform duration-100 group-open:rotate-180">
                    <DropDownArrow />
                  </span>
                </summary>
                <nav className="mt-4 pt-9 pb-6 border-t border-gray-300">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedPermissions[category].map((permission) => (
                      <li
                        key={permission.id}
                        className="flex items-start space-x-3"
                      >
                        <span
                          className="text-sm text-gray-700 flex-1 overflow-hidden overflow-ellipsis whitespace-normal"
                          title={permission.permissionString} // Tooltip for full text
                        >
                          {permission.permissionString}
                        </span>
                      </li>
                    ))}
                  </ul>
                </nav>
              </details>
            ))}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
