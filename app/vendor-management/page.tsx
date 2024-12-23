"use client";

import { JSX, useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout-component";
import TableComponent from "@/components/table-component";
import ModalCompoenent, {
  ActionModalCompoenent,
  SuccessModalCompoenent,
} from "@/components/modal-component";
import CreateUser from "@/components/user-management/create-user";
import CreateRole from "@/components/user-management/create-role";
import CreateBulkUser from "@/components/user-management/create-bulk-user";
import axiosInstance from "@/utils/api";
import ResetPassword from "@/components/user-management/reset-password";
import PermissionList from "@/components/user-management/view-permissions";
import withPermissions from "@/components/auth/permission-protected-routes";
import PermissionGuard from "@/components/auth/permission-protected-components";
import { useDataPermission } from "@/context";
import CreateVendor from "@/components/vendor-management/create-vendor";
import CreateTechnician from "@/components/vendor-management/create-technician";

function VendorManagement() {
  const tabs = ["Vendors", "Technicians"];

  const [successState, setSuccessState] = useState({
    title: "",
    detail: "",
    status: false,
  });

  const [vendors, setVendors] = useState<Vendor[]>();
  const [technicians, setTechnicians] = useState<Role[]>();
  const [role, setRole] = useState<RoleData>();
  const [activeRowId, setActiveRowId] = useState<string | null>(null); // Track active row
  const [centralState, setCentralState] = useState<string>();
  const [centralStateDelete, setCentralStateDelete] = useState<string>();

  // Fetch data functions
  const getVendors = async () => {
    const response = await axiosInstance.get("/vendors");
    setVendors(response.data.data);
  };

  const getTechnicians = async () => {
    const response = await axiosInstance.get("/technicians");
    setTechnicians(response.data.data);
  };

  const getARole = async () => {
    const response = await axiosInstance.get(`/roles/${activeRowId}`);
    setRole(response.data.data);
  };

  // Delete functions
  const deleteVendor = async () => {
    await axiosInstance.delete(`/vendors/${activeRowId}`);
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully de-activated this vendor",
      status: true,
    });
  };

  const deleteTechnician = async (id: number) => {
    await axiosInstance.delete(`/roles/${activeRowId}`);
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully deleted this technician",
      status: true,
    });
  };

  // Toggle actions
  const toggleActions = (rowId: string) => {
    if (selectedTab === "Vendors" || selectedTab === "Technicians") {
      setActiveRowId((prevId) => (prevId === rowId ? null : rowId));
    } else {
      setActiveRowId(rowId);
    }
  };

  // Dynamic title and detail logic
  const getTitle = () => {
    switch (centralState) {
      case "createVendor":
        return activeRowId ? "Edit Vendor" : "Create Vendor";
      case "createTechnician":
        return activeRowId ? "Edit Technician" : "Create Technician";
    }
    switch (centralStateDelete) {
      case "deactivateVendor":
        return "De-activate Vendor";
      case "activateVendor":
        return "Re-activate Vendor";
      case "deactivateTechnician":
        return "De-activate Technician";
      case "activateTechnician":
        return "Re-activate Technician";
    }
    return "Zijela";
  };

  const getDetail = () => {
    switch (centralState) {
      case "createVendor":
        return activeRowId
          ? "You can edit vendor details here."
          : "You can create and manage vendor here.";
      case "createTechnician":
        return activeRowId
          ? "You can edit technician details here."
          : "You can manage technicians here.";
      case "viewPermissions":
        return "All permissions available for this role";
    }
    switch (centralStateDelete) {
      case "activateVendor":
        return "Are you sure you want to Re-activate this vendor";
      case "deactivateVendor":
        return "Are you sure you want to de-activate this vendor";
      case "activateTechnician":
        return "Are you sure you want to Re-activate this technician";
      case "deactivateTechnician":
        return "Are you sure you want to de-activate this technician";
    }
    return "Zijela";
  };

  // Mapping centralState values to components
  const componentMap: Record<string, JSX.Element> = {
    createVendor: (
      <CreateVendor
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        activeRowId={activeRowId}
      />
    ),
    createTechnician: (
      <CreateTechnician
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        activeRowId={activeRowId}
      />
    ),
  };

  useEffect(() => {
    if (centralState === "viewPermissions") {
      getARole();
    }
  }, [centralState]);

  const tabPermissions: { [key: string]: string[] } = {
    Vendors: ["read_vendors"],
    Technicians: ["read_vendors"],
  };

  const { userPermissions } = useDataPermission();

  const getDefaultTab = () => {
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
    if (selectedTab === "Technicians") {
      // getTechnicians();
    } else {
      const fetchData = async () => {
        await Promise.all([getVendors()]);
      };
      fetchData();
    }
  }, [centralState, centralStateDelete, selectedTab]);

  return (
    <DashboardLayout
      title="Vendor Management"
      detail="Manage all vendors and technicians here"
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
          centralStateDelete === "deactivateTechnician" ||
          centralStateDelete === "activateTechnician"
            ? deleteTechnician
            : deleteVendor
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

      <PermissionGuard requiredPermissions={["read_vendors"]}>
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

      <PermissionGuard requiredPermissions={["read_vendors"]}>
        <div className="relative bg-white rounded-2xl p-4 mt-4">
          {selectedTab === "Vendors" && (
            <TableComponent
              data={vendors}
              type="vendors"
              setModalState={setCentralState}
              setModalStateDelete={setCentralStateDelete}
              toggleActions={toggleActions}
              activeRowId={activeRowId}
              setActiveRowId={setActiveRowId}
              deleteAction={setCentralStateDelete}
            />
          )}
          {selectedTab === "Technicians" && (
            <TableComponent
              data={technicians}
              type="technicians"
              setModalState={setCentralState}
              setModalStateDelete={setCentralStateDelete}
              toggleActions={toggleActions}
              activeRowId={activeRowId}
              setActiveRowId={setActiveRowId}
              deleteAction={setCentralStateDelete}
            />
          )}
        </div>
      </PermissionGuard>
    </DashboardLayout>
  );
}

export default withPermissions(VendorManagement, ["vendors"]);
