"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const Logo = "/assets/logo.png";
const ZijelaLogo = "/assets/zijela-logo.png";
export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = useCallback((path: string) => pathname === path, [pathname]);

  const logout = async () => {
    localStorage.removeItem("authToken"); // Remove the token
    router.push("/");
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <ul className="px-4 py-4 space-y-4 text-sm font-medium text-gray-500  w-full lg:w-1/5 bg-white">
      <div className="flex items-center justify-between">
        <li className="w-full px-4 ml-4">
          <Image src={Logo} alt="logo" width={100} height={70} />
        </li>
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
          {
            href: "/dashboard",
            label: "Dashboard",
            iconPath:
              "M17.8732 29.6195V26.5618C17.8732 25.7813 18.5106 25.1485 19.2969 25.1485H22.1711C22.5487 25.1485 22.9108 25.2974 23.1778 25.5624C23.4447 25.8275 23.5947 26.187 23.5947 26.5618V29.6195C23.5923 29.944 23.7205 30.2561 23.9508 30.4864C24.1811 30.7167 24.4945 30.8462 24.8214 30.8462H26.7823C27.6981 30.8485 28.5772 30.489 29.2256 29.847C29.8741 29.205 30.2385 28.3332 30.2385 27.424V18.7131C30.2385 17.9787 29.9105 17.282 29.3431 16.8109L22.6725 11.5221C21.5121 10.5948 19.8496 10.6247 18.7239 11.5932L12.2055 16.8109C11.6112 17.2681 11.256 17.9668 11.2385 18.7131V27.4151C11.2385 29.31 12.7858 30.8462 14.6946 30.8462H16.6108C17.2897 30.8462 17.8415 30.3024 17.8464 29.6284L17.8732 29.6195Z",
          },
          {
            href: "/work-request",
            label: "----------",
            iconPath:
              "M25.0723 11.3232C28.4616 11.3232 30.7385 13.7014 30.7385 17.24V25.4065C30.7385 28.9451 28.4616 31.3232 25.0713 31.3232H16.4046C13.0154 31.3232 10.7385 28.9451 10.7385 25.4065V17.24C10.7385 13.7014 13.0154 11.3232 16.4046 11.3232H25.0723ZM26.1751 21.8733C25.1031 21.2046 24.2755 22.1437 24.0523 22.444C23.8371 22.734 23.6521 23.0539 23.457 23.3738C22.9803 24.1633 22.4343 25.0735 21.4891 25.6029C20.1155 26.3635 19.0727 25.6628 18.3225 25.153C18.0409 24.9631 17.7674 24.7835 17.4949 24.6638C16.8232 24.3738 16.2188 24.704 15.3219 25.8434C14.8513 26.4388 14.3847 27.0291 13.912 27.6174C13.6295 27.9693 13.6969 28.5121 14.078 28.7474C14.6863 29.122 15.4285 29.3232 16.2671 29.3232H24.6948C25.1705 29.3232 25.6471 29.2582 26.1016 29.1096C27.1253 28.7753 27.9378 28.0095 28.3622 26.9982C28.7202 26.1478 28.8941 25.1158 28.5593 24.2572C28.4477 23.9724 28.2807 23.7071 28.0464 23.4739C27.432 22.864 26.8578 22.2943 26.1751 21.8733ZM17.2373 15.3232C15.8587 15.3232 14.7385 16.445 14.7385 17.8232C14.7385 19.2015 15.8587 20.3232 17.2373 20.3232C18.615 20.3232 19.7362 19.2015 19.7362 17.8232C19.7362 16.445 18.615 15.3232 17.2373 15.3232Z",
          },
          {
            href: "/dashboaruu9d",
            label: "------",
            iconPath:
              "M24.9295 10.7998C28.0185 10.7998 29.7385 12.5798 29.7385 15.6298V25.9598C29.7385 29.0598 28.0185 30.7998 24.9295 30.7998H16.5485C13.5085 30.7998 11.7385 29.0598 11.7385 25.9598V15.6298C11.7385 12.5798 13.5085 10.7998 16.5485 10.7998H24.9295ZM16.8185 24.5398C16.5185 24.5098 16.2285 24.6498 16.0685 24.9098C15.9085 25.1598 15.9085 25.4898 16.0685 25.7498C16.2285 25.9998 16.5185 26.1498 16.8185 26.1098H24.6585C25.0575 26.0698 25.3585 25.7288 25.3585 25.3298C25.3585 24.9198 25.0575 24.5798 24.6585 24.5398H16.8185ZM24.6585 19.9788H16.8185C16.3875 19.9788 16.0385 20.3298 16.0385 20.7598C16.0385 21.1898 16.3875 21.5398 16.8185 21.5398H24.6585C25.0885 21.5398 25.4385 21.1898 25.4385 20.7598C25.4385 20.3298 25.0885 19.9788 24.6585 19.9788ZM19.8075 15.4498H16.8185V15.4598C16.3875 15.4598 16.0385 15.8098 16.0385 16.2398C16.0385 16.6698 16.3875 17.0198 16.8185 17.0198H19.8075C20.2385 17.0198 20.5885 16.6698 20.5885 16.2288C20.5885 15.7998 20.2385 15.4498 19.8075 15.4498Z",
          },
          {
            href: "/dashb99ioard",
            label: "-----",
            iconPath:
              "M20.7583 11.2769C26.4383 11.2769 30.7383 15.9338 30.7383 21.2618C30.7383 27.4411 25.6983 31.2769 20.7383 31.2769C19.0983 31.2769 17.2783 30.8362 15.8183 29.9749C15.3083 29.6644 14.8783 29.4341 14.3283 29.6144L12.3083 30.2153C11.7983 30.3755 11.3383 29.9749 11.4883 29.4341L12.1583 27.1907C12.2683 26.8803 12.2483 26.5498 12.0883 26.2894C11.2283 24.707 10.7383 22.9744 10.7383 21.2919C10.7383 16.024 14.9483 11.2769 20.7583 11.2769ZM25.3283 20.02C24.6183 20.02 24.0483 20.5908 24.0483 21.3019C24.0483 22.0029 24.6183 22.5838 25.3283 22.5838C26.0383 22.5838 26.6083 22.0029 26.6083 21.3019C26.6083 20.5908 26.0383 20.02 25.3283 20.02ZM20.7183 20.02C20.0183 20.01 19.4383 20.5908 19.4383 21.2919C19.4383 22.0029 20.0083 22.5738 20.7183 22.5838C21.4283 22.5838 21.9983 22.0029 21.9983 21.3019C21.9983 20.5908 21.4283 20.02 20.7183 20.02ZM16.1083 20.02C15.3983 20.02 14.8283 20.5908 14.8283 21.3019C14.8283 22.0029 15.4083 22.5838 16.1083 22.5838C16.8183 22.5738 17.3883 22.0029 17.3883 21.3019C17.3883 20.5908 16.8183 20.02 16.1083 20.02Z",
          },
          {
            href: "/facility-management",
            label: "------------",
            iconPath:
              "M16.6583 22.2236C18.0683 22.2236 19.1983 23.3646 19.1983 24.7846V28.1936C19.1983 29.6036 18.0683 30.7536 16.6583 30.7536H13.2783C11.8783 30.7536 10.7383 29.6036 10.7383 28.1936V24.7846C10.7383 23.3646 11.8783 22.2236 13.2783 22.2236H16.6583ZM28.1984 22.2236C29.5984 22.2236 30.7384 23.3646 30.7384 24.7846V28.1936C30.7384 29.6036 29.5984 30.7536 28.1984 30.7536H24.8184C23.4084 30.7536 22.2784 29.6036 22.2784 28.1936V24.7846C22.2784 23.3646 23.4084 22.2236 24.8184 22.2236H28.1984ZM16.6583 10.7539C18.0683 10.7539 19.1983 11.9039 19.1983 13.3149V16.7239C19.1983 18.1439 18.0683 19.2839 16.6583 19.2839H13.2783C11.8783 19.2839 10.7383 18.1439 10.7383 16.7239V13.3149C10.7383 11.9039 11.8783 10.7539 13.2783 10.7539H16.6583ZM28.1984 10.7539C29.5984 10.7539 30.7384 11.9039 30.7384 13.3149V16.7239C30.7384 18.1439 29.5984 19.2839 28.1984 19.2839H24.8184C23.4084 19.2839 22.2784 18.1439 22.2784 16.7239V13.3149C22.2784 11.9039 23.4084 10.7539 24.8184 10.7539H28.1984Z",
          },
          {
            href: "/dasgvghboard",
            label: "-----",
            iconPath:
              "M20.7434 11.231C23.4234 11.231 25.6267 13.3369 25.7385 16.0053H25.7124C25.7155 16.0828 25.7006 16.1601 25.6688 16.231H25.8249C27.042 16.231 28.3163 17.0745 28.8273 19.1108L28.8829 19.351L29.6518 25.5457C30.2051 29.4967 28.0435 31.1582 25.0947 31.2286L24.897 31.231H16.607C13.6103 31.231 11.301 30.1389 11.8088 25.8145L11.8434 25.5457L12.6211 19.351C13.0046 17.1581 14.2921 16.2932 15.5326 16.2342L15.6702 16.231H15.7484C15.7352 16.1563 15.7352 16.0799 15.7484 16.0053C15.8602 13.3369 18.0635 11.231 20.7434 11.231ZM17.8355 19.5602C17.3474 19.5602 16.9517 19.9675 16.9517 20.4699C16.9517 20.9723 17.3474 21.3795 17.8355 21.3795C18.3236 21.3795 18.7193 20.9723 18.7193 20.4699L18.7124 20.3558C18.6579 19.9073 18.286 19.5602 17.8355 19.5602ZM23.6243 19.5602C23.1362 19.5602 22.7405 19.9675 22.7405 20.4699C22.7405 20.9723 23.1362 21.3795 23.6243 21.3795C24.1124 21.3795 24.5081 20.9723 24.5081 20.4699C24.5081 19.9675 24.1124 19.5602 23.6243 19.5602ZM20.7042 12.5333C18.7801 12.5333 17.2203 14.0878 17.2203 16.0053C17.2335 16.0799 17.2335 16.1563 17.2203 16.231H24.2317C24.2039 16.1589 24.1891 16.0825 24.1882 16.0053C24.1882 14.0878 22.6284 12.5333 20.7042 12.5333Z",
          },
          {
            href: "/user-management",
            label: "User Management",
            iconPath:
              "M20.6875 23.2471C24.1187 23.2471 27.0484 23.7911 27.0484 25.9679C27.0484 28.1437 24.1375 28.7075 20.6875 28.7075C17.2563 28.7075 14.3266 28.1636 14.3266 25.9877C14.3266 23.8109 17.2375 23.2471 20.6875 23.2471ZM26.1735 21.9364C27.4853 21.9121 28.8956 22.0922 29.4167 22.2201C30.5207 22.4371 31.2469 22.8802 31.5477 23.5242C31.802 24.0528 31.802 24.6661 31.5477 25.1939C31.0875 26.1927 29.6038 26.5133 29.0272 26.5961C28.9081 26.6141 28.8123 26.5106 28.8248 26.3908C29.1194 23.6232 26.7761 22.311 26.17 22.0093C26.144 21.9958 26.1386 21.9751 26.1413 21.9625C26.1431 21.9535 26.1538 21.9391 26.1735 21.9364ZM15.057 21.9345L15.3041 21.9368C15.3238 21.9395 15.3336 21.9539 15.3354 21.962C15.3381 21.9755 15.3327 21.9953 15.3076 22.0097C14.7006 22.3114 12.3573 23.6236 12.6519 26.3903C12.6644 26.5109 12.5695 26.6136 12.4504 26.5965C11.8738 26.5136 10.3901 26.193 9.92986 25.1943C9.67467 24.6656 9.67467 24.0532 9.92986 23.5245C10.2307 22.8806 10.956 22.4375 12.06 22.2195C12.582 22.0926 13.9914 21.9124 15.3041 21.9368L15.057 21.9345ZM20.6875 12.7075C23.0236 12.7075 24.8968 14.5898 24.8968 16.9404C24.8968 19.2901 23.0236 21.1741 20.6875 21.1741C18.3514 21.1741 16.4782 19.2901 16.4782 16.9404C16.4782 14.5898 18.3514 12.7075 20.6875 12.7075ZM26.4019 13.4134C28.6583 13.4134 30.4303 15.5488 29.8268 17.9273C29.4194 19.5285 27.9446 20.5922 26.3016 20.5489C26.1368 20.5444 25.9748 20.5291 25.8181 20.5021C25.7043 20.4823 25.647 20.3535 25.7115 20.258C26.3383 19.3304 26.6956 18.2145 26.6956 17.0167C26.6956 15.7667 26.3052 14.6013 25.6273 13.6458C25.6059 13.6161 25.5897 13.5701 25.6112 13.5359C25.6291 13.508 25.6623 13.4936 25.6936 13.4864C25.9219 13.4395 26.1565 13.4134 26.4019 13.4134ZM15.0744 13.4133C15.3197 13.4133 15.5543 13.4394 15.7836 13.4863C15.814 13.4935 15.848 13.5088 15.8659 13.5358C15.8865 13.57 15.8713 13.616 15.8498 13.6457C15.172 14.6012 14.7816 15.7666 14.7816 17.0167C14.7816 18.2145 15.1389 19.3303 15.7656 20.2579C15.8301 20.3534 15.7728 20.4822 15.6591 20.502C15.5015 20.5299 15.3403 20.5443 15.1756 20.5488C13.5325 20.5921 12.0578 19.5284 11.6504 17.9272C11.046 15.5487 12.818 13.4133 15.0744 13.4133Z",
          },
          {
            href: "/settings",
            label: "Settings",
            iconPath:
              "M21.4556 11.1846C22.2119 11.1846 22.8966 11.6046 23.2747 12.2246C23.4587 12.5246 23.5813 12.8946 23.5506 13.2846C23.5302 13.5846 23.6222 13.8846 23.7857 14.1646C24.3069 15.0146 25.4617 15.3346 26.361 14.8546C27.3728 14.2746 28.6502 14.6246 29.2327 15.6146L29.9174 16.7946C30.5102 17.7846 30.1831 19.0546 29.1612 19.6246C28.2925 20.1346 27.9859 21.2646 28.5071 22.1246C28.6706 22.3946 28.8546 22.6246 29.1407 22.7646C29.4984 22.9546 29.7744 23.2546 29.9685 23.5546C30.3467 24.1746 30.316 24.9346 29.9481 25.6046L29.2327 26.8046C28.8546 27.4446 28.1495 27.8446 27.4239 27.8446C27.0662 27.8446 26.6676 27.7446 26.3406 27.5446C26.0749 27.3746 25.7683 27.3146 25.4413 27.3146C24.4295 27.3146 23.5813 28.1446 23.5506 29.1346C23.5506 30.2846 22.6104 31.1846 21.4352 31.1846H20.0453C18.8599 31.1846 17.9197 30.2846 17.9197 29.1346C17.8992 28.1446 17.051 27.3146 16.0393 27.3146C15.702 27.3146 15.3954 27.3746 15.1399 27.5446C14.8129 27.7446 14.4041 27.8446 14.0567 27.8446C13.3208 27.8446 12.6157 27.4446 12.2376 26.8046L11.5324 25.6046C11.1543 24.9546 11.1339 24.1746 11.512 23.5546C11.6755 23.2546 11.9821 22.9546 12.3295 22.7646C12.6157 22.6246 12.7997 22.3946 12.9734 22.1246C13.4844 21.2646 13.1778 20.1346 12.3091 19.6246C11.2974 19.0546 10.9703 17.7846 11.5529 16.7946L12.2376 15.6146C12.8303 14.6246 14.0975 14.2746 15.1195 14.8546C16.0086 15.3346 17.1634 15.0146 17.6846 14.1646C17.8481 13.8846 17.9401 13.5846 17.9197 13.2846C17.8992 12.8946 18.0116 12.5246 18.2058 12.2246C18.5839 11.6046 19.2686 11.2046 20.0147 11.1846H21.4556ZM20.7505 18.3646C19.146 18.3646 17.8481 19.6246 17.8481 21.1946C17.8481 22.7646 19.146 24.0146 20.7505 24.0146C22.355 24.0146 23.6222 22.7646 23.6222 21.1946C23.6222 19.6246 22.355 18.3646 20.7505 18.3646Z",
          },
          {
            href: "/dasggghboard",
            label: "----",
            iconPath:
              "M27.2994 22.6812C29.1994 22.6812 30.7383 24.1942 30.7383 26.0608C30.7383 27.9264 29.1994 29.4394 27.2994 29.4394C25.4006 29.4394 23.8606 27.9264 23.8606 26.0608C23.8606 24.1942 25.4006 22.6812 27.2994 22.6812ZM18.8216 24.6196C19.6538 24.6196 20.3294 25.2833 20.3294 26.1009C20.3294 26.9174 19.6538 27.5822 18.8216 27.5822H12.2461C11.4139 27.5822 10.7383 26.9174 10.7383 26.1009C10.7383 25.2833 11.4139 24.6196 12.2461 24.6196H18.8216ZM14.1772 11.6616C16.0772 11.6616 17.6161 13.1746 17.6161 15.0402C17.6161 16.9068 16.0772 18.4198 14.1772 18.4198C12.2783 18.4198 10.7383 16.9068 10.7383 15.0402C10.7383 13.1746 12.2783 11.6616 14.1772 11.6616ZM29.2317 13.5599C30.0628 13.5599 30.7383 14.2237 30.7383 15.0402C30.7383 15.8578 30.0628 16.5215 29.2317 16.5215H22.6561C21.8239 16.5215 21.1484 15.8578 21.1484 15.0402C21.1484 14.2237 21.8239 13.5599 22.6561 13.5599H29.2317Z",
          },
        ].map(({ href, label, iconPath }) => (
          <li key={href} className="w-full px-4">
            <Link
              href={href}
              className={`inline-flex items-center w-full px-4 py-2 rounded-md font-bold text-base ${
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
        ))}

        <div className="flex items-center px-4 pt-24 ">
          <div>
            <Image src={ZijelaLogo} alt="logo" width={25} height={25} />{" "}
          </div>
          <div className="ml-2">Zijela ICT</div>
        </div>
        {/* Logout Button */}
        <li className="w-full px-4 pt-4">
          <button
            onClick={logout}
            className="inline-flex items-center justify-between w-full pl-4 py-4 pr-20 text-base rounded-lg text-white bg-[#A8353A] "
          >
            <svg
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.4927 2.52295C13.9753 2.52295 16 4.51295 16 6.96295V11.7529H9.89535C9.45785 11.7529 9.11192 12.093 9.11192 12.523C9.11192 12.943 9.45785 13.293 9.89535 13.293H16V18.073C16 20.523 13.9753 22.523 11.4724 22.523H6.51744C4.02471 22.523 2 20.533 2 18.083V6.97295C2 4.51295 4.03488 2.52295 6.52762 2.52295H11.4927ZM18.5402 9.07315C18.8402 8.76315 19.3302 8.76315 19.6302 9.06315L22.5502 11.9732C22.7002 12.1232 22.7802 12.3132 22.7802 12.5232C22.7802 12.7232 22.7002 12.9232 22.5502 13.0632L19.6302 15.9732C19.4802 16.1232 19.2802 16.2032 19.0902 16.2032C18.8902 16.2032 18.6902 16.1232 18.5402 15.9732C18.2402 15.6732 18.2402 15.1832 18.5402 14.8832L20.1402 13.2931H16.0002V11.7531H20.1402L18.5402 10.1632C18.2402 9.86315 18.2402 9.37315 18.5402 9.07315Z"
                fill="white"
              />
            </svg>
            Logout
          </button>
        </li>
      </div>
    </ul>
  );
}
