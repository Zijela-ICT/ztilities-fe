import PermissionGuard from "./auth/permission-protected-components";

interface ButtonProps {
  onClick?: () => void;
  text: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  permissions?: string[];
}

export default function ButtonComponent({
  onClick,
  text,
  className = "",
  disabled = false,
  loading = false,
  permissions,
}: ButtonProps) {
  return (
    <PermissionGuard requiredPermissions={permissions}>
      <button
        disabled={disabled}
        onClick={onClick}
        className={`${className} w-full flex items-center justify-center h-[3.3rem] px-3 rounded-lg font-semibold  text-md  disabled:cursor-not-allowed disabled:text-gray-500 disabled:opacity-85 ${
          disabled ? "bg-gray-300" : "bg-[#A8353A]"
        }`}
      >
        {loading ? (
          <svg
            width="38"
            height="38"
            viewBox="0 0 38 38"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                x1="8.042%"
                y1="0%"
                x2="65.682%"
                y2="23.865%"
                id="a"
              >
                <stop stopColor="#000" stopOpacity="0" offset="0%" />
                <stop stopColor="#000" stopOpacity=".631" offset="63.146%" />
                <stop stopColor="#000" offset="100%" />
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
                <circle fill="#000" cx="36" cy="18" r="1">
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
        ) : (
          text
        )}
      </button>
    </PermissionGuard>
  );
}

interface ButtonProps {
  onClick?: () => void;
  text: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  permissions?: string[];
}

export function DropdownButtonComponent({
  onClick,
  text,
  className = "",
  loading = false,
  permissions,
}: ButtonProps) {
  return (
    <PermissionGuard requiredPermissions={permissions}>
      <button
        className={` ${className} w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100`}
        onClick={onClick}
      >
        {text}
      </button>
    </PermissionGuard>
  );
}
