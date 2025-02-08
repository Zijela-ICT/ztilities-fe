// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import createAxiosInstance from "@/utils/api";
// import ButtonComponent from "@/components/button-component";
// import { MyLoaderFinite } from "@/components/loader-components";

// function CompleteTransaction() {
//   const axiosInstance = createAxiosInstance();
//   const router = useRouter();
//   const { id } = useParams();

//   const [query, setQuery] = useState<string>();
//   const [status, setStatus] = useState<string>();
//   const [verified, setVerified] = useState<string>();

//   useEffect(() => {
//     const queryReference = new URLSearchParams(window.location.search).get(
//       "reference"
//     );
//     const queryStatus = new URLSearchParams(window.location.search).get(
//       "status"
//     );
//     if (queryReference) {
//       setQuery(queryReference);
//     }
//     if (queryStatus) {
//       setStatus(queryStatus);
//     }
//   }, []);

//   const [loading, setLoading] = useState(true);

//   const verifyTransaction = async () => {
//     const response = await axiosInstance.patch(`/payments/verify/${query}`);
//     setLoading(false);
//   };

//   useEffect(() => {
//     if (query && status === "success") {
//       verifyTransaction();
//     } else if (query && status === "cancelled") {
//       setLoading(false);
//     }
//   }, [query, status]);

//   return (
//     <div className="w-full h-screen flex items-center justify-center">
//       {!loading ? (
//         <div>
//           <div className="flex flex-col items-center justify-center space-y-3 mb-4">
//             <h2 className="text-2xl font-bold">
//               {status === "success"
//                 ? "Verified Successfuly!"
//                 : "Transaction failed"}
//             </h2>
//             <p className="text-center text-md font-lighter w-full ">
//               {status === "success"
//                 ? "Your transaction was verified successfully"
//                 : "Your transaction was failed"}
//               .
//             </p>
//           </div>
//           <ButtonComponent
//             text="Go Home"
//             onClick={() => {
//               router.push(`/dashboard`);
//             }}
//             className="text-white"
//           />
//         </div>
//       ) : (
//         <div className="flex items-center space-x-4">
//           <div>
//             <MyLoaderFinite />
//           </div>
//           <div>Verifying transaction</div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default CompleteTransaction;

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import createAxiosInstance from "@/utils/api";
import ButtonComponent from "@/components/button-component";
import { MyLoaderFinite } from "@/components/loader-components";
import axios from "axios";

function CompleteTransaction() {
  const axiosInstance = createAxiosInstance();
  const router = useRouter();
  const { id } = useParams();

  const [query, setQuery] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("reference"));
    setStatus(params.get("status"));
  }, []);

  const sendMessageToReactNative = (reference: string, status: string) => {
    if (typeof window !== "undefined" && window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          action: "transaction",
          data: {
            reference_id: reference,
            status: status,
          },
        })
      );
    }
  };

  const verifyTransaction = async () => {
    if (!query) return; // Prevent API call if query is missing
    try {
      await axios.patch(`/payments/verify/${query}`);
      sendMessageToReactNative(query, "success");
    } catch (error) {
      console.error("Transaction verification failed:", error);
      sendMessageToReactNative(query, "cancelled");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      if (status === "success") {
        verifyTransaction();
      } else if (status === "cancelled") {
        setLoading(false);
      }
    }
  }, [query, status]);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      {!loading ? (
        <div>
          <div className="flex flex-col items-center justify-center space-y-3 mb-4">
            <h2 className="text-2xl font-bold">
              {status === "success"
                ? "Verified Successfully!"
                : "Transaction Failed"}
            </h2>
            <p className="text-center text-md font-lighter w-full">
              {status === "success"
                ? "Your transaction was verified successfully."
                : "Your transaction failed."}
            </p>
          </div>
          <ButtonComponent
            text="Go Home"
            onClick={() => router.push("/dashboard")}
            className="text-white"
          />
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <MyLoaderFinite />
          <div>Verifying transaction...</div>
        </div>
      )}
    </div>
  );
}

export default CompleteTransaction;
