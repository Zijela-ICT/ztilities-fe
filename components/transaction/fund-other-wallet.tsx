import { FormEvent, useEffect, useState } from "react";
import Select from "react-select";
import { multiSelectStyle } from "@/utils/ojects";
import { LabelInputComponent } from "../input-container";
import createAxiosInstance from "@/utils/api";
import { MyLoaderFinite } from "../loader-components";
import { toast } from "react-toastify";

interface FundWalletProps {
  setModalState: (state: any) => void;
  setPINState?: (state: any) => void;
  activeRowId: number | string;
  setSuccessState?: (state: any) => void;
  type?: string;
  code?: any[];
  setCode?: any
}

export default function FundOtherWallet({
  setModalState,
  setPINState,
  activeRowId,
  setSuccessState,
  type,
  code,
  setCode
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
  const WALLET_ACCOUNT_NUMBER_LENGTH = 15; // 15

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
    value: wallet.walletID,
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
    try {
      const response = await axiosInstance.get(`/wallets/wallet/${walletId}`);
      setWalletDetails(response.data.data);
    } catch (error) {
      console.log(error);
      toast.warning(error.response.data.message);
    }
  };

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const { myWalletId, ...rest } = formData;
      const joinCode = code.join("");
      const payload = {
        ...rest,
        amount: Number(formData.amount) || 0,
        pin: joinCode,
      };
      await axiosInstance.post(`/wallets/wallet-wallet/transfer`, payload);
      setFormData({
        myWalletId: "",
        walletId: "",
        amount: "",
      });
      setModalState("");
      setPINState("");
      setSuccessState({
        title: "Successful",
        detail: `Your transaction is successful`,
        status: true,
      });  
    } catch (error) {
      setLoading(false);
      setCode(Array(4).fill(""))
    }
    
  };

  useEffect(() => {
    const allNonEmpty = code.every((str) => str !== "");
    if (allNonEmpty) {
      handleSubmit();
      setPINState("");
    }
  }, [code]);

  return (
    <div>
      {loading ? (
        <MyLoaderFinite height="h-[50vh]" />
      ) : (
        <form
          onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setPINState("enterPIN");
          }}
          className="mt-12 px-6 max-w-full sm:mt-6 pb-12"
        >
          {/* Wallet Account Number Input */}

          <LabelInputComponent
            type="text"
            name="walletId"
            value={formData.walletId}
            onChange={handleAccountNumberChange}
            label="Wallet Account Number"
            required
          />

          {/* Display Wallet Details (if found) */}
          {walletDetails && (
            <LabelInputComponent
              type="text"
              name="walletInfo"
              value={`${
                walletDetails?.user
                  ? walletDetails.user.firstName + walletDetails.user.lastName
                  : walletDetails?.unit
                  ? walletDetails.unit.unitNumber
                  : walletDetails?.facility
                  ? walletDetails.facility.facilityName
                  : ""
              } (${walletDetails?.walletType || ""})`}
              label="Wallet Info"
              readOnly
            />
          )}

          <LabelInputComponent
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            label="Amount"
            required
          />

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
