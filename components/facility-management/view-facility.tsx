// "use client";

// import { DropDownArrow } from "@/utils/svg";

// export default function FacilityDetails({ facility, groupedPermissions }) {
//   return (
//     <>
//       <div className="space-y-3 px-1 text-gray-500">
//         {[
//           { label: "Facility Name", value: facility?.name },
//           { label: "Facility Code", value: facility?.code },
//           { label: "Number of Blocks", value: facility?.blocks.length },
//           { label: "Facility Type", value: facility?.type },
//           { label: "Facility Officer", value: facility?.facilityOfficer },
//           { label: "Phone", value: facility?.phone },
//           { label: "Email", value: facility?.email },
//           { label: "Address", value: facility?.address },
//           { label: "Store", value: facility?.store },
//           { label: "Common Area", value: facility?.commonArea },
//         ].map((item, index) => (
//           <div key={index} className="flex items-center justify-between">
//             <p className="text-gray-500">{item.label}</p>
//             <p className="text-gray-900">{item.value}</p>
//           </div>
//         ))}
//       </div>
//       {Object.keys(groupedPermissions).map((category) => (
//         <details
//           key={category}
//           className="border border-gray-200 rounded-lg px-4 py-5 relative group mt-4"
//         >
//           <summary className="flex justify-between items-center text-base font-semibold cursor-pointer">
//             {category}
//             {/* Capitalize category name */}
//             <span className="transform transition-transform duration-100 group-open:rotate-180">
//               <DropDownArrow />
//             </span>
//           </summary>
//           <nav className="mt-4 pt-9 pb-6 border-t border-gray-300">
//             <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {groupedPermissions[category].map((permission) => (
//                 <li key={permission.id} className="flex items-start space-x-3">
//                   <span
//                     className="text-sm text-gray-700 flex-1 overflow-hidden overflow-ellipsis whitespace-normal"
//                     title={permission.normalizedString} // Tooltip for full text
//                   >
//                     {permission.normalizedString}
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           </nav>
//         </details>
//       ))}
//     </>
//   );
// }

"use client";

import { DropDownArrow } from "@/utils/svg";
import React from "react";

interface FacilityDetailsProps {
  title?: string;
  facility: Record<string, any>;
  groupedPermissions?: Record<
    string,
    { id: string; normalizedString: string; units: any[] }[]
  >;
  excludedKeys?: string[]; // Array of keys to omit
}

export default function FacilityDetails({
  title,
  facility,
  groupedPermissions,
  excludedKeys = ["facility", "block", "id", "createdAt", "updatedAt"],
}: FacilityDetailsProps) {
  return (
    <>
      {/* Dynamically render facility details, omitting excluded keys */}
      <div className="space-y-3 px-1 text-gray-500">
        {Object.entries(facility || {})
          .filter(([key]) => !excludedKeys.includes(key)) // Filter out excluded keys
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
                key === "assignedVendor" ||
                key === "assignedTechnician" ||
                (key === "requestedBy" &&
                  value !== null &&
                  typeof value === "object")
                  ? `${value?.firstName || "-"} ${value?.lastName || "-"}`
                  : key === "unit" &&
                    value !== null &&
                    typeof value === "object"
                  ? `${value?.unitNumber || "-"}`
                  : key === "asset" &&
                    value !== null &&
                    typeof value === "object"
                  ? `${value?.unitNumber || "-"}`
                  : key === "addedBy" &&
                    value !== null &&
                    typeof value === "object"
                  ? `${value?.firstName || "-"} ${value?.lastName || "-"} `
                  : Array.isArray(value)
                  ? value.length // Show array length
                  : typeof value === "object" && value !== null
                  ? JSON.stringify(value) // Show object as a JSON string
                  : value !== null && value !== undefined
                  ? String(value) // Convert other types to string
                  : "-"}
              </p>
            </div>
          ))}
      </div>

      {/* for request */}
      {(title === "Work Request" ||
        title === "Category" ||
        title === "Power Charge") && (
        <>
          {" "}
          <div className="space-y-5 px-2 text-gray-500">
            {Object.entries(facility || {})
              .filter(([key, value]) => Array.isArray(value)) // Only keys with array values
              .map(([key, array], index) => (
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
                    {array.length > 0 ? (
                      array.map((item, idx) => (
                        <details
                          key={idx}
                          className="border border-gray-200 rounded-lg px-4 py-5 relative group mt-4"
                        >
                          <summary className="flex justify-between items-center text-base font-semibold cursor-pointer">
                            {key
                              .replace(/([a-z])([A-Z])/g, "$1 $2")
                              .charAt(0)
                              .toUpperCase() +
                              key
                                .replace(/([a-z])([A-Z])/g, "$1 $2")
                                .slice(1)}{" "}
                            {idx + 1}
                            <span className="transform transition-transform duration-100 group-open:rotate-180">
                              <DropDownArrow />
                            </span>
                          </summary>

                          <div className="mt-2 space-y-2">
                            {/* Recursively Map Over Object */}
                            {typeof item === "object" && item !== null ? (
                              Object.entries(item).map(([subKey, subValue]) => (
                                <div key={subKey} className="flex flex-col">
                                  <span className="text-sm text-gray-500 capitalize">
                                    {subKey.replace(/([a-z])([A-Z])/g, "$1 $2")}
                                  </span>

                                  {/* Check for Nested Object */}
                                  {typeof subValue === "object" &&
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
                                              "id",
                                            ].includes(nestedKey)
                                          ) // Filter for only firstName and lastName
                                          .map(([nestedKey, nestedValue]) => (
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
                                          ))}
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
                              ))
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
              ))}
          </div>
        </>
      )}

      {/* Dynamically render grouped permissions */}
      {Object.entries(groupedPermissions || {}).map(
        ([category, permissions]) => (
          <details
            key={category}
            className="border border-gray-200 rounded-lg px-4 py-5 relative group mt-4"
          >
            <summary className="flex justify-between items-center text-base font-semibold cursor-pointer">
              {/* Capitalize category name */}
              {category.replace(/([a-z])([A-Z])/g, "$1 $2")}
              <span className="transform transition-transform duration-100 group-open:rotate-180">
                <DropDownArrow />
              </span>
            </summary>
            <nav className="mt-4 pt-9 pb-6 border-t border-gray-300">
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {permissions.map((permission) => (
                  <li
                    key={permission.id}
                    className="flex items-start space-x-3"
                  >
                    {Array.isArray(permission?.units) ? (
                      // Render a dropdown for sub-permissions if it's an array
                      <details className="w-full">
                        <summary className="flex items-center text-sm font-medium cursor-pointer">
                          {permission.normalizedString}
                          <span className="transform transition-transform duration-100 ml-3">
                            <DropDownArrow />
                          </span>
                        </summary>
                        <ul className="mt-3 ml-4 pl-3 border-l border-gray-300 space-y-2">
                          {permission.units.map((unit, index) => {
                            return (
                              <li
                                key={index}
                                className="text-sm text-gray-700"
                                title={unit}
                              >
                                {unit?.unitNumber}
                              </li>
                            );
                          })}
                        </ul>
                      </details>
                    ) : (
                      // Render a single permission
                      <span
                        className="text-sm text-gray-700 flex-1 overflow-hidden overflow-ellipsis whitespace-normal"
                        title={permission.normalizedString}
                      >
                        {permission.normalizedString}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </details>
        )
      )}
    </>
  );
}

// {Object.entries(groupedPermissions || {}).map(
//   ([category, permissions]) => (
//     <details
//       key={category}
//       className="border border-gray-200 rounded-lg px-4 py-5 relative group mt-4"
//     >
//       <summary className="flex justify-between items-center text-base font-semibold cursor-pointer">
//         {/* Capitalize category name */}
//         {category.replace(/([a-z])([A-Z])/g, "$1 $2")}
//         <span className="transform transition-transform duration-100 group-open:rotate-180">
//           <DropDownArrow />
//         </span>
//       </summary>
//       <nav className="mt-4 pt-9 pb-6 border-t border-gray-300">
//         <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {permissions.map((permission) => (
//             <li
//               key={permission.id}
//               className="flex items-start space-x-3"
//             >
//               <span
//                 className="text-sm text-gray-700 flex-1 overflow-hidden overflow-ellipsis whitespace-normal"
//                 title={permission.normalizedString} // Tooltip for full text
//               >
//                 {permission.normalizedString}
//               </span>
//             </li>
//           ))}
//         </ul>
//       </nav>
//     </details>
//   )
// )}
