"use client";

import { FormEvent, useEffect, useState } from "react";
import Select from "react-select";
import { LabelInputComponent } from "../input-container";
import axiosInstance from "@/utils/api";
import { multiSelectStyle } from "@/utils/ojects";

export default function CreateBlock({
  units,
  assets,
  setModalState,
  activeRowId,
  setSuccessState,
}) {
  const [formData, setFormData] = useState({
    blockNumber: "",
    code: "",
    facilityOfficer: "",
    phone: "",
    email: "",
    type: "",
    address: "",
    units: [],
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

  const handleUnitsChange = (selected) => {
    setFormData({
      ...formData,
      units: selected.map((option) => option.value),
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
    if (activeRowId) {
      await axiosInstance.patch(`/blocks/${block.id}`, {
        ...formData,
        units: formData.units,
        assets: formData.assets,
      });
    } else {
      await axiosInstance.post("/blocks", {
        ...formData,
        units: formData.units,
        assets: formData.assets,
      });
    }
    setFormData({
      blockNumber: "",
      code: "",
      facilityOfficer: "",
      phone: "",
      email: "",
      type: "",
      address: "",
      units: [],
      assets: [],
    });
    setModalState("");
    setSuccessState({
      title: "Successful",
      detail: `You have successfully ${
        activeRowId ? "edited" : "created"
      } a block`,
      status: true,
    });
  };

  const [block, setBlock] = useState<Block>(null);
  const getABlock = async () => {
    const response = await axiosInstance.get(`/blocks/${activeRowId}`);
    if (response.data.data) {
      setBlock(response.data.data);
    }
  };

  useEffect(() => {
    if (activeRowId !== null) getABlock();
  }, [activeRowId]);

  useEffect(() => {
    if (block) {
      setFormData({
        blockNumber: block.blockNumber || "",
        type: block.type || "",
        code: block.code || "",
        address: block.address || "",
        facilityOfficer: block.facilityOfficer || "",
        email: block.email || "",
        phone: block.phone || "",
        units:
          block.units && block.units.length > 0
            ? block.units.map((unit) => unit.id)
            : [],
        assets:
          block.assets && block.assets.length > 0
            ? block.assets.map((asset) => asset.id)
            : [],
      });
    }
  }, [block]);

  const unitOptions = units?.map((type) => ({
    value: type.id,
    label: type.unitNumber,
  }));

  const assetOptions = assets?.map((type) => ({
    value: type.id,
    label: type.assetNumber,
  }));

  const defaultUnits = unitOptions?.filter((option) =>
    formData.units.includes(option.value)
  );

  const defaultAssets = assetOptions?.filter((option) =>
    formData.assets.includes(option.value)
  );

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
            name="blockNumber"
            value={formData.blockNumber}
            onChange={handleChange}
            label="Block Number"
          />
        </div>

        <div className="relative w-full mt-6">
          <Select
            options={typeOptions}
            value={typeOptions.find((option) => option.value === formData.type)}
            onChange={handleSelectChange("type")}
            styles={multiSelectStyle}
            placeholder="Select Facility Type"
          />
        </div>

        <div className="relative w-full mt-6">
          <LabelInputComponent
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            label="Code"
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
          <LabelInputComponent
            type="text"
            name="facilityOfficer"
            value={formData.facilityOfficer}
            onChange={handleChange}
            label="Facility Officer"
          />
        </div>

        <div className="relative w-full mt-6">
          <LabelInputComponent
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            label="Email"
          />
        </div>

        <div className="relative w-full mt-6">
          <LabelInputComponent
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            label="Phone Number"
          />
        </div>

        <div className="relative w-full mt-6">
          <Select
            isMulti
            name="units"
            options={unitOptions}
            value={defaultUnits}
            onChange={handleUnitsChange}
            className="peer w-full rounded-lg text-base text-gray-900 outline-none bg-gray-100"
            classNamePrefix="react-select"
            placeholder="Assign Units to Block"
            styles={multiSelectStyle}
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
            placeholder="Assign Assets to Block"
            styles={multiSelectStyle}
          />
        </div>

        <div className="mt-10 flex w-full justify-end">
          <button
            type="submit"
            className="block rounded-md bg-[#A8353A] px-4 py-3.5 text-center text-base font-semibold text-white"
          >
            {activeRowId ? "Edit Block" : "Create Block"}
          </button>
        </div>
      </form>
    </div>
  );
}
