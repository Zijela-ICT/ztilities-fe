"use client";

import { JSX, useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout-component";
import TableComponent from "@/components/table-component";
import ModalCompoenent, {
  ActionModalCompoenent,
  SuccessModalCompoenent,
} from "@/components/modal-component";
import CreateBulkUser from "@/components/user-management/create-bulk";
import axiosInstance from "@/utils/api";
import ResetPassword from "@/components/user-management/reset-password";
import { useParams, useRouter } from "next/navigation";
import withPermissions from "@/components/auth/permission-protected-routes";
import DynamicCreateForm from "@/components/dynamic-create-form";
import createAxiosInstance from "@/utils/api";
import { useDataPermission } from "@/context";
import exportToCSV from "@/utils/exportCSV";
import CreateBulk from "@/components/user-management/create-bulk";

function UserManagement() {
  const axiosInstance = createAxiosInstance();
  const {
    pagination,
    setPagination,
    searchQuery,
    filterQuery,
    clearSearchAndPagination,
    setShowFilter,
    showFilter,

    centralState,
    setCentralState,
    centralStateDelete,
    setCentralStateDelete,
    setSuccessState,
  } = useDataPermission();
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  // Delete user function
  const deleteUser = async () => {
    await axiosInstance.delete(`/users/${activeRowId}`);
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully de-activated this user",
      status: true,
    });
  };

  // Roles state and fetch function
  const [roles, setRoles] = useState<Role[]>();
  const getRoles = async () => {
    const response = await axiosInstance.get("/roles");
    setRoles(response.data.data);
  };

  // Single role state and fetch function
  const [role, setRole] = useState<RoleData>();
  const getARole = async () => {
    const response = await axiosInstance.get(`/roles/${id}`);
    setRole(response.data.data);
  };

  const [users, setUsers] = useState<User[]>();

  const getARoleUsersUnPaginated = async () => {
    const response = await axiosInstance.get(
      `/roles/${id}/users?search=${searchQuery}&&${filterQuery}`
    );
    exportToCSV(response.data.data, "role_users");
  };

  const getARoleUsers = async () => {
    const response = await axiosInstance.get(
      `/roles/${id}/users?page=${pagination.currentPage}&&paginate=true&&search=${searchQuery}&&${filterQuery}`
    );
    setUsers(response.data.data);
    const extra = response.data.extra;
    if (extra) {
      setPagination({
        currentPage: extra.page,
        pageSize: extra.pageSize,
        total: extra.total,
        totalPages: extra.totalPages,
      });
    }
  };

  // Active row tracking
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const toggleActions = (rowId: string) => {
    setActiveRowId((prevId) => (prevId === rowId ? null : rowId));
  };

  // Fetch roles and role data on centralState/centralStateDelete change
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([getRoles(), getARole(), getARoleUsers()]);
    };
    fetchData();
  }, [
    centralState,
    centralStateDelete,
    pagination.currentPage,
    searchQuery,
    filterQuery,
  ]);

  useEffect(() => {
    if (showFilter === "export") {
      getARoleUsersUnPaginated();
    }
  }, [setShowFilter, filterQuery]);

  // Dynamic title logic
  const getTitle = () => {
    switch (centralState) {
      case "createUser":
        return activeRowId ? "Edit User" : "Create User";
      case "createBulkUser":
        return "Upload Bulk User";
      case "resetPassword":
        return "Reset Password";
    }

    switch (centralStateDelete) {
      case "deleteUser":
        return "De-activate User";
      case "activateUser":
        return "Re-activate User";
    }

    return "Zijela";
  };

  // Dynamic detail logic
  const getDetail = () => {
    switch (centralState) {
      case "createUser":
        return activeRowId
          ? "You can edit user details here."
          : "You can create and manage users' access here.";
      case "createBulkUser":
        return "Import CSV/Excel file";
      case "resetPassword":
        return "Change the password for this user";
    }

    switch (centralStateDelete) {
      case "deleteUser":
        return "Are you sure you want to de-activate this user";
      case "activateUser":
        return "Are you sure you want to Re-activate this user";
    }

    return "Zijela";
  };

  // Component mapping for central state
  const componentMap: Record<string, JSX.Element> = {
    createUser: (
      <DynamicCreateForm
        inputs={[
          { name: "firstName", label: "First Name", type: "text" },
          { name: "lastName", label: "Last Name", type: "text" },
          { name: "email", label: "Email address", type: "email" },
        ]}
        selects={[
          {
            name: "roles",
            label: "Roles",
            placeholder: "Assign Roles",
            options: roles?.map((asset: Role) => ({
              value: asset.id,
              label: asset.name,
            })),
            isMulti: true,
          },
        ]}
        title="User"
        apiEndpoint={`${activeRowId ? "/users" : "/users/pre-register"}`}
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        fetchResource={(id) =>
          axiosInstance.get(`/users/${id}`).then((res) => res.data.data)
        }
      />
    ),
    createBulkUser: (
      <CreateBulk
        type="Users"
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
  };

  // Utility function to format role names
  function formatRoleName(roleName: string): string {
    return `${roleName
      ?.replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")} Role`;
  }

  return (
    <DashboardLayout
      title={role?.name ? formatRoleName(role?.name) : "...."}
      detail="User Management"
      dynamic
      onclick={() => router.back()}
      getTitle={getTitle}
      getDetail={getDetail}
      componentMap={componentMap}
      takeAction={deleteUser}
      setActiveRowId={setActiveRowId}
    >
      <div className="relative bg-white rounded-2xl p-4 mt-4">
        <TableComponent
          data={users}
          type="users"
          setModalState={setCentralState}
          setModalStateDelete={setCentralStateDelete}
          toggleActions={toggleActions}
          activeRowId={activeRowId}
          setActiveRowId={setActiveRowId}
          deleteAction={setCentralStateDelete}
          //new
          currentPage={pagination.currentPage}
          setCurrentPage={(page) =>
            setPagination({ ...pagination, currentPage: page })
          }
          itemsPerPage={pagination.pageSize}
          totalPages={pagination.totalPages}
        />
      </div>
    </DashboardLayout>
  );
}
export default withPermissions(UserManagement, ["users", "roles"]);
