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
import CreateWorkOrder from "@/components/work-order/create-work-order";
import DynamicCreateForm from "@/components/dynamic-create-form";

function WorkOrders() {
  const tabs = ["Work Order"];

  const [successState, setSuccessState] = useState({
    title: "",
    detail: "",
    status: false,
  });

  const [workOrders, setWorkOrders] = useState<Vendor[]>();
  const [role, setRole] = useState<RoleData>();
  const [activeRowId, setActiveRowId] = useState<string | null>(null); // Track active row
  const [centralState, setCentralState] = useState<string>();
  const [centralStateDelete, setCentralStateDelete] = useState<string>();
  const [facilities, setFacilities] = useState<Facility[]>();
  const [blocks, setBlocks] = useState<Block[]>();
  const [units, setUnits] = useState<Unit[]>();
  const [assets, setAssets] = useState<Asset[]>();

  // Fetch data functions
  const getWorkOrders = async () => {
    const response = await axiosInstance.get("/work-orders");
    setWorkOrders(response.data.data);
  };

  const getARole = async () => {
    const response = await axiosInstance.get(`/roles/${activeRowId}`);
    setRole(response.data.data);
  };

  // Delete functions
  const deleteWorkOrders = async () => {
    await axiosInstance.delete(`/work-orders/${activeRowId}`);
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully de-activated this vendor",
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
    // if (selectedTab === "Work Order") {
    //   setActiveRowId((prevId) => (prevId === rowId ? null : rowId));
    // } else {
    //   setActiveRowId(rowId);
    // }
  };

  // Dynamic title and detail logic
  const getTitle = () => {
    switch (centralState) {
      case "createWorkOrder":
        return activeRowId ? "Edit Work Order" : "Create Work Order";
      case "createWorkOrder":
        return activeRowId ? "Edit Work Order" : "Create Work Order";
    }
    switch (centralStateDelete) {
      case "deactivateWorkOrder":
        return "De-activate Work Order ";
      case "activateWorkOrder":
        return "Re-activate Work Order";
      case "deactivateWorkOrder":
        return "De-activate Work Order ";
      case "activateWorkOrder":
        return "Re-activate Work Order";
    }
    return "Zijela";
  };

  const getDetail = () => {
    switch (centralState) {
      case "createWorkOrder":
        return activeRowId
          ? "You can edit work order details here."
          : "You can create and manage work order here.";
      case "createWorkOrder":
        return activeRowId
          ? "You can edit work order details here."
          : "You can create and manage work order here.";
      case "viewPermissions":
        return "All permissions available for this role";
    }
    switch (centralStateDelete) {
      case "activateWorkOrder":
        return "Are you sure you want to Re-activate this work order";
      case "deactivateWorkOrder":
        return "Are you sure you want to de-activate this work order";
      case "activateWorkOrder":
        return "Are you sure you want to Re-activate this work order";
      case "deactivateWorkOrder":
        return "Are you sure you want to de-activate this work order";
    }
    return "Zijela";
  };

  // Mapping centralState values to components
  const componentMap: Record<string, JSX.Element> = {
    createWorkOrder: (
      <DynamicCreateForm
        inputs={[
          { name: "title", label: "Title", type: "text" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "file", label: "FIle", type: "file" },
        ]}
        selects={[
          {
            name: "facility",
            label: "Facility ",
            placeholder: "Select Facility",
            options: facilities?.map((facility: Facility) => ({
              value: facility.id,
              label: facility.name,
            })),
          },
          {
            name: "unit",
            label: "Unit",
            placeholder: "Select Unit",
            options: units?.map((unit: Unit) => ({
              value: unit.id,
              label: unit.unitNumber,
            })),
          },
          {
            name: "blocks",
            label: "Blocks",
            placeholder: "Select Blocks",
            options: blocks?.map((asset: Block) => ({
              value: asset.id,
              label: asset.blockNumber,
            })),
          },
          {
            name: "assets",
            label: "Assets",
            placeholder: "Select Assets",
            options: assets?.map((asset: Asset) => ({
              value: asset.id?.toString(),
              label: asset.assetName?.toString(),
            })),
          },
          {
            name: "subCategory",
            label: "Sub-Category",
            placeholder: "Select Sub-Category",
            options: [
              { value: "single", label: "Single" },
              { value: "residential", label: "Residential" },
            ],
          },
          {
            name: "category",
            label: "Category",
            placeholder: "Select Category",
            options: [
              { value: "single", label: "Single" },
              { value: "residential", label: "Residential" },
            ],
          },
          {
            name: "department",
            label: "Departnemt",
            placeholder: "Select Department",
            options: [
              { value: "single", label: "Single" },
              { value: "residential", label: "Residential" },
            ],
          },
        ]}
        title="Work Order"
        apiEndpoint="/work-orders"
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        fetchResource={(id) =>
          axiosInstance.get(`/work-orders/${id}`).then((res) => res.data.data)
        }
      />
    ),
  };

  useEffect(() => {
    if (centralState === "viewPermissions") {
      getARole();
    }
  }, [centralState]);

  const tabPermissions: { [key: string]: string[] } = {
    "Work Order": ["create_work-orders"],
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
        getWorkOrders(),
        getFacilities(),
        getBlocks(),
        getUnits(),
        getAssets(),
      ]);
    };
    // fetchData();
  }, [centralState, centralStateDelete]);

  return (
    <DashboardLayout
      title="Work Orders"
      detail="Manage and track all work orders here"
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
          centralStateDelete === "deactivateWorkOrder" ||
          centralStateDelete === "activateWorkOrder"
            ? deleteWorkOrders
            : deleteWorkOrders
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

      <PermissionGuard requiredPermissions={["create_work-orders"]}>
        <div className="relative bg-white rounded-2xl p-4 mt-4">
          {/* {selectedTab === "Work Order" && (
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
            data={workOrders}
            type="workorders"
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

export default withPermissions(WorkOrders, ["work-orders"]);
