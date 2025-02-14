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

  const [facility, setAFacility] = useState<Facility>();
  const [block, setABlock] = useState<Block>();
  const [unit, setAUnit] = useState<Unit>();
  const getAFacility = async () => {
    const response = await axiosInstance.get(`/facilities/${id}`);
    setAFacility(response.data.data);
  };

  const getABlock = async () => {
    const response = await axiosInstance.get(`/blocks/${id}`);
    setABlock(response.data.data);
  };

  const getAUnit = async () => {
    const response = await axiosInstance.get(`/units/${id}`);
    setAUnit(response.data.data);
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
    unit?.wallets.find((wallet) => wallet.walletType === "POWER")?.balance
  );
  const serviceWalletBalance = formatCurrency(
    unit?.wallets.find((wallet) => wallet.walletType === "SERVICE")?.balance
  );
  const powerWalletBalanceFac = formatCurrency(
    facility?.wallets.find((wallet) => wallet.walletType === "POWER")?.balance
  );
  const serviceWalletBalanceFac = formatCurrency(
    facility?.wallets.find((wallet) => wallet.walletType === "SERVICE")?.balance
  );
  const formattedPowerWallet = `₦ ${powerWalletBalance}`;
  const formattedServiceWallet = `₦ ${serviceWalletBalance}`;
  const formattedPowerWalletFac = `₦ ${powerWalletBalanceFac}`;
  const formattedServiceWalletFac = `₦ ${serviceWalletBalanceFac}`;
  const newUnit = {
    powerWallet: formattedPowerWallet,
    serviceWallet: formattedServiceWallet,
    ...unit,
  };
  const newFacility = {
    powerWallet: formattedPowerWalletFac,
    serviceWallet: formattedServiceWalletFac,
    ...facility,
  };

  return (
    <DashboardLayout
      title={`${titlePrefix} ${
        unit?.unitNumber || block?.blockNumber || facility?.name
      }`}
      detail={detailText}
      dynamic
      onclick={() => router.back()}
    >
      <div className="relative bg-white rounded-2xl p-8 ">
        <FacilityDetails facility={newUnit || newFacility || block} />
      </div>
    </DashboardLayout>
  );
}

export default withPermissions(FacilityManagementEntity, [
  "units",
  "blocks",
  "facilities",
]);
