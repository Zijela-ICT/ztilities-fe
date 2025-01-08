"use client";
import {
  DropDownArrow,
  SearchIcon,
  TrashIcon,
  TrashIconGray,
  TripleDotsIcon,
} from "@/utils/svg";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ButtonComponent, { DropdownButtonComponent } from "./button-component";
import PermissionGuard from "./auth/permission-protected-components";
import { tableMainButtonConfigs } from "@/utils/tableConfig";

interface TableProps {
  data: Record<string, any>[];
  type?: string;
  setModalState?: any;
  setModalStateDelete?: any;
  toggleActions?: any;
  activeRowId?: any;
  setActiveRowId?: any;
  deleteAction?: any;
}

export default function TableComponent({
  data,
  type,
  setModalState,
  setModalStateDelete,
  toggleActions,
  activeRowId,
  setActiveRowId,
}: TableProps) {
  const router = useRouter(); // Get the dynamic route parameters

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 7;

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
  const currentItems = filteredData?.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

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

  return (
    <div className="p-4">
      <div className="flex sm:flex-row flex-col items-center md:space-x-2 space-x-0 space-y-2 md:space-y-0  font-semibold text-md mb-4">
        <div
          className={`flex items-center border rounded-md focus-within:ring-2 focus-within:ring-blue-500 w-full ${
            type === "users" ? "sm:w-[65%]" : "sm:w-[70%]"
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
      {/* button here based on types */}

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg border border-gray-100 min-h-[40vh]">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-100 text-left">
            <tr className="relative">
              {columns
                .filter(
                  (column) =>
                    column !== "id" &&
                    column !== "createdAt" &&
                    column !== "updatedAt" &&
                    column !== "avatar" &&
                    column !== "assets" &&
                    column !== "user"
                ) // Exclude the specified columns
                .map((column) => (
                  <th key={column} className="py-3 px-4">
                    {column === "isDeactivated"
                      ? "Status"
                      : // : column === "user"
                        // ? "Client"
                        column.charAt(0).toUpperCase() + column.slice(1)}
                  </th>
                ))}

              <th className="py-3 px-4 ">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems?.map((row: any, index) => (
              <tr key={index} className="border-b border-gray-100 h-20">
                {/* {columns
                  .filter(
                    (column) =>
                      column !== "id" &&
                      column !== "createdAt" &&
                      column !== "updatedAt" &&
                      column !== "avatar"
                  )
                  .map((column) => (
                    <td key={column} className="py-3 px-4">
                      {Array.isArray(row[column]) ? (
                        // Handle array case, extract specific properties
                        row[column]
                          .map((item: any) =>
                            ["name", "blockNumber", "unitNumber", "assetName"]
                              .map((prop) => item[prop])
                              .filter(Boolean)
                              .join(", ")
                          )
                          .join(", ")
                      ) : typeof row[column] === "object" &&
                        row[column] !== null ? (
                        // Handle single object case, extract specific properties
                        ["name", "blockNumber", "unitNumber", "assetName"]
                          .map((prop) => row[column][prop])
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
                      ) : column === "status" ? (
                        // Handle status column
                        <span
                          className={`px-2.5 py-1 ${
                            row[column] === "Approved"
                              ? "text-[#036B26] bg-[#E7F6EC]"
                              : "text-[#B76E00] bg-[#FFAB0014]"
                          } rounded-full `}
                        >
                          {row[column]?.toString()}
                        </span>
                      ) : (
                        // Default case for other columns
                        row[column]?.toString()
                      )}
                    </td>
                  ))} */}
                {columns
                  .filter(
                    (column) =>
                      column !== "id" &&
                      column !== "createdAt" &&
                      column !== "updatedAt" &&
                      column !== "avatar" &&
                      column !== "assets" &&
                      column !== "user"
                  )
                  .map((column) => (
                    <td key={column} className="py-3 px-4">
                      {Array.isArray(row[column]) ? (
                        type === "assets" ? (
                          // Show the length of the array for specific types
                          row[column].length
                        ) : (
                          // Handle array case, extract specific properties
                          row[column]
                            .map((item: any) =>
                              ["name", "blockNumber", "unitNumber", "assetName"]
                                .map((prop) => item[prop])
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
                        ]
                          .map((prop) => row[column][prop])
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
                        // Handle status column
                        <span
                          className={`px-2.5 py-1 ${
                            row[column] === "Approved"
                              ? "text-[#036B26] bg-[#E7F6EC]"
                              : "text-[#B76E00] bg-[#FFAB0014]"
                          } rounded-full `}
                        >
                          {row[column]?.toString()}
                        </span>
                      ) : (
                        // Default case for other columns
                        row[column]?.toString()
                      )}
                    </td>
                  ))}

                {/* Actions based on type */}
                <td className="py-3 px-4">
                  {type === "users" ? (
                    <>
                      <div className="relative">
                        {/* Button */}
                        <PermissionGuard
                          requiredPermissions={[
                            "delete_users:id",
                            "update_users:id",
                            "update_users:reset-password/admin",
                          ]}
                        >
                          <button
                            onClick={() => toggleActions(row.id)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <TripleDotsIcon />
                          </button>
                        </PermissionGuard>

                        {/* Dropdown Menu */}
                        {activeRowId === row.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white z-40 border border-gray-200 rounded-2xl shadow-sm">
                            <ul className="py-2">
                              <li>
                                <DropdownButtonComponent
                                  text="Edit User"
                                  onClick={() => setModalState("createUser")}
                                  permissions={["update_users:id"]}
                                />
                              </li>
                              <li>
                                <DropdownButtonComponent
                                  text="Reset Password"
                                  onClick={() => setModalState("resetPassword")}
                                  permissions={[
                                    "update_users:reset-password/admin",
                                  ]}
                                />
                              </li>
                              <li>
                                {row.isDeactivated === false ? (
                                  <DropdownButtonComponent
                                    text="De-activate User"
                                    onClick={() =>
                                      setModalStateDelete("deleteUser")
                                    }
                                    permissions={["delete_users:id"]}
                                  />
                                ) : (
                                  <DropdownButtonComponent
                                    text="Re-activate User"
                                    onClick={() =>
                                      setModalStateDelete("activateUser")
                                    }
                                    permissions={["delete_users:id"]}
                                  />
                                )}
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </>
                  ) : type === "roles" ? (
                    <>
                      <div className="flex items-center space-x-2 w-full md:w-4/5 ">
                        <ButtonComponent
                          text="View Users"
                          onClick={() =>
                            router.push(`/user-management/${row?.id}`)
                          }
                          permissions={["read_roles:id"]}
                          className="px-2.5 py-1 h-[2.8rem] md:h-[2rem] text-sm text-gray-700 font-semibold bg-white border border-gray-200"
                        />

                        <ButtonComponent
                          text="View Permissions"
                          onClick={() => {
                            toggleActions(row.id);
                            setModalState("viewPermissions");
                          }}
                          permissions={["read_permissions"]}
                          className="px-2.5 py-1 h-[2.8rem] md:h-[2rem] text-sm text-gray-700 font-semibold bg-white border border-gray-200"
                        />

                        <ButtonComponent
                          text="Edit Role"
                          onClick={() => {
                            toggleActions(row.id);
                            setModalState("createRole");
                          }}
                          permissions={["update_roles:id"]}
                          className="px-2.5 py-1 h-[2.8rem] md:h-[2rem] text-sm text-gray-700 font-semibold bg-[#A8353A] text-white border border-gray-200 rounded-md"
                        />

                        <PermissionGuard
                          requiredPermissions={["delete_roles:id"]}
                        >
                          {row.users > 0 ? (
                            <div>
                              <TrashIconGray />
                            </div>
                          ) : (
                            <div
                              onClick={() => {
                                toggleActions(row.id);
                                setModalStateDelete("deleteRole");
                              }}
                            >
                              <TrashIcon />
                            </div>
                          )}
                        </PermissionGuard>
                      </div>
                    </>
                  ) : type === "facilities" ? (
                    <>
                      <div className="relative">
                        {/* Button */}
                        <PermissionGuard
                          requiredPermissions={[
                            "delete_facilities:id",
                            "update_facilities:id",
                            "update_facilities:id/assign",
                            "read_facilities:id",
                          ]}
                        >
                          <button
                            onClick={() => toggleActions(row.id)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <TripleDotsIcon />
                          </button>
                        </PermissionGuard>

                        {/* Dropdown Menu */}
                        {activeRowId === row.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white z-40 border border-gray-200 rounded-2xl shadow-sm">
                            <ul className="py-2">
                              <li>
                                <DropdownButtonComponent
                                  text="View"
                                  onClick={() => setModalState("viewFacility")}
                                  permissions={["read_facilities:id"]}
                                />
                              </li>
                              <li>
                                <DropdownButtonComponent
                                  text="Edit"
                                  onClick={() =>
                                    setModalState("createFacility")
                                  }
                                  permissions={["update_facilities:id"]}
                                />
                              </li>
                              <li>
                                {row.isDeactivated === false ? (
                                  <DropdownButtonComponent
                                    text="Delete"
                                    onClick={() =>
                                      setModalStateDelete("deleteFacility")
                                    }
                                    permissions={["delete_facilities:id"]}
                                  />
                                ) : (
                                  <DropdownButtonComponent
                                    text="Delete"
                                    onClick={() =>
                                      setModalStateDelete("deleteFacility")
                                    }
                                    permissions={["delete_facilities:id"]}
                                  />
                                )}
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </>
                  ) : type === "blocks" ? (
                    <>
                      <div className="relative">
                        {/* Button */}
                        <PermissionGuard
                          requiredPermissions={[
                            "delete_blocks:id",
                            "update_blocks:id",
                            "read_blocks:id",
                          ]}
                        >
                          <button
                            onClick={() => toggleActions(row.id)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <TripleDotsIcon />
                          </button>
                        </PermissionGuard>

                        {/* Dropdown Menu */}
                        {activeRowId === row.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white z-40 border border-gray-200 rounded-2xl shadow-sm">
                            <ul className="py-2">
                              <li>
                                <DropdownButtonComponent
                                  text="View"
                                  onClick={() => setModalState("viewBlock")}
                                  permissions={["read_blocks:id"]}
                                />
                              </li>
                              <li>
                                <DropdownButtonComponent
                                  text="Edit"
                                  onClick={() => setModalState("createBlock")}
                                  permissions={["update_blocks:id"]}
                                />
                              </li>
                              <li>
                                {row.isDeactivated === false ? (
                                  <DropdownButtonComponent
                                    text="Delete"
                                    onClick={() =>
                                      setModalStateDelete("deleteBlock")
                                    }
                                    permissions={["delete_blocks:id"]}
                                  />
                                ) : (
                                  <DropdownButtonComponent
                                    text="Delete"
                                    onClick={() =>
                                      setModalStateDelete("deleteBlock")
                                    }
                                    permissions={["delete_blocks:id"]}
                                  />
                                )}
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </>
                  ) : type === "units" ? (
                    <>
                      <div className="relative">
                        {/* Button */}
                        <PermissionGuard
                          requiredPermissions={[
                            "delete_units:id",
                            "update_units:id",
                            "read_units:id",
                          ]}
                        >
                          <button
                            onClick={() => toggleActions(row.id)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <TripleDotsIcon />
                          </button>
                        </PermissionGuard>

                        {/* Dropdown Menu */}
                        {activeRowId === row.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white z-40 border border-gray-200 rounded-2xl shadow-sm">
                            <ul className="py-2">
                              <li>
                                <DropdownButtonComponent
                                  text="View"
                                  onClick={() => setModalState("viewUnit")}
                                  permissions={["read_units:id"]}
                                />
                              </li>
                              <li>
                                <DropdownButtonComponent
                                  text="Edit"
                                  onClick={() => setModalState("createUnit")}
                                  permissions={["update_units:id"]}
                                />
                              </li>
                              <li>
                                {row.isDeactivated === false ? (
                                  <DropdownButtonComponent
                                    text="Delete"
                                    onClick={() =>
                                      setModalStateDelete("deleteUnit")
                                    }
                                    permissions={["delete_units:id"]}
                                  />
                                ) : (
                                  <DropdownButtonComponent
                                    text="Delete"
                                    onClick={() =>
                                      setModalStateDelete("deleteUnit")
                                    }
                                    permissions={["delete_units:id"]}
                                  />
                                )}
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </>
                  ) : type === "assets" ? (
                    <>
                      <div className="flex items-center space-x-2 w-full md:w-4/5 ">
                        <ButtonComponent
                          text="View Facilities"
                          onClick={() =>
                            router.push(`/facility-management/${row?.id}`)
                          }
                          permissions={["read_assets:id"]}
                          className="px-2.5 py-1 h-[2.8rem] md:h-[2rem] text-sm text-gray-700 font-semibold bg-white border border-gray-200"
                        />

                        <ButtonComponent
                          text="Edit Asset"
                          onClick={() => {
                            toggleActions(row.id);
                            setModalState("createAsset");
                          }}
                          permissions={["update_assets:id"]}
                          className="px-2.5 py-1 h-[2.8rem] md:h-[2rem] text-sm text-gray-700 font-semibold bg-[#A8353A] text-white border border-gray-200 rounded-md"
                        />

                        <PermissionGuard
                          requiredPermissions={["delete_assets:id"]}
                        >
                          {row.facilities.length > 0 ? (
                            <div>
                              <TrashIconGray />
                            </div>
                          ) : (
                            <div
                              onClick={() => {
                                toggleActions(row.id);
                                setModalStateDelete("deleteAsset");
                              }}
                            >
                              <TrashIcon />
                            </div>
                          )}
                        </PermissionGuard>
                      </div>
                    </>
                  ) : type === "vendors" ? (
                    <>
                      <div className="relative">
                        {/* Button */}
                        <PermissionGuard
                          requiredPermissions={[
                            "delete_vendors:id",
                            "update_vendors:id",
                          ]}
                        >
                          <button
                            onClick={() => toggleActions(row.id)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <TripleDotsIcon />
                          </button>
                        </PermissionGuard>

                        {/* Dropdown Menu */}
                        {activeRowId === row.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white z-40 border border-gray-200 rounded-2xl shadow-sm">
                            <ul className="py-2">
                              <li>
                                <DropdownButtonComponent
                                  text="Edit"
                                  onClick={() => setModalState("createVendor")}
                                  permissions={["update_vendors:id"]}
                                />
                              </li>
                              <li>
                                <DropdownButtonComponent
                                  text="Delete"
                                  onClick={() =>
                                    setModalStateDelete("deleteVendor")
                                  }
                                  permissions={["delete_vendors:id"]}
                                />
                              </li>
                              <li>
                                {row.isDeactivated === false ? (
                                  <DropdownButtonComponent
                                    text="De-activate"
                                    onClick={() =>
                                      setModalStateDelete("deactivateVendor")
                                    }
                                    permissions={["delete_vendors:id"]}
                                  />
                                ) : (
                                  <DropdownButtonComponent
                                    text="Re-activate"
                                    onClick={() =>
                                      setModalStateDelete("activateVendor")
                                    }
                                    permissions={["delete_vendors:id"]}
                                  />
                                )}
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </>
                  ) : type === "technicians" ? (
                    <>
                      <div className="relative">
                        {/* Button */}
                        <PermissionGuard
                          requiredPermissions={[
                            "delete_vendors:id",
                            "update_vendors:id",
                          ]}
                        >
                          <button
                            onClick={() => toggleActions(row.id)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <TripleDotsIcon />
                          </button>
                        </PermissionGuard>

                        {/* Dropdown Menu */}
                        {activeRowId === row.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white z-40 border border-gray-200 rounded-2xl shadow-sm">
                            <ul className="py-2">
                              <li>
                                <DropdownButtonComponent
                                  text="Edit"
                                  onClick={() =>
                                    setModalState("createTechnician")
                                  }
                                  permissions={["update_vendors:id"]}
                                />
                              </li>
                              <li>
                                <DropdownButtonComponent
                                  text="Delete"
                                  onClick={() =>
                                    setModalStateDelete("deleteTechnician")
                                  }
                                  permissions={["delete_vendors:id"]}
                                />
                              </li>
                              <li>
                                {row.isDeactivated === false ? (
                                  <DropdownButtonComponent
                                    text="De-activate"
                                    onClick={() =>
                                      setModalStateDelete(
                                        "deactivateTechnician"
                                      )
                                    }
                                    permissions={["delete_vendors:id"]}
                                  />
                                ) : (
                                  <DropdownButtonComponent
                                    text="Re-activate"
                                    onClick={() =>
                                      setModalStateDelete("activateTechnician")
                                    }
                                    permissions={["delete_vendors:id"]}
                                  />
                                )}
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </>
                  ) : type === "workrequests" ? (
                    <>
                      <div className="relative">
                        {/* Button */}
                        <PermissionGuard
                          requiredPermissions={[
                            "create_work-requests",
                            "update_work-requests:id/status",
                          ]}
                        >
                          <button
                            onClick={() => toggleActions(row.id)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <TripleDotsIcon />
                          </button>
                        </PermissionGuard>

                        {/* Dropdown Menu */}
                        {activeRowId === row.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white z-40 border border-gray-200 rounded-2xl shadow-sm">
                            <ul className="py-2">
                              <li>
                                <DropdownButtonComponent
                                  text="View"
                                  onClick={() =>
                                    setModalState("viewWorkRequest")
                                  }
                                  permissions={["create_work-requests"]}
                                />
                              </li>
                              <li>
                                <DropdownButtonComponent
                                  text="Edit"
                                  onClick={() =>
                                    setModalState("createWorkRequest")
                                  }
                                  permissions={[
                                    "update_work-requests:id/status",
                                  ]}
                                />
                              </li>
                              <li>
                                {row.isDeactivated === false ? (
                                  <DropdownButtonComponent
                                    text="De-activate"
                                    onClick={() =>
                                      setModalStateDelete(
                                        "deactivateWorkRequest"
                                      )
                                    }
                                    permissions={["create_work-requests"]}
                                  />
                                ) : (
                                  <DropdownButtonComponent
                                    text="Re-activate"
                                    onClick={() =>
                                      setModalStateDelete("activateWorkRequest")
                                    }
                                    permissions={["create_work-requests"]}
                                  />
                                )}
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center space-x-2">
                        {/* Additional Condition */}
                        <ButtonComponent
                          text="Custom Action"
                          onClick={() => console.log("Perform custom action")}
                          permissions={["custom_action_permission"]}
                          className="px-2.5 py-1 h-[2.8rem] md:h-[2rem] text-sm text-gray-700 font-semibold bg-green-500 text-white border border-gray-200 rounded-md"
                        />
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center text-sm space-x-4 mt-4">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-100 text-black font-semibold rounded-md disabled:opacity-50"
        >
          Previous
        </button>

        {/* Page number buttons */}
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
