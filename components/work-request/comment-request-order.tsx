import { FormEvent, useState } from "react";
import { LabelTextareaComponent } from "../input-container";
import createAxiosInstance from "@/utils/api";
import { useDataPermission } from "@/context";

export default function CommentWorkRequestOrder({
  setModalState,
  activeRowId,
  setSuccessState,
  type,
}: {
  setModalState: (state: string) => void;
  activeRowId?: string | null;
  type: string;
  setSuccessState: (state: {
    title: string;
    detail: string;
    status: boolean;
  }) => void;
}) {
  const axiosInstance = createAxiosInstance();
  const { userRoles } = useDataPermission();

  // Check if the user has the TENANT_ROLE 
  const hasThisRole = userRoles.some(
    (role: Role) =>
      role.name === "TENANT_ROLE" ||
      role.name === "VENDOR_ROLE" ||
      role.name === "TECHNICIAN_ROLE"
  );
  const [formData, setFormData] = useState({
    comment: "",
    isInternal: false,
  });

  // Type narrowing for checkbox to correctly access `checked`
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, type, value } = e.target;
    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = { ...formData };

    if (type === "requests") {
      await axiosInstance.patch(
        `/work-requests/${activeRowId}/comments`,
        payload
      );
    } else {
      await axiosInstance.patch(
        `/work-orders/${activeRowId}/comments`,
        payload
      );
    }

    setFormData({ comment: "", isInternal: false });
    setModalState("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully commented",
      status: true,
    });
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="mt-12 px-6 max-w-full sm:mt-6 pb-12"
      >
        {/* Comment Textarea */}
        <div className="relative w-full mt-6">
          <LabelTextareaComponent
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            label="Comment"
          />
        </div>

        {/* Toggle for "Internal" using the provided design */}
        {!hasThisRole && (
          <div className="mt-6 flex items-center space-x-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isInternal"
                checked={formData.isInternal}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div
                className="w-8 h-4 bg-gray-900 rounded-full peer 
                            peer-checked:after:translate-x-4 
                            peer-checked:after:border-white 
                            after:content-[''] 
                            after:absolute 
                            after:top-[2px] 
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
            </label>
            <span>Is this internal comment ?</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-10 flex w-full justify-end">
          <button
            type="submit"
            className="block rounded-md bg-[#A8353A] px-4 py-3.5 text-center text-xs font-semibold text-white"
          >
            Comment
          </button>
        </div>
      </form>
    </div>
  );
}
