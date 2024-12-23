"use client";

import { DropDownArrow } from "@/utils/svg";

export default function FacilityDetails({ facility, groupedPermissions }) {
  return (
    <>
      <div className="space-y-3 px-1 text-gray-500">
        {[
          { label: "Facility Name", value: facility?.name },
          { label: "Facility Code", value: facility?.code },
          { label: "Number of Blocks", value: facility?.blocks.length },
          { label: "Facility Type", value: facility?.type },
          { label: "Facility Officer", value: facility?.facilityOfficer },
          { label: "Phone", value: facility?.phone },
          { label: "Email", value: facility?.email },
          { label: "Address", value: facility?.address },
          { label: "Store", value: facility?.store },
          { label: "Common Area", value: facility?.commonArea },
        ].map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <p className="text-gray-500">{item.label}</p>
            <p className="text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>
      {Object.keys(groupedPermissions).map((category) => (
        <details
          key={category}
          className="border border-gray-200 rounded-lg px-4 py-5 relative group mt-4"
        >
          <summary className="flex justify-between items-center text-base font-semibold cursor-pointer">
            {category}
            {/* Capitalize category name */}
            <span className="transform transition-transform duration-100 group-open:rotate-180">
              <DropDownArrow />
            </span>
          </summary>
          <nav className="mt-4 pt-9 pb-6 border-t border-gray-300">
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedPermissions[category].map((permission) => (
                <li key={permission.id} className="flex items-start space-x-3">
                  <span
                    className="text-sm text-gray-700 flex-1 overflow-hidden overflow-ellipsis whitespace-normal"
                    title={permission.normalizedString} // Tooltip for full text
                  >
                    {permission.normalizedString}
                  </span>
                </li>
              ))}
            </ul>
          </nav>
        </details>
      ))}
    </>
  );
}
