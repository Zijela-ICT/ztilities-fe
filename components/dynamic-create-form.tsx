"use client";

import { FormEvent, useEffect, useState } from "react";
import Select from "react-select";
import {
  FileInputComponent,
  LabelInputComponent,
  LabelTextareaComponent,
} from "./input-container";
import axiosInstance from "@/utils/api";
import { multiSelectStyle } from "@/utils/ojects";

interface InputField {
  name: string;
  label: string;
  type: "text" | "number" | "email" | "file" | "textarea" | "date";
}

interface SelectField {
  name: string;
  label: string;
  placeholder: string;
  options: { value: string | number; label: string }[];
  isMulti?: boolean;
}

interface CreateUnitProps {
  inputs: InputField[];
  selects?: SelectField[];
  apiEndpoint: string; // API endpoint for POST or PATCH requests
  activeRowId?: string | null;
  setModalState: (state: string) => void;
  setSuccessState: (state: {
    title: string;
    detail: string;
    status: boolean;
  }) => void;
  fetchResource?: (id: string) => Promise<any>;
  title: string;
}

export default function DynamicCreateForm({
  inputs,
  selects,
  apiEndpoint,
  activeRowId = null,
  setModalState,
  setSuccessState,
  fetchResource,
  title,
}: CreateUnitProps) {
  const [formData, setFormData] = useState<any>({});
  const [resource, setResource] = useState<any>(null);

  // Handle change for normal inputs
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle change for single and multi-select fields
  const handleSelectChange =
    (fieldName: string, isMulti = false) =>
    (selected: any) => {
      setFormData({
        ...formData,
        [fieldName]: isMulti
          ? selected.map((option: any) => option.value)
          : selected?.value || "",
      });
    };

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;

    if (files && files[0]) {
      const file = files[0];
      setUploadedFile(file);
      const reader = new FileReader();

      reader.onload = () => {
        // Update avatar preview
        setFormData((prev) => ({ ...prev, [name]: reader.result as string }));
      };
      reader.readAsDataURL(file);
      //Update formData with the selected file
      setFormData({
        ...formData,
        [name]: file,
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const {
      typeSelected,
      attachments,
      fileAttachments,
      comments,
      quotations,
      activities,
      ...filteredFormData
    } = formData;

    // Prepend "Block" for blockNumber and "Asset" for assetNumber if not already present
    const updatedFormData = { ...filteredFormData };

    if (
      updatedFormData.blockNumber &&
      !updatedFormData.blockNumber.startsWith("Block")
    ) {
      updatedFormData.blockNumber = `Block ${updatedFormData.blockNumber}`;
    }

    if (
      updatedFormData.assetNumber &&
      !updatedFormData.assetNumber.startsWith("Asset")
    ) {
      updatedFormData.assetNumber = `Asset ${updatedFormData.assetNumber}`;
    }

    if (
      updatedFormData.unitNumber &&
      !updatedFormData.unitNumber.startsWith("Unit")
    ) {
      updatedFormData.unitNumber = `Unit ${updatedFormData.unitNumber}`;
    }

    if (updatedFormData.apportionmentMetric) {
      updatedFormData.apportionmentMetric = Number(
        updatedFormData.apportionmentMetric
      );
    }

    try {
      if (
        [
          "User",
          "Facility",
          "Units",
          "Vendor",
          "Technician",
          "Assets",
          "Block",
          "Work Request",
        ].includes(title)
      ) {
        if (activeRowId) {
          await axiosInstance.patch(
            `${apiEndpoint}/${activeRowId}`,
            updatedFormData
          );
        } else {
          await axiosInstance.post(apiEndpoint, updatedFormData);
        }
      } else {
        await axiosInstance.patch(apiEndpoint, updatedFormData);
      }

      setFormData({});
      setModalState("");

      setSuccessState({
        title: "Successful",
        detail: `${
          [
            "User",
            "Facility",
            "Units",
            "Vendor",
            "Technician",
            "Assets",
            "Block",
            "Work Request",
          ].includes(title)
            ? activeRowId
              ? `You have successfully edited ${title}`
              : `You have successfully created ${title}`
            : `Your action has been successful`
        }.`,
        status: true,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    if (activeRowId && fetchResource) {
      fetchResource(activeRowId).then((data) => {
        // Dynamically process multi-select fields based on the 'selects' configuration
        const dynamicProcessedData = { ...data };

        selects.forEach((select) => {
          if (select.isMulti && Array.isArray(data[select.name])) {
            dynamicProcessedData[select.name] = data[select.name]?.map(
              (item: any) => (typeof item === "object" ? item.id : item)
            );
          }
        });

        // Handle single object fields like 'user'
        if (data.user && typeof data.user === "object") {
          dynamicProcessedData.userId = data.user.id; // Example: Keep only the user ID
        }

        setResource(data);
        setFormData(dynamicProcessedData);
      });
    }
  }, [activeRowId, fetchResource, selects]);

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mt-12 px-6 max-w-full sm:mt-6 pb-12"
      >
        {/* Render inputs dynamically */}
        {inputs.map((input, index) => {
          if (input.type === "file") {
            return (
              <div key={index} className="relative w-full mt-6">
                <FileInputComponent
                  name={input.name}
                  onChange={handleFileChange}
                  label={input.label}
                  uploadedFile={uploadedFile}
                  // No value prop needed for file inputs
                />
              </div>
            );
          }

          if (input.type === "textarea") {
            if (
              formData.status !== "rejected" &&
              input.name === "reasonForRejection"
            ) {
              return null; // Skip rendering this select if typeSelected does not match
            }
            return (
              <div key={index} className="relative w-full mt-6">
                <LabelTextareaComponent
                  name={input.name}
                  value={formData[input.name] || ""}
                  onChange={handleChange}
                  label={input.label}
                />
              </div>
            );
          }

          return (
            <div key={index} className="relative w-full mt-6">
              <LabelInputComponent
                type={input.type}
                name={input.name}
                value={formData[input.name] || ""}
                onChange={handleChange}
                label={input.label}
              />
            </div>
          );
        })}

        {/* Render selects dynamically */}
        {selects?.map((select, index) => {
          // Skip rendering 'facilitId' when the title is 'Blocks' and there is an activeRowId
          if (
            (title === "Block" &&
              activeRowId &&
              select.name === "facilityId") ||
            (title === "Units" && activeRowId && select.name === "blockId")
          ) {
            return null;
          }
          // Conditionally render based on `typeSelected`
          if (
            (select.name === "unit" && formData.typeSelected !== "unit") ||
            (select.name === "facility" &&
              formData.typeSelected !== "facility") ||
            (select.name === "block" && formData.typeSelected !== "block") ||
            ((title === "Add Quotation" || title === "Assign Technician") &&
              select.label === "Vendor" &&
              formData.entity !== "Vendor") ||
            ((title === "Add Quotation" || title === "Assign Technician") &&
              select.label === "Technician" &&
              formData.entity !== "Technician")
          ) {
            return null; // Skip rendering this select if typeSelected does not match
          }

          return (
            <>
              <div key={index} className="relative w-full mt-6">
                <Select
                  isMulti={select.isMulti}
                  name={select.name}
                  options={select.options}
                  value={
                    select.isMulti
                      ? select.options?.filter((option) =>
                          formData[select.name]?.includes(option.value)
                        )
                      : select.options?.find(
                          (option) => option.value === formData[select.name]
                        )
                  }
                  onChange={handleSelectChange(select.name, select.isMulti)}
                  styles={multiSelectStyle}
                  placeholder={select.placeholder}
                />
              </div>
            </>
          );
        })}

        <div className="mt-10 flex w-full justify-end">
          <button
            type="submit"
            className="block rounded-md bg-[#A8353A] px-4 py-3.5 text-center text-xs font-semibold text-white"
          >
            <p>
              {[
                "User",
                "Facility",
                "Units",
                "Vendor",
                "Technician",
                "Assets",
                "Block",
                "Work Request",
              ].includes(title)
                ? activeRowId
                  ? `Edit ${title}`
                  : `Create ${title}`
                : title}
            </p>
          </button>
        </div>
      </form>
    </>
  );
}
