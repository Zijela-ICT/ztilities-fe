// "use client";
// import {
//   IncomingIcon,
//   OutgoingIcon,
//   SearchIcon,
//   TrashIcon,
//   TrashIconGray,
//   TripleDotsIcon,
// } from "@/utils/svg";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import ButtonComponent, { DropdownButtonComponent } from "./button-component";
// import PermissionGuard from "./auth/permission-protected-components";
// import { tableMainButtonConfigs } from "@/utils/tableConfig";
// import Image from "next/image";

// interface TableProps {
//   data: Record<string, any>[];
//   type?: string;
//   setModalState?: any;
//   setModalStateDelete?: any;
//   toggleActions?: any;
//   extraActions?: any;
//   activeRowId?: any;
//   setActiveRowId?: any;
//   deleteAction?: any;
//   noSearch?: boolean;
//   currentPage?: number;
//   setCurrentPage?: (page: number) => void;
//   itemsPerPage?: number;
//   totalPages?: number;
// }

// export default function TableComponent({
//   data,
//   type,
//   setModalState,
//   setModalStateDelete,
//   toggleActions,
//   extraActions,
//   activeRowId,
//   setActiveRowId,
//   noSearch,
//   currentPage,
//   setCurrentPage,
//   itemsPerPage,
//   totalPages,
// }: TableProps) {
//   const router = useRouter(); // Get the dynamic route parameters

//   const [searchQuery, setSearchQuery] = useState("");
//   // const [currentPage, setCurrentPage] = useState(1);

//   // const itemsPerPage = 10;

//   const handleSearch = (event: any) => {
//     setSearchQuery(event.target.value);
//   };

//   // Filtered data based on search query
//   const filteredData = data?.filter((row) =>
//     Object.values(row).some((value) =>
//       value?.toString().toLowerCase().includes(searchQuery?.toLowerCase())
//     )
//   );

//   // Paginated data
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   // const currentItems = filteredData?.slice(indexOfFirstItem, indexOfLastItem);

//   // const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

//   const handleNext = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const handlePageClick = (page: number) => {
//     setCurrentPage(page);
//   };

//   const columns = data && data.length > 0 ? Object.keys(data[0]) : [];

//   return (
//     <div className="p-4">
//       {/* button here based on types */}

//       {/* Table */}
//       <div className="overflow-x-auto bg-white rounded-lg border border-gray-100 min-h-[40vh]">
//         <table className="min-w-full table-auto text-xs">
//           <thead className="bg-gray-100 text-left">
//             <tr className="relative">
//               {columns
//                 .filter((column) => column !== "id" && column !== "isWorkOrder") // Exclude the specified columns
//                 .map((column) => (
//                   <th key={column} className="py-3 px-4 ">
//                     {column === "isDeactivated"
//                       ? "Status"
//                       : column.charAt(0).toUpperCase() + column.slice(1)}
//                   </th>
//                 ))}

//               {noSearch ? null : (
//                 <>
//                   <th className="py-3 px-4 ">Actions</th>
//                 </>
//               )}
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.length > 0 ? (
//               filteredData.map((row: any, index) => (
//                 <tr key={index} className="border-b border-gray-200 h-20">
//                   {columns
//                     .filter(
//                       (column) =>
//                         column !== "id" &&
//                         column !== "createdAt" &&
//                         column !== "updatedAt" &&
//                         column !== "assets" &&
//                         column !== "isApproved" &&
//                         column !== "isApportioned" &&
//                         column !== "isWorkOrder"
//                     )
//                     .map((column) => (
//                       <td key={column} className="py-3 px-4">
//                         {Array.isArray(row[column]) ? (
//                           type === "assets" || type === "powers" ? (
//                             row[column]?.length
//                           ) : (
//                             row[column]
//                               ?.map((item: any) =>
//                                 ["name", "blockNumber"]
//                                   .map((prop) => item?.[prop])
//                                   .filter(Boolean)
//                                   .join(", ")
//                               )
//                               .join(", ")
//                           )
//                         ) : typeof row[column] === "object" &&
//                           row[column] !== null ? (
//                           ["name"]
//                             .map((prop) => row[column]?.[prop])
//                             .filter(Boolean)
//                             .join(", ")
//                         ) : column === "isDeactivated" ? (
//                           row[column] ? (
//                             "Inactive"
//                           ) : (
//                             "Active"
//                           )
//                         ) : column === "avatar" ? (
//                           row?.avatar ? (
//                             <Image
//                               src={row.avatar}
//                               alt={`${row?.firstName} ${row?.lastName}`}
//                               className="rounded-full object-cover"
//                               width={30}
//                               height={30}
//                             />
//                           ) : (
//                             <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold bg-gray-400">
//                               {`${row?.firstName?.[0] || ""}${
//                                 row?.lastName?.[0] || ""
//                               }`.toUpperCase()}
//                             </div>
//                           )
//                         ) : (
//                           row[column]?.toString()
//                         )}
//                       </td>
//                     ))}
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={columns.length} className="text-center py-4">
//                   No data available
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination Controls */}
//       <div className="flex justify-center text-xs space-x-4 mt-4">
//         <button
//           onClick={handlePrevious}
//           disabled={currentPage === 1}
//           className="px-4 py-2 bg-gray-100 text-black font-semibold rounded-md disabled:opacity-50"
//         >
//           Previous
//         </button>

//         {/* Page number buttons */}
//         {Array.from({ length: totalPages }, (_, index) => (
//           <button
//             key={index}
//             onClick={() => handlePageClick(index + 1)}
//             className={`px-4 py-2 rounded-md ${
//               currentPage === index + 1
//                 ? "bg-[#FBC2B61A] text-[#A8353A]"
//                 : " text-gray-700 "
//             }`}
//           >
//             {index + 1}
//           </button>
//         ))}

//         <button
//           onClick={handleNext}
//           disabled={currentPage === totalPages}
//           className="px-4 py-2 bg-gray-100 text-black font-semibold rounded-md disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

// // bg-white sticky right-0 z-10

"use client";
import {
  IncomingIcon,
  OutgoingIcon,
  SearchIcon,
  TrashIcon,
  TrashIconGray,
  TripleDotsIcon,
  WorkIcon,
} from "@/utils/svg";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ButtonComponent, { DropdownButtonComponent } from "./button-component";
import PermissionGuard from "./auth/permission-protected-components";
import { tableMainButtonConfigs } from "@/utils/tableConfig";
import Image from "next/image";
import { useDataPermission } from "@/context";
import StatusBadge from "./status-component";
import ActionDropdownComponent from "./action-dropdown-component";
import formatCurrency from "@/utils/formatCurrency";
import Actions from "./actions";

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

  // const [contextMenued, setContextMenued] = useState<string | null>(null);

  // const contextMenuedActions = (rowId: string) => {
  //   setContextMenued((prevId) => (prevId === rowId ? null : rowId));
  // };

  console.log(activeRowId);

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
                  ? "sm:w-[60%]"
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
                  // onContextMenu={(e) => {
                  //   e.preventDefault(); // Prevents the default browser context menu
                  //   toggleActions(row.id);
                  //   contextMenuedActions(row.id);

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
                            "techniacianName"
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

      <div className="flex justify-center text-xs space-x-4 mt-4">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-100 text-black font-semibold rounded-md disabled:opacity-50"
        >
          Previous
        </button>

        {/* Page number buttons */}
        {totalPages ? (
          <>
            {" "}
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageClick(index + 1)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === index + 1
                    ? "bg-[#FBC2B61A] text-[#A8353A]"
                    : " text-gray-700 "
                }`}
              >
                {index + 1}
              </button>
            ))}
          </>
        ) : (
          <button
            className={`px-4 py-2 rounded-md ${
              currentPage !== 1
                ? "bg-[#FBC2B61A] text-[#A8353A]"
                : " text-gray-700 "
            }`}
          >
            {1}
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

// {type === "users" ? (
//   <>
//     <div className="relative">
//       {/* Button */}
//       <PermissionGuard
//         requiredPermissions={[
//           "delete_users:id",
//           "update_users:id",
//           "update_users:reset-password/admin",
//         ]}
//       >
//         <button
//           onClick={() => toggleActions(row.id)}
//           className="text-blue-500 hover:text-blue-700"
//         >
//           <TripleDotsIcon />
//         </button>
//       </PermissionGuard>

//       {/* Dropdown Menu */}
//       {activeRowId === row.id && (
//         <ActionDropdownComponent
//           toggleActions={() => toggleActions(null)}
//           // contextMenuedActions={() =>
//           //   contextMenuedActions(null)
//           // }
//           // contextMenued={contextMenued}
//         >
//           <ul className="py-2">
//             <li>
//               <DropdownButtonComponent
//                 text="Edit User"
//                 onClick={() =>
//                   setModalState("createUser")
//                 }
//                 permissions={["update_users:id"]}
//               />
//             </li>
//             <li>
//               <DropdownButtonComponent
//                 text="Reset Password"
//                 onClick={() =>
//                   setModalState("resetPassword")
//                 }
//                 permissions={[
//                   "update_users:reset-password/admin",
//                 ]}
//               />
//             </li>
//             <li>
//               {row.isDeactivated === false ? (
//                 <DropdownButtonComponent
//                   text="De-activate User"
//                   onClick={() =>
//                     setModalStateDelete("deleteUser")
//                   }
//                   permissions={["delete_users:id"]}
//                 />
//               ) : (
//                 <DropdownButtonComponent
//                   text="Re-activate User"
//                   onClick={() =>
//                     setModalStateDelete("activateUser")
//                   }
//                   permissions={["delete_users:id"]}
//                 />
//               )}
//             </li>
//           </ul>
//         </ActionDropdownComponent>
//       )}
//     </div>
//   </>
// ) : type === "approvers" ? (
//   <>
//     <div className="relative">
//       {/* Button */}
//       <PermissionGuard
//         requiredPermissions={[
//           "delete_users:id",
//           "update_users:id",
//           "update_users:reset-password/admin",
//         ]}
//       >
//         <button
//           onClick={() => toggleActions(row.id)}
//           className="text-blue-500 hover:text-blue-700"
//         >
//           <TripleDotsIcon />
//         </button>
//       </PermissionGuard>

//       {/* Dropdown Menu */}
//       {activeRowId === row.id && (
//         <ActionDropdownComponent
//           toggleActions={() => toggleActions(null)}
//         >
//           <ul className="py-2">
//             <li>
//               <DropdownButtonComponent
//                 text="Edit Approval Limit"
//                 onClick={() =>
//                   setModalState("editApprover")
//                 }
//                 permissions={["update_users:id"]}
//               />
//             </li>
//           </ul>
//         </ActionDropdownComponent>
//       )}
//     </div>
//   </>
// ) : type === "roles" ? (
//   <>
//     <div className="flex items-center space-x-2 w-full md:w-4/5 ">
//       <ButtonComponent
//         text="View Users"
//         onClick={() =>
//           router.push(`/user-management/${row?.id}`)
//         }
//         permissions={["read_roles:id"]}
//         className="px-2.5 py-1 h-[2.8rem] md:h-[2rem] text-sm text-gray-700 font-semibold bg-white border border-gray-200"
//       />

//       <ButtonComponent
//         text="View Permissions"
//         onClick={() => {
//           toggleActions(row.id);
//           setModalState("viewPermissions");
//         }}
//         permissions={["read_permissions"]}
//         className="px-2.5 py-1 h-[2.8rem] md:h-[2rem] text-sm text-gray-700 font-semibold bg-white border border-gray-200"
//       />

//       <ButtonComponent
//         text="Edit Role"
//         onClick={() => {
//           toggleActions(row.id);
//           setModalState("createRole");
//         }}
//         permissions={["update_roles:id"]}
//         className="px-2.5 py-1 h-[2.8rem] md:h-[2rem] text-sm text-gray-700 font-semibold bg-[#A8353A] text-white border border-gray-200 rounded-md"
//       />

//       <PermissionGuard
//         requiredPermissions={["delete_roles:id"]}
//       >
//         {row.users > 0 ? (
//           <div>
//             <TrashIconGray />
//           </div>
//         ) : (
//           <div
//             onClick={() => {
//               toggleActions(row.id);
//               setModalStateDelete("deleteRole");
//             }}
//           >
//             <TrashIcon />
//           </div>
//         )}
//       </PermissionGuard>
//     </div>
//   </>
// ) : type === "facilities" ? (
//   <>
//     <div className="relative">
//       {/* Button */}
//       <PermissionGuard
//         requiredPermissions={[
//           "delete_facilities:id",
//           "update_facilities:id",
//           "update_facilities:id/assign",
//           "read_facilities:id",
//         ]}
//       >
//         <button
//           onClick={() => toggleActions(row.id)}
//           className="text-blue-500 hover:text-blue-700"
//         >
//           <TripleDotsIcon />
//         </button>
//       </PermissionGuard>

//       {/* Dropdown Menu */}
//       {activeRowId === row.id && (
//         <ActionDropdownComponent
//           toggleActions={() => toggleActions(null)}
//         >
//           <ul className="py-2">
//             <li>
//               <DropdownButtonComponent
//                 text="View"
//                 onClick={() =>
//                   // setModalState("viewFacility")
//                   router.push(
//                     `/facility-management/entity/facility/${row.id}`
//                   )
//                 }
//                 permissions={["read_facilities:id"]}
//               />
//             </li>
//             <li>
//               <DropdownButtonComponent
//                 text="Edit"
//                 onClick={() =>
//                   setModalState("createFacility")
//                 }
//                 permissions={["update_facilities:id"]}
//               />
//             </li>
//             <li>
//               <DropdownButtonComponent
//                 text="Assign Users"
//                 onClick={() =>
//                   setModalState("assignUserToFacility")
//                 }
//                 permissions={[
//                   "update_facilities:id/assign",
//                 ]}
//               />
//             </li>
//             <li>
//               <DropdownButtonComponent
//                 text="Fund Wallet"
//                 onClick={() =>
//                   setModalState("fundWallet")
//                 }
//                 permissions={["update_facilities:id"]}
//               />
//             </li>
//             <li>
//               {row.isDeactivated === false ? (
//                 <DropdownButtonComponent
//                   text="Delete"
//                   onClick={() =>
//                     setModalStateDelete(
//                       "deleteFacility"
//                     )
//                   }
//                   permissions={["delete_facilities:id"]}
//                 />
//               ) : (
//                 <DropdownButtonComponent
//                   text="Delete"
//                   onClick={() =>
//                     setModalStateDelete(
//                       "deleteFacility"
//                     )
//                   }
//                   permissions={["delete_facilities:id"]}
//                 />
//               )}
//             </li>
//           </ul>
//         </ActionDropdownComponent>
//       )}
//     </div>
//   </>
// ) : type === "blocks" ? (
//   <>
//     <div className="relative">
//       {/* Button */}
//       <PermissionGuard
//         requiredPermissions={[
//           "delete_blocks:id",
//           "update_blocks:id",
//           "read_blocks:id",
//         ]}
//       >
//         <button
//           onClick={() => toggleActions(row.id)}
//           className="text-blue-500 hover:text-blue-700"
//         >
//           <TripleDotsIcon />
//         </button>
//       </PermissionGuard>

//       {/* Dropdown Menu */}
//       {activeRowId === row.id && (
//         <ActionDropdownComponent
//           toggleActions={() => toggleActions(null)}
//         >
//           <ul className="py-2">
//             <li>
//               <DropdownButtonComponent
//                 text="View"
//                 onClick={() =>
//                   // setModalState("viewBlock")
//                   router.push(
//                     `/facility-management/entity/block/${row.id}`
//                   )
//                 }
//                 permissions={["read_blocks:id"]}
//               />
//             </li>
//             <li>
//               <DropdownButtonComponent
//                 text="Edit"
//                 onClick={() =>
//                   setModalState("createBlock")
//                 }
//                 permissions={["update_blocks:id"]}
//               />
//             </li>
//             <li>
//               <DropdownButtonComponent
//                 text="Assign Users"
//                 onClick={() =>
//                   setModalState("assignUserToBlock")
//                 }
//                 permissions={["update_blocks:id"]}
//               />
//             </li>
//             <li>
//               {row.isDeactivated === false ? (
//                 <DropdownButtonComponent
//                   text="Delete"
//                   onClick={() =>
//                     setModalStateDelete("deleteBlock")
//                   }
//                   permissions={["delete_blocks:id"]}
//                 />
//               ) : (
//                 <DropdownButtonComponent
//                   text="Delete"
//                   onClick={() =>
//                     setModalStateDelete("deleteBlock")
//                   }
//                   permissions={["delete_blocks:id"]}
//                 />
//               )}
//             </li>
//           </ul>
//         </ActionDropdownComponent>
//       )}
//     </div>
//   </>
// ) : type === "units" ? (
//   <>
//     <div className="relative">
//       {/* Button */}
//       <PermissionGuard
//         requiredPermissions={[
//           "delete_units:id",
//           "update_units:id",
//           "read_units:id",
//         ]}
//       >
//         <button
//           onClick={() => toggleActions(row.id)}
//           className="text-blue-500 hover:text-blue-700"
//         >
//           <TripleDotsIcon />
//         </button>
//       </PermissionGuard>

//       {/* Dropdown Menu */}
//       {activeRowId === row.id && (
//         <ActionDropdownComponent
//           toggleActions={() => toggleActions(null)}
//         >
//           <ul className="py-2">
//             <li>
//               <DropdownButtonComponent
//                 text="View"
//                 onClick={() =>
//                   // setModalState("viewUnit")
//                   router.push(
//                     `/facility-management/entity/unit/${row.id}`
//                   )
//                 }
//                 permissions={["read_units:id"]}
//               />
//             </li>
//             <li>
//               <DropdownButtonComponent
//                 text="Edit"
//                 onClick={() =>
//                   setModalState("createUnit")
//                 }
//                 permissions={["update_units:id"]}
//               />
//             </li>
//             <li>
//               <DropdownButtonComponent
//                 text="Fund Wallet"
//                 onClick={() =>
//                   setModalState("fundWallet")
//                 }
//                 permissions={["update_units:id"]}
//               />
//             </li>
//             <li>
//               {row.isDeactivated === false ? (
//                 <DropdownButtonComponent
//                   text="Delete"
//                   onClick={() =>
//                     setModalStateDelete("deleteUnit")
//                   }
//                   permissions={["delete_units:id"]}
//                 />
//               ) : (
//                 <DropdownButtonComponent
//                   text="Delete"
//                   onClick={() =>
//                     setModalStateDelete("deleteUnit")
//                   }
//                   permissions={["delete_units:id"]}
//                 />
//               )}
//             </li>
//           </ul>
//         </ActionDropdownComponent>
//       )}
//     </div>
//   </>
// ) : type === "assets" ? (
//   <>
//     <div className="flex items-center space-x-2 w-full md:w-4/5 ">
//       <ButtonComponent
//         text="View Facilities"
//         onClick={() =>
//           router.push(`/facility-management/${row?.id}`)
//         }
//         permissions={["read_assets:id"]}
//         className="px-2.5 py-1 h-[2.8rem] md:h-[2rem] text-sm text-gray-700 font-semibold bg-white border border-gray-200"
//       />

//       <ButtonComponent
//         text="Edit Asset"
//         onClick={() => {
//           toggleActions(row.id);
//           setModalState("createAsset");
//         }}
//         permissions={["update_assets:id"]}
//         className="px-2.5 py-1 h-[2.8rem] md:h-[2rem] text-sm text-gray-700 font-semibold bg-[#A8353A] text-white border border-gray-200 rounded-md"
//       />

//       <PermissionGuard
//         requiredPermissions={["delete_assets:id"]}
//       >
//         {row.facilities.length > 0 ? (
//           <div>
//             <TrashIconGray />
//           </div>
//         ) : (
//           <div
//             onClick={() => {
//               toggleActions(row.id);
//               setModalStateDelete("deleteAsset");
//             }}
//           >
//             <TrashIcon />
//           </div>
//         )}
//       </PermissionGuard>
//     </div>
//   </>
// ) : type === "categories" ? (
//   <>
//     <div className="relative">
//       {/* Button */}
//       <PermissionGuard
//         requiredPermissions={[
//           "read_assets:/sub-category/all",
//           "read_assets:/category/sub-category/id",
//           "read_assets:/category/all",
//           "delete_assets:/sub-category/id",
//           ,
//           "delete_assets:/category/id",
//           "create_assets:/sub-category",
//         ]}
//       >
//         <button
//           onClick={() => toggleActions(row.id)}
//           className="text-blue-500 hover:text-blue-700"
//         >
//           <TripleDotsIcon />
//         </button>
//       </PermissionGuard>

//       {/* Dropdown Menu */}
//       {activeRowId === row.id && (
//         <ActionDropdownComponent
//           toggleActions={() => toggleActions(null)}
//         >
//           <ul className="py-2">
//             <li>
//               <DropdownButtonComponent
//                 text="View Category"
//                 onClick={() =>
//                   setModalState("viewAssetCategory")
//                 }
//                 permissions={[
//                   "read_assets:/category/all",
//                 ]}
//               />
//             </li>
//             <li>
//               <DropdownButtonComponent
//                 text="Create Sub Category"
//                 onClick={() =>
//                   setModalState("createAssetCategory")
//                 }
//                 permissions={[
//                   "create_assets:/sub-category",
//                 ]}
//               />
//             </li>
//           </ul>
//         </ActionDropdownComponent>
//       )}
//     </div>
//   </>
// ) : type === "vendors" ? (
//   <>
//     <div className="relative">
//       {/* Button */}
//       <PermissionGuard
//         requiredPermissions={[
//           "delete_vendors:id",
//           "update_vendors:id",
//         ]}
//       >
//         <button
//           onClick={() => toggleActions(row.id)}
//           className="text-blue-500 hover:text-blue-700"
//         >
//           <TripleDotsIcon />
//         </button>
//       </PermissionGuard>

//       {/* Dropdown Menu */}
//       {activeRowId === row.id && (
//         <ActionDropdownComponent
//           toggleActions={() => toggleActions(null)}
//         >
//           <ul className="py-2">
//             <li>
//               <DropdownButtonComponent
//                 text="Edit"
//                 onClick={() =>
//                   setModalState("createVendor")
//                 }
//                 permissions={["update_vendors:id"]}
//               />
//             </li>
//             <li>
//               <DropdownButtonComponent
//                 text="Delete"
//                 onClick={() =>
//                   setModalStateDelete("deleteVendor")
//                 }
//                 permissions={["delete_vendors:id"]}
//               />
//             </li>
//             <li>
//               {row.isDeactivated === false ? (
//                 <DropdownButtonComponent
//                   text="De-activate"
//                   onClick={() =>
//                     setModalStateDelete(
//                       "deactivateVendor"
//                     )
//                   }
//                   permissions={["delete_vendors:id"]}
//                 />
//               ) : (
//                 <DropdownButtonComponent
//                   text="Re-activate"
//                   onClick={() =>
//                     setModalStateDelete(
//                       "activateVendor"
//                     )
//                   }
//                   permissions={["delete_vendors:id"]}
//                 />
//               )}
//             </li>
//           </ul>
//         </ActionDropdownComponent>
//       )}
//     </div>
//   </>
// ) : type === "technicians" ? (
//   <>
//     <div className="relative">
//       {/* Button */}
//       <PermissionGuard
//         requiredPermissions={[
//           "delete_vendors:id",
//           "update_vendors:id",
//         ]}
//       >
//         <button
//           onClick={() => toggleActions(row.id)}
//           className="text-blue-500 hover:text-blue-700"
//         >
//           <TripleDotsIcon />
//         </button>
//       </PermissionGuard>

//       {/* Dropdown Menu */}
//       {activeRowId === row.id && (
//         <ActionDropdownComponent
//           toggleActions={() => toggleActions(null)}
//         >
//           <ul className="py-2">
//             <li>
//               <DropdownButtonComponent
//                 text="Edit"
//                 onClick={() =>
//                   setModalState("createTechnician")
//                 }
//                 permissions={["update_vendors:id"]}
//               />
//             </li>
//             <li>
//               <DropdownButtonComponent
//                 text="Delete"
//                 onClick={() =>
//                   setModalStateDelete(
//                     "deleteTechnician"
//                   )
//                 }
//                 permissions={["delete_vendors:id"]}
//               />
//             </li>
//             <li>
//               {row.isDeactivated === false ? (
//                 <DropdownButtonComponent
//                   text="De-activate"
//                   onClick={() =>
//                     setModalStateDelete(
//                       "deactivateTechnician"
//                     )
//                   }
//                   permissions={["delete_vendors:id"]}
//                 />
//               ) : (
//                 <DropdownButtonComponent
//                   text="Re-activate"
//                   onClick={() =>
//                     setModalStateDelete(
//                       "activateTechnician"
//                     )
//                   }
//                   permissions={["delete_vendors:id"]}
//                 />
//               )}
//             </li>
//           </ul>
//         </ActionDropdownComponent>
//       )}
//     </div>
//   </>
// ) : type === "powers" ? (
//   <>
//     <div className="relative">
//       {/* Button */}
//       <PermissionGuard
//         requiredPermissions={[
//           "read_power-charges:id",
//           "update_power-charges:id",
//           "update_power-charges:id/apportion",
//         ]}
//       >
//         <button
//           onClick={() => toggleActions(row.id)}
//           className="text-blue-500 hover:text-blue-700"
//         >
//           <TripleDotsIcon />
//         </button>
//       </PermissionGuard>

//       {/* Dropdown Menu */}
//       {activeRowId === row.id && (
//         <ActionDropdownComponent
//           toggleActions={() => toggleActions(null)}
//         >
//           <ul className="py-2">
//             <li>
//               <DropdownButtonComponent
//                 text="View"
//                 onClick={() =>
//                   // setModalState("viewPowerCharge")
//                   router.push(`/power/${row.id}`)
//                 }
//                 permissions={["read_power-charges:id"]}
//               />
//             </li>
//             <li>
//               <DropdownButtonComponent
//                 text="Edit"
//                 onClick={() =>
//                   setModalState("createPowerCharge")
//                 }
//                 permissions={[
//                   "update_power-charges:id",
//                 ]}
//               />
//             </li>

//             <li>
//               <DropdownButtonComponent
//                 text="Apportion"
//                 onClick={() =>
//                   setModalStateDelete(
//                     "apportionPowerCharge"
//                   )
//                 }
//                 permissions={[
//                   "update_power-charges:id/apportion",
//                 ]}
//               />
//             </li>
//             <li>
//               <DropdownButtonComponent
//                 text="Delete"
//                 onClick={() =>
//                   setModalStateDelete(
//                     "deletePowerCharge"
//                   )
//                 }
//                 permissions={[
//                   "delete_power-charges:id",
//                 ]}
//               />
//             </li>
//           </ul>
//         </ActionDropdownComponent>
//       )}
//     </div>
//   </>
// ) : type === "workrequests" ? (
//   <>
//     <div className="relative">
//       {/* Button */}
//       <PermissionGuard
//         requiredPermissions={[
//           "create_work-requests",
//           "read_work-requests:id",
//         ]}
//       >
//         <button
//           onClick={() => toggleActions(row.id)}
//           className="text-blue-500 hover:text-blue-700"
//         >
//           <TripleDotsIcon />
//         </button>
//       </PermissionGuard>

//       {/* Dropdown Menu */}
//       {activeRowId === row.id && (
//         <ActionDropdownComponent
//           toggleActions={() => toggleActions(null)}
//         >
//           <ul className="py-2">
//             <li>
//               <DropdownButtonComponent
//                 text="View"
//                 onClick={() =>
//                   // setModalState("viewWorkRequest")
//                   router.push(
//                     `/work-requests/${row.id}`
//                   )
//                 }
//                 permissions={["read_work-requests:id"]}
//               />
//             </li>

//             <li>
//               <DropdownButtonComponent
//                 text="Comment"
//                 onClick={() =>
//                   setModalState("commentWorkRequest")
//                 }
//                 permissions={[
//                   "update_work-requests:id/comments",
//                 ]}
//               />
//             </li>

//             <li>
//               <DropdownButtonComponent
//                 text="Update Status"
//                 onClick={() =>
//                   setModalState(
//                     "updateStatusWorkRequest"
//                   )
//                 }
//                 permissions={[
//                   "update_work-requests:id/status/reject",
//                   "update_work-requests:id/status/close",
//                 ]}
//               />
//             </li>

//             <li>
//               <DropdownButtonComponent
//                 text="Assign to Procurement"
//                 onClick={() =>
//                   setModalStateDelete(
//                     "assignProcurement"
//                   )
//                 }
//                 permissions={[
//                   "update_work-requests:id/assign/to-procurement",
//                 ]}
//               />
//             </li>
//             {row.amount > 0 && (
//               <li>
//                 <DropdownButtonComponent
//                   text="Apportion Cost"
//                   onClick={() =>
//                     setModalStateDelete(
//                       "apportionServiceCharge"
//                     )
//                   }
//                   permissions={[
//                     "update_work-requests:id/apportion/service-charge",
//                   ]}
//                 />
//               </li>
//             )}
//           </ul>
//         </ActionDropdownComponent>
//       )}
//     </div>
//   </>
// ) : type === "workorders" ? (
//   <>
//     <div className="relative">
//       {/* Button */}
//       <PermissionGuard
//         requiredPermissions={[
//           "create_work-orders",
//           "create_work-requests:/work-order",
//         ]}
//       >
//         <button
//           onClick={() => toggleActions(row.id)}
//           className="text-blue-500 hover:text-blue-700"
//         >
//           <TripleDotsIcon />
//         </button>
//       </PermissionGuard>

//       {/* Dropdown Menu */}
//       {activeRowId === row.id && (
//         <ActionDropdownComponent
//           toggleActions={() => toggleActions(null)}
//         >
//           <ul className="py-2">
//             <li>
//               <DropdownButtonComponent
//                 text="View"
//                 onClick={() =>
//                   // setModalState("viewWorkOrder")
//                   router.push(`/work-orders/${row.id}`)
//                 }
//                 permissions={["read_work-requests:id"]}
//               />
//             </li>

//             <li>
//               <DropdownButtonComponent
//                 text="Comment"
//                 onClick={() =>
//                   setModalState("commentWorkOrder")
//                 }
//                 permissions={[
//                   "update_work-requests:id/comments",
//                 ]}
//               />
//             </li>

//             <li>
//               <DropdownButtonComponent
//                 text="Accept Request"
//                 onClick={() =>
//                   setModalStateDelete("acceptWorkOrder")
//                 }
//                 permissions={[
//                   "update_work-requests:id/accept/work-order-by-procurement",
//                 ]}
//               />
//             </li>

//             <li>
//               <DropdownButtonComponent
//                 text="Add Quotations"
//                 onClick={() =>
//                   setModalState("quotationsWorkOrder")
//                 }
//                 permissions={[
//                   "update_work-requests:id/upload-quotation",
//                 ]}
//               />
//             </li>

//             <li>
//               <DropdownButtonComponent
//                 text="Request Quotation Selection"
//                 onClick={() =>
//                   setModalStateDelete(
//                     "requestquotationsselection"
//                   )
//                 }
//                 permissions={[
//                   "update_work-requests:id/quotations/request-quotation-selection",
//                 ]}
//               />
//             </li>

//             <li>
//               <DropdownButtonComponent
//                 text="Select Quotation"
//                 onClick={() =>
//                   setModalState("acceptQuotation")
//                 }
//                 permissions={[
//                   "update_work-requests:id/accept-quotation/quotationId",
//                 ]}
//               />
//             </li>

//             <li>
//               <DropdownButtonComponent
//                 text="Request Quotation Approval"
//                 onClick={() =>
//                   setModalState(
//                     "requestquotationsapproval"
//                   )
//                 }
//                 permissions={[
//                   "update_work-requests:id/quotations/request-quotation-approval",
//                 ]}
//               />
//             </li>

//             <li>
//               <DropdownButtonComponent
//                 text="Approve Quotation"
//                 onClick={() =>
//                   setModalStateDelete(
//                     "approveQuotation"
//                   )
//                 }
//                 permissions={[
//                   "update_work-requests:id/quotations/approve-quotation",
//                 ]}
//               />
//             </li>

//             <li>
//               <DropdownButtonComponent
//                 text="Raise Purchase Order"
//                 onClick={() =>
//                   setModalStateDelete(
//                     "raisePaymentOrder"
//                   )
//                 }
//                 permissions={[
//                   "update_work-requests:id/quotations/raise-payment-order",
//                 ]}
//               />
//             </li>

//             <li>
//               <DropdownButtonComponent
//                 text="Close"
//                 onClick={() =>
//                   setModalState("closeWorkOrder")
//                 }
//                 permissions={[
//                   "update_work-requests:id/status/close",
//                 ]}
//               />
//             </li>

//             {row.amount > 0 && (
//               <>
//                 <li>
//                   <DropdownButtonComponent
//                     text="View and Approve Apportionment"
//                     onClick={() =>
//                       setModalState("viewServiceCharge")
//                     }
//                     permissions={[
//                       "update_work-requests:id/apportion/service-charge/approve",
//                     ]}
//                   />
//                 </li>
//                 <li>
//                   <DropdownButtonComponent
//                     text="Apportion Cost"
//                     onClick={() =>
//                       setModalStateDelete(
//                         "apportionServiceCharge"
//                       )
//                     }
//                     permissions={[
//                       "update_work-requests:id/apportion/service-charge",
//                     ]}
//                   />
//                 </li>
//               </>
//             )}
//           </ul>
//         </ActionDropdownComponent>
//       )}
//     </div>
//   </>
// ) : type === "bills" ? (
//   <div className="flex items-center space-x-5">
//     {!row.isPaid && (
//       <div className="flex items-center space-x-2 w-full md:w-full ">
//         <ButtonComponent
//           text="Pay"
//           onClick={() => {
//             toggleActions(row.id);
//             setModalStateDelete("payBills");
//           }}
//           permissions={["update_bills:id/pay"]}
//           className="px-2.5 py-1 h-[2.8rem] md:h-[2rem] text-sm text-gray-700 font-semibold bg-[#A8353A] text-white border border-gray-200 rounded-md"
//         />
//       </div>
//     )}

//     <div className="flex items-center space-x-2 w-full md:w-full ">
//       <ButtonComponent
//         text="View"
//         onClick={() => {
//           toggleActions(row.id);
//           setModalState("viewBills");
//         }}
//         permissions={["read_bills:id"]}
//         className="px-2.5 py-1 h-[2.8rem] md:h-[2rem] text-sm text-gray-700 font-semibold bg-[#A8353A] text-white border border-gray-200 rounded-md"
//       />
//     </div>
//   </div>
// ) : type === "transactions" ? (
//   <div className="flex items-center space-x-5">
//     <div className="flex items-center space-x-2 w-full md:w-4/5 ">
//       <ButtonComponent
//         text="View"
//         onClick={() => {
//           toggleActions(row.id);
//           router.push(`/transaction/${row.id}`);
//         }}
//         permissions={["read_bills:id"]}
//         className="px-2.5 py-1 h-[2.8rem] md:h-[2rem] text-sm text-gray-700 font-semibold bg-white text-[#A8353A] border border-gray-200 rounded-md"
//       />
//     </div>
//   </div>
// ) : (
//   <>
//     <div className="flex items-center space-x-2">
//       {/* Additional Condition */}
//       <ButtonComponent
//         text="Custom Action"
//         onClick={() =>
//           console.log("Perform custom action")
//         }
//         permissions={["custom_action_permission"]}
//         className="px-2.5 py-1 h-[2.8rem] md:h-[2rem] text-sm text-gray-700 font-semibold bg-green-500 text-white border border-gray-200 rounded-md"
//       />
//     </div>
//   </>
// )}
