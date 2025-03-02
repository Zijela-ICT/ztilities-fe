"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout-component";
import withPermissions from "@/components/auth/permission-protected-routes";

import { useDataPermission } from "@/context";

import { useParams, useRouter } from "next/navigation";
import createAxiosInstance from "@/utils/api";
import FacilityDetails from "@/components/facility-management/view-facility";

function Funding() {
  const axiosInstance = createAxiosInstance();
  const { user, setUser, setUserPermissions } = useDataPermission();
  const router = useRouter();
  const { id } = useParams();

  const [transaction, setTransaction] = useState<any>();

  const getATransaction = async () => {
    const response = await axiosInstance.get(`/transactions/${id}`);
    setTransaction(response.data.data);
  };

  useEffect(() => {
    if (id) {
      getATransaction();
    }
  }, [id]);

  return (
    <DashboardLayout
      title={`Pending Funds`}
      detail="Pending Funds Details"
      dynamic
      onclick={() => router.back()}
    >
      <div className="relative bg-white rounded-2xl p-8 ">
        <FacilityDetails facility={{}} title="Transactions" />
      </div>
    </DashboardLayout>
  );
}

export default withPermissions(Funding, ["users"]);
