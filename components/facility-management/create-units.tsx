"use client";

import { FormEvent, useEffect, useState } from "react";
import Select from "react-select";
import { LabelInputComponent } from "../input-container";
import axiosInstance from "@/utils/api";
import { multiSelectStyle } from "@/utils/ojects";

export default function CreateUnit({
  assets,
  setModalState,
  activeRowId,
  setSuccessState,
}) {
  const [formData, setFormData] = useState({
    unitNumber: "",
    type: "",
    ownership: "",
    description: "",
    bookable: "",
    commonArea: "",
    address: "",
    assets: [],
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

  const handleAssetChange = (selected) => {
    setFormData({
      ...formData,
      assets: selected.map((option) => option.value),
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({
      ...formData,
      assets: formData.assets,
    });
    if (activeRowId) {
      await axiosInstance.patch(`/units/${unit.id}`, {
        ...formData,
        assets: formData.assets,
      });
    } else {
      await axiosInstance.post("/units", {
        ...formData,
        assets: formData.assets,
      });
    }
    setFormData({
      unitNumber: "",
      type: "",
      ownership: "",
      description: "",
      bookable: "",
      commonArea: "",
      address: "",
      assets: [],
    });
    setModalState("");
    setSuccessState({
      title: "Successful",
      detail: `You have successfully ${
        activeRowId ? "edited" : "created"
      } this facility`,
      status: true,
    });
  };

  const [unit, setUnit] = useState<Unit>(null);
  const getAUnit = async () => {
    const response = await axiosInstance.get(`/units/${activeRowId}`);
    if (response.data.data) {
      setUnit(response.data.data);
    }
  };

  useEffect(() => {
    if (activeRowId !== null) getAUnit();
  }, [activeRowId]);

  useEffect(() => {
    if (unit) {
      setFormData({
        unitNumber: unit.unitNumber || "",
        type: unit.type || "",
        ownership: unit.ownership || "",
        description: unit.description || "",
        bookable: unit.bookable || "",
        commonArea: unit.commonArea || "",
        address: unit.address,
        assets:
          unit.assets && unit.assets.length > 0
            ? unit.assets.map((asset) => asset.id)
            : [],
      });
    }
  }, [unit]);

  const yesNoOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const typeOptions = [
    { value: "single", label: "Single" },
    { value: "residential", label: "Residential" },
  ];

  const assetOptions = assets?.map((type) => ({
    value: type.id,
    label: type.assetNumber,
  }));

  const defaultAssets = assetOptions?.filter((option) =>
    formData.assets.includes(option.value)
  );

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="mt-12 px-6 max-w-full sm:mt-6 pb-12"
      >
        <div className="relative w-full mt-6">
          <LabelInputComponent
            type="text"
            name="unitNumber"
            value={formData.unitNumber}
            onChange={handleChange}
            label="Unit Number"
          />
        </div>

        <div className="relative w-full mt-6">
          <Select
            options={typeOptions}
            value={typeOptions.find((option) => option.value === formData.type)}
            onChange={handleSelectChange("type")}
            styles={multiSelectStyle}
            placeholder="Unit Type"
          />
        </div>

        <div className="relative w-full mt-6">
          <LabelInputComponent
            type="text"
            name="ownership"
            value={formData.ownership}
            onChange={handleChange}
            label="Ownership"
          />
        </div>

        <div className="relative w-full mt-6">
          <LabelInputComponent
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            label="Description"
          />
        </div>

        <div className="relative w-full mt-6">
          <Select
            options={yesNoOptions}
            value={yesNoOptions.find(
              (option) => option.value === formData.bookable
            )}
            onChange={handleSelectChange("bookable")}
            styles={multiSelectStyle}
            placeholder="Bookable"
          />
        </div>

        <div className="relative w-full mt-6">
          <Select
            options={yesNoOptions}
            value={yesNoOptions.find(
              (option) => option.value === formData.commonArea
            )}
            onChange={handleSelectChange("commonArea")}
            styles={multiSelectStyle}
            placeholder="Common Area"
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

        <div className="relative w-full mt-6">
          <Select
            isMulti
            name="assets"
            options={assetOptions}
            value={defaultAssets}
            onChange={handleAssetChange}
            className="peer w-full rounded-lg text-base text-gray-900 outline-none bg-gray-100"
            classNamePrefix="react-select"
            placeholder="Assign Assets to Facility"
            styles={multiSelectStyle}
          />
        </div>

        <div className="mt-10 flex w-full justify-end">
          <button
            type="submit"
            className="block rounded-md bg-[#A8353A] px-4 py-3.5 text-center text-base font-semibold text-white"
          >
            {activeRowId ? "Edit Units" : "Create Units"}
          </button>
        </div>
      </form>
    </div>
  );
}
