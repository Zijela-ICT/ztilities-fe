"use client";
import { SearchIcon, TrashIcon, TripleDotsIcon } from "@/utils/svg";
import { useState } from "react";

interface TableProps {
  data: Record<string, any>[];
  type?: string;
  setModalStateUser?: any;
  setModalStateResetPassword?: any;
  setModalStateRole?: any;
  setModalStateBulkUser?: any;
  toggleActions?: any;
  activeRowId?: any;
  setActiveRowId?: any;
  deleteAction?: any;
}

export default function TableComponent({
  data,
  type,
  setModalStateUser,
  setModalStateResetPassword,
  setModalStateRole,
  setModalStateBulkUser,
  toggleActions,
  activeRowId,
  setActiveRowId,
  deleteAction,
}: TableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const handleSearch = (event: any) => {
    setSearchQuery(event.target.value);
  };

  // Filtered data based on search query
  const filteredData = data?.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
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
      <div className="flex sm:flex-row flex-col items-center md:space-x-2 space-x-0 space-y-2 md:space-y-0  font-semibold text-base mb-4">
        <div
          className={`flex items-center border rounded-md focus-within:ring-2 focus-within:ring-blue-500 w-full ${
            type === "users" ? "sm:w-[65%]" : "sm:w-[75%]"
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

        {type === "users" && (
          <>
            <button
              onClick={() => {
                setModalStateUser(true);
                setActiveRowId(null);
              }}
              className="flex-1 px-4 py-3 text-white bg-[#A8353A] rounded-md w-full "
            >
              Create User
            </button>
            <button
              onClick={setModalStateBulkUser}
              className="flex-1 px-4 py-3 text-[#A8353A] bg-white rounded-md w-full border border-[#A8353A] "
            >
              Bulk User
            </button>
          </>
        )}
        {type === "roles" && (
          <button
            onClick={setModalStateRole}
            className="flex-1 px-4 py-3 text-white bg-[#A8353A] rounded-md w-full  "
          >
            Create Role
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg border border-gray-100 min-h-[60vh]">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-left">
            <tr>
              {columns.map((column) => (
                <th key={column} className="py-3 px-4">
                  {column.charAt(0).toUpperCase() + column.slice(1)}
                </th>
              ))}
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems?.map((row: any, index) => (
              <tr key={index} className="border-b border-gray-100 h-24">
                {columns.map((column) => (
                  <td key={column} className="py-3 px-4">
                    {Array.isArray(row[column]) ? (
                      // Handle array case, join all names if array exists
                      row[column].map((item: any) => item.name).join(", ")
                    ) : row[column]?.name ? (
                      // Handle single object case
                      row[column].name
                    ) : column === "status" ? (
                      // Handle status column
                      <span
                        className={`px-2.5 py-1 ${
                          row[column] === "Approved"
                            ? "text-[#036B26] bg-[#E7F6EC]"
                            : "text-[#B76E00] bg-[#FFAB0014]"
                        } rounded-full `}
                      >
                        {row[column]}
                      </span>
                    ) : (
                      // Default case for other columns
                      row[column]?.toString()
                    )}
                  </td>
                ))}

                <td className="py-3 px-4">
                  {type === "users" ? (
                    <>
                      <div className="relative">
                        {/* Button */}
                        <button
                          onClick={() => toggleActions(row.id)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <TripleDotsIcon />
                        </button>

                        {/* Dropdown Menu */}
                        {activeRowId === row.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                            <ul className="py-2">
                              <li>
                                <button
                                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                  onClick={setModalStateUser}
                                >
                                  Edit User
                                </button>
                              </li>
                              <li>
                                <button
                                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                  onClick={setModalStateResetPassword}
                                >
                                  Reset Password
                                </button>
                              </li>
                              <li>
                                <button
                                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                  onClick={deleteAction}
                                >
                                  Delete User
                                </button>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center space-x-2">
                        <button className="px-2.5 py-1 text-gray-700 font-semibold bg-white border border-gray-200 rounded-md   ">
                          View Users
                        </button>
                        <div onClick={() => toggleActions(row.id)}>
                          <TrashIcon />
                        </div>
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
      <div className="flex justify-center space-x-4 mt-4">
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
