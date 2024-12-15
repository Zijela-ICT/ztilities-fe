"use client";

import { FormEvent, useState, useEffect } from "react";
import { LabelInputComponent } from "./input-container";
import axiosInstance from "@/utils/api";
import { DropDownArrow } from "@/utils/svg";

interface Permission {
  id: number;
  permissionString: string;
}

export default function CreateRole({ setModalState, setSuccessState }) {
  const [formData, setFormData] = useState({
    name: "",
    permissions: [] as number[],
  });

  const [permissions, setPermissions] = useState<Permission[]>([]);

  // Group permissions by their category
  const groupPermissions = (permissions: Permission[]) => {
    return permissions.reduce((groups, permission) => {
      // Get the part of the permission string after the underscore
      const category = permission.permissionString.split(":")[0].split("_")[1];
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(permission);
      return groups;
    }, {} as Record<string, Permission[]>);
  };

  const getPermissions = async () => {
    const response = await axiosInstance.get("/permissions");
    setPermissions(response.data.data);
  };

  useEffect(() => {
    getPermissions();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await axiosInstance.post("/roles", {
      name: formData.name,
      permissions: formData.permissions,
    });
    setSuccessState({
      title: "Successful",
      detail: "You have successfully created this role",
      status :true
    });

    setFormData({
      name: "",
      permissions: [],
    });
    setModalState();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    permissionId: number
  ) => {
    const { checked } = e.target;

    setFormData((prevState) => {
      const updatedPermissions = checked
        ? [...prevState.permissions, permissionId] // Add permission if checked
        : prevState.permissions.filter((id) => id !== permissionId); // Remove permission if unchecked

      return {
        ...prevState,
        permissions: updatedPermissions,
      };
    });
  };

  const groupedPermissions = groupPermissions(permissions);

  return (
    <div className="mt-12 px-6 max-w-full sm:mt-6 pb-12">
      <form onSubmit={handleSubmit}>
        <div className="relative w-full mt-6">
          <LabelInputComponent
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            label="Name of Role"
            required
          />
        </div>

        {/* Ticking part with grouped permissions */}
        <div className="font-semibold text-md mt-10 mb-4">Permission Menu</div>

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
                  <li
                    key={permission.id}
                    className="flex items-start space-x-3"
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-[#A8353A] border-gray-300 rounded focus:ring-[#A8353A]"
                      checked={formData.permissions.includes(permission.id)}
                      onChange={(e) => handleChange(e, permission.id)}
                    />
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

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="block rounded-md bg-[#A8353A] px-4 py-3.5 text-center text-base font-semibold text-white"
          >
            Create Role
          </button>
        </div>
      </form>
    </div>
  );
}
