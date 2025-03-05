import { FormEvent, useEffect, useState } from "react";
import createAxiosInstance from "@/utils/api";
import { LabelInputComponent } from "../input-container";
import { toast } from "react-toastify";
import Select from "react-select";
import { multiSelectStyle } from "@/utils/ojects";

export default function InternetFlow({
  internet,
  utility,
  setModalState,
  setSuccessState,
  setBeneficiaryState,
  beneficiaryObj,
}) {
  const axiosInstance = createAxiosInstance();

  const initialPurchaseData = {
    telco: "",
    name: "",
    number: "",
    plan_id: 0,
    reference: "",
  };

  const [purchaseData, setPurchaseData] = useState(initialPurchaseData);

  useEffect(() => {
    setPurchaseData((prev) => ({
      ...prev,
      telco: utility.provider || "",
      name: utility.name || "",
      plan_id: utility.id || "",
    }));
  }, []);

  useEffect(() => {
    if (beneficiaryObj) {
      setPurchaseData((prev) => ({
        ...prev,
        telco: beneficiaryObj?.telco  || "",
        number: beneficiaryObj?.number || "" ,
        plan_id: Number(beneficiaryObj?.plan_id)|| 0 ,
      }));
    }
  }, [beneficiaryObj]);

  const handleSelectChange = (field: string) => (selected: any) =>
    setPurchaseData((prev) => ({ ...prev, [field]: selected?.value || "" }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPurchaseData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, ...payload } = purchaseData;
    await axiosInstance.post(`/internet/purchase`, payload);
    setSuccessState({
      title: "Successful",
      detail: "Purchase successful.",
      status: true,
    });
    setModalState("");
  };

  const internetOptions = internet?.map((internet: any) => ({
    value: internet.provider,
    label: internet.provider,
  }));

  const [plans, setPlans] = useState<any>();
  const getInternetPlans = async () => {
    const response = await axiosInstance.get(
      `/internet/plans/${purchaseData.telco}`
    );
    setPlans(response.data.data);
  };

  useEffect(() => {
    if(purchaseData.telco){
      getInternetPlans();
    }

  }, [purchaseData.telco]);

  const planOptions = plans?.map((sub: any) => ({
    value: sub.id,
    label: sub.name,
  }));
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="mt-12 px-6 max-w-full sm:mt-6 pb-12"
      >
        <div className="relative w-full mt-6">
          <Select
            options={internetOptions}
            value={internetOptions?.find(
              (option) => option.value === purchaseData.telco
            )}
            onChange={handleSelectChange("telco")}
            styles={multiSelectStyle}
            placeholder="Select Provider"
            required
          />
        </div>

        <div className="relative w-full mt-6">
          <Select
            options={planOptions}
            value={planOptions?.find(
              (option) => option.value === purchaseData.plan_id
            )}
            onChange={handleSelectChange("plan_id")}
            styles={multiSelectStyle}
            placeholder="Select Plan"
            required
          />
        </div>

        <LabelInputComponent
          type="text"
          name="number"
          value={purchaseData.number}
          onChange={handleChange}
          label="Phone Number"
          required
        />
        <LabelInputComponent
          type="text"
          name="reference"
          value={purchaseData.reference}
          onChange={handleChange}
          label="Reference (Optional)"
        />

        <div className="flex justify-end">
          <p
            className="text-[#A8353A] my-3 cursor-pointer"
            onClick={() => setBeneficiaryState("ben")}
          >
            Choose Beneficiaries for internet
          </p>
        </div>
        <div className="mt-10 flex w-full justify-end">
          <button
            type="submit"
            className="block rounded-md bg-[#A8353A] px-4 py-3.5 text-center text-xs font-semibold text-white"
          >
            Purchase
          </button>
        </div>
      </form>
    </div>
  );
}
