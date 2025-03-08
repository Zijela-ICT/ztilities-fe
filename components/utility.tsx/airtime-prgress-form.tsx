import { FormEvent, JSX, useEffect, useState } from "react";
import createAxiosInstance from "@/utils/api";
import { LabelInputComponent } from "../input-container";
import { toast } from "react-toastify";
import Select from "react-select";
import { multiSelectStyle } from "@/utils/ojects";
import Benfeciaries from "./benficiaries";

export default function AirtimeFlow({
  airtime,
  utility,
  setModalState,
  setSuccessState,
  setBeneficiaryState,
  beneficiaryObj,
}) {
  const axiosInstance = createAxiosInstance();

  const initialTopupData = {
    telco: "",
    number: "",
    amount: "",
    reference: "",
  };

  // const [centralState, setCentralState] = useState<string>();
  const [topupData, setTopupData] = useState(initialTopupData);

  useEffect(() => {
    setTopupData({ ...topupData, telco: utility.provider || "" });
  }, []);

  useEffect(() => {
    if (beneficiaryObj) {
      setTopupData((prev) => ({
        ...prev,
        telco: beneficiaryObj?.telco || "",
        number: beneficiaryObj?.number || "",
      }));
    }
  }, [beneficiaryObj]);

  const handleSelectChange = (field: string) => (selected: any) =>
    setTopupData((prev) => ({ ...prev, [field]: selected?.value || "" }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTopupData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Number(topupData.amount) < Number(utility.minAmount)) {
      toast.warning("Amount cannot be below minimun amount");
      return;
    }

    const payload = {
      ...topupData,
      amount: Number(topupData.amount) || 0,
    };
    await axiosInstance.post(`/airtime/topup`, payload);
    setSuccessState({
      title: "Successful",
      detail: "Topup successful.",
      status: true,
    });
    setModalState("");
  };

  const airtimeOptions = airtime?.map((airtime: any) => ({
    value: airtime.provider,
    label: airtime.provider,
  }));

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="mt-12 px-6 max-w-full sm:mt-6 pb-12"
      >
        <div className="relative w-full mt-6">
          <Select
            options={airtimeOptions}
            value={airtimeOptions.find(
              (option) => option.value === topupData.telco
            )}
            onChange={handleSelectChange("telco")}
            styles={multiSelectStyle}
            placeholder="Select Provider"
            required
          />
        </div>
        <LabelInputComponent
          type="text"
          name="number"
          value={topupData.number}
          onChange={handleChange}
          label="Phone Number"
          required
        />
        <LabelInputComponent
          type="number"
          name="amount"
          value={topupData.amount}
          onChange={handleChange}
          label="Amount"
          required
        />
        <LabelInputComponent
          type="text"
          name="reference"
          value={topupData.reference}
          onChange={handleChange}
          label="Reference (Optional)"
        />

        <div className="flex justify-end">
          <p
            className="text-[#A8353A] my-3 cursor-pointer"
            onClick={() => setBeneficiaryState("ben")}
          >
            Beneficiaries for airtime
          </p>
        </div>

        <div className="mt-10 flex w-full justify-end">
          <button
            type="submit"
            className="block rounded-md bg-[#A8353A] px-4 py-3.5 text-center text-xs font-semibold text-white"
          >
            Topup
          </button>
        </div>
      </form>
    </div>
  );
}
