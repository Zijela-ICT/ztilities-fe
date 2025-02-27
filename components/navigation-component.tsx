import { useDataPermission } from "@/context";
import {
  FacilityMIcon,
  HomeIcon,
  LogoutIcon,
  PPMIcon,
  TransactionMIcon,
  UserMIcon,
  VendorIcon,
  WorkOrderIcon,
  WorkRequestIcon,
} from "@/utils/svg";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import ModalCompoenent from "./modal-component";
import ButtonComponent from "./button-component";

const Logo = "/assets/logo.png";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();

  const { user, userRoles, userPermissions } = useDataPermission();
  const [centralState, setCentralState] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState(false); // state to toggle sidebar collapse
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = useCallback((path: string) => pathname === path, [pathname]);

  const logout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userPermissions");
    localStorage.removeItem("userRoles");
    router.push("/");
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  // Check if the user has any of the permissions for a route
  const hasPermissionForRoute = (permissions: string[]) => {
    return permissions.some((permission) =>
      userPermissions.some((userPermission) =>
        userPermission.permissionString.includes(permission)
      )
    );
  };

  const hasTenantRole = userRoles.some(
    (role: Role) => role.name === "TENANT_ROLE"
  );

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      permissions: [""],
      icon: <HomeIcon />,
    },
    {
      href: "/facility-management",
      label: "Facility Management",
      permissions: ["units", "blocks", "facilities"],
      icon: <FacilityMIcon />,
    },
    {
      href: "/work-requests",
      label: "Work Request",
      permissions: ["work-requests"],
      icon: <WorkRequestIcon />,
    },
    {
      href: "/work-orders",
      label: "Work Order",
      permissions: ["work-orders"],
      icon: <WorkOrderIcon />,
    },
    {
      href: "/power",
      label: "Power",
      permissions: ["power-charges"],
      icon: <WorkRequestIcon />,
    },
    {
      href: "/bills",
      label: "Bills",
      permissions: ["units"],
      icon: <WorkRequestIcon />,
    },
    {
      href: "/approvers",
      label: "Approvers",
      permissions: ["users"],
      icon: <WorkRequestIcon />,
    },
    {
      href: "/ppm",
      label: "PPM",
      permissions: ["ppms"],
      icon: <PPMIcon />,
    },
    {
      href: "/audit",
      label: "Audit Logs",
      permissions: ["audit"],
      icon: <WorkRequestIcon />,
    },
    {
      href: "/vendor-management",
      label: "Vendor & Tech Management",
      permissions: ["vendors"],
      icon: <VendorIcon />,
    },
    {
      href: "/user-management",
      label: "User Management",
      permissions: ["roles", "users", "permissions", "auth"],
      icon: <UserMIcon />,
    },
    {
      href: "/transaction",
      label: "Transactions",
      permissions: ["transactions", "users"],
      icon: <TransactionMIcon />,
    },
  ];

  return (
    <>
      <ModalCompoenent
        title={"Profile view"}
        detail={""}
        modalState={centralState}
        setModalState={() => setCentralState("")}
        width="max-w-sm"
        systemColor
      >
        <div className="flex flex-col items-center justify-center py-8 px-8">
          {user?.avatar ? (
            <Image
              src={user.avatar}
              alt={"#"}
              width={200}
              height={200}
              className="rounded-full"
            />
          ) : (
            <div
              className="rounded-full flex items-center justify-center text-[#A8353A] font-semibold text-6xl"
              style={{
                width: 200,
                height: 200,
                backgroundColor: "#fff",
              }}
            >
              {`${user?.firstName?.[0] || ""}${
                user?.lastName?.[0] || ""
              }`.toUpperCase()}
            </div>
          )}

          <h2 className="text-xl font-bold text-white mt-2">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-white text-base">{user?.email}</p>

          {userRoles?.map((role) => (
            <div
              key={role.name}
              className="text-xs mt-2 bg-white text-[#A8353A] px-3 py-1 rounded-full shadow-sm"
            >
              <p>{role.name}</p>
            </div>
          ))}
          <ButtonComponent
            text="Go to Profile"
            className="bg-white mt-6"
            onClick={() => {
              router.push(`/user-profile`);
              setCentralState("");
            }}
          />
        </div>
      </ModalCompoenent>

      <ul
        className={`px-4 py-4 space-y-4 text-xs font-medium text-gray-500 bg-white ${
          isCollapsed ? "w-16" : "w-full lg:w-1/5"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link href={`/dashboard`} className="px-4">
            <Image
              src={Logo}
              alt="logo"
              width={isCollapsed ? 50 : 100}
              height={isCollapsed ? 35 : 70}
            />
          </Link>
          {/* Desktop collapse toggle */}
          <button onClick={toggleSidebar} className="hidden lg:block">
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isCollapsed ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              )}
            </svg>
          </button>
          {/* Mobile hamburger toggle */}
          <button onClick={toggleMenu} className="md:hidden text-gray-500">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Full profile card visible only when not collapsed */}
        {!isCollapsed && (
          <div
            onClick={() => setCentralState("viewProfile")}
            className="flex cursor-pointer hover:animate-tilt flex-col items-center justify-center p-4 bg-[#A8353A] rounded-lg shadow-lg text-white max-w-sm mx-auto"
          >
            <p className="text-base font-semibold">
              {user?.firstName} {user?.lastName}
            </p>
            <div className="text-xs mt-2 bg-white text-[#A8353A] px-3 py-1 rounded-full shadow-sm">
              {userRoles[0]?.name}
            </div>
          </div>
        )}

        <div
          className={`md:block ${isMenuOpen ? "block" : "hidden"} space-y-3`}
        >
          {navItems.map(({ href, label, permissions, icon }) => {
            if (href === "/work-orders" && hasTenantRole) return null;
            return (
              hasPermissionForRoute(permissions) && (
                <li
                  key={href}
                  className={`w-full ${isCollapsed ? "px-0" : "px-4"}`}
                >
                  <Link
                    href={href}
                    className={`inline-flex items-center w-full ${
                      isCollapsed ? "justify-center px-0" : "justify-start px-4"
                    } py-2 rounded-md font-thin ${
                      isActive(href) ? "bg-[#FBC2B61A] text-[#A8353A]" : ""
                    }`}
                    aria-current={isActive(href) ? "page" : undefined}
                  >
                    <span className="flex items-center justify-center w-6 h-6">
                      {icon}
                    </span>
                    {!isCollapsed && <span className="ml-2">{label}</span>}
                  </Link>
                </li>
              )
            );
          })}

          <li className={`w-full ${isCollapsed ? "px-0" : "px-4"} pt-4`}>
            <button
              onClick={logout}
              className={`inline-flex items-center justify-between w-full ${
                isCollapsed ? "justify-center" : "pl-4 pr-20"
              } py-3 rounded-lg text-white bg-[#A8353A]`}
            >
              <LogoutIcon />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </li>
        </div>
      </ul>
    </>
  );
}
