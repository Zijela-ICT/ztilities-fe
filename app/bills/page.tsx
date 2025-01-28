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
import createAxiosInstance from "@/utils/api";

function VendorManagement() {
  const axiosInstance = createAxiosInstance();
  const { user, setUser, setUserPermissions } = useDataPermission();

  const tabs = ["My Bills", "All Bills"];

  const [successState, setSuccessState] = useState({
    title: "",
    detail: "",
    status: false,
  });

  const [bills, setBills] = useState<any[]>([]);
  const [bill, setABill] = useState<any>();
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [extraRowId, setExtraROwId] = useState<string | null>(null);
  const [centralState, setCentralState] = useState<string>();
  const [centralStateDelete, setCentralStateDelete] = useState<string>();

  const getBills = async () => {
    const response = await axiosInstance.get("/bills");
    setBills(response.data.data);
  };

  const getABill = async () => {
    const response = await axiosInstance.get(`/bills/${activeRowId}`);
    setABill(response.data.data);
  };

  const payBills = async () => {
    await axiosInstance.patch(`/bills/${activeRowId}/pay`);
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have paid for this bill",
      status: true,
    });
  };
  // Toggle actions
  const toggleActions = (rowId: string) => {
    setActiveRowId((prevId) => (prevId === rowId ? null : rowId));
  };
  const extraActions = (id: string) => {
    setExtraROwId((prevId) => (prevId === id ? null : id));
  };

  // Dynamic title and detail logic
  const getTitle = () => {
    switch (centralState) {
      case "viewBills":
        return "Bills Details";
    }
    switch (centralStateDelete) {
      case "payBills":
        return "Pay bills";
    }
    return "Zijela";
  };

  const getDetail = () => {
    switch (centralState) {
      case "viewBills":
        return "";
    }
    switch (centralStateDelete) {
      case "payBills":
        return "Are you sure you want to pay for this bill";
    }
    return "Zijela";
  };

  // Mapping centralState values to components
  const componentMap: Record<string, JSX.Element> = {
    viewBills: (
      <div className="p-4">
        <FacilityDetails facility={(bill && bill[0]) || bill} title="Bills" />
      </div>
    ),
  };

  useEffect(() => {
    if (centralState === "viewBills") {
      getABill();
    }
  }, [centralState]);

  const tabPermissions: { [key: string]: string[] } = {
    "My Bills": ["read_bills"],
    "All Bills": ["read_bills"],
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
    if (selectedTab === "All Bills") {
      getBills();
    } else {
      const fetchData = async () => {
        await Promise.all([getBills()]);
      };
      fetchData();
    }
  }, [centralState, centralStateDelete, selectedTab]);

  return (
    <DashboardLayout title="Bills" detail="Manage all bills here">
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
        takeAction={centralStateDelete === "payBills" ? payBills : undefined}
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

      <PermissionGuard requiredPermissions={["read_bills"]}>
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

      <PermissionGuard requiredPermissions={["read_bills"]}>
        <div className="relative bg-white rounded-2xl p-4 mt-4">
          {selectedTab === "My Bills" && (
            <TableComponent
              data={bills}
              type="bills"
              setModalState={setCentralState}
              setModalStateDelete={setCentralStateDelete}
              toggleActions={toggleActions}
              extraActions={extraActions}
              activeRowId={activeRowId}
              setActiveRowId={setActiveRowId}
              deleteAction={setCentralStateDelete}
            />
          )}
          {selectedTab === "All Bills" && (
            <TableComponent
              data={bills}
              type="bills"
              setModalState={setCentralState}
              setModalStateDelete={setCentralStateDelete}
              toggleActions={toggleActions}
              extraActions={extraActions}
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

export default withPermissions(VendorManagement, ["bills"]);
