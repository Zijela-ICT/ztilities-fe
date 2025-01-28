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
import CreateWorkOrder from "@/components/work-order/create-work-order";

import UpdateWorkOrder from "@/components/work-order/update-work-order";
import AcceptQuotation from "@/components/work-order/acceptQuotation";
import ApportionPower from "@/components/work-order/apportionPower";
import createAxiosInstance from "@/utils/api";

function WorkOrders() {
  const axiosInstance = createAxiosInstance();
  const { user, setUser, setUserPermissions } = useDataPermission();

  const tabs = ["All Work Order"];

  const [successState, setSuccessState] = useState({
    title: "",
    detail: "",
    status: false,
  });

  const [workOrders, setWorkOrders] = useState<any[]>();
  const [workOrder, setWorkOrder] = useState<any>();
  const [activeRowId, setActiveRowId] = useState<string | null>(null); // Track active row
  const [centralState, setCentralState] = useState<string>();
  const [centralStateDelete, setCentralStateDelete] = useState<string>();
  const [vendors, setVendors] = useState<Vendor[]>();
  const [technician, setTechnicians] = useState<Technician[]>();

  // Fetch data functions
  const getWorkOrders = async () => {
    const response = await axiosInstance.get("/work-requests/work-order/all");
    setWorkOrders(response.data.data);
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
    const response = await axiosInstance.get(`/work-orders/${activeRowId}`);
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
    await axiosInstance.delete(`/work-orders/${activeRowId}/status/close`);
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully closed work order",
      status: true,
    });
  };

  const apportionServiceCharge = async () => {
    await axiosInstance.patch(
      `/work-orders/${activeRowId}/apportion/service-charge`
    );
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully apportion service charge",
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
      case "closeWorkOrder":
        return "Close Work Order ";
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
      case "closeWorkOrder":
        return "You want to close this work order ";
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
        apiEndpoint={`/work-orders/${activeRowId}/comments`}
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
        apiEndpoint={`/work-orders/${activeRowId}/upload-attachment`}
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
          { name: "startDate", label: "Start Date", type: "date" },
          { name: "endDate", label: "End Date", type: "date" },
        ]}
        title="Add Quotation"
        apiEndpoint={`/work-orders/${activeRowId}/upload-quotation`}
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
  };

  useEffect(() => {
    if (centralState === "viewWorkOrder") {
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
    "All Work Order": ["create_work-orders"],
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
      await Promise.all([getWorkOrders()]);
    };
    fetchData();
  }, [centralState, centralStateDelete, selectedTab]);

  return (
    <DashboardLayout
      title="Transactions"
      detail="See balance and all transactions here"
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

      <PermissionGuard requiredPermissions={["create_work-orders"]}>
        <div className="relative bg-white rounded-2xl p-4 mt-4">
          <TableComponent
            data={[]}
            type="transactions"
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
