"use client";

import ButtonComponent from "@/components/button-component";
import FooterComponent from "@/components/footer-component";
import InputComponent from "@/components/input-container";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const Logo = "/assets/logo.png";
const images = [
  "/assets/beaux-house-of-provence.png",
  "/assets/house-of-provence-with-swimming-pool.png",
  "/assets/mid-century-modern-house-of-provence.png",
];

export default function LogIn() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await axios.post(
      "http://172.206.195.10/api/v1/auth/login",
      {
        email,
        password,
      }
    );
    localStorage.setItem("authToken", response.data.access_token); // Store the token
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
      <div className="rounded-2xl w-full bg-white flex min-h-[90vh]">
        <div className="w-1/2 py-24 px-24">
          <Image src={Logo} alt="logo" width={93} height={60} />

          <h1 className="text-2xl font-semibold mt-8 mb-2">Sign In</h1>
          <h5 className="text-gray-500">Enter your details to log in</h5>

          <form className="my-10" onSubmit={handleSubmit}>
            <InputComponent
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Email address"
              className="mb-4"
              show
            />
            <InputComponent
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Password"
              className=""
              show
            />
            <div className="text-right w-full">
              <span className="text-[#A8353A] font-semibold cursor-pointer">
                Forgot Password?
              </span>
            </div>

            <ButtonComponent
              text={password === "" ? "Proceed" : "Log in"}
              disabled={password === ""}
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
