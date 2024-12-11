"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard-layout-component";
import TableComponent from "@/components/table-component";

export default function UserManagement() {
  const tabs = ["All Users", "Role", "Permissions"];

  const data = [
    {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      firstName: "Jane",
      lastName: "Smith",
      email: "janesmith@example.com",
      role: "Editor",
      status: "Inactive",
    },
    {
      firstName: "Michael",
      lastName: "Jordan",
      email: "mjordan@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      firstName: "Kobe",
      lastName: "Bryant",
      email: "kbryant@example.com",
      role: "Editor",
      status: "Active",
    },
    {
      firstName: "LeBron",
      lastName: "James",
      email: "lebron@example.com",
      role: "Editor",
      status: "Inactive",
    },
    {
      firstName: "Stephen",
      lastName: "Curry",
      email: "scurry@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      firstName: "Shaquille",
      lastName: "O'Neal",
      email: "soneal@example.com",
      role: "Editor",
      status: "Inactive",
    },
  ];

  const roleData = [
    {
      Role: "Super Admin",
      Users: "9",
    },
    {
      Role: "Editor",
      Users: "10",
    },
  ];

  const [selectedTab, setSelectedTab] = useState<string>("All Users");

  return (
    <DashboardLayout
      title="User Management"
      detail="Manage all users and their roles."
    >
      <div className="relative bg-white rounded-2xl p-4">
        <div className="flex space-x-4 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`relative text-gray-500 hover:text-gray-900 px-4 py-2 font-medium focus:outline-none group ${
                selectedTab === tab
                  ? "text-[#A8353A] font-semibold" // Active tab styles
                  : ""
              }`}
            >
              {tab}
              {selectedTab === tab && (
                <span className="absolute left-0 bottom-[-5px] w-full h-[2px] bg-[#A8353A]"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="relative bg-white rounded-2xl p-4 mt-4">
        {selectedTab === "All Users" && (
          <TableComponent data={data} type="users" />
        )}
        {selectedTab === "Role" && (
          <TableComponent data={roleData} type="roles" />
        )}
        {selectedTab === "Permissions" && (
          <>
            <details className="border border-gray-200 rounded-lg px-4 py-5  relative group">
              <summary className="flex justify-between items-center text-base font-semibold cursor-pointer">
                Users
                <span className="transform transition-transform duration-100 group-open:rotate-180">
                  <svg
                    width="14"
                    height="8"
                    viewBox="0 0 14 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.7998 7.4998L13.3998 1.7998C13.7998 1.3998 13.7998 0.799804 13.3998 0.399804C12.9998 -0.00019598 12.3998 -0.00019598 11.9998 0.399804L6.9998 5.2998L1.9998 0.399804C1.5998 -0.00019598 0.999804 -0.00019598 0.599804 0.399804C0.399804 0.599804 0.299805 0.799805 0.299805 1.0998C0.299805 1.39981 0.399804 1.5998 0.599804 1.7998L6.1998 7.4998C6.6998 7.8998 7.2998 7.8998 7.7998 7.4998C7.6998 7.4998 7.6998 7.4998 7.7998 7.4998Z"
                      fill="#A8353A"
                    />
                  </svg>
                </span>
              </summary>
              <nav className="mt-4 pt-9 pb-6 border-t border-gray-300">
                <ul className="flex flex-wrap space-x-6 cursor-pointer">
                  <li className="ml-2 mb-2">View Users</li>
                  <li>Add Users</li>
                  <li>Delete Users</li>
                  <li>Manage Users</li>
                </ul>
              </nav>
            </details>
            <details className="border border-gray-200 rounded-lg px-4 py-5  relative group mt-4">
              <summary className="flex justify-between items-center text-base font-semibold cursor-pointer">
                Roles
                <span className="transform transition-transform duration-100 group-open:rotate-180">
                  <svg
                    width="14"
                    height="8"
                    viewBox="0 0 14 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.7998 7.4998L13.3998 1.7998C13.7998 1.3998 13.7998 0.799804 13.3998 0.399804C12.9998 -0.00019598 12.3998 -0.00019598 11.9998 0.399804L6.9998 5.2998L1.9998 0.399804C1.5998 -0.00019598 0.999804 -0.00019598 0.599804 0.399804C0.399804 0.599804 0.299805 0.799805 0.299805 1.0998C0.299805 1.39981 0.399804 1.5998 0.599804 1.7998L6.1998 7.4998C6.6998 7.8998 7.2998 7.8998 7.7998 7.4998C7.6998 7.4998 7.6998 7.4998 7.7998 7.4998Z"
                      fill="#A8353A"
                    />
                  </svg>
                </span>
              </summary>
              <nav className="mt-4 pt-9 pb-6 border-t border-gray-300">
                <ul className="flex flex-wrap space-x-6 cursor-pointer">
                  <li className="ml-2 mb-2">Add New Role</li>
                  <li>Assign Users to Roles</li>
                  <li>Delete Roles</li>
                  <li>Add Permission</li>
                </ul>
              </nav>
            </details>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
