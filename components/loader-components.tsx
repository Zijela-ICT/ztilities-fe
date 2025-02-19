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
      className={`fixed top-0 left-0 w-full h-full flex justify-center items-center bg-white z-50`}
    >
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
    </div>
  );
}
