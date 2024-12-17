"use client";

import DashboardLayout from "@/components/dashboard-layout-component";
import { useDataPermission } from "@/context";
import axiosInstance from "@/utils/api";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, userPermissions, setUser, setUserPermissions } = useDataPermission();

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

  // useEffect to fetch getMe initially and every 5 minutes
  useEffect(() => {
    getMe();
    const interval = setInterval(() => {
      getMe();
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  console.log(userPermissions, "rrrrr");
  return (
    <DashboardLayout
      title="Dashboard"
      detail="Manage all users and their roles."
    >
      <div className="relative">Dashboard </div>
    </DashboardLayout>
  );
}
