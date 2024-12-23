"use client";

import { FormEvent, useEffect, useState } from "react";
import Select from "react-select";
import { LabelInputComponent } from "../input-container";
import axiosInstance from "@/utils/api";
import { multiSelectStyle } from "@/utils/ojects";

export default function CreateFacility({
  blocks,
  units,
  assets,
  setModalState,
  activeRowId,
  setSuccessState,
}) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    code: "",
    address: "",
    facilityOfficer: "",
    email: "",
    phone: "",
    blocks: [],
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
  const handleBlockChange = (selected) => {
    setFormData({
      ...formData,
      blocks: selected.map((option) => option.value),
    });
  };

  const handleUnitChange = (selected) => {
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
      await axiosInstance.patch(`/facilities/${facility.id}`, {
        ...formData,
        blocks: formData.blocks,
        units: formData.units,
        assets: formData.assets,
      });
    } else {
      await axiosInstance.post("/facilities", {
        ...formData,
        blocks: formData.blocks,
        units: formData.units,
        assets: formData.assets,
      });
    }
    setFormData({
      name: "",
      type: "",
      code: "",
      address: "",
      facilityOfficer: "",
      email: "",
      phone: "",
      blocks: [],
      units: [],
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

  const [facility, setFacility] = useState(null);
  const getAFacility = async () => {
    const response = await axiosInstance.get(`/facilities/${activeRowId}`);
    if (response.data.data) {
      setFacility(response.data.data);
    }
  };

  useEffect(() => {
    if (activeRowId !== null) getAFacility();
  }, [activeRowId]);

  useEffect(() => {
    if (facility) {
      setFormData({
        name: facility.name || "",
        type: facility.type || "",
        code: facility.code || "",
        address: facility.address || "",
        facilityOfficer: facility.facilityOfficer || "",
        email: facility.email || "",
        phone: facility.phone || "",
        blocks:
          facility.blocks && facility.blocks.length > 0
            ? facility.blocks.map((block) => block.id)
            : [],
        units:
          facility.units && facility.units.length > 0
            ? facility.units.map((unit) => unit.id)
            : [],
        assets:
          facility.assets && facility.assets.length > 0
            ? facility.assets.map((asset) => asset.id)
            : [],
      });
    }
  }, [facility]);

  const blockOptions = blocks?.map((type) => ({
    value: type.id,
    label: type.blockNumber,
  }));

  const unitOptions = units?.map((type) => ({
    value: type.id,
    label: type.unitNumber,
  }));

  const assetOptions = assets?.map((type) => ({
    value: type.id,
    label: type.assetNumber,
  }));

  const defaultBlocks = blockOptions?.filter((option) =>
    formData.blocks.includes(option.value)
  );

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
            name="name"
            value={formData.name}
            onChange={handleChange}
            label="Facility Name"
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
            name="blocks"
            options={blockOptions}
            value={defaultBlocks}
            onChange={handleBlockChange}
            className="peer w-full rounded-lg text-base text-gray-900 outline-none bg-gray-100"
            classNamePrefix="react-select"
            placeholder="Assign Blocks to Facility"
            styles={multiSelectStyle}
          />
        </div>

        <div className="relative w-full mt-6">
          <Select
            isMulti
            name="units"
            options={unitOptions}
            value={defaultUnits}
            onChange={handleUnitChange}
            className="peer w-full rounded-lg text-base text-gray-900 outline-none bg-gray-100"
            classNamePrefix="react-select"
            placeholder="Assign Units to Facility"
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
            placeholder="Assign Assets to Facility"
            styles={multiSelectStyle}
          />
        </div>

        <div className="mt-10 flex w-full justify-end">
          <button
            type="submit"
            className="block rounded-md bg-[#A8353A] px-4 py-3.5 text-center text-base font-semibold text-white"
          >
            {activeRowId ? "Edit Facility" : "Create Facility"}
          </button>
        </div>
      </form>
    </div>
  );
}
