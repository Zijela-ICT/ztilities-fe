"use client";

import { FormEvent, useEffect, useState } from "react";
import Select from "react-select";
import { LabelInputComponent } from "../input-container";
import axiosInstance from "@/utils/api";
import { multiSelectStyle } from "@/utils/ojects";

export default function CreateWorkRequest({
  setModalState,
  activeRowId,
  setSuccessState,
}) {
  const [formData, setFormData] = useState({
    vendorCode: "",
    vendorName: "",
    vendorType: "",
    category: "",
    phoneNumber: "",
    email: "",
    address: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (fieldName: string) => (selected: any) => {
    setFormData({
      ...formData,
      [fieldName]: selected?.value || "",
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (activeRowId) {
      await axiosInstance.patch(`/vendors/${vendor.id}`, {
        ...formData,
      });
    } else {
      await axiosInstance.post("/vendors", {
        ...formData,
      });
    }
    setFormData({
      vendorCode: "",
      vendorName: "",
      vendorType: "",
      category: "",
      phoneNumber: "",
      email: "",
      address: "",
    });
    setModalState("");
    setSuccessState({
      title: "Successful",
      detail: `You have successfully ${
        activeRowId ? "edited" : "created"
      } this Vendor`,
      status: true,
    });
  };

  const [vendor, setVendor] = useState<Vendor>(null);
  const getAVendor = async () => {
    const response = await axiosInstance.get(`/vendors/${activeRowId}`);
    if (response.data.data) {
      setVendor(response.data.data);
    }
  };

  useEffect(() => {
    if (activeRowId !== null) getAVendor();
  }, [activeRowId]);

  useEffect(() => {
    if (vendor) {
      setFormData({
        vendorCode: vendor?.vendorCode || "",
        vendorName: vendor?.vendorName || "",
        vendorType: vendor?.vendorType || "",
        category: vendor?.category || "",
        phoneNumber: vendor?.phoneNumber || "",
        email: vendor?.email || "",
        address: vendor?.address,
      });
    }
  }, [vendor]);

  const typeOptions = [
    { value: "single", label: "Single" },
    { value: "residential", label: "Residential" },
  ];

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="mt-12 px-6 max-w-full sm:mt-6 pb-12"
      >
        <div className="relative w-full mt-6">
          <LabelInputComponent
            type="text"
            name="vendorCode"
            value={formData.vendorCode}
            onChange={handleChange}
            label="Vendor Code"
          />
        </div>

        <div className="relative w-full mt-6">
          <LabelInputComponent
            type="text"
            name="vendorName"
            value={formData.vendorName}
            onChange={handleChange}
            label="Vendor Name"
          />
        </div>

        <div className="relative w-full mt-6">
          <Select
            options={typeOptions}
            value={typeOptions.find(
              (option) => option.value === formData.vendorType
            )}
            onChange={handleSelectChange("vendorType")}
            styles={multiSelectStyle}
            placeholder="Vendor Type"
          />
        </div>

        <div className="relative w-full mt-6">
          <Select
            options={typeOptions}
            value={typeOptions.find(
              (option) => option.value === formData.category
            )}
            onChange={handleSelectChange("category")}
            styles={multiSelectStyle}
            placeholder="Category"
          />
        </div>

        <div className="relative w-full mt-6">
          <LabelInputComponent
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            label="Phone number"
          />
        </div>

        <div className="relative w-full mt-6">
          <LabelInputComponent
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            label="Email address"
          />
        </div>

        <div className="relative w-full mt-6">
          <LabelInputComponent
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            label="Address"
          />
        </div>

        <div className="mt-10 flex w-full justify-end">
          <button
            type="submit"
            className="block rounded-md bg-[#A8353A] px-4 py-3.5 text-center text-base font-semibold text-white"
          >
            {activeRowId ? "Edit Technician" : "Create Technician"}
          </button>
        </div>
      </form>
    </div>
  );
}
