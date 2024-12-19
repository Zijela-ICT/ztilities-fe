"use client";

import { JSX, useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout-component";
import TableComponent from "@/components/table-component";
import ModalCompoenent, {
  ActionModalCompoenent,
  SuccessModalCompoenent,
} from "@/components/modal-component";
import CreateUser from "@/components/create-user";
import CreateRole from "@/components/create-role";
import CreateBulkUser from "@/components/create-bulk-user";
import axiosInstance from "@/utils/api";
import ResetPassword from "@/components/reset-password";
import PermissionList from "@/components/view-permissions";
import withPermissions from "@/components/auth/permission-protected-routes";
import PermissionGuard from "@/components/auth/permission-protected-components";
import { useDataPermission } from "@/context";

function UserManagement() {
  const tabs = ["All Users", "Role", "Permissions"];

  const [successState, setSuccessState] = useState({
    title: "",
    detail: "",
    status: false,
  });

  const [users, setUsers] = useState<User[]>();
  const [roles, setRoles] = useState<Role[]>();
  const [role, setRole] = useState<RoleData>();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [activeRowId, setActiveRowId] = useState<string | null>(null); // Track active row
  const [centralState, setCentralState] = useState<string>();
  const [centralStateDelete, setCentralStateDelete] = useState<string>();

  // Fetch data functions
  const getUsers = async () => {
    const response = await axiosInstance.get("/users");
    setUsers(response.data.data);
  };

  const getRoles = async () => {
    const response = await axiosInstance.get("/roles");
    setRoles(response.data.data);
  };

  const getARole = async () => {
    const response = await axiosInstance.get(`/roles/${activeRowId}`);
    setRole(response.data.data);
  };

  const getPermissions = async () => {
    const response = await axiosInstance.get("/permissions");
    setPermissions(response.data.data);
  };

  // Delete functions
  const deleteUser = async () => {
    await axiosInstance.delete(`/users/${activeRowId}`);
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully de-activated this user",
      status: true,
    });
  };

  const deleteRole = async (id: number) => {
    await axiosInstance.delete(`/roles/${activeRowId}`);
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully deleted this role",
      status: true,
    });
  };

  // Group permissions by category
  const groupPermissions = (permissions: Permission[]) => {
    return permissions?.reduce((groups, permission) => {
      const category = permission?.permissionString
        ?.split(":")[0]
        .split("_")[1];
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(permission);
      return groups;
    }, {} as Record<string, Permission[]>);
  };

  const groupedPermissions = groupPermissions(permissions);
  const groupedPermissionsByUser = groupPermissions(role?.permissions);

  // Toggle actions
  const toggleActions = (rowId: string) => {
    if (selectedTab === "All Users") {
      setActiveRowId((prevId) => (prevId === rowId ? null : rowId));
    } else {
      setActiveRowId(rowId);
    }
  };

  // Dynamic title and detail logic
  const getTitle = () => {
    if (centralState === "createUser") {
      return activeRowId ? "Edit User" : "Create User";
    }
    if (centralState === "createRole") {
      return activeRowId ? "Edit Role" : "Create Role";
    }
    if (centralState === "createBulkUser") {
      return "Upload Bulk User";
    }
    if (centralState === "resetPassword") {
      return "Reset Password";
    }
    if (centralStateDelete === "deleteUser") {
      return "De-activate User";
    }
    if (centralStateDelete === "deleteRole") {
      return "Delete Role";
    }
    if (centralState === "viewPermissions") {
      return `Role permissions`;
    }
    return "Zijela";
  };

  const getDetail = () => {
    if (centralState === "createUser") {
      return activeRowId
        ? "You can edit user details here."
        : "You can create and manage users' access here.";
    }
    if (centralState === "createRole") {
      return activeRowId
        ? "You can edit role details here."
        : "You can manage users' access here.";
    }
    if (centralState === "createBulkUser") {
      return "Import CSV/Excel file";
    }
    if (centralState === "resetPassword") {
      return "Change the password for this user";
    }
    if (centralStateDelete === "deleteUser") {
      return "Are you sure you want to de-activate this user";
    }
    if (centralStateDelete === "deleteRole") {
      return "Are you sure you want to delete this role";
    }
    if (centralState === "viewPermissions") {
      return "All perissions available for this role";
    }
    return "Zijela";
  };

  // Mapping centralState values to components
  const componentMap: Record<string, JSX.Element> = {
    createUser: (
      <CreateUser
        roles={roles}
        setModalState={setCentralState}
        activeRowId={activeRowId}
        setSuccessState={setSuccessState}
      />
    ),
    createBulkUser: <CreateBulkUser />,
    createRole: (
      <CreateRole
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        activeRowId={activeRowId}
      />
    ),
    resetPassword: (
      <ResetPassword
        roles={roles}
        setModalState={setCentralState}
        activeRowId={activeRowId}
        setSuccessState={setSuccessState}
      />
    ),
    viewPermissions: (
      <div className="p-4">
        <PermissionList groupedPermissions={groupedPermissionsByUser || []} />
      </div>
    ),
  };

  useEffect(() => {
    if (centralState === "viewPermissions") {
      getARole();
    }
  }, [centralState]);

  const tabPermissions: { [key: string]: string[] } = {
    "All Users": ["read_users"], // Permission to view "All Users"
    Role: ["read_roles"], // Permission to view "Role"
    Permissions: ["read_permissions"], // Permission to view "Permissions"
  };

  const { userPermissions } = useDataPermission();
  const getDefaultTab = () => {
    // Extract the permission strings into a clean array
    const userPermissionStrings = userPermissions.map(
      (perm) => perm.permissionString
    );

    return tabs.find((tab) =>
      (tabPermissions[tab] || []).every((permission) =>
        userPermissionStrings.includes(permission)
      )
    );
  };

  const [selectedTab, setSelectedTab] = useState<string>(getDefaultTab() || "");

  useEffect(() => {
    if (selectedTab === "Role") {
      getRoles();
    } else if (selectedTab === "Permissions") {
      getPermissions();
    } else {
      const fetchData = async () => {
        await Promise.all([getUsers(), getRoles()]);
      };
      fetchData();
    }
  }, [centralState, centralStateDelete, selectedTab]);

  return (
    <DashboardLayout
      title="User Management"
      detail="Manage all users and their roles."
    >
      <SuccessModalCompoenent
        title={successState.title}
        detail={successState.detail}
        modalState={successState.status}
        setModalState={(state: boolean) =>
          setSuccessState((prevState) => ({ ...prevState, status: state }))
        }
      ></SuccessModalCompoenent>

      <ActionModalCompoenent
        title={getTitle()}
        detail={getDetail()}
        modalState={centralStateDelete}
        setModalState={setCentralStateDelete}
        takeAction={
          centralStateDelete === "deleteRole" ? deleteRole : deleteUser
        }
      ></ActionModalCompoenent>

      <ModalCompoenent
        title={getTitle()}
        detail={getDetail()}
        modalState={centralState}
        setModalState={() => {
          setCentralState("");
          setActiveRowId(null);
        }}
      >
        {componentMap[centralState]}
      </ModalCompoenent>

      <PermissionGuard
        requiredPermissions={["read_users", "read_permission", "read_roles"]}
      >
        <div className="relative bg-white rounded-2xl p-4">
          <div className="flex space-x-4 pb-2">
            {tabs.map((tab) => (
              <PermissionGuard
                key={tab}
                requiredPermissions={tabPermissions[tab] || []} // Match tab to permissions
              >
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
              </PermissionGuard>
            ))}
          </div>
        </div>
      </PermissionGuard>

      <PermissionGuard
        requiredPermissions={["read_users", "read_permission", "read_roles"]}
      >
        <div className="relative bg-white rounded-2xl p-4 mt-4">
          {selectedTab === "All Users" && (
            <TableComponent
              data={users}
              type="users"
              setModalState={setCentralState}
              setModalStateDelete={setCentralStateDelete}
              toggleActions={toggleActions}
              activeRowId={activeRowId}
              setActiveRowId={setActiveRowId}
              deleteAction={setCentralStateDelete}
            />
          )}
          {selectedTab === "Role" && (
            <TableComponent
              data={roles}
              type="roles"
              setModalState={setCentralState}
              setModalStateDelete={setCentralStateDelete}
              toggleActions={toggleActions}
            />
          )}
          {selectedTab === "Permissions" && (
            <PermissionList groupedPermissions={groupedPermissions} />
          )}
        </div>
      </PermissionGuard>
    </DashboardLayout>
  );
}

export default withPermissions(UserManagement, ["users", "roles"]);
