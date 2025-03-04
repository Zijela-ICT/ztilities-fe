import { FormEvent, useEffect, useState } from "react";
import Select from "react-select";
import { LabelInputComponent } from "../input-container";
import { multiSelectStyle } from "@/utils/ojects";
import { useDataPermission } from "@/context";
import createAxiosInstance from "@/utils/api";

export default function CreateWorkOrder({
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
  const [allAssets, setAllAssets] = useState<Asset[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    entity: "unit", // auto-select "unit" as default
    unit: "",
    block: "",
    facility: "",
    asset: "",
    category: "",
    single: "",
  });

  // New state to hold the asset's categories
  const [assetCategories, setAssetCategories] = useState<any[]>([]);
  const [theAssetCategory, setTheAssetCategory] = useState<any>();

  // Fetch work order if activeRowId exists
  const getWorkRequest = async () => {
    if (activeRowId) {
      const response = await axiosInstance.get(`/work-orders/${activeRowId}`);
      const data = response.data.data;
      setFormData({
        ...formData,
        title: data.title,
        description: data.description,
        // Optionally, set category if your endpoint returns it:
        // category: data.category || "",
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

  // New function to fetch categories for the selected asset.
  const getAssetCategories = async () => {
    if (formData.asset) {
      try {
        const response = await axiosInstance.get(`/assets/${formData.asset}`);
        const assetData = response.data.data;
        if (assetData?.category) {
          setFormData({
            ...formData,
            category: assetData.category.id,
            single: assetData.category?.categoryName,
          });
          setTheAssetCategory(assetData.category?.categoryName);
        } else {
          const catResponse = await axiosInstance.get("/assets/category/all");
          setAssetCategories(catResponse.data.data);
          setFormData({
            ...formData,
            category: "",
            single: "",
          });
          setTheAssetCategory("");
        }
      } catch (error) {
        console.error("Error fetching asset categories", error);
      }
    }
  };

  // Load all assets initially and auto-select asset "others"
  const getAllAssets = async () => {
    try {
      const response = await axiosInstance.get("/assets");
      const assets = response.data.data;
      setAllAssets(assets);
      // Auto-select the asset with assetName "others"
      const otherAsset = assets?.find(
        (asset: Asset) => asset?.assetName?.toLowerCase() === "others"
      );
      if (otherAsset) {
        setFormData((prev) => ({
          ...prev,
          asset: otherAsset?.id?.toString() || "",
        }));
      }
    } catch (error) {
      console.error("Error fetching all assets", error);
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
      category: formData.category.toString(),
    };

    if (activeRowId) {
      await axiosInstance.patch(`/work-orders/${activeRowId}`, formData);
    } else {
      await axiosInstance.post("/work-orders/work-order/", formData);
    }
    setFormData({
      title: "",
      description: "",
      entity: "unit",
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
      } this Work Order`,
      status: true,
    });
  };

  const entityOptions = [
    { value: "unit", label: "Unit" },
    { value: "block", label: "Block" },
    { value: "facility", label: "Facility" },
  ];

  const unitOptions = (user?.units || myUnits)?.map((unit: Unit) => ({
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

  // Compute assetOptions:
  // If an entity is selected and its details (unit, block, or facility) have assets, show those.
  // Otherwise, fallback to the allAssets loaded initially.
  const assetOptions =
    formData.entity === "unit" && unit?.assets?.length
      ? unit.assets.map((asset: Asset) => ({
          value: asset.id.toString(),
          label: asset.assetName,
        }))
      : formData.entity === "facility" && facility?.assets?.length
      ? facility.assets.map((asset: Asset) => ({
          value: asset.id.toString(),
          label: asset.assetName,
        }))
      : formData.entity === "block" && block?.assets?.length
      ? block.assets.map((asset: Asset) => ({
          value: asset.id.toString(),
          label: asset.assetName,
        }))
      : allAssets?.map((asset: Asset) => ({
          value: asset.id.toString(),
          label: asset.assetName,
        }));

  // Compute category options from the assetCategories state
  const categoryOptions = assetCategories?.map((cat: any) => ({
    value: cat.id.toString(),
    label: cat.categoryName,
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
    getAllAssets(); // load all assets on mount
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

  // Fetch the asset's categories when an asset is selected.
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
        <LabelInputComponent
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          label="Title"
          required
        />

        <LabelInputComponent
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          label="Description"
        />

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

            {theAssetCategory && (
              <LabelInputComponent
                type="text"
                name="category"
                value={formData.single}
                onChange={handleChange}
                label="Category"
                readOnly
              />
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
            {activeRowId ? "Edit Work Order" : "Create Work Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
