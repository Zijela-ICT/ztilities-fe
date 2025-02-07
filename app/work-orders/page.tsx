"use client";

import { JSX, useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout-component";
import TableComponent from "@/components/table-component";
import ModalCompoenent, {
  ActionModalCompoenent,
  SuccessModalCompoenent,
} from "@/components/modal-component";

import withPermissions from "@/components/auth/permission-protected-routes";
import PermissionGuard from "@/components/auth/permission-protected-components";
import { useDataPermission } from "@/context";
import DynamicCreateForm from "@/components/dynamic-create-form";
import FacilityDetails from "@/components/facility-management/view-facility";
import CreateWorkOrder from "@/components/work-order/create-work-order";
import UpdateWorkOrder from "@/components/work-order/update-work-order";
import AcceptQuotation from "@/components/work-order/acceptQuotation";

import ButtonComponent from "@/components/button-component";
import createAxiosInstance from "@/utils/api";

interface Props {
  nowrap: boolean;
}

function WorkOrders({ nowrap }: Props) {
  const axiosInstance = createAxiosInstance();
  const { pagination, setPagination } = useDataPermission();
  const tabs = ["All Work Order", "My Work Order"];

  const [successState, setSuccessState] = useState({
    title: "",
    detail: "",
    status: false,
  });

  const [users, setUsers] = useState<User[]>();
  const [assignedworkOrders, setAssignedWorkOrders] = useState<any[]>();
  const [workOrders, setWorkOrders] = useState<any[]>();
  const [workOrder, setWorkOrder] = useState<any>();
  const [activeRowId, setActiveRowId] = useState<string | null>(null); // Track active row
  const [centralState, setCentralState] = useState<string>();
  const [centralStateDelete, setCentralStateDelete] = useState<string>();
  const [vendors, setVendors] = useState<Vendor[]>();
  const [technician, setTechnicians] = useState<Technician[]>();

  // Fetch data functions
  const getUsers = async () => {
    const response = await axiosInstance.get("/users");
    setUsers(response.data.data);
  };

  const getWorkOrders = async () => {
    const response = await axiosInstance.get(`/work-requests/work-order/all?page=${pagination.currentPage}&&paginate=true`);
    setWorkOrders(response.data.data);
    const extra = response.data.extra;
    setPagination({
      currentPage: extra.page,
      pageSize: extra.pageSize,
      total: extra.total,
      totalPages: extra.totalPages,
    });
  };

  const getAssignedWorkOrders = async () => {
    const response = await axiosInstance.get(
      `/work-requests/my-work-orders/all?page=${pagination.currentPage}&&paginate=true`
    );
    setAssignedWorkOrders(response.data.data);
    const extra = response.data.extra;
    setPagination({
      currentPage: extra.page,
      pageSize: extra.pageSize,
      total: extra.total,
      totalPages: extra.totalPages,
    });
  };

  const getVendors = async () => {
    const response = await axiosInstance.get("/vendors");
    setVendors(response.data.data);
  };

  const getTechnicians = async () => {
    const response = await axiosInstance.get("/technicians");
    setTechnicians(response.data.data);
  };

  const getAWorkOrder = async () => {
    const response = await axiosInstance.get(`/work-requests/${activeRowId}`);
    setWorkOrder(response.data.data);
  };

  // Delete functions
  const deleteWorkOrders = async () => {
    await axiosInstance.delete(`/work-orders/${activeRowId}`);
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully de-activated this work order",
      status: true,
    });
  };

  // Delete functions
  const closeWorkOrder = async () => {
    await axiosInstance.patch(`/work-requests/${activeRowId}/status/close`);
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully closed work order",
      status: true,
    });
  };

  const approveWorkOrder = async () => {
    await axiosInstance.patch(`/work-requests/${activeRowId}/status/approve`);
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully approved work order",
      status: true,
    });
  };

  const acceptWorkOrder = async () => {
    await axiosInstance.patch(
      `/work-requests/${activeRowId}/accept/work-order-by-procurement`
    );
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully accepted work order",
      status: true,
    });
  };

  const raisePaymentOrder = async () => {
    await axiosInstance.patch(
      `/work-requests/${activeRowId}/quotations/raise-payment-order`
    );
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully raised payment order",
      status: true,
    });
  };

  const requestQuotationSelection = async () => {
    await axiosInstance.patch(
      `/work-requests/${activeRowId}/quotations/request-quotation-selection`
    );
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully requested quotation to be selected",
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
      detail: "You have successfully apportion service charge",
      status: true,
    });
  };

  const approveApportionServiceCharge = async () => {
    await axiosInstance.patch(
      `/work-requests/${activeRowId}/apportion/service-charge/approve`
    );
    setCentralState("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully approved apportion service charge",
      status: true,
    });
  };

  // Toggle actions
  const toggleActions = (rowId: string) => {
    setActiveRowId((prevId) => (prevId === rowId ? null : rowId));
  };

  // Dynamic title and detail logic
  const getTitle = () => {
    switch (centralState) {
      case "createWorkOrder":
      case "createWorkOrderforUser":
        return activeRowId ? "Edit Work Order" : "Create Work Order";
      case "viewWorkOrder":
        return "Work Order Details";
      case "viewServiceCharge":
        return "Apportionment Details";
      case "commentWorkOrder":
        return "Add comment";
      case "attatchmentWorkOrder":
        return "Add attatchment";
      case "quotationsWorkOrder":
        return "Add quotation";
      case "updateStatusWorkOrder":
        return "Update Status";
      case "assignTechnicianWorkOrder":
        return "Assign Technician";
      case "acceptQuotation":
        return "Accept Quotation";
      case "closeWorkOrder":
        return "Close Work Order ";
      case "requestquotationsapproval":
        return "Request quotation approval";
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
      case "apportionServiceCharge":
        return "Apportion Service charge";
      case "approveQuotation":
        return "Approve Quotation";
      case "acceptWorkOrder":
        return "Accept Work Order";
      case "requestquotationsselection":
        return "Request quotation selection";
      case "raisePaymentOrder":
        return "Raise Payment Order";
    }
    return "Zijela";
  };

  const getDetail = () => {
    switch (centralState) {
      case "createWorkOrder":
      case "createWorkOrderforUser":
        return activeRowId
          ? "You can edit work order details here."
          : "You can create and manage work order here.";
      case "viewWorkOrder":
        return "";
      case "viewServiceCharge":
        return "";
      case "commentWorkOrder":
        return "";
      case "attatchmentWorkOrder":
        return "";
      case "quotationsWorkOrder":
        return "";
      case "updateStatusWorkOrder":
        return "";
      case "assignTechnicianWorkOrder":
        return "";
      case "acceptQuotation":
        return "";
      case "requestquotationsapproval":
        return "";
      case "closeWorkOrder":
        return "";
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
      case "apportionServiceCharge":
        return "You want to apportion service charge for this work order";
      case "requestquotationsselection":
        return "You want to request this quotation for selection";
      case "approveQuotation":
        return "You want to approve this quuotation";
      case "acceptWorkOrder":
        return "Are you sure you want to approve this work order";
      case "raisePaymentOrder":
        return "Are you sure you want to raise payment order";
    }
    return "Zijela";
  };

  // Mapping centralState values to components
  const componentMap: Record<string, JSX.Element> = {
    createWorkOrder: (
      <CreateWorkOrder
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    commentWorkOrder: (
      <DynamicCreateForm
        inputs={[{ name: "comment", label: "Comment", type: "textarea" }]}
        selects={[]}
        title="Add Comment"
        apiEndpoint={`/work-requests/${activeRowId}/comments`}
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    attatchmentWorkOrder: (
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
    quotationsWorkOrder: (
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
          { name: "dueDate", label: "Due Date", type: "date" },
        ]}
        title="Add Quotation"
        apiEndpoint={`/work-requests/${activeRowId}/upload-quotation`}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    updateStatusWorkOrder: (
      <UpdateWorkOrder
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    closeWorkOrder: (
      <DynamicCreateForm
        selects={[]}
        inputs={[
          { name: "comment", label: "Comment", type: "textarea" },
          { name: "file", label: "Attachment", type: "file" },
        ]}
        title="Close Work Order"
        apiEndpoint={`/work-requests/${activeRowId}/status/close`}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    assignTechnicianWorkOrder: (
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
        apiEndpoint={`/work-orders/${activeRowId}/assign`}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    requestquotationsapproval: (
      <>
        <DynamicCreateForm
          inputs={[
            { name: "title", label: "Title", type: "text" },
            { name: "description", label: "Description", type: "textarea" },
          ]}
          selects={[
            {
              name: "userId",
              label: "Approval Officer",
              placeholder: "Select Approval Officer",
              options: users?.map((user: User) => ({
                value: user.id,
                label: `${user.firstName} ${user.lastName} - Approval Limit ( ${user.approvalLimit || ""} )`,
              })),
            },
          ]}
          title="Request Approval"
          apiEndpoint={`/work-requests/${activeRowId}/quotations/request-quotation-approval`}
          activeRowId={activeRowId}
          setModalState={setCentralState}
          setSuccessState={setSuccessState}
          fetchResource={(id) =>
            axiosInstance
              .get(`/work-requests/${id}`)
              .then((res) => res.data.data)
          }
        />
      </>
    ),
    acceptQuotation: (
      <AcceptQuotation
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),

    viewWorkOrder: (
      <div className="p-4">
        <FacilityDetails facility={workOrder} title="Work Order" />
      </div>
    ),
    viewServiceCharge: (
      <div className="p-4">
        <TableComponent
          data={workOrder?.apportionmentDetails}
          type="apportionmentDetails"
          setModalState={setCentralState}
          setModalStateDelete={setCentralStateDelete}
          toggleActions={toggleActions}
          activeRowId={activeRowId}
          setActiveRowId={setActiveRowId}
          deleteAction={setCentralStateDelete}
          noSearch
        />
        <ButtonComponent
          text={"Approve"}
          onClick={() => approveApportionServiceCharge()}
          className="text-white my-8"
        />
      </div>
    ),
  };

  useEffect(() => {
    if (
      centralState === "viewWorkOrder" ||
      centralState === "viewServiceCharge"
    ) {
      getAWorkOrder();
    }
    if (centralState === "quotationsWorkOrder") {
      getVendors();
      getTechnicians();
    }
    if (centralState === "assignTechnicianWorkOrder") {
      getTechnicians();
    }
  }, [centralState]);

  const tabPermissions: { [key: string]: string[] } = {
    "My Work Order": ["read_work-requests:my-work-orders/all"],
    "All Work Order": ["read_work-requests:work-order/all"],
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
    if (selectedTab === "All Work Order") {
      const fetchData = async () => {
        await Promise.all([getWorkOrders()]);
      };
      fetchData();
    } else {
      getAssignedWorkOrders();
    }
    getUsers();
  }, [centralState, centralStateDelete, selectedTab, pagination.currentPage]);

  return (
    <DashboardLayout
      title="Work Order"
      detail="Submit work order here and view created work orders"
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
          centralStateDelete === "deactivateWorkOrder" ||
          centralStateDelete === "activateWorkOrder"
            ? deleteWorkOrders
            : centralStateDelete === "apportionServiceCharge"
            ? apportionServiceCharge
            : centralStateDelete === "closeWorkOrder"
            ? closeWorkOrder
            : centralStateDelete === "requestquotationsselection"
            ? requestQuotationSelection
            : centralStateDelete === "approveQuotation"
            ? approveWorkOrder
            : centralStateDelete === "acceptWorkOrder"
            ? acceptWorkOrder
            : centralStateDelete === "raisePaymentOrder"
            ? raisePaymentOrder
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

      <PermissionGuard
        requiredPermissions={[
          "read_work-requests:my-work-orders/all",
          "read_work-requests:work-order/all",
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
          "read_work-requests:my-work-orders/all",
          "read_work-requests:work-order/all",
        ]}
      >
        <div className="relative bg-white rounded-2xl p-4 mt-4">
          {selectedTab === "My Work Order" && (
            <TableComponent
              data={assignedworkOrders}
              type="workorders"
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
          {selectedTab === "All Work Order" && (
            <TableComponent
              data={workOrders}
              type="workorders"
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

export default withPermissions(WorkOrders, ["work-orders"]);
