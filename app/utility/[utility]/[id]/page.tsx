"use client";

import { JSX, useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout-component";
import withPermissions from "@/components/auth/permission-protected-routes";

import { useDataPermission } from "@/context";

import { useParams, useRouter } from "next/navigation";
import createAxiosInstance from "@/utils/api";
import FacilityDetails from "@/components/facility-management/view-facility";
import formatCurrency from "@/utils/formatCurrency";
import ModalCompoenent, {
  ActionModalCompoenent,
  SuccessModalCompoenent,
} from "@/components/modal-component";
import InternetFlow from "@/components/utility.tsx/internet-prgress-form";
import TVFlow from "@/components/utility.tsx/tv-prgress-form";
import Benfeciaries from "@/components/utility.tsx/benficiaries";

function WorkRequests() {
  const axiosInstance = createAxiosInstance();
  const { user, setUser, setUserPermissions } = useDataPermission();
  const router = useRouter();
  const { utility, id }: any = useParams();

  const [successState, setSuccessState] = useState({
    title: "",
    detail: "",
    status: false,
  });

  const [activeUtility, setActiveUtility] = useState<string>();

  const [centralState, setCentralState] = useState<string>();
  const [centralStateDelete, setCentralStateDelete] = useState<string>();

  const [activeBeneficiary, setActiveBeneficiary] = useState<any>(null);
  const [beneficiaryState, setBeneficiaryState] = useState<string>();

  const [beneficiaryObj, setABeneficiary] = useState<any>(null);

  const [sub, setSub] = useState<any>();

  const [electricity, setElectricity] = useState<any[]>([]);
  const [airtime, setAirtime] = useState<any[]>([]);
  const [internet, setInternet] = useState<any[]>([]);
  const [tvSubscription, setTvSubscription] = useState<any[]>([]);

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

  const getInternetPlans = async () => {
    const response = await axiosInstance.get(`/internet/plans/${id}`);
    setSub(response.data.data);
  };

  const getTvPackages = async () => {
    const response = await axiosInstance.get(`/tv/packages/${id}`);
    setSub(response.data.data);
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

  useEffect(() => {
    getInternet();
    getTvSubscription();
    getAirtime();
    getElectricity();
  }, []);
  useEffect(() => {
    if (utility === "internet") {
      getInternetPlans();
    } else {
      getTvPackages();
    }
  }, [utility]);

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

  const componentMap: Record<string, JSX.Element> = {
    tvFlow: (
      <TVFlow
        tv={tvSubscription}
        utility={activeUtility}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        setBeneficiaryState={setBeneficiaryState}
        beneficiaryObj={beneficiaryObj}
        setPINState={setPINState}
        code={code}
        setCode={setCode}
      />
    ),

    internetFlow: (
      <InternetFlow
        internet={internet}
        utility={activeUtility}
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

  // colors for our stuff
  const providerColors = {
    GLO: "#008000", // Green
    MTN: "#FFCC00", // Yellow
    AIRTEL: "#E30613", // Red
    "9MOBILE": "#0A7E07", // Dark Green

    DSTV: "#005BAC", // Blue
    SHOWMAX: "#000000", // Black
    STARTIMES: "#FF6600", // Orange
    GOTV: "#CE1126", // Red
  };

  return (
    <DashboardLayout
      title={`${id} ${utility === "internet" ? "plans" : "packages"}`}
      detail={`Select a ${id} ${utility === "internet" ? "plans" : "packages"}`}
      dynamic
      onclick={() => router.back()}
    >
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
        title={`${id} `}
        detail={`Pay for your utilities your ${utility} ${
          utility === "internet" ? "plan " : "package"
        } here`}
        modalState={centralState}
        setModalState={() => {
          setCentralState("");
          setABeneficiary("");
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
        detail={`Beneficiaries for ${utility} `}
        modalState={beneficiaryState}
        className="fixed z-40 top-5 right-5 w-full max-w-lg h-[70vh] overflow-y-auto p-0 "
        setModalState={() => {
          setBeneficiaryState("");
        }}
      >
        {componentMap[beneficiaryState]}
      </ModalCompoenent>

      <div className="p-4">
        <div className="max-h-[100vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sub?.map((sub, index) => {
            const { providerLogoUrl, name, amount } = sub;
            return (
              <div
                key={index}
                onClick={() => {
                  if (utility === "internet") {
                    setCentralState("internetFlow");
                    setActiveUtility({ ...sub, provider: id });
                  } else {
                    setCentralState("tvFlow");
                    setActiveUtility({ ...sub, provider: id });
                  }
                }}
                className="bg-white border border-gray-200 rounded-xl shadow-sm cursor-pointer transition duration-300 ease-in-out"
              >
                <div
                  className={`rounded-t-xl h-10 pt-3`}
                  style={{ backgroundColor: providerColors[id] || "#A8353A" }}
                >
                  <p className="text-white text-xs ml-6">
                    Amount: ₦ {formatCurrency(amount)}
                  </p>
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-xs font-bold text-gray-800">{name}</h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default withPermissions(WorkRequests, [
  "electricity",
  "airtime",
  "internet",
  "tv",
]);
