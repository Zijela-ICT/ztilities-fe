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
  setActiveBeneficiary,
  utility,
  setModalState,
  setModalStateDelete,
  modalStateDelete,
  setSuccessState,
  setBeneficiaryState,
}) {
  const axiosInstance = createAxiosInstance();
  const { user } = useDataPermission();

  console.log(utility,"okok")
  const getInitialData = (tab: string) => {
    switch (tab) {
      case "airtime":
        return { telco: "", number: "", alias: "", utility: tab };
      case "electricity":
        return {
          disco: "",
          meterNumber: "",
          type: "prepaid",
          alias: "",
          utility: tab,
        };
      case "internet":
        return { telco: "", number: "", plan_id: "", alias: "", utility: tab };
      case "tv":
        return { tv: "", number: "", plan_id: "", alias: "", utility: tab };
      default:
        return {};
    }
  };

  // State for beneficiaries list and active tab
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("airtime");

  // State for the form data; initialize based on activeTab
  const [data, setTopupData] = useState(getInitialData(activeTab));

  useEffect(() => {
    setTopupData(getInitialData(activeTab));
  }, [activeTab]);

  const providerFieldMapping: { [key: string]: string } = {
    airtime: "telco",
    electricity: "disco",
    internet: "telco",
    tv: "tv",
  };

  const providerField = providerFieldMapping[activeTab];

  // Compute provider options based on the active tab
  const providerOptions = (() => {
    switch (activeTab) {
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

  const handleSelectChange = (field: string) => (selected: any) =>
    setTopupData((prev) => ({ ...prev, [field]: selected?.value || "" }));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTopupData((prev) => ({ ...prev, [name]: value }));
  };

  //toggle
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = { ...data };
    await axiosInstance.post(
      `/users/${user.id}/beneficiaries?type=${activeTab}`,
      payload
    );
    setSuccessState({
      title: "Successful",
      detail: `Beneficiary for ${activeTab} added`,
      status: true,
    });
    setModalState("");
    setShowForm(false);
    // setBeneficiaryState("");
  };

  const getUtilityBeneficiaries = async (tab: string) => {
    const response = await axiosInstance.get(
      `/users/${user.id}/beneficiaries?type=${tab}`
    );
    setBeneficiaries(response.data.data);
  };

  useEffect(() => {
    getUtilityBeneficiaries(activeTab);
  }, [activeTab, showForm, modalStateDelete]);

  const [packages, setPackages] = useState<any>();
  const getTvPackages = async () => {
    const response = await axiosInstance.get(
      `/tv/packages/${data[providerField]}`
    );
    setPackages(response.data.data);
  };

  const getInternetPlans = async () => {
    const response = await axiosInstance.get(
      `/internet/plans/${data[providerField]}`
    );
    setPackages(response.data.data);
  };

  useEffect(() => {
    if (data[providerField]) {
      if (activeTab === "tv") {
        getTvPackages();
      } else if (activeTab === "internet") {
        getInternetPlans();
      }
    }
  }, [data[providerField]]);

  const packageOptions = packages?.map((sub: any) => ({
    value: sub.id,
    label: sub.name,
  }));

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
                      ? "border-[#A8353A] text-[#A8353A]"
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
              beneficiaries.map((beneficiary, index) => {
                const isClickable = true;
                return (
                  <div
                    key={index}
                    className={`bg-white shadow rounded-lg p-4 flex justify-between items-center border border-gray-200 ${
                      isClickable ? "cursor-pointer" : "cursor-not-allowed"
                    }`}
                  >
                    <div onClick={() => setABeneficiary(beneficiary)}>
                      <p className="text-sm text-gray-800">
                        {beneficiary.alias}
                      </p>
                      <p className="text-gray-600 text-xs">
                        {beneficiary[providerField] || beneficiary.telco}
                      </p>
                      <p className="text-gray-600 text-xs">
                        {beneficiary.number || beneficiary.meterNumber}
                      </p>
                    </div>
                    <div
                      onClick={() => {
                        setModalStateDelete("deleteBeneficiary");
                        setActiveBeneficiary({
                          ...beneficiary,
                          activeTab: activeTab,
                        });
                      }}
                    >
                      <TrashIcon />
                    </div>
                  </div>
                );
              })
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
              Add {activeTab} beneficiary
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
            {/* Display the beneficiary type */}
            <div className="mb-4">
              <span className="text-gray-700 font-medium">
                Add Beneficiary for{" "}
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </span>
            </div>
            {/* Provider select */}
            <div className="relative w-full mt-6">
              <Select
                options={providerOptions}
                value={providerOptions.find(
                  (option) => option.value === data[providerField]
                )}
                onChange={handleSelectChange(providerField)}
                styles={multiSelectStyle}
                placeholder={
                  activeTab === "electricity"
                    ? "Select Disco"
                    : activeTab === "tv"
                    ? "Select TV Provider"
                    : "Select Provider"
                }
                required
              />
            </div>
            {/* Conditional inputs based on activeTab */}
            {activeTab === "airtime" && (
              <>
                <LabelInputComponent
                  type="text"
                  name="number"
                  value={data.number}
                  onChange={handleChange}
                  label="Phone Number"
                  required
                />
                <LabelInputComponent
                  type="text"
                  name="alias"
                  value={data.alias}
                  onChange={handleChange}
                  label="Alias"
                  required
                />
              </>
            )}
            {activeTab === "electricity" && (
              <>
                <LabelInputComponent
                  type="text"
                  name="meterNumber"
                  value={data.meterNumber}
                  onChange={handleChange}
                  label="Meter Number"
                  required
                />
                <div className="mt-6">
                  <Select
                    options={[
                      { value: "prepaid", label: "Prepaid" },
                      { value: "postpaid", label: "Postpaid" },
                    ]}
                    value={[
                      { value: "prepaid", label: "Prepaid" },
                      { value: "postpaid", label: "Postpaid" },
                    ].find((option) => option.value === data.type)}
                    onChange={handleSelectChange("type")}
                    styles={multiSelectStyle}
                    placeholder="Select Prepaid/Postpaid"
                    required
                  />
                </div>

                <LabelInputComponent
                  type="text"
                  name="alias"
                  value={data.alias}
                  onChange={handleChange}
                  label="Alias"
                  required
                />
              </>
            )}
            {activeTab === "internet" && (
              <>
                <div className="relative w-full mt-6">
                  <Select
                    options={packageOptions}
                    value={packageOptions?.find(
                      (option) => option.value === data.plan_id
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
                  value={data.number}
                  onChange={handleChange}
                  label="Phone Number"
                  required
                />

                <LabelInputComponent
                  type="text"
                  name="alias"
                  value={data.alias}
                  onChange={handleChange}
                  label="Alias"
                  required
                />
              </>
            )}
            {activeTab === "tv" && (
              <>
                <div className="relative w-full mt-6">
                  <Select
                    options={packageOptions}
                    value={packageOptions?.find(
                      (option) => option.value === data.plan_id
                    )}
                    onChange={handleSelectChange("plan_id")}
                    styles={multiSelectStyle}
                    placeholder="Select Package"
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

                <LabelInputComponent
                  type="text"
                  name="alias"
                  value={data.alias}
                  onChange={handleChange}
                  label="Alias"
                  required
                />
              </>
            )}
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
