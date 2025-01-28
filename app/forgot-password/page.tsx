"use client";

import ButtonComponent from "@/components/button-component";
import FooterComponent from "@/components/footer-component";
import InputComponent from "@/components/input-container";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SuccessModalCompoenent } from "@/components/modal-component";
import UnprotectedRoute from "@/components/auth/unprotected-routes";
import axiosInstance from "@/utils/api";
import createAxiosInstance from "@/utils/api";

const Logo = "/assets/logo.png";
const images = [
  "/assets/beaux-house-of-provence.png",
  "/assets/house-of-provence-with-swimming-pool.png",
  "/assets/mid-century-modern-house-of-provence.png",
];

export default function ForgotPassword() {
  const axiosInstance = createAxiosInstance();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [email, setEmail] = useState("");

  const [modalState, setModalState] = useState(false);
  const [message, setMessage] = useState("");
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await axiosInstance.post("/auth/forgot-password", {
      email,
    });
    setMessage(response.data.message);
    setModalState(true);
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
          title={"Token Sent"}
          detail={message}
          modalState={modalState}
          setModalState={setModalState}
          customAction={() => router.push("/")}
        ></SuccessModalCompoenent>

        <div className="relative h-full md:p-24 p-0 bg-transparent">
          <div className="rounded-2xl w-full bg-white flex  flex-col md:flex-row min-h-[90vh]">
            <div className="md:w-1/2 w-full py-24 sm:px-24 px-8">
              <Image src={Logo} alt="logo" width={93} height={60} />

              <h1 className="text-2xl font-semibold mt-8 mb-2">
                Forgot Password
              </h1>
              <h5 className="text-gray-500">
                Enter your email address to reset your password.
              </h5>

              <form className="my-10" onSubmit={handleSubmit}>
                <InputComponent
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Email Address"
                  className="mb-4"
                />

                <ButtonComponent
                  text={email === "" ? "Enter Email" : "Send Reset Link"}
                  disabled={email === ""}
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
