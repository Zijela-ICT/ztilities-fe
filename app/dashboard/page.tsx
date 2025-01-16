"use client";

import ButtonComponent from "@/components/button-component";
import DashboardLayout from "@/components/dashboard-layout-component";
import DynamicCreateForm from "@/components/dynamic-create-form";
import ModalCompoenent, {
  SuccessModalCompoenent,
} from "@/components/modal-component";
import CreateWorkOrder from "@/components/work-order/create-work-order";
import CreateWorkRequest from "@/components/work-request/create-work-request";
import { useDataPermission } from "@/context";
import axiosInstance from "@/utils/api";
import { BarChartIcon, WorkIcon } from "@/utils/svg";
import { JSX, useEffect, useState } from "react";

export default function Dashboard() {
  const { user, userPermissions, setUser, setUserPermissions } =
    useDataPermission();

  const [centralState, setCentralState] = useState<string>();
  const [successState, setSuccessState] = useState({
    title: "",
    detail: "",
    status: false,
  });

  const getMe = async () => {
    const response = await axiosInstance.get("/auth/me");
    setUser(response.data.data.user);

    const roles = response.data.data?.roles || [];
    const allPermissions = roles
      .map((role: any) => role.permissions || []) // Extract permissions from each role
      .flat(); // Flatten the array of arrays

    // Remove duplicate permissions using a Set
    const uniquePermissions: Permission[] = Array.from(new Set(allPermissions));

    setUserPermissions(uniquePermissions);
  };

  const getWallet = async () => {
    const response = await axiosInstance.get("/wallets/user-wallets");

    console.log(response.data.data);
  };

  // useEffect to fetch getMe initially and every 5 minutes
  useEffect(() => {
    getMe();
    getWallet();
    const interval = setInterval(() => {
      getMe();
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const data = [
    { title: "Create Work Request", number: 1200, rate: "5 days" },
    { title: "Pending Work Request", number: 3200, rate: "7 days" },
    { title: "Created Work Order", number: 1500, rate: "3 days" },
    { title: "Pending Work Order", number: 800, rate: "10 days" },
    { title: "Wallet Balance", number: 4500, rate: "" },
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

  return (
    <DashboardLayout
      title="Dashboard"
      detail="Manage all users and their roles."
    >
      <SuccessModalCompoenent
        title={successState.title}
        detail={successState.detail}
        modalState={successState.status}
        setModalState={(state: boolean) =>
          setSuccessState((prevState) => ({ ...prevState, status: state }))
        }
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
      <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg  flex items-center justify-between"
          >
            {/* Left Content */}
            <div>
              <h3 className="text-lg font-semibold text-gray-500 mb-3">
                {item.title}
              </h3>
              <p className="text-4xl font-bold text-gray-800 mb-5">
                {item.number}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-1">
                  0%
                </span>
                <span className="text-sm text-gray-500">{item.rate}</span>
                {/* Badge */}
              </div>
            </div>
            {/* Right SVG */}
            <BarChartIcon />
          </div>
        ))}
      </div>

      <div className=" w-full rounded-lg bg-white my-8 flex flex-col items-center justify-center px-6 py-10">
        <WorkIcon />
        <h1 className="text-2xl font-semibold text-black">
          No Request/order created yet
        </h1>
        <h1 className="text-lg">
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
            permissions={["create_work-orders"]}
          />
          <ButtonComponent
            text={"Create Work Request"}
            onClick={() => {
              setCentralState("createWorkRequest");
            }}
            className={"flex-1 px-4 py-3 text-white bg-[#A8353A]"}
            permissions={["create_work-requests"]}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
