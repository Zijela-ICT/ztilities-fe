"use client";

import { FormEvent, useState, useEffect } from "react";
import axiosInstance from "@/utils/api";
import { DownloadArrow, DownloadIcon } from "@/utils/svg";
import ButtonComponent from "../button-component";
import createAxiosInstance from "@/utils/api";

export default function CreateBulkUser() {
  const axiosInstance = createAxiosInstance();
  const [formData, setFormData] = useState({
    name: "", // Default state
  });

  useEffect(() => {
    setFormData({ name: "Superadmin" }); // Set default value
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
 
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
    <div className="mt-12 px-6 max-w-full sm:mt-6 pb-12 bg-[#FBFBFC]">
      <form onSubmit={handleSubmit}>
        <div className="relative bg-white rounded-xl p-4 shadow-sm flex items-center justify-between w-full shadow-sm cursor-pointer">
          <div className="flex items-center space-x-2">
            <DownloadIcon />
            <span className="text-md font-thin text-gray-600">
              Download Sample file format for uploading
            </span>
          </div>
          <DownloadArrow />
        </div>

        <div className="w-full border-dashed bg-white border-2 border-[#A8353A] rounded-lg p-6 pt-20 flex flex-col items-center justify-center mx-auto mt-4">
          <div className="text-center text-xs font-thin text-gray-900 mb-2">
            Select a file or drag and drop here
          </div>
          <div className="text-center text-xs font-thin text-gray-400 mb-6">
            .CSV file size no more than 2MB
          </div>
          <label
            htmlFor="file-upload"
            className="flex items-center justify-center bg-transparent border-2 border-[#A8353A] text-[#A8353A] font-semibold rounded-md px-12 py-3 cursor-pointer "
          >
            <span>Save File</span>
            <input type="file" id="file-upload" className="hidden" />
          </label>
        </div>

        <ButtonComponent text={"Submit"} className="mt-2 text-white" />
      </form>
    </div>
  );
}
