"use client";

import ButtonComponent from "@/components/button-component";
import FooterComponent from "@/components/footer-component";
import InputComponent from "@/components/input-container";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Logo = "/assets/logo.png";
const images = [
  "/assets/beaux-house-of-provence.png",
  "/assets/house-of-provence-with-swimming-pool.png",
  "/assets/mid-century-modern-house-of-provence.png",
];

export default function CompleteRegistration() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await axios.post("/users/reset-password/user", {
      password: newPassword,
    });
    localStorage.setItem("authToken", response.data.access); // Store the token
    router.push("/dashboard");
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="relative h-full p-24 bg-transparent">
      <div className="rounded-2xl w-full bg-white flex flex-col md:flex-row min-h-[90vh]">
        <div className="md:w-1/2 w-full py-24 sm:px-24 px-8">
          <Image src={Logo} alt="logo" width={93} height={60} />

          <h1 className="text-2xl font-semibold mt-8 mb-2">
            Complete Registration
          </h1>
          <h5 className="text-gray-500">
            Your email has been verified. kindly enter your password.
          </h5>

          <form className="my-10" onSubmit={handleSubmit}>
            <InputComponent
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Password"
              className="mb-4"
              show
            />
            <InputComponent
              type="password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              placeholder="New Password"
              className=""
              show
            />

            <ButtonComponent
              text={newPassword === "" ? "Proceed" : "Log in"}
              disabled={newPassword === ""}
              className="mt-12"
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
  );
}
