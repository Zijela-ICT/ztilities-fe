"use client";

import { JSX, use, useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout-component";
import TableComponent from "@/components/table-component";
import ModalCompoenent, {
  ActionModalCompoenent,
  SuccessModalCompoenent,
} from "@/components/modal-component";
import CreateBulkUser from "@/components/user-management/create-bulk-user";
import axiosInstance from "@/utils/api";
import withPermissions from "@/components/auth/permission-protected-routes";
import PermissionGuard from "@/components/auth/permission-protected-components";
import { useDataPermission } from "@/context";
import FacilityDetails from "@/components/facility-management/view-facility";
import DynamicCreateForm from "@/components/dynamic-create-form";
import CreateCategory from "@/components/facility-management/create-category";
import CreateAsset from "@/components/facility-management/create-asset";

function FacilityManagement() {
  const tabs = ["Facilities", "Blocks", "Units", "Assets", "Categories"];

  // States
  const [successState, setSuccessState] = useState({
    title: "",
    detail: "",
    status: false,
  });

  const [users, setUsers] = useState<User[]>();
  const [facilities, setFacilities] = useState<Facility[]>();
  const [blocks, setBlocks] = useState<Block[]>();
  const [units, setUnits] = useState<Unit[]>();
  const [assets, setAssets] = useState<Asset[]>();
  const [categories, setCategories] = useState<any[]>();
  const [facility, setAFacility] = useState<Facility>();
  const [asset, setAAsset] = useState<Asset>();
  const [block, setABlock] = useState<Block>();
  const [unit, setAUnit] = useState<Unit>();
  const [category, setACategory] = useState<any>();

  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [centralState, setCentralState] = useState<string>();
  const [centralStateDelete, setCentralStateDelete] = useState<string>();

  // Fetch data functions
  const getUsers = async () => {
    const response = await axiosInstance.get("/users");
    setUsers(response.data.data);
  };

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

  const getCategories = async () => {
    const response = await axiosInstance.get("/assets/category/all");
    setCategories(response.data.data);
  };

  const getABlock = async () => {
    const response = await axiosInstance.get(`/blocks/${activeRowId}`);
    setABlock(response.data.data);
  };

  const getAUnit = async () => {
    const response = await axiosInstance.get(`/units/${activeRowId}`);
    setAUnit(response.data.data);
  };

  const getAAsset = async () => {
    const response = await axiosInstance.get(`/assets/${activeRowId}`);
    setAAsset(response.data.data);
  };

  const getACategory = async () => {
    const response = await axiosInstance.get(
      `/assets/category/sub-category/${activeRowId}`
    );
    setACategory(response.data.data);
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
  const normalizedFacilityBlocks = normalizeItems(
    facility?.blocks || [],
    "blockNumber"
  );
  const normalizedFacilityAssets = normalizeItems(
    facility?.assets || [],
    "assetName"
  );

  const normalizedBlockUnits = normalizeItems(block?.units || [], "unitNumber");
  const normalizedBlockAssets = normalizeItems(
    block?.assets || [],
    "assetName"
  );

  const normalizedUnitAssets = normalizeItems(unit?.assets || [], "assetName");

  const combinedFacilityItems = [
    ...normalizedFacilityBlocks,
    ...normalizedFacilityAssets,
  ];

  const combinedBlockItems = [
    ...normalizedBlockUnits,
    ...normalizedBlockAssets,
  ];

  const combinedUnitItems = [...normalizedUnitAssets];

  const groupedFacilityItem = groupFacilityItems(combinedFacilityItems);
  const groupedBlockItem = groupFacilityItems(combinedBlockItems);
  const groupedUnitItem = groupFacilityItems(combinedUnitItems);

  // Actions
  const toggleActions = (rowId: string) => {
    if (
      selectedTab === "Facilities" ||
      selectedTab === "Blocks" ||
      selectedTab === "Assets" ||
      selectedTab === "Units" ||
      selectedTab === "Categories"
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
      case "createAssetCategory":
        return activeRowId ? "Edit Category" : "Create Category";

      case "createBulkFacility":
        return "Upload Bulk Facility";
      case "viewFacility":
        return "Facility Details";
      case "viewBlock":
        return "Block Details";
      case "viewUnit":
        return "Unit Details";
      case "viewAssetCategory":
        return "Category Details";
      case "assignUserToFacility":
        return "Assign User";
      case "assignUserToBlock":
        return "Assign User";
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
      case "createAssetCategory":
        return activeRowId
          ? "You can edit assets categories details here."
          : "You can manage assets categories here.";
      case "viewFacility":
        return "";
      case "viewBlock":
        return "";
      case "viewUnit":
        return "";
      case "viewAssetCategory":
        return "";
      case "assignUserToFacility":
        return "Assign User to a facility";
      case "assignUserToBlock":
        return "Assign User to a block";
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
      <DynamicCreateForm
        inputs={[
          { name: "name", label: "Facility Name", type: "text" },
          { name: "code", label: "Code", type: "text" },
          { name: "facilityOfficer", label: "Facility Officer", type: "text" },
          { name: "contactName", label: "Contact Name", type: "text" },
          { name: "address", label: "Address", type: "text" },
          { name: "phone", label: "Phone Number", type: "text" },
          { name: "email", label: "Email address", type: "text" },
          {
            name: "nonProcurementLimit",
            label: "Non Procurement Limit",
            type: "text",
          },
        ]}
        selects={[
          {
            name: "type",
            label: "Facility Type",
            placeholder: "Select Facility Type",
            options: [
              { value: "single", label: "Single" },
              { value: "residential", label: "Residential" },
            ],
          },
          {
            name: "commonArea",
            label: "Common Area",
            placeholder: "Common Area",
            options: [
              { value: "no", label: "No" },
              { value: "yes", label: "Yes" },
            ],
          },
          {
            name: "approvalRequiredForImpress",
            label: "Approval Required For Impress",
            placeholder: "Approval Required For Impress",
            options: [
              { value: "no", label: "No" },
              { value: "yes", label: "Yes" },
            ],
          },
          {
            name: "availableForLease",
            label: "Available For Lease",
            placeholder: "Available For Lease",
            options: [
              { value: "no", label: "No" },
              { value: "yes", label: "Yes" },
            ],
          },
          {
            name: "remitLeasePayment",
            label: "Remit Lease Payment",
            placeholder: "Remit Lease Payment",
            options: [
              { value: "no", label: "No" },
              { value: "yes", label: "Yes" },
            ],
          },
          {
            name: "status",
            label: "Status",
            placeholder: "Status",
            options: [
              { value: "Approved", label: "Approved" },
              { value: "Pending", label: "Pending" },
            ],
          },
          {
            name: "assets",
            label: "Assets",
            placeholder: "Assign Assets",
            options: assets?.map((asset: Asset) => ({
              value: asset.id,
              label: asset.assetName,
            })),
            isMulti: true,
          },
        ]}
        title="Facility"
        apiEndpoint="/facilities"
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        fetchResource={(id) =>
          axiosInstance.get(`/facilities/${id}`).then((res) => res.data.data)
        }
      />
    ),
    createBulkUser: <CreateBulkUser />,
    createBlock: (
      <DynamicCreateForm
        inputs={[
          { name: "blockName", label: "Block Name", type: "text" },
          { name: "blockNumber", label: "Block Number", type: "text" },
          { name: "code", label: "Code", type: "text" },
          { name: "facilityOfficer", label: "Facility Officer", type: "text" },
          { name: "contactName", label: "Contact Name", type: "text" },
          { name: "address", label: "Address", type: "text" },
          { name: "phone", label: "Phone Number", type: "text" },
          { name: "email", label: "Email address", type: "text" },
        ]}
        selects={[
          {
            name: "type",
            label: "Block Type",
            placeholder: "Select Block Type",
            options: [
              { value: "single", label: "Single" },
              { value: "residential", label: "Residential" },
            ],
          },
          {
            name: "facilityId",
            label: "Facility",
            placeholder: "Assign a Block to facility",
            options: facilities?.map((asset: Facility) => ({
              value: asset.id,
              label: asset.name,
            })),
          },
          {
            name: "status",
            label: "Status",
            placeholder: "Status",
            options: [
              { value: "Approved", label: "Approved" },
              { value: "Pending", label: "Pending" },
            ],
          },
          {
            name: "assets",
            label: "Assets",
            placeholder: "Assign Assets",
            options: assets?.map((asset: Asset) => ({
              value: asset.id,
              label: asset.assetName,
            })),
            isMulti: true,
          },
          // {
          //   name: "userId",
          //   label: "Client",
          //   placeholder: "Assign Block to a client",
          //   options: users?.map((user: User) => ({
          //     value: user.id,
          //     label: `${user.firstName} ${user.lastName}`,
          //   })),
          // },
        ]}
        title="Block"
        apiEndpoint="/blocks"
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        fetchResource={(id) =>
          axiosInstance.get(`/blocks/${id}`).then((res) => res.data.data)
        }
      />
    ),
    createUnit: (
      <DynamicCreateForm
        inputs={[
          { name: "unitNumber", label: "Unit Number", type: "text" },
          { name: "ownership", label: "Ownership", type: "text" },
          { name: "noOfSQM", label: "No of SQM", type: "text" },
          {
            name: "serviceOrPowerChargeStartDate",
            label: "Service Or Power Charge Start Date",
            type: "date",
          },
          { name: "description", label: "Description", type: "textarea" },
          {
            name: "apportionmentMetric",
            label: "Apportionment Metric",
            type: "number",
          },
        ]}
        selects={[
          {
            name: "type",
            label: "Unit Type",
            placeholder: "Select Unit Type",
            options: [
              { value: "single", label: "Single" },
              { value: "residential", label: "Residential" },
            ],
          },
          {
            name: "bookable",
            label: "Bookable",
            placeholder: "Is it Bookable?",
            options: [
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ],
          },
          {
            name: "commonArea",
            label: "Common Area",
            placeholder: "Common Area?",
            options: [
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ],
          },

          {
            name: "availableForLease",
            label: "Available For Lease",
            placeholder: "Available For Lease",
            options: [
              { value: "no", label: "No" },
              { value: "yes", label: "Yes" },
            ],
          },
          {
            name: "remitLeasePayment",
            label: "Remit Lease Payment",
            placeholder: "Remit Lease Payment",
            options: [
              { value: "no", label: "No" },
              { value: "yes", label: "Yes" },
            ],
          },
          {
            name: "status",
            label: "Status",
            placeholder: "Status",
            options: [
              { value: "Approved", label: "Approved" },
              { value: "Pending", label: "Pending" },
            ],
          },
          {
            name: "subStatus",
            label: "Sub Status",
            placeholder: "Sub Status",
            options: [
              { value: "Approved", label: "Approved" },
              { value: "Pending", label: "Pending" },
            ],
          },
          {
            name: "blockId",
            label: "Block",
            placeholder: "Assign a Unit to block",
            options: blocks?.map((asset: Block) => ({
              value: asset.id,
              label: asset.blockNumber,
            })),
          },
          {
            name: "assets",
            label: "Assets",
            placeholder: "Assign Assets",
            options: assets?.map((asset: Asset) => ({
              value: asset.id,
              label: asset.assetName,
            })),
            isMulti: true,
          },
          {
            name: "userId",
            label: "Client",
            placeholder: "Assign Unit to a client",
            options: users?.map((user: User) => ({
              value: user.id,
              label: `${user.firstName} ${user.lastName}`,
            })),
          },
        ]}
        title="Units"
        apiEndpoint="/units"
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        fetchResource={(id) =>
          axiosInstance.get(`/units/${id}`).then((res) => res.data.data)
        }
      />
    ),
    createAsset: (
      <CreateAsset
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    assignUserToFacility: (
      <DynamicCreateForm
        inputs={[]}
        selects={[
          {
            name: "userId",
            label: "Facility Manager",
            placeholder: "Assign Facility to a User",
            options: users?.map((user: User) => ({
              value: user.id,
              label: `${user.firstName} ${user.lastName}`,
            })),
          },
        ]}
        title="Assign Facility"
        apiEndpoint={`/facilities/${activeRowId}/assign`}
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    assignUserToBlock: (
      <DynamicCreateForm
        inputs={[]}
        selects={[
          {
            name: "userId",
            label: "Facility Manager",
            placeholder: "Assign Block to a User",
            options: users?.map((user: User) => ({
              value: user.id,
              label: `${user.firstName} ${user.lastName}`,
            })),
          },
        ]}
        title="Assign Block"
        apiEndpoint={`/blocks/${activeRowId}/assign`}
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    createAssetCategory: (
      <CreateCategory
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
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
    viewBlock: (
      <div className="p-4">
        <FacilityDetails
          facility={block}
          groupedPermissions={groupedBlockItem || []}
        />
      </div>
    ),
    viewUnit: (
      <div className="p-4">
        <FacilityDetails
          facility={unit}
          groupedPermissions={groupedUnitItem || []}
        />
      </div>
    ),
    viewAssetCategory: (
      <div className="p-4">
        <FacilityDetails facility={category} title="Category" />
      </div>
    ),
  };

  // Permissions and default tab logic
  const tabPermissions: { [key: string]: string[] } = {
    Facilities: ["read_facilities"],
    Blocks: ["read_blocks"],
    Units: ["read_units"],
    Assets: ["read_assets"],
    categories: ["read_assets:/category/all"],
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
      getAssets();
    } else if (selectedTab === "Units") {
      getUnits();
      getAssets();
      getUsers();
    } else if (selectedTab === "Assets") {
      getAssets();
    } else if (selectedTab === "Categories") {
      getCategories();
    } else {
      const fetchData = async () => {
        await Promise.all([
          getFacilities(),
          getBlocks(),
          getUnits(),
          getAssets(),
          getUsers(),
        ]);
      };
      fetchData();
    }
  }, [centralState, centralStateDelete, selectedTab]);

  useEffect(() => {
    if (centralState === "viewFacility") {
      getAFacility();
    } else if (centralState === "viewBlock") {
      getABlock();
    } else if (centralState === "viewUnit") {
      getAUnit();
    } else if (centralState === "viewAssetCategory") {
      getACategory();
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
          {selectedTab === "Categories" && (
            <TableComponent
              data={categories}
              type="categories"
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
