import { FormEvent, useState } from "react";
import Select from "react-select";
import axiosInstance from "@/utils/api";
import { multiSelectStyle } from "@/utils/ojects";
import { FileInputComponent, LabelInputComponent } from "../input-container";
import createAxiosInstance from "@/utils/api";

export default function UpdateWorkRequest({
  setModalState,
  activeRowId,
  setSuccessState,
}) {
  const axiosInstance = createAxiosInstance();
  const [formData, setFormData] = useState({
    status: "", // Status field
    reasonForRejection: "", // reasonForRejection field for "Rejected"
    comment: "",
  });

  const statusOptions = [
    { value: "closed", label: "Closed" },
    // { value: "rejected", label: "Rejected" },
    { value: "accepted", label: "Accepted" },
  ];

  const handleSelectChange = (fieldName: string) => (selected: any) => {
    setFormData({
      ...formData,
      [fieldName]: selected?.value || "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files && files[0]) {
      setUploadedFile(files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const endpoint =
      formData.status === "closed"
        ? `/work-requests/${activeRowId}/status/close`
        : formData.status === "rejected"
        ? `/work-requests/${activeRowId}/status/reject`
        : `/work-requests/${activeRowId}/status/accept`;

    try {
      if (formData.status === "closed") {
        const formDataPayload = new FormData();
        formDataPayload.append("comment", formData.comment);
        if (uploadedFile) {
          formDataPayload.append("file", uploadedFile);
        }

        await axiosInstance.patch(endpoint, formDataPayload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else if (formData.status === "rejected") {
        await axiosInstance.patch(endpoint, {
          reasonForRejection: formData.reasonForRejection,
        });
      } else {
        await axiosInstance.patch(endpoint);
      }

      setFormData({
        status: "",
        reasonForRejection: "",
        comment: "",
      });

      setModalState("");
      setSuccessState({
        title: "Successful",
        detail: `You have successfully ${
          formData.status === "closed"
            ? "closed"
            : formData.status === "rejected"
            ? "rejected"
            : "accepted"
        } this Work Request`,
        status: true,
      });
    } catch (error) {
      console.error("Error updating work request:", error);
      setSuccessState({
        title: "Error",
        detail: "Failed to update the Work Request. Please try again.",
        status: false,
      });
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="mt-12 px-6 max-w-full sm:mt-6 pb-12"
      >
        <div className="relative w-full mt-6">
          <Select
            options={statusOptions}
            value={statusOptions.find(
              (option) => option.value === formData.status
            )}
            onChange={handleSelectChange("status")}
            styles={multiSelectStyle}
            placeholder="Select Status"
          />
        </div>

        {formData.status === "rejected" && (
          <div className="relative w-full mt-6">
            <LabelInputComponent
              type="text"
              name="reasonForRejection"
              value={formData.reasonForRejection}
              onChange={handleChange}
              label="Reason For Rejection"
            />
          </div>
        )}

        {formData.status === "closed" && (
          <div className="relative w-full mt-6">
            <LabelInputComponent
              type="text"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              label="Comment"
            />

            <div className="relative w-full mt-6">
              <FileInputComponent
                name="file"
                onChange={handleFileChange}
                label="File"
                uploadedFile={uploadedFile}
              />
            </div>
          </div>
        )}

        <div className="mt-10 flex w-full justify-end">
          <button
            type="submit"
            className="block rounded-md bg-[#A8353A] px-4 py-3.5 text-center text-xs font-semibold text-white"
          >
            {formData.status === "closed"
              ? "Close Work Request"
              : formData.status === "accepted"
              ? "Accept Work Request"
              : "Reject Work Request"}
          </button>
        </div>
      </form>
    </div>
  );
}
