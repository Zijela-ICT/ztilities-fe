import { FormEvent, useEffect, useState } from "react";
import Select from "react-select";
import { multiSelectStyle } from "@/utils/ojects";
import { FileInputComponent, LabelInputComponent } from "../input-container";
import createAxiosInstance from "@/utils/api";
import { MyLoaderFinite } from "../loader-components";

interface FundWalletProps {
  setModalState: (state: any) => void;
  activeRowId: number | string;
  setSuccessState?: (state: any) => void;
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
    walletId: "",
    amount: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [unit, setAUnit] = useState<Unit>();

  // State for selected funding method: "gateway" or "manual"
  const [selectedMethod, setSelectedMethod] = useState<"gateway" | "manual">(
    "gateway"
  );

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
    label: `${wallet.walletType} ₦ ${wallet.balance}`,
  }));

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [file, setFile] = useState<string | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files?.length) {
      const file = files[0];
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setFile(reader.result as string); // Store the file URL
      };
      reader.readAsDataURL(file);
    }
  };

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
    // Convert amount to number
    const payload = {
      ...formData,
      amount: Number(formData.amount) || 0,
    };

    const payload2 = {
      ...formData,
      file: file,
      amount: Number(formData.amount) || 0,
    };

    try {
      if (selectedMethod === "gateway") {
        // Existing endpoint for Payment Gateway
        const response = await axiosInstance.post(`/payments/fund`, payload);
        window.open(response.data.data?.paymentURL, "_blank");
      } else {
        // New endpoint for Manual Funding
        const response = await axiosInstance.post(
          `/payments/manual-fund`,
          payload2
        );
        if (setSuccessState) {
          setSuccessState(
            response.data.message || "Manual funding submitted successfully"
          );
        }
      }
      setModalState("");
    } catch (error) {
      console.error(error);
      // Optionally, handle errors here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <MyLoaderFinite height="h-[50vh]" />
      ) : (
        <>
          {/* Navigation Tabs */}
          {type !== "User" && (
            <div className="flex my-4 px-6 space-x-4">
              <button
                type="button"
                onClick={() => setSelectedMethod("gateway")}
                className={`px-4 py-2 rounded-md ${
                  selectedMethod === "gateway"
                    ? "bg-gray-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Payment Gateway
              </button>
              <button
                type="button"
                onClick={() => setSelectedMethod("manual")}
                className={`px-4 py-2 rounded-md ${
                  selectedMethod === "manual"
                    ? "bg-gray-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Manual Funding
              </button>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-12 px-6 max-w-full sm:mt-6 pb-12"
          >
            <LabelInputComponent
              type="text"
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
                  (option) => option.value === formData.walletId
                )}
                onChange={handleSelectChange("walletId")}
                styles={multiSelectStyle}
                placeholder="Select Wallet"
                required
              />
            </div>
            {/* Additional input for Manual Funding */}
            {selectedMethod === "manual" && (
              <div className="relative w-full mt-6">
                <FileInputComponent
                  name="cheque"
                  onChange={handleFileChange}
                  label="Cheque"
                  uploadedFile={uploadedFile}
                />
              </div>
            )}
            <div className="mt-10 flex w-full justify-end">
              <button
                type="submit"
                className="block rounded-md bg-[#A8353A] px-4 py-3.5 text-center text-xs font-semibold text-white"
              >
                {selectedMethod === "gateway" ? "Fund Wallet" : "Fund Wallet"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
