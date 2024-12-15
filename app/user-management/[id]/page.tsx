"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout-component";
import TableComponent from "@/components/table-component";
import ModalCompoenent, {
  ActionModalCompoenent,
  SuccessModalCompoenent,
} from "@/components/modal-component";
import CreateUser from "@/components/create-user";
import CreateBulkUser from "@/components/create-bulk-user";
import axiosInstance from "@/utils/api";
import ResetPassword from "@/components/reset-password";
import { useParams, useRouter } from "next/navigation";

export default function UserManagement() {
  const [successState, setSuccessState] = useState({
    title: "",
    detail: "",
    status: false,
  });

  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const toggleActions = (rowId: string) => {
    setActiveRowId((prevId) => (prevId === rowId ? null : rowId));
  };
  const deleteUser = async () => {
    const response = await axiosInstance.delete(`/users/${activeRowId}`);
    getARole();
    setDeleteActionModalState(false);
    setSuccessState({
      title: "Successful",
      detail: "You have successfully deleted this user",
      status: true,
    });
  };

  const [roles, setRoles] = useState<Role[]>();
  const getRoles = async () => {
    const response = await axiosInstance.get("/roles");
    setRoles(response.data.data);
  };

  const [role, setRole] = useState<RoleData>();
  const getARole = async () => {
    const response = await axiosInstance.get(`/roles/${id}`);
    setRole(response.data.data);
  };

  const [userModalState, setModalStateUser] = useState<boolean>(false);
  const [passwordResetModalState, setModalStatePasswordReset] =
    useState<boolean>(false);
  const [bulkuserModalState, setModalStateBulkUser] = useState<boolean>(false);
  const [deleteActionModalState, setDeleteActionModalState] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([getRoles(), getARole()]);
    };
    fetchData();
  }, [userModalState, bulkuserModalState]);

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
        title="Delete User"
        detail="Are you sure you want to delete this user"
        modalState={deleteActionModalState}
        setModalState={(state: boolean) => setDeleteActionModalState(state)}
        takeAction={deleteUser}
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
          setSuccessState={setSuccessState}
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
          setSuccessState={setSuccessState}
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

      <div className="relative bg-white rounded-2xl p-4 mt-4">
        <TableComponent
          data={role?.users}
          type="users"
          setModalState1={(state: boolean) => {
            setModalStateUser(state);
          }}
          setModalState4={(state: boolean) => setModalStatePasswordReset(state)}
          setModalState2={(state: boolean) => setModalStateBulkUser(state)}
          toggleActions={toggleActions}
          activeRowId={activeRowId}
          setActiveRowId={(state: any) => setActiveRowId(state)}
          deleteAction={() => setDeleteActionModalState(true)}
        />
      </div>
    </DashboardLayout>
  );
}
