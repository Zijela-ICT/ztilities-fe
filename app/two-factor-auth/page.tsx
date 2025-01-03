"use client";

import ButtonComponent from "@/components/button-component";
import FooterComponent from "@/components/footer-component";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import axiosInstance from "@/utils/api";
import UnprotectedRoute from "@/components/auth/unprotected-routes";

const Logo = "/assets/logo.png";
const images = [
  "/assets/beaux-house-of-provence.png",
  "/assets/house-of-provence-with-swimming-pool.png",
  "/assets/mid-century-modern-house-of-provence.png",
];

export default function Authenticate() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const [hash, setHash] = useState("");
  const [code, setCode] = useState(Array(6).fill("")); // Array to hold each digit

  // Set userId from the URL query parameter
  useEffect(() => {
    const queryhash = new URLSearchParams(window.location.search).get("userId");
    if (queryhash) {
      setHash(queryhash);
    }
  }, []);

  // Handle changes for each input box
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Only allow numbers
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Automatically focus the next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-input-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const authCode = code.join("");
    const response = await axiosInstance.post("/users/2fa/validate", {
      userId: Number(hash),
      token: authCode,
    });
    localStorage.setItem("authToken", response.data.data.access_token);
    router.push("/dashboard");
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
        <div className="relative h-full md:p-24 p-0 bg-transparent">
          <div className="rounded-2xl w-full bg-white flex flex-col md:flex-row min-h-[90vh]">
            <div className="md:w-1/2 w-full py-24 sm:px-24 px-8">
              <Image src={Logo} alt="logo" width={93} height={60} />

              <h1 className="text-2xl font-semibold mt-8 mb-2">
                Enter Authentication Code
              </h1>
              <h5 className="text-gray-500">
                Please enter the 6-digit code sent to your email
              </h5>

              <form className="my-10" onSubmit={handleSubmit}>
                <div className="flex gap-1 justify-between">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      id={`code-input-${index}`}
                      type="text"
                      value={digit}
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      maxLength={1}
                      className="w-12 h-12 text-center bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ))}
                </div>
                <ButtonComponent
                  text={"Verify"}
                  disabled={code.some((digit) => digit === "")}
                  className="mt-12 text-white"
                />
              </form>
            </div>
            <div className="flex-1 bg-[#FBC2B61A] rounded-2xl min-h-full flex justify-center items-center">
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
