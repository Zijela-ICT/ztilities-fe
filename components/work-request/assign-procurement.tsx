import { FormEvent, useEffect, useState } from "react";
import { FileInputComponent, LabelInputComponent } from "../input-container";
import createAxiosInstance from "@/utils/api";

export default function CommentWorkRequestOrder({
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
  const [formData, setFormData] = useState({
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

    const payload = {
      ...formData,
      file: file,
    };

    // await axiosInstance.patch(
    //   `/work-requests/${activeRowId}/comments`,
    //   payload
    // );

    // setFormData({
    //   description: "",
    // });
    // setModalState("");
    // setSuccessState({
    //   title: "Successful",
    //   detail: `You have successfully commented`,
    //   status: true,
    // });
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="mt-12 px-6 max-w-full sm:mt-6 pb-12"
      >
        <div className="relative w-full mt-6">
          <LabelInputComponent
            type="textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            label="Description"
          />
        </div>

        <div className="relative w-full mt-6">
          <FileInputComponent
            name="file"
            onChange={handleFileChange}
            label="File"
            uploadedFile={uploadedFile}
          />
        </div>
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
