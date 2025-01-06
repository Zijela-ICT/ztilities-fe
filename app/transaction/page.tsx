"use client";

import DashboardLayout from "@/components/dashboard-layout-component";
import { useState } from "react";

export default function Transactions() {
  const [filters, setFilters] = useState({
    Block: "",
    Facility: "",
    Vendor: "",
    Technician: "",
  });

  const filterOptions = [
    { label: "Block", options: ["Block A", "Block B", "Block C"] },
    { label: "Facility", options: ["Facility 1", "Facility 2", "Facility 3"] },
    { label: "Vendor", options: ["Vendor X", "Vendor Y", "Vendor Z"] },
    {
      label: "Technician",
      options: ["Technician 1", "Technician 2", "Technician 3"],
    },
    {
      label: "Resident",
      options: ["Technician 1", "Technician 2", "Technician 3"],
    },
  ];

  const handleFilterChange = (label, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [label]: value,
    }));
  };

  const handleApplyFilters = () => {
    console.log("Filters Applied:", filters);
  };

  return (
    <DashboardLayout
      title="Transactions"
      detail="See balance and all transactions here"
    >
      <>
      <div className="hidden relative bg-white rounded-2xl p-4">
        <div className="flex justify-end space-x-4 pb-2">
          {filterOptions.map((filter, index) => (
            <select
              key={index}
              className="border border-gray-300 rounded-md p-2"
              value={filters[filter.label]}
              onChange={(e) => handleFilterChange(filter.label, e.target.value)}
            >
              <option value="">{`Filter by ${filter.label}`}</option>
              {filter.options.map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ))}
        </div>
      </div>

      <div className=" hidden relative bg-white rounded-2xl p-4">
        <div className="flex justify-end space-x-4 pb-2">
      huhu
        </div>
      </div>
      </>
    </DashboardLayout>
  );
}
