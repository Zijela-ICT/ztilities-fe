"use client";
import { useState } from "react";

interface TableProps {
  data: Record<string, any>[];
  type?: string;
}

export default function TableComponent({ data, type }: TableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleSearch = (event: any) => {
    setSearchQuery(event.target.value);
  };

  // Filtered data based on search query
  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Paginated data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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

  const columns = Object.keys(data[0] || {});

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
            <svg
              width="38"
              height="38"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.33331 1.3335C10.6453 1.3335 13.3333 4.0215 13.3333 7.3335C13.3333 10.6455 10.6453 13.3335 7.33331 13.3335C4.02131 13.3335 1.33331 10.6455 1.33331 7.3335C1.33331 4.0215 4.02131 1.3335 7.33331 1.3335ZM7.33331 12.0002C9.91131 12.0002 12 9.9115 12 7.3335C12 4.75483 9.91131 2.66683 7.33331 2.66683C4.75465 2.66683 2.66665 4.75483 2.66665 7.3335C2.66665 9.9115 4.75465 12.0002 7.33331 12.0002ZM12.99 12.0475L14.876 13.9328L13.9326 14.8762L12.0473 12.9902L12.99 12.0475V12.0475Z"
                fill="#637381"
              />
            </svg>
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
            <button className="flex-1 px-4 py-3 text-white bg-[#A8353A] rounded-md w-full ">
              Create User
            </button>
            <button className="flex-1 px-4 py-3 text-[#A8353A] bg-white rounded-md w-full border border-[#A8353A] ">
              Bulk User
            </button>
          </>
        )}
        {type === "roles" && (
          <button className="flex-1 px-4 py-3 text-white bg-[#A8353A] rounded-md w-full  ">
            Create Role
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg border border-gray-100">
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
            {currentItems.map((row: any, index) => (
              <tr key={index} className="border-b border-gray-100 h-24">
                {columns.map((column) => (
                  <td key={column} className="py-3 px-4">
                    {column === "status" ? (
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
                      row[column]
                    )}
                  </td>
                ))}

                <td className="py-3 px-4">
                  {type === "users" ? (
                    <>
                      <button className="text-blue-500 hover:text-blue-700">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.5 5.99996C10.5 5.79146 10.5 5.68647 10.512 5.59947C10.5504 5.32502 10.6772 5.07055 10.8731 4.8746C11.0691 4.67865 11.3236 4.55187 11.598 4.51347C11.6865 4.50147 11.79 4.50146 11.9985 4.50146C12.207 4.50146 12.3135 4.50147 12.399 4.51347C12.6734 4.55187 12.9279 4.67865 13.1239 4.8746C13.3198 5.07055 13.4466 5.32502 13.485 5.59947C13.497 5.68647 13.497 5.79146 13.497 5.99996C13.497 6.20846 13.497 6.31347 13.485 6.40047C13.4466 6.67491 13.3198 6.92937 13.1239 7.12533C12.9279 7.32128 12.6734 7.44806 12.399 7.48647C12.312 7.49847 12.207 7.49847 11.9985 7.49847C11.79 7.49847 11.685 7.49847 11.598 7.48647C11.3236 7.44806 11.0691 7.32128 10.8731 7.12533C10.6772 6.92937 10.5504 6.67491 10.512 6.40047C10.5 6.31347 10.5 6.20846 10.5 5.99996ZM10.5 12C10.5 11.7915 10.5 11.6865 10.512 11.5995C10.5504 11.325 10.6772 11.0706 10.8731 10.8746C11.0691 10.6786 11.3236 10.5519 11.598 10.5135C11.6865 10.5015 11.79 10.5015 11.9985 10.5015C12.207 10.5015 12.3135 10.5015 12.399 10.5135C12.6734 10.5519 12.9279 10.6786 13.1239 10.8746C13.3198 11.0706 13.4466 11.325 13.485 11.5995C13.497 11.6865 13.497 11.7915 13.497 12C13.497 12.2085 13.497 12.3135 13.485 12.4005C13.4466 12.6749 13.3198 12.9294 13.1239 13.1253C12.9279 13.3213 12.6734 13.4481 12.399 13.4865C12.312 13.4985 12.207 13.4985 11.9985 13.4985C11.79 13.4985 11.685 13.4985 11.598 13.4865C11.3236 13.4481 11.0691 13.3213 10.8731 13.1253C10.6772 12.9294 10.5504 12.6749 10.512 12.4005C10.5 12.3135 10.5 12.2085 10.5 12ZM10.5 18C10.5 17.7915 10.5 17.6865 10.512 17.5995C10.5504 17.325 10.6772 17.0706 10.8731 16.8746C11.0691 16.6786 11.3236 16.5519 11.598 16.5135C11.6865 16.5015 11.79 16.5015 11.9985 16.5015C12.207 16.5015 12.3135 16.5015 12.399 16.5135C12.6734 16.5519 12.9279 16.6786 13.1239 16.8746C13.3198 17.0706 13.4466 17.325 13.485 17.5995C13.497 17.6865 13.497 17.7915 13.497 18C13.497 18.2085 13.497 18.3135 13.485 18.402C13.4466 18.6764 13.3198 18.9309 13.1239 19.1268C12.9279 19.3228 12.6734 19.4496 12.399 19.488C12.312 19.5 12.207 19.5 12 19.5C11.793 19.5 11.6865 19.5 11.5995 19.488C11.3251 19.4496 11.0706 19.3228 10.8746 19.1268C10.6787 18.9309 10.5519 18.6764 10.5135 18.402C10.5 18.315 10.5 18.21 10.5 18Z"
                            fill="black"
                          />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center space-x-2">
                        <button className="px-2.5 py-1 text-gray-700 font-semibold bg-white border border-gray-200 rounded-md   ">
                          View Users
                        </button>
                        <div>
                          <svg
                            width="15"
                            height="16"
                            viewBox="0 0 15 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="cursor-pointer fiil"
                          >
                            <path
                              d="M6.28571 2.28571H8.57143C8.57143 1.98261 8.45102 1.69192 8.23669 1.47759C8.02237 1.26327 7.73168 1.14286 7.42857 1.14286C7.12547 1.14286 6.83478 1.26327 6.62045 1.47759C6.40612 1.69192 6.28571 1.98261 6.28571 2.28571ZM5.14286 2.28571C5.14286 1.67951 5.38367 1.09812 5.81233 0.66947C6.24098 0.240816 6.82236 0 7.42857 0C8.03478 0 8.61616 0.240816 9.04481 0.66947C9.47347 1.09812 9.71428 1.67951 9.71428 2.28571H14.2857C14.4373 2.28571 14.5826 2.34592 14.6898 2.45308C14.7969 2.56025 14.8571 2.70559 14.8571 2.85714C14.8571 3.0087 14.7969 3.15404 14.6898 3.2612C14.5826 3.36837 14.4373 3.42857 14.2857 3.42857H13.6411L12.264 13.5291C12.1706 14.2136 11.8324 14.8411 11.3119 15.2954C10.7914 15.7497 10.124 16 9.43314 16H5.424C4.73316 16 4.06572 15.7497 3.54526 15.2954C3.02479 14.8411 2.68654 14.2136 2.59314 13.5291L1.216 3.42857H0.571429C0.419876 3.42857 0.274531 3.36837 0.167368 3.2612C0.0602039 3.15404 0 3.0087 0 2.85714C0 2.70559 0.0602039 2.56025 0.167368 2.45308C0.274531 2.34592 0.419876 2.28571 0.571429 2.28571H5.14286ZM6.28571 6.28571C6.28571 6.13416 6.22551 5.98882 6.11835 5.88165C6.01118 5.77449 5.86584 5.71429 5.71429 5.71429C5.56273 5.71429 5.41739 5.77449 5.31022 5.88165C5.20306 5.98882 5.14286 6.13416 5.14286 6.28571V12C5.14286 12.1516 5.20306 12.2969 5.31022 12.4041C5.41739 12.5112 5.56273 12.5714 5.71429 12.5714C5.86584 12.5714 6.01118 12.5112 6.11835 12.4041C6.22551 12.2969 6.28571 12.1516 6.28571 12V6.28571ZM9.14286 5.71429C8.9913 5.71429 8.84596 5.77449 8.7388 5.88165C8.63163 5.98882 8.57143 6.13416 8.57143 6.28571V12C8.57143 12.1516 8.63163 12.2969 8.7388 12.4041C8.84596 12.5112 8.9913 12.5714 9.14286 12.5714C9.29441 12.5714 9.43975 12.5112 9.54692 12.4041C9.65408 12.2969 9.71428 12.1516 9.71428 12V6.28571C9.71428 6.13416 9.65408 5.98882 9.54692 5.88165C9.43975 5.77449 9.29441 5.71429 9.14286 5.71429Z"
                              fill="#5D7285"
                              fillOpacity="0.32"
                            />
                          </svg>
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
