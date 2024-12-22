"use client";

import { DropDownArrow } from "@/utils/svg";

export default function PermissionList({ groupedPermissions }) {
  return (
    <>
      {Object.keys(groupedPermissions).map((category) => (
        <details
          key={category}
          className="border border-gray-200 rounded-lg px-4 py-5 relative group mt-4"
        >
          <summary className="flex justify-between items-center text-base font-semibold cursor-pointer">
            {category.charAt(0).toUpperCase() + category.slice(1)}{" "}
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
                    title={permission.permissionString} // Tooltip for full text
                  >
                    {permission.permissionString}
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
