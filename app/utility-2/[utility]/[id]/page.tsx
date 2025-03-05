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

function WorkRequests() {
  const axiosInstance = createAxiosInstance();
  const { user, setUser, setUserPermissions } = useDataPermission();
  const router = useRouter();
  const { utility, id } = useParams();

  console.log(utility);
  const [successState, setSuccessState] = useState({
    title: "",
    detail: "",
    status: false,
  });

  const [activeUtility, setActiveUtility] = useState<string>();

  const [centralState, setCentralState] = useState<string>();
  const [centralStateDelete, setCentralStateDelete] = useState<string>();

  const [beneficiaryState, setBeneficiaryState] = useState<string>();

  const [beneficiaryObj, setABeneficiary] = useState<any>(null);

  const [sub, setSub] = useState<any>();

  const [internet, setInternet] = useState<any[]>([]);
  const [tvSubscription, setTvSubscription] = useState<any[]>([]);
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

  useEffect(() => {
    getInternet();
    getTvSubscription();
  }, []);
  useEffect(() => {
    if (utility === "internet") {
      getInternetPlans();
    } else {
      getTvPackages();
    }
  }, [utility]);

  const componentMap: Record<string, JSX.Element> = {
    tvFlow: (
      <TVFlow
        tv={tvSubscription}
        utility={activeUtility}
        sub={sub}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        setBeneficiaryState={setBeneficiaryState}
        beneficiaryObj={beneficiaryObj}
      />
    ),

    internetFlow: (
      <InternetFlow
        internet={internet}
        utility={activeUtility}
        sub={sub}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        setBeneficiaryState={setBeneficiaryState}
        beneficiaryObj={beneficiaryObj}
      />
    ),
    // ben: (
    //   <Benfeciaries
    //     airtime={airtime}
    //     electricity={electricity}
    //     tv={tvSubscription}
    //     internet={internet}
    //     utility={utility}
    //     setABeneficiary={(obj) => {
    //       setABeneficiary(obj);
    //       setBeneficiaryState("");
    //     }}
    //     setActiveBeneficiary={(obj) => setActiveBeneficiary(obj)}
    //     activeRowId={activeRowId}
    //     setModalState={setCentralState}
    //     setSuccessState={setSuccessState}
    //     setModalStateDelete={setCentralStateDelete}
    //     modalStateDelete={centralStateDelete}
    //     setBeneficiaryState={setBeneficiaryState}
    //   />
    // ),
  };

  return (
    <DashboardLayout
      title={`${id} Package`}
      detail={`Select a ${id} package`}
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

      {/* <ActionModalCompoenent
        title={"Delete beneficiary"}
        detail={"Do you want to delete this beneficiary?"}
        modalState={centralStateDelete}
        setModalState={setCentralStateDelete}
        takeAction={
          centralStateDelete === "deleteBeneficiary" ? deleteABeneficiary : null
        }
      ></ActionModalCompoenent> */}

      <ModalCompoenent
        title={`${id} `}
        detail={`Pay for your utilities your ${utility} ${
          utility === "internet" ? "plan " : "package"
        } here`}
        modalState={centralState}
        setModalState={() => {
          setCentralState("");
          // setABeneficiary("");
          // setActiveRowId(null);
        }}
      >
        {componentMap[centralState]}
      </ModalCompoenent>

      <ModalCompoenent
        title={"Beneficiaries"}
        detail={""}
        modalState={beneficiaryState}
        setModalState={() => {
          setBeneficiaryState("");
          // setActiveRowId(null);
        }}
      >
        {componentMap[beneficiaryState]}
      </ModalCompoenent>

      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sub?.map((sub, index) => {
            const { providerLogoUrl, name, amount } = sub;
            return (
              <div
                key={index}
                onClick={() => {
                  console.log({ ...sub, provider: id });
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
                <div className="bg-[#A8353A] rounded-t-xl h-10 pt-3">
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

export default withPermissions(WorkRequests, ["power-charges"]);
