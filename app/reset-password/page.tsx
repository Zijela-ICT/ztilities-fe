"use client";

import ButtonComponent from "@/components/button-component";
import FooterComponent from "@/components/footer-component";
import InputComponent from "@/components/input-container";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import axiosInstance from "@/utils/api";
import UnprotectedRoute from "@/components/auth/unprotected-routes";
import { SuccessModalCompoenent } from "@/components/modal-component";
import { toast } from "react-toastify";
import createAxiosInstance from "@/utils/api";

const Logo = "/assets/logo.png";
const images = [
  "/assets/beaux-house-of-provence.png",
  "/assets/house-of-provence-with-swimming-pool.png",
  "/assets/mid-century-modern-house-of-provence.png",
];

export default function ResetPassword() {
  const axiosInstance = createAxiosInstance();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [toggleView, setToggleView] = useState(false);

  const [hash, setHash] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [modalState, setModalState] = useState(false);

  // Set email from the URL query parameter
  useEffect(() => {
    const queryhash = new URLSearchParams(window.location.search).get("hash");
    if (queryhash) {
      setHash(queryhash);
    }
  }, []);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    const response = await axiosInstance.post("/auth/reset-password", {
      token: hash,
      newPassword: password,
    });
    setModalState(true)
    // router.push("/");
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);
  return (
    <UnprotectedRoute>
      <>
        <SuccessModalCompoenent
          title={"Sussessful"}
          detail={"Reset password successful"}
          modalState={modalState}
          setModalState={setModalState}
          customAction={() => router.push("/")}
        ></SuccessModalCompoenent>

        <div className="relative h-full md:p-24 p-0 bg-transparent">
          <div className="rounded-2xl w-full bg-white flex  flex-col md:flex-row min-h-[90vh]">
            <div className="md:w-1/2 w-full py-24 sm:px-24 px-8">
              <Image src={Logo} alt="logo" width={93} height={60} />

              <h1 className="text-2xl font-semibold mt-8 mb-2">
                Reset Password
              </h1>
              <h5 className="text-gray-500">Create your new password</h5>

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
                <InputComponent
                  type={!toggleView ? "password" : "text"}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="Confirm Password"
                  className="mt-6"
                  show
                  toggleView={toggleView}
                  onClick={() => setToggleView(!toggleView)}
                />
                <ButtonComponent
                  text={password === "" ? "Proceed" : "Reset"}
                  disabled={password === "" || confirmPassword === ""}
                  className="mt-12 text-white"
                />
              </form>
            </div>
            <div className="flex-1 bg-[#FBC2B61A] rounded-2xl min-h-full flex justify-center items-center ">
              <Image
                src={images[currentIndex]}
                alt={`House logo ${currentIndex + 1}`}
                width={487.4}
                height={389.92}
              />
            </div>
          </div>
          <FooterComponent />
        </div>
      </>
    </UnprotectedRoute>
  );
}
