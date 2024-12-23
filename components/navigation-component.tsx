import { useDataPermission } from "@/context";
import { paths } from "@/utils/ojects";
import { LogoutIcon } from "@/utils/svg";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const Logo = "/assets/logo.png";
const ZijelaLogo = "/assets/zijela-logo.png";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();

  const { userPermissions } = useDataPermission();

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
    <ul className="px-4 py-4 space-y-4 text-sm font-medium text-gray-500  w-full lg:w-1/5 bg-white">
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

      <div className={`md:block ${isMenuOpen ? "block" : "hidden"}`}>
        {[
          // Your routes here
          {
            href: "/dashboard",
            label: "Dashboard",
            permissions: ["users", "admin"],
            iconPath: paths.path1,
          },
          {
            href: "/work-requests",
            label: "Work Request",
            permissions: ["work-requests", "work-orders"],
            iconPath: paths.path1,
          },
          {
            href: "/facility-management",
            label: "Facility Management",
            permissions: ["units", "blocks", "facilities"],
            iconPath: paths.path2,
          },
          {
            href: "/vendor-management",
            label: "Vendor & Tech Management",
            permissions: ["vendors"],
            iconPath: paths.path5,
          },
          {
            href: "/user-management",
            label: "User Management",
            permissions: ["roles", "users", "permissions", "auth"],
            iconPath: paths.path7,
          },
          {
            href: "/settings",
            label: "Settings",
            permissions: ["app-settings", "users"],
            iconPath: paths.path8,
          },
        ].map(
          ({ href, label, permissions, iconPath }) =>
            hasPermissionForRoute(permissions) && (
              <li key={href} className="w-full px-4">
                <Link
                  href={href}
                  className={`inline-flex items-center w-full px-4 py-2 rounded-md font-thin text-md ${
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

        <div className="flex items-center px-4 pt-32 ">
          <div>
            <Image src={ZijelaLogo} alt="logo" width={25} height={25} />{" "}
          </div>
          <div className="ml-2">Zijela ICT</div>
        </div>
        {/* Logout Button */}
        <li className="w-full px-4 pt-4">
          <button
            onClick={logout}
            className="inline-flex items-center justify-between w-full pl-4 py-3 pr-20 text-sm rounded-lg text-white bg-[#A8353A] "
          >
            <LogoutIcon />
            Logout
          </button>
        </li>
      </div>
    </ul>
  );
}
