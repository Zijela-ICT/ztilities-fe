"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout-component";
import withPermissions from "@/components/auth/permission-protected-routes";

import { useDataPermission } from "@/context";

import { useParams, useRouter } from "next/navigation";
import createAxiosInstance from "@/utils/api";
import FacilityDetails from "@/components/facility-management/view-facility";

function Ppm() {
  const axiosInstance = createAxiosInstance();
  const { user, setUser, setUserPermissions } = useDataPermission();
  const router = useRouter();
  const { id } = useParams();

  const [workRequest, setWorkRequest] = useState<any>();

  const getAWorkRequest = async () => {
    const response = await axiosInstance.get(`/ppms/${id}`);
    setWorkRequest(response.data.data);
  };

  useEffect(() => {
    if (id) {
      getAWorkRequest();
    }
  }, [id]);

  return (
    <DashboardLayout
      title={`PPM ${workRequest?.title}`}
      detail="PPM Details"
      dynamic
      onclick={() => router.back()}
    >
      <div className="relative bg-white rounded-2xl p-8 ">
        <FacilityDetails facility={workRequest} title="Work Order" />
      </div>
    </DashboardLayout>
  );
}

export default withPermissions(Ppm, ["ppms"]);
