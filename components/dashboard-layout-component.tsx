// components/DashboardLayout.tsx
import {
  ArrowLeft,
  NotifIcon,
  RefreshIcon,
  SettingUserIcon,
  UserProfile,
} from "@/utils/svg";
import Navigation from "./navigation-component";
import ProtectedRoute from "./auth/protected-routes";
import { useDataPermission } from "@/context";
import ModalCompoenent, {
  ActionModalCompoenent,
  SuccessModalCompoenent,
} from "./modal-component";
import { useEffect, useState } from "react";
import ChangeMyPassword from "./change-my-password";
import Link from "next/link";
import Image from "next/image";
import formatCurrency from "@/utils/formatCurrency";
import createAxiosInstance from "@/utils/api";
import NotificationCard from "./notif-component";
import { useRouter, usePathname } from "next/navigation";
import PermissionGuard from "./auth/permission-protected-components";

export default function DashboardLayout({
  children,
  title,
  detail,
  dynamic,
  onclick,
  nowrap, // New 'nowrap' prop

  getTitle,
  getDetail,
  componentMap,
  takeAction,
  setActiveRowId,
  setABeneficiary,
  setANotification,
}: {
  children: any;
  title: string;
  detail?: string;
  dynamic?: boolean;
  onclick?: () => void;
  nowrap?: boolean; // Optional 'nowrap' prop

  getTitle?: any;
  getDetail?: any;
  componentMap?: any;
  takeAction?: any;
  setActiveRowId?: (id: any) => void;
  setABeneficiary?: (id: any) => void;
  setANotification?: (any:any) => void
}) {
  const axiosInstance = createAxiosInstance();
  const {
    user,
    setUser,
    setUserPermissions,
    setUserRoles,
    centralState,
    setCentralState,
    centralStateDelete,
    setCentralStateDelete,
    successState,
    setSuccessState,
    notificationState,
    setNotificationState,
  } = useDataPermission();
  const pathname = usePathname();
  const router = useRouter();

  const [selectedWallet, setSelectedWallet] = useState<any>();
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    setSelectedWallet(user?.wallets[0]);
  }, [user?.wallets]);

  const getMe = async () => {
    const response = await axiosInstance.get("/auth/me");
    setUser(response.data.data.user);
    const roles = response.data.data?.roles || [];
    setUserRoles(roles);
    const allPermissions = roles
      .map((role: any) => role.permissions || []) // Extract permissions from each role, you get ?
      .flat(); // Flatten the array of arrays
    // Remove duplicate permissions using a Set
    const uniquePermissions: Permission[] = Array.from(new Set(allPermissions));
    setUserPermissions(uniquePermissions);
  };

  useEffect(() => {
    if (pathname !== "/dashboard") {
      getMe();
    }
  }, [pathname]);

  const getNotifications = async () => {
    const response = await axiosInstance.get(
      `/notifications/my-notifications/all/unread`
    );
    const notifications = response.data?.data;
    setNotificationState(notifications?.length || 0);
  };
  useEffect(() => {
    getNotifications();
  }, []);

  const handleWalletChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = user.wallets.find(
      (wallet) => wallet.id === parseInt(event.target.value)
    );
    if (selected) setSelectedWallet(selected);
  };

  // If 'nowrap' is true, directly render children without wrapping them in the layout. feel me ?
  if (nowrap) {
    return <>{children}</>;
  }

  // Toggle notification box visibility
  const handleNotificationClick = () => {
    setShowNotifications((prev) => !prev);
  };

  return (
    <>
      <ModalCompoenent
        title={"Reset Password"}
        detail={"Reset your password"}
        modalState={user?.needPasswordReset}
        setModalState={() => setCentralState("")}
      >
        <ChangeMyPassword />
      </ModalCompoenent>

      <SuccessModalCompoenent
        title={successState.title}
        detail={successState.detail}
        modalState={successState.status}
        setModalState={(state: boolean) =>
          setSuccessState((prevState) => ({ ...prevState, status: state }))
        }
      ></SuccessModalCompoenent>

      <ActionModalCompoenent
        title={getTitle && getTitle()}
        detail={getDetail && getDetail()}
        modalState={centralStateDelete}
        setModalState={setCentralStateDelete}
        takeAction={takeAction && takeAction}
      ></ActionModalCompoenent>

      <ModalCompoenent
        title={getTitle && getTitle()}
        detail={getDetail && getDetail()}
        modalState={centralState}
        setModalState={() => {
          setCentralState("");
          if (setActiveRowId) {
            setActiveRowId(null);
          }
          if (setABeneficiary) {
            setABeneficiary("");
          }
          if (setANotification) {
            setANotification(null);
          }
        }}
      >
        {componentMap && componentMap[centralState]}
      </ModalCompoenent>

      <ProtectedRoute>
        <div className="md:flex">
          <Navigation />
          <div className="min-h-screen bg-gray-50 text-medium text-gray-500 w-full flex-1 md:w-4/5">
            {/* Banner for titles */}
            <div className="flex items-center justify-between bg-white">
              <div
                className={` text-black py-3 px-8 flex ${
                  dynamic ? "flex-col-reverse" : "flex-col"
                }`}
              >
                <h1 className="text-xl font-bold mb-1">{title}</h1>
                <div className="flex items-center">
                  {dynamic && (
                    <div className="mr-2 cursor-pointer" onClick={onclick}>
                      <ArrowLeft />
                    </div>
                  )}
                  <h1 className="text-sm text-gray-500 font-light">{detail}</h1>
                </div>
              </div>

              <div className="flex space-x-6 mr-14 relative">
                {/* Wallet Dropdown */}
                {selectedWallet && (
                  <>
                    <div
                      onClick={() => getMe()}
                      className="text-black flex items-center space-x-1 cursor-pointer"
                    >
                      <p>Refresh : </p>
                      <RefreshIcon stroke="black" />
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-lg text-black font-medium">
                        ₦ {formatCurrency(selectedWallet?.balance || 0)}
                      </span>
                      <select
                        value={selectedWallet?.id}
                        onChange={handleWalletChange}
                        className="border p-2 rounded w-48"
                      >
                        {user?.wallets.map((wallet) => (
                          <option key={wallet.id} value={wallet.id}>
                            {wallet.walletType}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <Link href={`/user-profile`}>
                  {user?.avatar ? (
                    <Image
                      src={user?.avatar}
                      alt="User Avatar"
                      className="rounded-full"
                      width={32}
                      height={32}
                    />
                  ) : (
                    <UserProfile />
                  )}
                </Link>
                <Link href={`/settings`}>
                  <SettingUserIcon />
                </Link>
                <div
                  className="relative cursor-pointer"
                  onClick={handleNotificationClick}
                >
                  <NotifIcon />

                  {/* Notification Badge */}
                  {notificationState > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-700 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                      {notificationState > 99 ? "99+" : notificationState}
                    </div>
                  )}
                </div>

                {showNotifications && (
                  <NotificationCard
                    onClose={() => {
                      setShowNotifications(false);
                      setCentralState("");
                    }}
                  />
                )}
              </div>
            </div>

            {/* Children content */}
            <div className="bg-gray-100 h-full text-sm p-6 relative">{children}</div>
          </div>
        </div>
      </ProtectedRoute>
    </>
  );
}
