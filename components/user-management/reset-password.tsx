"use client";

import { FormEvent, useEffect, useState } from "react";
import { LabelInputComponent } from "../input-container";
import axiosInstance from "@/utils/api";
import createAxiosInstance from "@/utils/api";

export default function ResetPassword({ roles, setModalState, activeRowId,setSuccessState }) {
  const axiosInstance = createAxiosInstance();
  const [formData, setFormData] = useState({
    user: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await axiosInstance.patch("/users/reset-password/admin", {
      userId: user.id,
      password: formData.password,
    });
    setModalState("");
    setSuccessState({
      title: "Successful",
      detail: "You have successfully reset the password for this user",
      status :true
    });
  };

  const [user, setUser] = useState<User | null>(null);
  const getAUsers = async () => {
    const response = await axiosInstance.get(`/users/${activeRowId}`);
    if (response.data.data) {
      setUser(response.data.data);
    }
  };

  useEffect(() => {
    if (activeRowId !== null) getAUsers();
  }, [activeRowId]);

  useEffect(() => {
    if (user) {
      setFormData({
        user: user.firstName + user.lastName || "",
        password: "",
      });
    }
  }, [user]);

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="mt-12 px-6 max-w-full sm:mt-6 pb-12"
      >
        <div className="relative w-full mt-6">
          <LabelInputComponent
            type="text"
            name="user"
            value={formData.user}
            onChange={handleChange}
            label="Name of user"
            readOnly={true}
          />
        </div>
        {/* <div className="relative w-full mt-6">
          <LabelInputComponent
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            label="New Password"
          />
        </div> */}

        <div className="mt-10 flex w-full justify-end">
          <button
            type="submit"
            className="block rounded-md bg-[#A8353A] px-4 py-3.5 text-center text-xs font-semibold text-white"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
