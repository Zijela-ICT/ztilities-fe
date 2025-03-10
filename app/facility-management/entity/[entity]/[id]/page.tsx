"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout-component";
import withPermissions from "@/components/auth/permission-protected-routes";
import { useParams, useRouter } from "next/navigation";
import createAxiosInstance from "@/utils/api";
import FacilityDetails from "@/components/facility-management/view-facility";
import formatCurrency from "@/utils/formatCurrency";

function FacilityManagementEntity() {
  const axiosInstance = createAxiosInstance();
  const router = useRouter();
  const { entity, id } = useParams();

  const [activeEntity, setAActiveEntity] = useState<any>();

  const getAFacility = async () => {
    const response = await axiosInstance.get(`/facilities/${id}`);
    setAActiveEntity(response.data.data);
  };

  const getABlock = async () => {
    const response = await axiosInstance.get(`/blocks/${id}`);
    setAActiveEntity(response.data.data);
  };

  const getAUnit = async () => {
    const response = await axiosInstance.get(`/units/${id}`);
    setAActiveEntity(response.data.data);
  };
  useEffect(() => {
    if (id) {
      if (entity === "facility") {
        getAFacility();
      } else if (entity === "unit") {
        getAUnit();
      } else if (entity === "block") getABlock();
    }
  }, [id]);

  let titlePrefix = "";
  let detailText = "";

  if (entity === "unit") {
    titlePrefix = "Unit";
    detailText = "Unit Details";
  } else if (entity === "block") {
    titlePrefix = "Block";
    detailText = "Block Details";
  } else if (entity === "facility") {
    titlePrefix = "Facility";
    detailText = "Facility Details";
  }

  // Extract and convert the wallet balances to numbers
  const powerWalletBalance = formatCurrency(
    activeEntity?.wallets?.find((wallet) => wallet.walletType === "POWER")
      ?.balance
  );
  const serviceWalletBalance = formatCurrency(
    activeEntity?.wallets?.find((wallet) => wallet.walletType === "SERVICE")
      ?.balance
  );

  const formattedPowerWallet = `₦ ${powerWalletBalance}`;
  const formattedServiceWallet = `₦ ${serviceWalletBalance}`;

  const newData =
    entity !== "block"
      ? {
          powerWallet: formattedPowerWallet,
          serviceWallet: formattedServiceWallet,
          ...activeEntity,
        }
      : { ...activeEntity };

  return (
    <DashboardLayout
      title={`${titlePrefix} ${
        activeEntity?.unitNumber ||
        activeEntity?.blockNumber ||
        activeEntity?.name
      }`}
      detail={detailText}
      dynamic
      onclick={() => router.back()}

      
    >
      <div className="relative bg-white rounded-2xl p-8 ">
        <FacilityDetails facility={newData} />
      </div>
    </DashboardLayout>
  );
}

export default withPermissions(FacilityManagementEntity, [
  "units",
  "blocks",
  "facilities",
]);
