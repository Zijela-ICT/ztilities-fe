import { useEffect, useRef, useState } from "react";

interface DropdownProps {
  toggleActions: (value: any) => void;
  contextMenuedActions?: (value: any) => void;
  contextMenued?: string | null;
  children: any;
  className?: string;
}

export default function ActionDropdownComponent({
  contextMenued,
  contextMenuedActions,
  toggleActions,
  children,
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        // toggleActions(null);
        contextMenuedActions(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggleActions, contextMenuedActions]);

  if (!isOpen) return null;

  return (
    <div className={className}>
      {contextMenued ? (
        <div
          ref={dropdownRef}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 bg-white z-40 border border-gray-200 rounded-2xl shadow-sm"
        >
          {children}
        </div>
      ) : (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-48 bg-white z-40 border border-gray-200 rounded-2xl shadow-sm"
        >
          {children}
        </div>
      )}
    </div>
  );
}
