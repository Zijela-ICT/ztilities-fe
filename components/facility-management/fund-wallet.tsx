import { FormEvent, useEffect, useState } from "react";
import Select from "react-select";
import axiosInstance from "@/utils/api";
import { multiSelectStyle } from "@/utils/ojects";
import { FileInputComponent, LabelInputComponent } from "../input-container";
import createAxiosInstance from "@/utils/api";
import { MyLoaderFinite } from "../loader-components";

interface FundWalletProps {
  setModalState: (state: any) => void;
  activeRowId: number | string;
  setSuccessState: (state: any) => void;
  type?: string;
}
export default function FundWallet({
  setModalState,
  activeRowId,
  setSuccessState,
  type,
}: FundWalletProps) {
  const axiosInstance = createAxiosInstance();
  const [formData, setFormData] = useState({
    walletId: "", // Status field
    amount: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [unit, setAUnit] = useState<Unit>();
  const getAUnit = async () => {
    const response = await axiosInstance.get(`/units/${activeRowId}`);
    setAUnit(response.data.data);
  };
  const getAFacility = async () => {
    const response = await axiosInstance.get(`/facilities/${activeRowId}`);
    setAUnit(response.data.data);
  };

  useEffect(() => {
    if (type === "Facilities" || type === "My Facilities") {
      getAFacility();
    } else {
      getAUnit();
    }
  }, [type]);

  const options = unit?.wallets?.map((wallet: any) => ({
    value: wallet.id,
    label: wallet.walletType + " " + "₦" + " " + wallet.balance,
  }));

  const handleSelectChange = (fieldName: string) => (selected: any) => {
    setFormData({
      ...formData,
      [fieldName]: selected?.value || "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...formData,
      amount: Number(formData.amount) || 0,
    };
    const response = await axiosInstance.post(`/payments/fund`, payload);
    window.open(response.data.data?.paymentURL, "_blank");
    setModalState("");
  };

  return (
    <div>
      {loading ? (
        <>
          <MyLoaderFinite height="h-[50vh]" />
        </>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-12 px-6 max-w-full sm:mt-6 pb-12"
        >
          <div className="relative w-full mt-6">
            <LabelInputComponent
              type="text"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              label="Amount"
              required
            />
          </div>
          <div className="relative w-full mt-6">
            <Select
              options={options}
              value={options?.find(
                (option) => option.value === formData.walletId
              )}
              onChange={handleSelectChange("walletId")}
              styles={multiSelectStyle}
              placeholder="Select Wallet"
              required
            />
          </div>

          <div className="mt-10 flex w-full justify-end">
            <button
              type="submit"
              className="block rounded-md bg-[#A8353A] px-4 py-3.5 text-center text-xs font-semibold text-white"
            >
              Fund Wallet
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
