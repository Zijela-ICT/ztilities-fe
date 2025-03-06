"use client";
import {
  FilterIcon,
  IncomingIcon,
  OutgoingIcon,
  SearchIcon,
  WorkIcon,
} from "@/utils/svg";
import React, { useEffect, useState } from "react";
import ButtonComponent from "./button-component";
import { tableMainButtonConfigs } from "@/utils/tableConfig";
import Image from "next/image";
import StatusBadge from "./status-component";
import formatCurrency from "@/utils/formatCurrency";
import Actions from "./actions";
import moment from "moment";
import Pagination from "./pagination-table";
import { useDataPermission } from "@/context";
import FilterComponent from "./table-filter-component";
import { MyLoaderFinite } from "./loader-components";

interface TableProps {
  data: Record<string, any>[];
  type?: string;
  setModalState?: any;
  setModalStateDelete?: any;
  toggleActions?: any;
  extraActions?: any;
  activeRowId?: any;
  setActiveRowId?: any;
  deleteAction?: any;
  noSearch?: boolean;
  currentPage?: number;
  setCurrentPage?: (page: number) => void;
  itemsPerPage?: number;
  totalPages?: number;
}

export default function TableComponent({
  data,
  type,
  setModalState,
  setModalStateDelete,
  toggleActions,
  extraActions,
  activeRowId,
  setActiveRowId,
  noSearch,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  totalPages,
}: TableProps) {
  const { setSearchQuery, setFilterQuery, clearSearchAndPagination } =
    useDataPermission();
  const [showFilter, setShowFilter] = useState<boolean>(false);
  // filters state now may hold a string (for normal filters)
  // or an object with min/max (for range filters) or from/to (for date filters)
  const [filters, setFilters] = useState<
    Record<
      string,
      string | { min?: string; max?: string } | { from?: string; to?: string }
    >
  >({});

  // Define which columns should use special inputs
  const rangeFilterKeys = [
    "amount",
    "approvalLimit",
    "approvalCount",
    "nonProcurementLimit",
  ];
  const dateFilterKeys = ["paidAt", "createdAt"];

  const filterColumns = [
    // "isDeactivated",
    // "category",
    "serviceCategory",
    "approvalLimit",
    "amount",
    "paidAt",
    "createdAt",
    "status",
    "consideredEntity",
    "type",
    "nonProcurementLimit",
    "apportionmentMetric",
  ];

  const [input, setInput] = useState("");
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setSearchQuery(input);
    }, 1500);
    return () => clearTimeout(debounceTimer); // Cleanup on re-render
  }, [input]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  // For a simple dropdown filter
  const handleFilterChange = (column: string, value: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      if (value === "") {
        // Remove the filter if the value is empty
        delete newFilters[column];
      } else {
        newFilters[column] = value;
      }
      return newFilters;
    });
  };
  // For range filters (e.g., min/max)
  const handleRangeFilterChange = (
    col: string,
    field: "min" | "max",
    value: string
  ) => {
    setFilters((prev) => {
      const newFilters = { ...prev };

      // Ensure that newFilters[col] is an object before spreading.
      let current: Record<string, string> = {};
      if (typeof newFilters[col] === "object" && newFilters[col] !== null) {
        current = { ...(newFilters[col] as Record<string, string>) };
      }

      if (value === "") {
        delete current[field];
      } else {
        current[field] = value;
      }

      if (Object.keys(current).length === 0) {
        delete newFilters[col];
      } else {
        newFilters[col] = current;
      }
      return newFilters;
    });
  };
  // For date range filters (e.g., startDate/endDate)
  const handleDateRangeFilterChange = (
    col: string,
    field: "startDate" | "endDate",
    value: string
  ) => {
    setFilters((prev) => {
      const newFilters = { ...prev };

      // Make sure newFilters[col] is an object
      let current: Record<string, string> = {};
      if (typeof newFilters[col] === "object" && newFilters[col] !== null) {
        current = { ...(newFilters[col] as Record<string, string>) };
      }

      if (value === "") {
        delete current[field];
      } else {
        current[field] = value;
      }

      if (Object.keys(current).length === 0) {
        delete newFilters[col];
      } else {
        newFilters[col] = current;
      }
      return newFilters;
    });
  };

  // Get all keys from data (if available)
  const columns = data && data.length > 0 ? Object.keys(data[0]) : [];

  // Determine table columns (exclude some keys)
  const displayedColumns = columns.filter(
    (column) =>
      column !== "id" &&
      // column !== "createdAt" &&
      column !== "updatedAt" &&
      column !== "assets" &&
      column !== "isApproved" &&
      column !== "isApportioned" &&
      column !== "isDeactivated" &&
      column !== "purchaseOrderFileUrl" &&
      column !== "isWorkOrder"
  );

  // Only show filters for columns that are in filterColumns and displayedColumns
  const filterKeys = filterColumns.filter((key) =>
    displayedColumns.includes(key)
  );

  //console.log({ filters });

  function convertFiltersToQueryString(
    filterObj: Record<string, unknown>,
    prefix: string = "filters"
  ): string {
    const queryParts: string[] = [];

    // Mapping for keys that require a different prefix at the top level.
    const keyPrefixMapping: Record<string, string> = {
      approvalLimit: "numberRanges",
      amount: "numberRanges",
      nonProcurementLimit: "numberRanges",
      paidAt: "dateRanges",
      createdAt: "dateRanges",
      updatedAt: "dateRanges",
    };

    Object.entries(filterObj).forEach(([key, value]) => {
      const encodedKey = encodeURIComponent(key);

      // Only update prefix at the top level.
      const newPrefix =
        prefix === "filters" && keyPrefixMapping[key]
          ? `${keyPrefixMapping[key]}[${encodedKey}]`
          : `${prefix}[${encodedKey}]`;

      if (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
      ) {
        // Recursively process nested objects.
        queryParts.push(
          convertFiltersToQueryString(
            value as Record<string, unknown>,
            newPrefix
          )
        );
      } else if (value !== undefined) {
        // Convert primitive values (or arrays if needed) to string.
        queryParts.push(`${newPrefix}=${encodeURIComponent(String(value))}`);
      }
    });

    return queryParts.join("&");
  }
  const queryString = convertFiltersToQueryString(filters);

  const sendQueryString = () => {
    setFilterQuery(queryString);
  };
  useEffect(() => {
    console.log(queryString);
    // setFilterQuery(queryString);
  }, [filters]);

  // Pagination logic remains the same…
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const [contextMenued, setContextMenued] = useState<string | null>(null);

  const contextMenuedActions = (rowId: string) => {
    setContextMenued((prevId) => (prevId === rowId ? null : rowId));
  };

  /* --- Added Loading State --- */
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-4">
      {noSearch ? null : (
        <>
          <div className="flex sm:flex-row flex-col items-center md:space-x-2 space-x-0 space-y-2 md:space-y-0 font-semibold text-md mb-4">
            <div
              className={`flex items-center border rounded-md focus-within:ring-2 focus-within:ring-blue-500 w-full ${
                type === "users"
                  ? "sm:w-[60%]"
                  : type === "workrequests"
                  ? "sm:w-[30%]"
                  : type === "bills"
                  ? "w-full"
                  : type === "apportionmentDetails"
                  ? "w-full"
                  : type === "transactions"
                  ? "sm:w-full"
                  : type === "approvefunding"
                  ? "sm:w-full"
                  : "sm:w-[70%]"
              }`}
            >
              <span className="pl-3 text-gray-400 mt-2">
                <SearchIcon />
              </span>

              <input
                id="searchInput"
                type="text"
                placeholder="Search..."
                value={input}
                onChange={handleSearch}
                className="px-1 py-4 w-full focus:outline-none"
              />
            </div>
            <div
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer"
            >
              <FilterIcon />
            </div>
            {tableMainButtonConfigs[type]?.map((button, index) => (
              <ButtonComponent
                key={index}
                text={button.text}
                onClick={() => {
                  setModalState(button.action);
                  setActiveRowId(null);
                }}
                className={button.className}
                permissions={button.permissions}
              />
            ))}
          </div>
        </>
      )}

      {/* Render filters with conditional input types */}
      {showFilter && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-5">
          <FilterComponent
            filterKeys={filterKeys}
            data={data}
            filters={filters}
            rangeFilterKeys={rangeFilterKeys}
            dateFilterKeys={dateFilterKeys}
            handleFilterChange={handleFilterChange}
            handleRangeFilterChange={handleRangeFilterChange}
            handleDateRangeFilterChange={handleDateRangeFilterChange}
            sendQueryString={sendQueryString}
          />
          <div
            className={
              filterKeys.length === 0
                ? "flex justify-center mt-4"
                : "flex justify-end mt-4 mr-9"
            }
          >
            {filterKeys.length === 0 ? (
              <button
                className="px-4 py-2 border border-[#A8353A] text-[#A8353A] rounded hover:bg-[#A8353A] hover:text-white transition-colors"
                onClick={() => clearSearchAndPagination()}
              >
                Clear Filter
              </button>
            ) : (
              <button
                className="px-4 py-2 bg-[#A8353A] text-white rounded transition-colors hover:bg-[#962d31]"
                onClick={() => sendQueryString()}
              >
                Filter
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table rendering with Loading Indicator */}
      <div className="overflow-x-auto bg-white rounded-lg border border-gray-100 min-h-[40vh]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center w-full h-[40vh]">
            <MyLoaderFinite />
          </div>
        ) : data?.length > 0 ? (
          <table className="relative min-w-full table-auto text-xs">
            <thead className="bg-gray-100 text-left">
              <tr className="relative">
                {displayedColumns.map((column) => (
                  <th key={column} className="py-3 px-4">
                    {column === "isDeactivated"
                      ? "Status"
                      : column.charAt(0).toUpperCase() + column.slice(1)}
                  </th>
                ))}
                {noSearch ? null : <th className="py-3 px-4">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {data?.map((row: any, index) => (
                <tr
                  onContextMenu={(e) => {
                    e.preventDefault();
                    toggleActions(row.id);
                    contextMenuedActions(row.id);
                  }}
                  key={index}
                  className="border-b border-gray-200 h-20"
                >
                  {displayedColumns.map((column) => (
                    <td key={column} className="py-3 px-4">
                      {/* Render cells based on type */}
                      {Array.isArray(row[column]) ? (
                        type === "assets" ||
                        type === "workrequests" ||
                        type === "workorders" ||
                        type === "facilities" ||
                        type === "blocks" ||
                        type === "bills" ||
                        type === "units" ||
                        type === "categories" ||
                        type === "powers" ? (
                          row[column]?.length
                        ) : (
                          row[column]
                            ?.map((item: any) =>
                              [
                                "name",
                                "blockNumber",
                                "unitNumber",
                                "assetName",
                                "firstName",
                                "lastName",
                                "subCategoryName",
                                "categoryName",
                              ]
                                .map((prop) => item?.[prop])
                                .filter(Boolean)
                                .join(", ")
                            )
                            .join(", ")
                        )
                      ) : typeof row[column] === "object" &&
                        row[column] !== null ? (
                        [
                          "name",
                          "blockNumber",
                          "unitNumber",
                          "assetName",
                          "firstName",
                          "lastName",
                          "subCategoryName",
                          "vendorName",
                          "techniacianName",
                          "categoryName",
                        ]
                          .map((prop) => row[column]?.[prop])
                          .filter(Boolean)
                          .join(", ")
                      ) : column === "isDeactivated" ? (
                        <span
                          className={`px-2.5 py-1 ${
                            row[column] === false
                              ? "text-[#036B26] bg-[#E7F6EC]"
                              : "text-[#B76E00] bg-[#FFAB0014]"
                          } rounded-full`}
                        >
                          {row[column] === true ? "Inactive" : "Active"}
                        </span>
                      ) : column === "status" || column === "subStatus" ? (
                        <StatusBadge status={row[column]} />
                      ) : column === "amount" ? (
                        row[column] && formatCurrency(row[column])
                      ) : column === "paidAt" || column === "createdAt" ? (
                        row[column] && moment.utc(row[column]).format("ll")
                      ) : column === "avatar" ? (
                        row?.avatar ? (
                          <Image
                            src={row.avatar}
                            alt={`${row?.firstName} ${row?.lastName}`}
                            className="rounded-full object-cover"
                            width={30}
                            height={30}
                          />
                        ) : (
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold`}
                            style={{
                              backgroundColor: `#${Math.floor(
                                Math.random() * 16777215
                              ).toString(16)}`,
                            }}
                          >
                            {`${row?.firstName?.[0] || ""}${
                              row?.lastName?.[0] || ""
                            }`.toUpperCase()}
                          </div>
                        )
                      ) : type === "transactions" && column === "category" ? (
                        row[column] === "INFLOW" ? (
                          <IncomingIcon />
                        ) : (
                          <OutgoingIcon />
                        )
                      ) : (
                        row[column]?.toString()
                      )}
                    </td>
                  ))}
                  {noSearch ? null : (
                    <td className="py-3 px-4">
                      <Actions
                        type={type}
                        row={row}
                        setModalState={setModalState}
                        setModalStateDelete={setModalStateDelete}
                        activeRowId={activeRowId}
                        toggleActions={toggleActions}
                        contextMenued={contextMenued}
                        contextMenuedActions={contextMenuedActions}
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-[40vh] rounded-lg shadow-md">
            <WorkIcon />
            <p className="text-gray-600 text-lg mt-2">No items to display</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePrevious={handlePrevious}
        handleNext={handleNext}
        handlePageClick={handlePageClick}
      />
    </div>
  );
}
