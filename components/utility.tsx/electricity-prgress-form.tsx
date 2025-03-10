import { FormEvent, useEffect, useState } from "react";
import Select from "react-select";
import createAxiosInstance from "@/utils/api";
import { multiSelectStyle } from "@/utils/ojects";
import { LabelInputComponent } from "../input-container";
import { toast } from "react-toastify";

export default function ElectricityFlow({
  electricity,
  utility,
  setModalState,
  setSuccessState,
  setBeneficiaryState,
  beneficiaryObj,
  code,
  setCode,
  setPINState,
}) {
  const axiosInstance = createAxiosInstance();

  const initialCustomerData = {
    Customer_Name: "",
    meterNumber: "",
    provider: "",
    type: "prepaid",
  };
  const initialRechargeData = {
    disco: "",
    meterNumber: "",
    type: "prepaid",
    amount: "",
    description: "",
  };
  // Stepper and form state
  const [activeStep, setActiveStep] = useState(0);
  const [customerData, setCustomerData] = useState(initialCustomerData);
  const [rechargeData, setRechargeData] = useState(initialRechargeData);

  useEffect(() => {
    setCustomerData({ ...customerData, provider: utility.provider || "" });
  }, []);

  useEffect(() => {
    if (beneficiaryObj) {
      setCustomerData((prev) => ({
        ...prev,
        provider: beneficiaryObj?.disco || "",
        meterNumber: beneficiaryObj?.meterNumber || "",
        type: beneficiaryObj?.type || "",
      }));
    }
  }, [beneficiaryObj]);

  const handleSelectChange = (field: string) => (selected: any) =>
    setCustomerData((prev) => ({ ...prev, [field]: selected?.value || "" }));

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRechargeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRechargeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomerSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await axiosInstance.post(`/electricity/validate/`, customerData);
    // Pre-fill recharge data with validated customer details
    console.log(customerData);
    setRechargeData((prev) => ({
      ...prev,
      disco: customerData.provider,
      meterNumber: customerData.meterNumber,
      type: customerData.type,
    }));
    setActiveStep(1);
  };

  const handleRechargeSubmit = async () => {
    try {
      if (Number(rechargeData.amount) < Number(utility.minAmount)) {
        toast.warning("Amount cannot be below minimun amount");
        return;
      }
      const joinCode = code.join("");
      const payload = {
        ...rechargeData,
        amount: Number(rechargeData.amount) || 0,
        pin: joinCode,
      };
      await axiosInstance.post(`/electricity/recharge`, payload);
      setSuccessState({
        title: "Successful",
        detail: "Recharge successful.",
        status: true,
      });

      setModalState("");
    } catch (error) {
      setCode(Array(4).fill(""));
    }
  };

  const typeOptions = [
    { value: "prepaid", label: "Prepaid" },
    { value: "postpaid", label: "Postpaid" },
  ];

  const electricityOptions = electricity?.map((electricity: any) => ({
    value: electricity.provider,
    label: electricity.provider,
  }));

  useEffect(() => {
    const allNonEmpty = code.every((str) => str !== "");
    if (allNonEmpty) {
      handleRechargeSubmit();
      setPINState("");
    }
  }, [code]);

  return (
    <div>
      {/* Stepper Indicator */}
      <div className="mb-6 px-6">
        <div className="flex justify-between text-sm font-semibold">
          <span
            className={activeStep === 0 ? "text-[#A8353A]" : "text-gray-500"}
          >
            Step 1: Validation
          </span>
          <span
            className={activeStep === 1 ? "text-[#A8353A]" : "text-gray-500"}
          >
            Step 2: Recharge
          </span>
        </div>
        <div className="w-full bg-gray-300 h-2 rounded mt-2">
          <div
            className="bg-[#A8353A] h-2 rounded transition-all duration-300"
            style={{ width: activeStep === 0 ? "50%" : "100%" }}
          />
        </div>
      </div>

      {/* Step 1: Customer Validation */}
      {activeStep === 0 && (
        <form
          onSubmit={handleCustomerSubmit}
          className="mt-12 px-6 max-w-full sm:mt-6 pb-12"
        >
          <div className="relative w-full mt-6">
            <Select
              options={electricityOptions}
              value={electricityOptions.find(
                (option) => option.value === customerData.provider
              )}
              onChange={handleSelectChange("provider")}
              styles={multiSelectStyle}
              placeholder="Select Provider"
              required
            />
          </div>
          <div className="relative w-full mt-6">
            <Select
              options={typeOptions}
              value={typeOptions.find(
                (option) => option.value === customerData.type
              )}
              onChange={handleSelectChange("type")}
              styles={multiSelectStyle}
              placeholder="Select Type"
              required
            />
          </div>
          <LabelInputComponent
            type="text"
            name="Customer_Name"
            value={customerData.Customer_Name}
            onChange={handleCustomerChange}
            label="Customer Name"
            required
          />
          <LabelInputComponent
            type="text"
            name="meterNumber"
            value={customerData.meterNumber}
            onChange={handleCustomerChange}
            label="Meter Number"
            required
          />

          <div className="flex justify-end">
            <p
              className="text-[#A8353A] my-3 cursor-pointer"
              onClick={() => setBeneficiaryState("ben")}
            >
            Choose Beneficiary
            </p>
          </div>
          <div className="mt-10 flex w-full justify-end">
            <button
              type="submit"
              className="block rounded-md bg-[#A8353A] px-4 py-3.5 text-center text-xs font-semibold text-white"
            >
              Next
            </button>
          </div>
        </form>
      )}

      {/* Step 2: Recharge */}
      {activeStep === 1 && (
        <form
          onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setPINState("enterPIN");
          }}
          className="mt-12 px-6 max-w-full sm:mt-6 pb-12"
        >
          <LabelInputComponent
            type="text"
            name="disco"
            value={rechargeData.disco}
            onChange={handleRechargeChange}
            label="Disco"
            readOnly
          />
          <LabelInputComponent
            type="text"
            name="meterNumber"
            value={rechargeData.meterNumber}
            readOnly
            label="Meter Number"
          />
          <LabelInputComponent
            type="text"
            name="type"
            value={rechargeData.type}
            readOnly
            label="Type"
          />
          <LabelInputComponent
            type="number"
            name="amount"
            value={rechargeData.amount}
            onChange={handleRechargeChange}
            label="Amount"
            placeholder="5000"
            required
          />
          <LabelInputComponent
            type="text"
            name="description"
            value={rechargeData.description}
            onChange={handleRechargeChange}
            label="Description"
          />
          <div className="mt-10 flex w-full justify-between">
            <button
              type="button"
              onClick={() => setActiveStep(0)}
              className="block rounded-md bg-gray-500 px-4 py-3.5 text-center text-xs font-semibold text-white"
            >
              Back
            </button>
            <button
              type="submit"
              className="block rounded-md bg-[#A8353A] px-4 py-3.5 text-center text-xs font-semibold text-white"
            >
              Recharge
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
