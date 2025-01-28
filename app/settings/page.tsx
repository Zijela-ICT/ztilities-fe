"use client";

import DashboardLayout from "@/components/dashboard-layout-component";
import { useDataPermission } from "@/context";
import createAxiosInstance from "@/utils/api";
import axiosInstance from "@/utils/api";
import { useEffect } from "react";

export default function Settings() {
  const axiosInstance = createAxiosInstance();
  return (
    <DashboardLayout title="Settings" detail="Manage setting">
      <div className="relative">Settings </div>
    </DashboardLayout>
  );
}
