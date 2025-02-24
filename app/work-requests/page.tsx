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
import FacilityDetails from "@/components/facility-management/view-facility";
import CreateWorkRequest from "@/components/work-request/create-work-request";
import CreateWorkRequestForUser from "@/components/work-request/create-work-request-by-facility-manager";
import UpdateWorkRequest from "@/components/work-request/update-work-request";
import AcceptQuotation from "@/components/work-request/acceptQuotation";
import ApportionPower from "@/components/work-request/apportionPower";
import createAxiosInstance from "@/utils/api";
import CommentWorkRequestOrder from "@/components/work-request/comment-request-order";
import CreateBulk from "@/components/user-management/create-bulk";

interface Props {
  nowrap: boolean;
}

function WorkRequests({ nowrap }: Props) {
  const axiosInstance = createAxiosInstance();
  const {
    pagination,
    setPagination,
    userRoles,
    searchQuery,
    filterQuery,
    clearSearchAndPagination,
  } = useDataPermission();

  const hasTenantRole = userRoles.some(
    (role: Role) => role.name === "TENANT_ROLE" || role.name === "VENDOR_ROLE"
  );

  const tabs = ["All Work Request", "My Work Request"];

  const [successState, setSuccessState] = useState({
    title: "",
    detail: "",
    status: false,
  });

  const [assignedworkRequests, setAssignedWorkRequests] = useState<any[]>();
  const [otherWorkRequests, setOtherWorkRequests] = useState<any[]>();
  const [workRequest, setWorkRequest] = useState<any>();
  const [activeRowId, setActiveRowId] = useState<string | null>(null); // Track active row
  const [centralState, setCentralState] = useState<string>();
  const [centralStateDelete, setCentralStateDelete] = useState<string>();
  const [vendors, setVendors] = useState<Vendor[]>();
  const [technician, setTechnicians] = useState<Technician[]>();

  // Fetch data functions
  const getAssignedWorkRequests = async () => {
    const response = await axiosInstance.get(
      `/work-requests/my-work-requests/all?page=${pagination.currentPage}&&paginate=true&&search=${searchQuery}&&${filterQuery}`
    );
    setAssignedWorkRequests(response.data.data);
    const extra = response.data?.extra;
    setPagination({
      currentPage: extra?.page,
      pageSize: extra?.pageSize,
      total: extra?.total,
      totalPages: extra?.totalPages,
    });
  };

  const getAssignedWorkRequestsOrder = async () => {
    const response = await axiosInstance.get(
      `/work-requests/my-requests/all?page=${pagination.currentPage}&&paginate=true&&search=${searchQuery}&&${filterQuery}`
    );
    setAssignedWorkRequests(response.data.data);
    const extra = response.data?.extra;
    setPagination({
      currentPage: extra?.page,
      pageSize: extra?.pageSize,
      total: extra?.total,
      totalPages: extra?.totalPages,
    });
  };

  const getOtherWorkRequests = async () => {
    const response = await axiosInstance.get(
      `/work-requests?page=${pagination.currentPage}&&paginate=true&&search=${searchQuery}&&${filterQuery}`
    );
    setOtherWorkRequests(response.data.data);
    const extra = response?.data.extra;
    if (extra) {
      setPagination({
        currentPage: extra?.page,
        pageSize: extra?.pageSize,
        total: extra?.total,
        totalPages: extra?.totalPages,
      });
    }
  };

  const getVendors = async () => {
    const response = await axiosInstance.get("/vendors");
    setVendors(response.data.data);
  };

  const getTechnicians = async () => {
    const response = await axiosInstance.get("/technicians");
    setTechnicians(response.data.data);
  };

  const getAWorkRequest = async () => {
    const response = await axiosInstance.get(`/work-requests/${activeRowId}`);
    setWorkRequest(response.data.data);
  };

  // Delete functions
  const deleteWorkRequests = async () => {
    await axiosInstance.delete(`/work-requests/${activeRowId}`);
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully de-activated this vendor",
      status: true,
    });
  };

  const apportionServiceCharge = async () => {
    await axiosInstance.patch(
      `/work-requests/${activeRowId}/apportion/service-charge`
    );
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully apportion cost",
      status: true,
    });
  };

  const assignProcurement = async () => {
    await axiosInstance.patch(
      `/work-requests/${activeRowId}/assign/to-procurement`
    );
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully assigned procurement",
      status: true,
    });
  };

  // Toggle actions
  const toggleActions = (rowId: string) => {
    if (
      selectedTab === "My Work Request" ||
      selectedTab === "All Work Request"
    ) {
      setActiveRowId((prevId) => (prevId === rowId ? null : rowId));
    } else {
      setActiveRowId(rowId);
    }
  };

  // Dynamic title and detail logic
  const getTitle = () => {
    switch (centralState) {
      case "createWorkRequest":
      case "createWorkRequestforUser":
        return activeRowId ? "Edit Work Request" : "Create Work Request";
      case "createBulkWorkRequest":
        return "Upload Bulk Work Request";
      case "createBulkWorkRequestforUser":
        return "Upload Bulk Work Request for User";
      case "viewWorkRequest":
        return "Work Request Details";
      case "commentWorkRequest":
        return "Add comment";
      case "attatchmentWorkRequest":
        return "Add attatchment";
      case "quotationsWorkRequest":
        return "Add quotation";
      case "updateStatusWorkRequest":
        return "Update Status";
      case "assignTechnicianWorkRequest":
        return "Assign Technician";
      case "acceptQuotation":
        return "Accept Quotation";
    }
    switch (centralStateDelete) {
      case "deactivateWorkRequest":
        return "De-activate Work Request ";
      case "activateWorkRequest":
        return "Re-activate Work Request";
      case "deactivateWorkRequest":
        return "De-activate Work Request ";
      case "activateWorkRequest":
        return "Re-activate Work Request";
      case "apportionServiceCharge":
        return "Apportion Cost";
      case "assignProcurement":
        return "Assign Procurement";
    }
    return "Zijela";
  };

  const getDetail = () => {
    switch (centralState) {
      case "createWorkRequest":
      case "createWorkRequestforUser":
        return activeRowId
          ? "You can edit work request details here."
          : "You can create and manage work request here.";
      case "createBulkWorkRequest":
        return "Import CSV/Excel file";
      case "createBulkWorkRequestforUser":
        return "Import CSV/Excel file";
      case "viewWorkRequest":
        return "";
      case "commentWorkRequest":
        return "";
      case "attatchmentWorkRequest":
        return "";
      case "quotationsWorkRequest":
        return "";
      case "updateStatusWorkRequest":
        return "";
      case "assignTechnicianWorkRequest":
        return "";
      case "acceptQuotation":
        return "";
    }
    switch (centralStateDelete) {
      case "activateWorkRequest":
        return "Are you sure you want to Re-activate this work request";
      case "deactivateWorkRequest":
        return "Are you sure you want to de-activate this work request";
      case "activateWorkRequest":
        return "Are you sure you want to Re-activate this work request";
      case "deactivateWorkRequest":
        return "Are you sure you want to de-activate this work request";
      case "apportionServiceCharge":
        return "You want to apportion cost for this work request";
      case "assignProcurement":
        return "You want to assign Procurement";
    }
    return "Zijela";
  };

  // Mapping centralState values to components
  const componentMap: Record<string, JSX.Element> = {
    createWorkRequest: (
      <CreateWorkRequest
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    createBulkWorkRequest: (
      <CreateBulk
        type="Work Requests"
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    createWorkRequestforUser: (
      <CreateWorkRequestForUser
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    createBulkWorkRequestforUser: (
      <CreateBulk
        type="Work Requests for user"
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    commentWorkRequest: (
      <>
        <CommentWorkRequestOrder
          activeRowId={activeRowId}
          setModalState={setCentralState}
          setSuccessState={setSuccessState}
          type={"requests"}
        />
      </>
    ),
    attatchmentWorkRequest: (
      <DynamicCreateForm
        inputs={[
          { name: "title", label: "Title", type: "text" },
          { name: "file", label: "File", type: "file" },
        ]}
        selects={[]}
        title="Add Attachment"
        apiEndpoint={`/work-requests/${activeRowId}/upload-attachment`}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    quotationsWorkRequest: (
      <DynamicCreateForm
        selects={[
          {
            name: "entity",
            label: "Select",
            placeholder: "Assign ",
            options: [
              { value: "Technician", label: "Technician" },
              { value: "Vendor", label: "Vendor" },
            ],
          },
          {
            name: "id",
            label: "Vendor",
            placeholder: "Select Vendor",
            options: vendors?.map((unit: Vendor) => ({
              value: Number(unit?.id),
              label: unit.vendorName,
            })),
          },
          {
            name: "id",
            label: "Technician",
            placeholder: "Select Technician",
            options: technician?.map((tech: Technician) => ({
              value: Number(tech?.id),
              label: `${tech.firstName} ${tech.surname}`,
            })),
          },
        ]}
        inputs={[
          { name: "title", label: "Title", type: "text" },
          { name: "file", label: "FIle", type: "file" },
          { name: "amount", label: "Amount", type: "number" },
          { name: "startDate", label: "Start Date", type: "date" },
          { name: "endDate", label: "End Date", type: "date" },
        ]}
        title="Add Quotation"
        apiEndpoint={`/work-requests/${activeRowId}/upload-quotation`}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    updateStatusWorkRequest: (
      <UpdateWorkRequest
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    assignTechnicianWorkRequest: (
      <DynamicCreateForm
        selects={[
          {
            name: "entity",
            label: "Select",
            placeholder: "Assign ",
            options: [
              { value: "Technician", label: "Technician" },
              { value: "Vendor", label: "Vendor" },
            ],
          },
          {
            name: "id",
            label: "Vendor",
            placeholder: "Select Vendor",
            options: vendors?.map((unit: Vendor) => ({
              value: Number(unit?.id),
              label: unit.vendorName,
            })),
          },
          {
            name: "id",
            label: "Technician",
            placeholder: "Select Technician",
            options: technician?.map((tech: Technician) => ({
              value: Number(tech?.id),
              label: `${tech.firstName} ${tech.surname}`,
            })),
          },
        ]}
        inputs={[]}
        title="Assign Technician"
        apiEndpoint={`/work-requests/${activeRowId}/assign`}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    acceptQuotation: (
      <AcceptQuotation
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    viewWorkRequest: (
      <div className="p-4">
        <FacilityDetails facility={workRequest} title="Work Request" />
      </div>
    ),
  };

  useEffect(() => {
    if (centralState === "viewWorkRequest") {
      getAWorkRequest();
    }
    if (centralState === "quotationsWorkRequest") {
      getVendors();
      getTechnicians();
    }
    if (centralState === "assignTechnicianWorkRequest") {
      getTechnicians();
    }
  }, [centralState]);

  const tabPermissions: { [key: string]: string[] } = {
    "My Work Request": ["read_work-requests:my-work-requests/all"],
    "All Work Request": ["read_work-requests"],
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
    if (selectedTab === "All Work Request") {
      const fetchData = async () => {
        await Promise.all([getOtherWorkRequests()]);
      };
      fetchData();
    } else if (selectedTab === "My Work Request" && hasTenantRole) {
      getAssignedWorkRequestsOrder();
    } else if (selectedTab === "My Work Request") {
      getAssignedWorkRequests();
    }
  }, [
    centralState,
    centralStateDelete,
    selectedTab,
    pagination.currentPage,
    searchQuery,
    filterQuery,
  ]);

  //new clear
  useEffect(() => {
    clearSearchAndPagination();
  }, [selectedTab]);

  return (
    <DashboardLayout
      title="Work Request"
      detail="Submit work request here and view created work requests"
      nowrap={nowrap}
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
          centralStateDelete === "deactivateWorkRequest" ||
          centralStateDelete === "activateWorkRequest"
            ? deleteWorkRequests
            : centralStateDelete === "apportionServiceCharge"
            ? apportionServiceCharge
            : centralStateDelete === "assignProcurement"
            ? assignProcurement
            : deleteWorkRequests
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
          "read_work-requests",
          "read_work-requests:my-facilities-work-request/all",
          "read_work-requests:my-work-requests/all",
        ]}
      >
        <div
          className={`relative ${nowrap && "hidden"} bg-white rounded-2xl p-4`}
        >
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
        requiredPermissions={[
          "read_work-requests",
          "read_work-requests:my-facilities-work-request/all",
          "read_work-requests:my-work-requests/all",
        ]}
      >
        <div className="relative bg-white rounded-2xl p-4 mt-4">
          {selectedTab === "My Work Request" && (
            <TableComponent
              data={assignedworkRequests}
              type="workrequests"
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
          {selectedTab === "All Work Request" && (
            <TableComponent
              data={otherWorkRequests}
              type="workrequests"
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
        </div>
      </PermissionGuard>
    </DashboardLayout>
  );
}

export default withPermissions(WorkRequests, ["work-requests"]);
