import React from "react";
import Select from "react-select";
import { LabelInputComponent } from "./input-container";
import { multiSelectStyle } from "@/utils/ojects";

// Define the props for the component
interface FilterComponentProps {
  filterKeys: string[];
  data: any[];
  filters: Record<
    string,
    | string
    | { min?: string; max?: string }
    | { from?: string; to?: string }
    | any
  >;
  rangeFilterKeys: string[];
  dateFilterKeys: string[];
  handleFilterChange: (col: string, value: any) => void;
  handleRangeFilterChange: (
    col: string,
    key: "min" | "max",
    value: string
  ) => void;
  handleDateRangeFilterChange: (
    col: string,
    key: "startDate" | "endDate",
    value: string
  ) => void;
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  filterKeys,
  data,
  filters,
  rangeFilterKeys,
  dateFilterKeys,
  handleFilterChange,
  handleRangeFilterChange,
  handleDateRangeFilterChange,
}) => {
  if (!filterKeys.length) return null;

  
  return (
    <div className="flex flex-wrap gap-4 my-4">
      {filterKeys.map((col) => {
        // For dropdowns: get unique values for the column from data
        const uniqueValues = Array.from(
          new Set(data.map((row) => row[col]).filter((val) => val != null))
        );
        return (
          <div key={col} className="flex flex-col">
            <label className="text-xs font-semibold">
              {col === "isDeactivated"
                ? "isDeactivated"
                : col.charAt(0).toUpperCase() + col.slice(1)}
            </label>
            {rangeFilterKeys.includes(col) ? (
              <div className="flex items-center space-x-2 border rounded-lg p-2 mt-2">
                <div className="relative w-full">
                  <LabelInputComponent
                    label="min"
                    name="min"
                    type="number"
                    placeholder="Min"
                    value={
                      typeof filters[col] === "object"
                        ? (filters[col] as any).min || ""
                        : ""
                    }
                    onChange={(e) =>
                      handleRangeFilterChange(col, "min", e.target.value)
                    }
                  />
                </div>
                <span className="text-gray-500">—</span>
                <div className="relative w-full">
                  <LabelInputComponent
                    label="max"
                    name="max"
                    type="number"
                    placeholder="Max"
                    value={
                      typeof filters[col] === "object"
                        ? (filters[col] as any).max || ""
                        : ""
                    }
                    onChange={(e) =>
                      handleRangeFilterChange(col, "max", e.target.value)
                    }
                  />
                </div>
              </div>
            ) : dateFilterKeys.includes(col) ? (
              <div className="flex items-center space-x-2 border rounded-lg p-2 mt-2">
                <div className="relative w-full">
                  <LabelInputComponent
                    label="date"
                    name="date"
                    type="date"
                    placeholder="From"
                    value={
                      typeof filters[col] === "object"
                        ? (filters[col] as any).from || ""
                        : ""
                    }
                    onChange={(e) =>
                      handleDateRangeFilterChange(
                        col,
                        "startDate",
                        e.target.value
                      )
                    }
                  />
                </div>
                <span className="text-gray-500">—</span>
                <div className="relative w-full">
                  <LabelInputComponent
                    label="date"
                    name="date"
                    type="date"
                    placeholder="To"
                    value={
                      typeof filters[col] === "object"
                        ? (filters[col] as any).to || ""
                        : ""
                    }
                    onChange={(e) =>
                      handleDateRangeFilterChange(
                        col,
                        "endDate",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            ) : (
              <div className="relative w-full mt-4">
                <Select
                  value={
                    typeof filters[col] === "string"
                      ? { label: filters[col], value: filters[col] }
                      : Array.isArray(filters[col])
                      ? filters[col].every((item: any) => "name" in item)
                        ? {
                            label: filters[col]
                              .map((item: any) => item.name)
                              .join(", "),
                            value: filters[col]
                              .map((item: any) => item.name)
                              .join(", "),
                          }
                        : null
                      : typeof filters[col] === "object" &&
                        filters[col] !== null
                      ? "name" in filters[col]
                        ? {
                            label: (filters[col] as { name: string }).name,
                            value: (filters[col] as { name: string }).name,
                          }
                        : null
                      : null
                  }
                  onChange={(selectedOption) =>
                    handleFilterChange(
                      col,
                      selectedOption ? selectedOption.value : ""
                    )
                  }
                  options={uniqueValues.map((val) => {
                    if (typeof val === "string") {
                      return { label: val, value: val }; // For strings
                    }

                    if (Array.isArray(val)) {
                      // Check if each item has a 'name' property
                      const allItemsHaveName = val.every(
                        (item) => "name" in item
                      );
                      return allItemsHaveName
                        ? {
                            label: val.map((item: any) => item.name).join(", "),
                            value: val.map((item: any) => item.name).join(", "),
                          }
                        : {
                            label: "Invalid items",
                            value: "Invalid items",
                          };
                    }

                    if (
                      typeof val === "object" &&
                      val !== null &&
                      "name" in val
                    ) {
                      return {
                        label: (val as { name: string }).name,
                        value: (val as { name: string }).name,
                      };
                    }

                    return { label: "Invalid value", value: "Invalid value" };
                  })}
                  isClearable
                  styles={multiSelectStyle}
                  placeholder="Select ...."
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FilterComponent;
