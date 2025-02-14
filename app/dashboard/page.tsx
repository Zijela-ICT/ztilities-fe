"use client";

import ButtonComponent from "@/components/button-component";
import DashboardLayout from "@/components/dashboard-layout-component";
import ModalCompoenent, {
  SuccessModalCompoenent,
} from "@/components/modal-component";
import CreateWorkOrder from "@/components/work-order/create-work-order";
import CreateWorkRequest from "@/components/work-request/create-work-request";
import { useDataPermission } from "@/context";
import { BarChartIcon, WorkIcon } from "@/utils/svg";
import { JSX, useEffect, useState } from "react";
import WorkOrders from "../work-orders/page";
import { useRouter } from "next/navigation";
import createAxiosInstance from "@/utils/api";
import MyLoader from "@/components/loader-components";
import formatCurrency from "@/utils/formatCurrency";

function Dashboard() {
  const axiosInstance = createAxiosInstance();
  const router = useRouter();
  const {
    user,
    setUser,
    userPermissions,
    userRoles,
    setUserPermissions,
    setUserRoles,
  } = useDataPermission();

  const [selectedWallet, setSelectedWallet] = useState<any>();
  useEffect(() => {
    setSelectedWallet(user?.wallets[0]?.id);
  }, [user?.wallets]);

  const handleWalletChange = (event) => {
    setSelectedWallet(parseInt(event.target.value));
  };

  const hasNoTenantRole = userRoles.some(
    (role: Role) => role.name !== "TENANT_ROLE"
  );

  const [myworkRequests, setMyWorkRequests] = useState<any[]>();
  const [myworkOrders, setMyWorkOrders] = useState<any[]>();
  const [workRequests, setWorkRequests] = useState<any>();
  const [workOrders, setWorkOrders] = useState<any[]>();
  const [centralState, setCentralState] = useState<string>();
  const [tempcentralState, setTmpCentralState] = useState<string>();
  const [successState, setSuccessState] = useState({
    title: "",
    detail: "",
    status: false,
  });

  const getMe = async () => {
    const response = await axiosInstance.get("/auth/me");
    setUser(response.data.data.user);
    const roles = response.data.data?.roles || [];
    setUserRoles(roles);
    const allPermissions = roles
      .map((role: any) => role.permissions || []) // Extract permissions from each role
      .flat(); // Flatten the array of arrays
    // Remove duplicate permissions using a Set
    const uniquePermissions: Permission[] = Array.from(new Set(allPermissions));
    setUserPermissions(uniquePermissions);
  };

  const getWallet = async () => {
    const response = await axiosInstance.get("/wallets/user-wallets");
  };

  const getWorkRequestsDashboard = async () => {
    const response = await axiosInstance.get("/work-requests/dashboard/all");
    setWorkRequests(response.data.data);
  };



  // useEffect to fetch getMe initially and every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      getMe();
      getWallet();
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const loading = !(user && userPermissions);
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        getMe(),
        getWallet(),
        getWorkRequestsDashboard(),
      ]);
    };
    fetchData();
  }, []);


  const data = [
    {
      title: "Initiated Work Requests",
      number: workRequests?.initiatedWorkRequest,
      rate: "",
      path: "/dashboard",
    },
    {
      title: "Pending Work Requests",
      number: workRequests?.pendingWorkRequest,
      rate: "",
      path: "/dashboard",
    },
    {
      title: "OverDue Work Requests",
      number: workRequests?.overdueWorkRequest,
      rate: "",
      path: "/dashboard",
    },
    {
      title: "Pending Work Orders",
      number: workRequests?.pendingWorkOrder,
      rate: "",
      path: "/dashboard",
    },
    {
      title: "Overdue Work Requests",
      number: workRequests?.overdueWorkOrder,
      rate: "",
      path: "/dashboard",
    },
    {
      title: "PurchaseOrdersRaised",
      number: workRequests?.overDueWorkRequest,
      rate: "",
      path: "/dashboard",
    },
    { title: "Wallet Balance", number: 0, rate: "", path: null },
  ];

  // Mapping centralState values to components
  const componentMap: Record<string, JSX.Element> = {
    createWorkOrder: (
      <CreateWorkOrder
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    createWorkRequest: (
      <CreateWorkRequest
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
  };

  // Dynamic title and detail logic
  const getTitle = () => {
    switch (centralState) {
      case "createWorkOrder":
        return "Create Work Order";
      case "createWorkRequest":
        return "Create Work Request";
    }
    return "Zijela";
  };

  const getDetail = () => {
    switch (centralState) {
      case "createWorkOrder":
        return "You can create and manage work order here.";
      case "createWorkRequest":
        return "You can create and manage work request here.";
    }
    return "Zijela";
  };
  const [showBalance, setShowBalance] = useState(true);
  return (
    <>
      {!loading ? (
        <>
          <DashboardLayout
            title="Dashboard"
            detail="Manage all users and their roles."
          >
            <SuccessModalCompoenent
              title={successState.title}
              detail={successState.detail}
              modalState={successState.status}
              setModalState={(state: boolean) => {
                if (tempcentralState === "createWorkRequest") {
                  router.push("/work-requests");
                } else {
                  setSuccessState((prevState) => ({
                    ...prevState,
                    status: state,
                  }));
                }
              }}
            ></SuccessModalCompoenent>
            <ModalCompoenent
              title={getTitle()}
              detail={getDetail()}
              modalState={centralState}
              setModalState={() => {
                setCentralState("");
              }}
            >
              {componentMap[centralState]}
            </ModalCompoenent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {data.map((item, index) =>
                (item.title === "Wallet Balance" &&
                  user?.wallets?.length > 0) ||
                item.title !== "Wallet Balance" ? (
                  <div
                    key={index}
                    onClick={() => item?.path && router.push(item?.path)}
                    className={`${
                      item.title === "Wallet Balance"
                        ? "bg-[#FBC2B6]"
                        : "bg-white"
                    } py-3 px-4 rounded-lg flex items-center justify-between cursor-pointer`}
                  >
                    {/* Left Content */}
                    <div className="relative">
                      {item.title !== "Wallet Balance" && (
                        <h3 className="text-sm font-semibold text-gray-500 mb-1">
                          {item.title}
                        </h3>
                      )}

                      {item.title === "Wallet Balance" &&
                      user?.wallets?.length > 0 ? (
                        <div>
                          {/* Dropdown for Wallet Balance */}
                          <select
                            value={selectedWallet}
                            onChange={handleWalletChange}
                            className="text-sm font-semibold text-gray-500 mb-1"
                          >
                            {user.wallets.map((wallet) => (
                              <option key={wallet.id} value={wallet.id}>
                                {wallet.walletType}
                              </option>
                            ))}
                          </select>
                          <p className="text-xl font-bold text-[#A8353A] mb-3">
                            {showBalance ? (
                              <>
                                ₦
                                {formatCurrency(
                                  user.wallets.find(
                                    (wallet) => wallet.id === selectedWallet
                                  )?.balance || 0
                                )}
                              </>
                            ) : (
                              "****"
                            )}
                          </p>
                          <div className="flex items-center gap-2 h-6"></div>
                        </div>
                      ) : item.title !== "Wallet Balance" ? (
                        <div>
                          <p className="text-3xl font-bold text-gray-800 mb-3">
                            {item.number}
                          </p>
                          <div className="flex items-center gap-2">
                            {/* <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-1">
                              0%
                            </span> */}
                            <span className="text-xs text-gray-500">
                              {item.rate}
                            </span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                    {item.title === "Wallet Balance" ? (
                      <svg
                        onClick={() => setShowBalance(!showBalance)}
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white cursor-pointer"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    ) : (
                      <BarChartIcon />
                    )}
                    {/* Right Icon */}
                  </div>
                ) : null
              )}
            </div>

            {workOrders?.length < 1 ? (
              <div className=" w-full rounded-lg bg-white my-8 flex flex-col items-center justify-center px-6 py-10">
                <WorkIcon />
                <h1 className="text-2xl font-semibold text-black">
                  No Request/order created yet
                </h1>
                <h1 className="text-base">
                  Your active reuests and order will appear here
                </h1>
                <div className="flex space-x-4 my-4 w-2/4">
                  <ButtonComponent
                    text={"Create Work Order"}
                    onClick={() => {
                      setCentralState("createWorkOrder");
                    }}
                    className={
                      "flex-1 px-4 py-3 text-[#A8353A] bg-white border border-[#A8353A]"
                    }
                    permissions={["create_work-orders:/work-order"]}
                  />
                  <ButtonComponent
                    text={"Create Work Request"}
                    onClick={() => {
                      setCentralState("createWorkRequest");
                      setTmpCentralState("createWorkRequest");
                    }}
                    className={"flex-1 px-4 py-3 text-white bg-[#A8353A]"}
                    permissions={["create_work-requests"]}
                  />
                </div>
              </div>
            ) : (
              <>
                <WorkOrders nowrap={true} />
              </>
            )}
          </DashboardLayout>
        </>
      ) : (
        <MyLoader />
      )}
    </>
  );
}

export default Dashboard;
