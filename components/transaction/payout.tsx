import { FormEvent, useEffect, useState } from "react";
import Select from "react-select";
import { multiSelectStyle } from "@/utils/ojects";
import {
  LabelInputComponent,
  LabelTextareaComponent,
} from "../input-container";
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
  setCode?: any;
}

export default function Payouts({
  setModalState,
  activeRowId,
  setSuccessState,
  type,
  code,
  setCode,
  setPINState,
}: FundWalletProps) {
  const axiosInstance = createAxiosInstance();
  const [formData, setFormData] = useState({
    account_number: "",
    bank_code: "",
    bank_name: "",
    myWalletId: "",
    amount: "",
    narration: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [unit, setAUnit] = useState<any>();
  const [acountDetails, setAccountDetails] = useState<any>(null);
  const [bankList, setBankList] = useState<any[]>([]);

  // The required length is based on "UPDCFMPW0000085"
  const ACCOUNT_NUMBER_LENGTH = 10; // 15

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

  const getBankList = async () => {
    const response = await axiosInstance.get(`/payments/payout/bank-list`);
    setBankList(response.data.data);
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

  useEffect(() => {
    getBankList();
  }, []);

  const options = unit?.wallets?.map((wallet: any) => ({
    value: wallet.walletID,
    label: wallet.walletType + " ₦ " + wallet.balance,
  }));

  const bankOptions = bankList?.map((list: any) => ({
    value: list.bank_code,
    label: list.bank_name,
  }));

  const handleSelectChange = (fieldName: string) => (selected: any) => {
    setFormData({
      ...formData,
      [fieldName]: selected?.value || "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAccountNumberChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (value.length >= ACCOUNT_NUMBER_LENGTH) {
      await getAccountByAccountNumber(value);
    } else {
      setAccountDetails(null);
    }
  };

  const getAccountByAccountNumber = async (accountNumber: string) => {
    try {
      const response = await axiosInstance.post(
        `/payments/payout/verify/account-name`,
        {
          bank_code: formData.bank_code,
          account_number: accountNumber,
        }
      );
      setAccountDetails(response.data.data);
      setFormData((prev) => ({
        ...prev,
        accountNumber, // Ensure accountNumber stays updated
        bank_name: response.data.data?.account_name,
      }));
    } catch (error) {
      toast.warning(error.response.data.message);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { myWalletId, ...rest } = formData;
      const joinCode = code.join("");
      const payload = {
        ...rest,
        pin: joinCode,
        //   amount: Number(formData.amount) || 0,
      };

      await axiosInstance.post(
        `/payments/payout/bank-transfer/${formData.myWalletId}`,
        payload
      );
      setFormData({
        account_number: "",
        bank_code: "",
        bank_name: "",
        myWalletId: "",
        amount: "",
        narration: "",
      });
      setModalState("");
      setSuccessState({
        title: "Successful",
        detail: `Your payout was successful`,
        status: true,
      });
    } catch (error) {
      setLoading(false);
      setCode(Array(4).fill(""));
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

          <div className="relative w-full mt-6">
            <Select
              options={bankOptions}
              value={bankOptions?.find(
                (option) => option.value === formData.bank_code
              )}
              onChange={handleSelectChange("bank_code")}
              styles={multiSelectStyle}
              placeholder="Select Bank"
              required
            />
          </div>

          {/* Wallet Account Number Input */}

          <LabelInputComponent
            type="text"
            name="account_number"
            value={formData.account_number}
            onChange={handleAccountNumberChange}
            label="Bank Account Number"
            required
          />

          {/* Display Wallet Details (if found) */}
          {acountDetails && (
            <LabelInputComponent
              type="text"
              name="accountName"
              value={acountDetails.account_name}
              label="Account name"
              readOnly
            />
          )}

          <LabelInputComponent
            type="text"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            label="Amount"
            required
          />

          <div className="relative w-full mt-6">
            <LabelTextareaComponent
              name="narration"
              value={formData.narration}
              onChange={handleChange}
              label="narration"
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
