"use client";

import DashboardLayout from "@/components/dashboard-layout-component";
import { useDataPermission } from "@/context";
import axiosInstance from "@/utils/api";
import { useEffect } from "react";

export default function Settings() {
  return (
    <DashboardLayout title="Settings" detail="Manage setting">
      <div className="relative">Settings </div>
    </DashboardLayout>
  );
}
