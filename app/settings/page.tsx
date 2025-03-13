"use client";

import { JSX, useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout-component";
import { ArrowRightIcon, CameraIcon } from "@/utils/svg";
import { useDataPermission } from "@/context";
import { toast } from "react-toastify";
import Image from "next/image";
import { useRouter } from "next/navigation";
import withPermissions from "@/components/auth/permission-protected-routes";
import createAxiosInstance from "@/utils/api";
import DynamicCreateForm from "@/components/dynamic-create-form";
import PermissionGuard from "@/components/auth/permission-protected-components";
import PermissionGuardApi from "@/components/auth/permission-protected-api";
import ManagePin from "@/components/transaction/create-pin";

function Settings() {
  const axiosInstance = createAxiosInstance();
  const { callGuardedEndpoint } = PermissionGuardApi();
  const router = useRouter();

  const {
    user,
    setUser,
    centralState,
    setCentralState,
    centralStateDelete,
    setCentralStateDelete,
    setSuccessState,
  } = useDataPermission();

  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  const [settings, setSettings] = useState({
    isPushNotificationEnabled: false,
    isBiometricLoginEnabled: false,
  });

  const toggleMapping: Record<
    keyof typeof settings,
    { patchEndpoint: string; getEndpoint: string; permission: string }
  > = {
    isPushNotificationEnabled: {
      patchEndpoint: "/app-settings/auto-debit",
      getEndpoint: "/app-settings/get-setting-by-key/autoDebit",
      permission: "read_app-settings:/get-setting-by-key/key",
    },
    isBiometricLoginEnabled: {
      patchEndpoint: "/app-settings/auto-apportion",
      getEndpoint: "/app-settings/get-setting-by-key/autoApportion",
      permission: "read_app-settings:/get-setting-by-key/key",
    },
  };

  useEffect(() => {
    const fetchToggleSettings = async () => {
      try {
        const responses = await Promise.all(
          Object.keys(toggleMapping).map((key) =>
            callGuardedEndpoint({
              endpoint: toggleMapping[key as keyof typeof settings].getEndpoint,
              requiredPermissions: [
                toggleMapping[key as keyof typeof settings].permission,
              ],
            })
          )
        );

        const newSettings: Partial<typeof settings> = {};
        Object.keys(toggleMapping).forEach((key, index) => {
          newSettings[key as keyof typeof settings] =
            responses[index]?.data?.value;
        });

        setSettings((prev) => ({ ...prev, ...newSettings }));
      } catch (error) {
        console.error("Error fetching toggle settings", error);
      }
    };

    fetchToggleSettings();
  }, []);

  useEffect(() => {
    getMe();
  }, []);

  useEffect(() => {
    getWOLimit();
    getWRLimit();
  }, [centralState]);

  const getMe = async () => {
    const response = await axiosInstance.get("/auth/me");
    setUser(response.data.data.user);
  };

  const [wrlimit, setWrLimit] = useState();
  const [wolimit, setWoLimit] = useState();

  const getWRLimit = async () => {
    const response = await callGuardedEndpoint({
      endpoint: "/app-settings/wr-overdue-limit",
      requiredPermissions: ["read_app-settings:wr-overdue-limit"],
    });

    setWrLimit(response?.data?.value);
  };

  const getWOLimit = async () => {
    const response = await callGuardedEndpoint({
      endpoint: "/app-settings/wo-overdue-limit",
      requiredPermissions: ["read_app-settings:wo-overdue-limit"],
    });

    setWoLimit(response?.data?.value);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {};
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("file", file);
      setCentralState("Uploaded");
    } else {
      toast.error("No file selected. Please select an image.");
    }
  };

  const getTitle = () => {
    switch (centralState) {
      case "wroverduelimit":
        return "Work request overdue limit";
      case "wooverduelimit":
        return "Work order overdue limit";
      case "managePin":
        return "Manage Pin";
    }
    return "Zijela";
  };

  // Mapping centralState values to components
  const componentMap: Record<string, JSX.Element> = {
    wooverduelimit: (
      <DynamicCreateForm
        inputs={[
          { name: "value", label: "Value", type: "text" },
          { name: "description", label: "Descriptiom", type: "textarea" },
        ]}
        selects={[]}
        title="Work order overdue limit"
        apiEndpoint="/app-settings/wo-overdue-limit"
        activeRowId={"5"}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        fetchResource={() =>
          callGuardedEndpoint({
            endpoint: "/app-settings/wo-overdue-limit",
            requiredPermissions: ["read_app-settings:wo-overdue-limit"],
          }).then((res) => res?.data)
        }
      />
    ),
    wroverduelimit: (
      <DynamicCreateForm
        inputs={[
          { name: "value", label: "Value", type: "text" },
          { name: "description", label: "Description", type: "textarea" },
        ]}
        selects={[]}
        title="Work request overdue limit"
        apiEndpoint="/app-settings/wr-overdue-limit"
        activeRowId={"5"}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
        fetchResource={() =>
          callGuardedEndpoint({
            endpoint: "/app-settings/wr-overdue-limit",
            requiredPermissions: ["read_app-settings:wr-overdue-limit"],
          }).then((res) => res?.data)
        }
      />
    ),
    managePin: (
      <>
        <ManagePin
          setModalState={setCentralState}
          setSuccessState={setSuccessState}
        />
      </>
    ),
  };

  const handleToggle = async (settingKey: keyof typeof settings) => {
    const newValue = !settings[settingKey];
    setSettings((prev) => ({
      ...prev,
      [settingKey]: newValue,
    }));
    try {
      await axiosInstance.post(toggleMapping[settingKey].patchEndpoint, {
        value: newValue,
      });
    } catch (error) {
      toast.error("Failed to update setting");
      // revert
      setSettings((prev) => ({
        ...prev,
        [settingKey]: !newValue,
      }));
    }
  };

  // Handle logout
  const logout = async () => {
    localStorage.removeItem("authToken");
    router.push("/");
  };

  return (
    <DashboardLayout
      title="Settings"
      detail="Manage setting"
      getTitle={getTitle}
      componentMap={componentMap}
      takeAction={null}
      setActiveRowId={setActiveRowId}
    >
      <h1 className="text-xl font-bold text-black ml-2 mt-4">Settings</h1>

      <div className="flex flex-col md:flex-row bg-gray-100 py-6 px-2">
        <div className="hidden md:w-[38%] bg-white shadow-sm rounded-xl p-6 pt-16 flex flex-col items-center relative">
          <div className="relative">
            <div className="w-44 h-44 bg-gray-500 rounded-full flex items-center justify-center mb-4 overflow-hidden">
              <Image
                src={user?.avatar ? user?.avatar : "/assets/avatar.png"}
                alt="User Avatar"
                className="w-44 h-44 object-cover"
                width={176}
                height={176}
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
          <h2 className="text-xl font-bold text-gray-800">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-gray-600 text-base">{user?.email}</p>
        </div>

        <div className="md:w-[62%] mt-6 md:mt-0 bg-white shadow-sm rounded-xl p-6">
          <h3 className="text-base text-gray-800 mb-4">Update settings</h3>
          {user.wallets.length > 0 && (
            <PermissionGuard requiredPermissions={[]}>
              <div
                onClick={() => setCentralState("managePin")}
                className="flex items-center cursor-pointer justify-between mb-4 py-4 px-6 border rounded-xl border-gray-200"
              >
                <div className="text-gray-800">Manage Pin</div>
                <div className="flex items-center space-x-8">
                  <ArrowRightIcon />
                </div>
              </div>
            </PermissionGuard>
          )}

          <PermissionGuard
            requiredPermissions={["create_app-settings:wr-overdue-limit"]}
          >
            <div
              onClick={() => setCentralState("wroverduelimit")}
              className="flex items-center cursor-pointer justify-between mb-4 py-4 px-6 border rounded-xl border-gray-200"
            >
              <div className="text-gray-800">Work request overdue limit</div>
              <div className="flex items-center space-x-8">
                <p>{wrlimit}</p>
                <ArrowRightIcon />
              </div>
            </div>
          </PermissionGuard>
          <PermissionGuard
            requiredPermissions={["create_app-settings:wo-overdue-limit"]}
          >
            <div
              onClick={() => setCentralState("wooverduelimit")}
              className="flex items-center cursor-pointer justify-between mb-4 py-4 px-6 border rounded-xl border-gray-200"
            >
              <div className="text-gray-800">Work order overdue limit</div>
              <div className="flex items-center space-x-8">
                <p>{wolimit}</p>
                <ArrowRightIcon />
              </div>
            </div>
          </PermissionGuard>

          {/* Settings Toggles */}
          <div className="w-full p-4 border border-gray-200 rounded-xl mb-4">
            {[
              {
                label: "Auto Debit",
                key: "isPushNotificationEnabled",
                permission: ["create_app-settings:auto-debit"],
              },
              {
                label: "Auto Apportion",
                key: "isBiometricLoginEnabled",
                permission: ["create_app-settings:auto-apportion"],
              },
            ].map((setting, index, array) => (
              <PermissionGuard
                key={setting.key}
                requiredPermissions={setting.permission}
              >
                <div
                  className={`flex items-center justify-between p-2 ${
                    index < array.length - 1
                      ? "border-b border-gray-200 mb-4"
                      : ""
                  }`}
                >
                  <span className="text-gray-500 font-light text-sm">
                    {setting.label}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings[setting.key as keyof typeof settings]}
                      onChange={() =>
                        handleToggle(setting.key as keyof typeof settings)
                      }
                    />
                    <div className="w-8 h-4 bg-gray-900 rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
              </PermissionGuard>
            ))}
          </div>

          <div
            onClick={logout}
            className="flex items-center cursor-pointer justify-between py-4 px-6 border rounded-xl border-gray-200"
          >
            <div className="text-red-500">Sign out</div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.3335 2.66675L10.6668 8.00008L5.3335 13.3334"
                stroke="#FF3B30"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default withPermissions(Settings, ["app-settings"]);
