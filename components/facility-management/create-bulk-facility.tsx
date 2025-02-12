// "use client";

// import { FormEvent, useState, useEffect } from "react";
// import Papa from "papaparse";
// import { DownloadArrow, DownloadIcon } from "@/utils/svg";
// import ButtonComponent from "../button-component";
// import createAxiosInstance from "@/utils/api";
// import { toast } from "react-toastify";

// interface BulkProps {
//   type?: string;
// }
// export default function CreateBulk({ type }: BulkProps) {
//   const axiosInstance = createAxiosInstance();
//   const [formData, setFormData] = useState({ name: "" });
//   const [csvData, setCsvData] = useState<any[]>([]);
//   const [headers, setHeaders] = useState<string[]>([]);
//   const [fileName, setFileName] = useState<string | null>(null);
//   const [fileSize, setFileSize] = useState<number | null>(null);

//   useEffect(() => {
//     setFormData({ name: "Superadmin" });
//   }, []);

//   const arrayFields = ["roles", "assets"]; // Add column names that should be arrays

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (file.size > 2 * 1024 * 1024) {
//       alert("File is too large. Maximum size is 2MB.");
//       return;
//     }

//     setFileName(file.name);
//     setFileSize(file.size);

//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const csvText = event.target?.result;
//       if (typeof csvText === "string") {
//         Papa.parse(csvText, {
//           header: true,
//           skipEmptyLines: true,
//           complete: (results) => {
//             if (results.data.length === 0) {
//               alert("The CSV file is empty.");
//               return;
//             }

//             // Extract headers dynamically
//             const extractedHeaders = Object.keys(results.data[0]);
//             setHeaders(extractedHeaders);

//             // Process data
//             const processedData = results.data.map((row: any) => {
//               const updatedRow: any = {};
//               for (const key in row) {
//                 if (arrayFields.includes(key)) {
//                   // Convert to an array of numbers, even if it's a single value
//                   updatedRow[key] = row[key]
//                     ? row[key]
//                         .split(",")
//                         .map((val: string) => Number(val.trim()))
//                     : [];
//                 } else {
//                   updatedRow[key] = row[key]; // Keep as is
//                 }
//               }
//               return updatedRow;
//             });

//             setCsvData(processedData);
//           },
//           error: (error) => {
//             console.error("Error parsing CSV file:", error);
//           },
//         });
//       }
//     };
//     reader.readAsText(file);
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (csvData.length === 0) {
//       toast.warning("Please upload a CSV file first.");
//       return;
//     }

//     if (type === " User") {
//       await axiosInstance.post(`/users/pre-register/bulk`, csvData);
//     } else if (type === "Facility") {
//       await axiosInstance.post(`/facilities/bulk`, csvData);
//     } else if (type === "Block") {
//       await axiosInstance.post(`/blocks/bulk`, csvData);
//     } else if (type === "Unit") {
//       await axiosInstance.post(`/units/bulk`, csvData);
//     }

//     console.log("Form Data:", formData);
//     console.log("CSV Data:", csvData);
//   };

//   return (
//     <div className="mt-12 px-6 max-w-full sm:mt-6 pb-12 bg-[#FBFBFC]">
//       <form onSubmit={handleSubmit}>
//         <div className="relative bg-white rounded-xl p-4 shadow-sm flex items-center justify-between w-full cursor-pointer">
//           <div className="flex items-center space-x-2">
//             <DownloadIcon />
//             <span className="text-md font-thin text-gray-600">
//               Download Sample file format for uploading
//             </span>
//           </div>
//           <DownloadArrow />
//         </div>

//         <div className="w-full border-dashed bg-white border-2 border-[#A8353A] rounded-lg p-6 pt-20 flex flex-col items-center justify-center mx-auto mt-4">
//           {fileName ? (
//             <div className="flex flex-col items-center p-4 rounded-md">
//               <span className="text-[#A8353A] font-semibold text-lg flex items-center gap-2">
//                 ✔ Uploaded
//               </span>
//               <p className="text-gray-600 text-sm mt-2">
//                 Your file has been uploaded successfully!
//               </p>
//               <div className="mt-4 p-3 bg-white border border-gray-300 rounded-md w-full text-center">
//                 <p className="text-gray-800 font-medium">{fileName}</p>
//                 <p className="text-gray-500 text-xs">
//                   {(fileSize! / 1024).toFixed(2)} KB
//                 </p>
//               </div>
//               <button
//                 className="mt-4 bg-[#A8353A] text-white px-4 py-2 rounded-md hover:bg-[#8c2b2f] transition"
//                 onClick={() => {
//                   setFileName(null);
//                   setFileSize(null);
//                   setCsvData([]);
//                   setHeaders([]);
//                 }}
//               >
//                 Remove File
//               </button>
//             </div>
//           ) : (
//             <>
//               <div className="text-center text-xs font-thin text-gray-900 mb-2">
//                 Select a file or drag and drop here
//               </div>
//               <div className="text-center text-xs font-thin text-gray-400 mb-6">
//                 .CSV file size no more than 2MB
//               </div>
//               <label
//                 htmlFor="file-upload"
//                 className="flex items-center justify-center bg-transparent border-2 border-[#A8353A] text-[#A8353A] font-semibold rounded-md px-12 py-3 cursor-pointer"
//               >
//                 <span>Upload</span>
//                 <input
//                   type="file"
//                   id="file-upload"
//                   className="hidden"
//                   accept=".csv"
//                   onChange={handleFileChange}
//                 />
//               </label>
//             </>
//           )}
//         </div>

//         <ButtonComponent text={"Submit"} className="mt-4 text-white" />
//       </form>
//     </div>
//   );
// }
