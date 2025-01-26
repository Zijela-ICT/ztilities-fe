"use client";

import { JSX, useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout-component";
import TableComponent from "@/components/table-component";
import ModalCompoenent, {
  ActionModalCompoenent,
  SuccessModalCompoenent,
} from "@/components/modal-component";
import axiosInstance from "@/utils/api";
import withPermissions from "@/components/auth/permission-protected-routes";
import PermissionGuard from "@/components/auth/permission-protected-components";
import { useDataPermission } from "@/context";
import DynamicCreateForm from "@/components/dynamic-create-form";

function VendorManagement() {
  const { user, setUser, setUserPermissions } = useDataPermission();

  const tabs = ["My Bills", "All Bills"];

  const [successState, setSuccessState] = useState({
    title: "",
    detail: "",
    status: false,
  });

  const [vendor, setVendor] = useState<Vendor>();
  const [technician, setTechnician] = useState<Technician>();
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [extraRowId, setExtraROwId] = useState<string | null>(null);
  const [centralState, setCentralState] = useState<string>();
  const [centralStateDelete, setCentralStateDelete] = useState<string>();

  const myunits = user.units;

  const billData = myunits
    .map((unit) =>
      unit.bills
        ? unit.bills.map((bill) => (bill ? { ...bill, unitId: unit.id } : null)) // Add unit id to each bill
        : []
    ) // If unit.bills is undefined, return an empty array
    .flat() // Flatten the array
    .filter((bill) => bill !== null && bill !== undefined); // Remove null and undefined values

  const getAVendor = async () => {
    const response = await axiosInstance.get(`/vendors/${activeRowId}`);
    setVendor(response.data.data);
  };
  const getATechnician = async () => {
    const response = await axiosInstance.get(`/technicians/${activeRowId}`);
    setTechnician(response.data.data);
  };

  // Delete functions
  const deleteVendor = async () => {
    await axiosInstance.delete(`/vendors/${activeRowId}`);
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully deleted this vendor",
      status: true,
    });
  };

  const deleteTechnician = async () => {
    await axiosInstance.delete(`/technicians/${activeRowId}`);
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully deleted this technician",
      status: true,
    });
  };

  const deactivateVendor = async () => {
    await axiosInstance.patch(`/vendors/${activeRowId}`, {
      isDeactivated: !vendor.isDeactivated,
    });
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully de-activated this vendor",
      status: true,
    });
  };

  const deactivateTechnician = async () => {
    await axiosInstance.patch(`/technicians/${activeRowId}`, {
      isDeactivated: !technician.isDeactivated,
    });
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully de-activated this technician",
      status: true,
    });
  };

  const payBills = async () => {
    await axiosInstance.patch(`/units/${extraRowId}/pay/${activeRowId}`);
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have paid for this bill",
      status: true,
    });
  };

  // Toggle actions
  const toggleActions = (rowId: string) => {
    setActiveRowId((prevId) => (prevId === rowId ? null : rowId));
  };
  const extraActions = (id: string) => {
    setExtraROwId((prevId) => (prevId === id ? null : id));
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
      case "deleteVendor":
        return "Delete Vendor";
      case "deactivateTechnician":
        return "De-activate Technician";
      case "activateTechnician":
        return "Re-activate Technician";
      case "deleteTechnician":
        return "Delete Technician";
      case "payBills":
        return "Pay bills";
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
      case "payBills":
        return "Are you sure you want to pay for this bill";
    }
    return "Zijela";
  };

  // Mapping centralState values to components
  const componentMap: Record<string, JSX.Element> = {
    createTechnician: (
      <DynamicCreateForm
        inputs={[
          { name: "firstName", label: "First Name", type: "text" },
          { name: "surname", label: "Surname", type: "text" },
          { name: "address", label: "Address", type: "text" },
          { name: "phoneNumber", label: "Phone Number", type: "text" },
          { name: "email", label: "Email address", type: "text" },
        ]}
        selects={[
          {
            name: "serviceCategory",
            label: "Service Category",
            placeholder: "Select Category",
            options: [
              { value: "single", label: "Single" },
              { value: "residential", label: "Private" },
            ],
          },
        ]}
        title="Technician"
        apiEndpoint="/technicians"
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        fetchResource={(id) =>
          axiosInstance.get(`/technicians/${id}`).then((res) => res.data.data)
        }
      />
    ),
  };

  useEffect(() => {
    if (
      centralStateDelete === "deactivateVendor" ||
      centralStateDelete === "activateVendor"
    ) {
      getAVendor();
    } else if (
      centralStateDelete === "deactivateTechnician" ||
      centralStateDelete === "activateTechnician"
    ) {
      getATechnician();
    }
  }, [centralStateDelete]);

  const tabPermissions: { [key: string]: string[] } = {
    "My Bills": ["update_units:id/pay/billId"],
    "All Bills": ["update_units:id/pay/billId"],
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
    if (selectedTab === "All Bills") {
    } else {
      const fetchData = async () => {
        await Promise.all([]);
      };
      fetchData();
    }
  }, [centralState, centralStateDelete, selectedTab]);

  return (
    <DashboardLayout title="Bills" detail="Manage all bills here">
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
            ? deactivateTechnician
            : centralStateDelete === "deleteTechnician"
            ? deleteTechnician
            : centralStateDelete === "deactivateVendor" ||
              centralStateDelete === "activateVendor"
            ? deactivateVendor
            : centralStateDelete === "payBills"
            ? payBills
            : undefined
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

      <PermissionGuard requiredPermissions={["update_units:id/pay/billId"]}>
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
                  className={`relative text-gray-500 hover:text-gray-900 px-4 py-2 text-xs font-medium focus:outline-none group ${
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

      <PermissionGuard requiredPermissions={["update_units:id/pay/billId"]}>
        <div className="relative bg-white rounded-2xl p-4 mt-4">
          {selectedTab === "My Bills" && (
            <TableComponent
              data={billData}
              type="bills"
              setModalState={setCentralState}
              setModalStateDelete={setCentralStateDelete}
              toggleActions={toggleActions}
              extraActions={extraActions}
              activeRowId={activeRowId}
              setActiveRowId={setActiveRowId}
              deleteAction={setCentralStateDelete}
            />
          )}
          {selectedTab === "All Bills" && (
            <TableComponent
              data={[]}
              type="bills"
              setModalState={setCentralState}
              setModalStateDelete={setCentralStateDelete}
              toggleActions={toggleActions}
              extraActions={extraActions}
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

export default withPermissions(VendorManagement, ["units"]);
