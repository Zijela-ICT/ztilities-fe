"use client";

import ButtonComponent from "@/components/button-component";
import InputComponent from "@/components/input-container";
import { FormEvent, useEffect, useState } from "react";
import axiosInstance from "@/utils/api";
import { SuccessModalCompoenent } from "@/components/modal-component";
import { useDataPermission } from "@/context";

export default function ChangeMyPassword() {
  const { user, setUser } = useDataPermission();
  const [toggleView, setToggleView] = useState(false);

  const [hash, setHash] = useState("");
  const [password, setPassword] = useState("");

  const [modalState, setModalState] = useState(false);

  // Set email from the URL query parameter
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setHash(token);
    }
  }, []);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
  };

  const getMe = async () => {
    const response = await axiosInstance.get("/auth/me");
    setUser(response.data.data.user);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await axiosInstance.patch("/users/reset-password/user", {
      token: hash,
      password: password,
    });
    getMe();
  };

  return (
    <>
      <SuccessModalCompoenent
        title={"Sussessful"}
        detail={"Changed password successful"}
        modalState={modalState}
        setModalState={setModalState}
      ></SuccessModalCompoenent>
      <div className="mt-12 px-6 max-w-full sm:mt-6 pb-12">
        <form className="my-10" onSubmit={handleSubmit}>
          <InputComponent
            type={!toggleView ? "password" : "text"}
            value={password}
            onChange={handlePasswordChange}
            placeholder="New Password"
            className=""
            show
            toggleView={toggleView}
            onClick={() => setToggleView(!toggleView)}
          />
          <ButtonComponent
            text={password === "" ? "Proceed" : "Change"}
            disabled={password === ""}
            className="mt-12 text-white"
          />
        </form>
      </div>
    </>
  );
}
