// "use client";

// import ButtonComponent from "@/components/button-component";
// import DashboardLayout from "@/components/dashboard-layout-component";
// import ModalCompoenent from "@/components/modal-component";
// import CreatePPM from "@/components/ppm/createPPM";
// import createAxiosInstance from "@/utils/api";
// import { SearchIcon } from "@/utils/svg";
// import { JSX, useEffect, useState } from "react";
// import DatePicker from "react-datepicker";

// import "react-datepicker/dist/react-datepicker.css";

// export default function Ppm() {
//   const axiosInstance = createAxiosInstance();
//   const [selectedDate, setSelectedDate] = useState(new Date());

//   const [successState, setSuccessState] = useState({
//     title: "",
//     detail: "",
//     status: false,
//   });
//   const [activeRowId, setActiveRowId] = useState<string | null>(null); // Track active row
//   const [centralState, setCentralState] = useState<string>();
//   const [centralStateDelete, setCentralStateDelete] = useState<string>();
//   const [ppms, setPpms] = useState<any[]>([]);

//   const getPPMS = async () => {
//     const response = await axiosInstance.get(`/ppms`);
//     setPpms(response.data.data);
//   };

//   // Function to get all days in the selected month
//   const getDaysInMonth = (date) => {
//     const year = date.getFullYear();
//     const month = date.getMonth();
//     const days = new Date(year, month + 1, 0).getDate();
//     return Array.from({ length: days }, (_, i) => i + 1);
//   };

//   const days = getDaysInMonth(selectedDate);

//   // Dummy work data for each day
//   const getWorkForDay = (day) => [
//     `Task ${day}-1`,
//     `Task ${day}-2`,
//     `Task ${day}-3`,
//   ];

//   const componentMap: Record<string, JSX.Element> = {
//     createPPM: (
//       <CreatePPM
//         activeRowId={activeRowId}
//         setModalState={setCentralState}
//         setSuccessState={setSuccessState}
//       />
//     ),
//   };

//   useEffect(() => {
//     getPPMS();
//   }, []);

//   return (
//     <DashboardLayout title="PPM" detail="View Work Calender">
//       <ModalCompoenent
//         title={"CretePPM"}
//         detail={""}
//         modalState={centralState}
//         setModalState={() => {
//           setCentralState("");
//           setActiveRowId(null);
//         }}
//       >
//         {componentMap[centralState]}
//       </ModalCompoenent>
//       <>
//         <div className="relative bg-white rounded-2xl p-4">
//           <div className="flex sm:flex-row flex-col items-center md:space-x-2 space-x-0 space-y-2 md:space-y-0 font-semibold text-md">
//             <div
//               className={`flex items-center border rounded-md focus-within:ring-2 focus-within:ring-blue-500 w-full sm:w-[70%]`}
//             >
//               <span className="pl-3 text-gray-400 mt-2">
//                 <SearchIcon />
//               </span>

//               <input
//                 id="searchInput"
//                 type="text"
//                 placeholder="Search..."
//                 className="px-1 py-4 w-full focus:outline-none"
//               />
//             </div>

//             <ButtonComponent
//               text={"Add New PPM"}
//               onClick={() => setCentralState("createPPM")}
//               className="flex-1 px-4 py-3 text-white bg-[#A8353A]"
//               permissions={["create_work-orders"]}
//             />
//           </div>
//         </div>

//         <div className="flex min-h-screen py-4 space-x-4 ">
//           <div className="w-1/5 bg-white rounded-xl p-2">
//             <DatePicker
//               selected={selectedDate}
//               onChange={(date: Date) => setSelectedDate(date)}
//               dateFormat="MMMM d, yyyy"
//               inline
//               className="w-full"
//             />
//           </div>

//           <div className="w-4/5 p-4 bg-white rounded-xl ">
//             <h2 className="text-base font-bold mb-4">
//               {selectedDate.toLocaleDateString("en-US", {
//                 month: "long",
//                 year: "numeric",
//               })}
//             </h2>
//             <div className="grid grid-cols-7 gap-0">
//               {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
//                 <div
//                   key={day}
//                   className="text-center font-semibold text-gray-500 p-2"
//                 >
//                   {day}
//                 </div>
//               ))}

//               {days.map((day) => (
//                 <div
//                   key={day}
//                   className="border border-gray-100  p-4 text-center hover:bg-gray-100 cursor-pointer flex flex-col justify-between h-48"
//                 >
//                   <div className="font-bold text-base">{day}</div>
//                   <ul className="text-sm text-gray-600">
//                     {getWorkForDay(day).map((work, index) => (
//                       <li key={index} className="truncate">
//                         {work}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </>
//       PPm
//     </DashboardLayout>
//   );
// }

// "use client";

// import ButtonComponent from "@/components/button-component";
// import DashboardLayout from "@/components/dashboard-layout-component";
// import ModalCompoenent from "@/components/modal-component";
// import CreatePPM from "@/components/ppm/createPPM";
// import createAxiosInstance from "@/utils/api";
// import { SearchIcon } from "@/utils/svg";
// import { JSX, useEffect, useState } from "react";
// import DatePicker from "react-datepicker";

// import "react-datepicker/dist/react-datepicker.css";

// export default function Ppm() {
//   const axiosInstance = createAxiosInstance();
//   const [successState, setSuccessState] = useState({
//     title: "",
//     detail: "",
//     status: false,
//   });
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [ppms, setPpms] = useState<any[]>([]);
//   const [centralState, setCentralState] = useState<string>();
//   const [activeRowId, setActiveRowId] = useState<string | null>(null);

//   const getPPMS = async () => {
//     const response = await axiosInstance.get(`/ppms`);
//     setPpms(response.data.data);
//   };

//   useEffect(() => {
//     getPPMS();
//   }, []);

//   const getDaysInMonth = (date: Date) => {
//     const year = date.getFullYear();
//     const month = date.getMonth();
//     const days = new Date(year, month + 1, 0).getDate();
//     return Array.from({ length: days }, (_, i) => i + 1);
//   };

//   const parseDuration = (duration: string) => {
//     const [value, unit] = duration.split(" ");
//     return unit.includes("month") ? parseInt(value) * 30 : parseInt(value);
//   };

//   const parseFrequency = (frequency: string) => {
//     const [value, unit] = frequency.split(" ");
//     return unit.includes("month") ? parseInt(value) * 30 : parseInt(value);
//   };

//   const getWorkForDay = (day: number) => {
//     const currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
//     return ppms.flatMap(({ title, startDate, duration, frequency }) => {
//       const start = new Date(startDate);
//       const end = new Date(start);
//       end.setDate(end.getDate() + parseDuration(duration));

//       const freqDays = parseFrequency(frequency);
//       const ppmDates = [];

//       for (let d = new Date(start); d <= end; d.setDate(d.getDate() + freqDays)) {
//         if (d.getFullYear() === currentDate.getFullYear() && d.getMonth() === currentDate.getMonth() && d.getDate() === currentDate.getDate()) {
//           ppmDates.push(title);
//         }
//       }

//       return ppmDates;
//     });
//   };

//   const days = getDaysInMonth(selectedDate);

//   return (
//     <DashboardLayout title="PPM" detail="View Work Calendar">
//       <ModalCompoenent
//         title="Create PPM"
//         detail=""
//         modalState={centralState}
//         setModalState={() => {
//           setCentralState("");
//           setActiveRowId(null);
//         }}
//       >
//         {centralState === "createPPM" && (
//           <CreatePPM
//             activeRowId={activeRowId}
//             setModalState={setCentralState}
//             setSuccessState={setSuccessState}
//           />
//         )}
//       </ModalCompoenent>

//       <div className="relative bg-white rounded-2xl p-4">
//         <div className="flex sm:flex-row flex-col items-center md:space-x-2 space-x-0 space-y-2 md:space-y-0 font-semibold text-md">
//           <div className="flex items-center border rounded-md w-full sm:w-[70%]">
//             <span className="pl-3 text-gray-400 mt-2">
//               <SearchIcon />
//             </span>
//             <input
//               id="searchInput"
//               type="text"
//               placeholder="Search..."
//               className="px-1 py-4 w-full focus:outline-none"
//             />
//           </div>
//           <ButtonComponent
//             text="Add New PPM"
//             onClick={() => setCentralState("createPPM")}
//             className="flex-1 px-4 py-3 text-white bg-[#A8353A]"
//           />
//         </div>
//       </div>

//       <div className="flex min-h-screen py-4 space-x-4">
//         <div className="w-1/5 bg-white rounded-xl p-2">
//           <DatePicker
//             selected={selectedDate}
//             onChange={(date: Date) => setSelectedDate(date)}
//             dateFormat="MMMM d, yyyy"
//             inline
//             className="w-full"
//           />
//         </div>

//         <div className="w-4/5 p-4 bg-white rounded-xl">
//           <h2 className="text-base font-bold mb-4">
//             {selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
//           </h2>
//           <div className="grid grid-cols-7 gap-0">
//             {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
//               <div key={day} className="text-center font-semibold text-gray-500 p-2">
//                 {day}
//               </div>
//             ))}
//             {days.map((day) => (
//               <div
//                 key={day}
//                 className="border border-gray-100 p-4 text-center hover:bg-gray-100 cursor-pointer flex flex-col justify-between h-48"
//               >
//                 <div className="font-bold text-base">{day}</div>
//                 <ul className="text-sm text-gray-600">
//                   {getWorkForDay(day).map((work, index) => (
//                     <li key={index} className="truncate text-blue-600 font-semibold">
//                       {work}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }

// "use client";

// import ButtonComponent from "@/components/button-component";
// import DashboardLayout from "@/components/dashboard-layout-component";
// import FacilityDetails from "@/components/facility-management/view-facility";
// import ModalCompoenent, {
//   SuccessModalCompoenent,
// } from "@/components/modal-component";
// import CreatePPM from "@/components/ppm/createPPM";
// import createAxiosInstance from "@/utils/api";
// import { SearchIcon } from "@/utils/svg";
// import moment from "moment";
// import Link from "next/link";
// import { JSX, useEffect, useState } from "react";
// import DatePicker from "react-datepicker";

// import "react-datepicker/dist/react-datepicker.css";

// export default function Ppm() {
//   const axiosInstance = createAxiosInstance();
//   const [successState, setSuccessState] = useState({
//     title: "",
//     detail: "",
//     status: false,
//   });
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
//   const [ppms, setPpms] = useState<any[]>([]);
//   const [centralState, setCentralState] = useState<string>();
//   const [activeRowId, setActiveRowId] = useState<string | null>(null);
//   const [showAll, setShowAll] = useState<any[]>([]);

//   const months = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];
//   const getPPMS = async () => {
//     const response = await axiosInstance.get(`/ppms`);
//     setPpms(response.data.data);
//   };

//   const componentMap: Record<string, JSX.Element> = {
//     createPPM: (
//       <CreatePPM
//         activeRowId={activeRowId}
//         setModalState={setCentralState}
//         setSuccessState={setSuccessState}
//       />
//     ),
//     showAll: (
//       <>
//         <div className="bg-white p-4 rounded-lg shadow-md">
//           {showAll.map((work, index) => {
//             const statusColor =
//               work.status === "Initiated"
//                 ? "text-green-700"
//                 : work.status === "Active"
//                 ? "text-blue-500"
//                 : "text-red-500";

//             const statusColorBg =
//               work.status === "Initiated"
//                 ? "bg-green-500"
//                 : work.status === "Active"
//                 ? "bg-blue-500"
//                 : "bg-red-500";

//             return (
//               <Link
//                 href={`/ppm/${work.id}`}
//                 key={index}
//                 className="flex items-center gap-2 p-2 rounded-md transition-all duration-200 hover:bg-gray-100"
//               >
//                 <span
//                   className={`${statusColorBg}  hover:bg-blue-500 h-1.5 w-1.5 rounded-full mr-2`}
//                 ></span>
//                 <span
//                   className={`truncate ${statusColor} hover:text-blue-500 text-xs`}
//                 >
//                   {work.title} - {moment(work.startDate).format("lll")}
//                 </span>
//               </Link>
//             );
//           })}
//         </div>
//       </>
//     ),
//   };

//   useEffect(() => {
//     getPPMS();
//   }, [centralState]);

//   const getDaysInMonth = (month: number) => {
//     const year = new Date().getFullYear();
//     const days = new Date(year, month + 1, 0).getDate();
//     return Array.from({ length: days }, (_, i) => i + 1);
//   };

//   const parseDuration = (duration: string) => {
//     const [value, unit] = duration.split(" ");
//     return unit.includes("month") ? parseInt(value) * 30 : parseInt(value);
//   };

//   const parseFrequency = (frequency: string) => {
//     const [value, unit] = frequency.split(" ");
//     return unit.includes("month") ? parseInt(value) * 30 : parseInt(value);
//   };

//   const getWorkForDay = (day: number) => {
//     const currentDate = new Date(new Date().getFullYear(), selectedMonth, day);
//     return ppms.flatMap(
//       ({ id, title, status, startDate, duration, frequency }) => {
//         const start = new Date(startDate);
//         const end = new Date(start);
//         end.setDate(end.getDate() + parseDuration(duration));

//         const freqDays = parseFrequency(frequency);
//         const ppmDates = [];

//         for (
//           let d = new Date(start);
//           d <= end;
//           d.setDate(d.getDate() + freqDays)
//         ) {
//           if (
//             d.getFullYear() === currentDate.getFullYear() &&
//             d.getMonth() === currentDate.getMonth() &&
//             d.getDate() === currentDate.getDate()
//           ) {
//             ppmDates.push({
//               id,
//               title,
//               status,
//               startDate,
//               duration,
//               frequency,
//             });
//           }
//         }

//         return ppmDates;
//       }
//     );
//   };

//   const days = getDaysInMonth(selectedMonth);
//   console.log(days, "days");
//   return (
//     <DashboardLayout title="PPM" detail="View Work Calendar">
//       <SuccessModalCompoenent
//         title={successState.title}
//         detail={successState.detail}
//         modalState={successState.status}
//         setModalState={(state: boolean) =>
//           setSuccessState((prevState) => ({ ...prevState, status: state }))
//         }
//       ></SuccessModalCompoenent>
//       <ModalCompoenent
//         title={centralState === "showAll" ? "Show ppms" : "Create PPM"}
//         detail={""}
//         modalState={centralState}
//         setModalState={() => {
//           setCentralState("");
//           setActiveRowId(null);
//         }}
//         width={centralState === "showAll" && "w-[30rem]"}
//       >
//         {componentMap[centralState]}
//       </ModalCompoenent>

//       <div className="relative bg-white rounded-2xl p-4">
//         <div className="flex sm:flex-row flex-col items-center md:space-x-2 space-x-0 space-y-2 md:space-y-0 font-semibold text-md">
//           <div className="flex items-center border rounded-md w-full sm:w-[70%]">
//             <span className="pl-3 text-gray-400 mt-2">
//               <SearchIcon />
//             </span>
//             <input
//               id="searchInput"
//               type="text"
//               placeholder="Search..."
//               className="px-1 py-4 w-full focus:outline-none"
//             />
//           </div>
//           <ButtonComponent
//             text="Add New PPM"
//             onClick={() => setCentralState("createPPM")}
//             className="flex-1 px-4 py-3 text-white bg-[#A8353A]"
//           />
//         </div>
//       </div>

//       <div className="flex min-h-screen py-4 space-x-4">
//         <div className="w-full md:w-1/5 bg-white rounded-xl p-2">
//           <ul className="space-y-2">
//             {months.map((month, index) => (
//               <li
//                 key={index}
//                 className={`p-2 cursor-pointer rounded-md text-center ${
//                   selectedMonth === index
//                     ? "bg-[#A8353A] text-white"
//                     : "hover:bg-gray-200"
//                 }`}
//                 onClick={() => setSelectedMonth(index)}
//               >
//                 {month}
//               </li>
//             ))}
//           </ul>
//         </div>

//         <div className="w-4/5 p-4 bg-white rounded-xl">
//           <h2 className="text-base font-bold mb-4">
//             {months[selectedMonth]} {new Date().getFullYear()}
//           </h2>

//           <div className="grid grid-cols-1 sm:grid-cols-7 gap-0">
//             {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
//               <div
//                 key={day}
//                 className="text-center font-semibold text-gray-500 p-2"
//               >
//                 {day}
//               </div>
//             ))}
//             {days.map((day) => (
//               <>
//                 <div
//                   key={day}
//                   className="relative border border-gray-100 p-1 text-center hover:bg-gray-100 flex flex-col justify-end h-48"
//                 >
//                   <div className="absolute top-2 left-2 font-bold text-center text-sm">
//                     {day}
//                   </div>

//                   <ul className="text-sm text-gray-600">
//                     {getWorkForDay(day)
//                       .slice(0, 2)
//                       .map((work, index) => {
//                         const statusColor =
//                           work.status === "Initiated"
//                             ? "text-green-700"
//                             : work.status === "Active"
//                             ? "text-blue-500"
//                             : "text-red-500";

//                         const statusColorBg =
//                           work.status === "Initiated"
//                             ? "bg-green-500"
//                             : work.status === "Active"
//                             ? "bg-blue-500"
//                             : "bg-red-500";

//                         return (
//                           <>
//                             <li>
//                               <Link
//                                 href={`/ppm/${work.id}`}
//                                 key={index}
//                                 className="flex items-center"
//                               >
//                                 <span
//                                   className={`${statusColorBg}  hover:bg-blue-500 h-1.5 w-1.5 rounded-full mr-2`}
//                                 ></span>
//                                 <span
//                                   className={`truncate ${statusColor} hover:text-blue-500 text-xs`}
//                                 >
//                                   {work.title}{" "}
//                                   {moment(work.startDate).format("LT")}
//                                 </span>
//                               </Link>
//                             </li>
//                           </>
//                         );
//                       })}
//                   </ul>
//                   {getWorkForDay(day).length > 2 && (
//                     <div
//                       onClick={() => {
//                         setCentralState("showAll");
//                         setShowAll(getWorkForDay(day));
//                       }}
//                       className="mt-2 text-blue-600 hover:underline text-xs text-left cursor-pointer"
//                     >
//                       + Show More
//                     </div>
//                   )}
//                 </div>
//               </>
//             ))}
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }

// "use client";

// import ButtonComponent from "@/components/button-component";
// import DashboardLayout from "@/components/dashboard-layout-component";
// import FacilityDetails from "@/components/facility-management/view-facility";
// import ModalCompoenent, {
//   SuccessModalCompoenent,
// } from "@/components/modal-component";
// import CreatePPM from "@/components/ppm/createPPM";
// import createAxiosInstance from "@/utils/api";
// import { SearchIcon } from "@/utils/svg";
// import moment from "moment";
// import Link from "next/link";
// import { JSX, useEffect, useState } from "react";
// import DatePicker from "react-datepicker";

// import "react-datepicker/dist/react-datepicker.css";

// export default function Ppm() {
//   const axiosInstance = createAxiosInstance();

//   // Modal and notification state
//   const [successState, setSuccessState] = useState({
//     title: "",
//     detail: "",
//     status: false,
//   });
//   const [centralState, setCentralState] = useState<string>("");
//   const [activeRowId, setActiveRowId] = useState<string | null>(null);

//   // API & calendar data state
//   const [ppms, setPpms] = useState<any[]>([]);
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

//   // New states for optional end date controls.
//   // When these are null the end date is automatically set to the next month.
//   const [selectedEndMonth, setSelectedEndMonth] = useState<number | null>(null);
//   const [selectedEndYear, setSelectedEndYear] = useState<number | null>(null);

//   const [showAll, setShowAll] = useState<any[]>([]);

//   // Month names (0-indexed)
//   const months = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];

//   // Define a range of years (for example, currentYear-2 to currentYear+2)
//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

//   // Build the API query using the start date and either the custom end date (if selected)
//   // or the default (the first day of the next month).
//   const getPPMS = async () => {
//     // Start date is always the first day of the selected month.
//     const monthString = (selectedMonth + 1).toString().padStart(2, "0");
//     const startDate = `${selectedYear}-${monthString}-01`;

//     let endDate = "";
//     if (selectedEndYear !== null && selectedEndMonth !== null) {
//       // Use the user-selected end date.
//       const endMonthString = (selectedEndMonth + 1).toString().padStart(2, "0");
//       endDate = `${selectedEndYear}-${endMonthString}-01`;
//     } else {
//       // Fallback: end date is the first day of the next month.
//       let endYear = selectedYear;
//       let endMonth = selectedMonth + 2; // because selectedMonth is zero-indexed.
//       if (endMonth > 12) {
//         endMonth = 1;
//         endYear = selectedYear + 1;
//       }
//       const endMonthString = endMonth.toString().padStart(2, "0");
//       endDate = `${endYear}-${endMonthString}-01`;
//     }

//     try {
//       const response = await axiosInstance.get(
//         `/ppms?startDate=${startDate}&endDate=${endDate}`
//       );
//       setPpms(response.data.data);
//     } catch (error) {
//       console.error("Error fetching PPMs:", error);
//     }
//   };

//   // Convert frequency string to number of days.
//   const frequencyToDays = (frequency: string) => {
//     const freqLower = frequency.toLowerCase();
//     if (freqLower === "weekly") return 7;
//     if (freqLower === "daily") return 1;
//     if (freqLower === "monthly") return 30; // Approximation
//     return 1;
//   };

//   // Given a day of the month, check if any PPM occurs on that day.
//   // We loop from the event’s startDate to its endDate (provided in the data)
//   // advancing by the number of days given by its frequency.
//   const getWorkForDay = (day: number) => {
//     const currentDate = new Date(selectedYear, selectedMonth, day);
//     return ppms.flatMap(
//       ({ id, title, status, startDate, endDate, frequency }) => {
//         const start = new Date(startDate);
//         const end = new Date(endDate);
//         const freqDays = frequencyToDays(frequency);
//         const ppmDates = [];

//         for (
//           let d = new Date(start);
//           d <= end;
//           d.setDate(d.getDate() + freqDays)
//         ) {
//           if (
//             d.getFullYear() === currentDate.getFullYear() &&
//             d.getMonth() === currentDate.getMonth() &&
//             d.getDate() === currentDate.getDate()
//           ) {
//             ppmDates.push({ id, title, status, startDate, endDate, frequency });
//           }
//         }
//         return ppmDates;
//       }
//     );
//   };

//   // Compute the number of days in the selected start month.
//   const getDaysInMonth = (month: number, year: number) => {
//     const days = new Date(year, month + 1, 0).getDate();
//     return Array.from({ length: days }, (_, i) => i + 1);
//   };

//   const days = getDaysInMonth(selectedMonth, selectedYear);

//   // Fetch PPM data whenever the start or end date selection or modal state changes.
//   useEffect(() => {
//     getPPMS();
//   }, [
//     selectedYear,
//     selectedMonth,
//     selectedEndYear,
//     selectedEndMonth,
//     centralState,
//   ]);

//   // Mapping for modal content.
//   const componentMap: Record<string, JSX.Element> = {
//     createPPM: (
//       <CreatePPM
//         activeRowId={activeRowId}
//         setModalState={setCentralState}
//         setSuccessState={setSuccessState}
//       />
//     ),
//     showAll: (
//       <div className="bg-white p-4 rounded-lg shadow-md">
//         {showAll.map((work, index) => {
//           const statusColor =
//             work.status === "Initiated"
//               ? "text-green-700"
//               : work.status === "Active"
//               ? "text-blue-500"
//               : "text-red-500";

//           const statusColorBg =
//             work.status === "Initiated"
//               ? "bg-green-500"
//               : work.status === "Active"
//               ? "bg-blue-500"
//               : "bg-red-500";

//           return (
//             <Link
//               href={`/ppm/${work.id}`}
//               key={index}
//               className="flex items-center gap-2 p-2 rounded-md transition-all duration-200 hover:bg-gray-100"
//             >
//               <span
//                 className={`${statusColorBg} hover:bg-blue-500 h-1.5 w-1.5 rounded-full mr-2`}
//               ></span>
//               <span
//                 className={`truncate ${statusColor} hover:text-blue-500 text-xs`}
//               >
//                 {work.title} - {moment(work.startDate).format("lll")}
//               </span>
//             </Link>
//           );
//         })}
//       </div>
//     ),
//   };

//   return (
//     <DashboardLayout title="PPM" detail="View Work Calendar">
//       <SuccessModalCompoenent
//         title={successState.title}
//         detail={successState.detail}
//         modalState={successState.status}
//         setModalState={(state: boolean) =>
//           setSuccessState((prevState) => ({ ...prevState, status: state }))
//         }
//       />
//       <ModalCompoenent
//         title={centralState === "showAll" ? "Show PPMs" : "Create PPM"}
//         detail=""
//         modalState={centralState}
//         setModalState={() => {
//           setCentralState("");
//           setActiveRowId(null);
//         }}
//         width={centralState === "showAll" ? "w-[30rem]" : undefined}
//       >
//         {componentMap[centralState]}
//       </ModalCompoenent>

//       <div className="relative bg-white rounded-2xl p-4">
//         <div className="flex sm:flex-row flex-col items-center md:space-x-2 space-x-0 space-y-2 md:space-y-0 font-semibold text-md">
//           <div className="flex items-center border rounded-md w-full sm:w-[70%]">
//             <span className="pl-3 text-gray-400 mt-2">
//               <SearchIcon />
//             </span>
//             <input
//               id="searchInput"
//               type="text"
//               placeholder="Search..."
//               className="px-1 py-4 w-full focus:outline-none"
//             />
//           </div>
//           <ButtonComponent
//             text="Add New PPM"
//             onClick={() => setCentralState("createPPM")}
//             className="flex-1 px-4 py-3 text-white bg-[#A8353A]"
//           />
//         </div>
//       </div>

//       {/* Dropdowns for Start Date Selection */}
//       <div className="my-4">
//         <label className="block text-sm font-semibold mb-2">Date Range:</label>
//         <div className="flex items-center border p-3 rounded-md bg-gray-50">
//           {/* Start Date */}
//           <div className="flex items-center">
//             <select
//               value={selectedYear}
//               onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//               className="p-2 border rounded-md"
//             >
//               {years.map((year) => (
//                 <option key={year} value={year}>
//                   {year}
//                 </option>
//               ))}
//             </select>
//             <select
//               value={selectedMonth}
//               onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
//               className="p-2 border rounded-md ml-2"
//             >
//               {months.map((month, index) => (
//                 <option key={index} value={index}>
//                   {month}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Separator */}
//           <span className="mx-3 text-gray-500">to</span>

//           {/* End Date (Optional) */}
//           <div className="flex items-center">
//             <select
//               value={selectedEndYear !== null ? selectedEndYear : ""}
//               onChange={(e) =>
//                 setSelectedEndYear(
//                   e.target.value === "" ? null : parseInt(e.target.value)
//                 )
//               }
//               className="p-2 border rounded-md"
//             >
//               <option value="">Default</option>
//               {years.map((year) => (
//                 <option key={year} value={year}>
//                   {year}
//                 </option>
//               ))}
//             </select>
//             <select
//               value={selectedEndMonth !== null ? selectedEndMonth : ""}
//               onChange={(e) =>
//                 setSelectedEndMonth(
//                   e.target.value === "" ? null : parseInt(e.target.value)
//                 )
//               }
//               className="p-2 border rounded-md ml-2"
//             >
//               <option value="">Default</option>
//               {months.map((month, index) => (
//                 <option key={index} value={index}>
//                   {month}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       <div className="p-4 bg-white rounded-xl">
//         <h2 className="text-base font-bold mb-4">
//           {months[selectedMonth]} {selectedYear} to{" "}
//           {selectedEndYear !== null && selectedEndMonth !== null
//             ? `${months[selectedEndMonth]} ${selectedEndYear}`
//             : "Next Month (Default)"}
//         </h2>

//         <div className="grid grid-cols-1 sm:grid-cols-7 gap-0">
//           {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
//             <div
//               key={day}
//               className="text-center font-semibold text-gray-500 p-2"
//             >
//               {day}
//             </div>
//           ))}
//           {days.map((day) => (
//             <div
//               key={day}
//               className="relative border border-gray-100 p-1 text-center hover:bg-gray-100 flex flex-col justify-end h-48"
//             >
//               <div className="absolute top-2 left-2 font-bold text-sm">
//                 {day}
//               </div>
//               <ul className="text-sm text-gray-600">
//                 {getWorkForDay(day)
//                   .slice(0, 2)
//                   .map((work, index) => {
//                     const statusColor =
//                       work.status === "Initiated"
//                         ? "text-green-700"
//                         : work.status === "Active"
//                         ? "text-blue-500"
//                         : "text-red-500";

//                     const statusColorBg =
//                       work.status === "Initiated"
//                         ? "bg-green-500"
//                         : work.status === "Active"
//                         ? "bg-blue-500"
//                         : "bg-red-500";

//                     return (
//                       <li key={index}>
//                         <Link
//                           href={`/ppm/${work.id}`}
//                           className="flex items-center"
//                         >
//                           <span
//                             className={`${statusColorBg} hover:bg-blue-500 h-1.5 w-1.5 rounded-full mr-2`}
//                           ></span>
//                           <span
//                             className={`truncate ${statusColor} hover:text-blue-500 text-xs`}
//                           >
//                             {work.title} {moment(work.startDate).format("LT")}
//                           </span>
//                         </Link>
//                       </li>
//                     );
//                   })}
//               </ul>
//               {getWorkForDay(day).length > 2 && (
//                 <div
//                   onClick={() => {
//                     setCentralState("showAll");
//                     setShowAll(getWorkForDay(day));
//                   }}
//                   className="mt-2 text-blue-600 hover:underline text-xs text-left cursor-pointer"
//                 >
//                   + Show More
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }

"use client";

import ButtonComponent from "@/components/button-component";
import DashboardLayout from "@/components/dashboard-layout-component";
import FacilityDetails from "@/components/facility-management/view-facility";
import ModalCompoenent, {
  SuccessModalCompoenent,
} from "@/components/modal-component";
import CreatePPM from "@/components/ppm/createPPM";
import createAxiosInstance from "@/utils/api";
import { SearchIcon } from "@/utils/svg";
import axios from "axios";
import moment from "moment";
import Link from "next/link";
import { JSX, useEffect, useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export default function Ppm() {
  const axiosInstance = createAxiosInstance();

  // Modal and notification state
  const [successState, setSuccessState] = useState({
    title: "",
    detail: "",
    status: false,
  });
  const [centralState, setCentralState] = useState<string>("");
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  // API & calendar data state
  const [ppms, setPpms] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // States for optional end date controls
  const [selectedEndMonth, setSelectedEndMonth] = useState<number | null>(null);
  const [selectedEndYear, setSelectedEndYear] = useState<number | null>(null);

  const [showAll, setShowAll] = useState<any[]>([]);

  // Month names (0-indexed)
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Define a range of years (e.g. currentYear-2 to currentYear+2)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - 10 + i);

  // Build the API query using the start date and either a custom end date (if selected)
  // or the default (the first day of the next month).
  const getPPMS = async () => {
    const monthString = (selectedMonth + 1).toString().padStart(2, "0");
    const startDate = `${selectedYear}-${monthString}-01`;

    let endDate = "";
    if (selectedEndYear !== null && selectedEndMonth !== null) {
      const endMonthString = (selectedEndMonth + 1).toString().padStart(2, "0");
      endDate = `${selectedEndYear}-${endMonthString}-01`;
    } else {
      let endYear = selectedYear;
      let endMonth = selectedMonth + 2;
      if (endMonth > 12) {
        endMonth = 1;
        endYear = selectedYear + 1;
      }
      const endMonthString = endMonth.toString().padStart(2, "0");
      endDate = `${endYear}-${endMonthString}-01`;
    }

    const token = localStorage.getItem("authToken");
    try {
      const response = await axiosInstance.get(
        `/ppms?startDate=${startDate}&endDate=${endDate}`
      );
      setPpms(response.data);
    } catch (error) {
      console.error("Error fetching PPMs:", error);
    }
  };

  // UPDATED: Only show the event on the day its startDate occurs.
  const getWorkForDay = (day: number) => {
    const currentDate = new Date(selectedYear, selectedMonth, day);
    return ppms.filter(({ occurrenceDate }) => {
      const eventDate = new Date(occurrenceDate);
      return (
        eventDate.getFullYear() === currentDate.getFullYear() &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getDate() === currentDate.getDate()
      );
    });
  };

  // Compute the number of days in the selected start month.
  const getDaysInMonth = (month: number, year: number) => {
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => i + 1);
  };

  const days = getDaysInMonth(selectedMonth, selectedYear);

  // Refresh PPM data whenever the start or end date selection or modal state changes.
  useEffect(() => {
    getPPMS();
  }, [
    selectedYear,
    selectedMonth,
    selectedEndYear,
    selectedEndMonth,
    centralState,
  ]);

  // Modal content mapping.
  const componentMap: Record<string, JSX.Element> = {
    createPPM: (
      <CreatePPM
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    showAll: (
      <div className="bg-white p-4 rounded-lg shadow-md">
        {showAll.map((work, index) => {
          const statusColor =
            work.status === "Initiated"
              ? "text-green-700"
              : work.status === "Active"
              ? "text-blue-500"
              : "text-blue-500";
          const statusColorBg =
            work.status === "Initiated"
              ? "bg-green-500"
              : work.status === "Active"
              ? "bg-blue-500"
              : "bg-blue-500";

          return (
            <Link
              href={`/ppm/${work.id}`}
              key={index}
              className="flex items-center gap-2 p-2 rounded-md transition-all duration-200 hover:bg-gray-100"
            >
              <span
                className={`${statusColorBg} hover:bg-blue-500 h-1.5 w-1.5 rounded-full mr-2`}
              ></span>
              <span
                className={`truncate ${statusColor} hover:text-blue-500 text-xs`}
              >
                {work.title} - {moment(work.occurrenceDate).format("lll")}
              </span>
            </Link>
          );
        })}
      </div>
    ),
  };

  return (
    <DashboardLayout title="PPM" detail="View Work Calendar">
      <SuccessModalCompoenent
        title={successState.title}
        detail={successState.detail}
        modalState={successState.status}
        setModalState={(state: boolean) =>
          setSuccessState((prevState) => ({ ...prevState, status: state }))
        }
      />
      <ModalCompoenent
        title={centralState === "showAll" ? "Show PPMs" : "Create PPM"}
        detail=""
        modalState={centralState}
        setModalState={() => {
          setCentralState("");
          setActiveRowId(null);
        }}
        width={centralState === "showAll" ? "w-[30rem]" : undefined}
      >
        {componentMap[centralState]}
      </ModalCompoenent>

      <div className="relative bg-white rounded-2xl p-4 mb-4">
        <div className="flex sm:flex-row flex-col items-center md:space-x-2 space-x-0 space-y-2 md:space-y-0 font-semibold text-md">
          <div className="flex items-center border rounded-md w-full sm:w-[70%]">
            {/* <label className="block text-sm font-semibold mb-2">Date</label> */}
            <div className="flex items-center border p-3 rounded-md bg-gray-50 w-full">
              {/* Start Date */}
              <div className="flex items-center">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="p-2 border rounded-md"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="p-2 border rounded-md ml-2"
                >
                  {months.map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>

              {/* Separator */}
              <span className="hidden mx-3 text-gray-500">to</span>

              {/* End Date (Optional) */}
              <div className="hidden flex items-center">
                <select
                  value={selectedEndYear !== null ? selectedEndYear : ""}
                  onChange={(e) =>
                    setSelectedEndYear(
                      e.target.value === "" ? null : parseInt(e.target.value)
                    )
                  }
                  className="p-2 border rounded-md"
                >
                  <option value="">Default</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedEndMonth !== null ? selectedEndMonth : ""}
                  onChange={(e) =>
                    setSelectedEndMonth(
                      e.target.value === "" ? null : parseInt(e.target.value)
                    )
                  }
                  className="p-2 border rounded-md ml-2"
                >
                  <option value="">Default</option>
                  {months.map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <ButtonComponent
            text="Add New PPM"
            onClick={() => setCentralState("createPPM")}
            className="flex-1 px-4 py-3 text-white bg-[#A8353A]"
          />
        </div>
      </div>

      {/* Unified Date Range Picker */}

      <div className="p-4 bg-white rounded-xl">
        {/* <h2 className="text-base font-bold mb-4">
          {months[selectedMonth]} {selectedYear} to{" "}
          {selectedEndYear !== null && selectedEndMonth !== null
            ? `${months[selectedEndMonth]} ${selectedEndYear}`
            : "Next Month (Default)"}
        </h2> */}

        <h2 className="text-base font-bold mb-4">
          {months[selectedMonth]} {selectedYear}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-7 gap-0">
          {[
            "Mon 🧟",
            "Tue ☕",
            "Wed 🐪",
            "Thu 🧠",
            "Fri 🍸",
            "Sat 🎉",
            "Sun 💆‍♂",
          ].map((day) => (
            <div
              key={day}
              className="text-center font-semibold text-gray-500 p-2"
            >
              {day}
            </div>
          ))}
          {days.map((day) => (
            <div
              key={day}
              className="relative border border-gray-100 p-1 text-center hover:bg-gray-100 flex flex-col justify-end h-48"
            >
              <div className="absolute top-2 left-2 font-bold text-sm">
                {day}
              </div>
              <ul className="text-sm text-gray-600">
                {getWorkForDay(day).map((work, index) => {
                  const statusColor =
                    work.status === "Initiated"
                      ? "text-green-700"
                      : work.status === "Active"
                      ? "text-blue-500"
                      : "text-blue-500";
                  const statusColorBg =
                    work.status === "Initiated"
                      ? "bg-green-500"
                      : work.status === "Active"
                      ? "bg-blue-500"
                      : "bg-blue-500";

                  return (
                    <li key={index}>
                      <Link
                        href={`/ppm/${work.id}`}
                        className="flex items-center"
                      >
                        <span
                          className={`${statusColorBg} hover:bg-blue-500 h-1.5 w-1.5 rounded-full mr-2`}
                        ></span>
                        <span
                          className={`truncate ${statusColor} hover:text-blue-500 text-xs`}
                        >
                          {work.title}{" "}
                          {moment(work.occurrenceDate).format("LT")}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              {getWorkForDay(day).length > 2 && (
                <div
                  onClick={() => {
                    setCentralState("showAll");
                    setShowAll(getWorkForDay(day));
                  }}
                  className="mt-2 text-blue-600 hover:underline text-xs text-left cursor-pointer"
                >
                  + Show More
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
