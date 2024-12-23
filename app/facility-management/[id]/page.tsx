"use client";

import { JSX, useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout-component";
import TableComponent from "@/components/table-component";
import ModalCompoenent, {
  ActionModalCompoenent,
  SuccessModalCompoenent,
} from "@/components/modal-component";
import CreateUser from "@/components/user-management/create-user";
import CreateBulkUser from "@/components/user-management/create-bulk-user";
import axiosInstance from "@/utils/api";

import { useParams, useRouter } from "next/navigation";
import withPermissions from "@/components/auth/permission-protected-routes";

 function FacilityManagement() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  // Success state
  const [successState, setSuccessState] = useState({
    title: "",
    detail: "",
    status: false,
  });
  
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
  
  // Active row tracking
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const toggleActions = (rowId: string) => {
    setActiveRowId((prevId) => (prevId === rowId ? null : rowId));
  };
  
  // Central states for managing actions
  const [centralState, setCentralState] = useState<string>();
  const [centralStateDelete, setCentralStateDelete] = useState<string>();
  
  // Fetch roles and role data on centralState/centralStateDelete change
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([getRoles(), getARole()]);
    };
    fetchData();
  }, [centralState, centralStateDelete]);
  
  // Dynamic title logic
  const getTitle = () => {
    if (centralState === "createUser") {
      return activeRowId ? "Edit User" : "Create User";
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
    if (centralStateDelete === "activateUser") {
      return "Re-activate User";
    }
    return "Zijela";
  };
  
  // Dynamic detail logic
  const getDetail = () => {
    if (centralState === "createUser") {
      return activeRowId
        ? "You can edit user details here."
        : "You can create and manage users' access here.";
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
    if (centralStateDelete === "activateUser") {
      return "Are you sure you want to Re-activate this user";
    }
    return "Zijela";
  };
  
  // Component mapping for central state
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
        takeAction={deleteUser}
      ></ActionModalCompoenent>

      <ModalCompoenent
        title={getTitle()}
        detail={getDetail()}
        modalState={centralState}
        setModalState={() => setCentralState("")}
      >
        {componentMap[centralState]}
      </ModalCompoenent>
      <div className="relative bg-white rounded-2xl p-4 mt-4">
        <TableComponent
          data={role?.users}
          type="users"
          setModalState={setCentralState}
          setModalStateDelete={setCentralStateDelete}
          toggleActions={toggleActions}
          activeRowId={activeRowId}
          setActiveRowId={setActiveRowId}
          deleteAction={setCentralStateDelete}
        />
      </div>
    </DashboardLayout>
  );
}
export default withPermissions(FacilityManagement, ["users", "roles"]);