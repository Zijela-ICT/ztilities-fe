import createAxiosInstance from "@/utils/api";
import formatCurrency from "@/utils/formatCurrency";
import Image from "next/image";
import { useState } from "react";

interface CardProps {
  data: Record<string, any>[];
  utility?: any;
  type?: string;
  onClick?: (any: any) => void;
  toggle?: (utility: Record<string, any>) => void;
}

const UtilityCardContainer = ({ type, data, onClick }: CardProps) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.map((utility, index) => {
          const { providerLogoUrl, provider, minAmount } = utility;
          return (
            <div
              key={index}
              onClick={() => {
                onClick(utility);
              }}
              className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow-md p-4 m-4 max-w-xs cursor-pointer"
            >
              <Image
                width={150}
                height={150}
                src={"https://cdn.worldvectorlogo.com/logos/mtn-new-logo.svg"}
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
    </>
  );
};

export default UtilityCardContainer;
