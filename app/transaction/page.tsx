"use client";

import DashboardLayout from "@/components/dashboard-layout-component";
import {
  ArrowLeft,
  IncomingIcon,
  OutgoingIcon,
  RefreshIcon,
  TransactionIcon,
} from "@/utils/svg";
import { JSX, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Link from "next/link";
import withPermissions from "@/components/auth/permission-protected-routes";
import createAxiosInstance from "@/utils/api";
import { chartOptions } from "@/utils/ojects";
import { useDataPermission } from "@/context";
import PermissionGuard from "@/components/auth/permission-protected-components";
import { MyLoaderFinite } from "@/components/loader-components";
import FundWallet from "@/components/facility-management/fund-wallet";
import ModalCompoenent from "@/components/modal-component";
import formatCurrency from "@/utils/formatCurrency";

// Register required components in Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Transactions() {
  const axiosInstance = createAxiosInstance();
  const { user } = useDataPermission();
  const [filters, setFilters] = useState({
    User: "",
    Facility: "",
    Vendor: "",
    Technician: "",
  });

  const [loading, setLoading] = useState<boolean>();
  const [transactionId, setTransactionId] = useState<any>();
  const [entity, setEntity] = useState<any>();

  const [vendors, setVendors] = useState<Vendor[]>();
  const [technicians, setTechnicians] = useState<Technician[]>();
  const [facilities, setFacilities] = useState<Facility[]>();
  const [users, setUsers] = useState<User[]>();

  const [filteredTransactions, setFilteredTransactions] =
    useState<Transaction[]>();

  const filterOptions = [
    {
      label: "User",
      options: users,
    },
    { label: "Facility", options: facilities },
    // { label: "Unit", options: [] },
    { label: "Vendor", options: vendors },
    {
      label: "Technician",
      options: technicians,
    },
  ];

  const handleFilterChange = (label, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [label]: value,
    }));
  };

  const handleApplyFilters = () => {
    console.log("Filters Applied:", filters);
  };

  const getUsers = async () => {
    const response = await axiosInstance.get("/users");
    setUsers(response.data.data);
  };
  const getVendors = async () => {
    const response = await axiosInstance.get("/users/vendor-users/all");
    setVendors(response.data.data);
  };
  const getTechnicians = async () => {
    const response = await axiosInstance.get("/users/technician-users/all");
    setTechnicians(response.data.data);
  };
  const getFacilities = async () => {
    const response = await axiosInstance.get("/facilities");
    setFacilities(response.data.data);
  };

  const getMyTransactions = async () => {
    const response = await axiosInstance.get(
      `/transactions/my-transactions/all`
    );
    setFilteredTransactions(response.data.data);
  };

  const getAUserTransactions = async () => {
    const response = await axiosInstance.get(
      `/transactions/user-transactions/all/${filters.User}`
    );
    setFilteredTransactions(response.data.data);
  };
  const getAVendorTransactions = async () => {
    const response = await axiosInstance.get(
      `/transactions/user-transactions/all/${filters.Vendor}`
    );
    setFilteredTransactions(response.data.data);
  };
  const getATechnicianTransactions = async () => {
    const response = await axiosInstance.get(
      `/transactions/user-transactions/all/${filters.Technician}`
    );
    setFilteredTransactions(response.data.data);
  };
  const getAFacilityTransactions = async () => {
    const response = await axiosInstance.get(
      `/transactions/facility-transactions/all/${filters.Facility}`
    );
    setFilteredTransactions(response.data.data);
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        getUsers(),
        getFacilities(),
        getTechnicians(),
        getVendors(),
      ]);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      await getMyTransactions();
      setTimeout(() => setLoading(false), 1500);
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    const fetchFilteredTransactions = async () => {
      setLoading(true);

      if (filters.User) {
        await getAUserTransactions();
      } else if (filters.Vendor) {
        await getAVendorTransactions();
      } else if (filters.Technician) {
        await getATechnicianTransactions();
      } else if (filters.Facility) {
        await getAFacilityTransactions();
      }

      setTimeout(() => setLoading(false), 1500);
    };

    fetchFilteredTransactions();
  }, [filters]);

  useEffect(() => {
    if (
      filters.User ||
      filters.Vendor ||
      filters.Technician ||
      filters.Facility
    ) {
      setFilters({
        User: "",
        Facility: "",
        Vendor: "",
        Technician: "",
      });
    }
  }, [filters]);

  const monthlyData = {
    INFLOW: Array(12).fill(0), // For January to December
    OUTFLOW: Array(12).fill(0), // For January to December
  };
  const formattedTransactions = filteredTransactions?.map((transaction) => ({
    ...transaction,
    amount: Number(transaction.amount), // Convert amount from string to number
  }));
  // Iterate over each transaction
  formattedTransactions?.forEach((transaction) => {
    const date = new Date(transaction.createdAt);
    const month = date.getMonth(); // Month is 0-based (January = 0, December = 11)
    // Add the amount to the respective category for that month
    if (transaction.category === "INFLOW") {
      monthlyData.INFLOW[month] += transaction.amount;
    } else if (transaction.category === "OUTFLOW") {
      monthlyData.OUTFLOW[month] += transaction.amount;
    }
  });

  // Prepare the final chart data
  const chartData = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Inflow",
        data: monthlyData.INFLOW, // Cumulative inflow values per month
        fill: true,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.4,
        pointRadius: 0,
        pointBackgroundColor: "rgb(75, 192, 192)",
      },
      {
        label: "Outflow",
        data: monthlyData.OUTFLOW, // Cumulative outflow values per month
        fill: true,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.4,
        pointRadius: 0,
        pointBackgroundColor: "rgb(255, 99, 132)",
      },
    ],
  };

  const [centralState, setCentralState] = useState<string>();
  const [selectedWalletIndex, setSelectedWalletIndex] = useState(0);
  const [showBalance, setShowBalance] = useState(true);
  // Component mapping
  const componentMap: Record<string, JSX.Element> = {
    fundWallet: (
      <FundWallet
        activeRowId={user.wallets[selectedWalletIndex]?.id}
        setModalState={setCentralState}
        type={"User"}
      />
    ),
  };

  return (
    <DashboardLayout
      title="Transactions"
      detail="See balance and all transactions here"
    >
      <ModalCompoenent
        title={"Fund Wallet"}
        detail={""}
        modalState={centralState}
        setModalState={() => {
          setCentralState("");
        }}
      >
        {componentMap[centralState]}
      </ModalCompoenent>
      {loading && (
        <div className="flex items-center justify-center space-x-4">
          <div>
            <MyLoaderFinite />
          </div>
          <div>Hold on, getting transactions</div>
        </div>
      )}

      <>
        <PermissionGuard
          requiredPermissions={[
            "read_transactions:users-transactions/all",
            "read_transactions:my-transactions/all",
            "read_transactions:facilities-transactions/all",
          ]}
        >
          <div className="relative bg-white rounded-2xl p-4 mb-4">
            <div className="overflow-x-auto whitespace-nowrap pb-2">
              <div className="flex md:justify-end items-center space-x-4 ">
                {user.wallets.length > 1 && (
                  <PermissionGuard
                    requiredPermissions={[
                      "read_transactions:my-transactions/all",
                    ]}
                  >
                    <div
                      onClick={() => getMyTransactions()}
                      className="text-black flex items-center space-x-1 cursor-pointer"
                    >
                      <p>Refresh my transactions : </p>
                      <RefreshIcon stroke="black" />
                    </div>
                  </PermissionGuard>
                )}
                {filterOptions.map((filter, index) => {
                  const permissionMap: Record<string, string[]> = {
                    User: ["read_transactions:users-transactions/all"],
                    Facility: ["read_transactions:facilities-transactions/all"],
                    Vendor: ["read_transactions:users-transactions/all"],
                    Technician: ["read_transactions:users-transactions/all"],
                  };

                  const requiredPermissions = permissionMap[filter.label] || [];

                  return (
                    <PermissionGuard
                      key={index}
                      requiredPermissions={requiredPermissions}
                    >
                      <select
                        className="border border-gray-300 rounded-md p-2"
                        value={filters[filter.label]?.id}
                        onChange={(e) => {
                          handleFilterChange(filter.label, e.target.value);
                          setTransactionId(e.target.value);
                          setEntity(filter.label);
                        }}
                      >
                        <option value="">{`Filter by ${filter.label}`}</option>
                        {filter?.options?.map((option, idx) => (
                          <option key={idx} value={option.id}>
                            {option.firstName + option.lastName || option.name}
                          </option>
                        ))}
                      </select>
                    </PermissionGuard>
                  );
                })}
              </div>
            </div>
          </div>
        </PermissionGuard>

        {user.wallets.length > 1 && (
          <div
            className="relative bg-cover bg-center bg-no-repeat rounded-2xl px-4 py-4 "
            style={{
              backgroundImage: "url('/assets/wallet-bg.jpeg')",
            }}
          >
            {user.wallets.length > 1 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {user.wallets.map((wallet, index) => (
                  <button
                    key={wallet.id || index}
                    onClick={() => setSelectedWalletIndex(index)}
                    className={`px-3 py-1 rounded ${
                      selectedWalletIndex === index
                        ? "bg-[#A8353A] text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    {wallet.walletType}
                    {/* Optionally show a short hash if available */}
                    {wallet.hash && (
                      <span className="ml-2 text-xs text-gray-600">
                        {wallet.hash.slice(0, 6)}...
                      </span>
                    )}
                  </button>
                ))}

                <button
                  onClick={() => setCentralState("fundWallet")}
                  className="px-3 py-1 rounded bg-white text-black"
                >
                  Fund Wallet
                </button>
              </div>
            )}
            <div className="flex justify-between items-center pb-2">
              <span className="text-gray-200 ">Account Balance</span>
              <div className="text-white py-2 flex items-center space-x-1">
                <RefreshIcon /> <p>Refresh </p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white font-bold text-2xl">
                {showBalance ? (
                  <>
                    ₦{" "}
                    {formatCurrency(user.wallets[selectedWalletIndex]?.balance)}
                  </>
                ) : (
                  "****"
                )}
              </span>
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
            </div>
          </div>
        )}

        {filteredTransactions?.length < 1 ? (
          <>
            <div className="flex flex-col items-center justify-center h-64 bg-white mt-4">
              <TransactionIcon width="71" height="71" />

              <p className="mt-4 text-gray-600 text-lg font-medium">
                No Transactions Found
              </p>
              <p className="text-sm text-gray-500">
                You haven't made any transactions yet.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col md:flex-row w-full h-auto space-y-4 md:space-y-0 md:space-x-4 mt-4">
              {/* Left Section (Graph) */}
              <div className="w-full md:w-3/5 bg-white rounded-lg  p-6">
                <h2 className="text-base font-semibold mb-4 text-black">
                  Transaction Trend
                </h2>
                <div className="h-full ">
                  {/* Placeholder for the Graph */}

                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>

              {/* Right Section (Simple List) */}
              <div className="w-full md:w-2/5 bg-white p-4 rounded-lg">
                <div className="flex items-baseline text-base justify-between mb-6">
                  <h2 className="font-semibold text-black">
                    Recent Transactions
                  </h2>
                  <h2 className="font-medium text-[#A8353A] flex items-center space-x-1 cursor-pointer">
                    <Link
                      href={`/transactions/${transactionId || "*"}/${
                        entity || "*"
                      }`}
                    >
                      See all
                    </Link>
                    <div className="rotate-180">
                      <ArrowLeft />
                    </div>
                  </h2>
                </div>
                <ul>
                  {filteredTransactions?.map((log, index) => (
                    <li
                      key={log.id}
                      className="flex justify-between items-start mb-4 border-b text-sm border-gray-100 last:border-b-0 pb-4"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          {log.category === "INFLOW" ? (
                            <IncomingIcon />
                          ) : (
                            <OutgoingIcon />
                          )}
                        </div>
                        <div className="ml-4 flex flex-col">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-700">
                              {log.description}
                            </span>
                          </div>
                          <p className="text-gray-700 mt-1 font-thin ">
                            {log.createdAt}
                          </p>
                        </div>
                      </div>
                      {/* Price or additional information */}
                      <span className="text-gray-600 font-medium">
                        ₦ {formatCurrency(log.amount)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </>
    </DashboardLayout>
  );
}

export default withPermissions(Transactions, ["transactions", "wallets"]);
