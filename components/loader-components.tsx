import Image from "next/image";

const Logo = "/assets/logo.png";

export default function MyLoader() {
  return (
    <div className="flex w-full h-screen justify-center items-center">
      <>
        <div className="mb-6">
          <Image
            className="animate-heartbeat mx-auto text-gray-400 my-16"
            src={Logo}
            alt="logo"
            width={255}
            height={255}
          />
        </div>
      </>
    </div>
  );
}

export function MyLoaderFinite({ height }: any) {
  return (
    <div
      className={`flex w-full ${
        height ? height : "h-screen"
      }  justify-center items-center`}
    >
      {/* <svg
        className="w-20 h-20 text-[#A8353A] animate-spin"
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-25"
          cx="25"
          cy="25"
          r="20"
          stroke="currentColor"
          strokeWidth="5"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M25 5a20 20 0 0110 37.32A20 20 0 0025 45V5z"
        />
      </svg> */}
      <svg
        width="58"
        height="58"
        viewBox="0 0 38 38"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
            <stop stopColor="#A8353A" stopOpacity="0" offset="0%" />
            <stop stopColor="#A8353A" stopOpacity=".631" offset="63.146%" />
            <stop stopColor="#A8353A" offset="100%" />
          </linearGradient>
        </defs>
        <g fill="none" fillRule="evenodd">
          <g transform="translate(1 1)">
            <path
              d="M36 18c0-9.94-8.06-18-18-18"
              id="Oval-2"
              stroke="url(#a)"
              strokeWidth="2"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 18 18"
                to="360 18 18"
                dur="0.9s"
                repeatCount="indefinite"
              />
            </path>
            <circle fill="#fff" cx="36" cy="18" r="1">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 18 18"
                to="360 18 18"
                dur="0.9s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        </g>
      </svg>
      {/* <p className="text-[#A8353A] ml-6 text-base">
        Hold on, getting transactions
      </p> */}
    </div>
  );
}
