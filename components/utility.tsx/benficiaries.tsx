import { FormEvent, useEffect, useState } from "react";
import createAxiosInstance from "@/utils/api";
import { LabelInputComponent } from "../input-container";
import { toast } from "react-toastify";
import Select from "react-select";
import { multiSelectStyle } from "@/utils/ojects";
import { useDataPermission } from "@/context";
import { TrashIcon } from "@/utils/svg";

export default function Beneficiaries({
  airtime,
  electricity,
  tv,
  internet,
  setABeneficiary,
  utility,
  setModalState,
  activeRowId,
  setSuccessState,
}) {
  const axiosInstance = createAxiosInstance();
  const { user } = useDataPermission();
  const initialTopupData = {
    telco: "",
    number: "",
    utility: "",
  };

  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [data, setTopupData] = useState(initialTopupData);

  // When the utility changes, reset the telco (provider) selection
  useEffect(() => {
    setTopupData((prev) => ({ ...prev, telco: "" }));
  }, [data.utility]);

  const handleSelectChange = (field: string) => (selected: any) =>
    setTopupData((prev) => ({ ...prev, [field]: selected?.value || "" }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTopupData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { utility, ...payload } = data;
    console.log(payload);
    await axiosInstance.post(
      `/users/${user.id}/beneficiaries?type=airtime`,
      payload
    );
    setSuccessState({
      title: "Successful",
      detail: "Beneficiary added",
      status: true,
    });
    setModalState("");
  };

  const utilityOptions = [
    { value: "electricity", label: "Electricity" },
    { value: "airtime", label: "Airtime" },
    { value: "internet", label: "Internet" },
    { value: "tv", label: "TV Subscription" },
  ];

  const providerOptions = (() => {
    switch (data.utility) {
      case "airtime":
        return (
          airtime?.map((item: any) => ({
            value: item.provider,
            label: item.provider,
          })) || []
        );
      case "electricity":
        return (
          electricity?.map((item: any) => ({
            value: item.provider,
            label: item.provider,
          })) || []
        );
      case "internet":
        return (
          internet?.map((item: any) => ({
            value: item.provider,
            label: item.provider,
          })) || []
        );
      case "tv":
        return (
          tv?.map((item: any) => ({
            value: item.provider,
            label: item.provider,
          })) || []
        );
      default:
        return [];
    }
  })();

  const [activeTab, setActiveTab] = useState("airtime");
  // State to toggle between list view and add beneficiary form view
  const [showForm, setShowForm] = useState(false);

  const getUtilityBeneficiaries = async (tab: string) => {
    const response = await axiosInstance.get(
      `/users/${user.id}/beneficiaries?type=${tab}`
    );
    setBeneficiaries([
      {
        telco: "MTN",
        number: "08012345678",
      },
    ]);
    // setBeneficiaries(response.data.data);
  };
  useEffect(() => {
    getUtilityBeneficiaries(activeTab);
  }, [activeTab]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {!showForm ? (
        <>
          {/* Tabs Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {[
                { key: "airtime", label: "Airtime" },
                { key: "electricity", label: "Electricity" },
                { key: "tv", label: "TV Subscription" },
                { key: "internet", label: "Internet" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none ${
                    activeTab === tab.key
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Beneficiaries List */}
          <div className="space-y-4">
            {beneficiaries.length > 0 ? (
              beneficiaries.map((beneficiary, index) => (
                <div
                  key={index}
                  onClick={() => setABeneficiary(beneficiary)}
                  className="bg-white cursor-pointer shadow rounded-lg p-4 flex justify-between items-center border border-gray-200"
                >
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      {beneficiary.telco}
                    </p>
                    <p className="text-gray-600">{beneficiary.number}</p>
                  </div>
                  {/* <div onClick={()=> deleteBeneficiary(beneficiary.telco) } >
                    <TrashIcon />
                  </div> */}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No beneficiaries found.</p>
            )}
          </div>

          {/* Button to switch to Add Beneficiary form */}
          <div className="mt-10 flex w-full justify-start">
            <button
              onClick={() => setShowForm(true)}
              className="block rounded-md bg-[#A8353A] px-4 py-3.5 text-center text-xs font-semibold text-white"
            >
              Add Beneficiary
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Go Back button at the top */}
          <button
            onClick={() => setShowForm(false)}
            className="flex items-center text-black font-semibold mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
          {/* Add Beneficiary Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-12 px-6 max-w-full sm:mt-6 pb-12"
          >
            <div className="relative w-full mt-6">
              <Select
                options={utilityOptions}
                value={utilityOptions.find(
                  (option) => option.value === data.utility
                )}
                onChange={handleSelectChange("utility")}
                styles={multiSelectStyle}
                placeholder="Select Utility"
                required
              />
            </div>
            <div className="relative w-full mt-6">
              <Select
                options={providerOptions}
                value={providerOptions.find(
                  (option) => option.value === data.telco
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
              value={data.number}
              onChange={handleChange}
              label="Phone Number"
              required
            />

            <div className="mt-10 flex w-full justify-end">
              <button
                type="submit"
                className="block rounded-md bg-[#A8353A] px-4 py-3.5 text-center text-xs font-semibold text-white"
              >
                Add Beneficiary
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
