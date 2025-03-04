"use client";

import { JSX, useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout-component";
import TableComponent from "@/components/table-component";
import ModalCompoenent, {
  ActionModalCompoenent,
  SuccessModalCompoenent,
} from "@/components/modal-component";
import CreateBulkUser from "@/components/user-management/create-bulk";
import withPermissions from "@/components/auth/permission-protected-routes";
import PermissionGuard from "@/components/auth/permission-protected-components";
import { useDataPermission } from "@/context";
import FacilityDetails from "@/components/facility-management/view-facility";
import DynamicCreateForm from "@/components/dynamic-create-form";
import CreateCategory from "@/components/facility-management/create-category";
import CreateAsset from "@/components/facility-management/create-asset";
import createAxiosInstance from "@/utils/api";
import FundWallet from "@/components/transaction/fund-wallet";
import CreateBulk from "@/components/user-management/create-bulk";
import Payouts from "@/components/transaction/payout";

function FacilityManagement() {
  const axiosInstance = createAxiosInstance();
  const {
    pagination,
    setPagination,
    searchQuery,
    filterQuery,
    clearSearchAndPagination,
  } = useDataPermission();
  const tabs = [
    "Facilities",
    "My Facilities",
    "Blocks",
    "My Blocks",
    "Units",
    "My Units",
    "Assets",
    "Categories",
  ];

  const [successState, setSuccessState] = useState({
    title: "",
    detail: "",
    status: false,
  });

  const [users, setUsers] = useState<User[]>();

  const [facilities, setFacilities] = useState<Facility[]>();
  const [blocks, setBlocks] = useState<Block[]>();
  const [units, setUnits] = useState<Unit[]>();

  const [myFacilities, setMyFacilities] = useState<Facility[]>();
  const [myBlocks, setMyBlocks] = useState<Block[]>();
  const [myUnits, setMyUnits] = useState<Unit[]>();

  const [assets, setAssets] = useState<Asset[]>();
  const [categories, setCategories] = useState<any[]>();
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
    const response = await axiosInstance.get(
      `/facilities?page=${pagination.currentPage}&&paginate=true&&search=${searchQuery}&&${filterQuery}`
    );
    setFacilities(response.data.data);
    const extra = response.data.extra;
    setPagination({
      currentPage: extra.page,
      pageSize: extra.pageSize,
      total: extra.total,
      totalPages: extra.totalPages,
    });
  };

  const getFacilitiesUnpaginated = async () => {
    const response = await axiosInstance.get(`/facilities`);
    setFacilities(response.data.data);
  };

  const getMyFacilities = async () => {
    const response = await axiosInstance.get(
      `/facilities/my-facilities/all?page=${pagination.currentPage}&&paginate=true&&search=${searchQuery}&&${filterQuery}`
    );
    setMyFacilities(response.data.data);
    const extra = response.data.extra;
    setPagination({
      currentPage: extra.page,
      pageSize: extra.pageSize,
      total: extra.total,
      totalPages: extra.totalPages,
    });
  };

  const getMyFacilitiesUnpaginated = async () => {
    const response = await axiosInstance.get(`/facilities/my-facilities/all`);
    setFacilities(response.data.data);
  };

  const getBlocks = async () => {
    const response = await axiosInstance.get(
      `/blocks?page=${pagination.currentPage}&&paginate=true&&search=${searchQuery}&&${filterQuery}`
    );
    setBlocks(response.data.data);
    const extra = response.data.extra;
    setPagination({
      currentPage: extra.page,
      pageSize: extra.pageSize,
      total: extra.total,
      totalPages: extra.totalPages,
    });
  };

  const getBlocksUnpaginated = async () => {
    const response = await axiosInstance.get(`/blocks`);
    setBlocks(response.data.data);
  };

  const getMyBlocks = async () => {
    const response = await axiosInstance.get(
      `/blocks/my-blocks/all?page=${pagination.currentPage}&&paginate=true&&search=${searchQuery}&&${filterQuery}`
    );
    setMyBlocks(response.data.data);
    const extra = response.data.extra;
    setPagination({
      currentPage: extra.page,
      pageSize: extra.pageSize,
      total: extra.total,
      totalPages: extra.totalPages,
    });
  };

  const getMyBlocksUnpaginated = async () => {
    const response = await axiosInstance.get(`/blocks/my-blocks/all`);
    setMyBlocks(response.data.data);
  };

  const getUnits = async () => {
    const response = await axiosInstance.get(
      `/units?page=${pagination.currentPage}&&paginate=true&&search=${searchQuery}&&${filterQuery}`
    );
    setUnits(response.data.data);
    const extra = response.data.extra;
    setPagination({
      currentPage: extra.page,
      pageSize: extra.pageSize,
      total: extra.total,
      totalPages: extra.totalPages,
    });
  };

  const getMyUnits = async () => {
    const response = await axiosInstance.get(
      `/units/my-units/all?page=${pagination.currentPage}&&paginate=true&&search=${searchQuery}&&${filterQuery}`
    );
    setMyUnits(response.data.data);
    const extra = response.data.extra;
    setPagination({
      currentPage: extra.page,
      pageSize: extra.pageSize,
      total: extra.total,
      totalPages: extra.totalPages,
    });
  };

  const getAssets = async () => {
    const response = await axiosInstance.get("/assets");
    setAssets(response.data.data);
  };

  const getCategories = async () => {
    const response = await axiosInstance.get("/assets/category/all");
    setCategories(response.data.data);
  };

  const getACategory = async () => {
    const response = await axiosInstance.get(
      `/assets/category/sub-category/${activeRowId}`
    );
    setACategory(response.data.data);
  };

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

  // Actions
  const toggleActions = (rowId: string) => {
    if (
      selectedTab === "Facilities" ||
      selectedTab === "My Facilities" ||
      selectedTab === "Blocks" ||
      selectedTab === "My Blocks" ||
      selectedTab === "Units" ||
      selectedTab === "My Units" ||
      selectedTab === "Assets" ||
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
      case "createBulkBlock":
        return "Upload Bulk Block";
      case "createBulkUnit":
        return "Upload Bulk Unit";
      case "createBulkAsset":
        return "Upload Bulk Asset";
      case "createBulkAssetCategory":
        return "Upload Bulk Category";
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
        case "assignUserToUnit":
          return "Assign User";
      case "fundWallet":
        return "Fund Wallet";
      case "payoutUnits":
      case "payoutFacilities":
        return "Transfer";
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
      case "createBulkBlock":
        return "Import CSV/Excel file";
      case "createBulkUnit":
        return "Import CSV/Excel file";
      case "createBulkAsset":
        return "Import CSV/Excel file";
      case "createBulkAssetCategory":
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
      case "fundWallet":
        return "";
      case "payoutUnits":
      case "payoutFacilities":
        return "";
      case "assignUserToFacility":
        return "Assign facility to users";
      case "assignUserToBlock":
        return "Assign User to a block";
        case "assignUserToUnit":
          return "Assign User to a unit";
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

  // Permissions and default tab logic
  const tabPermissions: { [key: string]: string[] } = {
    Facilities: ["read_facilities"],
    "My Facilities": ["read_facilities:my-facilities/all"],
    Blocks: ["read_blocks"],
    "My Blocks": ["read_blocks:my-blocks/all"],
    Units: ["read_units"],
    "My Units": ["read_units:my-units/all"],
    Assets: ["read_assets"],
    Categories: ["read_assets:/category/all"],
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
          axiosInstance
            .get(`/facilities/${id}`)
            .then((res) => res.data.data)
        }
      />
    ),
    createBulkFacility: (
      <CreateBulkUser
        type="Facilities"
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    createBulkBlock: (
      <CreateBulkUser
        type="Blocks"
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    createBulkUnit: (
      <CreateBulkUser
        type="Units"
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
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
            placeholder: "Assign Block to facility",
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
        ]}
        title="Block"
        apiEndpoint="/blocks"
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        fetchResource={(id) =>
          axiosInstance
            .get(`/blocks/${id}`)
            .then((res) => res.data.data)
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
          axiosInstance
            .get(`/units/${id}`)
            .then((res) => res.data.data)
        }
      />
    ),
    fundWallet: (
      <FundWallet
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        type={selectedTab}
      />
    ),
    payoutFacilities: (
      <Payouts
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        type={"Facilities"}
      />
    ),
    payoutUnits: (
      <Payouts
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        type={"Units"}
      />
    ),
    createAsset: (
      <CreateAsset
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    createBulkAsset: (
      <CreateBulk
        type="Assets"
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
            name: "facilityOfficers",
            label: "Facility Manager",
            placeholder: "Assign Facility to Users",
            options: users?.map((user: User) => ({
              value: user.id,
              label: `${user.firstName} ${user.lastName}`,
            })),
            isMulti: true,
          },
        ]}
        title="Assign Facility"
        apiEndpoint={`/facilities/${activeRowId}/assign`}
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        fetchResource={(id) =>
          axiosInstance.get(`/facilities/${id}`).then((res) => res.data.data)
        }
      />
    ),
    assignUserToBlock: (
      <DynamicCreateForm
        inputs={[]}
        selects={[
          {
            name: "blockOfficers",
            label: "Facility Manager",
            placeholder: "Assign Block to a User",
            options: users?.map((user: User) => ({
              value: user.id,
              label: `${user.firstName} ${user.lastName}`,
            })),
            isMulti: true,
          },
        ]}
        title="Assign Block"
        apiEndpoint={`/blocks/${activeRowId}/assign`}
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        fetchResource={(id) =>
          axiosInstance.get(`/blocks/${id}`).then((res) => res.data.data)
        }
      />
    ),
    assignUserToUnit: (
      <DynamicCreateForm
        inputs={[]}
        selects={[
          {
            name: "unitOfficers",
            label: "Unit Manager",
            placeholder: "Assign Unit to a User",
            options: users?.map((user: User) => ({
              value: user.id,
              label: `${user.firstName} ${user.lastName}`,
            })),
            isMulti: true,
          },
        ]}
        title="Assign Unit"
        apiEndpoint={`/units/${activeRowId}/assign/officers`}
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        fetchResource={(id) =>
          axiosInstance.get(`/units/${id}`).then((res) => res.data.data)
        }
      />
    ),
    createAssetCategory: (
      <CreateCategory
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    createBulkAssetCategory: (
      <CreateBulk
        type="Categories"
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    viewAssetCategory: (
      <div className="p-4">
        <FacilityDetails facility={category} title="Category" />
      </div>
    ),
  };

  // Fetch data on tab change or state change
  useEffect(() => {
    if (selectedTab === "Blocks") {
      getBlocks();
      getFacilitiesUnpaginated();
      getAssets();
      getUsers();
    } else if (selectedTab === "My Blocks") {
      getMyBlocks();
      getMyFacilitiesUnpaginated();
      getAssets();
      getUsers();
    } else if (selectedTab === "Units") {
      getUnits();
      getBlocksUnpaginated();
      getAssets();
      getUsers();
    } else if (selectedTab === "My Units") {
      getMyUnits();
      getMyBlocksUnpaginated();
      getAssets();
      getUsers();
      getMyBlocks();
    } else if (selectedTab === "Assets") {
      getAssets();
    } else if (selectedTab === "Categories") {
      getCategories();
    } else if (selectedTab === "My Facilities") {
      const fetchData = async () => {
        await Promise.all([getMyFacilities(), getAssets(), getUsers()]);
      };
      fetchData();
    } else {
      const fetchData = async () => {
        await Promise.all([getFacilities(), getAssets(), getUsers()]);
      };
      fetchData();
    }
  }, [selectedTab, pagination.currentPage]);

  useEffect(() => {
    if (selectedTab === "Blocks") {
      getBlocks();
    } else if (selectedTab === "My Blocks") {
      getMyBlocks();
    } else if (selectedTab === "Units") {
      getUnits();
    } else if (selectedTab === "My Units") {
      getMyUnits();
    } else if (selectedTab === "Assets") {
      getAssets();
    } else if (selectedTab === "Categories") {
      getCategories();
    } else if (selectedTab === "My Facilities") {
      getMyFacilities();
    } else {
      getFacilities();
    }
  }, [centralState, centralStateDelete, searchQuery, filterQuery]);

  useEffect(() => {
    if (centralState === "viewAssetCategory") {
      getACategory();
    }
  }, [centralState]);

  //new clear
  useEffect(() => {
    clearSearchAndPagination();
  }, [selectedTab]);

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
        requiredPermissions={[
          "read_facilities",
          "read_facilities:my-facilities/all",
          "read_blocks",
          "read_blocks:my-blocks/all",
          "read_units",
          "read_units:my-units/all",
          "read_assets",
          "read_assets:/category/all",
        ]}
      >
        <div className="relative bg-white rounded-2xl p-4">
          <div className="overflow-x-auto whitespace-nowrap pb-2">
            <div className="flex space-x-4 ">
              {tabs.map((tab) => (
                <PermissionGuard
                  key={tab}
                  requiredPermissions={tabPermissions[tab] || []} // Match tab to permissions
                >
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`relative text-gray-500 hover:text-gray-900 px-4 py-2 text-xs font-medium focus:outline-none group ${
                      selectedTab === tab ? "text-[#A8353A] font-semibold" : ""
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
        </div>
      </PermissionGuard>

      <PermissionGuard
        requiredPermissions={[
          "read_facilities",
          "read_facilities:my-facilities/all",
          "read_blocks",
          "read_blocks:my-blocks/all",
          "read_units",
          "read_units:my-units/all",
          "read_assets",
          "read_assets:/category/all",
        ]}
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
              currentPage={pagination.currentPage}
              setCurrentPage={(page) =>
                setPagination({ ...pagination, currentPage: page })
              }
              itemsPerPage={pagination.pageSize}
              totalPages={pagination.totalPages}
            />
          )}

          {selectedTab === "My Facilities" && (
            <TableComponent
              data={myFacilities}
              type="facilities"
              setModalState={setCentralState}
              setModalStateDelete={setCentralStateDelete}
              toggleActions={toggleActions}
              activeRowId={activeRowId}
              setActiveRowId={setActiveRowId}
              deleteAction={setCentralStateDelete}
              currentPage={pagination.currentPage}
              setCurrentPage={(page) =>
                setPagination({ ...pagination, currentPage: page })
              }
              itemsPerPage={pagination.pageSize}
              totalPages={pagination.totalPages}
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
              currentPage={pagination.currentPage}
              setCurrentPage={(page) =>
                setPagination({ ...pagination, currentPage: page })
              }
              itemsPerPage={pagination.pageSize}
              totalPages={pagination.totalPages}
            />
          )}

          {selectedTab === "My Blocks" && (
            <TableComponent
              data={myBlocks}
              type="blocks"
              setModalState={setCentralState}
              setModalStateDelete={setCentralStateDelete}
              toggleActions={toggleActions}
              activeRowId={activeRowId}
              setActiveRowId={setActiveRowId}
              deleteAction={setCentralStateDelete}
              currentPage={pagination.currentPage}
              setCurrentPage={(page) =>
                setPagination({ ...pagination, currentPage: page })
              }
              itemsPerPage={pagination.pageSize}
              totalPages={pagination.totalPages}
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
              currentPage={pagination.currentPage}
              setCurrentPage={(page) =>
                setPagination({ ...pagination, currentPage: page })
              }
              itemsPerPage={pagination.pageSize}
              totalPages={pagination.totalPages}
            />
          )}
          {selectedTab === "My Units" && (
            <TableComponent
              data={myUnits}
              type="units"
              setModalState={setCentralState}
              setModalStateDelete={setCentralStateDelete}
              toggleActions={toggleActions}
              activeRowId={activeRowId}
              setActiveRowId={setActiveRowId}
              deleteAction={setCentralStateDelete}
              currentPage={pagination.currentPage}
              setCurrentPage={(page) =>
                setPagination({ ...pagination, currentPage: page })
              }
              itemsPerPage={pagination.pageSize}
              totalPages={pagination.totalPages}
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
