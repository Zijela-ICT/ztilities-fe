"use client";

import { useDataPermission } from "@/context";
import { DropDownArrow, TrashIcon } from "@/utils/svg";
import moment from "moment";
import React from "react";

interface FacilityDetailsProps {
  title?: string;
  facility?: Record<string, any>;
  excludedKeys?: string[]; // Array of keys to omit
  toggleActions?: any;
  setModalStateDelete?: any;
}

export default function FacilityDetails({
  title,
  facility,
  toggleActions,
  setModalStateDelete,
  excludedKeys = [
    "facility",
    "block",
    "id",
    // "createdAt",
    "updatedAt",
    "workOrderNumber",
  ],
}: FacilityDetailsProps) {
  const { user, userRoles } = useDataPermission();
  const hasTenantRole = userRoles.some(
    (role: Role) => role.name === "TENANT_ROLE"
  );

  const hasThisRole = userRoles.some(
    (role: Role) =>
      role.name === "TENANT_ROLE" ||
      role.name === "VENDOR_ROLE" ||
      role.name === "TECHNICIAN_ROLE"
  );

  const filteredExcludedKeys =
    title === "Transactions"
      ? excludedKeys.filter((key) => key !== "facility")
      : title === "Work Order"
      ? excludedKeys.filter(
          (key) =>
            key !== "createdAt" &&
            key !== "updatedAt" &&
            key !== "workOrderNumber"
        )
      : excludedKeys;

  return (
    <>
      {Object.entries(facility || {}).length > 0 ? (
        <>
          {" "}
          <div className="max-w-full mx-auto space-y-6">
            {/* Card for Facility Details */}
            <div className={"bg-white p-6 shadow-lg rounded-lg"}>
              <div className="space-y-3 text-gray-600">
                {Object.entries(facility || {})
                  .filter(([key]) => !filteredExcludedKeys.includes(key))
                  .map(([key, value], index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b border-gray-200 py-2"
                    >
                      <p className="text-gray-500 capitalize">
                        {key === "user"
                          ? "client"
                          : key.replace(/([a-z])([A-Z])/g, "$1 $2")}
                      </p>

                      <p className="text-gray-900">
                        {key === "user" ||
                        (key === "requestedBy" &&
                          value !== null &&
                          typeof value === "object") ? (
                          `${value?.firstName || "-"} ${value?.lastName || "-"}`
                        ) : key === "unit" &&
                          value !== null &&
                          typeof value === "object" ? (
                          `${value?.unitNumber || "-"}`
                        ) : key === "wallet" &&
                          value !== null &&
                          typeof value === "object" ? (
                          `${value?.walletID || "-"}`
                        ) : key === "category" &&
                          value !== null &&
                          typeof value === "object" ? (
                          `${value?.categoryName || "-"}`
                        ) : key === "facility" &&
                          value !== null &&
                          typeof value === "object" ? (
                          `${value?.name || "-"}`
                        ) : key === "purchaseOrderFileUrl" ||
                          (key === "paymentURL" && value !== null) ? (
                          <>
                            {value ? (
                              <a
                                className="px-3 py-2 bg-red-600 text-white text-xs rounded-lg shadow-md inline-block hover:bg-red-700 transition-colors"
                                href={value}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View{" "}
                                {key
                                  .replace(/([a-z])([A-Z])/g, "$1 $2")
                                  .toLowerCase()}{" "}
                                pdf
                              </a>
                            ) : (
                              <p>-</p>
                            )}
                          </>
                        ) : (key === "assignedVendor" ||
                            key === "assignedTechnician") &&
                          value !== null &&
                          typeof value === "object" ? (
                          `${
                            value?.vendorName ||
                            value?.technician?.technicianName ||
                            "-"
                          }`
                        ) : key === "asset" &&
                          value !== null &&
                          typeof value === "object" ? (
                          `${value?.assetName || "-"}`
                        ) : key === "addedBy" &&
                          value !== null &&
                          typeof value === "object" ? (
                          `${value?.firstName || "-"} ${
                            value?.lastName || "-"
                          } `
                        ) : key === "createdAt" ||
                          (key === "updatedAt" && value !== null) ? (
                          `${moment.utc(value[key]).format("LL")} `
                        ) : Array.isArray(value) ? (
                          value.length
                        ) : typeof value === "object" && value !== null ? (
                          JSON.stringify(value)
                        ) : value !== null && value !== undefined ? (
                          String(value)
                        ) : (
                          "-"
                        )}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Card for Additional Details */}
            {title === "Work Request" ||
            title === "Bills" ||
            title === "Work Order" ||
            title === "Category" ||
            title === "Payments" ||
            title === "Transactions" ||
            title === "Power Charge" ? (
              <div
                className={`bg-white p-6 ${
                  facility &&
                  Object.values(facility).some((value) =>
                    Array.isArray(value)
                  ) &&
                  "shadow-lg"
                }  rounded-lg`}
              >
                <div className="space-y-5 text-gray-600">
                  {Object.entries(facility || {})
                    .filter(
                      ([key, value]) =>
                        Array.isArray(value) &&
                        (!hasTenantRole ||
                          ![
                            "activities",
                            "quotations",
                            "approvals",
                            "apportionmentDetails",
                          ].includes(key))
                    )
                    .map(([key, array], index) => {
                      let filteredArray = array;
                      if (key === "comments") {
                        if (hasThisRole) {
                          filteredArray = array.filter(
                            (comment: any) => comment.isInternal !== true
                          );
                        }
                      }
                      return (
                        <details
                          key={index}
                          className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-5 relative group mt-4"
                        >
                          <summary className="flex justify-between items-center text-base font-semibold cursor-pointer">
                            {key
                              .replace(/([a-z])([A-Z])/g, "$1 $2")
                              .charAt(0)
                              .toUpperCase() +
                              key.replace(/([a-z])([A-Z])/g, "$1 $2").slice(1)}
                            <span className="transform transition-transform duration-100 group-open:rotate-180">
                              <DropDownArrow />
                            </span>
                          </summary>

                          <div className="mt-3 space-y-3">
                            {filteredArray.length > 0 ? (
                              filteredArray.map((item, idx) => (
                                <details
                                  key={idx}
                                  className="bg-white border border-gray-200 rounded-lg px-4 py-5 relative group mt-4"
                                >
                                  {key === "comments" &&
                                    user.id === item?.user?.id && (
                                      <div
                                        className="absolute right-12 top-6 cursor-pointer"
                                        onClick={() => {
                                          toggleActions(item.commentId);
                                          setModalStateDelete("deleteComment");
                                        }}
                                      >
                                        <TrashIcon />
                                      </div>
                                    )}

                                  <summary className="flex justify-between items-center text-base font-semibold cursor-pointer">
                                    {typeof item === "string"
                                      ? item
                                      : item.action ??
                                        item.assetName ??
                                        item.walletType ??
                                        item.guestName ??
                                        item.unit?.unitNumber ??
                                        item?.vendor?.vendorName ??
                                        item?.subCategoryName ??
                                        item?.technician?.technicianName ??
                                        (item.user?.firstName &&
                                          item.user?.lastName &&
                                          `${item.user.firstName} ${item.user.lastName}`) ??
                                        key
                                          .replace(/([a-z])([A-Z])/g, "$1 $2")
                                          .replace(/^./, (str) =>
                                            str.toUpperCase()
                                          ) +
                                          " " +
                                          (idx + 1)}
                                    <span className="transform transition-transform duration-100 group-open:rotate-180">
                                      <DropDownArrow />
                                    </span>
                                  </summary>

                                  <div className="mt-2 space-y-2">
                                    {typeof item === "object" &&
                                    item !== null ? (
                                      Object.entries(item).map(
                                        ([subKey, subValue]) => (
                                          <div
                                            key={subKey}
                                            className="flex flex-col"
                                          >
                                            <span className="text-sm text-gray-500 capitalize">
                                              {subKey.replace(
                                                /([a-z])([A-Z])/g,
                                                "$1 $2"
                                              )}
                                            </span>
                                            {(subKey === "file" ||
                                              subKey === "invoice") &&
                                            typeof subValue === "string" ? (
                                              <a
                                                href={subValue}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 underline"
                                              >
                                                View File
                                              </a>
                                            ) : subKey === "createdAt" ||
                                              subKey === "updatedAt" ? (
                                              moment.utc(subValue).format("LL")
                                            ) : typeof subValue === "object" &&
                                              subValue !== null ? (
                                              Array.isArray(subValue) ? (
                                                <p className="text-gray-900">
                                                  Array: {subValue.length} items
                                                </p>
                                              ) : (
                                                //   <ul className="list-disc ml-5">
                                                //   {subValue.map((arrItem, i) => (
                                                //     <li key={i}>
                                                //       {typeof arrItem === "object" && arrItem !== null
                                                //         ? JSON.stringify(arrItem)
                                                //         : String(arrItem)}
                                                //     </li>
                                                //   ))}
                                                // </ul>
                                                <div className="pl-4 mt-2 border-l-2 border-gray-300">
                                                  {Object.entries(subValue)
                                                    .filter(([nestedKey]) =>
                                                      [
                                                        "firstName",
                                                        "lastName",
                                                        "vendorName",
                                                        "technicianName",
                                                        "email",
                                                        "unitNumber",
                                                        "description",
                                                      ].includes(nestedKey)
                                                    )
                                                    .map(
                                                      ([
                                                        nestedKey,
                                                        nestedValue,
                                                      ]) => (
                                                        <div
                                                          key={nestedKey}
                                                          className="flex items-center space-x-2"
                                                        >
                                                          <span className="text-sm text-gray-600 capitalize">
                                                            {nestedKey.replace(
                                                              /([a-z])([A-Z])/g,
                                                              "$1 $2"
                                                            )}
                                                            :
                                                          </span>
                                                          <span className="text-gray-800">
                                                            {nestedValue !==
                                                              null &&
                                                            nestedValue !==
                                                              undefined
                                                              ? String(
                                                                  nestedValue
                                                                )
                                                              : "-"}
                                                          </span>
                                                        </div>
                                                      )
                                                    )}
                                                </div>
                                              )
                                            ) : (
                                              <span className="text-gray-900">
                                                {subValue !== null &&
                                                subValue !== undefined
                                                  ? String(subValue)
                                                  : "-"}
                                              </span>
                                            )}
                                          </div>
                                        )
                                      )
                                    ) : (
                                      <p className="text-gray-900">
                                        {item !== null && item !== undefined
                                          ? String(item)
                                          : "-"}
                                      </p>
                                    )}
                                  </div>
                                </details>
                              ))
                            ) : (
                              <p className="text-gray-500">
                                No items available
                              </p>
                            )}
                          </div>
                        </details>
                      );
                    })}
                </div>
              </div>
            ) : (
              <div
                className={`bg-white p-6 ${
                  facility &&
                  Object.values(facility).some((value) =>
                    Array.isArray(value)
                  ) &&
                  "shadow-lg"
                } rounded-lg`}
              >
                {Object.entries(facility || {})
                  .filter(
                    ([key, value]) => Array.isArray(value) && key !== "bills"
                  )
                  .map(([key, array], index) => (
                    <details
                      key={index}
                      className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-5 relative group mt-4"
                    >
                      <summary className="flex justify-between items-center text-base font-semibold cursor-pointer">
                        {key
                          .replace(/([a-z])([A-Z])/g, "$1 $2")
                          .charAt(0)
                          .toUpperCase() +
                          key.replace(/([a-z])([A-Z])/g, "$1 $2").slice(1)}
                        <span className="transform transition-transform duration-100 group-open:rotate-180">
                          <DropDownArrow />
                        </span>
                      </summary>
                      <nav className="mt-4 pt-9 pb-6 border-t border-gray-300">
                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {array?.map((item, idx) => (
                            <li
                              key={idx}
                              className="flex items-start space-x-3"
                            >
                              {typeof item === "object" &&
                              !Array.isArray(item) ? (
                                <details className="w-full">
                                  <summary className="flex items-center text-sm font-medium cursor-pointer">
                                    {item.blockNumber ??
                                      item.assetName ??
                                      item.unitNumber ??
                                      item.title ??
                                      (item.firstName && item.lastName
                                        ? item.firstName + " " + item.lastName
                                        : item.walletType +
                                          " ₦" +
                                          item.balance)}
                                    {item.units && item.units.length > 0 && (
                                      <span className="transform transition-transform duration-100 ml-3">
                                        <DropDownArrow />
                                      </span>
                                    )}
                                  </summary>
                                  {item.units && item.units.length > 0 && (
                                    <ul className="mt-3 ml-4 pl-3 border-l border-gray-300 space-y-2">
                                      {item.units.map((unit, subIdx) => (
                                        <li key={subIdx}>
                                          <span className="text-sm text-gray-700">
                                            {unit.unitNumber}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </details>
                              ) : (
                                <span
                                  className="text-sm text-gray-700 flex-1 overflow-hidden overflow-ellipsis whitespace-normal"
                                  title={item}
                                >
                                  {item}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </nav>
                    </details>
                  ))}
              </div>
            )}
          </div>{" "}
        </>
      ) : (
        <>
          <div className="bg-white p-6 shadow-md rounded-2xl border border-gray-200 flex flex-col items-center justify-center text-gray-600 text-lg font-semibold min-h-[150px] transition-all duration-300 hover:shadow-xl">
            <svg
              className="w-12 h-12 text-gray-400 mb-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 8.75h4.5m-4.5 4.5h4.5M5.75 21h12.5a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5.75a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2Z"
              />
            </svg>
            <p>Nothing to see here yet...</p>
          </div>
        </>
      )}
    </>
  );
}
