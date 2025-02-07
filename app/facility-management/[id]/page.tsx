"use client";

import { JSX, useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout-component";
import TableComponent from "@/components/table-component";
import ModalCompoenent, {
  ActionModalCompoenent,
  SuccessModalCompoenent,
} from "@/components/modal-component";
import CreateBulkUser from "@/components/user-management/create-bulk-user";
import { useParams, useRouter } from "next/navigation";
import withPermissions from "@/components/auth/permission-protected-routes";
import DynamicCreateForm from "@/components/dynamic-create-form";
import createAxiosInstance from "@/utils/api";

function FacilityManagement() {
  const axiosInstance = createAxiosInstance();
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
  const deleteFacility = async () => {
    await axiosInstance.delete(`/facilities/${activeRowId}`);
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully de-activated this facility",
      status: true,
    });
  };

  // Roles state and fetch function
  const [assets, setAssets] = useState<Asset[]>();
  const getAssets = async () => {
    const response = await axiosInstance.get("/assets");
    setAssets(response.data.data);
  };

  const [users, setUsers] = useState<User[]>();
  const getUsers = async () => {
    const response = await axiosInstance.get("/users");
    setUsers(response.data.data);
  };

  // Single role state and fetch function
  const [asset, setAsset] = useState<Asset>();
  const getAAsset = async () => {
    const response = await axiosInstance.get(`/assets/${id}`);
    setAsset(response.data.data);
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
      await Promise.all([getAssets(), getAAsset(), getUsers()]);
    };
    fetchData();
  }, []);

  useEffect(() => {
    getAAsset();
  }, [centralState, centralStateDelete]);

  // Dynamic title logic
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
      case "assignUserToFacility":
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
      case "viewFacility":
        return "";
      case "assignUserToFacility":
        return "Assign facility to users";
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

  // Component mapping for central state
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
    assignUserToFacility: (
      <DynamicCreateForm
        inputs={[]}
        selects={[
          {
            name: "userIds",
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
  };

  // Utility function to format role names
  function formatRoleName(roleName: string): string {
    return `${roleName
      ?.replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")} `;
  }

  return (
    <DashboardLayout
      title={asset?.assetName ? formatRoleName(asset?.assetName) : "...."}
      detail="Facility Management"
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
        takeAction={deleteFacility}
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
          data={asset?.facilities}
          type="facilities"
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
export default withPermissions(FacilityManagement, ["users", "assets"]);
