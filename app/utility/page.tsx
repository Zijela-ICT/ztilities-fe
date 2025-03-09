"use client";

import { JSX, useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout-component";
import ModalCompoenent, {
  ActionModalCompoenent,
  SuccessModalCompoenent,
} from "@/components/modal-component";
import withPermissions from "@/components/auth/permission-protected-routes";
import PermissionGuard from "@/components/auth/permission-protected-components";
import { useDataPermission } from "@/context";
import createAxiosInstance from "@/utils/api";
import UtilityCardContainer from "@/components/utility.tsx/utility-cards";
import ElectricityFlow from "@/components/utility.tsx/electricity-prgress-form";
import AirtimeFlow from "@/components/utility.tsx/airtime-prgress-form";
import InternetFlow from "@/components/utility.tsx/internet-prgress-form";
import TVFlow from "@/components/utility.tsx/tv-prgress-form";
import Benfeciaries from "@/components/utility.tsx/benficiaries";
import { useRouter } from "next/navigation";

function UtilityManagement() {
  const axiosInstance = createAxiosInstance();
  const {
    user,
    pagination,
    setPagination,
    searchQuery,
    filterQuery,
    clearSearchAndPagination,
  } = useDataPermission();
  const router = useRouter();
  const tabs = ["Electricity", "Airtime", "Internet", "TV Subscription"];

  const [successState, setSuccessState] = useState({
    title: "",
    detail: "",
    status: false,
  });

  const [electricity, setElectricity] = useState<any[]>([]);
  const [airtime, setAirtime] = useState<any[]>([]);
  const [internet, setInternet] = useState<any[]>([]);
  const [tvSubscription, setTvSubscription] = useState<any[]>([]);

  const [beneficiaryObj, setABeneficiary] = useState<any>(null);

  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [centralState, setCentralState] = useState<string>();

  const [activeBeneficiary, setActiveBeneficiary] = useState<any>(null);
  const [beneficiaryState, setBeneficiaryState] = useState<string>();

  const [utility, setUtility] = useState<any>();
  const [centralStateDelete, setCentralStateDelete] = useState<string>();

  const getElectricity = async () => {
    const response = await axiosInstance.get(`/electricity/providers`);
    setElectricity(response.data.data);
  };

  const getAirtime = async () => {
    const response = await axiosInstance.get(`/airtime/telcos`);
    setAirtime(response.data.data);
  };

  const getInternet = async () => {
    const response = await axiosInstance.get(`/internet/telcos`);
    setInternet(response.data.data);
  };

  const getTvSubscription = async () => {
    const response = await axiosInstance.get(`/tv/providers`);
    setTvSubscription(response.data.data);
  };

  const deleteABeneficiary = async () => {
    await axiosInstance.delete(
      `/users/${user.id}/beneficiaries?type=${
        activeBeneficiary.activeTab
      }&number=${activeBeneficiary.number || activeBeneficiary.meterNumber}`
    );
    setCentralStateDelete("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully deleted this beneficiary",
      status: true,
    });
  };

  const [PINState, setPINState] = useState<string>();
  const [code, setCode] = useState(Array(4).fill("")); // Array to hold each digit
  // Handle changes for each input box
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Only allow numbers
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Automatically focus the next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-input-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      prevInput?.focus();
    }
  };
  // Mapping centralState values to components
  const componentMap: Record<string, JSX.Element> = {
    electricityFlow: (
      <ElectricityFlow
        electricity={electricity}
        utility={utility}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        setBeneficiaryState={setBeneficiaryState}
        beneficiaryObj={beneficiaryObj}
        setPINState={setPINState}
        code={code}
        setCode={setCode}
      />
    ),
    airtimeFlow: (
      <AirtimeFlow
        airtime={airtime}
        utility={utility}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        setBeneficiaryState={setBeneficiaryState}
        beneficiaryObj={beneficiaryObj}
        setPINState={setPINState}
        code={code}
        setCode={setCode}
      />
    ),
    enterPIN: (
      <div className="flex gap-1 justify-between pt-6 pb-8 px-10 ">
        {code.map((digit, index) => (
          <input
            key={index}
            id={`code-input-${index}`}
            type="text"
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            maxLength={1}
            className="w-12 h-12 text-center bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ))}
      </div>
    ),

    ben: (
      <Benfeciaries
        airtime={airtime}
        electricity={electricity}
        tv={tvSubscription}
        internet={internet}
        utility={utility}
        setABeneficiary={(obj) => {
          setABeneficiary(obj);
          setBeneficiaryState("");
        }}
        setActiveBeneficiary={(obj) => setActiveBeneficiary(obj)}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        setModalStateDelete={setCentralStateDelete}
        modalStateDelete={centralStateDelete}
        setBeneficiaryState={setBeneficiaryState}
      />
    ),
  };

  useEffect(() => {}, [centralStateDelete]);

  const tabPermissions = {
    Electricity: ["read_electricity:providers"],
    Airtime: ["read_airtime:telcos"],
    Internet: ["read_internet:telcos"],
    "TV Subscription": ["read_tv:providers"],
  };

  const { userPermissions } = useDataPermission();

  const getDefaultTab = () => {
    const userPermissionStrings = userPermissions.map(
      (perm) => perm.permissionString
    );

    return tabs.find((tab) =>
      (tabPermissions[tab] || []).every((permission) =>
        userPermissionStrings.includes(permission)
      )
    );
  };

  const [selectedTab, setSelectedTab] = useState<string>(getDefaultTab() || "");

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        getElectricity(),
        getAirtime(),
        getInternet(),
        getTvSubscription(),
      ]);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedTab === "Electricity") {
        await getElectricity();
      } else if (selectedTab === "Airtime") {
        await getAirtime();
      } else if (selectedTab === "Internet") {
        await getInternet();
      } else if (selectedTab === "TV Subscription") {
        await getTvSubscription();
      }
    };

    fetchData();
  }, [
    // centralState,
    // centralStateDelete,
    selectedTab,
    pagination.currentPage,
    searchQuery,
    filterQuery,
  ]);

  //new clear
  useEffect(() => {
    clearSearchAndPagination();
  }, [selectedTab]);

  return (
    <DashboardLayout title="Utilities" detail="Manage all utilities here">
      <SuccessModalCompoenent
        title={successState.title}
        detail={successState.detail}
        modalState={successState.status}
        setModalState={(state: boolean) =>
          setSuccessState((prevState) => ({ ...prevState, status: state }))
        }
      ></SuccessModalCompoenent>

      <ActionModalCompoenent
        title={"Delete beneficiary"}
        detail={"Do you want to delete this beneficiary?"}
        modalState={centralStateDelete}
        setModalState={setCentralStateDelete}
        takeAction={
          centralStateDelete === "deleteBeneficiary" ? deleteABeneficiary : null
        }
      ></ActionModalCompoenent>

      <ModalCompoenent
        title={"Utilities"}
        detail={"Pay for your utilities here"}
        modalState={centralState}
        setModalState={() => {
          setCentralState("");
          setABeneficiary("");
          setActiveRowId(null);
        }}
      >
        {componentMap[centralState]}
      </ModalCompoenent>

      <ModalCompoenent
        width="max-w-sm"
        title={"Enter your PIN"}
        detail={""}
        modalState={PINState}
        setModalState={() => {
          setPINState("");
          setCode(Array(4).fill(""));
        }}
      >
        {componentMap[PINState]}
      </ModalCompoenent>

      <ModalCompoenent
        title={"Beneficiaries"}
        detail={""}
        modalState={beneficiaryState}
        className="absolute z-40 top-5 right-5 w-full max-w-lg h-[60vh] overflow-y-auto p-0 "
        setModalState={() => {
          setBeneficiaryState("");
          setActiveRowId(null);
        }}
      >
        {componentMap[beneficiaryState]}
      </ModalCompoenent>

      <PermissionGuard
        requiredPermissions={[
          "read_tv:providers",
          "read_internet:telcos",
          "read_airtime:telcos",
          "read_electricity:providers",
        ]}
      >
        <div className="relative bg-white rounded-2xl p-4">
          <div className="overflow-x-auto whitespace-nowrap pb-2">
            <div className="flex space-x-4 ">
              {tabs.map((tab) => (
                <PermissionGuard
                  key={tab}
                  requiredPermissions={tabPermissions[tab] || []} // Match tab to permissions
                >
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`relative text-gray-500 hover:text-gray-900 px-4 py-2 text-xs font-medium focus:outline-none group ${
                      selectedTab === tab
                        ? "text-[#A8353A] font-semibold" // Active tab styles
                        : ""
                    }`}
                  >
                    {tab}
                    {selectedTab === tab && (
                      <span className="absolute left-0 bottom-[-5px] w-full h-[2px] bg-[#A8353A]"></span>
                    )}
                  </button>
                </PermissionGuard>
              ))}
            </div>
          </div>
        </div>
      </PermissionGuard>

      <PermissionGuard
        requiredPermissions={[
          "read_tv:providers",
          "read_internet:telcos",
          "read_airtime:telcos",
          "read_electricity:providers",
        ]}
      >
        <div className="relative bg-white rounded-2xl p-4 mt-4">
          {selectedTab === "Electricity" && (
            <>
              <UtilityCardContainer
                data={electricity}
                onClick={(utility) => {
                  setCentralState("electricityFlow");
                  setUtility("electricity");
                }}
              />
            </>
          )}
          {selectedTab === "TV Subscription" && (
            <>
              <UtilityCardContainer
                data={tvSubscription}
                type="tv"
                onClick={(utility) =>
                  router.push(`/utility/tv/${utility.provider}`)
                }
              />
            </>
          )}
          {selectedTab === "Airtime" && (
            <>
              <UtilityCardContainer
                data={airtime}
                onClick={(utility) => {
                  setCentralState("airtimeFlow");
                  setUtility("airtime");
                }}
              />
            </>
          )}
          {selectedTab === "Internet" && (
            <>
              <UtilityCardContainer
                data={internet}
                type="internet"
                onClick={(utility) =>
                  router.push(`/utility/internet/${utility.provider}`)
                }
              />
            </>
          )}
        </div>
      </PermissionGuard>
    </DashboardLayout>
  );
}

export default withPermissions(UtilityManagement, [
  "electricity",
  "airtime",
  "internet",
  "tv",
]);
