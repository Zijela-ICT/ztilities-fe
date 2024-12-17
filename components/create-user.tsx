"use client";

import { FormEvent, useEffect, useState } from "react";
import Select from "react-select";
import { LabelInputComponent } from "./input-container";
import axiosInstance from "@/utils/api";
import { multiSelectStyle } from "@/utils/ojects";

export default function CreateUser({
  roles,
  setModalState,
  activeRowId,
  setSuccessState,
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    email: "",
    roles: [],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (selected) => {
    setFormData({ ...formData, roles: selected.map((option) => option.value) });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (activeRowId) {
      const response = await axiosInstance.patch(`/users/${user.id}`, {
        ...formData,
        roles: formData.roles,
      });
      console.log(formData.roles);
    } else {
      // If no user, perform a POST request
      const response = await axiosInstance.post("/users/pre-register", {
        ...formData,
        roles: formData.roles,
      });
    }
    setFormData({
      firstName: "",
      lastName: "",
      password: "",
      email: "",
      roles: [],
    });
    setModalState("");
    setSuccessState({
      title: "Successful",
      detail: `You have successfully ${
        activeRowId ? "edited" : "created"
      } this user`,
      status: true,
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
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        password: user.password,
        email: user.email || "",
        roles:
          user.roles && user.roles.length > 0
            ? user.roles.map((role) => role.id)
            : [],
      });
    }
  }, [user]);

  const roleOptions = roles?.map((role) => ({
    value: role.id,
    label: role.name,
  }));

  const defaultRoles = roleOptions?.filter((option) =>
    formData.roles.includes(option.value)
  );

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
        {activeRowId ? (
          <></>
        ) : (
          <div className="relative w-full mt-6">
            <LabelInputComponent
              type="tel"
              name="password"
              value={formData.password}
              onChange={handleChange}
              label="Password"
            />
          </div>
        )}

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
          <Select
            isMulti
            name="role"
            options={roleOptions}
            value={defaultRoles}
            onChange={handleRoleChange}
            className="peer w-full rounded-lg text-base text-gray-900 outline-none bg-gray-100"
            classNamePrefix="react-select"
            placeholder="Select roles"
            styles={multiSelectStyle}
          />
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
