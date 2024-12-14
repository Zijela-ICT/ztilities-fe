"use client";

import { FormEvent, useEffect, useState } from "react";
import { LabelInputComponent } from "./input-container";
import axiosInstance from "@/utils/api";

export default function CreateUser({ roles, setModalState, activeRowId }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    email: "",
    role: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(activeRowId);
    if (activeRowId) {
      // If user exists, perform a PATCH request
      const response = await axiosInstance.patch(`/users/${user.id}`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
    } else {
      // If no user, perform a POST request
      const response = await axiosInstance.post("/users/pre-register", {
        ...formData,
        role: Number(formData.role),
      });
    }
    setFormData({
      firstName: "",
      lastName: "",
      password: "",
      email: "",
      role: "",
    });
    setModalState();
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
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        password: user.password,
        email: user.email || "",
        role: user.roles && user.roles.length > 0 ? String(user.roles[0].id) : "",
      });
    }
  }, [user]);

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="mt-12 px-6 max-w-full sm:mt-6 pb-12"
      >
        <div className="flex gap-4">
          <div className="relative w-1/2">
            <LabelInputComponent
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              label="First Name"
              required
            />
          </div>
          <div className="relative w-1/2">
            <LabelInputComponent
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              label="Last Name"
              required
            />
          </div>
        </div>
        <div className="relative w-full mt-6">
          <LabelInputComponent
            type="tel"
            name="password"
            value={formData.password}
            onChange={handleChange}
            label="Password"
          />
        </div>
        <div className="relative w-full mt-6">
          <LabelInputComponent
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            label="Email"
          />
        </div>

        <div className="relative w-full mt-6">
          <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400">
            Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="peer w-full rounded-lg px-3 pt-6 pb-3 text-base text-gray-900 outline-none bg-gray-100 appearance-none"
          >
            <option value="" disabled hidden>
              Select a role
            </option>
            {roles?.map((role) => {
              return (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              );
            })}
          </select>
          <svg
            className="absolute right-3 top-6 pointer-events-none"
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.7998 7.4998L13.3998 1.7998C13.7998 1.3998 13.7998 0.799804 13.3998 0.399804C12.9998 -0.00019598 12.3998 -0.00019598 11.9998 0.399804L6.9998 5.2998L1.9998 0.399804C1.5998 -0.00019598 0.999804 -0.00019598 0.599804 0.399804C0.399804 0.599804 0.299805 0.799805 0.299805 1.0998C0.299805 1.39981 0.399804 1.5998 0.599804 1.7998L6.1998 7.4998C6.6998 7.8998 7.2998 7.8998 7.7998 7.4998C7.6998 7.4998 7.6998 7.4998 7.7998 7.4998Z"
              fill="#A8353A"
            />
          </svg>
        </div>

        <div className="mt-10 flex w-full justify-end">
          <button
            type="submit"
            className="block rounded-md bg-[#A8353A] px-4 py-3.5 text-center text-base font-semibold text-white"
          >
            {activeRowId ? "Edit User" : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}
