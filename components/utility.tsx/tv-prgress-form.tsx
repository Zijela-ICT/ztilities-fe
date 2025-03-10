import { FormEvent, useEffect, useState } from "react";
import Select from "react-select";
import createAxiosInstance from "@/utils/api";
import { multiSelectStyle } from "@/utils/ojects";
import { LabelInputComponent } from "../input-container";
import { toast } from "react-toastify";
import { useDataPermission } from "@/context";

export default function TVFlow({
  tv,
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
  const { user } = useDataPermission();

  const initialBeneficiaryData = {
    tv: "",
    number: "",
    plan_id: 0,
    alias: "",
  };
  const initialCustomerData = {
    tv: "",
    number: "",
    name: "",
  };
  const initialSubsribeData = {
    tv: "",
    number: "",
    plan_id: 0,
    description: "",
    alias: "",
  };
  // Stepper and form state
  const [activeStep, setActiveStep] = useState(0);
  const [checked, setChecked] = useState(false);
  const [beneficiaryData, setBeneficiaryData] = useState(
    initialBeneficiaryData
  );
  const [customerData, setCustomerData] = useState(initialCustomerData);
  const [subscribeData, setSubscribeData] = useState(initialSubsribeData);

  useEffect(() => {
    setCustomerData((prev) => ({
      ...prev,
      tv: utility.provider || "",
      number: utility.number || "",
      name: utility.name || "",
    }));
  }, []);

  useEffect(() => {
    if (beneficiaryObj) {
      setCustomerData((prev) => ({
        ...prev,
        tv: beneficiaryObj.tv || "",
        number: beneficiaryObj.number || "",
      }));
    }
  }, [beneficiaryObj]);

  useEffect(() => {
    setSubscribeData((prev) => ({
      ...prev,
      plan_id: utility.id || "",
    }));
  }, []);

  useEffect(() => {
    if (beneficiaryObj) {
      setSubscribeData((prev) => ({
        ...prev,
        plan_id: Number(beneficiaryObj?.plan_id) || 0,
      }));
    }
  }, [beneficiaryObj]);

  const handleSelectChange = (field: string) => (selected: any) =>
    setCustomerData((prev) => ({ ...prev, [field]: selected?.value || "" }));

  const handleSelectSubscribeChange = (field: string) => (selected: any) =>
    setSubscribeData((prev) => ({ ...prev, [field]: selected?.value || "" }));

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRechargeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSubscribeData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    setBeneficiaryData((prev) => ({
      ...prev,
      tv: customerData.tv,
      number: customerData.number,
      plan_id: subscribeData.plan_id,
      alias: subscribeData.alias,
    }));
  }, [customerData, subscribeData]);

  const handleCheck = () => {
    setChecked((prev) => !prev);
  };

  const handleCustomerSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, ...payload } = customerData;
    await axiosInstance.post(`/tv/validate/`, payload);
    setSubscribeData((prev) => ({
      ...prev,
      tv: customerData.tv,
      number: customerData.number,
    }));
    setActiveStep(1);
  };

  const handleRechargeSubmit = async () => {
    try {
      const joinCode = code.join("");
      const payload = {
        ...subscribeData,
        pin: joinCode,
      };
      await axiosInstance.post(`/tv/subscribe`, payload);
      if (checked) {
        await axiosInstance.post(
          `/users/${user.id}/beneficiaries?type=tv`,
          beneficiaryData
        );
      }
      setSuccessState({
        title: "Successful",
        detail: "Recharge successful.",
        status: true,
      });

      setModalState("");
      setCode(Array(4).fill(""));
    } catch (error) {
      setCode(Array(4).fill(""));
    }
  };

  const tvOptions = tv?.map((internet: any) => ({
    value: internet.provider,
    label: internet.provider,
  }));

  const [packages, setPackages] = useState<any>();
  const getTvPackages = async () => {
    const response = await axiosInstance.get(`/tv/packages/${customerData.tv}`);
    setPackages(response.data.data);
  };

  useEffect(() => {
    if (customerData.tv) {
      getTvPackages();
    }
  }, [customerData.tv]);

  const packageOptions = packages?.map((sub: any) => ({
    value: sub.id,
    label: sub.name,
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
            Step 2: Subscribe
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
          <Select
            options={tvOptions}
            value={tvOptions?.find(
              (option) => option.value === customerData.tv
            )}
            onChange={handleSelectChange("tv")}
            styles={multiSelectStyle}
            placeholder="Select Provider"
            required
          />

          <LabelInputComponent
            type="number"
            name="number"
            value={customerData.number}
            onChange={handleCustomerChange}
            label="Number"
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
          <div className="relative w-full mt-6">
            <Select
              options={packageOptions}
              value={packageOptions.find(
                (option) => option.value === subscribeData.plan_id
              )}
              onChange={handleSelectSubscribeChange("plan_id")}
              styles={multiSelectStyle}
              placeholder="Select Package"
              required
            />
          </div>
          <LabelInputComponent
            type="text"
            name="number"
            value={subscribeData.number}
            readOnly
            label="Number"
          />

          <LabelInputComponent
            type="text"
            name="description"
            value={subscribeData.description}
            onChange={handleRechargeChange}
            label="Description"
          />

          {activeStep === 1 && checked && (
            <LabelInputComponent
              type="text"
              name="alias"
              value={beneficiaryData.alias}
              onChange={handleRechargeChange}
              label="Alias for your beneficiary"
            />
          )}

          <div className="flex justify-between">
            <label className="flex items-center text-[#A8353A] my-3">
              <input
                className="mr-2"
                type="checkbox"
                checked={checked}
                onChange={handleCheck}
              />
              Save as beneficiary
            </label>
            <p
              className="text-[#A8353A] my-3 cursor-pointer"
              onClick={() => setBeneficiaryState("ben")}
            >
              Choose Beneficiary
            </p>
          </div>
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
              Subscribe
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
