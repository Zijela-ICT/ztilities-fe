import { FormEvent, useEffect, useState } from "react";
import Select from "react-select";
import { LabelInputComponent } from "../input-container";
import axiosInstance from "@/utils/api";
import { multiSelectStyle } from "@/utils/ojects";
import { useDataPermission } from "@/context";

export default function CreateWorkRequestForUser({
  setModalState,
  activeRowId,
  setSuccessState,
}) {
  const { user } = useDataPermission();

  const [users, setUsers] = useState<User[]>();
  const [facility, setAFacility] = useState<Facility>();
  const [block, setABlock] = useState<Block>();
  const [unit, setAUnit] = useState<Unit>();

  const [formData, setFormData] = useState({
    userId: "",
    title: "",
    description: "",
    entity: "",
    unit: "",
    block: "",
    facility: "",
    asset: "",
  });

  // Fetch work request if activeRowId exists
  const getWorkRequest = async () => {
    if (activeRowId) {
      const response = await axiosInstance.get(`/work-requests/${activeRowId}`);
      const data = response.data.data;
      setFormData({
        ...formData,
        title: data.title,
        description: data.description,
      });
    }
  };

  const getUsers = async () => {
    const response = await axiosInstance.get("/users");
    setUsers(response.data.data);
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
      await axiosInstance.patch(`/work-requests/${activeRowId}`, formData);
    } else {
      await axiosInstance.post("/work-requests/for-a-user", formData);
    }
    setFormData({
      userId: "",
      title: "",
      description: "",
      entity: "",
      unit: "",
      block: "",
      facility: "",
      asset: "",
    });
    setModalState("");
    setSuccessState({
      title: "Successful",
      detail: `You have successfully ${
        activeRowId ? "edited" : "created"
      } this Work Request`,
      status: true,
    });
  };

  const entityOptions = [
    { value: "unit", label: "Unit" },
    { value: "block", label: "Block" },
    { value: "facility", label: "Facility" },
  ];

  const userOptions = users?.map((unit: User) => ({
    value: unit.id.toString(),
    label: unit.firstName + unit.lastName,
  }));

  const unitOptions = user?.units?.map((unit: Unit) => ({
    value: unit.id.toString(),
    label: unit.unitNumber,
  }));

  const blockOptions = user?.blocks?.map((unit: Block) => ({
    value: unit.id.toString(),
    label: unit.blockNumber,
  }));

  const facilityOptions = user?.facilities?.map((unit: Facility) => ({
    value: unit.id.toString(),
    label: unit.name,
  }));

  const assetOptions =
    formData.entity === "unit"
      ? unit?.assets?.map((unit: Asset) => ({
          value: unit.id.toString(),
          label: unit.assetName,
        }))
      : formData?.entity === "facility"
      ? facility?.assets?.map((block: Asset) => ({
          value: block.id.toString(),
          label: block.assetName,
        }))
      : formData?.entity === "block"
      ? block?.assets?.map((otherBlock: Asset) => ({
          value: otherBlock.id.toString(),
          label: otherBlock.assetName,
        }))
      : [];

  useEffect(() => {
    if (activeRowId) {
      getWorkRequest();
    }
  }, [activeRowId]);

  useEffect(() => {
    getUsers();
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

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="mt-12 px-6 max-w-full sm:mt-6 pb-12"
      >
        <div className="relative w-full mt-6">
          <Select
            options={userOptions}
            value={userOptions?.find(
              (option) => option.value === formData.asset
            )}
            onChange={handleSelectChange("userId")}
            styles={multiSelectStyle}
            placeholder="Select a user"
          />
        </div>
        <div className="relative w-full mt-6">
          <LabelInputComponent
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            label="Title"
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

        {/* Only show the rest of the form if there is no activeRowId */}
        {!activeRowId && (
          <>
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
          </>
        )}

        <div className="mt-10 flex w-full justify-end">
          <button
            type="submit"
            className="block rounded-md bg-[#A8353A] px-4 py-3.5 text-center text-base font-semibold text-white"
          >
            {activeRowId
              ? "Edit Work Request for a user"
              : "Create Work Request for a user"}
          </button>
        </div>
      </form>
    </div>
  );
}
