import { FormEvent, useEffect, useState } from "react";
import Select from "react-select";
import { FileInputComponent, LabelInputComponent } from "../input-container";

import { multiSelectStyle } from "@/utils/ojects";
import { useDataPermission } from "@/context";
import createAxiosInstance from "@/utils/api";

export default function CreatePPM({
  setModalState,
  activeRowId,
  setSuccessState,
}: {
  setModalState: (state: string) => void;
  activeRowId?: string | null;
  setSuccessState: (state: {
    title: string;
    detail: string;
    status: boolean;
  }) => void;
}) {
  const axiosInstance = createAxiosInstance();
  const { user } = useDataPermission();

  const [facility, setAFacility] = useState<Facility>();
  const [block, setABlock] = useState<Block>();
  const [unit, setAUnit] = useState<Unit>();
  const [myFacilities, setMyFacilities] = useState<Facility[]>([]);
  const [myBlocks, setMyBlocks] = useState<Block[]>([]);
  const [myUnits, setMyUnits] = useState<Unit[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    entity: "",
    unit: "",
    block: "",
    facility: "",
    asset: "",
    frequency: "",
    endDate: "",
    startDate: "",
    userType: "",
    vendor: "",
    technician: "",
    amount: "",
    interval: "",
    byweekday: [],
  });

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [showUserSelection, setShowUserSelection] = useState(false);

  const getWorkRequest = async () => {
    if (activeRowId) {
      const response = await axiosInstance.get(
        `/work-requests/work-order/${activeRowId}`
      );
      const data = response.data.data;
      setFormData({
        ...formData,
        title: data.title,
        description: data.description,
      });
    }
  };

  const getMyFacilities = async () => {
    const response = await axiosInstance.get("/facilities/my-facilities/all");
    setMyFacilities(response.data.data);
  };

  const getMyBlocks = async () => {
    const response = await axiosInstance.get("/blocks/my-blocks/all");
    setMyBlocks(response.data.data);
  };

  const getMyUnits = async () => {
    const response = await axiosInstance.get("/units/my-units/all");
    setMyUnits(response.data.data);
  };

  const getAFacility = async () => {
    const response = await axiosInstance.get(
      `/facilities/${formData.facility}`
    );
    setAFacility(response.data.data);
  };

  const getABlock = async () => {
    const response = await axiosInstance.get(`/blocks/${formData.block}`);
    setABlock(response.data.data);
  };

  const getAUnit = async () => {
    const response = await axiosInstance.get(`/units/${formData.unit}`);
    setAUnit(response.data.data);
  };

  const getVendors = async () => {
    const response = await axiosInstance.get("/vendors");
    setVendors(response.data.data);
  };

  const getTechnicians = async () => {
    const response = await axiosInstance.get("/technicians");
    setTechnicians(response.data.data);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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

  const [file, setFile] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files?.length) {
      const file = files[0];
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setFile(reader.result as string); // Store the file URL
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // const { userType, ...payload } = formData;
    const { userType, ...payload } = formData;

    const updatedPayload = {
      ...payload,
      interval: Number(formData.interval),
      byweekday: formData.interval ? formData.byweekday : "",
      startDate: new Date(formData.startDate).toISOString(),
      endDate: formData.endDate
        ? new Date(formData.endDate).toISOString()
        : null,
      file,
    };
    console.log(updatedPayload);
    if (activeRowId) {
      await axiosInstance.patch(`/ppms/${activeRowId}`, updatedPayload);
    } else {
      await axiosInstance.post("/ppms", updatedPayload);
    }
    setFormData({
      title: "",
      description: "",
      entity: "",
      unit: "",
      block: "",
      facility: "",
      asset: "",
      frequency: "",
      endDate: "",
      startDate: "",
      userType: "",
      vendor: "",
      technician: "",
      amount: "",
      interval: "",
      byweekday: [],
    });
    setModalState("");
    setSuccessState({
      title: "Successful",
      detail: `You have successfully ${
        activeRowId ? "edited" : "created"
      } this PPM`,
      status: true,
    });
  };

  const entityOptions = [
    { value: "unit", label: "Unit" },
    { value: "block", label: "Block" },
    { value: "facility", label: "Facility" },
  ];

  const frequencyOptions = [
    { value: "DAILY", label: "Daily" },
    { value: "WEEKLY", label: "Weekly" },
    { value: "MONTHLY", label: "Monthly" },
    { value: "YEARLY", label: "Yearly" },
  ];

  const byWeekDayOptions = [
    { value: "MONDAY", label: "Monday" },
    { value: "TUESDAY", label: "Tuesday" },
    { value: "WEDNESDAY", label: "Wednesday" },
    { value: "THURSDAY", label: "Thursday" },
    { value: "FRIDAY", label: "Friday" },
    { value: "SATURDAY", label: "Saturday" },
    { value: "SUNDAY", label: "Sunday" },
  ];

  const unitOptions = (user.units || myUnits)?.map((unit: Unit) => ({
    value: unit.id.toString(),
    label: unit.unitNumber,
  }));

  const blockOptions = myBlocks?.map((block: Block) => ({
    value: block.id.toString(),
    label: block.blockNumber,
  }));

  const facilityOptions = myFacilities?.map((facility: Facility) => ({
    value: facility.id.toString(),
    label: facility.name,
  }));

  const assetOptions =
    formData.entity === "unit"
      ? unit?.assets?.map((asset: Asset) => ({
          value: asset.id.toString(),
          label: asset.assetName,
        }))
      : formData.entity === "facility"
      ? facility?.assets?.map((asset: Asset) => ({
          value: asset.id.toString(),
          label: asset.assetName,
        }))
      : formData.entity === "block"
      ? block?.assets?.map((asset: Asset) => ({
          value: asset.id.toString(),
          label: asset.assetName,
        }))
      : [];

  // Options for userType select
  const userTypeOptions = [
    { value: "vendor", label: "Vendor" },
    { value: "technician", label: "Technician" },
  ];

  // Map vendor and technician data into select options
  const vendorOptions = vendors.map((vendor: Vendor) => ({
    value: vendor.id.toString(),
    label: vendor.vendorName, // adjust as needed
  }));

  const technicianOptions = technicians.map((tech: Technician) => ({
    value: tech.id.toString(),
    label: tech.firstName + tech.surname, // adjust as needed
  }));

  useEffect(() => {
    if (activeRowId) {
      getWorkRequest();
    }
  }, [activeRowId]);

  useEffect(() => {
    getMyFacilities();
    getMyUnits();
    getMyBlocks();
  }, []);

  useEffect(() => {
    if (formData.unit) {
      getAUnit();
    } else if (formData.block) {
      getABlock();
    } else if (formData.facility) {
      getAFacility();
    }
  }, [formData.unit, formData.block, formData.facility]);

  useEffect(() => {
    if (formData.userType === "vendor") {
      getVendors();
    } else if (formData.userType === "technician") {
      getTechnicians();
    }
  }, [formData.userType]);

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="mt-12 px-6 max-w-full sm:mt-6 pb-12"
      >
        {/* Title */}

        <LabelInputComponent
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          label="Title"
          required
        />

        {/* Description */}

        <LabelInputComponent
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          label="Description"
          required
        />

        {/* Start Date */}

        <LabelInputComponent
          type="datetime-local"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          label="Start Date"
        />

        {/* Frequency */}
        <div className="flex space-x-3">
          <div className="relative w-full mt-6">
            <Select
              options={frequencyOptions}
              value={frequencyOptions?.find(
                (option) => option.value === formData.frequency
              )}
              onChange={handleSelectChange("frequency")}
              styles={multiSelectStyle}
              placeholder="Frequency"
            />
          </div>
        </div>
        <LabelInputComponent
          type="number"
          name="interval"
          value={formData.interval}
          onChange={handleChange}
          label="Interval (Optional)"
        />

        {formData.interval && (
          <div className="relative w-full mt-6">
            <Select
              options={byWeekDayOptions}
              value={byWeekDayOptions?.filter((option) =>
                formData.byweekday?.includes(option.value)
              )}
              isMulti
              onChange={handleSelectChange("byweekday", true)}
              styles={multiSelectStyle}
              placeholder="By Week Day"
              required={formData.interval !== ""}
            />
          </div>
        )}

        {/* End Date */}

        <LabelInputComponent
          type="datetime-local"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          label="End Date"
        />

        {/* Only show the additional selections if not editing an existing PPM */}
        {!activeRowId && (
          <>
            {/* Entity Selection */}
            <div className="relative w-full mt-6">
              <Select
                options={entityOptions}
                value={entityOptions?.find(
                  (option) => option.value === formData.entity
                )}
                onChange={handleSelectChange("entity")}
                styles={multiSelectStyle}
                placeholder="Select Entity"
              />
            </div>

            {formData.entity === "unit" && (
              <div className="relative w-full mt-6">
                <Select
                  options={unitOptions}
                  value={unitOptions?.find(
                    (option) => option.value === formData.unit
                  )}
                  onChange={handleSelectChange("unit")}
                  styles={multiSelectStyle}
                  placeholder="Select Unit"
                />
              </div>
            )}

            {formData.entity === "block" && (
              <div className="relative w-full mt-6">
                <Select
                  options={blockOptions}
                  value={blockOptions?.find(
                    (option) => option.value === formData.block
                  )}
                  onChange={handleSelectChange("block")}
                  styles={multiSelectStyle}
                  placeholder="Select Block"
                />
              </div>
            )}

            {formData.entity === "facility" && (
              <div className="relative w-full mt-6">
                <Select
                  options={facilityOptions}
                  value={facilityOptions?.find(
                    (option) => option.value === formData.facility
                  )}
                  onChange={handleSelectChange("facility")}
                  styles={multiSelectStyle}
                  placeholder="Select Facility"
                />
              </div>
            )}

            {/* Asset Selection */}
            <div className="relative w-full mt-6">
              <Select
                options={assetOptions}
                value={assetOptions?.find(
                  (option) => option.value === formData.asset
                )}
                onChange={handleSelectChange("asset")}
                styles={multiSelectStyle}
                placeholder="Select Assets"
              />
            </div>

            <div className="relative w-full mt-6 flex items-center">
              <label
                htmlFor="showUserSelection"
                className="relative inline-flex items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  id="showUserSelection"
                  checked={showUserSelection}
                  onChange={() => {
                    setShowUserSelection(!showUserSelection);
                    // If turning off, reset user-related fields, feel me ?
                    if (showUserSelection) {
                      setFormData((prev) => ({
                        ...prev,
                        userType: "",
                        vendor: "",
                        technician: "",
                      }));
                    }
                  }}
                  className="sr-only peer"
                />
                <div
                  className="w-8 h-4 bg-gray-900 rounded-full peer
                    peer-checked:after:translate-x-4
                    peer-checked:after:border-white
                    after:content-['']
                    after:absolute
                    after:top-[3.6px]
                    after:left-[2px]
                    after:bg-white
                    after:border-gray-300
                    after:border
                    after:rounded-full
                    after:h-3
                    after:w-3
                    after:transition-all
                    peer-checked:bg-green-600"
                ></div>
                <span className="ml-2 text-sm">
                  Is there an existing contract?
                </span>
              </label>
            </div>

            {showUserSelection && (
              <>
                <div className="relative w-full mt-6">
                  <Select
                    options={userTypeOptions}
                    value={userTypeOptions?.find(
                      (option) => option.value === formData.userType
                    )}
                    onChange={handleSelectChange("userType")}
                    styles={multiSelectStyle}
                    placeholder="Select User Type"
                  />
                </div>

                {formData.userType === "vendor" && (
                  <div className="relative w-full mt-6">
                    <Select
                      options={vendorOptions}
                      value={vendorOptions?.find(
                        (option) => option.value === formData.vendor
                      )}
                      onChange={handleSelectChange("vendor")}
                      styles={multiSelectStyle}
                      placeholder="Select Vendor"
                    />
                  </div>
                )}

                {formData.userType === "technician" && (
                  <div className="relative w-full mt-6">
                    <Select
                      options={technicianOptions}
                      value={technicianOptions?.find(
                        (option) => option.value === formData.technician
                      )}
                      onChange={handleSelectChange("technician")}
                      styles={multiSelectStyle}
                      placeholder="Select Technician"
                    />
                  </div>
                )}

                <LabelInputComponent
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  label="Amount"
                  required
                />

                <div className="relative w-full mt-6">
                  <FileInputComponent
                    name="file"
                    onChange={handleFileChange}
                    label="File"
                    uploadedFile={uploadedFile}
                  />
                </div>
              </>
            )}
          </>
        )}

        {/* Submit Button */}
        <div className="mt-10 flex w-full justify-end">
          <button
            type="submit"
            className="block rounded-md bg-[#A8353A] px-4 py-3.5 text-center text-xs font-semibold text-white"
          >
            {activeRowId ? "Edit PPM" : "Create PPM"}
          </button>
        </div>
      </form>
    </div>
  );
}
