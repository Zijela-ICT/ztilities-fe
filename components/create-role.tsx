"use client";

import { FormEvent, useState, useEffect } from "react";
import { LabelInputComponent } from "./input-container";
import axiosInstance from "@/utils/api";

export default function CreateRole() {
  const [formData, setFormData] = useState({
    name: "", // Default state
  });

  useEffect(() => {
    setFormData({ name: "Superadmin" }); // Set default value
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    // Handle form submission logic here
    const response = await axiosInstance.post("/users/pre-register", {
      formData,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="mt-12 px-6 max-w-full sm:mt-6 pb-12">
      <form onSubmit={handleSubmit}>
        <div className="relative w-full mt-6">
          <LabelInputComponent
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            label="Name of Role"
          />
        </div>

        {/* ticking */}
        <>
          <div className="font-semibold text-md mt-10 mb-4">
            Permission Menu
          </div>
          <details className="border border-gray-200 rounded-lg px-4 py-5 relative group">
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
                <li className="flex items-center ">
                  <input type="checkbox" className="mr-2" />
                  View Users
                </li>
                <li className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Add Users
                </li>
                <li className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Delete Users
                </li>
                <li className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Manage Users
                </li>
              </ul>
            </nav>
          </details>
          <details className="border border-gray-200 rounded-lg px-4 py-5 relative group mt-4">
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
                <li className="flex items-center ">
                  <input type="checkbox" className="mr-2" />
                  Add New Role
                </li>
                <li className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Assign Users to Roles
                </li>
                <li className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Delete Roles
                </li>
                <li className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Add Permission
                </li>
              </ul>
            </nav>
          </details>
        </>

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
