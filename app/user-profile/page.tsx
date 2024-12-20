// "use client";

// import { FormEvent, useEffect, useState } from "react";
// import DashboardLayout from "@/components/dashboard-layout-component";
// import InputComponent from "@/components/input-container";
// import { CameraIcon } from "@/utils/svg";
// import ButtonComponent from "@/components/button-component";
// import { useDataPermission } from "@/context";
// import { toast } from "react-toastify";
// import axiosInstance from "@/utils/api";
// import ModalCompoenent, {
//   SuccessModalCompoenent,
// } from "@/components/modal-component";
// import Image from "next/image";
// import { useRouter } from "next/navigation";

// export default function UserProfile() {
//   const router = useRouter();
//   const { user, setUser } = useDataPermission();
//   const [centralState, setCentralState] = useState<string>();
//   // State for user avatar
//   const avatar = "/assets/avatar.png";
//   const [myuser, setMyUser] = useState({
//     avatar: "",
//   });
//   useEffect(() => {
//     setMyUser({ ...myuser, avatar: user?.avatar || avatar });
//   }, []);

//   // State for password inputs
//   const [password, setPassword] = useState({
//     newPassword: "",
//     confirmPassword: "",
//     oldPassword: "",
//   });
//   const [modalState, setModalState] = useState(false);
//   // State for various toggles
//   const [settings, setSettings] = useState({
//     isTwoFactorEnabled: false,
//     isSoundNotificationEnabled: false,
//     isPushNotificationEnabled: false,
//     isBiometricLoginEnabled: false,
//   });

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (password.newPassword !== password.confirmPassword) {
//       toast.error("Passwords do not match!");
//       return;
//     }
//     const response = await axiosInstance.patch("/auth/change-password", {
//       newPassword: password.newPassword,
//       oldPassword: password.oldPassword,
//     });
//     setModalState(true);
//     setPassword({
//       oldPassword: "",
//       newPassword: "",
//       confirmPassword: "",
//     });
//   };

//   const getMe = async () => {
//     const response = await axiosInstance.get("/auth/me");
//     setUser(response.data.data.user);
//   };
//   useEffect(() => {
//     getMe();
//   }, []);

//   const [formData, setFormData] = useState<FormData>();
//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];

//       const reader = new FileReader();
//       reader.onload = () => {
//         setMyUser((prev) => ({ ...prev, avatar: reader.result as string }));
//       };
//       reader.readAsDataURL(file);

//       const formData = new FormData();
//       formData.append("file", file);
//       setFormData(formData);

//       setCentralState("Uploaded");
//     } else {
//       toast.error("No file selected. Please select an image.");
//     }
//   };

//   const changeProfileAvatar = async () => {
//     const response = await axiosInstance.post(
//       "/files/upload/user-avatar",
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );
//     getMe();
//     toast.success(response.data?.message);
//     setCentralState("");
//   };

//   const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setPassword((prev) => ({ ...prev, [name]: value }));
//   };

//   // Toggle settings
//   const handleToggle = (setting: keyof typeof settings) => {
//     setSettings((prev) => ({
//       ...prev,
//       [setting]: !prev[setting],
//     }));
//   };

//   const logout = async () => {
//     localStorage.removeItem("authToken"); // Remove the token
//     router.push("/");
//   };

//   return (
//     <DashboardLayout title="Profile" detail="Manage your account details here">
//       <SuccessModalCompoenent
//         title={"Sussessful"}
//         detail={"Changed password successful"}
//         modalState={modalState}
//         setModalState={setModalState}
//       ></SuccessModalCompoenent>

//       <ModalCompoenent
//         title={"Update Avatar"}
//         detail={""}
//         modalState={centralState}
//         width="max-w-md"
//         setModalState={() => {
//           setCentralState("");
//         }}
//       >
//         <div className="p-6">
//           <div className="flex justify-center items-center mb-8">
//             <Image
//               src={myuser.avatar}
//               alt="User Avatar"
//               className="rounded-full"
//               width={280}
//               height={280}
//             />
//           </div>

//           <ButtonComponent
//             text="Update Avatar"
//             className="text-white"
//             onClick={changeProfileAvatar}
//           />
//         </div>
//       </ModalCompoenent>

//       <h1 className="text-xl font-bold text-black ml-2 mt-4">My Account</h1>

//       <div className="flex flex-col md:flex-row bg-gray-100 py-6 px-2">
//         <div className="md:w-[38%] bg-white shadow-sm rounded-xl rounded-lg p-6 pt-16 flex flex-col items-center relative">
//           <div className="relative">
//             <div className="w-44 h-44 bg-gray-500 rounded-full flex items-center justify-center mb-4 overflow-hidden">
//               <Image
//                 src={user?.avatar || myuser.avatar}
//                 alt="User Avatar"
//                 className="w-full h-full object-cover"
//                 width={40}
//                 height={40}
//               />
//             </div>

//             <div className="absolute bottom-5 right-0 bg-gray-100 text-white p-3 rounded-full cursor-pointer hover:bg-gray-200">
//               <CameraIcon />

//               <input
//                 type="file"
//                 className="absolute inset-0 opacity-0 cursor-pointer"
//                 accept="image/*"
//                 onChange={handleFileChange}
//               />
//             </div>
//           </div>

//           <h2 className="text-xl font-bold text-gray-800">
//             {user?.firstName} {"   "} {user?.lastName}{" "}
//           </h2>
//           <p className="text-gray-600 text-base">{user?.email}</p>
//         </div>

//         <div className="md:w-[62%] mt-6 md:mt-0 md:ml-6 bg-white shadow-sm rounded-xl rounded-lg p-6 h-auto">
//           <h3 className="text-base font-semibold text-gray-800 mb-4">
//             Change Password
//           </h3>

//           <form onSubmit={handleSubmit}>
//             <InputComponent
//               type="password"
//               name="oldPassword"
//               value={password.oldPassword}
//               onChange={handlePasswordChange}
//               placeholder="Enter old password"
//               className="mb-4 bg-white border-gray-200"
//             />
//             {password.oldPassword !== "" && (
//               <>
//                 {" "}
//                 <InputComponent
//                   type="password"
//                   name="newPassword"
//                   value={password.newPassword}
//                   onChange={handlePasswordChange}
//                   placeholder="Enter new password"
//                   className="mb-4 bg-white border-gray-200"
//                 />
//                 <InputComponent
//                   type="password"
//                   name="confirmPassword"
//                   value={password.confirmPassword}
//                   onChange={handlePasswordChange}
//                   placeholder="Confirm new password"
//                   className="mb-4 bg-white border-gray-200"
//                 />
//               </>
//             )}

//             <ButtonComponent
//               text={password.newPassword === "" ? "Change" : "Change"}
//               disabled={
//                 password.newPassword === "" || password.confirmPassword === ""
//               }
//               className="mb-4 text-white"
//             />
//           </form>

//           <h3 className="text-base font-semibold text-gray-800 mb-4">
//             Settings
//           </h3>

//           {/* Settings Toggles */}
//           <div className="w-full p-4 border border-gray-200 rounded-xl mb-4">
//             {[
//               { label: "Two-Factor Authentication", key: "isTwoFactorEnabled" },
//               {
//                 label: "Sound Notification",
//                 key: "isSoundNotificationEnabled",
//               },
//               { label: "Push Notification", key: "isPushNotificationEnabled" },
//               { label: "Login with Biometric", key: "isBiometricLoginEnabled" },
//             ].map((setting, index, array) => (
//               <div
//                 key={setting.key}
//                 className={`flex items-center justify-between p-2 ${
//                   index < array.length - 1
//                     ? "border-b border-gray-200 mb-4"
//                     : ""
//                 }`}
//               >
//                 <span className="text-gray-500 font-light text-sm">
//                   {setting.label}
//                 </span>
//                 <label className="relative inline-flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     className="sr-only peer"
//                     checked={settings[setting.key]}
//                     onChange={() =>
//                       handleToggle(setting.key as keyof typeof settings)
//                     }
//                   />
//                   <div className="w-8 h-4 bg-gray-900 rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-green-600"></div>
//                 </label>
//               </div>
//             ))}
//           </div>

//           <div
//             onClick={logout}
//             className="flex items-center cursor-pointer justify-between py-4 px-6 border rounded-xl border-gray-200"
//           >
//             <div className="text-red-500">Sign out</div>
//             <div>
//               <svg
//                 width="16"
//                 height="16"
//                 viewBox="0 0 16 16"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M5.3335 2.66675L10.6668 8.00008L5.3335 13.3334"
//                   stroke="#FF3B30"
//                   strokeWidth="1.5"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//             </div>
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }

"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout-component";
import InputComponent from "@/components/input-container";
import { CameraIcon } from "@/utils/svg";
import ButtonComponent from "@/components/button-component";
import { useDataPermission } from "@/context";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/api";
import ModalCompoenent, {
  SuccessModalCompoenent,
} from "@/components/modal-component";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AvatarEditor from "react-avatar-editor";

export default function UserProfile() {
  const router = useRouter();
  const { user, setUser } = useDataPermission();
  const [centralState, setCentralState] = useState<string>();
  // State for user avatar
  const avatar = "/assets/avatar.png";
  const [myuser, setMyUser] = useState({
    avatar: "",
  });
  useEffect(() => {
    setMyUser({ ...myuser, avatar: user?.avatar || avatar });
  }, []);

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

  const [formData, setFormData] = useState<FormData>();
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
      setFormData(formData);

      setCentralState("Uploaded");
    } else {
      toast.error("No file selected. Please select an image.");
    }
  };

  const changeProfileAvatar = async () => {
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
    setCentralState("");
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

  const logout = async () => {
    localStorage.removeItem("authToken"); // Remove the token
    router.push("/");
  };

  const [scale, setScale] = useState(1);
  const [croppedImage, setCroppedImage] = useState(null);
  const editorRef = useRef(null);

  const handleCrop = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas().toDataURL();
      setCroppedImage(canvas);
      setMyUser((prev) => ({ ...prev, avatar: canvas }));
    }
  };

  return (
    <DashboardLayout title="Profile" detail="Manage your account details here">
      <SuccessModalCompoenent
        title={"Sussessful"}
        detail={"Changed password successful"}
        modalState={modalState}
        setModalState={setModalState}
      ></SuccessModalCompoenent>

      <ModalCompoenent
        title={"Update Avatar"}
        detail={""}
        modalState={centralState}
        width="max-w-md"
        setModalState={() => {
          setCentralState("");
        }}
      >
        <div className="p-6 flex flex-col items-center">
          <AvatarEditor
            ref={editorRef}
            image={myuser?.avatar} // Provide a fallback avatar
            width={200}
            height={200}
            border={50}
            borderRadius={100} // Makes it circular
            scale={scale}
            rotate={0}
          />
          <div className="w-full mt-4">
            <label className="block text-sm font-medium mb-2">Zoom</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="flex justify-between mt-6 w-full">
            {/* <ButtonComponent
              text="Crop & Save"
              className="text-white"
              onClick={handleCrop}
            /> */}
            <ButtonComponent
              text="Upload Avatar"
              className="text-white"
              onClick={changeProfileAvatar}
            />
          </div>
          {croppedImage && (
            <div className="mt-4">
              <img
                src={croppedImage}
                alt="Cropped"
                className="w-20 h-20 rounded-full"
              />
            </div>
          )}
        </div>
      </ModalCompoenent>

      <h1 className="text-xl font-bold text-black ml-2 mt-4">My Account</h1>

      <div className="flex flex-col md:flex-row bg-gray-100 py-6 px-2">
        <div className="md:w-[38%] bg-white shadow-sm rounded-xl rounded-lg p-6 pt-16 flex flex-col items-center relative">
          <div className="relative">
            <div className="w-44 h-44 bg-gray-500 rounded-full flex items-center justify-center mb-4 overflow-hidden">
              <Image
                src={user?.avatar || myuser.avatar}
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

          <h2 className="text-xl font-bold text-gray-800">
            {user?.firstName} {"   "} {user?.lastName}{" "}
          </h2>
          <p className="text-gray-600 text-base">{user?.email}</p>
        </div>

        <div className="md:w-[62%] mt-6 md:mt-0 md:ml-6 bg-white shadow-sm rounded-xl rounded-lg p-6 h-auto">
          <h3 className="text-base font-semibold text-gray-800 mb-4">
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

          <h3 className="text-base font-semibold text-gray-800 mb-4">
            Settings
          </h3>

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
                <span className="text-gray-500 font-light text-sm">
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
                  <div className="w-8 h-4 bg-gray-900 rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            ))}
          </div>

          <div
            onClick={logout}
            className="flex items-center cursor-pointer justify-between py-4 px-6 border rounded-xl border-gray-200"
          >
            <div className="text-red-500">Sign out</div>
            <div>
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
      </div>
    </DashboardLayout>
  );
}
