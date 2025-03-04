import { FormEvent, useEffect, useState } from "react";
import Select from "react-select";
import { LabelInputComponent } from "../input-container";
import { multiSelectStyle } from "@/utils/ojects";
import createAxiosInstance from "@/utils/api";

export default function CreateCategory({
  setModalState,
  activeRowId,
  setSuccessState,
}) {
  const axiosInstance = createAxiosInstance();
  const [formData, setFormData] = useState({
    categoryName: "",
    description: "",
    subcategory: "",
    subcategoryName: "",
    subcategoryDescription: "",
  });

  const [subcategoryOptions, setSubcategoryOptions] = useState([]);

  // Fetch category details if activeRowId exists
  const getCategoryDetails = async () => {
    if (activeRowId) {
      const response = await axiosInstance.get(
        `/assets/category/sub-category/${activeRowId}`
      );
      const data = response.data.data;

      setFormData({
        categoryName: data.categoryName || "",
        description: data.description || "",
        subcategory: "",
        subcategoryName: "",
        subcategoryDescription: "",
      });

      const subcategories = data.subcategories || [];
      setSubcategoryOptions(
        subcategories.map((subcategory: any) => ({
          value: subcategory.id.toString(),
          label: subcategory.name,
        }))
      );
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

    if (activeRowId) {
      // If activeRowId exists, update category and optionally add subcategory
      await axiosInstance.post(`/assets/sub-category/`, {
        subCategoryName: formData.subcategoryName,
        description: formData.subcategoryDescription,
        id: activeRowId,
      });
    } else {
      // If no activeRowId, create a new category
      await axiosInstance.post("/assets/category", {
        categoryName: formData.categoryName,
        description: formData.description,
      });
    }

    setFormData({
      categoryName: "",
      description: "",
      subcategory: "",
      subcategoryName: "",
      subcategoryDescription: "",
    });

    setModalState("");
    setSuccessState({
      title: "Successful",
      detail: `You have successfully ${
        activeRowId ? "updated" : "created"
      } the category`,
      status: true,
    });
  };

  useEffect(() => {
    if (activeRowId) {
      getCategoryDetails();
    }
  }, [activeRowId]);

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="mt-12 px-6 max-w-full sm:mt-6 pb-12"
      >
        {!activeRowId && (
          <>
            <LabelInputComponent
              type="text"
              name="categoryName"
              value={formData.categoryName}
              onChange={handleChange}
              label="Category Name"
              readOnly={!!activeRowId} // Read-only when activeRowId exists
            />

            <LabelInputComponent
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              label="Description (Optional)"
              readOnly={!!activeRowId} // Read-only when activeRowId exists
            />
          </>
        )}

        {activeRowId && (
          <>
            <h1 className="text-base text-black mt-4"> Add Sub Category </h1>

            <LabelInputComponent
              type="text"
              name="subcategoryName"
              value={formData.subcategoryName}
              onChange={handleChange}
              label="Subcategory Name"
            />

            {/* <div className="relative w-full mt-6">
              <LabelInputComponent
                type="text"
                name="subcategoryDescription"
                value={formData.subcategoryDescription}
                onChange={handleChange}
                label="Subcategory Description"
              />
            </div> */}
          </>
        )}

        <div className="mt-10 flex w-full justify-end">
          <button
            type="submit"
            className="block rounded-md bg-[#A8353A] px-4 py-3.5 text-center text-xs font-semibold text-white"
          >
            {activeRowId ? "Add Sub Category" : "Create Category"}
          </button>
        </div>
      </form>
    </div>
  );
}
