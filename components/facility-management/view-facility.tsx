"use client";

import { useDataPermission } from "@/context";
import formatCurrency from "@/utils/formatCurrency";
import { DropDownArrow } from "@/utils/svg";
import moment from "moment";
import Link from "next/link";
import React from "react";

interface FacilityDetailsProps {
  title?: string;
  facility?: Record<string, any>;
  groupedPermissions?: Record<
    string,
    { id: string; normalizedString: string; units: any[] }[]
  >;
  excludedKeys?: string[]; // Array of keys to omit
}

export default function FacilityDetails({
  title,
  facility,
  excludedKeys = [
    "facility",
    "block",
    "id",
    "createdAt",
    "updatedAt",
    "workOrderNumber",
  ],
}: FacilityDetailsProps) {
  const { userRoles } = useDataPermission();
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
      {/* Dynamically render facility details, omitting excluded keys */}
      <div className="space-y-3 px-1 text-gray-500">
        {Object.entries(facility || {})
          .filter(([key]) => !filteredExcludedKeys.includes(key)) // Filter out excluded keys
          .map(([key, value], index) => (
            <div key={index} className="flex items-center justify-between">
              {/* Dynamically format the key */}
              <p className="text-gray-500 capitalize">
                {key === "user"
                  ? "client"
                  : key.replace(/([a-z])([A-Z])/g, "$1 $2")}
              </p>

              {/* Handle various value types */}
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
                ) : key === "facility" &&
                  value !== null &&
                  typeof value === "object" ? (
                  `${value?.name || "-"}`
                ) : key === "purchaseOrderFileUrl" && value !== null ? (
                  <>
                    {value ? (
                      <a
                        className="px-3 py-2 bg-[#A8353A] text-white text-xs rounded-lg shadow-md inline-block hover:animate-tilt"
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Purchase Order PDF
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
                  `${value?.firstName || "-"} ${value?.lastName || "-"} `
                ) : key === "createdAt" ||
                  (key === "updatedAt" && value !== null) ? (
                  `${moment.utc(value[key]).format("LL")} `
                ) : Array.isArray(value) ? (
                  value.length // Show array length
                ) : typeof value === "object" && value !== null ? (
                  JSON.stringify(value) // Show object as a JSON string
                ) : value !== null && value !== undefined ? (
                  String(value) // Convert other types to string
                ) : (
                  "-"
                )}
              </p>
            </div>
          ))}
      </div>

      {/* for request */}
      {title === "Work Request" ||
      title === "Bills" ||
      title === "Work Order" ||
      title === "Category" ||
      title === "Power Charge" ? (
        <>
          {" "}
          <div className="space-y-5 px-2 text-gray-500">
            {Object.entries(facility || {})
              // .filter(([key, value]) => Array.isArray(value)  && (!hasTenantRole || key !== "activities")) // Only keys with array values
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
                //this handles the isinternal kini
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
                    className="border border-gray-200 rounded-lg px-4 py-5 relative group mt-4"
                  >
                    {/* Title as a Toggle */}
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
                      {/* Check if Array has Items */}
                      {filteredArray.length > 0 ? (
                        filteredArray.map((item, idx) => (
                          <details
                            key={idx}
                            className="border border-gray-200 rounded-lg px-4 py-5 relative group mt-4"
                          >
                            <summary className="flex justify-between items-center text-base font-semibold cursor-pointer">
                              {/* {key
                                .replace(/([a-z])([A-Z])/g, "$1 $2")
                                .charAt(0)
                                .toUpperCase() +
                                key
                                  .replace(/([a-z])([A-Z])/g, "$1 $2")
                                  .slice(1)}{" "}
                              {idx + 1} */}

                              {item.action ??
                                item.assetName ??
                                item.walletType ??
                                item?.vendor?.vendorName ??
                                item?.technician?.technicianName ??
                                (item.user?.firstName &&
                                  item.user?.lastName &&
                                  item.user?.firstName +
                                    " " +
                                    item.user?.lastName) ??
                                key
                                  .replace(/([a-z])([A-Z])/g, "$1 $2")
                                  .replace(/^./, (str) => str.toUpperCase()) + // Capitalize first letter
                                  " " +
                                  (idx + 1)}

                              <span className="transform transition-transform duration-100 group-open:rotate-180">
                                <DropDownArrow />
                              </span>
                            </summary>

                            <div className="mt-2 space-y-2">
                              {/* Recursively Map Over Object */}
                              {typeof item === "object" && item !== null ? (
                                Object.entries(item).map(
                                  ([subKey, subValue]) => (
                                    <div key={subKey} className="flex flex-col">
                                      <span className="text-sm text-gray-500 capitalize">
                                        {subKey.replace(
                                          /([a-z])([A-Z])/g,
                                          "$1 $2"
                                        )}
                                      </span>

                                      {/* Check if Key is 'file' */}
                                      {subKey === "file" &&
                                      typeof subValue === "string" ? (
                                        <a
                                          href={subValue}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-500 underline"
                                        >
                                          View File
                                        </a>
                                      ) : typeof subValue === "object" &&
                                        subValue !== null ? (
                                        Array.isArray(subValue) ? (
                                          <p className="text-gray-900">
                                            Array: {subValue.length} items
                                          </p>
                                        ) : (
                                          <div className="pl-4 mt-2 border-l-2 border-gray-300">
                                            {Object.entries(subValue)
                                              .filter(([nestedKey]) =>
                                                [
                                                  "firstName",
                                                  "lastName",
                                                  "vendorName",
                                                  "technicianName",
                                                  "email"
                                                  // "id"
                                                  ,
                                                ].includes(nestedKey)
                                              ) // Filter for only firstName and lastName
                                              .map(
                                                ([nestedKey, nestedValue]) => (
                                                  <div
                                                    key={nestedKey}
                                                    className="flex items-center space-x-2"
                                                  >
                                                    <span className="text-sm  text-gray-600 capitalize">
                                                      {nestedKey.replace(
                                                        /([a-z])([A-Z])/g,
                                                        "$1 $2"
                                                      )}
                                                      :
                                                    </span>
                                                    <span className="text-gray-800">
                                                      {nestedValue !== null &&
                                                      nestedValue !== undefined
                                                        ? String(nestedValue)
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
                                /* Handle non-object array items */
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
                        <p className="text-gray-500">No items available</p>
                      )}
                    </div>
                  </details>
                );
              })}
          </div>
        </>
      ) : (
        <>
          {Object.entries(facility || {})
            .filter(([key, value]) => Array.isArray(value) && key !== "bills") // Only keys with array values
            .map(([key, array], index) => (
              <details
                key={index}
                className="border border-gray-200 rounded-lg px-4 py-5 relative group mt-4"
              >
                <summary className="flex justify-between items-center text-base font-semibold cursor-pointer">
                  {/* Capitalize category name */}
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
                      <li key={idx} className="flex items-start space-x-3">
                        {typeof item === "object" && !Array.isArray(item) ? (
                          // Render a dropdown for an object (e.g., block or asset)
                          <details className="w-full">
                            <summary className="flex items-center text-sm font-medium cursor-pointer">
                              {/* Access the property you want to display, e.g., blockNumber or assetName */}
                              {/* {item.blockNumber ||
                                item.assetName ||
                                item.unitNumber ||
                          
                                (item.firstName + " " + item.lastName)         || (item.walletType + " " + "₦" + item.balance)    }
                          */}
                              {item.blockNumber ??
                                item.assetName ??
                                item.unitNumber ??
                                item.title ??
                                (item.firstName && item.lastName
                                  ? item.firstName + " " + item.lastName
                                  : item.walletType + " ₦" + item.balance)}

                              {item.units && item.units.length > 0 && (
                                <span className="transform transition-transform duration-100 ml-3">
                                  <DropDownArrow />
                                </span>
                              )}
                            </summary>
                            {item.units && item.units.length > 0 && (
                              // Render units dropdown only if units array exists and has items
                              <ul className="mt-3 ml-4 pl-3 border-l border-gray-300 space-y-2">
                                {item.units.map((unit, subIdx) => (
                                  <li key={subIdx}>
                                    {/* Render unit information */}
                                    <span className="text-sm text-gray-700">
                                      {unit.unitNumber}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </details>
                        ) : (
                          // Render a single value if it's not an object
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
        </>
      )}
    </>
  );
}
