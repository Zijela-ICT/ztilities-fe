import { useDataPermission } from "@/context";
import { paths } from "@/utils/ojects";
import { LogoutIcon } from "@/utils/svg";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import ModalCompoenent from "./modal-component";
import UserProfile from "../app/user-profile/page";
import ButtonComponent from "./button-component";

const Logo = "/assets/logo.png";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();

  const { user, userRoles, userPermissions } = useDataPermission();
  const [centralState, setCentralState] = useState<string>();

  const isActive = useCallback((path: string) => pathname === path, [pathname]);

  const logout = async () => {
    localStorage.removeItem("authToken"); // Remove the token
    router.push("/");
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Function to check if the user has any of the permissions for a route
  const hasPermissionForRoute = (permissions: string[]) => {
    return permissions.some((permission) =>
      userPermissions.some((userPermission) =>
        userPermission.permissionString.includes(permission)
      )
    );
  };

  return (
    <>
      {" "}
      <ModalCompoenent
        title={"Profile view"}
        detail={""}
        modalState={centralState}
        setModalState={() => setCentralState("")}
        width="max-w-sm"
        systemColor
      >
        <div className="flex flex-col items-center justify-center py-8 px-8">
          <Image
            src={user.avatar}
            alt={"#"}
            width={200}
            height={200}
            className=" rounded-full"
          />
          <h2 className="text-xl font-bold text-white mt-2">
            {user?.firstName} {"   "} {user?.lastName}{" "}
          </h2>
          <p className="text-white text-base">{user?.email}</p>

          {userRoles?.map((role) => {
            return (
              <div key={role.name} className="text-xs mt-2 bg-white text-[#A8353A] px-3 py-1 rounded-full shadow-sm">
                <p key={role.name}> {role.name} </p>
              </div>
            );
          })}
          <ButtonComponent
            text="Got to Profile"
            className="bg-white mt-6 "
            onClick={() => {
              router.push(`/user-profile`);
              setCentralState("");
            }}
          />
        </div>
      </ModalCompoenent>
      <ul className="px-4 py-4 space-y-4 text-xs font-medium text-gray-500  w-full lg:w-1/5 bg-white">
        <div className="flex items-center justify-between">
          <Link href={`/dashboard`} className="w-full px-4 ml-4">
            <Image src={Logo} alt="logo" width={100} height={70} />
          </Link>

          <button onClick={toggleMenu} className="md:hidden text-gray-500 ">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        <>
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
        </>

        <div className={`md:block ${isMenuOpen ? "block" : "hidden"}`}>
          {[
            // Your routes here
            {
              href: "/dashboard",
              label: "Dashboard",
              permissions: [""],
              iconPath: paths.path1,
            },
            {
              href: "/facility-management",
              label: "Facility Management",
              permissions: ["units", "blocks", "facilities"],
              iconPath: paths.path5,
            },
            {
              href: "/work-requests",
              label: "Work Request",
              permissions: ["work-requests"],
              iconPath: paths.path3,
            },
            {
              href: "/work-orders",
              label: "Work Order",
              permissions: ["work-orders"],
              iconPath: paths.path6,
            },
            {
              href: "/power",
              label: "Power",
              permissions: ["power-charges"],
              iconPath: paths.path6,
            },
            {
              href: "/bills",
              label: "Bills",
              permissions: ["units"],
              iconPath: paths.path6,
            },

            // {
            //   href: "/ppm",
            //   label: "PPM",
            //   permissions: ["users"],
            //   iconPath: paths.path9,
            // },
            {
              href: "/vendor-management",
              label: "Vendor & Tech Management",
              permissions: ["vendors"],
              iconPath: paths.path9,
            },
            {
              href: "/user-management",
              label: "User Management",
              permissions: ["roles", "users", "permissions", "auth"],
              iconPath: paths.path7,
            },
            // {
            //   href: "/transaction",
            //   label: "Transactions",
            //   permissions: ["wallets", "users"],
            //   iconPath: paths.path8,
            // },
          ].map(
            ({ href, label, permissions, iconPath }) =>
              hasPermissionForRoute(permissions) && (
                <li key={href} className="w-full px-4">
                  <Link
                    href={href}
                    className={`inline-flex items-center w-full px-4 py-2 rounded-md font-thin  ${
                      isActive(href) ? "bg-[#FBC2B61A] text-[#A8353A] " : ""
                    }`}
                    aria-current={isActive(href) ? "page" : undefined}
                  >
                    <svg
                      className={`w-10 h-10 me-2 ${
                        isActive(href) ? "text-[#A8353A]" : "text-gray-500 "
                      }`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 42 42"
                    >
                      <path d={iconPath} />
                    </svg>
                    {label}
                  </Link>
                </li>
              )
          )}

          <div className="flex items-center px-4 pt-32 "></div>
          {/* Logout Button */}
          <li className="w-full px-4 pt-4">
            <button
              onClick={logout}
              className="inline-flex items-center justify-between w-full pl-4 py-3 pr-20 rounded-lg text-white bg-[#A8353A] "
            >
              <LogoutIcon />
              Logout
            </button>
          </li>
        </div>
      </ul>
    </>
  );
}
