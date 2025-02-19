import { FormEvent, useEffect, useState } from "react";
import Select from "react-select";
import { multiSelectStyle } from "@/utils/ojects";
import { LabelInputComponent } from "../input-container";
import createAxiosInstance from "@/utils/api";
import { MyLoaderFinite } from "../loader-components";

interface FundWalletProps {
  setModalState: (state: any) => void;
  activeRowId: number | string;
  setSuccessState?: (state: any) => void;
  type?: string;
}

export default function FundOtherWallet({
  setModalState,
  activeRowId,
  setSuccessState,
  type,
}: FundWalletProps) {
  const axiosInstance = createAxiosInstance();
  const [formData, setFormData] = useState({
    walletId: "",
    myWalletId: "",
    amount: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [unit, setAUnit] = useState<any>();
  const [walletDetails, setWalletDetails] = useState<any>(null);

  // The required length is based on "UPDCFMPW0000085"
  const WALLET_ACCOUNT_NUMBER_LENGTH = "UPDCFMPW0000085".length; // 15

  const getAUnit = async () => {
    const response = await axiosInstance.get(`/units/${activeRowId}`);
    setAUnit(response.data.data);
  };

  const getAFacility = async () => {
    const response = await axiosInstance.get(`/facilities/${activeRowId}`);
    setAUnit(response.data.data);
  };

  const getMe = async () => {
    const response = await axiosInstance.get(`/auth/me`);
    setAUnit(response.data.data?.user);
  };

  useEffect(() => {
    if (type === "Facilities" || type === "My Facilities") {
      getAFacility();
    } else if (type === "User") {
      getMe();
    } else {
      getAUnit();
    }
  }, [type]);

  const options = unit?.wallets?.map((wallet: any) => ({
    value: wallet.id,
    label: wallet.walletType + " ₦ " + wallet.balance,
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

  // Handle change for the wallet account number field.
  // When the input length is at least the required length,
  // fetch the wallet details.
  const handleAccountNumberChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (value.length >= WALLET_ACCOUNT_NUMBER_LENGTH) {
      await getWalletByAccountNumber(value);
    } else {
      setWalletDetails(null);
    }
  };

  const getWalletByAccountNumber = async (walletId: string) => {
      const response = await axiosInstance.get(`/wallets/${walletId}`);
      setWalletDetails(response.data.data);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { myWalletId, ...rest } = formData;
    const payload = {
      ...rest,
      amount: Number(formData.amount) || 0,
    };
    await axiosInstance.post(`/wallets/wallet-wallet/transfer`, payload);
    setFormData({
      myWalletId: "",
      walletId: "",
      amount: "",
    });
    setModalState("");
    setSuccessState({
      title: "Successful",
      detail: `Your transaction is successful`,
      status: true,
    });
  };

  return (
    <div>
      {loading ? (
        <MyLoaderFinite height="h-[50vh]" />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-12 px-6 max-w-full sm:mt-6 pb-12"
        >
          {/* Wallet Account Number Input */}
          <div className="relative w-full mt-6">
            <LabelInputComponent
              type="text"
              name="walletId"
              value={formData.walletId}
              onChange={handleAccountNumberChange}
              label="Wallet Account Number"
              required
            />
          </div>

          {/* Display Wallet Details (if found) */}
          {walletDetails && (
            <div className="relative w-full mt-6">
              <LabelInputComponent
                type="text"
                name="walletInfo"
                value={`${walletDetails.walletID} (${walletDetails.walletType})`}
                label="Wallet Info"
                readOnly
              />
            </div>
          )}

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
                (option) => option.value === formData.myWalletId
              )}
              onChange={handleSelectChange("myWalletId")}
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
              Transfer
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
