"use client";

import { JSX, useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout-component";
import TableComponent from "@/components/table-component";
import ModalCompoenent, {
  ActionModalCompoenent,
  SuccessModalCompoenent,
} from "@/components/modal-component";
import CreateBulkUser from "@/components/user-management/create-bulk-user";
import axiosInstance from "@/utils/api";
import PermissionList from "@/components/user-management/view-permissions";
import withPermissions from "@/components/auth/permission-protected-routes";
import PermissionGuard from "@/components/auth/permission-protected-components";
import { useDataPermission } from "@/context";
import CreateFacility from "@/components/facility-management/create-facility";
import CreateBlock from "@/components/facility-management/create-block";
import CreateUnit from "@/components/facility-management/create-units";
import FacilityDetails from "@/components/facility-management/view-facility";

function FacilityManagement() {
  const tabs = ["Facilities", "Blocks", "Units", "Assets"];

  // States
  const [successState, setSuccessState] = useState({
    title: "",
    detail: "",
    status: false,
  });
  
  const [facilities, setFacilities] = useState<Facility[]>();
  const [blocks, setBlocks] = useState<Block[]>();
  const [units, setUnits] = useState<Unit[]>();
  const [assets, setAssets] = useState<Asset[]>();
  const [facility, setAFacility] = useState<Facility>();
  const [asset, setAAsset] = useState<Asset>();
  
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [centralState, setCentralState] = useState<string>();
  const [centralStateDelete, setCentralStateDelete] = useState<string>();
  
  // Fetch data functions
  const getFacilities = async () => {
    const response = await axiosInstance.get("/facilities");
    setFacilities(response.data.data);
  };
  
  const getAFacility = async () => {
    const response = await axiosInstance.get(`/facilities/${activeRowId}`);
    setAFacility(response.data.data);
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
  
  const getAAsset = async () => {
    const response = await axiosInstance.get(`/assets/${activeRowId}`);
    setAAsset(response.data.data);
  };
  
  // Delete functions
  const deleteFacility = async () => {
    await axiosInstance.delete(`/facilities/${activeRowId}`);
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully deleted this facility",
      status: true,
    });
  };
  
  const deleteBlock = async () => {
    await axiosInstance.delete(`/blocks/${activeRowId}`);
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully deleted this block",
      status: true,
    });
  };
  
  const deleteUnit = async () => {
    await axiosInstance.delete(`/units/${activeRowId}`);
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully deleted this unit",
      status: true,
    });
  };
  
  const deleteAsset = async () => {
    await axiosInstance.delete(`/assets/${activeRowId}`);
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully deleted this asset",
      status: true,
    });
  };
  
  // Utility functions
  const normalizeItems = (items: any[], key: string) => {
    return items.map((item) => ({
      ...item,
      normalizedString: item[key],
    }));
  };
  
  const groupFacilityItems = (items: any[]) => {
    return items?.reduce((groups, item) => {
      const category = item?.normalizedString?.split(" ")[0];
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
      return groups;
    }, {} as Record<string, any[]>);
  };
  
  // Normalize and group facility items
  const normalizedBlocks = normalizeItems(facility?.blocks || [], "blockNumber");
  const normalizedUnits = normalizeItems(facility?.units || [], "unitNumber");
  const normalizedAssets = normalizeItems(
    facility?.assets || [],
    "assetNumber"
  );
  
  const combinedFacilityItems = [
    ...normalizedBlocks,
    ...normalizedUnits,
    ...normalizedAssets,
  ];
  const groupedFacilityItem = groupFacilityItems(combinedFacilityItems);
  
  // Actions
  const toggleActions = (rowId: string) => {
    if (
      selectedTab === "Facilities" ||
      selectedTab === "Blocks" ||
      selectedTab === "Units"
    ) {
      setActiveRowId((prevId) => (prevId === rowId ? null : rowId));
    } else {
      setActiveRowId(rowId);
    }
  };
  
  // Dynamic title and detail logic
  const getTitle = () => {
    switch (centralState) {
      case "createFacility":
        return activeRowId ? "Edit Facility" : "Create Facility";
      case "createBlock":
        return activeRowId ? "Edit Block" : "Create Block";
      case "createUnit":
        return activeRowId ? "Edit Unit" : "Create Unit";
      case "createAsset":
        return activeRowId ? "Edit Asset" : "Create Asset";
      case "createBulkFacility":
        return "Upload Bulk Facility";
      case "viewFacility":
        return "Facility Details";
    }
    switch (centralStateDelete) {
      case "deleteFacility":
        return "Delete Facility";
      case "deleteBlock":
        return "Delete Block";
      case "deleteUnit":
        return "Delete Unit";
      case "deleteAsset":
        return "Delete Asset";
    }
    return "Zijela";
  };
  
  const getDetail = () => {
    switch (centralState) {
      case "createFacility":
        return activeRowId
          ? "You can edit facility details here."
          : "You can create and manage facilities here.";
      case "createBlock":
        return activeRowId
          ? "You can edit block details here."
          : "You can manage blocks here.";
      case "createUnit":
        return activeRowId
          ? "You can edit units details here."
          : "You can manage units here.";
      case "createBulkFacility":
        return "Import CSV/Excel file";
      case "createAsset":
        return activeRowId
          ? "You can edit assets details here."
          : "You can manage assets here.";
      case "viewFacility":
        return "";
    }
    switch (centralStateDelete) {
      case "deleteFacility":
        return "Are you sure you want to delete this facility";
      case "deleteBlock":
        return "Are you sure you want to delete this block";
      case "deleteUnit":
        return "Are you sure you want to delete this unit";
      case "deleteAsset":
        return "Are you sure you want to delete this asset";
    }
    return "Zijela";
  };
  
  // Component mapping
  const componentMap: Record<string, JSX.Element> = {
    createFacility: (
      <CreateFacility
        blocks={blocks}
        units={units}
        assets={assets}
        setModalState={setCentralState}
        activeRowId={activeRowId}
        setSuccessState={setSuccessState}
      />
    ),
    createBulkUser: <CreateBulkUser />,
    createBlock: (
      <CreateBlock
        units={units}
        assets={assets}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        activeRowId={activeRowId}
      />
    ),
    createUnit: (
      <CreateUnit
        assets={assets}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        activeRowId={activeRowId}
      />
    ),
    viewFacility: (
      <div className="p-4">
        <FacilityDetails
          facility={facility}
          groupedPermissions={groupedFacilityItem || []}
        />
      </div>
    ),
  };
  
  // Permissions and default tab logic
  const tabPermissions: { [key: string]: string[] } = {
    Facilities: ["read_facilities"],
    Blocks: ["read_blocks"],
    Units: ["read_units"],
    Assets: ["read_facilities"],
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
  
  // Fetch data on tab change or state change
  useEffect(() => {
    if (selectedTab === "Blocks") {
      getBlocks();
      getUnits();
    } else if (selectedTab === "Units") {
      getUnits();
    } else if (selectedTab === "Assets") {
      getAssets();
    } else {
      const fetchData = async () => {
        await Promise.all([getFacilities(), getBlocks(), getUnits()]);
      };
      fetchData();
    }
  }, [centralState, centralStateDelete, selectedTab]);
  
  useEffect(() => {
    if (centralState === "viewFacility") {
      getAFacility();
    }
  }, [centralState]);
  
  return (
    <DashboardLayout
      title="Facility Management"
      detail="Manage creation and assignment of facility"
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
          centralStateDelete === "deleteFacility"
            ? deleteFacility
            : centralStateDelete === "deleteBlock"
            ? deleteBlock
            : centralStateDelete === "deleteUnit"
            ? deleteUnit
            : centralStateDelete === "deleteAsset"
            ? deleteAsset
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

      <PermissionGuard
        requiredPermissions={["read_facilities", "read_blocks", "read_units"]}
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
        requiredPermissions={["read_facilities", "read_blocks", "read_units"]}
      >
        <div className="relative bg-white rounded-2xl p-4 mt-4">
          {selectedTab === "Facilities" && (
            <TableComponent
              data={facilities}
              type="facilities"
              setModalState={setCentralState}
              setModalStateDelete={setCentralStateDelete}
              toggleActions={toggleActions}
              activeRowId={activeRowId}
              setActiveRowId={setActiveRowId}
              deleteAction={setCentralStateDelete}
            />
          )}
          {selectedTab === "Blocks" && (
            <TableComponent
              data={blocks}
              type="blocks"
              setModalState={setCentralState}
              setModalStateDelete={setCentralStateDelete}
              toggleActions={toggleActions}
              activeRowId={activeRowId}
              setActiveRowId={setActiveRowId}
              deleteAction={setCentralStateDelete}
            />
          )}
          {selectedTab === "Units" && (
            <TableComponent
              data={units}
              type="units"
              setModalState={setCentralState}
              setModalStateDelete={setCentralStateDelete}
              toggleActions={toggleActions}
              activeRowId={activeRowId}
              setActiveRowId={setActiveRowId}
              deleteAction={setCentralStateDelete}
            />
          )}
          {selectedTab === "Assets" && (
            <TableComponent
              data={assets}
              type="assets"
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

export default withPermissions(FacilityManagement, [
  "units",
  "blocks",
  "facilities",
]);
