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

export function MyLoaderFinite() {
  return (
    <>
      <svg
        className="absolute right-3 top-1/2 transform -translate-y-1/2"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
            <stop stopColor="#46AD3D" stopOpacity="0" offset="0%" />
            <stop stopColor="#46AD3D" stopOpacity=".631" offset="63.146%" />
            <stop stopColor="#46AD3D" offset="100%" />
          </linearGradient>
        </defs>
        <g fill="none" fillRule="evenodd">
          <g transform="translate(1 1)">
            <path d="M14 8c0-4.42-3.58-8-8-8" stroke="url(#a)" strokeWidth="2">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 8 8"
                to="360 8 8"
                dur="0.9s"
                repeatCount="indefinite"
              />
            </path>
            <circle fill="#46AD3D" cx="14" cy="8" r="1">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 8 8"
                to="360 8 8"
                dur="0.9s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        </g>
      </svg>
    </>
  );
}
