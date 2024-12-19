"use client";

import { FormEvent, useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout-component";
import InputComponent from "@/components/input-container";
import { CameraIcon } from "@/utils/svg";
import ButtonComponent from "@/components/button-component";
import { useDataPermission } from "@/context";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/api";
import { SuccessModalCompoenent } from "@/components/modal-component";
import Image from "next/image";

export default function UserProfile() {
  const { user, setUser, userPermissions } = useDataPermission();
  // State for user details
  const [myuser, setMyUser] = useState({
    avatar: "https://via.placeholder.com/150",
  });

  // State for password inputs
  const [password, setPassword] = useState({
    newPassword: "",
    confirmPassword: "",
    oldPassword: "",
  });
  const [modalState, setModalState] = useState(false);
  // State for various toggles
  const [settings, setSettings] = useState({
    isTwoFactorEnabled: false,
    isSoundNotificationEnabled: false,
    isPushNotificationEnabled: false,
    isBiometricLoginEnabled: false,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password.newPassword !== password.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    const response = await axiosInstance.patch("/auth/change-password", {
      newPassword: password.newPassword,
      oldPassword: password.oldPassword,
    });
    setModalState(true);
    setPassword({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const getMe = async () => {
    const response = await axiosInstance.get("/auth/me");
    setUser(response.data.data.user);
  };
  useEffect(() => {
    getMe();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        setMyUser((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axiosInstance.post(
          "/files/upload/user-avatar",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        getMe();
        toast.success(response.data?.message);
      } catch (error: any) {
        console.error("Error uploading file", error.response?.data || error);
        toast.error(
          error.response?.data?.message || "Failed to upload the avatar."
        );
      }
    } else {
      toast.error("No file selected. Please select an image.");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle settings
  const handleToggle = (setting: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const avatar = "/assets/avatar.png";
  return (
    <DashboardLayout title="Profile" detail="Manage your account details here">
      <SuccessModalCompoenent
        title={"Sussessful"}
        detail={"Changed password successful"}
        modalState={modalState}
        setModalState={setModalState}
      ></SuccessModalCompoenent>

      <div className="flex flex-col md:flex-row bg-gray-100 p-6">
        <div className="md:w-[35%] bg-white shadow-sm rounded-xl rounded-lg p-6 flex flex-col items-center relative">
          <div className="relative">
            <div className="w-44 h-44 bg-red-500 rounded-full flex items-center justify-center mb-4 overflow-hidden">
              <Image
                src={user?.avatar || avatar}
                alt="User Avatar"
                className="w-full h-full object-cover"
                width={40}
                height={40}
              />
            </div>

            <div className="absolute bottom-5 right-0 bg-gray-100 text-white p-3 rounded-full cursor-pointer hover:bg-gray-200">
              <CameraIcon />

              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800">
            {user?.firstName} {"   "} {user?.lastName}{" "}
          </h2>
          <p className="text-gray-600 text-lg">{user?.email}</p>
        </div>

        <div className="md:w-[65%] mt-6 md:mt-0 md:ml-6 bg-white shadow-sm rounded-xl rounded-lg p-6 h-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Change Password
          </h3>
          <form onSubmit={handleSubmit}>
            <InputComponent
              type="password"
              name="oldPassword"
              value={password.oldPassword}
              onChange={handlePasswordChange}
              placeholder="Enter old password"
              className="mb-4 bg-white border-gray-200"
            />
            {password.oldPassword !== "" && (
              <>
                {" "}
                <InputComponent
                  type="password"
                  name="newPassword"
                  value={password.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  className="mb-4 bg-white border-gray-200"
                />
                <InputComponent
                  type="password"
                  name="confirmPassword"
                  value={password.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  className="mb-4 bg-white border-gray-200"
                />
              </>
            )}

            <ButtonComponent
              text={password.newPassword === "" ? "Change" : "Change"}
              disabled={
                password.newPassword === "" || password.confirmPassword === ""
              }
              className="mb-4 text-white"
            />
          </form>

          <h3 className="text-lg font-semibold text-gray-800 mb-4">Settings</h3>

          {/* Settings Toggles */}
          <div className="w-full p-4 border border-gray-200 rounded-xl mb-4">
            {[
              { label: "Two-Factor Authentication", key: "isTwoFactorEnabled" },
              {
                label: "Sound Notification",
                key: "isSoundNotificationEnabled",
              },
              { label: "Push Notification", key: "isPushNotificationEnabled" },
              { label: "Login with Biometric", key: "isBiometricLoginEnabled" },
            ].map((setting, index, array) => (
              <div
                key={setting.key}
                className={`flex items-center justify-between p-2 ${
                  index < array.length - 1
                    ? "border-b border-gray-200 mb-4"
                    : ""
                }`}
              >
                <span className="text-gray-500 font-medium">
                  {setting.label}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings[setting.key]}
                    onChange={() =>
                      handleToggle(setting.key as keyof typeof settings)
                    }
                  />
                  <div className="w-9 h-5 bg-gray-900 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
