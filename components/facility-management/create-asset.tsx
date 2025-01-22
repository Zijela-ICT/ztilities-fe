import { FormEvent, useEffect, useState } from "react";
import Select from "react-select";
import { LabelInputComponent } from "../input-container";
import axiosInstance from "@/utils/api";
import { multiSelectStyle } from "@/utils/ojects";

export default function CreateAsset({
  setModalState,
  activeRowId,
  setSuccessState,
}) {
  const [formData, setFormData] = useState({
    assetName: "",
    description: "",
    categoryId: null,
    subCategoryId: null,
  });

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategoryIdOptions, setsubCategoryIdOptions] = useState([]);

  // Fetch asset details and categories if activeRowId exists
  const getAssetDetails = async () => {
    if (activeRowId) {
      const response = await axiosInstance.get(`/assets/${activeRowId}`);
      const data = response.data.data;

      // Fetch categories and subcategories before setting formData
      if (data.category?.id) {
        await fetchSubcategories(data.category.id);
      }

      setFormData({
        assetName: data.assetName || "",
        description: data.description || "",
        categoryId: data.category?.id || "",
        subCategoryId: data.subCategoryId?.id || "",
      });
    }
  };

  const fetchCategories = async () => {
    const response = await axiosInstance.get("/assets/category/all");
    const categories = response.data.data;
    setCategoryOptions(
      categories.map((category: any) => ({
        value: category.id.toString(),
        label: category.categoryName,
      }))
    );
  };

  const fetchSubcategories = async (categoryId: string) => {
    const response = await axiosInstance.get(
      `/assets/category/sub-category/${categoryId}`
    );
    const subCategories = response.data.data.subCategories || [];
    setsubCategoryIdOptions(
      subCategories.map((subCategoryId: any) => ({
        value: subCategoryId.id.toString(),
        label: subCategoryId.subCategoryName,
      }))
    );
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

    // Fetch subcategories when a category is selected
    if (fieldName === "categoryId" && selected?.value) {
      fetchSubcategories(selected.value);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    formData.categoryId = Number(formData.categoryId);
    formData.subCategoryId = Number(formData.subCategoryId);
    if (activeRowId) {
      // Update the asset
      await axiosInstance.patch(`/assets/${activeRowId}`, formData);
    } else {
      // Create a new asset
      await axiosInstance.post("/assets", formData);
    }

    setFormData({
      assetName: "",
      description: "",
      categoryId: null,
      subCategoryId: null,
    });

    setModalState("");
    setSuccessState({
      title: "Successful",
      detail: `You have successfully ${
        activeRowId ? "updated" : "created"
      } the asset.`,
      status: true,
    });
  };

  useEffect(() => {
    fetchCategories();
    if (activeRowId) {
      getAssetDetails();
    }
  }, [activeRowId]);

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="mt-12 px-6 max-w-full sm:mt-6 pb-12"
      >
        <div className="relative w-full mt-6">
          <LabelInputComponent
            type="text"
            name="assetName"
            value={formData.assetName}
            onChange={handleChange}
            label="Asset Name"
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

        {!activeRowId && (
          <div className="relative w-full mt-6">
            <Select
              options={categoryOptions}
              value={categoryOptions.find(
                (option) => option.value === formData.categoryId
              )}
              onChange={handleSelectChange("categoryId")}
              styles={multiSelectStyle}
              placeholder="Select Category"
            />
          </div>
        )}

        {formData.categoryId && (
          <div className="relative w-full mt-6">
            <Select
              options={subCategoryIdOptions}
              value={subCategoryIdOptions.find(
                (option) => option.value === formData.subCategoryId
              )}
              onChange={handleSelectChange("subCategoryId")}
              styles={multiSelectStyle}
              placeholder="Select subCategoryId"
            />
          </div>
        )}

        <div className="mt-10 flex w-full justify-end">
          <button
            type="submit"
            className="block rounded-md bg-[#A8353A] px-4 py-3.5 text-center text-xs font-semibold text-white"
          >
            {activeRowId ? "Update Asset" : "Create Asset"}
          </button>
        </div>
      </form>
    </div>
  );
}
