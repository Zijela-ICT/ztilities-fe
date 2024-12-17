import { ArrowLeft } from "@/utils/svg";
import Navigation from "./navigation-component";
import ProtectedRoute from "./auth/protected-routes";
import { useDataPermission } from "@/context";
import ModalCompoenent from "./modal-component";
import { useState } from "react";
import ChangeMyPassword from "./change-my-password";

export default function DashboardLayout({
  children,
  title,
  detail,
  dynamic,
  onclick,
}: {
  children: any;
  title: string;
  detail?: string;
  dynamic?: boolean;
  onclick?: () => void;
}) {
  const { user } = useDataPermission();
  const [centralState, setCentralState] = useState<string>();

  return (
    <>
      <ModalCompoenent
        title={"Reset Password"}
        detail={"Reset your password"}
        modalState={user?.needPasswordReset  }
        setModalState={() => setCentralState("")}
      >
        <ChangeMyPassword />
      </ModalCompoenent>

      <ProtectedRoute>
        <div className="md:flex">
          <Navigation />
          <div className="min-h-screen bg-gray-50 text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 w-full md:w-4/5">
            {/* Banner for titles */}
            <div
              className={`bg-white text-black py-3 px-8 flex ${
                dynamic ? "flex-col-reverse" : "flex-col"
              }`}
            >
              <h1 className="text-2xl font-bold mb-1">{title}</h1>
              <div className="flex items-center">
                {dynamic && (
                  <div className="mr-2  cursor-pointer" onClick={onclick}>
                    <ArrowLeft />
                  </div>
                )}
                <h1 className="text-lg text-gray-500 font-light">{detail}</h1>
              </div>
            </div>

            {/* Children content */}
            <div className="bg-gray-100 h-full p-6">{children}</div>
          </div>
        </div>
      </ProtectedRoute>
    </>
  );
}
