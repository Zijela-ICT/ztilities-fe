"use client";
import { IncomingIcon, OutgoingIcon, SearchIcon, WorkIcon } from "@/utils/svg";

import React, { useEffect, useState } from "react";
import ButtonComponent from "./button-component";
import { tableMainButtonConfigs } from "@/utils/tableConfig";
import Image from "next/image";
import StatusBadge from "./status-component";
import formatCurrency from "@/utils/formatCurrency";
import Actions from "./actions";
import moment from "moment";

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
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (event: any) => {
    setSearchQuery(event.target.value);
  };

  // Filtered data based on search query
  const filteredData = data?.filter((row) =>
    Object.values(row).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery?.toLowerCase())
    )
  );

  // Paginated data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = filteredData?.slice(indexOfFirstItem, indexOfLastItem);

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

  const columns = data && data.length > 0 ? Object.keys(data[0]) : [];

  const [contextMenued, setContextMenued] = useState<string | null>(null);

  const contextMenuedActions = (rowId: string) => {
    setContextMenued((prevId) => (prevId === rowId ? null : rowId));
  };

  console.log(contextMenued, "contectid", activeRowId, "activroe id");
  // //   useEffect(()=> {
  // // if(contextMenued === true){
  // //   setContextMenued(false)
  // // }
  // //   }, [toggleActions])
  return (
    <div className="p-4">
      {noSearch ? null : (
        <>
          <div className="flex sm:flex-row flex-col items-center md:space-x-2 space-x-0 space-y-2 md:space-y-0  font-semibold text-md mb-4">
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
                  : "sm:w-[70%]"
              }`}
            >
              {/* Search Icon */}
              <span className="pl-3 text-gray-400 mt-2">
                <SearchIcon />
              </span>

              <input
                id="searchInput"
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearch}
                className="px-1 py-4 w-full focus:outline-none"
              />
            </div>

            {/* button here based on types */}
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

      {/* button here based on types */}

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg border border-gray-100 min-h-[40vh]">
        {filteredData?.length > 0 ? (
          <table className="relative min-w-full table-auto text-xs">
            <thead className="bg-gray-100 text-left">
              <tr className="relative">
                {columns
                  .filter(
                    (column) =>
                      column !== "id" &&
                      column !== "createdAt" &&
                      column !== "updatedAt" &&
                      // column !== "avatar" &&
                      column !== "assets" &&
                      // column !== "user" &&
                      column !== "isApproved" &&
                      column !== "isApportioned" &&
                      column !== "isWorkOrder"
                  ) // Exclude the specified columns
                  .map((column) => (
                    <th key={column} className="py-3 px-4 ">
                      {column === "isDeactivated"
                        ? "Status"
                        : column.charAt(0).toUpperCase() + column.slice(1)}
                    </th>
                  ))}

                {noSearch ? null : (
                  <>
                    <th className="py-3 px-4 ">Actions</th>
                  </>
                )}
              </tr>
            </thead>

            <tbody>
              {filteredData?.map((row: any, index) => (
                <tr
                  onContextMenu={(e) => {
                    e.preventDefault(); // Prevents the default browser context menu
                    toggleActions(row.id);
                    contextMenuedActions(row.id);
                  }}
                  // onClick={(e) => {

                  //   toggleActions(null);
                  //   contextMenuedActions(null);

                  // }}
                  key={index}
                  className="border-b border-gray-200  h-20 "
                >
                  {columns
                    .filter(
                      (column) =>
                        column !== "id" &&
                        column !== "createdAt" &&
                        column !== "updatedAt" &&
                        // column !== "avatar" &&
                        column !== "assets" &&
                        // column !== "user" &&
                        column !== "isApproved" &&
                        column !== "isApportioned" &&
                        column !== "isWorkOrder"
                    )
                    .map((column) => (
                      <td key={column} className="py-3 px-4">
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
                            // Show the length of the array for specific types
                            row[column]?.length
                          ) : (
                            // Handle array case, extract specific properties
                            row[column]
                              ?.map((item: any) =>
                                [
                                  "name",
                                  "blockNumber",
                                  "unitNumber",
                                  "assetName",
                                  `firstName`,
                                  "lastName",
                                  "subCategoryName",
                                ]
                                  ?.map((prop) => item?.[prop]) // Optional chaining here
                                  .filter(Boolean)
                                  .join(", ")
                              )
                              .join(", ")
                          )
                        ) : typeof row[column] === "object" &&
                          row[column] !== null ? (
                          // Handle single object case, extract specific properties
                          [
                            "name",
                            "blockNumber",
                            "unitNumber",
                            "assetName",
                            `firstName`,
                            "lastName",
                            "subCategoryName",
                            "vendorName",
                            "techniacianName",
                          ]
                            .map((prop) => row[column]?.[prop]) // Optional chaining here
                            .filter(Boolean)
                            .join(", ")
                        ) : column === "isDeactivated" ? (
                          // Handle isDeactivated column
                          <span
                            className={`px-2.5 py-1 ${
                              row[column] === false
                                ? "text-[#036B26] bg-[#E7F6EC]"
                                : "text-[#B76E00] bg-[#FFAB0014]"
                            } rounded-full `}
                          >
                            {row[column] === true ? "Inactive" : "Active"}
                          </span>
                        ) : column === "status" || column === "subStatus" ? (
                          <StatusBadge status={row[column]} />
                        ) : column === "amount" ? (
                          row[column] && formatCurrency(row[column])
                        ) : column === "paidAt" ? (
                          row[column] && moment.utc(row[column]).format("lll")
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
                                ).toString(16)}`, // Random background color
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
                          // Default case for other columns
                          row[column]?.toString()
                        )}
                      </td>
                    ))}

                  {/* Actions based on type */}
                  {noSearch ? null : (
                    <>
                      <td className="py-3 px-4 ">
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
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center w-full h-[40vh] rounded-lg shadow-md">
              <WorkIcon />
              <p className="text-gray-600 text-lg mt-2">No items to display</p>
            </div>
          </>
        )}
      </div>

      {/* Pagination Controls */}

      <div className="flex justify-center text-xs space-x-2 mt-4">
  <button
    onClick={handlePrevious}
    disabled={currentPage === 1}
    className="px-4 py-2 bg-gray-100 text-black font-semibold rounded-md disabled:opacity-50"
  >
    Previous
  </button>

  {/* Left arrow for sliding pagination */}
  {totalPages > 7 && currentPage > 4 && (
    <button onClick={() => handlePageClick(currentPage - 3)} className="px-2 text-black">
      ←
    </button>
  )}

  {/* Page number buttons */}
  {totalPages ? (
    <>
      {Array.from({ length: totalPages }, (_, index) => index + 1)
        .filter((page) => {
          if (totalPages <= 7) return true; // Show all if <= 7 pages
          if (currentPage <= 4) return page <= 5 || page === totalPages; // Show first 5 + last
          if (currentPage >= totalPages - 3)
            return page >= totalPages - 4 || page === 1; // Show last 5 + first
          return (
            Math.abs(page - currentPage) <= 2 || page === 1 || page === totalPages
          ); // Show range around current + first & last
        })
        .map((page, index, arr) => (
          <React.Fragment key={page}>
            {index > 0 && page !== arr[index - 1] + 1 && <span>...</span>}
            <button
              onClick={() => handlePageClick(page)}
              className={`px-4 py-2 rounded-md ${
                currentPage === page
                  ? "bg-[#FBC2B61A] text-[#A8353A]"
                  : "text-gray-700"
              }`}
            >
              {page}
            </button>
          </React.Fragment>
        ))}
    </>
  ) : (
    <button className="px-4 py-2 rounded-md text-gray-700">1</button>
  )}

  {/* Right arrow for sliding pagination */}
  {totalPages > 7 && currentPage < totalPages - 3 && (
    <button onClick={() => handlePageClick(currentPage + 3)} className="px-2 text-black">
      →
    </button>
  )}

  <button
    onClick={handleNext}
    disabled={currentPage === totalPages}
    className="px-4 py-2 bg-gray-100 text-black font-semibold rounded-md disabled:opacity-50"
  >
    Next
  </button>
</div>

    </div>
  );
}

// bg-white sticky right-0 z-10
