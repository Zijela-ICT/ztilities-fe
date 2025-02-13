"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout-component";
import withPermissions from "@/components/auth/permission-protected-routes";

import { useDataPermission } from "@/context";

import { useParams, useRouter } from "next/navigation";
import createAxiosInstance from "@/utils/api";
import FacilityDetails from "@/components/facility-management/view-facility";

function WorkRequests() {
  const axiosInstance = createAxiosInstance();
  const { user, setUser, setUserPermissions } = useDataPermission();
  const router = useRouter();
  const { id } = useParams();

  const [workRequest, setWorkRequest] = useState<any>();

  const getAWorkRequest = async () => {
    const response = await axiosInstance.get(`/work-orders/${id}`);
    setWorkRequest(response.data.data);
  };

  useEffect(() => {
    if (id) {
      getAWorkRequest();
    }
  }, [id]);

  return (
    <DashboardLayout
      title={`Work Order ${workRequest?.workOrderNumber}`}
      detail="Work Order Details"
      dynamic
      onclick={() => router.back()}
    >
      <div className="relative bg-white rounded-2xl p-8 ">
        <FacilityDetails facility={workRequest} title="Work Order" />
      </div>
    </DashboardLayout>
  );
}

export default withPermissions(WorkRequests, ["work-orders"]);
