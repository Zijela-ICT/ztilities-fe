"use client";

import ButtonComponent from "@/components/button-component";
import FooterComponent from "@/components/footer-component";
import InputComponent from "@/components/input-container";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import UnprotectedRoute from "@/components/auth/unprotected-routes";
import { SuccessModalCompoenent } from "@/components/modal-component";
import createAxiosInstance from "@/utils/api";

const Logo = "/assets/logo.png";
const images = [
  "/assets/beaux-house-of-provence.png",
  "/assets/house-of-provence-with-swimming-pool.png",
  "/assets/mid-century-modern-house-of-provence.png",
];

export default function LogIn() {
  const axiosInstance = createAxiosInstance();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [toggleView, setToggleView] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");

  const [modalState, setModalState] = useState(false);

  // Set email from the URL query parameter
  useEffect(() => {
    const queryEmail = new URLSearchParams(window.location.search).get("email");
    if (queryEmail) {
      setEmail(queryEmail);
    }
  }, []);

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
    const response = await axiosInstance.post("auth/login", {
      email,
      password,
    });

    if (response.data.message === "User login successful") {
      localStorage.setItem("authToken", response.data.data.access_token);
      localStorage.setItem("refreshToken", response.data.data.refresh_token);
      router.push("/dashboard");
    } else {
      setUserId(response.data?.data?.userId);
      setMessage(response.data?.message);
      setModalState(true);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);
  return (
    <UnprotectedRoute>
      <SuccessModalCompoenent
        title={message}
        detail={"2FA token sent to your email address"}
        modalState={modalState}
        setModalState={setModalState}
        customAction={() => router.push(`/two-factor-auth?userId=${userId}`)}
        text="Proceed"
      ></SuccessModalCompoenent>
      <div className="relative h-full md:p-24 p-0 bg-transparent">
        <div className="rounded-2xl w-full bg-white flex  flex-col md:flex-row min-h-[90vh]">
          <div className="md:w-1/2 w-full py-24 sm:px-24 px-8">
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
              />
              <InputComponent
                type={!toggleView ? "password" : "text"}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Password"
                className=""
                show
                toggleView={toggleView}
                onClick={() => setToggleView(!toggleView)}
              />
              <div className="text-right w-full">
                <span
                  onClick={() => router.push(`/forgot-password`)}
                  className="text-[#A8353A] font-semibold text-xs cursor-pointer"
                >
                  Forgot Password?
                </span>
              </div>

              <ButtonComponent
                text={password === "" ? "Proceed" : "Log in"}
                disabled={password === "" || email === ""}
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
    </UnprotectedRoute>
  );
}
