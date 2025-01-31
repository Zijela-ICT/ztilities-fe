"use client";

import DashboardLayout from "@/components/dashboard-layout-component";
import {
  ArrowLeft,
  IncomingIcon,
  OutgoingIcon,
  RefreshIcon,
  TransactionIcon,
} from "@/utils/svg";
import { useEffect, useState } from "react";
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
import TableComponent from "@/components/table-component";
import PermissionGuard from "@/components/auth/permission-protected-components";
import { useParams } from "next/navigation";
import { MyLoaderFinite } from "@/components/loader-components";

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
  const { id, entity } = useParams();
  const [filters, setFilters] = useState({
    User: "",
    Facility: "",
    Vendor: "",
    Technician: "",
  });

  const [loading, setLoading] = useState<boolean>()
  const [vendors, setVendors] = useState<Vendor[]>();
  const [technicians, setTechnicians] = useState<Technician[]>();
  const [facilities, setFacilities] = useState<Facility[]>();
  const [users, setUsers] = useState<User[]>();

  //for table
  const [activeRowId, setActiveRowId] = useState<string | null>(null); // Track active row
  const [centralState, setCentralState] = useState<string>();
  const [centralStateDelete, setCentralStateDelete] = useState<string>();

  const [filteredTransactions, setFilteredTransactions] =
    useState<Transaction[]>();

  const myFormattedTransactions = filteredTransactions?.map(
    ({ category, ...rest }) => ({ category, ...rest })
  );

  const filterOptions = [
    {
      label: "User",
      options: users,
    },
    { label: "Facility", options: facilities },
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
      `/transactions/user-transactions/all/${filters.User || id}`
    );
    setFilteredTransactions(response.data.data);
  };
  const getAVendorTransactions = async () => {
    const response = await axiosInstance.get(
      `/transactions/user-transactions/all/${filters.Vendor || id}`
    );
    setFilteredTransactions(response.data.data);
  };
  const getATechnicianTransactions = async () => {
    const response = await axiosInstance.get(
      `/transactions/user-transactions/all/${filters.Technician || id}`
    );
    setFilteredTransactions(response.data.data);
  };
  const getAFacilityTransactions = async () => {
    const response = await axiosInstance.get(
      `/transactions/facility-transactions/all/${filters.Facility || id}`
    );
    setFilteredTransactions(response.data.data);
  };

  // Toggle actions
  const toggleActions = (rowId: string) => {
    setActiveRowId((prevId) => (prevId === rowId ? null : rowId));
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
      if (user.wallets.length > 0) {
        await getMyTransactions();
      } else {
        if (id && entity) {
          if (entity === "User") {
            await getAUserTransactions();
          } else if (entity === "Vendor") {
            await getAVendorTransactions();
          } else if (entity === "Technician") {
            await getATechnicianTransactions();
          } else if (entity === "Facility") {
            await getAFacilityTransactions();
          }
        }
      }
      
      setTimeout(() => setLoading(false), 1000);
    };
  
    setLoading(true);
    fetchTransactions();
  }, [id, entity, user.wallets]);
  
  useEffect(() => {
    const fetchFilteredTransactions = async () => {
      if (filters.User) {
        await getAUserTransactions();
      } else if (filters.Vendor) {
        await getAVendorTransactions();
      } else if (filters.Technician) {
        await getATechnicianTransactions();
      } else if (filters.Facility) {
        await getAFacilityTransactions();
      }
  
      setTimeout(() => setLoading(false), 1000);
    };
  
    setLoading(true);
    fetchFilteredTransactions();
  }, [filters]);
  

 
  // useEffect(() => {
  //   if (user.wallets.length > 0) {
  //     getMyTransactions();
  //   } else {
  //     if (id && entity) {
  //       if (entity === "User") {
  //         getAUserTransactions();
  //       } else if (entity === "Vendor") {
  //         getAVendorTransactions();
  //       } else if (entity === "Technician") {
  //         getATechnicianTransactions();
  //       } else if (entity === "Facility") {
  //         getAFacilityTransactions();
  //       }
  //     }
  //   }
  // }, [id, entity, user.wallets]);

  // useEffect(() => {
  //   if (filters.User) {
  //     getAUserTransactions();
  //   } else if (filters.Vendor) {
  //     getAVendorTransactions();
  //   } else if (filters.Technician) {
  //     getATechnicianTransactions();
  //   } else if (filters.Facility) {
  //     getAFacilityTransactions();
  //   }
  // }, [filters]);

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

  return (
    <DashboardLayout
      title="Transactions"
      detail="See balance and all transactions here"
    >
         {loading &&  <MyLoaderFinite/>}
      <>
        <PermissionGuard
          requiredPermissions={[
            "read_transactions:users-transactions/all",
            "read_transactions:my-transactions/all",
            "read_transactions:facilities-transactions/all",
          ]}
        >
          <div className="relative bg-white rounded-2xl p-4 mb-4">
            <div className="flex justify-end items-center space-x-4 pb-2">
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
                    <p>Refresh my transactions : </p>{" "}
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
                      onChange={(e) =>
                        handleFilterChange(filter.label, e.target.value)
                      }
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
        </PermissionGuard>

        <div className="relative bg-white rounded-2xl p-4 mt-4">
          <TableComponent
            data={myFormattedTransactions}
            type="transactions"
            setModalState={setCentralState}
            setModalStateDelete={setCentralStateDelete}
            toggleActions={toggleActions}
            activeRowId={activeRowId}
            setActiveRowId={setActiveRowId}
            deleteAction={setCentralStateDelete}
          />
        </div>
      </>
    </DashboardLayout>
  );
}

export default withPermissions(Transactions, ["transactions", "wallets"]);
