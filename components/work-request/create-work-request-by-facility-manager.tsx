import { FormEvent, useEffect, useState } from "react";
import Select from "react-select";
import { LabelInputComponent } from "../input-container";
import { multiSelectStyle } from "@/utils/ojects";
import { useDataPermission } from "@/context";
import createAxiosInstance from "@/utils/api";

export default function CreateWorkRequestForUser({
  setModalState,
  activeRowId,
  setSuccessState,
}) {
  const axiosInstance = createAxiosInstance();
  const { user } = useDataPermission();

  const [users, setUsers] = useState<User[]>();
  const [facility, setAFacility] = useState<Facility>();
  const [block, setABlock] = useState<Block>();
  const [unit, setAUnit] = useState<Unit>();
  const [myFacilities, setMyFacilities] = useState<Facility[]>([]);
  const [myBlocks, setMyBlocks] = useState<Block[]>([]);
  const [myUnits, setMyUnits] = useState<Unit[]>([]);

  const [formData, setFormData] = useState({
    userId: "",
    title: "",
    description: "",
    entity: "",
    unit: "",
    block: "",
    facility: "",
    asset: "",
    category: "",
    single: "",
  });

  const [assetCategories, setAssetCategories] = useState<any[]>([]);
  const [theAssetCategory, setTheAssetCategory] = useState<any>();

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

  const getAssetCategories = async () => {
    if (formData.asset) {
      try {
        const response = await axiosInstance.get(`/assets/${formData.asset}`);
        const assetData = response.data.data;
        if (assetData.category) {
          setFormData({
            ...formData,
            category: assetData.id,
            single: assetData.category.categoryName,
          });
          setTheAssetCategory(assetData.category.categoryName);
        } else {
          const catResponse = await axiosInstance.get("/assets/category/all");
          setAssetCategories(catResponse.data.data);
          setFormData({
            ...formData,
            category: "",
            single: ""
          });
        }
      } catch (error) {
        console.error("Error fetching asset categories", error);
      }
    }
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

    const payload = {
      ...formData,
      category : formData.category as string
    };
    if (activeRowId) {
      await axiosInstance.patch(`/work-requests/${activeRowId}`, payload);
    } else {
      await axiosInstance.post("/work-requests/for-a-user", payload);
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
      category: "",
      single: "",
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

  const unitOptions = (user.units || myUnits)?.map((unit: Unit) => ({
    value: unit.id.toString(),
    label: unit.unitNumber,
  }));

  const blockOptions = myBlocks?.map((unit: Block) => ({
    value: unit.id.toString(),
    label: unit.blockNumber,
  }));

  const facilityOptions = myFacilities?.map((unit: Facility) => ({
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

  const categoryOptions = assetCategories?.map((cat: any) => ({
    value: cat.id.toString(),
    label: cat.categoryName, // Adjust property name as needed
  }));

  useEffect(() => {
    if (activeRowId) {
      getWorkRequest();
    }
  }, [activeRowId]);

  useEffect(() => {
    getUsers();
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
    if (formData.asset) {
      getAssetCategories();
    }
  }, [formData.asset]);

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
              (option) => option.value === formData.userId
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

            {theAssetCategory && formData.single && (
              <div className="relative w-full mt-6">
                <LabelInputComponent
                  type="text"
                  name="category"
                  value={formData.single}
                  onChange={handleChange}
                  label="Category"
                  readOnly
                />
              </div>
            )}

            {formData.asset && !formData.single && (
              <div className="relative w-full mt-6">
                <Select
                  options={categoryOptions}
                  value={categoryOptions?.find(
                    (option) => option.value === formData.category
                  )}
                  onChange={handleSelectChange("category")}
                  styles={multiSelectStyle}
                  placeholder="Select Category"
                />
              </div>
            )}
          </>
        )}

        <div className="mt-10 flex w-full justify-end">
          <button
            type="submit"
            className="block rounded-md bg-[#A8353A] px-4 py-3.5 text-center text-xs font-semibold text-white"
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
