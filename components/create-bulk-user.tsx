"use client";

import { FormEvent, useState, useEffect } from "react";
import { LabelInputComponent } from "./input-container";
import axiosInstance from "@/utils/api";

export default function CreateBulkUser() {
  const [formData, setFormData] = useState({
    name: "", // Default state
  });

  useEffect(() => {
    setFormData({ name: "Superadmin" }); // Set default value
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    // Handle form submission logic here
    const response = await axiosInstance.post("/users/pre-register", {
      formData,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="mt-12 px-6 max-w-full sm:mt-6 pb-12">
      <form onSubmit={handleSubmit}>

      </form>
    </div>
  );
}
