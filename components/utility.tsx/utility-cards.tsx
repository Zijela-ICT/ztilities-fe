import createAxiosInstance from "@/utils/api";
import formatCurrency from "@/utils/formatCurrency";
import Image from "next/image";
import { useState } from "react";

interface CardProps {
  data: Record<string, any>[];
  utility?: any;
  type?: string;
  onClick?: (utility: Record<string, any>) => void;
  toggle?: (utility: Record<string, any>) => void;
}

const SmallerCard = ({ toggle, data, utility, onClick }: CardProps) => (
  <div className="p-4">
    <button
      onClick={() => toggle([])}
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {data?.map((sub, index) => {
        const { providerLogoUrl, name, amount } = sub;
        return (
          <div
            key={index}
            onClick={() => onClick({ ...sub, ...utility })}
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
);

const UtilityCardContainer = ({ type, data, onClick }: CardProps) => {
  const axiosInstance = createAxiosInstance();
  const [utility, setUtility] = useState<any>();

  const [sub, setSub] = useState<any[]>([]);
  const getInternetPlans = async (provider: string) => {
    const response = await axiosInstance.get(`/internet/plans/${provider}`);
    setSub( response.data.data);
  };

  const getTvPackages = async (provider: string) => {
    const response = await axiosInstance.get(`/tv/packages/${provider}`);
    setSub(response.data.data);
  };
  return (
    <>
      {sub.length > 0 ? (
        <SmallerCard
          toggle={() => setSub([])}
          data={sub}
          utility={utility}
          onClick={onClick}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data?.map((utility, index) => {
            const { providerLogoUrl, provider, minAmount } = utility;
            return (
              <div
                key={index}
                onClick={() => {
                  if (type === "internet") {
                    setUtility(utility);
                    getInternetPlans(provider);
                  } else if (type === "tv") {
                    setUtility(utility);
                    getTvPackages(provider);
                  } else {
                    onClick(utility);
                  }
                }}
                className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow-md p-4 m-4 max-w-xs cursor-pointer"
              >
                <Image
                  width={150}
                  height={150}
                  src={ "https://cdn.worldvectorlogo.com/logos/mtn-new-logo.svg"}
                  alt={`${provider} Logo`}
                  className=" rounded-full "
                />
                <div className="mt-4">
                  <h3 className="text-xl font-semibold">{provider}</h3>
                  {minAmount && (
                    <p className="text-gray-700">Minimum Amount: {minAmount}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default UtilityCardContainer;
