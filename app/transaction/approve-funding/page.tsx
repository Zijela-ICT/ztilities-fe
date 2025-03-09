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
import createAxiosInstance from "@/utils/api";
import DynamicCreateForm from "@/components/dynamic-create-form";
import exportToCSV from "@/utils/exportCSV";

function Power() {
  const axiosInstance = createAxiosInstance();
  const {
    pagination,
    setPagination,
    searchQuery,
    filterQuery,
    showFilter,
    setShowFilter,
    clearSearchAndPagination,
  } = useDataPermission();
  const tabs = ["Power Apportion"];

  const [successState, setSuccessState] = useState({
    title: "",
    detail: "",
    status: false,
  });

  const [payments, setPayments] = useState<any[]>();
  const [activeRowId, setActiveRowId] = useState<string | null>(null); // Track active row
  const [centralState, setCentralState] = useState<string>();
  const [centralStateDelete, setCentralStateDelete] = useState<string>();

  // Fetch data functions

  const getPaymentsUnPaginated = async () => {
    const response = await axiosInstance.get(
      `/payments/?search=${searchQuery}&&${filterQuery}`
    );
    exportToCSV(response.data.data, "payments");
  };

  const getPayments = async () => {
    const response = await axiosInstance.get(
      `/payments/?page=${pagination.currentPage}&&paginate=true&&search=${searchQuery}&&${filterQuery}`
    );
    setPayments(response.data.data);
    const extra = response.data.extra;
    setPagination({
      currentPage: extra.page,
      pageSize: extra.pageSize,
      total: extra.total,
      totalPages: extra.totalPages,
    });
  };

  const approveFunding = async () => {
    await axiosInstance.patch(`/payments/manual-fund/${activeRowId}/verify`);
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully approved this power charge",
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
      case "rejectFunding":
        return "Reject";
    }
    switch (centralStateDelete) {
      case "approveFunding":
        return "Verify Funding";
    }
    return "Zijela";
  };

  const getDetail = () => {
    switch (centralState) {
      case "rejectFunding":
        return "Give reason for rejection";
    }
    switch (centralStateDelete) {
      case "approveFunding":
        return "Are you sure you want to verify this payment";
    }
    return "Zijela";
  };

  // Mapping centralState values to components
  const componentMap: Record<string, JSX.Element> = {
    rejectFunding: (
      <DynamicCreateForm
        inputs={[
          {
            name: "reasonForRejection",
            label: "Reason for rejection",
            type: "textarea",
          },
        ]}
        selects={[]}
        title="Reject fund"
        apiEndpoint={`/payments/manual-fund/${activeRowId}/reject`}
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        fetchResource={(id) =>
          axiosInstance.get(`/payments/${id}`).then((res) => res.data.data)
        }
      />
    ),
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([getPayments()]);
    };
    fetchData();
  }, [
    centralState,
    centralStateDelete,
    pagination.currentPage,
    searchQuery,
    filterQuery,
  ]);

  useEffect(() => {
    if (showFilter === "export") {
      getPaymentsUnPaginated();
      setShowFilter("");
    }
  }, [showFilter, filterQuery]);

  return (
    <DashboardLayout
      title="Mange Funding"
      detail="Manage and approve all pending fundings"
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
          centralStateDelete === "approveFunding" ? approveFunding : null
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

      <PermissionGuard requiredPermissions={["read_payments"]}>
        <div className="relative bg-white rounded-2xl p-4 mt-4">
          <TableComponent
            data={payments}
            type="approvefunding"
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
        </div>
      </PermissionGuard>
    </DashboardLayout>
  );
}

export default withPermissions(Power, ["payments"]);
