"use client";

import ButtonComponent from "@/components/button-component";
import FooterComponent from "@/components/footer-component";
import InputComponent from "@/components/input-container";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import UnprotectedRoute from "@/components/auth/unprotected-routes";
import { SuccessModalCompoenent } from "@/components/modal-component";
import createAxiosInstance from "@/utils/api";

const Logo = "/assets/logo.png";
const images = [
  "/assets/beaux-house-of-provence.png",
  "/assets/house-of-provence-with-swimming-pool.png",
  "/assets/mid-century-modern-house-of-provence.png",
];

export default function SignUp() {
  const axiosInstance = createAxiosInstance();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  // form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  // for modal feedback
  const [message, setMessage] = useState("");
  const [modalState, setModalState] = useState(false);

  // prefill email if provided in query
  useEffect(() => {
    const queryEmail = new URLSearchParams(window.location.search).get("email");
    if (queryEmail) {
      setEmail(queryEmail);
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("auth/signup", {
        firstName,
        lastName,
        email,
      });
      setMessage(response.data.message);
      setModalState(true);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Signup failed");
    }
  };

  // background carousel
  useEffect(() => {
    const timer = setInterval(
      () => setCurrentIndex((i) => (i + 1) % images.length),
      3000
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <UnprotectedRoute>
      <SuccessModalCompoenent
        title={message}
        detail="You have successfully registered"
        modalState={modalState}
        setModalState={setModalState}
        customAction={() =>
          router.push(`/login?email=${encodeURIComponent(email)}`)
        }
        text="Go to Login"
      />
      <div className="relative h-full md:p-24 p-0 bg-transparent">
        <div className="rounded-2xl w-full bg-white flex flex-col md:flex-row min-h-[90vh]">
          <div className="md:w-1/2 w-full py-24 sm:px-24 px-8">
            <Image src={Logo} alt="logo" width={93} height={60} />

            <h1 className="text-2xl font-semibold mt-8 mb-2">Sign Up</h1>
            <h5 className="text-gray-500">Create your new account</h5>

            <form className="my-10" onSubmit={handleSubmit}>
              <InputComponent
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                className="mb-4"
              />
              <InputComponent
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                className="mb-4"
              />
              <InputComponent
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="mb-4"
              />

              <ButtonComponent
                text="Sign Up"
                disabled={!firstName || !lastName || !email}
                className="mt-12 text-white"
              />
            </form>
            <ButtonComponent
              text={"Log in"}
              className="mt-0 text-[#A8353A] bg-white"
              onClick={() => router.push("/")}
            />
          </div>
          <div className="flex-1 bg-[#FBC2B61A] rounded-2xl min-h-full flex justify-center items-center">
            <Image
              src={images[currentIndex]}
              alt={`House illustration ${currentIndex + 1}`}
              width={488}
              height={390}
            />
          </div>
        </div>
        <FooterComponent />
      </div>
    </UnprotectedRoute>
  );
}
