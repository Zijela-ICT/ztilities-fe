// "use client";

// import { JSX, useEffect, useState } from "react";
// import DashboardLayout from "@/components/dashboard-layout-component";
// import withPermissions from "@/components/auth/permission-protected-routes";
// import { useRouter, useParams } from "next/navigation";
// import createAxiosInstance from "@/utils/api";
// import ButtonComponent from "@/components/button-component";
// import { LabelInputComponent } from "@/components/input-container";
// import { useDataPermission } from "@/context";
// import Image from "next/image";
// import { CopyIcon } from "@/utils/svg";
// import PermissionGuard from "@/components/auth/permission-protected-components";
// import FacilityDetails from "@/components/facility-management/view-facility";
// import moment from "moment";

// function AccessControl() {
//   const axiosInstance = createAxiosInstance();
//   const {
//     user,
//     pagination,
//     setPagination,
//     searchQuery,
//     filterQuery,
//     setShowFilter,
//     showFilter,
//     clearSearchAndPagination,
//     centralState,
//     setCentralState,
//     centralStateDelete,
//     setCentralStateDelete,
//     setSuccessState,
//   } = useDataPermission();
//   const router = useRouter();
//   const { id } = useParams();

//   // State hooks for inputs and results
//   const [formData, setFormData] = useState({
//     guestName: "",
//     guestPhone: "",
//     expiresAt: "",
//   });

//   const [accessCodeVerify, setAccessCodeVerify] = useState("");
//   const [accessCodeEntry, setAccessCodeEntry] = useState("");
//   const [accessCodeExit, setAccessCodeExit] = useState("");
//   const [verifyResult, setVerifyResult] = useState(null);
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [historyCode, setHistoryCode] = useState("");
//   const [generateCode, setGenerateCode] = useState(null);

//   // Handle form changes for generate code
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const [unit, setAUnit] = useState<Unit>();
//   const getAUnit = async () => {
//     const response = await axiosInstance.get(`/units/${id}`);
//     setAUnit(response.data.data);
//   };

//   useEffect(() => {
//     getAUnit();
//   }, []);

//   const generateAccessCode = async () => {
//     const payload = {
//       ...formData,
//       userId: user.id.toString(),
//       unitId: id,
//       expiresAt: new Date(formData.expiresAt).toISOString(),
//     };
//     const response = await axiosInstance.post(
//       "/access-control/generate",
//       payload
//     );

//     setGenerateCode(response.data.data);
//     setCentralState("viewAccessCode");

//     setFormData({
//       guestName: "",
//       guestPhone: "",
//       expiresAt: "",
//     });
//   };

//   const verifyAccessDetails = async () => {
//     const response = await axiosInstance.get(
//       `/access-control/verify/${accessCodeVerify}`
//     );
//     setVerifyResult(response.data.data);
//     setCentralState("viewAccessCodeDetails");
//     setAccessCodeVerify("");
//   };

//   const logGuestEntry = async () => {
//     const response = await axiosInstance.patch(
//       `/access-control/entry/${accessCodeEntry}`
//     );
//     setVerifyResult(response.data.data);
//     setCentralState("viewAccessCodeDetails");
//     setAccessCodeEntry("");
//   };

//   const logGuestExit = async () => {
//     const response = await axiosInstance.patch(
//       `/access-control/exit/${accessCodeExit}`
//     );
//     setVerifyResult(response.data.data);
//     setCentralState("viewAccessCodeDetails");
//     setAccessCodeExit("");
//   };

//   const fetchGuestsInside = async () => {
//     const response = await axiosInstance.get(
//       "/access-control/guests/still-inside"
//     );
//     setVerifyResult({ guests: response.data.data });
//     setCentralState("viewAccessCodeDetails");
//   };

//   const fetchExpiredGuests = async () => {
//     const response = await axiosInstance.get(
//       "/access-control/guests/expired-still-inside"
//     );
//     setVerifyResult({ guests: response.data.data });
//     setCentralState("viewAccessCodeDetails");
//   };

//   const fetchGuestsByDateRange = async () => {
//     const response = await axiosInstance.get("/access-control/guests-inside", {
//       params: {
//         startDate: new Date(startDate).toISOString(), // Correct key-value pair
//         endDate: new Date(endDate).toISOString(),
//       },
//     });
//     setVerifyResult(response.data.data);
//     setCentralState("viewAccessCodeDetails");
//   };

//   const fetchHistory = async () => {
//     const response = await axiosInstance.get(
//       `/access-control/history/${historyCode}`
//     );
//     setVerifyResult(response.data.data);
//     setCentralState("viewAccessCodeDetails");
//     setHistoryCode("");
//   };

//   const componentMap: Record<string, JSX.Element> = {
//     viewAccessCode: (
//       <>
//         <div className="flex flex-col items-center justify-center pb-8">
//           <Image
//             src={generateCode?.qrCodeDataUrl}
//             alt="qrCode"
//             width={300}
//             height={300}
//           />
//           <div className="flex items-center">
//             <p> {generateCode?.accessCode} </p>
//             <span
//               className="ml-2 cursor-pointer"
//               onClick={() => {
//                 navigator.clipboard.writeText(generateCode.accessCode);
//               }}
//             >
//               <CopyIcon />
//             </span>{" "}
//           </div>
//         </div>
//       </>
//     ),
//     viewAccessCodeDetails: (
//       <div className="p-4">
//         <FacilityDetails facility={verifyResult} title="Work Order" />
//       </div>
//     ),
//   };

//   console.log(centralState);
//   return (
//     <DashboardLayout
//       title={`${unit?.unitNumber} - Access Control`}
//       detail="Manage all access control operations"
//       dynamic
//       getTitle={() =>
//         centralState === "viewAccessCode"
//           ? "Access Code"
//           : "Access control Manager"
//       }
//       getDetail={() => ""}
//       onclick={() => router.back()}
//       componentMap={componentMap}
//     >
//       <div className="space-y-8 text-black">
//         <PermissionGuard
//           requiredPermissions={["create_access-control:generate"]}
//         >
//           <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition-shadow">
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 generateAccessCode();
//               }}
//             >
//               <h2 className="text-2xl font-bold mb-4">Generate Access Code</h2>
//               <LabelInputComponent
//                 type="text"
//                 name="guestName"
//                 value={formData.guestName}
//                 onChange={handleChange}
//                 label="Guest Name"
//               />
//               <LabelInputComponent
//                 type="text"
//                 name="guestPhone"
//                 value={formData.guestPhone}
//                 onChange={handleChange}
//                 label="Guest Phone Number"
//               />

//               <LabelInputComponent
//                 type="datetime-local"
//                 name="expiresAt"
//                 value={formData.expiresAt}
//                 onChange={(e) => {
//                   setFormData({
//                     ...formData,
//                     [e.target.name]: e.target.value,
//                   });
//                 }}
//                 label="End Date"
//               />
//               <div className="w-32 mt-4">
//                 <ButtonComponent text="Generate Code" className="text-white" />
//               </div>
//             </form>
//           </div>
//         </PermissionGuard>

//         <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition-shadow">
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               verifyAccessDetails();
//             }}
//           >
//             <h2 className="text-2xl font-bold mb-4 ">Verify Access Details</h2>
//             <LabelInputComponent
//               type="text"
//               name="accessCode"
//               value={accessCodeVerify}
//               onChange={(e) => setAccessCodeVerify(e.target.value)}
//               label="Access Code"
//             />
//             <div className="w-32 mt-4">
//               <ButtonComponent text="Verify Code" className="text-white" />
//             </div>
//           </form>
//         </div>

//         {/* Log Guest Entry & Exit */}
//         <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition-shadow grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Log Guest Entry */}
//           <div>
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 logGuestEntry();
//               }}
//             >
//               <h2 className="text-2xl font-bold mb-4">Log Guest Entry</h2>
//               <LabelInputComponent
//                 type="text"
//                 name="accessCodeEntry"
//                 value={accessCodeEntry}
//                 onChange={(e) => setAccessCodeEntry(e.target.value)}
//                 label="Access Code"
//               />
//               <div className="w-32 mt-4">
//                 <ButtonComponent text="Log Entry" className="text-white" />
//               </div>
//             </form>
//           </div>
//           {/* Log Guest Exit */}
//           <div>
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 logGuestExit();
//               }}
//             >
//               <h2 className="text-2xl font-bold mb-4 ">Log Guest Exit</h2>
//               <LabelInputComponent
//                 type="text"
//                 name="accessCodeExit"
//                 value={accessCodeExit}
//                 onChange={(e) => setAccessCodeExit(e.target.value)}
//                 label="Access Code"
//               />
//               <div className="w-32 mt-4">
//                 <ButtonComponent text="Log Exit" className="text-white" />
//               </div>
//             </form>
//           </div>
//         </div>

//         {/* Get Guests Still Inside */}
//         <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition-shadow">
//           <h2 className="text-2xl font-bold mb-4">Guests Still Inside</h2>
//           <div className="w-40">
//             <ButtonComponent
//               text="Fetch Guests Inside"
//               onClick={fetchGuestsInside}
//               className="text-white"
//             />
//           </div>
//           {/* {guestsInside && (
//             <div className="mt-4 p-4 bg-gray-100 rounded">
//               <pre className="text-sm">
//                 {JSON.stringify(guestsInside, null, 2)}
//               </pre>
//             </div>
//           )} */}
//         </div>

//         {/* Get Expired Guests Still Inside */}
//         <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition-shadow">
//           <h2 className="text-2xl font-bold mb-4 ">
//             Expired Guests Still Inside
//           </h2>
//           <div className="w-48">
//             <ButtonComponent
//               text="Fetch Expired Guests"
//               onClick={fetchExpiredGuests}
//               className="text-white"
//             />
//           </div>
//         </div>

//         {/* Find Guests Inside During Date Range */}
//         <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition-shadow">
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               fetchGuestsByDateRange();
//             }}
//           >
//             <h2 className="text-2xl font-bold mb-4">Guests by Date Range</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <LabelInputComponent
//                 type="date"
//                 name="startDate"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//                 label="Start Date"
//               />
//               <LabelInputComponent
//                 type="date"
//                 name="endDate"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//                 label="End Date"
//               />
//             </div>
//             <div className="w-40 mt-4">
//               <ButtonComponent text="Find Guests" className="text-white" />
//             </div>
//           </form>
//         </div>

//         {/* Access History */}
//         <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition-shadow">
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               fetchHistory();
//             }}
//           >
//             <h2 className="text-2xl font-bold mb-4 ">Access History</h2>
//             <LabelInputComponent
//               type="text"
//               name="historyCode"
//               value={historyCode}
//               onChange={(e) => setHistoryCode(e.target.value)}
//               label="Access Code"
//             />
//             <div className="w-40 mt-4">
//               <ButtonComponent text="Get History" className="text-white" />
//             </div>
//           </form>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }

// export default withPermissions(AccessControl, [""]);

"use client";

import { JSX, useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout-component";
import withPermissions from "@/components/auth/permission-protected-routes";
import { useRouter, useParams } from "next/navigation";
import createAxiosInstance from "@/utils/api";
import ButtonComponent from "@/components/button-component";
import { LabelInputComponent } from "@/components/input-container";
import { useDataPermission } from "@/context";
import Image from "next/image";
import { CopyIcon } from "@/utils/svg";
import PermissionGuard from "@/components/auth/permission-protected-components";
import FacilityDetails from "@/components/facility-management/view-facility";
import moment from "moment";
import TableComponent from "@/components/table-component";
import exportToCSV from "@/utils/exportCSV";

function AccessControl() {
  const axiosInstance = createAxiosInstance();
  const {
    user,
    pagination,
    setPagination,
    searchQuery,
    filterQuery,
    setShowFilter,
    showFilter,
    clearSearchAndPagination,
    centralState,
    setCentralState,
    centralStateDelete,
    setCentralStateDelete,
    setSuccessState,
  } = useDataPermission();
  const router = useRouter();
  const { id } = useParams();

  // State hooks for inputs and results
  const [formData, setFormData] = useState({
    guestName: "",
    guestPhone: "",
    expiresAt: "",
  });
  const [accessCodeVerify, setAccessCodeVerify] = useState("");
  const [accessCodeEntry, setAccessCodeEntry] = useState("");
  const [accessCodeExit, setAccessCodeExit] = useState("");
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [historyCode, setHistoryCode] = useState("");
  const [generateCode, setGenerateCode] = useState<any>(null);
  const [allAccess, setAllAccess] = useState<any[]>([]);

  // State for unit details and tab navigation
  const [unit, setAUnit] = useState<Unit>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getAUnit = async () => {
    const response = await axiosInstance.get(`/units/${id}`);
    setAUnit(response.data.data);
  };

  ///
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const toggleActions = (rowId: string) => {
    console.log(rowId);
    setActiveRowId((prevId) => (prevId === rowId ? null : rowId));
  };

  // API Calls
  const generateAccessCode = async () => {
    const payload = {
      ...formData,
      userId: user.id.toString(),
      unitId: id,
      expiresAt: new Date(formData.expiresAt).toISOString(),
    };
    const response = await axiosInstance.post(
      "/access-control/generate",
      payload
    );
    setGenerateCode(response.data.data);
    setCentralState("viewAccessCode");
    setFormData({ guestName: "", guestPhone: "", expiresAt: "" });
  };

  const verifyAccessDetails = async () => {
    const response = await axiosInstance.get(
      `/access-control/verify/${accessCodeVerify || activeRowId}`
    );
    setVerifyResult(response.data.data);
    setCentralState("viewAccessCodeDetails");
    setAccessCodeVerify("");
  };

  const logGuestEntry = async () => {
    const response = await axiosInstance.patch(
      `/access-control/entry/${accessCodeEntry}`
    );
    setVerifyResult(response.data.data);
    setCentralState("viewAccessCodeDetails");
    setAccessCodeEntry("");
  };

  const logGuestExit = async () => {
    const response = await axiosInstance.patch(
      `/access-control/exit/${accessCodeExit}`
    );
    setVerifyResult(response.data.data);
    setCentralState("viewAccessCodeDetails");
    setAccessCodeExit("");
  };

  const fetchGuestsInside = async () => {
    const response = await axiosInstance.get(
      `/access-control/guests/still-inside?unitId=${unit?.id}`
    );
    if (response.data.data && response.data.data.length > 0) {
      setVerifyResult({ guests: response.data.data });
    } else {
      setVerifyResult(response.data.data);
    }
    setCentralState("viewAccessCodeDetails");
  };

  const fetchExpiredGuests = async () => {
    const response = await axiosInstance.get(
      `/access-control/guests/expired-still-inside?unitId=${unit?.id}`
    );
    if (response.data.data && response.data.data.length > 0) {
      setVerifyResult({ guests: response.data.data });
    } else {
      setVerifyResult(response.data.data);
    }
    setCentralState("viewAccessCodeDetails");
  };

  const fetchGuestsByDateRange = async () => {
    const response = await axiosInstance.get(
      `/access-control/guests-inside?unitId=${unit?.id}`,
      {
        params: {
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
        },
      }
    );
    if (response.data.data && response.data.data.length > 0) {
      setVerifyResult({ guests: response.data.data });
    } else {
      setVerifyResult(response.data.data);
    }
    // setVerifyResult({ guests: response.data.data });
    setCentralState("viewAccessCodeDetails");
  };

  const fetchHistory = async () => {
    const response = await axiosInstance.get(
      `/access-control/history/${historyCode}`
    );
    setVerifyResult(response.data.data);
    setCentralState("viewAccessCodeDetails");
    setHistoryCode("");
  };

  const fetchAccessUnpaginated = async () => {
    const response = await axiosInstance.get(
      `/access-control/?&search=${searchQuery}&${filterQuery}`
    );
    exportToCSV(response.data.data, `${unit?.unitNumber}_access_controls`);
  };

  const fetchAccess = async () => {
    const response = await axiosInstance.get(
      `/access-control/?page=${pagination.currentPage}&&paginate=true&&search=${searchQuery}&&${filterQuery}&unitId=${unit?.id}`
    );

    const filteredAccess = response.data.data.map(
      ({ unitId, userId, ...rest }) => rest
    );
    setAllAccess(filteredAccess);
  };

  // Component Map for modal content (restored as you preferred)
  const componentMap: Record<string, JSX.Element> = {
    viewAccessCode: (
      <div className="flex flex-col items-center justify-center pb-8">
        <Image
          src={generateCode?.qrCodeDataUrl}
          alt="QR Code"
          width={300}
          height={300}
        />
        <div className="flex items-center mt-4">
          <p className="text-lg font-mono">{generateCode?.accessCode}</p>
          <span
            className="ml-2 cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(generateCode.accessCode);
            }}
          >
            <CopyIcon />
          </span>
        </div>
      </div>
    ),
    viewAccessCodeDetails: (
      <div className="p-4">
        <FacilityDetails facility={verifyResult} title="Work Order" />
      </div>
    ),
    viewAccess: (
      <div className="p-4">
        <FacilityDetails facility={verifyResult} title="Work Order" />
      </div>
    ),
  };

  useEffect(() => {
    getAUnit();
  }, []);

  useEffect(() => {
    if (centralState === "viewAccess") {
      verifyAccessDetails();
    }
  }, [centralState]);

  useEffect(() => {
    fetchAccess();
    if (showFilter === "export") {
      fetchAccessUnpaginated();
    }
    setShowFilter("");
  }, [pagination.currentPage, showFilter, filterQuery, searchQuery]);

  const tabs = [
    "Reports",
    "Access Codes",
    "Generate Code",
    "Verify Code",
    "Guest Log",
  ];
  const tabPermissions: { [key: string]: string[] } = {
    "Access Codes": ["read_access-control"],
    "Generate Code": ["create_access-control:generate"],
    "Verify Code": ["read_access-control:verify/accessCode"],
    "Guest Log": [
      "update_access-control:entry/accessCode",
      "update_access-control:exit/accessCode",
    ],
    Reports: [
      "read_access-control:history/accessCode",
      "read_access-control:guests/still-inside",
      "read_access-control:guests/expired-still-inside",
      "read_access-control:guests-inside",
    ],
  };

  const { userPermissions } = useDataPermission();
  const getDefaultTab = () => {
    const userPermissionStrings = userPermissions.map(
      (perm) => perm.permissionString
    );
    return tabs.find((tab) =>
      (tabPermissions[tab] || []).every((permission) =>
        userPermissionStrings.includes(permission)
      )
    );
  };
  const [selectedTab, setSelectedTab] = useState<string>(getDefaultTab() || "");

  const renderTabContent = () => {
    switch (selectedTab) {
      case "Access Codes":
        return (
          <PermissionGuard
            requiredPermissions={["create_access-control:generate"]}
          >
            <div className="relative bg-white rounded-2xl p-4 mt-4">
              <TableComponent
                data={allAccess}
                type="accesscontrol"
                setModalState={setCentralState}
                setModalStateDelete={setCentralStateDelete}
                toggleActions={toggleActions}
                activeRowId={activeRowId}
                setActiveRowId={setActiveRowId}
                deleteAction={setCentralStateDelete}
              />
            </div>
          </PermissionGuard>
        );
      case "Generate Code":
        return (
          <PermissionGuard
            requiredPermissions={["create_access-control:generate"]}
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  generateAccessCode();
                }}
              >
                <h2 className="text-2xl font-bold mb-4">
                  Generate Access Code
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <LabelInputComponent
                    type="text"
                    name="guestName"
                    value={formData.guestName}
                    onChange={handleChange}
                    label="Guest Name"
                  />
                  <LabelInputComponent
                    type="text"
                    name="guestPhone"
                    value={formData.guestPhone}
                    onChange={handleChange}
                    label="Guest Phone Number"
                  />
                </div>
                <LabelInputComponent
                  type="datetime-local"
                  name="expiresAt"
                  value={formData.expiresAt}
                  onChange={handleChange}
                  label="Expiration Date & Time"
                />
                <div className="w-32 mt-4">
                  <ButtonComponent
                    text="Generate Code"
                    className="text-white"
                  />
                </div>
              </form>
            </div>
          </PermissionGuard>
        );
      case "Verify Code":
        return (
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                verifyAccessDetails();
              }}
            >
              <h2 className="text-2xl font-bold mb-4">Verify Access Code</h2>
              <LabelInputComponent
                type="text"
                name="accessCode"
                value={accessCodeVerify}
                onChange={(e) => setAccessCodeVerify(e.target.value)}
                label="Access Code"
              />
              <div className="w-32 mt-4">
                <ButtonComponent text="Verify Code" className="text-white " />
              </div>
            </form>
          </div>
        );
      case "Guest Log":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  logGuestEntry();
                }}
              >
                <h2 className="text-2xl font-bold mb-4">Log Guest Entry</h2>
                <LabelInputComponent
                  type="text"
                  name="accessCodeEntry"
                  value={accessCodeEntry}
                  onChange={(e) => setAccessCodeEntry(e.target.value)}
                  label="Access Code"
                />
                <div className="w-32 mt-4">
                  <ButtonComponent text="Log Entry" className="text-white " />
                </div>
              </form>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  logGuestExit();
                }}
              >
                <h2 className="text-2xl font-bold mb-4">Log Guest Exit</h2>
                <LabelInputComponent
                  type="text"
                  name="accessCodeExit"
                  value={accessCodeExit}
                  onChange={(e) => setAccessCodeExit(e.target.value)}
                  label="Access Code"
                />
                <div className="w-32 mt-4">
                  <ButtonComponent text="Log Exit" className="text-white" />
                </div>
              </form>
            </div>
          </div>
        );
      case "Reports":
        return (
          <div className="grid grid-cols-1 gap-6">
            <div className="flex w-full space-x-4">
              <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow">
                <h2 className="text-2xl font-bold mb-4">Guests Still Inside</h2>
                <div className="flex ">
                  <ButtonComponent
                    text="Fetch Guests Inside"
                    onClick={fetchGuestsInside}
                    className="text-white "
                  />
                </div>
              </div>
              <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow">
                <h2 className="text-2xl font-bold mb-4">
                  Expired Guests Still Inside
                </h2>
                <div className="flex justify-end">
                  <ButtonComponent
                    text="Fetch Expired Guests"
                    onClick={fetchExpiredGuests}
                    className="text-white"
                  />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  fetchGuestsByDateRange();
                }}
              >
                <h2 className="text-2xl font-bold mb-4">
                  Guests by Date Range
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <LabelInputComponent
                    type="date"
                    name="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    label="Start Date"
                  />
                  <LabelInputComponent
                    type="date"
                    name="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    label="End Date"
                  />
                </div>
                <div className="w-32 mt-4">
                  <ButtonComponent text="Find Guests" className="text-white" />
                </div>
              </form>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  fetchHistory();
                }}
              >
                <h2 className="text-2xl font-bold mb-4">Access History</h2>
                <LabelInputComponent
                  type="text"
                  name="historyCode"
                  value={historyCode}
                  onChange={(e) => setHistoryCode(e.target.value)}
                  label="Access Code"
                />
                <div className="w-32 mt-4">
                  <ButtonComponent text="Get History" className="text-white" />
                </div>
              </form>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout
      title={`${unit?.unitNumber || "---"} - Access Control`}
      detail="Manage all access control operations"
      dynamic
      getTitle={() =>
        centralState === "viewAccessCode"
          ? "Access Code"
          : "Access control Manager"
      }
      getDetail={() => ""}
      onclick={() => router.back()}
      componentMap={componentMap}
      setActiveRowId={setActiveRowId}
    >
      <PermissionGuard
        requiredPermissions={[
          "create_access-control:generate",
          "read_access-control:verify/accessCode",
          "update_access-control:entry/accessCode",
          "update_access-control:exit/accessCode",
          "read_access-control:guests/still-inside",
          "read_access-control:guests/expired-still-inside",
          "read_access-control:guests-inside",
          "read_access-control:history/accessCode",
          "read_access-control",
        ]}
      >
        <div className="relative p-4">
          <div className="overflow-x-auto whitespace-nowrap pb-2">
            <div className="flex space-x-4 ">
              {tabs.map((tab) => (
                <PermissionGuard
                  key={tab}
                  requiredPermissions={tabPermissions[tab] || []} // Match tab to permissions
                >
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`relative text-gray-500 hover:text-gray-900 px-4 py-2 text-xs font-medium focus:outline-none group ${
                      selectedTab === tab ? "text-[#A8353A] font-semibold" : ""
                    }`}
                  >
                    {tab}
                    {selectedTab === tab && (
                      <span className="absolute left-0 bottom-[-5px] w-full h-[2px] bg-[#A8353A]"></span>
                    )}
                  </button>
                </PermissionGuard>
              ))}
            </div>
          </div>
        </div>
      </PermissionGuard>
      {renderTabContent()}
    </DashboardLayout>
  );
}

export default withPermissions(AccessControl, ["access-control"]);
