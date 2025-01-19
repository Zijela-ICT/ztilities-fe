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
import ApportionPower from "@/components/work-request/apportionPower";
import FacilityDetails from "@/components/facility-management/view-facility";

function Power() {
  const tabs = ["Power Apportion"];

  const [successState, setSuccessState] = useState({
    title: "",
    detail: "",
    status: false,
  });

  const [powerCharges, setPowerCharges] = useState<any[]>();
  const [powerCharge, setAPowerCharge] = useState<any[]>();
  const [activeRowId, setActiveRowId] = useState<string | null>(null); // Track active row
  const [centralState, setCentralState] = useState<string>();
  const [centralStateDelete, setCentralStateDelete] = useState<string>();
  const [facilities, setFacilities] = useState<Facility[]>();
  const [blocks, setBlocks] = useState<Block[]>();
  const [units, setUnits] = useState<Unit[]>();
  const [assets, setAssets] = useState<Asset[]>();

  // Fetch data functions
  const getPowerCharges = async () => {
    const response = await axiosInstance.get("/power-charges");
    setPowerCharges(response.data.data);
  };

  const getAPowerCharge = async () => {
    const response = await axiosInstance.get(`/power-charges/${activeRowId}`);
    setAPowerCharge(response.data.data);
  };

  // Delete functions
  const deletePowerCharge = async () => {
    await axiosInstance.delete(`/power-charges/${activeRowId}`);
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully deleted this vendor",
      status: true,
    });
  };

  const approvePowerCharge = async () => {
    await axiosInstance.patch(`/power-charges/${activeRowId}/status/approve`);
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully approved this power charge",
      status: true,
    });
  };

  const apportionPowerCharge = async () => {
    await axiosInstance.patch(`/power-charges/${activeRowId}/apportion`);
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully apportioned power charge",
      status: true,
    });
  };

  const getFacilities = async () => {
    const response = await axiosInstance.get("/facilities");
    setFacilities(response.data.data);
  };

  const getBlocks = async () => {
    const response = await axiosInstance.get("/blocks");
    setBlocks(response.data.data);
  };

  const getUnits = async () => {
    const response = await axiosInstance.get("/units");
    setUnits(response.data.data);
  };

  const getAssets = async () => {
    const response = await axiosInstance.get("/assets");
    setAssets(response.data.data);
  };

  // Toggle actions
  const toggleActions = (rowId: string) => {
    setActiveRowId((prevId) => (prevId === rowId ? null : rowId));
  };

  // Dynamic title and detail logic
  const getTitle = () => {
    switch (centralState) {
      case "createWorkOrder":
        return activeRowId ? "Edit Power Apportion" : "Create Power Apportion";
      case "createWorkOrder":
        return activeRowId ? "Edit Power Apportion" : "Create Power Apportion";
      case "createPowerCharge":
        return "Create Power Charge";
      case "viewPowerCharge":
        return "View Power Charge";
    }
    switch (centralStateDelete) {
      case "deactivateWorkOrder":
        return "De-activate Power Apportion ";
      case "activateWorkOrder":
        return "Re-activate Power Apportion";
      case "approvePowerCharge":
        return "Approve Power Charge";
      case "apportionPowerCharge":
        return "Apportion Power Charge";
      case "deletePowerCharge":
        return "Delete Power Charge";
    }
    return "Zijela";
  };

  const getDetail = () => {
    switch (centralState) {
      case "createWorkOrder":
        return activeRowId
          ? "You can edit Power Apportion details here."
          : "You can create and manage Power Apportion here.";
      case "createWorkOrder":
        return activeRowId
          ? "You can edit Power Apportion details here."
          : "You can create and manage Power Apportion here.";
      case "viewPermissions":
        return "All permissions available for this role";
      case "createPowerCharge":
        return "";
      case "viewPowerCharge":
        return "";
    }
    switch (centralStateDelete) {
      case "activateWorkOrder":
        return "Are you sure you want to Re-activate this Power Apportion";
      case "deactivateWorkOrder":
        return "Are you sure you want to de-activate this Power Apportion";
      case "approvePowerCharge":
        return "Are you sure you want to approve the power charge";
      case "apportionPowerCharge":
        return "Are you sure you want to apportion the power charge";
      case "deletePowerCharge":
        return "Are you sure you want to delete the power charge";
    }
    return "Zijela";
  };

  // Mapping centralState values to components
  const componentMap: Record<string, JSX.Element> = {
    createPowerCharge: (
      <ApportionPower
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    viewPowerCharge: (
      <div className="p-4">
        <FacilityDetails facility={powerCharge} title="Power Charge" />
      </div>
    ),
  };

  useEffect(() => {
    if (centralState === "viewPowerCharge") {
      getAPowerCharge();
    }
  }, [centralState]);

  const tabPermissions: { [key: string]: string[] } = {
    "Power Apportion": ["read_power-charges"],
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
    const fetchData = async () => {
      await Promise.all([
        getPowerCharges(),
        // getFacilities(),
        // getBlocks(),
        // getUnits(),
        // getAssets(),
      ]);
    };
    fetchData();
  }, [centralState, centralStateDelete]);

  return (
    <DashboardLayout
      title="Power"
      detail="Manage and track all power apportionment here"
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
          centralStateDelete === "approvePowerCharge"
            ? approvePowerCharge
            : centralStateDelete === "apportionPowerCharge"
            ? apportionPowerCharge
            : centralStateDelete === "deletePowerCharge"
            ? deletePowerCharge
            : null
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

      {/* <PermissionGuard requiredPermissions={["create_work-orders"]}>
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
      </PermissionGuard> */}

      <PermissionGuard requiredPermissions={["read_power-charges"]}>
        <div className="relative bg-white rounded-2xl p-4 mt-4">
          {/* {selectedTab === "Power Apportion" && (
            <TableComponent
              data={workOrders}
              type="workorders"
              setModalState={setCentralState}
              setModalStateDelete={setCentralStateDelete}
              toggleActions={toggleActions}
              activeRowId={activeRowId}
              setActiveRowId={setActiveRowId}
              deleteAction={setCentralStateDelete}
            />
          )} */}
          <TableComponent
            data={powerCharges}
            type="powers"
            setModalState={setCentralState}
            setModalStateDelete={setCentralStateDelete}
            toggleActions={toggleActions}
            activeRowId={activeRowId}
            setActiveRowId={setActiveRowId}
            deleteAction={setCentralStateDelete}
          />
        </div>
      </PermissionGuard>
    </DashboardLayout>
  );
}

export default withPermissions(Power, ["power-charges"]);
